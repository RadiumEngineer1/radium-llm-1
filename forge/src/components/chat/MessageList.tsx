import { useEffect, useRef, memo } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useModelStore } from '../../store/modelStore';
import MessageBubble from './MessageBubble';
import EmptyState from './EmptyState';
import AbominationBackground from './AbominationBackground';
import AbominationGlitchOverlay from './AbominationGlitchOverlay';

// Memoize overlays so they never re-render from parent
const MemoBackground = memo(AbominationBackground);
const MemoOverlay = memo(AbominationGlitchOverlay);

// Memoize individual bubbles — only re-render if message content changes
const MemoBubble = memo(MessageBubble, (prev, next) => {
  return prev.message.content === next.message.content
    && prev.message.thinking === next.message.thinking
    && prev.message.ragSources === next.message.ragSources;
});

export default function MessageList() {
  const messages = useChatStore(s => s.messages);
  const isGenerating = useChatStore(s => s.isGenerating);
  const selectedModel = useModelStore(s => s.selectedModel);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAbomination = selectedModel.startsWith('abomination');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 relative overflow-hidden">
        {isAbomination && <MemoBackground hasMessages={false} />}
        {isAbomination && <MemoOverlay />}
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 relative">
      {isAbomination && <MemoBackground hasMessages={true} />}
      {isAbomination && <MemoOverlay />}
      <div className="relative z-10">
        {messages.map(msg => (
          <MemoBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
