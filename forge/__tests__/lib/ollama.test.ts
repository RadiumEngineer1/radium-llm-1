import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchModels, checkHealth, getEmbedding } from '../../src/lib/ollama'

describe('ollama API layer', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('checkHealth', () => {
    it('returns true when Ollama is reachable', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
      expect(await checkHealth()).toBe(true)
    })

    it('returns false when Ollama is unreachable', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')))
      expect(await checkHealth()).toBe(false)
    })
  })

  describe('fetchModels', () => {
    it('returns sorted model list', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          models: [
            { name: 'qwen2.5:72b', size: 100, digest: 'abc', modified_at: '' },
            { name: 'llama3.3:70b', size: 200, digest: 'def', modified_at: '' },
          ]
        })
      }))
      const models = await fetchModels()
      expect(models[0].name).toBe('llama3.3:70b')
      expect(models[1].name).toBe('qwen2.5:72b')
    })

    it('throws user-friendly error when offline', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fetch failed')))
      await expect(fetchModels()).rejects.toThrow('Ollama is not reachable')
    })
  })

  describe('getEmbedding', () => {
    it('returns embedding array', async () => {
      const fakeEmbedding = [0.1, 0.2, 0.3]
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ embedding: fakeEmbedding })
      }))
      const result = await getEmbedding('hello', 'nomic-embed-text')
      expect(result).toEqual(fakeEmbedding)
    })

    it('throws on API error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }))
      await expect(getEmbedding('hello', 'nomic-embed-text')).rejects.toThrow()
    })
  })
})
