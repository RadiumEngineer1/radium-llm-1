export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details?: {
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  ragSources?: RagChunk[];
  timestamp: number;
}

export interface EmbeddedChunk {
  text: string;
  embedding: number[];
  source: string;
  index: number;
}

export interface RagDoc {
  id: string;
  name: string;
  size: number;
  chunks: EmbeddedChunk[];
  addedAt: number;
}

export interface RagChunk extends EmbeddedChunk {
  score: number;
}

export interface GenerationParams {
  temperature: number;
  top_p: number;
  num_predict: number;
  top_k: number;
  repeat_penalty: number;
}

export type OllamaStatus = 'connecting' | 'online' | 'offline' | 'busy';
