import { useState } from 'react';
import { ChevronDown, Brain } from 'lucide-react';

interface ThinkingBlockProps {
  thinking: string;
  isStreaming: boolean;
}

export default function ThinkingBlock({ thinking, isStreaming }: ThinkingBlockProps) {
  const [open, setOpen] = useState(false);

  const lines = thinking.split('\n').length;
  const chars = thinking.length;

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-surface3/50 border border-border hover:border-muted transition-colors"
      >
        <Brain size={14} className={`text-accent2 ${isStreaming ? 'animate-pulse' : ''}`} />
        <span className="text-xs text-accent2 font-medium">
          {isStreaming ? 'Thinking...' : 'Thought process'}
        </span>
        {!isStreaming && (
          <span className="text-[10px] text-muted font-mono ml-1">
            {lines} lines · {chars} chars
          </span>
        )}
        {isStreaming && (
          <span className="inline-flex gap-0.5 ml-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1 h-1 rounded-full bg-accent2 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        )}
        <ChevronDown
          size={12}
          className={`text-muted ml-auto transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="mt-1 px-3 py-2 rounded-lg bg-black/20 border border-border/50 max-h-[400px] overflow-y-auto">
          <pre className="text-[11px] text-muted leading-relaxed whitespace-pre-wrap font-mono">
            {thinking}
            {isStreaming && (
              <span className="inline-block w-1.5 h-3 bg-accent2 ml-0.5 animate-pulse" />
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
