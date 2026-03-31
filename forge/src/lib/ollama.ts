import type { OllamaModel } from '../types';

const BASE_URL = import.meta.env.DEV ? '/ollama' : 'http://localhost:11434';

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(BASE_URL);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchModels(): Promise<OllamaModel[]> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/tags`);
  } catch {
    throw new Error('Ollama is not reachable. Make sure "ollama serve" is running.');
  }

  const data = await res.json();
  const models: OllamaModel[] = data.models ?? [];
  return models.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getEmbedding(text: string, model: string): Promise<number[]> {
  const res = await fetch(`${BASE_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt: text }),
  });

  if (!res.ok) {
    throw new Error(`Embedding failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.embedding;
}

export interface StreamChatParams {
  model: string;
  messages: { role: string; content: string }[];
  temperature: number;
  top_p: number;
  num_predict: number;
  repeat_penalty: number;
  signal?: AbortSignal;
}

export async function* streamChat(params: StreamChatParams): AsyncGenerator<string> {
  const { model, messages, signal, ...options } = params;

  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      options: {
        temperature: options.temperature,
        top_p: options.top_p,
        num_predict: options.num_predict,
        repeat_penalty: options.repeat_penalty,
      },
    }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Chat failed: ${res.status} ${res.statusText}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const data = JSON.parse(line);
        if (data.message?.content !== undefined && data.message.content !== '') {
          yield data.message.content;
        }
        if (data.done) return;
      } catch {
        // skip malformed lines
      }
    }
  }
}
