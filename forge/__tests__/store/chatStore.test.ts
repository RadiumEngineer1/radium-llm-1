import { describe, it, expect, beforeEach } from 'vitest'
import { useChatStore } from '../../src/store/chatStore'

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({
      messages: [],
      isGenerating: false,
      abortController: null,
    })
  })

  it('starts with empty messages', () => {
    expect(useChatStore.getState().messages).toEqual([])
  })

  it('adds a user message', () => {
    const msg = useChatStore.getState().addMessage({ role: 'user', content: 'Hello' })
    expect(msg.role).toBe('user')
    expect(msg.content).toBe('Hello')
    expect(msg.id).toBeDefined()
    expect(msg.timestamp).toBeGreaterThan(0)
    expect(useChatStore.getState().messages).toHaveLength(1)
  })

  it('adds an assistant message', () => {
    useChatStore.getState().addMessage({ role: 'assistant', content: '' })
    expect(useChatStore.getState().messages).toHaveLength(1)
    expect(useChatStore.getState().messages[0].role).toBe('assistant')
  })

  it('updates last assistant message content (streaming)', () => {
    useChatStore.getState().addMessage({ role: 'user', content: 'Hi' })
    useChatStore.getState().addMessage({ role: 'assistant', content: '' })
    useChatStore.getState().updateLastAssistantMessage('Hello!')
    const msgs = useChatStore.getState().messages
    expect(msgs[1].content).toBe('Hello!')
  })

  it('does not crash when updating with no assistant message', () => {
    useChatStore.getState().addMessage({ role: 'user', content: 'Hi' })
    expect(() => {
      useChatStore.getState().updateLastAssistantMessage('test')
    }).not.toThrow()
  })

  it('clears all messages', () => {
    useChatStore.getState().addMessage({ role: 'user', content: 'Hi' })
    useChatStore.getState().addMessage({ role: 'assistant', content: 'Hello' })
    useChatStore.getState().clearChat()
    expect(useChatStore.getState().messages).toEqual([])
  })

  it('sets generating state with abort controller', () => {
    const controller = new AbortController()
    useChatStore.getState().setGenerating(true, controller)
    expect(useChatStore.getState().isGenerating).toBe(true)
    expect(useChatStore.getState().abortController).toBe(controller)
  })

  it('cancels generation via abort controller', () => {
    const controller = new AbortController()
    useChatStore.getState().setGenerating(true, controller)
    useChatStore.getState().cancelGeneration()
    expect(controller.signal.aborted).toBe(true)
    expect(useChatStore.getState().isGenerating).toBe(false)
  })
})
