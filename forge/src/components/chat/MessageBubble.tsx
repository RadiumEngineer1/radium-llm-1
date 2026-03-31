import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { ChatMessage } from '../../types';
import { useChatStore } from '../../store/chatStore';
import LoadingDots from './LoadingDots';
import RagSources from './RagSources';
import IconButton from '../ui/IconButton';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isGenerating = useChatStore(s => s.isGenerating);
  const messages = useChatStore(s => s.messages);
  const isUser = message.role === 'user';
  const isLastAssistant = !isUser && messages[messages.length - 1]?.id === message.id;
  const isStreaming = isLastAssistant && isGenerating;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div
        className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed relative ${
          isUser
            ? 'bg-accent text-white rounded-br-sm'
            : 'bg-surface2 border border-border text-gray-200 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none [&_pre]:bg-black/40 [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:text-accent2 [&_code]:text-xs [&_code]:font-mono">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {message.content}
            </ReactMarkdown>
            {isStreaming && !message.content && <LoadingDots />}
            {isStreaming && message.content && (
              <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-pulse" />
            )}
          </div>
        )}

        {/* Copy button */}
        {!isUser && message.content && (
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconButton onClick={handleCopy} className="bg-surface3 border border-border shadow-md">
              {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            </IconButton>
          </div>
        )}

        {/* RAG Sources */}
        {!isUser && message.ragSources && message.ragSources.length > 0 && (
          <RagSources chunks={message.ragSources} />
        )}
      </div>
    </div>
  );
}
