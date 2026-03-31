import type { RagDoc, RagChunk, EmbeddedChunk } from '../types';
import { getEmbedding } from './ollama';
import { cosineSim, readFileAsText, generateId } from './utils';

const CHUNK_SIZE = 600;
const OVERLAP = 80;
const MIN_CHUNK = 30;

export function chunkText(text: string): string[] {
  if (!text.trim()) return [];

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

  let rawChunks: string[];

  if (paragraphs.length > 3) {
    rawChunks = paragraphChunk(paragraphs);
  } else {
    rawChunks = slidingWindowChunk(text);
  }

  return rawChunks.filter(c => c.length >= MIN_CHUNK);
}

function paragraphChunk(paragraphs: string[]): string[] {
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if (current.length + para.length + 2 > CHUNK_SIZE && current.length > 0) {
      chunks.push(current.trim());
      const overlap = current.slice(-OVERLAP);
      current = overlap + '\n\n' + para;
    } else {
      current = current ? current + '\n\n' + para : para;
    }
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

function slidingWindowChunk(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    chunks.push(text.slice(start, end));
    if (end >= text.length) break;
    start += CHUNK_SIZE - OVERLAP;
  }

  return chunks;
}

export async function embedDoc(
  file: File,
  model: string,
  onProgress?: (current: number, total: number) => void,
): Promise<RagDoc> {
  const text = await readFileAsText(file);
  const chunks = chunkText(text);
  const embedded: EmbeddedChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await getEmbedding(chunks[i], model);
    embedded.push({
      text: chunks[i],
      embedding,
      source: file.name,
      index: i,
    });
    onProgress?.(i + 1, chunks.length);
  }

  return {
    id: generateId(),
    name: file.name,
    size: file.size,
    chunks: embedded,
    addedAt: Date.now(),
  };
}

export async function searchDocs(
  query: string,
  docs: RagDoc[],
  model: string,
  topK: number,
): Promise<RagChunk[]> {
  const queryEmbedding = await getEmbedding(query, model);

  const scored: RagChunk[] = [];
  for (const doc of docs) {
    for (const chunk of doc.chunks) {
      scored.push({
        ...chunk,
        score: cosineSim(queryEmbedding, chunk.embedding),
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
