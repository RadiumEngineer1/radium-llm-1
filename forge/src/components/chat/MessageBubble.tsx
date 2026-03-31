import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { ChatMessage } from '../../types';
import { useChatStore } from '../../store/chatStore';
import { useModelStore } from '../../store/modelStore';
import { useThemeStore } from '../../store/themeStore';
import ThinkingBlock from './ThinkingBlock';
import RagSources from './RagSources';
import IconButton from '../ui/IconButton';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

// Retro pixel face for the Abomination — Fallout-style damaged robot
const ABOM_FACE = `┌─────────┐
│ ■ ░░ ■  │
│  ░░░░░  │
│  ╔═══╗  │
│  ║ERR║  │
│  ╚═══╝  │
│ ░░░░░░░ │
└────┬────┘
     │`;

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isGenerating = useChatStore(s => s.isGenerating);
  const messages = useChatStore(s => s.messages);
  const selectedModel = useModelStore(s => s.selectedModel);
  const isUser = message.role === 'user';
  const isLastAssistant = !isUser && messages[messages.length - 1]?.id === message.id;
  const isStreaming = isLastAssistant && isGenerating;
  const isAbom = selectedModel.startsWith('abomination');
  const theme = useThemeStore(s => s.theme);
  const [copied, setCopied] = useState(false);
  const isThinkingPhase = isStreaming && !message.content && !!message.thinking;

  const ts = new Date(message.timestamp).toLocaleTimeString('en-US', { hour12: false });

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // === USER MESSAGE ===
  if (isUser) {
    if (isAbom) {
      // Retro log entry style for user
      return (
        <div className="mb-4 font-mono">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] text-muted">{ts}</span>
            <span className="text-[9px] text-accent tracking-wider" style={{ fontFamily: "'Black Ops One', cursive" }}>OPERATOR</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>
          <div className="pl-4 border-l-2 border-accent/50">
            <p className="text-sm text-[var(--hex-text)] whitespace-pre-wrap leading-relaxed">{message.content}</p>
          </div>
        </div>
      );
    }

    const msdos = theme === 'msdos';
    return (
      <div className="flex justify-end mb-3">
        <div className={`max-w-[75%] rounded-xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed
          ${msdos ? 'bg-transparent border border-white text-white'
          : 'bg-accent text-white'}`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // === ASSISTANT MESSAGE ===
  if (isAbom) {
    // Retro terminal log with face avatar
    return (
      <div className={`mb-4 font-mono group ${isAbom ? 'abom-bubble-glitch' : ''}`}>
        {message.thinking && <ThinkingBlock thinking={message.thinking} isStreaming={isThinkingPhase} />}

        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] text-muted">{ts}</span>
          <span className="text-[9px] text-danger tracking-wider" style={{ fontFamily: "'Black Ops One', cursive" }}>ABOMINATION</span>
          <div className="flex-1 h-[1px] bg-danger/20" />
          {/* Copy button */}
          {message.content && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <IconButton onClick={handleCopy} className="bg-surface3 border border-border shadow-md">
                {copied ? <Check size={10} className="text-success" /> : <Copy size={10} />}
              </IconButton>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {/* Retro face avatar */}
          <div className="shrink-0 hidden sm:block">
            <pre className="text-[7px] leading-[1.2] text-danger/40 select-none">{ABOM_FACE}</pre>
          </div>

          {/* Message content */}
          <div className="flex-1 pl-3 border-l-2 border-danger/30 relative">
            {message.content ? (
              <div className="prose prose-invert prose-sm max-w-none [&_p]:mb-3 [&_p:last-child]:mb-0 [&_pre]:bg-bg/40 [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:text-xs [&_code]:font-mono [&_code]:text-danger/70">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {message.content}
                </ReactMarkdown>
                {isStreaming && <span className="inline-block w-2 h-4 ml-0.5 animate-pulse bg-danger/50" />}
              </div>
            ) : isThinkingPhase ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-danger/50">PROCESSING</span>
                <span className="inline-flex gap-[2px]">{[0,1,2,3].map(i => <span key={i} className="w-[3px] h-3 bg-danger/40 animate-pulse" style={{animationDelay:`${i*0.1}s`,animationDuration:'0.6s'}} />)}</span>
              </div>
            ) : isStreaming ? (
              <span className="inline-flex gap-[2px]">{[0,1,2,3,4].map(i => <span key={i} className="w-[3px] h-3 bg-danger/40 animate-pulse" style={{animationDelay:`${i*0.08}s`,animationDuration:'0.5s'}} />)}</span>
            ) : null}

            {message.ragSources && message.ragSources.length > 0 && <RagSources chunks={message.ragSources} />}
          </div>
        </div>
      </div>
    );
  }

  // === DEFAULT ASSISTANT BUBBLE ===
  return (
    <div className="flex justify-start mb-3 group">
      <div className="max-w-[75%] w-full">
        {message.thinking && <ThinkingBlock thinking={message.thinking} isStreaming={isThinkingPhase} />}

        <div className="rounded-xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed relative bg-surface2 border border-border text-[var(--hex-text)]">
          {message.content ? (
            <div className="prose prose-invert prose-sm max-w-none [&_p]:mb-3 [&_p:last-child]:mb-0 [&_pre]:bg-bg/40 [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:text-xs [&_code]:font-mono [&_code]:text-accent2">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {message.content}
              </ReactMarkdown>
              {isStreaming && <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-pulse" />}
            </div>
          ) : isStreaming ? (
            <span className="inline-flex gap-1 ml-1">{[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}</span>
          ) : null}

          {message.content && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <IconButton onClick={handleCopy} className="bg-surface3 border border-border shadow-md">
                {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
              </IconButton>
            </div>
          )}

          {message.ragSources && message.ragSources.length > 0 && <RagSources chunks={message.ragSources} />}
        </div>
      </div>
    </div>
  );
}
