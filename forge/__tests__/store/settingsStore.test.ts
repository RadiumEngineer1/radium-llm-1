import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../../src/store/settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      params: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 2048,
        top_k: 4,
        repeat_penalty: 1.1,
      },
      systemPrompt: 'You are a helpful, direct, and knowledgeable assistant. Answer clearly and concisely. When using retrieved context, cite the source.',
    })
  })

  it('has correct default params', () => {
    const { params } = useSettingsStore.getState()
    expect(params.temperature).toBe(0.7)
    expect(params.top_p).toBe(0.9)
    expect(params.num_predict).toBe(2048)
    expect(params.top_k).toBe(4)
    expect(params.repeat_penalty).toBe(1.1)
  })

  it('updates a single param', () => {
    useSettingsStore.getState().updateParam('temperature', 1.5)
    expect(useSettingsStore.getState().params.temperature).toBe(1.5)
  })

  it('preserves other params when updating one', () => {
    useSettingsStore.getState().updateParam('temperature', 1.5)
    expect(useSettingsStore.getState().params.top_p).toBe(0.9)
  })

  it('updates system prompt', () => {
    useSettingsStore.getState().setSystemPrompt('Be concise.')
    expect(useSettingsStore.getState().systemPrompt).toBe('Be concise.')
  })
})
