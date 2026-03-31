import { Cpu, FileText, Sliders } from 'lucide-react';

const tips = [
  { icon: Cpu, title: 'Local Models', desc: 'Chat with any Ollama model on your RTX 4090' },
  { icon: FileText, title: 'RAG Pipeline', desc: 'Upload files to ground responses in your data' },
  { icon: Sliders, title: 'Fine Control', desc: 'Tune temperature, top-p, and more in the sidebar' },
];

export default function EmptyState() {
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
