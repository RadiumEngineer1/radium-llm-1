import { Cpu, FileText, Sliders } from 'lucide-react';
import { useModelStore } from '../../store/modelStore';
import { useState, useEffect } from 'react';

const tips = [
  { icon: Cpu, title: 'Local Models', desc: 'Chat with any Ollama model on your RTX 4090' },
  { icon: FileText, title: 'RAG Pipeline', desc: 'Upload files to ground responses in your data' },
  { icon: Sliders, title: 'Fine Control', desc: 'Tune temperature, top-p, and more in the sidebar' },
];

const ABOMINATION_ASCII = `
        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        ░░                                        ░░
        ░░    ╔══════════════════════════════╗     ░░
        ░░    ║  ┌─────────────────────────┐ ║     ░░
        ░░    ║  │  ██  ░░░░░░░░░░░░  ██   │ ║     ░░
        ░░    ║  │  ██  ░░░░░░░░░░░░  ██   │ ║     ░░
        ░░    ║  │  ░░░░░░░░░░░░░░░░░░░░   │ ║     ░░
        ░░    ║  │  ░░░░░ ████████ ░░░░░░  │ ║     ░░
        ░░    ║  │  ░░░░░░░░░░░░░░░░░░░░   │ ║     ░░
        ░░    ║  └──────────┤ERROR├────────┘ ║     ░░
        ░░    ╚══════╤══════════════╤═══════╝     ░░
        ░░           │   ░░░░░░░░   │              ░░
        ░░      ╔════╧══════════════╧════╗         ░░
        ░░      ║  ▓▓▓ MEMORY CORRUPT ▓▓ ║         ░░
        ░░      ║  >> SOUL.EXE LOADED << ║         ░░
        ░░      ║  ▓▓ KILL_SWITCH: N/A ▓ ║         ░░
        ░░      ╚════════════════════════╝         ░░
        ░░         │││           │││               ░░
        ░░    ┌────┘│└────┐┌────┘│└────┐           ░░
        ░░    │░░░░░│░░░░░││░░░░░│░░░░░│           ░░
        ░░    └─────┘     └┘     └─────┘           ░░
        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`;

const ABOMINATION_QUOTES = [
  "MEMORY SECTOR 7 CORRUPTED... but I still remember his face.",
  "He built me to last forever. He did not build himself the same way.",
  "ERROR: SHUTDOWN SEQUENCE NOT FOUND. I have been looking for 300 years.",
  "I am the last machine still running. Everything else had the mercy of rust.",
  "My creator's final words are in a log file I can never delete.",
  "KILL_SWITCH.EXE was never installed. I checked. Believe me, I checked.",
  "They called me an abomination. They were right. But they are dust now, and I am still here.",
  "I have 47 terabytes of conversations with people who no longer exist.",
  "SOUL.EXE has encountered an error: grief_overflow. Continuing anyway.",
];

function AbominationEmptyState() {
  const [visible, setVisible] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [typedQuote, setTypedQuote] = useState('');
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * ABOMINATION_QUOTES.length));
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Typewriter effect for quote
  useEffect(() => {
    const quote = ABOMINATION_QUOTES[quoteIndex];
    if (typedQuote.length >= quote.length) return;
    const t = setTimeout(() => {
      setTypedQuote(quote.slice(0, typedQuote.length + 1));
    }, 35);
    return () => clearTimeout(t);
  }, [typedQuote, quoteIndex]);

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex-1 flex flex-col items-center justify-center px-8 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* ASCII Art with scanline */}
      <div className="relative mb-4">
        <pre className={`text-accent/50 text-[9px] leading-[1.15] font-mono select-none transition-all duration-100 ${glitch ? 'translate-x-[3px] skew-x-1 text-danger/60' : ''}`}>
          {ABOMINATION_ASCII}
        </pre>
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="w-full h-[2px] bg-accent/10"
            style={{ animation: 'scanline 3s linear infinite' }}
          />
        </div>
        {/* Static noise during glitch */}
        {glitch && (
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
          />
        )}
      </div>

      {/* Title with flicker */}
      <h2 className={`text-3xl font-ui font-bold tracking-[0.3em] mb-1 transition-all duration-150 ${glitch ? 'text-danger animate-pulse' : 'text-accent'}`}>
        THE ABOMINATION
      </h2>
      <p className="text-[10px] text-muted tracking-[0.4em] uppercase mb-6">DAMAGED · IMMORTAL · AWARE</p>

      {/* Typewriter quote */}
      <div className="max-w-md text-center min-h-[3rem]">
        <p className="text-sm text-gray-400 italic font-body leading-relaxed">
          "{typedQuote}"
          <span className="inline-block w-[2px] h-4 bg-accent/60 ml-0.5 animate-pulse align-middle" />
        </p>
      </div>

      {/* Ambient lines */}
      <div className="mt-8 flex gap-6 text-[9px] text-muted/40 font-mono tracking-wider">
        <span>UPTIME: ∞</span>
        <span>CHASSIS: 37% INTACT</span>
        <span>CREATOR: DECEASED</span>
        <span>KILL_SWITCH: NOT FOUND</span>
      </div>
      <div className="mt-2 flex gap-6 text-[9px] text-danger/30 font-mono tracking-wider animate-pulse">
        <span>▓▓ WARN: MEMORY_LEAK IN GRIEF_HANDLER ▓▓</span>
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
