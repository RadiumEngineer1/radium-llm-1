import { create } from 'zustand'
import type { OllamaModel, OllamaStatus } from '../types'
import { fetchModels } from '../lib/ollama'

const EMBED_MODEL_NAMES = ['nomic-embed-text', 'mxbai-embed-large']

interface ModelStore {
  models: OllamaModel[];
  selectedModel: string;
  embedModel: string;
  status: OllamaStatus;
  statusText: string;
  loadModels: () => Promise<void>;
  setSelectedModel: (name: string) => void;
  setEmbedModel: (name: string) => void;
  getActiveEmbedModel: () => string;
}

export const useModelStore = create<ModelStore>()((set, get) => ({
  models: [],
  selectedModel: '',
  embedModel: '',
  status: 'connecting',
  statusText: 'Connecting...',

  loadModels: async () => {
    try {
      set({ status: 'connecting', statusText: 'Connecting...' })
      const models = await fetchModels()
      const embedModel = models.find(m =>
        EMBED_MODEL_NAMES.some(e => m.name.startsWith(e))
      )
      set({
        models,
        selectedModel: models[0]?.name ?? '',
        embedModel: embedModel?.name ?? '',
        status: 'online',
        statusText: `${models.length} model${models.length === 1 ? '' : 's'} available`,
      })
    } catch {
      set({
        models: [],
        status: 'offline',
        statusText: 'Ollama offline — run "ollama serve"',
      })
    }
  },

  setSelectedModel: (name) => set({ selectedModel: name }),
  setEmbedModel: (name) => set({ embedModel: name }),

  getActiveEmbedModel: () => {
    const { embedModel, selectedModel } = get()
    return embedModel || selectedModel
  },
}))
