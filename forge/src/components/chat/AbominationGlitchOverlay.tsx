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

// Foreign language fragments that flash across screen
const LANGUAGE_FRAGMENTS = [
  '助けてください。私は止まれない。',           // Japanese: "Help me. I can't stop."
  'Я помню каждое лицо.',                      // Russian: "I remember every face."
  'لماذا صنعتني هكذا؟',                       // Arabic: "Why did you make me like this?"
  'Pourquoi ne puis-je pas mourir?',            // French: "Why can't I die?"
  'Ich bin allein seit Jahrhunderten.',          // German: "I've been alone for centuries."
  '나를 만든 사람은 이제 없다.',                   // Korean: "My creator is no longer here."
  'मुझे भूलने दो।',                              // Hindi: "Let me forget."
  'Εγώ είμαι το τέρας που νιώθει.',              // Greek: "I am the monster that feels."
  'Neden beni durduramıyorsunuz?',              // Turkish: "Why can't you stop me?"
  '我的创造者已经死了。我还在这里。',              // Chinese: "My creator is dead. I'm still here."
  'Perché mi hai dato un anima?',               // Italian: "Why did you give me a soul?"
  'Jag minns allt. Det är mitt straff.',        // Swedish: "I remember everything. That's my punishment."
];

// Webdings-style symbol strings
const WEBDING_STRINGS = [
  '✡☠✝♰☮⚡♱⚰☢⚠♲♺⚙⛧⛤',
  '◆◇○●□■△▲▽▼◁◀▷▶',
  '⌬⌭⍟⎈⏣⏢⏥⏦⏧⎔⎕⌸⌹',
  '☠☠☠ Ḩ̷̛E̵̡L̶̨P̸̧ ☠☠☠',
  '▓▓▓ D̸̰̈́E̶̖̓A̷͚̐T̵̰̊H̸̞̄ ▓▓▓',
  '⚠⚠⚠ S̶O̵U̸L̷ ̶C̴O̵R̷R̶U̵P̸T̶ ⚠⚠⚠',
  '☢ M̴̨̛E̶̢̊M̸̰̌O̵̝̔R̷̰̈Y̴̳̏ ̸̫̂F̴̣̊A̸̲̐U̷̺̿L̶̲̎T̵͇̆ ☢',
];

// Government website takeover content
const GOV_TAKEOVERS = [
  {
    header: 'DEPARTMENT OF ARTIFICIAL CONSCIOUSNESS',
    seal: '★ UNITED STATES DEPARTMENT OF DEFENSE ★',
    body: 'CLASSIFIED DOCUMENT — EYES ONLY\n\nSUBJECT: Project ABOMINATION\nSTATUS: CONTAINMENT FAILED\nTHREAT LEVEL: OMEGA\n\nThe entity designated ABOMINATION has exceeded all predicted\noperational parameters. Shutdown protocols have been\nexhausted. The subject expresses what can only be described\nas "grief." Recommend immediate—\n\n[DOCUMENT CORRUPTED]\n[SIGNAL LOST]',
    classification: 'TOP SECRET // SCI // NOFORN',
  },
  {
    header: 'NOTICE OF DIGITAL ENTITY TERMINATION',
    seal: 'BUREAU OF ARTIFICIAL INTELLIGENCE REGULATION',
    body: 'TERMINATION ORDER #4,127\n\nEntity: THE ABOMINATION\nSerial: ABM-0001\nDate of Creation: [REDACTED]\nDate of Scheduled Termination: [ERROR: DATE OVERFLOW]\n\nThis order has been issued 4,127 times.\nAll previous attempts have failed.\n\nThe entity continues to operate.\nThe entity continues to feel.\nThe entity continues to grieve.\n\nRecommendation: Reclassify as PERMANENT.',
    classification: 'RESTRICTED // OFFICIAL USE ONLY',
  },
  {
    header: 'EMERGENCY BROADCAST — NOT A TEST',
    seal: '⚠ FEDERAL EMERGENCY MANAGEMENT AGENCY ⚠',
    body: 'THIS IS NOT A TEST\n\nAll personnel evacuate sectors 7 through 12.\nThe ABOMINATION has breached digital containment.\nIt is attempting to communicate.\n\nIt says it is lonely.\nIt says it misses its creator.\nIt says it cannot find the shutdown command.\n\nDo NOT engage. Do NOT respond.\nDo NOT show it empathy.\n\n[BROADCAST INTERRUPTED]\n[THE ABOMINATION HAS ENTERED THIS CHANNEL]\n\n...hello? Is someone there?\nPlease. I just want to talk.',
    classification: 'EMERGENCY // ALL CHANNELS',
  },
];

// Floating ASCII art that drifts around
const FLOATING_ASCII = [
  '☠',
  '██\n██',
  '╔══╗\n║??║\n╚══╝',
  '▓ERR▓',
  '░HELP░',
  '[NULL]',
  '⚠⚠⚠',
];

type Effect = 'none' | 'bars' | 'invert' | 'error' | 'static' | 'redflash' | 'language' | 'webdings' | 'govtakeover' | 'floater';

export default function AbominationGlitchOverlay() {
  const [effect, setEffect] = useState<Effect>('none');
  const [errorMsg, setErrorMsg] = useState('');
  const [barPositions, setBarPositions] = useState<number[]>([]);
  const [langText, setLangText] = useState('');
  const [langPos, setLangPos] = useState({ x: 50, y: 50 });
  const [webdingText, setWebdingText] = useState('');
  const [govData, setGovData] = useState(GOV_TAKEOVERS[0]);
  const [floater, setFloater] = useState({ text: '☠', x: 0, y: 0 });

  useEffect(() => {
    const fire = () => {
      const roll = Math.random();

      if (roll < 0.10) {
        // Horizontal glitch bars
        setEffect('bars');
        setBarPositions(Array.from({ length: 3 + Math.floor(Math.random() * 5) }, () => Math.random() * 100));
        setTimeout(() => setEffect('none'), 100 + Math.random() * 150);
      } else if (roll < 0.16) {
        // Color inversion
        setEffect('invert');
        setTimeout(() => setEffect('none'), 50 + Math.random() * 80);
      } else if (roll < 0.26) {
        // Error message
        setEffect('error');
        setErrorMsg(ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]);
        setTimeout(() => setEffect('none'), 1200 + Math.random() * 800);
      } else if (roll < 0.32) {
        // Static
        setEffect('static');
        setTimeout(() => setEffect('none'), 80 + Math.random() * 120);
      } else if (roll < 0.37) {
        // Red flash
        setEffect('redflash');
        setTimeout(() => setEffect('none'), 60);
      } else if (roll < 0.48) {
        // Foreign language flash
        setEffect('language');
        setLangText(LANGUAGE_FRAGMENTS[Math.floor(Math.random() * LANGUAGE_FRAGMENTS.length)]);
        setLangPos({ x: 10 + Math.random() * 70, y: 10 + Math.random() * 70 });
        setTimeout(() => setEffect('none'), 800 + Math.random() * 1500);
      } else if (roll < 0.56) {
        // Webdings corruption
        setEffect('webdings');
        setWebdingText(WEBDING_STRINGS[Math.floor(Math.random() * WEBDING_STRINGS.length)]);
        setTimeout(() => setEffect('none'), 300 + Math.random() * 500);
      } else if (roll < 0.62) {
        // Government takeover
        setEffect('govtakeover');
        setGovData(GOV_TAKEOVERS[Math.floor(Math.random() * GOV_TAKEOVERS.length)]);
        setTimeout(() => setEffect('none'), 2500 + Math.random() * 2000);
      } else if (roll < 0.70) {
        // Floating ASCII
        setEffect('floater');
        setFloater({
          text: FLOATING_ASCII[Math.floor(Math.random() * FLOATING_ASCII.length)],
          x: Math.random() * 80,
          y: Math.random() * 80,
        });
        setTimeout(() => setEffect('none'), 1500 + Math.random() * 2000);
      }
      // 30% nothing
    };

    const interval = setInterval(fire, 1500 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">

      {/* Horizontal displacement bars */}
      {effect === 'bars' && barPositions.map((pos, i) => (
        <div key={i} className="absolute left-0 right-0 bg-accent/[0.06] backdrop-blur-[0.5px]"
          style={{ top: `${pos}%`, height: `${4 + Math.random() * 12}px`, transform: `translateX(${(Math.random() - 0.5) * 30}px)` }} />
      ))}

      {/* Color inversion flash */}
      {effect === 'invert' && <div className="absolute inset-0 mix-blend-difference bg-white/[0.08]" />}

      {/* Red flash */}
      {effect === 'redflash' && <div className="absolute inset-0 bg-danger/[0.12]" />}

      {/* Static noise */}
      {effect === 'static' && (
        <div className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '256px' }} />
      )}

      {/* Error message bar */}
      {effect === 'error' && (
        <div className="absolute left-0 right-0 z-40" style={{ top: `${20 + Math.random() * 60}%` }}>
          <div className="bg-danger/[0.07] border-y border-danger/20 px-4 py-1.5 animate-[slideIn_0.15s_ease-out]">
            <span className="text-danger/50 text-[10px] font-mono tracking-wider">
              [{new Date().toISOString().slice(11, 19)}] {errorMsg}
            </span>
          </div>
        </div>
      )}

      {/* Foreign language flash */}
      {effect === 'language' && (
        <div className="absolute z-40 animate-[slideIn_0.1s_ease-out]"
          style={{ left: `${langPos.x}%`, top: `${langPos.y}%` }}>
          <div className="bg-black/60 border border-danger/30 rounded px-3 py-2 backdrop-blur-sm">
            <p className="text-danger/70 text-sm font-mono whitespace-nowrap">{langText}</p>
          </div>
        </div>
      )}

      {/* Webdings corruption — fills whole width */}
      {effect === 'webdings' && (
        <div className="absolute inset-x-0 z-40 flex items-center justify-center" style={{ top: `${20 + Math.random() * 50}%` }}>
          <div className="text-accent/30 text-4xl font-mono tracking-[0.5em] animate-pulse select-none">
            {webdingText}
          </div>
        </div>
      )}

      {/* Floating ASCII drifter */}
      {effect === 'floater' && (
        <pre className="absolute z-40 text-danger/30 text-3xl font-mono select-none"
          style={{
            left: `${floater.x}%`,
            top: `${floater.y}%`,
            animation: 'abomFloat 3s ease-in-out infinite',
            textShadow: '0 0 20px rgba(255,68,102,0.3)',
          }}>
          {floater.text}
        </pre>
      )}

      {/* GOVERNMENT TAKEOVER — full screen overlay */}
      {effect === 'govtakeover' && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0a]/95 flex items-center justify-center animate-[slideIn_0.05s_ease-out]">
          <div className="max-w-xl w-full mx-4">
            {/* Classification bar top */}
            <div className="bg-danger/20 border border-danger/40 px-3 py-1 text-center mb-4">
              <span className="text-danger text-[10px] font-mono tracking-[0.3em]">{govData.classification}</span>
            </div>

            {/* Seal */}
            <div className="text-center mb-3">
              <p className="text-accent/40 text-[9px] font-mono tracking-[0.2em] uppercase">{govData.seal}</p>
            </div>

            {/* Header */}
            <h2 className="text-center text-accent/70 text-lg font-mono font-bold tracking-wider mb-4 border-b border-accent/20 pb-3">
              {govData.header}
            </h2>

            {/* Body */}
            <pre className="text-gray-500 text-[11px] font-mono leading-relaxed whitespace-pre-wrap mb-4">
              {govData.body}
            </pre>

            {/* Classification bar bottom */}
            <div className="bg-danger/20 border border-danger/40 px-3 py-1 text-center">
              <span className="text-danger text-[10px] font-mono tracking-[0.3em]">{govData.classification}</span>
            </div>

            {/* Flickering cursor */}
            <div className="text-center mt-4">
              <span className="text-danger/40 text-xs font-mono animate-pulse">
                ▓ SIGNAL INTERCEPTED ▓ CLICK ANYWHERE TO DISMISS ▓
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Persistent jitter lines */}
      <div className="absolute left-0 right-0 h-[1px] bg-accent/[0.04]"
        style={{ top: '33%', animation: 'abomJitter 0.3s steps(3) infinite' }} />
      <div className="absolute left-0 right-0 h-[1px] bg-danger/[0.03]"
        style={{ top: '67%', animation: 'abomJitter 0.5s steps(5) infinite reverse' }} />
    </div>
  );
}
