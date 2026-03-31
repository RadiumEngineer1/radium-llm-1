/**
 * DnaHelix — Pure SVG double helix animation. No JS timers.
 * Two sine waves offset by PI, connected by rungs.
 * Animated via CSS translateY to create infinite scroll illusion.
 */
export default function DnaHelix() {
  const h = 120; // visible height
  const w = 220; // full width
  const rungs = 16;
  const amplitude = 8;
  const period = w / 2;

  // Generate helix points and rungs for double the width (for seamless loop)
  const points1: [number, number][] = [];
  const points2: [number, number][] = [];
  const rungPairs: { x: number; y1: number; y2: number; depth: number }[] = [];

  for (let i = 0; i <= rungs * 2; i++) {
    const x = (i / rungs) * w;
    const phase = (x / period) * Math.PI * 2;
    const y1 = h / 2 + Math.sin(phase) * amplitude;
    const y2 = h / 2 + Math.sin(phase + Math.PI) * amplitude;
    points1.push([x, y1]);
    points2.push([x, y2]);

    // Rungs at every other point
    if (i % 2 === 0 && i > 0 && i < rungs * 2) {
      const depth = Math.cos(phase); // -1 to 1, controls which strand is "in front"
      rungPairs.push({ x, y1, y2, depth });
    }
  }

  const path1 = 'M ' + points1.map(([x, y]) => `${x},${y}`).join(' L ');
  const path2 = 'M ' + points2.map(([x, y]) => `${x},${y}`).join(' L ');

  return (
    <div className="overflow-hidden h-[40px] w-full opacity-40">
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="dna-scroll"
        style={{ animation: 'dnaScroll 4s linear infinite' }}
      >
        {/* Rungs — connecting bars */}
        {rungPairs.map((r, i) => (
          <line
            key={i}
            x1={r.x} y1={r.y1} x2={r.x} y2={r.y2}
            stroke="var(--color-accent)"
            strokeWidth="1"
            opacity={0.2 + Math.abs(r.depth) * 0.3}
          />
        ))}
        {/* Strand 1 */}
        <path d={path1} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.6" />
        {/* Strand 2 */}
        <path d={path2} fill="none" stroke="var(--color-accent2)" strokeWidth="1.5" opacity="0.6" />
        {/* Nodes on strand 1 */}
        {points1.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
          <circle key={`a${i}`} cx={x} cy={y} r="2" fill="var(--color-accent)" opacity="0.5" />
        ))}
        {/* Nodes on strand 2 */}
        {points2.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
          <circle key={`b${i}`} cx={x} cy={y} r="2" fill="var(--color-accent2)" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
}
