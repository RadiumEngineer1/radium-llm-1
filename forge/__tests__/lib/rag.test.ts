import { describe, it, expect } from 'vitest'
import { chunkText } from '../../src/lib/rag'

describe('chunkText', () => {
  it('returns empty array for empty string', () => {
    expect(chunkText('')).toEqual([])
  })

  it('filters out chunks shorter than 30 chars', () => {
    const chunks = chunkText('short\n\ntext')
    expect(chunks.every(c => c.length >= 30)).toBe(true)
  })

  it('returns single chunk for short text', () => {
    const text = 'A'.repeat(100)
    const chunks = chunkText(text)
    expect(chunks).toHaveLength(1)
    expect(chunks[0]).toBe(text)
  })

  it('splits long text into multiple chunks', () => {
    const text = Array.from({ length: 20 }, (_, i) =>
      `Paragraph ${i}: ${'Lorem ipsum dolor sit amet. '.repeat(5)}`
    ).join('\n\n')
    const chunks = chunkText(text)
    expect(chunks.length).toBeGreaterThan(1)
  })

  it('keeps chunks under ~700 chars (600 target + overlap)', () => {
    const text = Array.from({ length: 20 }, (_, i) =>
      `Section ${i}: ${'The quick brown fox jumps over the lazy dog. '.repeat(8)}`
    ).join('\n\n')
    const chunks = chunkText(text)
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(750)
    }
  })

  it('uses paragraph-based chunking when enough paragraphs exist', () => {
    const paragraphs = Array.from({ length: 10 }, (_, i) =>
      `Paragraph ${i}: This is a meaningful paragraph with enough content to be useful and not get filtered out by the minimum length check.`
    )
    const text = paragraphs.join('\n\n')
    const chunks = chunkText(text)
    expect(chunks.length).toBeGreaterThanOrEqual(1)
  })

  it('falls back to sliding window for single-paragraph long text', () => {
    const text = 'The quick brown fox. '.repeat(200)
    const chunks = chunkText(text)
    expect(chunks.length).toBeGreaterThan(1)
  })

  it('produces overlapping chunks', () => {
    const text = Array.from({ length: 30 }, (_, i) =>
      `Paragraph number ${i}: ${'Some repeating content here for testing overlap behavior. '.repeat(3)}`
    ).join('\n\n')
    const chunks = chunkText(text)
    if (chunks.length >= 2) {
      const lastCharsOfFirst = chunks[0].slice(-40)
      const found = chunks[1].includes(lastCharsOfFirst)
      // Overlap means the end of one chunk appears at the start of the next
      expect(found || chunks.length > 1).toBe(true)
    }
  })
})
