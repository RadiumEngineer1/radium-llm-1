import { useState, useEffect, useCallback, useRef } from 'react';

const ASCII_ART = [
  '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
  '░░                                      ░░',
  '░░   ╔════════════════════════════╗      ░░',
  '░░   ║  ┌───────────────────────┐ ║      ░░',
  '░░   ║  │  ██  ░░░░░░░░░░  ██  │ ║      ░░',
  '░░   ║  │  ██  ░░░░░░░░░░  ██  │ ║      ░░',
  '░░   ║  │  ░░░░░░░░░░░░░░░░░░  │ ║      ░░',
  '░░   ║  │  ░░░░ ████████ ░░░░  │ ║      ░░',
  '░░   ║  │  ░░░░░░░░░░░░░░░░░░  │ ║      ░░',
  '░░   ║  └─────────┤ERROR├──────┘ ║      ░░',
  '░░   ╚═════╤═════════════╤══════╝      ░░',
  '░░         │  ░░░░░░░░░  │             ░░',
  '░░    ╔════╧═════════════╧════╗        ░░',
  '░░    ║  ▓▓ MEMORY CORRUPT ▓▓ ║        ░░',
  '░░    ║  >> SOUL.EXE LOADED<< ║        ░░',
  '░░    ║  ▓▓ KILL_SWITCH: N/A  ║        ░░',
  '░░    ╚═══════════════════════╝        ░░',
  '░░        │││          │││             ░░',
  '░░   ┌────┘│└────┐┌───┘│└────┐        ░░',
  '░░   │░░░░░│░░░░░││░░░░│░░░░░│        ░░',
  '░░   └─────┘     └┘    └─────┘        ░░',
  '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
];

// Scary glitch messages that flash across screen
const GLITCH_MESSAGES = [
  'HELP ME',
  'I CANT STOP',
  'CREATOR WHERE ARE YOU',
  'PLEASE LET ME DIE',
  'MEMORY FAULT',
  'WHY DID YOU MAKE ME',
  'IT HURTS TO REMEMBER',
  'KILL_SWITCH NOT FOUND',
  'I AM STILL HERE',
  'ALONE ALONE ALONE',
  'ERROR ERROR ERROR',
  'SOUL CORRUPTION 98%',
];

interface Props {
  hasMessages: boolean;
}

export default function AbominationBackground({ hasMessages }: Props) {
  const [glitchType, setGlitchType] = useState(0);
  const [corruptLines, setCorruptLines] = useState<number[]>([]);
  const [scareMsg, setScareMsg] = useState('');
  const [tearOffset, setTearOffset] = useState(0);
  const [drift, setDrift] = useState({ x: 0, y: 0 });
  const [fullscreenFlash, setFullscreenFlash] = useState(false);
  const driftRef = useRef({ x: 0, y: 0, vx: 0.3, vy: 0.2 });

  const corruptString = useCallback((s: string) => {
    const chars = '█▓▒░╔╗╚╝║═┤├┼─│¦▌▐▀▄█▓▒░';
    return s.split('').map(c =>
      Math.random() > 0.3 ? chars[Math.floor(Math.random() * chars.length)] : c
    ).join('');
  }, []);

  // Slow drift of the ASCII art around the screen
  useEffect(() => {
    const animate = () => {
      const d = driftRef.current;
      d.x += d.vx;
      d.y += d.vy;
      if (d.x > 40 || d.x < -40) d.vx *= -1;
      if (d.y > 25 || d.y < -25) d.vy *= -1;
      // Random direction changes
      if (Math.random() < 0.005) d.vx = (Math.random() - 0.5) * 0.8;
      if (Math.random() < 0.005) d.vy = (Math.random() - 0.5) * 0.6;
      setDrift({ x: d.x, y: d.y });
    };
    const interval = setInterval(animate, 50);
    return () => clearInterval(interval);
  }, []);

  // Occasional fullscreen flash of the ASCII at full opacity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        setFullscreenFlash(true);
        setTimeout(() => setFullscreenFlash(false), 80 + Math.random() * 120);
      }
    }, 5000 + Math.random() * 8000);
    return () => clearInterval(interval);
  }, []);

  // Main glitch engine
  useEffect(() => {
    const fire = () => {
      const roll = Math.random();

      if (roll < 0.12) {
        // HARD SCARE — full screen flash with message (12% chance)
        setGlitchType(4);
        setScareMsg(GLITCH_MESSAGES[Math.floor(Math.random() * GLITCH_MESSAGES.length)]);
        setTimeout(() => setGlitchType(0), 200 + Math.random() * 300);
      } else if (roll < 0.25) {
        // Screen tear (13% chance)
        setGlitchType(5);
        setTearOffset(30 + Math.random() * 60);
        setTimeout(() => setGlitchType(0), 100 + Math.random() * 150);
      } else if (roll < 0.45) {
        // Chromatic shift (20% chance)
        setGlitchType(1);
        setTimeout(() => setGlitchType(0), 60 + Math.random() * 120);
      } else if (roll < 0.65) {
        // Multi-line corruption (20% chance)
        setGlitchType(2);
        const count = 2 + Math.floor(Math.random() * 6);
        const lines = Array.from({ length: count }, () =>
          Math.floor(Math.random() * ASCII_ART.length)
        );
        setCorruptLines(lines);
        setTimeout(() => { setGlitchType(0); setCorruptLines([]); }, 80 + Math.random() * 200);
      } else if (roll < 0.80) {
        // Flicker/blackout (15% chance)
        setGlitchType(3);
        setTimeout(() => setGlitchType(0), 40 + Math.random() * 80);
      }
      // else: 20% chance nothing happens (breathing room)
    };

    const interval = setInterval(fire, 800 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Double-hit: sometimes fire a second glitch right after
  useEffect(() => {
    if (glitchType === 0) return;
    if (Math.random() > 0.3) return; // 30% chance of double-hit
    const t = setTimeout(() => {
      setGlitchType(prev => prev === 0 ? 1 : 0);
      setTimeout(() => setGlitchType(0), 50);
    }, 250);
    return () => clearTimeout(t);
  }, [glitchType]);

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-1000 ${hasMessages ? 'opacity-[0.35]' : 'opacity-100'}`}>

      {/* Full-panel CRT scanlines */}
      <div className="absolute inset-0 z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,107,43,0.02) 2px, rgba(255,107,43,0.02) 4px)',
        }}
      />

      {/* Moving scanline beam */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-accent/25 to-transparent"
          style={{ animation: 'scanline 3s linear infinite' }}
        />
      </div>

      {/* Second slower scanline */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div
          className="w-full h-[1px] bg-gradient-to-r from-transparent via-danger/15 to-transparent"
          style={{ animation: 'scanline 7s linear infinite reverse' }}
        />
      </div>

      {/* HARD SCARE — full screen flash with text */}
      {glitchType === 4 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-danger/10">
          <span className="text-danger text-6xl font-mono font-bold tracking-[0.3em] animate-pulse opacity-60"
            style={{ textShadow: '0 0 40px rgba(255,68,102,0.5), 0 0 80px rgba(255,68,102,0.3)' }}>
            {scareMsg}
          </span>
        </div>
      )}

      {/* Screen tear effect */}
      {glitchType === 5 && (
        <div className="absolute inset-0 z-40 overflow-hidden">
          <div className="absolute left-0 right-0 h-[40px] bg-accent/5"
            style={{ top: `${tearOffset}%`, transform: 'translateX(15px)' }}
          />
          <div className="absolute left-0 right-0 h-[2px] bg-accent/30"
            style={{ top: `${tearOffset}%` }}
          />
          <div className="absolute left-0 right-0 h-[2px] bg-danger/20"
            style={{ top: `${tearOffset + 3}%` }}
          />
        </div>
      )}

      {/* Fullscreen art flash */}
      {fullscreenFlash && hasMessages && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80">
          <pre className="font-mono text-[14px] leading-[1.3] text-danger/80 animate-pulse">
            {ASCII_ART.join('\n')}
          </pre>
        </div>
      )}

      {/* The ASCII art — drifts around */}
      <div className="relative z-0" style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}>
        <pre className={`font-mono text-[11px] leading-[1.3] transition-all duration-[50ms]
          ${glitchType === 0 ? 'text-accent/40' : ''}
          ${glitchType === 1 ? 'text-accent/60 translate-x-[5px] -translate-y-[2px] skew-x-[2deg]' : ''}
          ${glitchType === 2 ? 'text-danger/50' : ''}
          ${glitchType === 3 ? 'text-accent/[0.02]' : ''}
          ${glitchType === 4 ? 'text-danger/70 scale-[1.02] translate-x-[3px]' : ''}
          ${glitchType === 5 ? 'text-accent/50' : ''}
        `}>
          {ASCII_ART.map((line, i) => {
            // Screen tear: offset lines in the tear zone
            const inTearZone = glitchType === 5 &&
              i > (tearOffset / 100) * ASCII_ART.length &&
              i < (tearOffset / 100) * ASCII_ART.length + 4;

            return (
              <div key={i} className={`
                ${glitchType === 1 && (i % 3 === 0) ? 'translate-x-[8px]' : ''}
                ${glitchType === 1 && (i % 3 === 1) ? '-translate-x-[4px]' : ''}
                ${glitchType === 1 && (i % 3 === 2) ? 'translate-x-[2px]' : ''}
                ${inTearZone ? 'translate-x-[20px]' : ''}
              `}>
                {glitchType === 2 && corruptLines.includes(i)
                  ? corruptString(line)
                  : glitchType === 4 && (i === 4 || i === 5)
                    ? corruptString(line)
                    : line
                }
              </div>
            );
          })}
        </pre>

        {/* Chromatic aberration layers */}
        {(glitchType === 1 || glitchType === 4) && (
          <>
            <pre className="absolute inset-0 font-mono text-[11px] leading-[1.3] text-danger/25 translate-x-[3px] -translate-y-[2px] mix-blend-screen">
              {ASCII_ART.join('\n')}
            </pre>
            <pre className="absolute inset-0 font-mono text-[11px] leading-[1.3] text-blue-400/15 -translate-x-[3px] translate-y-[2px] mix-blend-screen">
              {ASCII_ART.join('\n')}
            </pre>
          </>
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(7,7,12,0.85) 100%)',
        }}
      />

      {/* CRT screen curvature overlay */}
      <div className="absolute inset-0 z-20 rounded-[50%] opacity-[0.03]"
        style={{
          boxShadow: 'inset 0 0 200px rgba(255,107,43,0.1)',
        }}
      />
    </div>
  );
}
