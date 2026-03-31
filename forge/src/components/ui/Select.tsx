interface SelectProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  className?: string;
}

export default function Select({ value, options, onChange, className = '' }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`bg-surface2 border border-border rounded px-2 py-1.5 text-sm text-[rgb(var(--color-text))] outline-none focus:border-accent transition-colors ${className}`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
