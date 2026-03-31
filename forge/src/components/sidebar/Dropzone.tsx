import { useState, useRef } from 'react';
import { useModelStore } from '../../store/modelStore';
import { useRagStore } from '../../store/ragStore';
import { embedDoc } from '../../lib/rag';
import { useToastStore } from '../ui/Toast';
import { Upload } from 'lucide-react';

const ACCEPTED = ['.txt', '.md', '.json', '.csv', '.log', '.py', '.js', '.ts', '.html', '.xml', '.yaml', '.toml'];

export default function Dropzone() {
  const [dragOver, setDragOver] = useState(false);
  const [embedding, setEmbedding] = useState<Record<string, { current: number; total: number }>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const getActiveEmbedModel = useModelStore(s => s.getActiveEmbedModel);
  const addDoc = useRagStore(s => s.addDoc);
  const addToast = useToastStore(s => s.addToast);

  const processFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter(f =>
      ACCEPTED.some(ext => f.name.toLowerCase().endsWith(ext))
    );

    if (fileArr.length === 0) {
      addToast('No supported files. Accepted: ' + ACCEPTED.join(', '), 'error');
      return;
    }

    const model = getActiveEmbedModel();
    if (!model) {
      addToast('No model available for embedding.', 'error');
      return;
    }

    await Promise.all(fileArr.map(async (file) => {
      try {
        setEmbedding(prev => ({ ...prev, [file.name]: { current: 0, total: 0 } }));
        const doc = await embedDoc(file, model, (current, total) => {
          setEmbedding(prev => ({ ...prev, [file.name]: { current, total } }));
        });
        addDoc(doc);
        addToast(`Embedded ${file.name} (${doc.chunks.length} chunks)`, 'success');
      } catch (err) {
        addToast(`Failed to embed ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
      } finally {
        setEmbedding(prev => {
          const next = { ...prev };
          delete next[file.name];
          return next;
        });
      }
    }));
  };

  const activeEmbeddings = Object.entries(embedding);

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-accent bg-accent/5' : 'border-border hover:border-muted'
        }`}
      >
        <Upload size={16} className="mx-auto text-muted mb-1" />
        <p className="text-[10px] text-muted">Drop files or click to upload</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(',')}
          onChange={e => e.target.files && processFiles(e.target.files)}
          className="hidden"
        />
      </div>
      {activeEmbeddings.length > 0 && (
        <div className="mt-2 space-y-1">
          {activeEmbeddings.map(([name, { current, total }]) => (
            <div key={name} className="text-[10px] text-muted flex items-center gap-2">
              <span className="truncate flex-1">{name}</span>
              <span className="text-accent font-mono">{current}/{total}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
