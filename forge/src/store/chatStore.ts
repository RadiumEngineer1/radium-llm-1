import { create } from 'zustand'
import type { ChatMessage } from '../types'
import { generateId } from '../lib/utils'

interface ChatStore {
  messages: ChatMessage[];
  isGenerating: boolean;
  abortController: AbortController | null;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
  updateLastAssistantMessage: (content: string) => void;
  updateLastAssistantThinking: (thinking: string) => void;
  clearChat: () => void;
  setGenerating: (v: boolean, abort?: AbortController) => void;
  cancelGeneration: () => void;
}

export const useChatStore = create<ChatStore>()((set, get) => ({
  messages: [],
  isGenerating: false,
  abortController: null,

  addMessage: (msg) => {
    const full: ChatMessage = {
      ...msg,
      id: generateId(),
      timestamp: Date.now(),
    }
    set((state) => ({ messages: [...state.messages, full] }))
    return full
  },

  updateLastAssistantMessage: (content) => {
    set((state) => {
      const msgs = [...state.messages]
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === 'assistant') {
          msgs[i] = { ...msgs[i], content }
          break
        }
      }
      return { messages: msgs }
    })
  },

  updateLastAssistantThinking: (thinking) => {
    set((state) => {
      const msgs = [...state.messages]
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === 'assistant') {
          msgs[i] = { ...msgs[i], thinking }
          break
        }
      }
      return { messages: msgs }
    })
  },

  clearChat: () => set({ messages: [] }),

  setGenerating: (v, abort) =>
    set({ isGenerating: v, abortController: abort ?? null }),

  cancelGeneration: () => {
    const { abortController } = get()
    abortController?.abort()
    set({ isGenerating: false, abortController: null })
  },
}))
