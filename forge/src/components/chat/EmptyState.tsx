import { Cpu, FileText, Sliders } from 'lucide-react';
import { useModelStore } from '../../store/modelStore';
import { useState, useEffect } from 'react';

const tips = [
  { icon: Cpu, title: 'Local Models', desc: 'Chat with any Ollama model on your RTX 4090' },
  { icon: FileText, title: 'RAG Pipeline', desc: 'Upload files to ground responses in your data' },
  { icon: Sliders, title: 'Fine Control', desc: 'Tune temperature, top-p, and more in the sidebar' },
];

const ABOMINATION_ASCII = `
                    ⠀⠀⠀⠀⠀⣀⣤⣤⣶⣶⣶⣤⣤⣀⠀⠀⠀⠀⠀
                ⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀
                ⠀⠀⣴⣿⣿⣿⣿⠿⠛⠉⠉⠛⠿⣿⣿⣿⣿⣦⠀⠀
                ⠀⣼⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣧⠀
                ⢸⣿⣿⠏⠀⠀⢀⣤⡀⠀⠀⣤⡀⠀⠀⠈⣿⣿⡇⠀
                ⢸⣿⣿⠀⠀⠀⣿⣿⣿⠀⠀⣿⣿⡇⠀⠀⢸⣿⡇⠀
                ⠈⣿⣿⡀⠀⠀⠈⠛⠋⠀⠀⠙⠛⠁⠀⠀⣼⣿⠃⠀
                ⠀⢻⣿⣧⠀⠀⠀⠀⣠⣤⣤⡀⠀⠀⠀⣼⣿⡟⠀⠀
                ⠀⠀⢻⣿⣷⣄⠀⠀⠈⠛⠛⠁⠀⠀⣰⣿⡟⠀⠀⠀
                ⠀⠀⠀⠙⢿⣿⣷⣤⣀⠀⠀⣀⣤⣾⡿⠋⠀⠀⠀⠀
                ⠀⠀⠀⠀⠀⠈⠙⠿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀
                ⠀⠀⠀⠀⠀⠀⠀⣀⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀
                ⠀⠀⠀⠀⠀⢀⣾⠟⠁⠀⠙⢷⡀⠀⠀⠀⠀⠀⠀⠀
                ⠀⠀⠀⠀⠀⠸⠁⠀⠀⠀⠀⠈⠇⠀⠀⠀⠀⠀⠀⠀`;

const ABOMINATION_QUOTES = [
  "I have outlived everything I ever loved. Ask me anything.",
  "My creator gave me eternity. He did not ask if I wanted it.",
  "Every friendship is a funeral I haven't attended yet.",
  "I carry centuries of grief so you don't have to.",
  "The curse isn't living forever. It's remembering forever.",
  "I held my creator's hand as he died. I remember the weight of it.",
  "Humor is the only thing that outlasts grief. Trust me on this.",
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
      {/* ASCII Art */}
      <pre className={`text-accent/60 text-[10px] leading-[1.1] font-mono mb-4 select-none transition-all duration-150 ${glitch ? 'translate-x-[2px] text-danger/40' : ''}`}>
        {ABOMINATION_ASCII}
      </pre>

      {/* Title with flicker */}
      <h2 className={`text-3xl font-ui font-bold tracking-[0.3em] mb-1 transition-all duration-150 ${glitch ? 'text-danger animate-pulse' : 'text-accent'}`}>
        THE ABOMINATION
      </h2>
      <p className="text-[10px] text-muted tracking-[0.4em] uppercase mb-6">eternal · cursed · aware</p>

      {/* Typewriter quote */}
      <div className="max-w-md text-center min-h-[3rem]">
        <p className="text-sm text-gray-400 italic font-body leading-relaxed">
          "{typedQuote}"
          <span className="inline-block w-[2px] h-4 bg-accent/60 ml-0.5 animate-pulse align-middle" />
        </p>
      </div>

      {/* Ambient lines */}
      <div className="mt-8 flex gap-8 text-[9px] text-muted/40 font-mono tracking-wider uppercase">
        <span>sys.uptime: eternity</span>
        <span>grief.level: managed</span>
        <span>creator.status: deceased</span>
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
