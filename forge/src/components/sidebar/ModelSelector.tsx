import { useModelStore } from '../../store/modelStore';
import Select from '../ui/Select';
import IconButton from '../ui/IconButton';
import { RefreshCw } from 'lucide-react';

export default function ModelSelector() {
  const { models, selectedModel, setSelectedModel, loadModels } = useModelStore();

  const options = models.map(m => ({
    value: m.name,
    label: m.name,
  }));

  return (
    <div>
      <label className="text-xs text-muted mb-1 block">Chat Model</label>
      <div className="flex gap-1">
        <Select
          value={selectedModel}
          options={options.length ? options : [{ value: '', label: 'No models found' }]}
          onChange={setSelectedModel}
          className="flex-1 text-xs"
        />
        <IconButton onClick={() => loadModels()} tooltip="Refresh models">
          <RefreshCw size={14} />
        </IconButton>
      </div>
    </div>
  );
}
