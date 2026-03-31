import { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useModelStore } from '../../store/modelStore';
import MessageBubble from './MessageBubble';
import EmptyState from './EmptyState';
import AbominationBackground from './AbominationBackground';

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
        {isAbomination && <AbominationBackground hasMessages={false} />}
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 relative">
      {isAbomination && <AbominationBackground hasMessages={true} />}
      <div className="relative z-10">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
