import { create } from 'zustand'
import type { RagDoc } from '../types'

interface RagStore {
  docs: RagDoc[];
  enabled: boolean;
  addDoc: (doc: RagDoc) => void;
  removeDoc: (id: string) => void;
  toggleEnabled: () => void;
  clearDocs: () => void;
}

export const useRagStore = create<RagStore>()((set) => ({
  docs: [],
  enabled: false,

  addDoc: (doc) => set((state) => ({ docs: [...state.docs, doc] })),
  removeDoc: (id) => set((state) => ({ docs: state.docs.filter(d => d.id !== id) })),
  toggleEnabled: () => set((state) => ({ enabled: !state.enabled })),
  clearDocs: () => set({ docs: [] }),
}))
