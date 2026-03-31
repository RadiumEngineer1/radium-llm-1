import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeId = 'forge' | 'cyberpunk' | 'military' | 'terminal' | 'ocean';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  swatch: string; // preview color for the dot
}

export const THEMES: ThemeMeta[] = [
  { id: 'forge',     name: 'Forge',     swatch: '#ff6b2b' },
  { id: 'cyberpunk', name: 'Cyberpunk', swatch: '#00f0ff' },
  { id: 'military',  name: 'Military',  swatch: '#d4a520' },
  { id: 'terminal',  name: 'Terminal',  swatch: '#33ff33' },
  { id: 'ocean',     name: 'Ocean',     swatch: '#00d4ff' },
];

interface ThemeStore {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'forge',
      setTheme: (id) => {
        document.documentElement.dataset.theme = id;
        set({ theme: id });
      },
    }),
    {
      name: 'forge-theme',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.dataset.theme = state.theme;
        }
      },
    }
  )
);
