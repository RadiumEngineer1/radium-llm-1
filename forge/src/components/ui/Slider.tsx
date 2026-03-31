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
    <div className="mb-2">
      <div className="flex justify-between mb-0.5">
        <label className="text-[10px] text-muted">{label}</label>
        <span className="text-[10px] font-mono text-accent">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
