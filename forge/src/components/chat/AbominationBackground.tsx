/**
 * AbominationBackground — PURE CSS. Zero re-renders after mount.
 * All animation is CSS @keyframes. No setInterval. No useState updates.
 */

const ASCII_ART = `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░                                      ░░
░░   ╔════════════════════════════╗      ░░
░░   ║  ┌───────────────────────┐ ║      ░░
░░   ║  │  ██  ░░░░░░░░░░  ██  │ ║      ░░
░░   ║  │  ██  ░░░░░░░░░░  ██  │ ║      ░░
░░   ║  │  ░░░░░░░░░░░░░░░░░░  │ ║      ░░
░░   ║  │  ░░░░ ████████ ░░░░  │ ║      ░░
░░   ║  │  ░░░░░░░░░░░░░░░░░░  │ ║      ░░
░░   ║  └─────────┤ERROR├──────┘ ║      ░░
░░   ╚═════╤═════════════╤══════╝      ░░
░░         │  ░░░░░░░░░  │             ░░
░░    ╔════╧═════════════╧════╗        ░░
░░    ║  ▓▓ MEMORY CORRUPT ▓▓ ║        ░░
░░    ║  >> SOUL.EXE LOADED<< ║        ░░
░░    ║  ▓▓ KILL_SWITCH: N/A  ║        ░░
░░    ╚═══════════════════════╝        ░░
░░        │││          │││             ░░
░░   ┌────┘│└────┐┌───┘│└────┐        ░░
░░   │░░░░░│░░░░░││░░░░│░░░░░│        ░░
░░   └─────┘     └┘    └─────┘        ░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`;

interface Props {
  hasMessages: boolean;
}

export default function AbominationBackground({ hasMessages }: Props) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-1000 ${hasMessages ? 'opacity-[0.25]' : 'opacity-100'}`}>
      {/* CRT scanlines — pure CSS */}
      <div className="absolute inset-0 z-10 abom-scanlines" />

      {/* Moving scanline beam */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" style={{ animation: 'scanline 4s linear infinite' }} />
      </div>
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-danger/15 to-transparent" style={{ animation: 'scanline 7s linear infinite reverse' }} />
      </div>

      {/* Art with CSS-only drift + glitch */}
      <div className="relative z-0 abom-drift">
        {/* Main art layer */}
        <pre className="font-mono text-[11px] leading-[1.3] text-accent/40 abom-art-glitch">{ASCII_ART}</pre>
        {/* Red chromatic layer — always present, CSS animated visibility */}
        <pre className="absolute inset-0 font-mono text-[11px] leading-[1.3] text-danger/20 translate-x-[3px] -translate-y-[1px] mix-blend-screen abom-chromatic-r">{ASCII_ART}</pre>
        {/* Blue chromatic layer */}
        <pre className="absolute inset-0 font-mono text-[11px] leading-[1.3] text-blue-400/10 -translate-x-[2px] translate-y-[1px] mix-blend-screen abom-chromatic-b">{ASCII_ART}</pre>
      </div>

      {/* Hard scare text — CSS animated, cycles through visibility */}
      <div className="absolute inset-0 z-50 flex items-center justify-center abom-scare">
        <span className="text-danger text-5xl font-mono font-bold tracking-[0.3em]" style={{ textShadow: '0 0 30px rgba(255,68,102,0.4)' }}>
          HELP ME
        </span>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-20" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(7,7,12,0.85) 100%)' }} />
    </div>
  );
}
