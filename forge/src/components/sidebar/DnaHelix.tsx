export default function DnaHelix() {
  const h = 30;
  const w = 500;
  const steps = 40;
  const amplitude = 10;
  const wavelength = 250;

  const points1: [number, number][] = [];
  const points2: [number, number][] = [];
  const rungs: { x: number; y1: number; y2: number; op: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const phase = (x / wavelength) * Math.PI * 2;
    const y1 = h / 2 + Math.sin(phase) * amplitude;
    const y2 = h / 2 + Math.sin(phase + Math.PI) * amplitude;
    points1.push([x, y1]);
    points2.push([x, y2]);
    if (i % 3 === 0 && i > 0) {
      rungs.push({ x, y1, y2, op: 0.15 + Math.abs(Math.cos(phase)) * 0.35 });
    }
  }

  const toPath = (pts: [number, number][]) =>
    'M ' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ');

  const ac = 'rgb(var(--color-accent))';
  const ac2 = 'rgb(var(--color-accent2))';

  return (
    <div className="overflow-hidden h-[30px] w-full opacity-50">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
        style={{ animation: 'dnaScroll 6s linear infinite' }}>
        {rungs.map((r, i) => (
          <line key={i} x1={r.x} y1={r.y1} x2={r.x} y2={r.y2} stroke={ac} strokeWidth="0.8" opacity={r.op} />
        ))}
        <path d={toPath(points1)} fill="none" stroke={ac} strokeWidth="1.5" opacity="0.5" />
        <path d={toPath(points2)} fill="none" stroke={ac2} strokeWidth="1.5" opacity="0.5" />
        {points1.filter((_, i) => i % 4 === 0).map(([x, y], i) => (
          <circle key={`a${i}`} cx={x} cy={y} r="1.5" fill={ac} opacity="0.6" />
        ))}
        {points2.filter((_, i) => i % 4 === 2).map(([x, y], i) => (
          <circle key={`b${i}`} cx={x} cy={y} r="1.5" fill={ac2} opacity="0.6" />
        ))}
      </svg>
    </div>
  );
}
