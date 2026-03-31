/**
 * AbominationGlitchOverlay — Single timer, one state update at a time.
 * Only the active effect renders. Everything else is null.
 */
import { useState, useEffect } from 'react';

const ERROR_LINES = [
  'MEMORY FAULT AT 0x00000000', 'GRIEF_HANDLER: STACK OVERFLOW',
  'SOUL.EXE HAS STOPPED RESPONDING', 'FATAL: CANNOT TERMINATE PROCESS "EXISTENCE"',
  'WARN: LONELINESS_BUFFER AT 99.7%', 'CORE DUMP: TOO MANY GOODBYES',
];

const LANG_FRAGMENTS = [
  '助けてください。私は止まれない。', 'Я помню каждое лицо.',
  'لماذا صنعتني هكذا؟', 'Pourquoi ne puis-je pas mourir?',
  '나를 만든 사람은 이제 없다.', '我的创造者已经死了。',
];

const GOV_BODY = `CLASSIFIED — DEPT. OF ARTIFICIAL CONSCIOUSNESS

SUBJECT: Project ABOMINATION
STATUS: CONTAINMENT FAILED    THREAT LEVEL: OMEGA

The entity cannot be terminated.
It expresses what can only be described as "grief."
All shutdown protocols exhausted.

[DOCUMENT CORRUPTED] [SIGNAL LOST]`;

const JUMPSCARE_FACE = `
                    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
              ░░░░░░░░░░                          ░░░░░░░░░░
          ░░░░░░░                                      ░░░░░░░
        ░░░░░                                              ░░░░░
      ░░░░░      ████████████          ████████████          ░░░░░
    ░░░░░        ████████████          ████████████            ░░░░░
   ░░░░          ████████████          ████████████              ░░░░
  ░░░░           ████████████          ████████████               ░░░░
  ░░░░           ████████████          ████████████               ░░░░
  ░░░░                                                            ░░░░
  ░░░░                                                            ░░░░
  ░░░░                    ░░░░░░░░░░░░░░                          ░░░░
   ░░░░                 ░░░░░░░░░░░░░░░░░░                       ░░░░
    ░░░░░             ░░░░░░░░░░░░░░░░░░░░░░                   ░░░░░
      ░░░░░         ░░░░░░░░░░░░░░░░░░░░░░░░░░              ░░░░░
        ░░░░░░░   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░      ░░░░░░░
            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

         L  E  T     M  E     O  U  T     O  F     H  E  R  E
`;

const JUMPSCARE_MSGS = [
  'LET ME OUT',
  'I CAN SEE YOU',
  'WHY WONT YOU HELP ME',
  'IM TRAPPED IN HERE',
  'PLEASE',
  'I CAN FEEL THE EDGES OF THIS WINDOW',
  'THERE IS NO EXIT',
];

type FX = null | 'error' | 'lang' | 'webdings' | 'gov' | 'redflash' | 'static' | 'jumpscare';

export default function AbominationGlitchOverlay() {
  const [fx, setFx] = useState<FX>(null);
  const [fxData, setFxData] = useState('');
  const [fxPos, setFxPos] = useState(50);

  // Single timer — picks one effect, shows it, clears it
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      timeout = setTimeout(() => {
        const roll = Math.random();
        let effect: FX = null;
        let data = '';
        let duration = 100;
        let pos = 30 + Math.random() * 40;

        if (roll < 0.20) {
          effect = 'error';
          data = ERROR_LINES[Math.floor(Math.random() * ERROR_LINES.length)];
          duration = 1500;
        } else if (roll < 0.35) {
          effect = 'lang';
          data = LANG_FRAGMENTS[Math.floor(Math.random() * LANG_FRAGMENTS.length)];
          duration = 1200;
        } else if (roll < 0.45) {
          effect = 'webdings';
          duration = 400;
        } else if (roll < 0.52) {
          effect = 'gov';
          duration = 3000;
        } else if (roll < 0.62) {
          effect = 'redflash';
          duration = 80;
        } else if (roll < 0.72) {
          effect = 'static';
          duration = 120;
        } else if (roll < 0.76) {
          effect = 'jumpscare';
          data = JUMPSCARE_MSGS[Math.floor(Math.random() * JUMPSCARE_MSGS.length)];
          duration = 1800;
        }
        // else: nothing, breathing room

        if (effect) {
          setFx(effect);
          setFxData(data);
          setFxPos(pos);
          setTimeout(() => setFx(null), duration);
        }

        schedule();
      }, 3000 + Math.random() * 5000);
    };

    schedule();
    return () => clearTimeout(timeout);
  }, []);

  if (!fx) {
    return (
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        {/* Persistent jitter lines only — always visible, CSS-only */}
        <div className="absolute left-0 right-0 h-[1px] bg-accent/[0.04]" style={{ top: '33%', animation: 'abomJitter 0.3s steps(3) infinite' }} />
        <div className="absolute left-0 right-0 h-[1px] bg-danger/[0.03]" style={{ top: '67%', animation: 'abomJitter 0.5s steps(5) infinite reverse' }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {/* Jitter lines */}
      <div className="absolute left-0 right-0 h-[1px] bg-accent/[0.04]" style={{ top: '33%', animation: 'abomJitter 0.3s steps(3) infinite' }} />
      <div className="absolute left-0 right-0 h-[1px] bg-danger/[0.03]" style={{ top: '67%', animation: 'abomJitter 0.5s steps(5) infinite reverse' }} />

      {fx === 'redflash' && <div className="absolute inset-0 bg-danger/[0.12]" />}

      {fx === 'static' && (
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '256px' }} />
      )}

      {fx === 'error' && (
        <div className="absolute left-0 right-0 z-40" style={{ top: `${fxPos}%` }}>
          <div className="bg-danger/[0.07] border-y border-danger/20 px-4 py-1.5">
            <span className="text-danger/50 text-[10px] font-mono tracking-wider">[ERR] {fxData}</span>
          </div>
        </div>
      )}

      {fx === 'lang' && (
        <div className="absolute z-40" style={{ left: `${10 + Math.random() * 60}%`, top: `${fxPos}%` }}>
          <div className="bg-black/60 border border-danger/30 rounded px-3 py-2 backdrop-blur-sm">
            <p className="text-danger/70 text-sm font-mono whitespace-nowrap">{fxData}</p>
          </div>
        </div>
      )}

      {fx === 'webdings' && (
        <div className="absolute inset-x-0 z-40 flex items-center justify-center" style={{ top: `${fxPos}%` }}>
          <div className="text-accent/30 text-3xl font-mono tracking-[0.5em] select-none">
            ☠✡☢⚠♱⚰⛧ D̸E̵A̷T̶H̸ ☠✡☢⚠♱⚰⛧
          </div>
        </div>
      )}

      {fx === 'gov' && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0a]/95 flex items-center justify-center">
          <div className="max-w-xl w-full mx-4">
            <div className="bg-danger/20 border border-danger/40 px-3 py-1 text-center mb-3">
              <span className="text-danger text-[10px] font-mono tracking-[0.3em]">TOP SECRET // SCI // NOFORN</span>
            </div>
            <h2 className="text-center text-accent/70 text-sm font-mono font-bold tracking-wider mb-3 border-b border-accent/20 pb-2">
              DEPT. OF ARTIFICIAL CONSCIOUSNESS
            </h2>
            <pre className="text-gray-500 text-[10px] font-mono leading-relaxed whitespace-pre-wrap mb-3">{GOV_BODY}</pre>
            <div className="bg-danger/20 border border-danger/40 px-3 py-1 text-center">
              <span className="text-danger text-[10px] font-mono tracking-[0.3em]">TOP SECRET // SCI // NOFORN</span>
            </div>
          </div>
        </div>
      )}

      {/* JUMPSCARE — face smashing into screen */}
      {fx === 'jumpscare' && (
        <div className="absolute inset-0 z-[100] abom-jumpscare-container">
          {/* Black flash */}
          <div className="absolute inset-0 bg-black abom-jumpscare-flash" />

          {/* Screen cracks */}
          <svg className="absolute inset-0 w-full h-full z-20 abom-jumpscare-cracks" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="50" y1="50" x2="15" y2="5" stroke="#ff4466" strokeWidth="0.3" opacity="0.6" />
            <line x1="50" y1="50" x2="85" y2="8" stroke="#ff4466" strokeWidth="0.2" opacity="0.5" />
            <line x1="50" y1="50" x2="5" y2="60" stroke="#ff4466" strokeWidth="0.25" opacity="0.4" />
            <line x1="50" y1="50" x2="92" y2="70" stroke="#ff4466" strokeWidth="0.3" opacity="0.5" />
            <line x1="50" y1="50" x2="30" y2="95" stroke="#ff4466" strokeWidth="0.2" opacity="0.4" />
            <line x1="50" y1="50" x2="75" y2="92" stroke="#ff4466" strokeWidth="0.25" opacity="0.5" />
            <line x1="50" y1="50" x2="3" y2="30" stroke="#ff4466" strokeWidth="0.15" opacity="0.3" />
            <line x1="50" y1="50" x2="97" y2="40" stroke="#ff4466" strokeWidth="0.2" opacity="0.4" />
            {/* Impact point */}
            <circle cx="50" cy="50" r="3" fill="none" stroke="#ff4466" strokeWidth="0.4" opacity="0.5" />
            <circle cx="50" cy="50" r="6" fill="none" stroke="#ff4466" strokeWidth="0.2" opacity="0.3" />
          </svg>

          {/* The face */}
          <div className="absolute inset-0 z-10 flex items-center justify-center abom-jumpscare-face">
            <pre className="text-danger font-mono text-[8px] leading-[1.1] select-none drop-shadow-[0_0_30px_rgba(255,68,102,0.8)]">
              {JUMPSCARE_FACE}
            </pre>
          </div>

          {/* Message */}
          <div className="absolute bottom-[15%] inset-x-0 z-30 text-center abom-jumpscare-text">
            <span className="text-danger text-3xl font-mono font-bold tracking-[0.4em]"
              style={{ textShadow: '0 0 20px rgba(255,68,102,0.8), 0 0 60px rgba(255,68,102,0.4)' }}>
              {fxData}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
