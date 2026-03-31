import { describe, it, expect, beforeEach } from 'vitest'
import { useRagStore } from '../../src/store/ragStore'
import type { RagDoc } from '../../src/types'

const makeFakeDoc = (id: string, name: string): RagDoc => ({
  id,
  name,
  size: 1000,
  chunks: [{ text: 'chunk', embedding: [0.1], source: name, index: 0 }],
  addedAt: Date.now(),
})

describe('ragStore', () => {
  beforeEach(() => {
    useRagStore.setState({ docs: [], enabled: false })
  })

  it('starts with no docs and disabled', () => {
    const state = useRagStore.getState()
    expect(state.docs).toEqual([])
    expect(state.enabled).toBe(false)
  })

  it('adds a document', () => {
    const doc = makeFakeDoc('1', 'test.txt')
    useRagStore.getState().addDoc(doc)
    expect(useRagStore.getState().docs).toHaveLength(1)
    expect(useRagStore.getState().docs[0].name).toBe('test.txt')
  })

  it('removes a document by id', () => {
    const doc1 = makeFakeDoc('1', 'a.txt')
    const doc2 = makeFakeDoc('2', 'b.txt')
    useRagStore.getState().addDoc(doc1)
    useRagStore.getState().addDoc(doc2)
    useRagStore.getState().removeDoc('1')
    expect(useRagStore.getState().docs).toHaveLength(1)
    expect(useRagStore.getState().docs[0].id).toBe('2')
  })

  it('toggles enabled state', () => {
    useRagStore.getState().toggleEnabled()
    expect(useRagStore.getState().enabled).toBe(true)
    useRagStore.getState().toggleEnabled()
    expect(useRagStore.getState().enabled).toBe(false)
  })

  it('clears all docs', () => {
    useRagStore.getState().addDoc(makeFakeDoc('1', 'a.txt'))
    useRagStore.getState().addDoc(makeFakeDoc('2', 'b.txt'))
    useRagStore.getState().clearDocs()
    expect(useRagStore.getState().docs).toEqual([])
  })
})
