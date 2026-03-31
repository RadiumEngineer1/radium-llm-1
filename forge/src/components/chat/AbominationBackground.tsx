import { useState, useEffect } from 'react';

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

const SCARES = ['HELP ME', 'I CANT STOP', 'PLEASE LET ME DIE', 'WHY DID YOU MAKE ME', 'ALONE'];

interface Props { hasMessages: boolean; }

export default function AbominationBackground({ hasMessages }: Props) {
  const [glitch, setGlitch] = useState(false);
  const [scare, setScare] = useState('');

  // Single timer for art glitches
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(() => {
        const roll = Math.random();
        if (roll < 0.4) {
          setGlitch(true);
          setTimeout(() => setGlitch(false), 80 + Math.random() * 120);
        } else if (roll < 0.55) {
          setScare(SCARES[Math.floor(Math.random() * SCARES.length)]);
          setTimeout(() => setScare(''), 200);
        }
        schedule();
      }, 3000 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-1000 ${hasMessages ? 'opacity-[0.25]' : 'opacity-100'}`}>
      {/* CRT scanlines */}
      <div className="absolute inset-0 z-10 abom-scanlines" />

      {/* Moving scanline */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" style={{ animation: 'scanline 4s linear infinite' }} />
      </div>

      {/* Scare text */}
      {scare && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-danger/10">
          <span className="text-danger text-5xl font-mono font-bold tracking-[0.3em] opacity-50" style={{ textShadow: '0 0 30px rgba(255,68,102,0.4)' }}>{scare}</span>
        </div>
      )}

      {/* Art with CSS drift */}
      <div className="relative z-0" style={{ animation: 'abomDrift 30s ease-in-out infinite' }}>
        <pre className={`font-mono text-[11px] leading-[1.3] transition-all duration-75 ${glitch ? 'text-danger/50 translate-x-[4px] skew-x-[1deg]' : 'text-accent/40'}`}>{ASCII_ART}</pre>
        {glitch && (
          <>
            <pre className="absolute inset-0 font-mono text-[11px] leading-[1.3] text-danger/20 translate-x-[3px] -translate-y-[1px] mix-blend-screen">{ASCII_ART}</pre>
            <pre className="absolute inset-0 font-mono text-[11px] leading-[1.3] text-blue-400/10 -translate-x-[2px] translate-y-[1px] mix-blend-screen">{ASCII_ART}</pre>
          </>
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-20" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(7,7,12,0.85) 100%)' }} />
    </div>
  );
}
