import { useRagStore } from '../../store/ragStore';
import IconButton from '../ui/IconButton';
import { X } from 'lucide-react';

export default function DocList() {
  const { docs, removeDoc } = useRagStore();

  if (docs.length === 0) return null;

  return (
    <div className="space-y-1">
      {docs.map(doc => (
        <div
          key={doc.id}
          className="flex items-center gap-2 bg-surface2 rounded px-2 py-1.5 animate-[slideIn_0.2s_ease-out]"
        >
          <span className="text-[11px] text-gray-300 truncate flex-1" title={doc.name}>
            {doc.name}
          </span>
          <span className="text-[10px] text-muted font-mono shrink-0">
            {doc.chunks.length}ch
          </span>
          <IconButton onClick={() => removeDoc(doc.id)} className="p-0.5">
            <X size={12} />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
