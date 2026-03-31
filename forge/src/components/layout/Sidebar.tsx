import type { ReactNode } from 'react';
import StatusBar from '../sidebar/StatusBar';

export default function Sidebar({ children }: { children: ReactNode }) {
  return (
    <aside className="w-[290px] shrink-0 bg-surface border-r border-border flex flex-col h-screen relative z-10">
      {/* Brand */}
      <div className="px-4 pt-5 pb-3 border-b border-border">
        <h1 className="text-2xl font-ui font-bold text-accent tracking-[0.2em]">FORGE</h1>
        <p className="text-[10px] text-muted tracking-widest mt-0.5">RTX 4090 · LOCAL LLM · RAG</p>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {children}
      </div>

      {/* Status bar at bottom */}
      <StatusBar />
    </aside>
  );
}
