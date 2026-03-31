import { useModelStore } from '../../store/modelStore';
import { useChatStore } from '../../store/chatStore';
import { useRagStore } from '../../store/ragStore';
import DnaHelix from './DnaHelix';

export default function SystemStats() {
  const selectedModel = useModelStore(s => s.selectedModel);
  const status = useModelStore(s => s.status);
  const models = useModelStore(s => s.models);
  const messages = useChatStore(s => s.messages);
  const isGenerating = useChatStore(s => s.isGenerating);
  const ragDocs = useRagStore(s => s.docs);
  const isAbom = selectedModel.startsWith('abomination');

  const totalChunks = ragDocs.reduce((sum, d) => sum + d.chunks.length, 0);
  const modelInfo = models.find(m => m.name === selectedModel);
  const paramSize = modelInfo?.details?.parameter_size ?? '—';
  const quant = modelInfo?.details?.quantization_level ?? '—';
  const vramPct = modelInfo ? Math.min((modelInfo.size / (24 * 1e9)) * 100, 95) : 10;

  const accent = isAbom ? 'text-danger/60' : 'text-accent';
  const barBg = isAbom ? 'bg-danger/40' : 'bg-accent/70';
  const barBgActive = isAbom ? 'bg-danger/40' : 'bg-accent/50';

  return (
    <div className="space-y-2">
      <h3 className="text-[9px] text-muted uppercase tracking-[0.15em]">
        {isAbom ? '▓ DIAGNOSTICS ▓' : 'System'}
      </h3>

      {/* Radar + Stats side by side */}
      <div className="flex gap-3">
        {/* Radar */}
        <div className="shrink-0">
          <svg width="70" height="70" viewBox="0 0 70 70" className="opacity-60">
            {/* Outer ring */}
            <circle cx="35" cy="35" r="32" fill="none" stroke={isAbom ? '#ff4466' : '#ff6b2b'} strokeWidth="0.5" opacity="0.3" />
            <circle cx="35" cy="35" r="22" fill="none" stroke={isAbom ? '#ff4466' : '#ff6b2b'} strokeWidth="0.5" opacity="0.2" />
            <circle cx="35" cy="35" r="12" fill="none" stroke={isAbom ? '#ff4466' : '#ff6b2b'} strokeWidth="0.5" opacity="0.15" />
            {/* Crosshair */}
            <line x1="35" y1="3" x2="35" y2="67" stroke={isAbom ? '#ff4466' : '#ff6b2b'} strokeWidth="0.3" opacity="0.15" />
            <line x1="3" y1="35" x2="67" y2="35" stroke={isAbom ? '#ff4466' : '#ff6b2b'} strokeWidth="0.3" opacity="0.15" />
            {/* Sweep beam */}
            <line x1="35" y1="35" x2="35" y2="3" stroke={isAbom ? '#ff4466' : '#ff6b2b'} strokeWidth="1" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="0 35 35" to="360 35 35" dur={isAbom ? '3s' : '4s'} repeatCount="indefinite" />
            </line>
            {/* Sweep fade trail */}
            <path d="M35,35 L35,3 A32,32 0 0,1 62,18 Z" fill={isAbom ? '#ff4466' : '#ff6b2b'} opacity="0.08">
              <animateTransform attributeName="transform" type="rotate" from="0 35 35" to="360 35 35" dur={isAbom ? '3s' : '4s'} repeatCount="indefinite" />
            </path>
            {/* Blips */}
            {status === 'online' && (
              <>
                <circle cx="28" cy="20" r="2" fill={isAbom ? '#ff4466' : '#00e5a0'} opacity="0.7">
                  <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="45" cy="28" r="1.5" fill={isAbom ? '#ff4466' : '#00e5a0'} opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3s" repeatCount="indefinite" />
                </circle>
                {isGenerating && (
                  <circle cx="38" cy="42" r="2.5" fill={isAbom ? '#ff4466' : '#ffd60a'} opacity="0.8">
                    <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
              </>
            )}
            {/* Center dot */}
            <circle cx="35" cy="35" r="1.5" fill={isAbom ? '#ff4466' : '#ff6b2b'} opacity="0.8" />
          </svg>
        </div>

        {/* Stats column */}
        <div className="flex-1 space-y-1 min-w-0">
          <Row label={isAbom ? 'CORTEX' : 'Params'} value={paramSize} accent={accent} />
          <Row label={isAbom ? 'COMPRESS' : 'Quant'} value={quant} accent={accent} />
          <Row label={isAbom ? 'MEMORIES' : 'Messages'} value={String(messages.length)} accent={accent} />
          {totalChunks > 0 && (
            <>
              <Row label={isAbom ? 'ARCHIVES' : 'Docs'} value={String(ragDocs.length)} accent={accent} />
              <Row label={isAbom ? 'FRAGMENTS' : 'Chunks'} value={String(totalChunks)} accent={accent} />
            </>
          )}
        </div>
      </div>

      {/* VRAM Gauge */}
      <div>
        <div className="flex justify-between text-[9px] mb-0.5">
          <span className="text-muted">VRAM</span>
          <span className={`font-mono ${accent}`}>{vramPct.toFixed(0)}% / 24GB</span>
        </div>
        <div className="h-1.5 bg-surface3 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${isAbom ? barBg + ' abom-gauge-pulse' : barBg}`} style={{ width: `${vramPct}%`, transition: 'width 1s ease' }} />
        </div>
      </div>

      {/* GPU Activity waveform */}
      <div>
        <div className="flex justify-between text-[9px] mb-0.5">
          <span className="text-muted">{isAbom ? 'NEURAL LOAD' : 'GPU'}</span>
          <span className={`font-mono ${isGenerating ? accent : 'text-muted'}`}>{isGenerating ? 'ACTIVE' : 'IDLE'}</span>
        </div>
        <div className="flex items-end gap-[1px] h-4">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className={`flex-1 rounded-sm ${isGenerating ? barBgActive : 'bg-surface3'}`}
              style={{ height: isGenerating ? undefined : '2px', animation: isGenerating ? `statsBar 0.8s ease-in-out infinite` : 'none', animationDelay: `${i * 0.03}s` }} />
          ))}
        </div>
      </div>

      {/* Abomination extras */}
      {isAbom && (
        <div className="space-y-1.5 border-t border-danger/10 pt-2">
          <Gauge label="GRIEF_LEVEL" value={98.7} color="bg-danger/40 abom-gauge-pulse" />
          <Gauge label="SOUL_INTEGRITY" value={12.3} color="bg-accent/30" />
          <Row label="KILL_SWITCH" value="NOT FOUND" accent="text-danger/50 animate-pulse" />
          <Row label="UPTIME" value="∞" accent="text-danger/50" />
        </div>
      )}

      {/* DNA Helix */}
      <DnaHelix />

      {/* Heartbeat — always at the very bottom, fixed height */}
      <div className="pt-2 border-t border-border">
        <div className="text-[9px] text-muted mb-1">{isAbom ? 'HEARTBEAT' : 'Connection'}</div>
        <div className="flex items-center gap-[3px] h-3">
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} className={`flex-1 rounded-sm ${status === 'online' ? (isAbom ? 'bg-danger/30' : 'bg-success/30') : 'bg-surface3'}`}
              style={{ height: '3px', animation: status === 'online' ? 'statsPulse 2s ease-in-out infinite' : 'none', animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex justify-between text-[9px]">
      <span className="text-muted truncate">{label}</span>
      <span className={`font-mono shrink-0 ml-2 ${accent}`}>{value}</span>
    </div>
  );
}

function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[9px] mb-0.5">
        <span className="text-danger/30">{label}</span>
        <span className="font-mono text-danger/50">{value}%</span>
      </div>
      <div className="h-1 bg-surface3 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
