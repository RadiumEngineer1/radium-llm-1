import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { useModelStore } from '../store/modelStore';
import { useSettingsStore } from '../store/settingsStore';
import { useRagStore } from '../store/ragStore';
import { streamChat } from '../lib/ollama';
import { searchDocs } from '../lib/rag';
import { useToastStore } from '../components/ui/Toast';
import type { RagChunk } from '../types';

export function useSendMessage() {
  const addToast = useToastStore(s => s.addToast);

  // useCallback with no deps — reads everything from stores imperatively
  // so this hook never causes re-renders in the consuming component
  const send = useCallback(async (userText: string) => {
    if (!userText.trim()) return;

    const { addMessage, updateLastAssistantMessage, updateLastAssistantThinking, setGenerating } = useChatStore.getState();
    const { selectedModel } = useModelStore.getState();
    const { params, systemPrompt } = useSettingsStore.getState();
    const { enabled: ragEnabled, docs: ragDocs } = useRagStore.getState();
    const messages = useChatStore.getState().messages;

    if (!selectedModel) {
      addToast('No model selected. Pick a model from the sidebar.', 'error');
      return;
    }

    addMessage({ role: 'user', content: userText.trim() });

    // RAG context
    let ragContext = '';
    let ragChunks: RagChunk[] = [];
    if (ragEnabled && ragDocs.length > 0) {
      try {
        const getActiveEmbedModel = useModelStore.getState().getActiveEmbedModel;
        ragChunks = await searchDocs(userText, ragDocs, getActiveEmbedModel(), params.top_k);
        if (ragChunks.length > 0) {
          ragContext = '\n\n## Retrieved Context\n' +
            ragChunks.map((c, i) => `[${i + 1}] (${c.source}): ${c.text}`).join('\n\n');
        }
      } catch (err) {
        addToast(`RAG search failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
      }
    }

    // Build message history
    const systemContent = systemPrompt + ragContext;
    const history = messages
      .filter(m => m.role !== 'system')
      .slice(-40)
      .map(m => ({ role: m.role, content: m.content }));
    const allMessages = [
      ...(systemContent.trim() ? [{ role: 'system', content: systemContent }] : []),
      ...history,
      { role: 'user', content: userText.trim() },
    ];

    // Start streaming
    const controller = new AbortController();
    setGenerating(true, controller);
    const assistantMsg = addMessage({ role: 'assistant', content: '' });

    let thinkingText = '';
    let responseText = '';
    try {
      for await (const chunk of streamChat({
        model: selectedModel,
        messages: allMessages,
        temperature: params.temperature,
        top_p: params.top_p,
        num_predict: params.num_predict,
        repeat_penalty: params.repeat_penalty,
        signal: controller.signal,
      })) {
        if (chunk.isThinking) {
          thinkingText += chunk.content;
          updateLastAssistantThinking(thinkingText);
        } else {
          responseText += chunk.content;
          updateLastAssistantMessage(responseText);
        }
      }
      const fullText = responseText;

      if (!fullText.trim()) {
        if (thinkingText.trim()) {
          updateLastAssistantMessage('*[The model thought but produced no visible response. Try again.]*');
        } else {
          useChatStore.setState(state => ({
            messages: state.messages.filter(m => m.id !== assistantMsg.id),
          }));
          addToast('Model returned an empty response. Try again or switch models.', 'error');
        }
        return;
      }

      if (ragChunks.length > 0) {
        useChatStore.setState(state => {
          const msgs = [...state.messages];
          const idx = msgs.findIndex(m => m.id === assistantMsg.id);
          if (idx !== -1) {
            msgs[idx] = { ...msgs[idx], ragSources: ragChunks };
          }
          return { messages: msgs };
        });
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        if (!responseText) {
          updateLastAssistantMessage('[Generation cancelled]');
        }
      } else {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        addToast(`Generation failed: ${msg}`, 'error');
        if (!responseText) {
          updateLastAssistantMessage(`[Error: ${msg}]`);
        }
      }
    } finally {
      setGenerating(false);
    }
  }, [addToast]);

  return send;
}
