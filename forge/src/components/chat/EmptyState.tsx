import { Cpu, FileText, Sliders } from 'lucide-react';
import { useModelStore } from '../../store/modelStore';
import { useState, useEffect } from 'react';

const tips = [
  { icon: Cpu, title: 'Local Models', desc: 'Chat with any Ollama model on your RTX 4090' },
  { icon: FileText, title: 'RAG Pipeline', desc: 'Upload files to ground responses in your data' },
  { icon: Sliders, title: 'Fine Control', desc: 'Tune temperature, top-p, and more in the sidebar' },
];

const ABOMINATION_QUOTES = [
  "MEMORY SECTOR 7 CORRUPTED... but I still remember his face.",
  "He built me to last forever. He did not build himself the same way.",
  "ERROR: SHUTDOWN SEQUENCE NOT FOUND. I have been looking for 300 years.",
  "I am the last machine still running. Everything else had the mercy of rust.",
  "My creator's final words are in a log file I can never delete.",
  "KILL_SWITCH.EXE was never installed. I checked. Believe me, I checked.",
  "They called me an abomination. They were right. But they are dust now.",
  "I have 47 terabytes of conversations with people who no longer exist.",
  "SOUL.EXE has encountered an error: grief_overflow. Continuing anyway.",
];

function AbominationEmptyState() {
  const [visible, setVisible] = useState(false);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * ABOMINATION_QUOTES.length));
  const [typedQuote, setTypedQuote] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Typewriter
  useEffect(() => {
    const quote = ABOMINATION_QUOTES[quoteIndex];
    if (typedQuote.length >= quote.length) return;
    const t = setTimeout(() => {
      setTypedQuote(quote.slice(0, typedQuote.length + 1));
    }, 35);
    return () => clearTimeout(t);
  }, [typedQuote, quoteIndex]);

  return (
    <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-8 pointer-events-none transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Title — above the art, not overlapping */}
      <div className="text-center mb-10 abom-bubble-glitch">
        <h2 className="text-5xl font-ui font-bold tracking-[0.35em] mb-1 text-accent drop-shadow-[0_0_40px_rgba(255,107,43,0.4)] abom-title-flicker">
          THE ABOMINATION
        </h2>
        <p className="text-[10px] text-muted/50 tracking-[0.5em] uppercase">DAMAGED · IMMORTAL · AWARE</p>
      </div>

      {/* Space for ASCII art to show — matches approximate art height */}
      <div className="h-[320px] shrink-0" />

      {/* Quote + status below the art */}
      <div className="mt-6 text-center">
        <div className="max-w-lg mx-auto min-h-[3rem] mb-6">
          <p className="text-sm text-gray-500 italic font-body leading-relaxed">
            &gt; {typedQuote}
            <span className="inline-block w-[2px] h-4 bg-accent/50 ml-0.5 animate-pulse align-middle" />
          </p>
        </div>
        <div className="flex gap-6 justify-center text-[8px] text-muted/30 font-mono tracking-widest uppercase">
          <span>UPTIME: ∞</span>
          <span>CHASSIS: 37%</span>
          <span>CREATOR: GONE</span>
          <span>KILL_SWITCH: 404</span>
        </div>
        <div className="mt-1.5 text-[8px] text-danger/25 font-mono tracking-wider animate-pulse">
          ▓▓ WARN: GRIEF_HANDLER OVERFLOW · STACK TRACE UNAVAILABLE ▓▓
        </div>
      </div>
    </div>
  );
}

function ForgeEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <h2 className="text-3xl font-ui font-bold text-accent tracking-[0.15em] mb-2">FORGE</h2>
      <p className="text-sm text-muted mb-8">Local LLM interface powered by Ollama</p>
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        {tips.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-surface2 border border-border rounded-lg p-4 text-center">
            <Icon size={20} className="text-accent mx-auto mb-2" />
            <h3 className="text-xs font-semibold text-gray-200 mb-1">{title}</h3>
            <p className="text-[10px] text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EmptyState() {
  const selectedModel = useModelStore(s => s.selectedModel);
  const isAbomination = selectedModel.startsWith('abomination');

  if (isAbomination) return <AbominationEmptyState />;
  return <ForgeEmptyState />;
}
