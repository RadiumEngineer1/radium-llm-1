import { useSettingsStore } from '../../store/settingsStore';
import Slider from '../ui/Slider';

export default function GenerationParams() {
  const { params, updateParam } = useSettingsStore();

  return (
    <div>
      <h3 className="text-xs text-muted mb-2 uppercase tracking-wider">Parameters</h3>
      <Slider
        label="Temp"
        value={params.temperature}
        min={0} max={2} step={0.05}
        onChange={v => updateParam('temperature', v)}
        formatValue={v => v.toFixed(2)}
      />
      <Slider
        label="Top P"
        value={params.top_p}
        min={0.1} max={1} step={0.05}
        onChange={v => updateParam('top_p', v)}
        formatValue={v => v.toFixed(2)}
      />
      <Slider
        label="Max Tokens"
        value={params.num_predict}
        min={256} max={8192} step={256}
        onChange={v => updateParam('num_predict', v)}
      />
      <Slider
        label="RAG Top-K"
        value={params.top_k}
        min={1} max={10} step={1}
        onChange={v => updateParam('top_k', v)}
      />
      <Slider
        label="Repeat Pen"
        value={params.repeat_penalty}
        min={1.0} max={1.5} step={0.05}
        onChange={v => updateParam('repeat_penalty', v)}
        formatValue={v => v.toFixed(2)}
      />
    </div>
  );
}
