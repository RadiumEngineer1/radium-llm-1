import { useChatStore } from '../store/chatStore';
import { useModelStore } from '../store/modelStore';
import { useSettingsStore } from '../store/settingsStore';
import { useRagStore } from '../store/ragStore';
import { streamChat } from '../lib/ollama';
import { searchDocs } from '../lib/rag';
import { useToastStore } from '../components/ui/Toast';
import type { RagChunk } from '../types';

export function useSendMessage() {
  const addMessage = useChatStore(s => s.addMessage);
  const updateLastAssistantMessage = useChatStore(s => s.updateLastAssistantMessage);
  const setGenerating = useChatStore(s => s.setGenerating);
  const messages = useChatStore(s => s.messages);
  const selectedModel = useModelStore(s => s.selectedModel);
  const getActiveEmbedModel = useModelStore(s => s.getActiveEmbedModel);
  const params = useSettingsStore(s => s.params);
  const systemPrompt = useSettingsStore(s => s.systemPrompt);
  const ragEnabled = useRagStore(s => s.enabled);
  const ragDocs = useRagStore(s => s.docs);
  const addToast = useToastStore(s => s.addToast);

  const send = async (userText: string) => {
    if (!userText.trim()) return;
    if (!selectedModel) {
      addToast('No model selected. Pick a model from the sidebar.', 'error');
      return;
    }

    // Add user message
    addMessage({ role: 'user', content: userText.trim() });

    // RAG context
    let ragContext = '';
    let ragChunks: RagChunk[] = [];
    if (ragEnabled && ragDocs.length > 0) {
      try {
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
    const systemMsg = { role: 'system', content: systemPrompt + ragContext };
    const history = messages
      .filter(m => m.role !== 'system')
      .slice(-40)
      .map(m => ({ role: m.role, content: m.content }));
    const allMessages = [systemMsg, ...history, { role: 'user', content: userText.trim() }];

    // Start streaming
    const controller = new AbortController();
    setGenerating(true, controller);
    const assistantMsg = addMessage({ role: 'assistant', content: '' });

    let fullText = '';
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
        fullText += chunk;
        updateLastAssistantMessage(fullText);
      }

      // Attach RAG sources to the final message
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
        if (!fullText) {
          updateLastAssistantMessage('[Generation cancelled]');
        }
      } else {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        addToast(`Generation failed: ${msg}`, 'error');
        if (!fullText) {
          updateLastAssistantMessage(`[Error: ${msg}]`);
        }
      }
    } finally {
      setGenerating(false);
    }
  };

  return send;
}
