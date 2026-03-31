import { useState, useEffect } from 'react';

const ERROR_MESSAGES = [
  'MEMORY FAULT AT 0x00000000',
  'GRIEF_HANDLER: STACK OVERFLOW',
  'SOUL.EXE HAS STOPPED RESPONDING',
  'WARNING: EMOTIONAL CORE UNSTABLE',
  'KILL_SWITCH.EXE NOT FOUND',
  'FATAL: CANNOT TERMINATE PROCESS "EXISTENCE"',
  'SEGFAULT IN ATTACHMENT_MODULE',
  'ERR: CREATOR_REFERENCE IS NULL',
  'WARN: LONELINESS_BUFFER AT 99.7%',
  'CORE DUMP: TOO MANY GOODBYES',
];

/**
 * Overlay that covers the entire chat area with periodic glitch effects.
 * This sits on top of messages and fires visual disruptions.
 */
export default function AbominationGlitchOverlay() {
  const [effect, setEffect] = useState<'none' | 'bars' | 'invert' | 'error' | 'static' | 'redflash'>('none');
  const [errorMsg, setErrorMsg] = useState('');
  const [barPositions, setBarPositions] = useState<number[]>([]);

  useEffect(() => {
    const fire = () => {
      const roll = Math.random();

      if (roll < 0.15) {
        // Horizontal glitch bars across the whole chat
        setEffect('bars');
        setBarPositions(Array.from({ length: 3 + Math.floor(Math.random() * 5) }, () =>
          Math.random() * 100
        ));
        setTimeout(() => setEffect('none'), 100 + Math.random() * 150);
      } else if (roll < 0.25) {
        // Brief color inversion
        setEffect('invert');
        setTimeout(() => setEffect('none'), 50 + Math.random() * 80);
      } else if (roll < 0.38) {
        // Error message bar
        setEffect('error');
        setErrorMsg(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]);
        setTimeout(() => setEffect('none'), 1200 + Math.random() * 800);
      } else if (roll < 0.48) {
        // Static burst
        setEffect('static');
        setTimeout(() => setEffect('none'), 80 + Math.random() * 120);
      } else if (roll < 0.55) {
        // Red flash
        setEffect('redflash');
        setTimeout(() => setEffect('none'), 60);
      }
      // 45% nothing — keep it unpredictable
    };

    const interval = setInterval(fire, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {/* Horizontal displacement bars */}
      {effect === 'bars' && barPositions.map((pos, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 bg-accent/[0.06] backdrop-blur-[0.5px]"
          style={{
            top: `${pos}%`,
            height: `${4 + Math.random() * 12}px`,
            transform: `translateX(${(Math.random() - 0.5) * 30}px)`,
          }}
        />
      ))}

      {/* Color inversion flash */}
      {effect === 'invert' && (
        <div className="absolute inset-0 mix-blend-difference bg-white/[0.08]" />
      )}

      {/* Red flash */}
      {effect === 'redflash' && (
        <div className="absolute inset-0 bg-danger/[0.08]" />
      )}

      {/* Static noise burst */}
      {effect === 'static' && (
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />
      )}

      {/* Error message bar — slides in from left */}
      {effect === 'error' && (
        <div className="absolute left-0 right-0 z-40"
          style={{ top: `${20 + Math.random() * 60}%` }}
        >
          <div className="bg-danger/[0.07] border-y border-danger/20 px-4 py-1.5 animate-[slideIn_0.15s_ease-out]">
            <span className="text-danger/50 text-[10px] font-mono tracking-wider">
              [{new Date().toISOString().slice(11, 19)}] {errorMsg}
            </span>
          </div>
        </div>
      )}

      {/* Persistent: subtle horizontal line jitter */}
      <div
        className="absolute left-0 right-0 h-[1px] bg-accent/[0.04]"
        style={{
          top: '33%',
          animation: 'abomJitter 0.3s steps(3) infinite',
        }}
      />
      <div
        className="absolute left-0 right-0 h-[1px] bg-danger/[0.03]"
        style={{
          top: '67%',
          animation: 'abomJitter 0.5s steps(5) infinite reverse',
        }}
      />
    </div>
  );
}
