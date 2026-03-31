import { useSettingsStore } from '../../store/settingsStore';

export default function SystemPrompt() {
  const { systemPrompt, setSystemPrompt } = useSettingsStore();

  return (
    <div>
      <label className="text-xs text-muted mb-1 block">System Prompt</label>
      <textarea
        value={systemPrompt}
        onChange={e => setSystemPrompt(e.target.value)}
        rows={3}
        className="w-full bg-surface2 border border-border rounded px-2 py-1.5 text-xs text-[rgb(var(--color-text))] outline-none focus:border-accent resize-none"
        placeholder="Leave empty to use model's built-in persona (e.g. Abomination). Type here to override."
      />
    </div>
  );
}
