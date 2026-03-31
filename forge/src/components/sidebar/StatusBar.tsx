import { useModelStore } from '../../store/modelStore';

const statusColors: Record<string, string> = {
  online: 'bg-success',
  connecting: 'bg-accent2 animate-pulse',
  offline: 'bg-danger',
  busy: 'bg-accent animate-pulse',
};

export default function StatusBar() {
  const { status, statusText } = useModelStore();

  return (
    <div className="px-4 py-2 border-t border-border flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${statusColors[status] ?? 'bg-muted'}`} />
      <span className="text-[10px] text-muted truncate">{statusText}</span>
    </div>
  );
}
