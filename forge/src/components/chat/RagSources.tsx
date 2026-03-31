import { useState } from 'react';
import type { RagChunk } from '../../types';
import { ChevronDown, Search } from 'lucide-react';

export default function RagSources({ chunks }: { chunks: RagChunk[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 border-t border-border pt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[10px] text-muted hover:text-[rgb(var(--color-text))] transition-colors"
      >
        <Search size={10} />
        <span>{chunks.length} RETRIEVED CHUNK{chunks.length !== 1 ? 'S' : ''}</span>
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {chunks.map((chunk, i) => (
            <div key={i} className="border-l-2 border-accent pl-2 py-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-accent">{chunk.source}</span>
                <span className="text-[10px] text-muted">score: {chunk.score.toFixed(3)}</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">
                {chunk.text.slice(0, 300)}{chunk.text.length > 300 ? '...' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
