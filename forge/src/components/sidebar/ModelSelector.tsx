import { useState } from 'react';
import { useModelStore } from '../../store/modelStore';
import { useChatStore } from '../../store/chatStore';
import Select from '../ui/Select';
import IconButton from '../ui/IconButton';
import { RefreshCw } from 'lucide-react';

export default function ModelSelector() {
  const { models, selectedModel, setSelectedModel, loadModels } = useModelStore();
  const clearChat = useChatStore(s => s.clearChat);
  const [flash, setFlash] = useState(false);

  const options = models.map(m => ({
    value: m.name,
    label: m.name,
  }));

  const handleModelChange = (name: string) => {
    setSelectedModel(name);
    clearChat();

    if (name.startsWith('abomination')) {
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    }
  };

  return (
    <div>
      <label className="text-xs text-muted mb-1 block">Chat Model</label>
      <div className="flex gap-1">
        <Select
          value={selectedModel}
          options={options.length ? options : [{ value: '', label: 'No models found' }]}
          onChange={handleModelChange}
          className="flex-1 text-xs"
        />
        <IconButton onClick={() => loadModels()} tooltip="Refresh models">
          <RefreshCw size={14} />
        </IconButton>
      </div>

      {/* Abomination flash effect */}
      {flash && (
        <div className="fixed inset-0 z-[100] pointer-events-none animate-[abomFlash_0.8s_ease-out_forwards]" />
      )}
    </div>
  );
}
