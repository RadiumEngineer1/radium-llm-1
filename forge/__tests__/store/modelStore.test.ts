import { describe, it, expect, beforeEach } from 'vitest'
import { useModelStore } from '../../src/store/modelStore'

describe('modelStore', () => {
  beforeEach(() => {
    useModelStore.setState({
      models: [],
      selectedModel: '',
      embedModel: '',
      status: 'connecting',
      statusText: 'Connecting...',
    })
  })

  it('starts with connecting status', () => {
    expect(useModelStore.getState().status).toBe('connecting')
  })

  it('sets selected model', () => {
    useModelStore.getState().setSelectedModel('llama3.3:70b')
    expect(useModelStore.getState().selectedModel).toBe('llama3.3:70b')
  })

  it('sets embed model', () => {
    useModelStore.getState().setEmbedModel('nomic-embed-text')
    expect(useModelStore.getState().embedModel).toBe('nomic-embed-text')
  })

  it('getActiveEmbedModel returns embedModel when set', () => {
    useModelStore.getState().setSelectedModel('llama3.3:70b')
    useModelStore.getState().setEmbedModel('nomic-embed-text')
    expect(useModelStore.getState().getActiveEmbedModel()).toBe('nomic-embed-text')
  })

  it('getActiveEmbedModel falls back to selectedModel', () => {
    useModelStore.getState().setSelectedModel('llama3.3:70b')
    useModelStore.getState().setEmbedModel('')
    expect(useModelStore.getState().getActiveEmbedModel()).toBe('llama3.3:70b')
  })
})
