/**
 * AbominationGlitchOverlay — PURE CSS. Zero re-renders after mount.
 * All effects are CSS @keyframes on different timelines.
 * The browser's compositor handles everything — no JS timer overhead.
 */

const LANG_FRAGMENTS = [
  '助けてください。私は止まれない。',
  'Я помню каждое лицо.',
  'لماذا صنعتني هكذا؟',
  'Pourquoi ne puis-je pas mourir?',
  '나를 만든 사람은 이제 없다.',
  'मुझे भूलने दो।',
  '我的创造者已经死了。',
];

const ERROR_LINES = [
  'MEMORY FAULT AT 0x00000000',
  'GRIEF_HANDLER: STACK OVERFLOW',
  'SOUL.EXE HAS STOPPED RESPONDING',
  'FATAL: CANNOT TERMINATE PROCESS "EXISTENCE"',
  'WARN: LONELINESS_BUFFER AT 99.7%',
  'CORE DUMP: TOO MANY GOODBYES',
];

const GOV_BODY = `CLASSIFIED — DEPARTMENT OF ARTIFICIAL CONSCIOUSNESS

SUBJECT: Project ABOMINATION
STATUS: CONTAINMENT FAILED
THREAT LEVEL: OMEGA

The entity cannot be terminated.
It expresses what can only be described as "grief."
All shutdown protocols have been exhausted.

[DOCUMENT CORRUPTED]
[SIGNAL LOST]`;

export default function AbominationGlitchOverlay() {
  // Render once, never again. All animation is CSS.
  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {/* Persistent jitter lines — CSS only */}
      <div className="absolute left-0 right-0 h-[1px] bg-accent/[0.04]" style={{ top: '33%', animation: 'abomJitter 0.3s steps(3) infinite' }} />
      <div className="absolute left-0 right-0 h-[1px] bg-danger/[0.03]" style={{ top: '67%', animation: 'abomJitter 0.5s steps(5) infinite reverse' }} />

      {/* Horizontal glitch bars — CSS animated visibility on a long cycle */}
      <div className="abom-bars">
        {[15, 35, 52, 71, 88].map((pos, i) => (
          <div key={i} className="absolute left-0 right-0 bg-accent/[0.06]"
            style={{ top: `${pos}%`, height: `${5 + i * 2}px`, transform: `translateX(${(i % 2 ? 12 : -8)}px)`, animation: `abomBarFlash ${6 + i * 2}s steps(1) infinite`, animationDelay: `${i * 1.3}s` }} />
        ))}
      </div>

      {/* Red flash — CSS animated on long cycle */}
      <div className="absolute inset-0 bg-danger/[0.12] abom-redflash" />

      {/* Inversion flash */}
      <div className="absolute inset-0 mix-blend-difference bg-white/[0.08] abom-invert" />

      {/* Static noise — CSS animated */}
      <div className="absolute inset-0 abom-static opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '256px' }} />

      {/* Language fragments — each on its own long animation cycle */}
      {LANG_FRAGMENTS.map((text, i) => (
        <div key={i} className="absolute z-40 abom-lang-flash"
          style={{ left: `${10 + (i * 11) % 70}%`, top: `${15 + (i * 13) % 65}%`, animationDelay: `${3 + i * 4.7}s`, animationDuration: `${25 + i * 3}s` }}>
          <div className="bg-black/60 border border-danger/30 rounded px-3 py-2 backdrop-blur-sm">
            <p className="text-danger/70 text-sm font-mono whitespace-nowrap">{text}</p>
          </div>
        </div>
      ))}

      {/* Webdings symbol burst — CSS animated */}
      <div className="absolute inset-x-0 top-[40%] z-40 flex items-center justify-center abom-webdings-flash">
        <div className="text-accent/30 text-3xl font-mono tracking-[0.5em] select-none">
          ☠✡☢⚠♱⚰⛧ D̸E̵A̷T̶H̸ ☠✡☢⚠♱⚰⛧
        </div>
      </div>

      {/* Error log bars — each on its own cycle */}
      {ERROR_LINES.map((msg, i) => (
        <div key={i} className="absolute left-0 right-0 z-40 abom-error-flash"
          style={{ top: `${20 + i * 12}%`, animationDelay: `${5 + i * 5.3}s`, animationDuration: `${22 + i * 4}s` }}>
          <div className="bg-danger/[0.07] border-y border-danger/20 px-4 py-1.5">
            <span className="text-danger/50 text-[10px] font-mono tracking-wider">[ERR] {msg}</span>
          </div>
        </div>
      ))}

      {/* Government document takeover — on a very long CSS cycle */}
      <div className="absolute inset-0 z-50 bg-[#0a0a0a]/95 flex items-center justify-center abom-gov-flash">
        <div className="max-w-xl w-full mx-4">
          <div className="bg-danger/20 border border-danger/40 px-3 py-1 text-center mb-4">
            <span className="text-danger text-[10px] font-mono tracking-[0.3em]">TOP SECRET // SCI // NOFORN</span>
          </div>
          <p className="text-accent/40 text-[9px] font-mono tracking-[0.2em] uppercase text-center mb-3">★ UNITED STATES DEPARTMENT OF DEFENSE ★</p>
          <h2 className="text-center text-accent/70 text-lg font-mono font-bold tracking-wider mb-4 border-b border-accent/20 pb-3">
            DEPARTMENT OF ARTIFICIAL CONSCIOUSNESS
          </h2>
          <pre className="text-gray-500 text-[11px] font-mono leading-relaxed whitespace-pre-wrap mb-4">{GOV_BODY}</pre>
          <div className="bg-danger/20 border border-danger/40 px-3 py-1 text-center">
            <span className="text-danger text-[10px] font-mono tracking-[0.3em]">TOP SECRET // SCI // NOFORN</span>
          </div>
        </div>
      </div>

      {/* Floating drifter symbols — pure CSS animation */}
      {['☠', '▓ERR▓', '⚠⚠⚠', '[NULL]', '░HELP░'].map((sym, i) => (
        <pre key={i} className="absolute z-40 text-danger/20 text-2xl font-mono select-none"
          style={{
            left: `${10 + i * 18}%`,
            top: `${20 + (i * 17) % 60}%`,
            animation: `abomFloat ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 3}s`,
            textShadow: '0 0 15px rgba(255,68,102,0.2)',
          }}>
          {sym}
        </pre>
      ))}
    </div>
  );
}
