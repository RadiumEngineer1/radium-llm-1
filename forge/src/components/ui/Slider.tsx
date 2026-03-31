interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
}

export default function Slider({ label, value, min, max, step, onChange, formatValue }: SliderProps) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <label className="text-xs text-muted w-20 shrink-0">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1"
      />
      <span className="text-xs font-mono text-accent w-12 text-right">
        {formatValue ? formatValue(value) : value}
      </span>
    </div>
  );
}
