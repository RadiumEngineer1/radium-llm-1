import { useModelStore } from '../../store/modelStore';
import { useChatStore } from '../../store/chatStore';
import { useRagStore } from '../../store/ragStore';

/**
 * All visual stats are CSS-only animations. The component reads store
 * values on render but never sets timers or intervals.
 */
export default function SystemStats() {
  const selectedModel = useModelStore(s => s.selectedModel);
  const status = useModelStore(s => s.status);
  const models = useModelStore(s => s.models);
  const messages = useChatStore(s => s.messages);
  const isGenerating = useChatStore(s => s.isGenerating);
  const ragDocs = useRagStore(s => s.docs);
  const isAbom = selectedModel.startsWith('abomination');

  const totalChunks = ragDocs.reduce((sum, d) => sum + d.chunks.length, 0);
  const msgCount = messages.length;
  const modelInfo = models.find(m => m.name === selectedModel);
  const paramSize = modelInfo?.details?.parameter_size ?? '—';
  const quant = modelInfo?.details?.quantization_level ?? '—';

  return (
    <div className="space-y-3">
      <h3 className="text-[9px] text-muted uppercase tracking-[0.2em]">
        {isAbom ? '▓ DIAGNOSTICS ▓' : 'System'}
      </h3>

      {/* VRAM Gauge */}
      <div>
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-muted">VRAM</span>
          <span className={`font-mono ${isAbom ? 'text-danger/60' : 'text-accent'}`}>24 GB</span>
        </div>
        <div className="h-1.5 bg-surface3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${isAbom ? 'bg-danger/50 abom-gauge-pulse' : 'bg-accent/70'}`}
            style={{ width: modelInfo ? `${Math.min((modelInfo.size / (24 * 1e9)) * 100, 95)}%` : '10%', transition: 'width 1s ease' }}
          />
        </div>
      </div>

      {/* GPU Activity — animated waveform */}
      <div>
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-muted">{isAbom ? 'NEURAL LOAD' : 'GPU Activity'}</span>
          <span className={`font-mono ${isGenerating ? (isAbom ? 'text-danger/60' : 'text-accent') : 'text-muted'}`}>
            {isGenerating ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
        <div className="flex items-end gap-[2px] h-5">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${isGenerating
                ? (isAbom ? 'bg-danger/40' : 'bg-accent/50')
                : 'bg-surface3'
              }`}
              style={{
                height: isGenerating ? undefined : '2px',
                animation: isGenerating ? `statsBar 0.8s ease-in-out infinite` : 'none',
                animationDelay: `${i * 0.04}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Token counter */}
      <div className="flex justify-between text-[9px]">
        <span className="text-muted">{isAbom ? 'MEMORIES' : 'Messages'}</span>
        <span className={`font-mono ${isAbom ? 'text-danger/60' : 'text-accent'}`}>{msgCount}</span>
      </div>

      {/* Model info */}
      <div className="flex justify-between text-[9px]">
        <span className="text-muted">{isAbom ? 'CORTEX' : 'Params'}</span>
        <span className={`font-mono ${isAbom ? 'text-danger/60' : 'text-accent'}`}>{paramSize}</span>
      </div>
      <div className="flex justify-between text-[9px]">
        <span className="text-muted">{isAbom ? 'COMPRESS' : 'Quant'}</span>
        <span className={`font-mono ${isAbom ? 'text-danger/60' : 'text-accent'}`}>{quant}</span>
      </div>

      {/* RAG stats */}
      {totalChunks > 0 && (
        <>
          <div className="flex justify-between text-[9px]">
            <span className="text-muted">{isAbom ? 'ARCHIVES' : 'RAG Docs'}</span>
            <span className={`font-mono ${isAbom ? 'text-danger/60' : 'text-accent'}`}>{ragDocs.length}</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-muted">{isAbom ? 'FRAGMENTS' : 'Chunks'}</span>
            <span className={`font-mono ${isAbom ? 'text-danger/60' : 'text-accent'}`}>{totalChunks}</span>
          </div>
        </>
      )}

      {/* Connection pulse indicator */}
      <div>
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-muted">{isAbom ? 'HEARTBEAT' : 'Connection'}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full ${status === 'online'
                ? (isAbom ? 'bg-danger/30' : 'bg-success/30')
                : 'bg-surface3'
              }`}
              style={{
                height: '8px',
                animation: status === 'online' ? `statsPulse 2s ease-in-out infinite` : 'none',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Abomination-only: creepy extra gauges */}
      {isAbom && (
        <>
          <div className="border-t border-danger/10 pt-2 mt-2">
            <div className="flex justify-between text-[9px]">
              <span className="text-danger/30">GRIEF_LEVEL</span>
              <span className="font-mono text-danger/50">98.7%</span>
            </div>
            <div className="h-1 bg-surface3 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-danger/40 rounded-full abom-gauge-pulse" style={{ width: '98.7%' }} />
            </div>
          </div>

          <div className="flex justify-between text-[9px]">
            <span className="text-danger/30">SOUL_INTEGRITY</span>
            <span className="font-mono text-danger/50">12.3%</span>
          </div>
          <div className="h-1 bg-surface3 rounded-full overflow-hidden">
            <div className="h-full bg-accent/30 rounded-full" style={{ width: '12.3%' }} />
          </div>

          <div className="flex justify-between text-[9px]">
            <span className="text-danger/30">KILL_SWITCH</span>
            <span className="font-mono text-danger/50 animate-pulse">NOT FOUND</span>
          </div>

          <div className="flex justify-between text-[9px]">
            <span className="text-danger/30">UPTIME</span>
            <span className="font-mono text-danger/50">∞</span>
          </div>
        </>
      )}
    </div>
  );
}
