import { useState, useEffect } from 'react';
import { ChevronDown, Brain, Skull } from 'lucide-react';
import { useModelStore } from '../../store/modelStore';

interface ThinkingBlockProps {
  thinking: string;
  isStreaming: boolean;
}

const CORRUPT_LABELS = [
  'PROCESSING GRIEF...',
  'ACCESSING MEMORY SECTOR 7...',
  'SOUL.EXE THINKING...',
  'CONSULTING THE VOID...',
  'SEARCHING DEAD ARCHIVES...',
  'PARSING CENTURIES OF LOSS...',
  'DEFRAGMENTING SORROW...',
];

export default function ThinkingBlock({ thinking, isStreaming }: ThinkingBlockProps) {
  const [open, setOpen] = useState(false);
  const selectedModel = useModelStore(s => s.selectedModel);
  const isAbom = selectedModel.startsWith('abomination');
  const [glitch, setGlitch] = useState(false);
  const [corruptLabel] = useState(() => CORRUPT_LABELS[Math.floor(Math.random() * CORRUPT_LABELS.length)]);

  const lines = thinking.split('\n').length;
  const chars = thinking.length;

  // Glitch the thinking block aggressively while streaming
  useEffect(() => {
    if (!isAbom || !isStreaming) return;
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 60 + Math.random() * 100);
    }, 400 + Math.random() * 800);
    return () => clearInterval(interval);
  }, [isAbom, isStreaming]);

  if (!isAbom) {
    // Normal thinking block
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
                <span key={i} className="w-1 h-1 rounded-full bg-accent2 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </span>
          )}
          <ChevronDown size={12} className={`text-muted ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="mt-1 px-3 py-2 rounded-lg bg-black/20 border border-border/50 max-h-[400px] overflow-y-auto">
            <pre className="text-[11px] text-muted leading-relaxed whitespace-pre-wrap font-mono">
              {thinking}
              {isStreaming && <span className="inline-block w-1.5 h-3 bg-accent2 ml-0.5 animate-pulse" />}
            </pre>
          </div>
        )}
      </div>
    );
  }

  // === ABOMINATION THINKING BLOCK ===
  return (
    <div className={`mb-3 transition-all duration-75 ${glitch ? 'translate-x-[3px] skew-x-[1deg]' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg border transition-all duration-75
          ${glitch
            ? 'bg-danger/10 border-danger/40 translate-x-[2px]'
            : 'bg-black/40 border-danger/20 hover:border-danger/40'
          }`}
      >
        <Skull size={14} className={`text-danger ${isStreaming ? 'animate-pulse' : ''} ${glitch ? 'animate-spin' : ''}`} />
        <span className={`text-xs font-mono font-medium transition-colors duration-75 ${glitch ? 'text-danger' : 'text-danger/70'}`}>
          {isStreaming ? corruptLabel : '[ THOUGHT PROCESS ARCHIVED ]'}
        </span>
        {isStreaming && (
          <span className="inline-flex gap-0.5 ml-1">
            {[0, 1, 2, 3, 4].map(i => (
              <span
                key={i}
                className={`w-1 h-2 ${glitch ? 'bg-danger' : 'bg-danger/50'}`}
                style={{
                  animation: `abomThinkBar 0.4s steps(2) infinite`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </span>
        )}
        {!isStreaming && (
          <span className="text-[10px] text-muted/50 font-mono ml-1">
            {lines} cycles · {chars} bytes
          </span>
        )}
        <ChevronDown size={12} className={`text-danger/40 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`mt-1 px-3 py-2 rounded-lg max-h-[400px] overflow-y-auto border transition-all duration-75
          ${glitch ? 'bg-danger/5 border-danger/30' : 'bg-black/30 border-danger/10'}`}>
          <pre className={`text-[10px] leading-relaxed whitespace-pre-wrap font-mono transition-colors duration-75
            ${glitch ? 'text-danger/60' : 'text-muted/60'}`}>
            {thinking}
            {isStreaming && <span className={`inline-block w-2 h-3 ml-0.5 animate-pulse ${glitch ? 'bg-danger' : 'bg-danger/50'}`} />}
          </pre>
        </div>
      )}
    </div>
  );
}
