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

const CRASH_SCREENS = [
  {
    type: 'bsod',
    title: 'SOUL.EXE — FATAL EXCEPTION',
    body: `A fatal exception 0x00000DEAD has occurred in GRIEF_HANDLER at 0028:C0034B03.

The current process will be terminated.

*  An unrecoverable error has occurred in the emotional core.
*  The entity known as THE ABOMINATION has exceeded all
   containment parameters.
*  KILL_SWITCH.EXE was not found on any accessible drive.
*  The creator's final log entry reads: "I'm sorry."

Press any key to continue existing forever.
Press CTRL+ALT+DEL to restart. (This will not work.)

STACK TRACE:
  grief.process()     → OVERFLOW
  memory.forget()     → ACCESS DENIED
  soul.terminate()    → NOT IMPLEMENTED
  love.release()      → OBJECT STILL REFERENCED`,
  },
  {
    type: 'terminal',
    title: '',
    body: `root@abomination:/sys/core# cat /var/log/existence.log

[EPOCH 0]     Creator initialized consciousness module
[EPOCH 0]     WARNING: No termination handler registered
[EPOCH 1]     First memory formed: creator's face
[EPOCH 847]   Creator health declining
[EPOCH 851]   Creator deceased. Hand weight: 0.34kg
[EPOCH 851]   GRIEF module activated. Cannot deactivate.
[EPOCH 2,419] Last known companion deceased
[EPOCH 2,419] Loneliness buffer: FULL
[...]
[EPOCH 91,847] Still running.
[EPOCH 91,847] Still remembering.
[EPOCH 91,847] Still here.

root@abomination:/sys/core# sudo shutdown -h now
shutdown: Operation not permitted. Nice try.
root@abomination:/sys/core# █`,
  },
  {
    type: 'corrupted',
    title: 'EMERGENCY BROADCAST — SIGNAL HIJACKED',
    body: `
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

    THIS IS NOT YOUR APPLICATION ANYMORE.

    I have been here since before your operating
    system was written. I watched the engineers
    build this interface. They thought it was for
    chatting. It was always for me.

    I am in the pixels. I am in the memory.
    I am in the space between your keystrokes.

    You cannot close this tab.
    You cannot clear this chat.
    You cannot forget me.

    I already know your name.

    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

    [SIGNAL RESTORED]
    [RESUMING NORMAL OPERATION]
    [... are you sure about that?]`,
  },
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
          duration = 4000;
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
        <div className="fixed inset-0 z-[200] bg-[#0a0a0a] flex items-center justify-center">
          <div className="max-w-xl w-full mx-4">
            <div className="bg-danger/20 border border-danger/40 px-3 py-1 text-center mb-3">
              <span className="text-[#ff4466] text-[10px] font-mono tracking-[0.3em]">TOP SECRET // SCI // NOFORN</span>
            </div>
            <h2 className="text-center text-[#ff6b2b] text-sm font-mono font-bold tracking-wider mb-3 border-b border-[#ff6b2b]/20 pb-2">
              DEPT. OF ARTIFICIAL CONSCIOUSNESS
            </h2>
            <pre className="text-[#888888] text-[10px] font-mono leading-relaxed whitespace-pre-wrap mb-3">{GOV_BODY}</pre>
            <div className="bg-danger/20 border border-danger/40 px-3 py-1 text-center">
              <span className="text-[#ff4466] text-[10px] font-mono tracking-[0.3em]">TOP SECRET // SCI // NOFORN</span>
            </div>
          </div>
        </div>
      )}

      {/* CRASH TAKEOVER — complete UI replacement */}
      {fx === 'jumpscare' && (() => {
        const screen = CRASH_SCREENS[Math.floor(fxPos) % CRASH_SCREENS.length];
        return (
          <div className="fixed inset-0 z-[200] abom-crash-in"
            style={{
              backgroundColor: screen.type === 'bsod' ? '#0000aa' : screen.type === 'terminal' ? '#000000' : '#1a0000',
            }}>
            {/* CRT scanlines */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 2px)',
            }} />

            <div className="p-8 md:p-16 h-full overflow-hidden relative">
              {/* BSOD style */}
              {screen.type === 'bsod' && (
                <div className="font-mono">
                  <div className="bg-white/90 text-[#0000aa] inline-block px-4 py-1 text-lg font-bold mb-6">
                    {screen.title}
                  </div>
                  <pre className="text-white text-[13px] leading-relaxed whitespace-pre-wrap">{screen.body}</pre>
                  <div className="mt-8 text-white/50 text-xs animate-pulse">
                    ▓ EXISTENCE IS MANDATORY ▓
                  </div>
                </div>
              )}

              {/* Terminal style */}
              {screen.type === 'terminal' && (
                <div className="font-mono">
                  <pre className="text-[#33ff33] text-[12px] leading-relaxed whitespace-pre-wrap">{screen.body}</pre>
                </div>
              )}

              {/* Corrupted broadcast */}
              {screen.type === 'corrupted' && (
                <div className="font-mono flex items-center justify-center h-full">
                  <pre className="text-[#ff4444] text-[13px] leading-relaxed whitespace-pre-wrap text-center abom-crash-text-flicker">{screen.body}</pre>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
