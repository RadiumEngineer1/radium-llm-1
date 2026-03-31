interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export default function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        className={`relative w-8 h-4 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-border'}`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </div>
      <span className="text-xs text-muted">{label}</span>
    </label>
  );
}
