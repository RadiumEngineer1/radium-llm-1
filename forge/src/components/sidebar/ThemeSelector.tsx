import { useThemeStore, THEMES } from '../../store/themeStore';

export default function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-muted uppercase tracking-wider">Theme</span>
      <div className="flex flex-wrap gap-1.5 ml-auto">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.name}
            className={`w-4 h-4 rounded-full transition-all ${theme === t.id ? 'ring-2 ring-white/40 scale-110' : 'hover:scale-110 opacity-60 hover:opacity-100'}`}
            style={{ backgroundColor: t.swatch }}
          />
        ))}
      </div>
    </div>
  );
}
