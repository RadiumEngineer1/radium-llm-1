import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GenerationParams } from '../types'

const defaultParams: GenerationParams = {
  temperature: 0.7,
  top_p: 0.9,
  num_predict: 2048,
  top_k: 4,
  repeat_penalty: 1.1,
}

const defaultSystemPrompt = ''

interface SettingsStore {
  params: GenerationParams;
  systemPrompt: string;
  updateParam: <K extends keyof GenerationParams>(key: K, value: GenerationParams[K]) => void;
  setSystemPrompt: (v: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      params: defaultParams,
      systemPrompt: defaultSystemPrompt,
      updateParam: (key, value) =>
        set((state) => ({
          params: { ...state.params, [key]: value },
        })),
      setSystemPrompt: (v) => set({ systemPrompt: v }),
    }),
    {
      name: 'forge-settings-v2',
    }
  )
)
