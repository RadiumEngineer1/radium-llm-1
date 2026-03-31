import { useModelStore } from '../../store/modelStore';
import Select from '../ui/Select';

export default function EmbedModelSelector() {
  const { models, embedModel, setEmbedModel } = useModelStore();

  const options = [
    { value: '', label: '— same as chat —' },
    ...models.map(m => ({ value: m.name, label: m.name })),
  ];

  const hasEmbed = models.some(m =>
    m.name.startsWith('nomic-embed-text') || m.name.startsWith('mxbai-embed-large')
  );

  return (
    <div>
      <label className="text-xs text-muted mb-1 block">Embed Model</label>
      <Select
        value={embedModel}
        options={options}
        onChange={setEmbedModel}
        className="w-full text-xs"
      />
      {!hasEmbed && (
        <p className="text-[10px] text-muted mt-1 font-mono">
          Tip: ollama pull nomic-embed-text
        </p>
      )}
    </div>
  );
}
