import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { ChatMessage } from '../../types';
import { useChatStore } from '../../store/chatStore';
import { useModelStore } from '../../store/modelStore';
import ThinkingBlock from './ThinkingBlock';
import RagSources from './RagSources';
import IconButton from '../ui/IconButton';
import { Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isGenerating = useChatStore(s => s.isGenerating);
  const messages = useChatStore(s => s.messages);
  const selectedModel = useModelStore(s => s.selectedModel);
  const isUser = message.role === 'user';
  const isLastAssistant = !isUser && messages[messages.length - 1]?.id === message.id;
  const isStreaming = isLastAssistant && isGenerating;
  const isAbom = selectedModel.startsWith('abomination');
  const [copied, setCopied] = useState(false);
  const [glitch, setGlitch] = useState(false);

  const isThinkingPhase = isStreaming && !message.content && !!message.thinking;

  // Glitch assistant bubbles in Abomination mode
  useEffect(() => {
    if (!isAbom || isUser) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 50 + Math.random() * 100);
      }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isAbom, isUser]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // === USER BUBBLE ===
  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className={`max-w-[75%] rounded-xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed
          ${isAbom ? 'bg-accent/80 text-white border border-accent/30' : 'bg-accent text-white'}`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // === ASSISTANT BUBBLE ===
  return (
    <div className={`flex justify-start mb-3 group transition-all duration-75
      ${glitch ? 'translate-x-[4px]' : ''}`}>
      <div className="max-w-[75%] w-full">
        {/* Thinking block */}
        {message.thinking && (
          <ThinkingBlock thinking={message.thinking} isStreaming={isThinkingPhase} />
        )}

        {/* Response bubble */}
        <div className={`rounded-xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed relative transition-all duration-75
          ${isAbom
            ? glitch
              ? 'bg-danger/10 border border-danger/30 text-danger/80 skew-x-[0.5deg]'
              : 'bg-black/40 border border-danger/10 text-gray-300'
            : 'bg-surface2 border border-border text-gray-200'
          }`}>

          {/* Abomination: glitch corruption line across bubble */}
          {isAbom && glitch && (
            <div className="absolute left-0 right-0 h-[2px] bg-danger/40 z-20"
              style={{ top: `${20 + Math.random() * 60}%` }} />
          )}

          {message.content ? (
            <div className={`prose prose-invert prose-sm max-w-none [&_pre]:bg-black/40 [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:text-xs [&_code]:font-mono
              ${isAbom ? '[&_code]:text-danger/70' : '[&_code]:text-accent2'}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {message.content}
              </ReactMarkdown>
              {isStreaming && isAbom && (
                <span className={`inline-block w-2 h-4 ml-0.5 animate-pulse ${glitch ? 'bg-danger' : 'bg-danger/50'}`} />
              )}
              {isStreaming && !isAbom && (
                <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-pulse" />
              )}
            </div>
          ) : isThinkingPhase ? (
            <div className="flex items-center gap-2 text-xs">
              {isAbom ? (
                <>
                  <span className={`font-mono ${glitch ? 'text-danger' : 'text-danger/50'}`}>
                    AWAITING RESPONSE FROM VOID
                  </span>
                  <span className="inline-flex gap-[2px]">
                    {[0, 1, 2, 3].map(i => (
                      <span key={i} className="w-[3px] h-3 bg-danger/40 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s`, animationDuration: '0.6s' }} />
                    ))}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-muted">Waiting for response</span>
                  <span className="inline-flex gap-1 ml-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                </>
              )}
            </div>
          ) : isStreaming ? (
            isAbom ? (
              <span className="inline-flex gap-[2px]">
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} className="w-[3px] h-3 bg-danger/40 animate-pulse"
                    style={{ animationDelay: `${i * 0.08}s`, animationDuration: '0.5s' }} />
                ))}
              </span>
            ) : (
              <span className="inline-flex gap-1 ml-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            )
          ) : null}

          {/* Copy button */}
          {message.content && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <IconButton onClick={handleCopy} className="bg-surface3 border border-border shadow-md">
                {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
              </IconButton>
            </div>
          )}

          {/* RAG Sources */}
          {message.ragSources && message.ragSources.length > 0 && (
            <RagSources chunks={message.ragSources} />
          )}
        </div>
      </div>
    </div>
  );
}
