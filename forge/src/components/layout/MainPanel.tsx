import type { ReactNode } from 'react';

export default function MainPanel({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
      {children}
    </main>
  );
}
