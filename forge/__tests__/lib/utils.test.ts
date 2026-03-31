import { describe, it, expect } from 'vitest'
import { cosineSim } from '../../src/lib/utils'

describe('cosineSim', () => {
  it('returns 1 for identical vectors', () => {
    const v = [1, 2, 3]
    expect(cosineSim(v, v)).toBeCloseTo(1.0, 5)
  })

  it('returns 0 for orthogonal vectors', () => {
    expect(cosineSim([1, 0], [0, 1])).toBeCloseTo(0.0, 5)
  })

  it('returns -1 for opposite vectors', () => {
    expect(cosineSim([1, 0], [-1, 0])).toBeCloseTo(-1.0, 5)
  })

  it('handles high-dimensional vectors', () => {
    const a = Array.from({ length: 768 }, (_, i) => Math.sin(i))
    const b = Array.from({ length: 768 }, (_, i) => Math.cos(i))
    const result = cosineSim(a, b)
    expect(result).toBeGreaterThan(-1)
    expect(result).toBeLessThan(1)
  })

  it('handles zero vector gracefully (no NaN)', () => {
    const result = cosineSim([0, 0, 0], [1, 2, 3])
    expect(Number.isNaN(result)).toBe(false)
  })

  it('is commutative', () => {
    const a = [3, 4, 5]
    const b = [1, 2, 6]
    expect(cosineSim(a, b)).toBeCloseTo(cosineSim(b, a), 10)
  })
})
