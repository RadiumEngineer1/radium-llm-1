import type { ReactNode } from 'react';
import StatusBar from '../sidebar/StatusBar';

export default function Sidebar({ children }: { children: ReactNode }) {
  return (
    <aside className="w-[280px] shrink-0 bg-surface border-r border-border flex flex-col h-screen relative z-10 overflow-hidden">
      {/* Brand */}
      <div className="px-3 pt-4 pb-2 border-b border-border">
        <h1 className="text-xl font-ui font-bold text-accent tracking-[0.2em]">FORGE</h1>
        <p className="text-[9px] text-muted tracking-widest mt-0.5">RTX 4090 · LOCAL LLM · RAG</p>
      </div>

      {/* Scrollable sections — no horizontal overflow */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-3">
        {children}
      </div>

      {/* Status bar pinned at bottom */}
      <StatusBar />
    </aside>
  );
}
