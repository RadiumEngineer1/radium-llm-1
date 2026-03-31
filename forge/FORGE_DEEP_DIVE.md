# FORGE Deep Dive — Line-by-Line Teaching Guide

This document walks through every major file in the FORGE project, explaining what each block of code does, why it exists, and how it connects to the rest of the system. Read this alongside the actual source files.

---

## Table of Contents

1. [How Data Flows Through FORGE](#1-how-data-flows-through-forge)
2. [Types — The Shape of Everything](#2-types--the-shape-of-everything)
3. [Utils — Pure Math and Helpers](#3-utils--pure-math-and-helpers)
4. [Ollama API Layer — Talking to the LLM](#4-ollama-api-layer--talking-to-the-llm)
5. [RAG Pipeline — Making the LLM Know Your Files](#5-rag-pipeline--making-the-llm-know-your-files)
6. [Zustand Stores — The App's Brain](#6-zustand-stores--the-apps-brain)
7. [The Send Flow — Tying It All Together](#7-the-send-flow--tying-it-all-together)
8. [React Components — What the User Sees](#8-react-components--what-the-user-sees)
9. [Config Files — The Plumbing](#9-config-files--the-plumbing)

---

## 1. How Data Flows Through FORGE

Before diving into code, understand the full lifecycle of a single chat message:

```
User types "What is a transformer?"
        │
        ▼
   InputArea.tsx captures the text
        │
        ▼
   useSendMessage() hook fires
        │
        ├─── If RAG is ON: embed the query, search all doc chunks,
        │    find the top-K most similar, build a context string
        │
        ▼
   Build the messages array:
     [system prompt + RAG context, ...chat history, user message]
        │
        ▼
   ollama.streamChat() sends a POST to Ollama at localhost:11434
        │
        ▼
   Ollama runs inference on the GPU (your RTX 4090)
        │
        ▼
   Tokens stream back one at a time via ReadableStream
        │
        ▼
   Each token appended to fullText → chatStore updated → React re-renders
        │
        ▼
   User sees the response appear word by word
```

Every file we'll look at plays a role in this pipeline.

---

## 2. Types — The Shape of Everything

**File: `src/types/index.ts`**

This file defines the TypeScript interfaces that every other file imports. Think of it as the contract — if you change a type here, TypeScript will tell you everywhere that breaks.

```ts
export interface OllamaModel {
  name: string;              // "llama3.2:latest", "qwen3.5:27b"
  size: number;              // Size in bytes on disk
  digest: string;            // SHA256 hash identifying this exact model file
  modified_at: string;       // ISO timestamp of when model was last updated
  details?: {                // Optional — not all Ollama versions return this
    family: string;          // "llama", "qwen", "nomic-bert"
    parameter_size: string;  // "3.2B", "70.6B"
    quantization_level: string; // "Q4_K_M", "F16"
  };
}
```
**Why it matters:** When you call Ollama's `/api/tags` endpoint, it returns an array of these. The `details` field tells you parameter count and quantization — useful for knowing if a model fits in VRAM.

```ts
export interface ChatMessage {
  id: string;                           // crypto.randomUUID() — unique per message
  role: 'user' | 'assistant' | 'system'; // Who said it
  content: string;                       // The actual text
  ragSources?: RagChunk[];              // Which file chunks were used (if RAG was on)
  timestamp: number;                     // Date.now() when created
}
```
**Why it matters:** This is every bubble you see in the chat. The `role` field is critical — Ollama needs to know which messages are from the user vs. the assistant to maintain conversation context. `ragSources` is only present on assistant messages when RAG found relevant chunks.

```ts
export interface EmbeddedChunk {
  text: string;          // The actual text of this chunk ("Chapter 1: The fox jumped...")
  embedding: number[];   // A 768-dimensional vector (array of 768 floats)
  source: string;        // Which file this came from ("notes.txt")
  index: number;         // Position in the file (chunk 0, chunk 1, etc.)
}
```
**Why it matters:** This is the heart of RAG. When you upload a file, it gets split into chunks. Each chunk gets turned into an embedding — a vector of numbers that captures its *meaning*. Two chunks about similar topics will have similar vectors, even if the words are different.

```ts
export interface RagDoc {
  id: string;
  name: string;               // Filename
  size: number;                // File size in bytes
  chunks: EmbeddedChunk[];     // All embedded chunks from this file
  addedAt: number;             // When the user uploaded it
}
```
**Why it matters:** One uploaded file = one RagDoc containing many EmbeddedChunks. The doc list in the sidebar shows these.

```ts
export interface RagChunk extends EmbeddedChunk {
  score: number;    // Cosine similarity score (0 to 1, higher = more relevant)
}
```
**Why it matters:** When you search, each chunk gets a `score`. This extends EmbeddedChunk — it's the same chunk, but now with a relevance score attached. The top-K scored chunks get injected into the prompt.

```ts
export interface GenerationParams {
  temperature: number;      // 0–2. Higher = more creative/random. Lower = more focused.
  top_p: number;            // 0.1–1. Nucleus sampling. 0.9 means "consider tokens in the top 90% probability mass"
  num_predict: number;      // 256–8192. Maximum tokens the model can generate in one response
  top_k: number;            // 1–10. How many RAG chunks to retrieve (NOT the model's top_k sampling)
  repeat_penalty: number;   // 1.0–1.5. Penalizes the model for repeating itself
}
```
**Why it matters:** These map directly to the sliders in the sidebar. Each one controls a different aspect of how the LLM generates text.

```ts
export type OllamaStatus = 'connecting' | 'online' | 'offline' | 'busy';
```
**Why it matters:** Drives the colored dot in the status bar. Green = online, red = offline, yellow = connecting.

---

## 3. Utils — Pure Math and Helpers

**File: `src/lib/utils.ts`**

Three small functions. No dependencies on React or stores — pure logic.

### Cosine Similarity

```ts
export function cosineSim(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];    // Dot product: multiply corresponding elements and sum
    na  += a[i] * a[i];    // Squared magnitude of vector a
    nb  += b[i] * b[i];    // Squared magnitude of vector b
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-10);
  //                                            ^^^^^^
  //                               Tiny epsilon to prevent division by zero
}
```

**What this does:** Measures how similar two vectors are. Returns a number from -1 (opposite meaning) to 1 (identical meaning). This is the core math behind RAG search — when you ask a question, your question gets embedded into a vector, and this function compares it against every chunk's vector to find the most relevant ones.

**Example:** If your question embedding is `[0.8, 0.1, 0.5]` and a chunk about the same topic has embedding `[0.7, 0.2, 0.6]`, their cosine similarity will be close to 1.0. A chunk about something unrelated might score 0.1.

### ID Generator

```ts
export function generateId(): string {
  return crypto.randomUUID();  // Returns something like "3b241101-e2bb-4d7a-8613-e4b3b1c5a8d2"
}
```

**What this does:** Every message and document needs a unique ID. `crypto.randomUUID()` is a browser API that generates a UUID v4 — effectively guaranteed unique.

### File Reader

```ts
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();                    // Browser API for reading files
    reader.onload = () => resolve(reader.result as string);  // Success: resolve with text content
    reader.onerror = () => reject(reader.error);             // Failure: reject with error
    reader.readAsText(file);                                 // Start reading
  });
}
```

**What this does:** Wraps the old callback-based FileReader API in a Promise so we can use `await`. When a user drops a file in the RAG dropzone, this turns the File object into a string of text.

---

## 4. Ollama API Layer — Talking to the LLM

**File: `src/lib/ollama.ts`**

This is the bridge between FORGE and Ollama. Four functions that handle every API call.

### Base URL

```ts
const BASE_URL = import.meta.env.DEV ? '/ollama' : 'http://localhost:11434';
```

**What this does:** In development (`npm run dev`), API calls go to `/ollama` which Vite's proxy forwards to `localhost:11434`. This avoids CORS errors — the browser thinks it's talking to the same origin. In production (after `npm run build`), it calls Ollama directly.

### Health Check

```ts
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(BASE_URL);   // GET http://localhost:11434/
    return res.ok;                        // true if status 200
  } catch {
    return false;                         // Network error = Ollama not running
  }
}
```

**What this does:** Pings Ollama's root endpoint. Used by the 12-second health poll in App.tsx. If it was offline and comes back, FORGE auto-reloads the model list.

### Fetch Models

```ts
export async function fetchModels(): Promise<OllamaModel[]> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/tags`);   // GET /api/tags
  } catch {
    throw new Error('Ollama is not reachable. Make sure "ollama serve" is running.');
  }

  const data = await res.json();                   // Parse JSON response
  const models: OllamaModel[] = data.models ?? []; // Extract models array (default to empty)
  return models.sort((a, b) => a.name.localeCompare(b.name));  // Sort alphabetically
}
```

**What this does:** Gets the list of all models you've pulled with `ollama pull`. The response looks like `{ models: [{name: "llama3.2:latest", ...}, ...] }`. We sort them so the dropdown is consistent.

### Get Embedding

```ts
export async function getEmbedding(text: string, model: string): Promise<number[]> {
  const res = await fetch(`${BASE_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt: text }),   // Send the text to embed
  });

  if (!res.ok) {
    throw new Error(`Embedding failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.embedding;   // Returns number[] — typically 768 floats for nomic-embed-text
}
```

**What this does:** Sends a piece of text to Ollama and gets back a vector (array of numbers) that represents its meaning. This is called once per chunk when uploading a file, and once per query when searching. `nomic-embed-text` produces 768-dimensional vectors; chat models produce larger ones but are slower.

### Stream Chat — The Most Complex Function

```ts
export async function* streamChat(params: StreamChatParams): AsyncGenerator<string> {
```

**The `async function*` syntax** makes this an **async generator**. Instead of returning one value, it `yield`s multiple values over time — one per token from the LLM. The caller uses `for await (const chunk of streamChat(...))` to consume them.

```ts
  const { model, messages, signal, ...options } = params;
```

**Destructuring:** Pulls `model`, `messages`, and `signal` out of params. Everything else (`temperature`, `top_p`, etc.) goes into `options`. The `signal` is from an AbortController — it lets the user cancel mid-generation.

```ts
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,        // This is the key — tells Ollama to stream tokens
      options: {
        temperature: options.temperature,
        top_p: options.top_p,
        num_predict: options.num_predict,
        repeat_penalty: options.repeat_penalty,
      },
    }),
    signal,   // Pass the AbortSignal so fetch() aborts if user clicks cancel
  });
```

**What this does:** Sends the full conversation to Ollama with `stream: true`. Ollama starts generating and sends tokens back as newline-delimited JSON, one line per token.

```ts
  const reader = res.body!.getReader();    // Get a ReadableStream reader
  const decoder = new TextDecoder();        // Converts raw bytes to strings
  let buffer = '';                          // Holds incomplete lines between chunks
```

**What this does:** `res.body` is a ReadableStream — raw bytes flowing from the server. We need a reader to pull chunks from it, and a decoder to turn bytes into text. The buffer handles the case where a JSON line gets split across two network chunks.

```ts
  while (true) {
    const { done, value } = await reader.read();  // Pull the next chunk of bytes
    if (done) break;                                // Stream finished

    buffer += decoder.decode(value, { stream: true });  // Append decoded text to buffer
    const lines = buffer.split('\n');                    // Split on newlines
    buffer = lines.pop() ?? '';                          // Last element might be incomplete — keep it
```

**What this does:** Each `reader.read()` gives us a chunk of bytes. We decode them and split on newlines. The `lines.pop()` trick is important: if the last line doesn't end with `\n`, it's incomplete and we keep it in the buffer for the next iteration.

```ts
    for (const line of lines) {
      if (!line.trim()) continue;          // Skip empty lines
      try {
        const data = JSON.parse(line);     // Parse: {"message":{"content":"Hello"},"done":false}
        if (data.message?.content !== undefined && data.message.content !== '') {
          yield data.message.content;      // Yield the token text to the caller
        }
        if (data.done) return;             // Model finished generating — exit generator
      } catch {
        // Skip malformed JSON lines (network noise, etc.)
      }
    }
```

**What this does:** Each line from Ollama is JSON like `{"message":{"content":" world"},"done":false}`. We extract the content and `yield` it. The caller (useSendMessage) appends each yielded token to the growing response string and updates the UI. When `done: true`, the model is finished and we exit.

---

## 5. RAG Pipeline — Making the LLM Know Your Files

**File: `src/lib/rag.ts`**

RAG = Retrieval-Augmented Generation. Instead of asking the LLM to answer from memory, you find relevant information in your files and inject it into the prompt.

### Constants

```ts
const CHUNK_SIZE = 600;   // Target characters per chunk
const OVERLAP = 80;       // Characters of overlap between adjacent chunks
const MIN_CHUNK = 30;     // Chunks shorter than this get thrown away
```

**Why these numbers:** 600 chars is roughly 150 tokens — small enough to be precise, large enough to contain a complete thought. Overlap ensures that if a sentence spans a chunk boundary, it still appears in at least one chunk. 30 is the minimum to filter out garbage like blank lines or headers.

### Text Chunking

```ts
export function chunkText(text: string): string[] {
  if (!text.trim()) return [];   // Empty file = no chunks

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  //                       ^^^^^^^
  //        Split on double newlines (paragraph boundaries)
```

**Strategy decision:**

```ts
  let rawChunks: string[];

  if (paragraphs.length > 3) {
    rawChunks = paragraphChunk(paragraphs);    // Use paragraph-aware chunking
  } else {
    rawChunks = slidingWindowChunk(text);      // Fallback: dumb character-based chunking
  }

  return rawChunks.filter(c => c.length >= MIN_CHUNK);  // Drop tiny fragments
}
```

**What this does:** If the file has clear paragraph structure (>3 paragraphs), we chunk by paragraphs to preserve meaning. If it's one big blob of text (code, logs), we use a sliding window. Either way, tiny chunks get filtered out.

### Paragraph Chunking

```ts
function paragraphChunk(paragraphs: string[]): string[] {
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    // Would adding this paragraph exceed our target size?
    if (current.length + para.length + 2 > CHUNK_SIZE && current.length > 0) {
      chunks.push(current.trim());                 // Save the current chunk
      const overlap = current.slice(-OVERLAP);     // Take the last 80 chars
      current = overlap + '\n\n' + para;           // Start new chunk with overlap + new paragraph
    } else {
      current = current ? current + '\n\n' + para : para;  // Keep accumulating
    }
  }

  if (current.trim().length > 0) {
    chunks.push(current.trim());   // Don't forget the last chunk
  }

  return chunks;
}
```

**What this does:** Walks through paragraphs, accumulating them into a chunk. When adding the next paragraph would exceed 600 chars, it saves the chunk and starts a new one. The overlap (last 80 chars of the previous chunk) gets prepended to the new chunk so context isn't lost at boundaries.

### Sliding Window Chunking

```ts
function slidingWindowChunk(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);  // Take 600 chars
    chunks.push(text.slice(start, end));
    if (end >= text.length) break;
    start += CHUNK_SIZE - OVERLAP;    // Move forward by 520 chars (600 - 80 overlap)
  }

  return chunks;
}
```

**What this does:** Simpler than paragraph chunking. Just slides a 600-char window across the text, advancing by 520 chars each time (leaving 80 chars of overlap). Used for code files or other text without paragraph structure.

### Embed a Document

```ts
export async function embedDoc(
  file: File,
  model: string,
  onProgress?: (current: number, total: number) => void,
): Promise<RagDoc> {
  const text = await readFileAsText(file);     // File → string
  const chunks = chunkText(text);               // string → string[]
  const embedded: EmbeddedChunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await getEmbedding(chunks[i], model);   // string → number[768]
    embedded.push({
      text: chunks[i],
      embedding,
      source: file.name,
      index: i,
    });
    onProgress?.(i + 1, chunks.length);   // Update the UI progress counter (e.g., "3/12")
  }
```

**Why sequential (not parallel):** Each `getEmbedding` call sends text to Ollama and waits for the vector back. We do them one at a time because Ollama processes one request at a time — sending 50 in parallel would just queue them all and might cause timeouts.

```ts
  return {
    id: generateId(),
    name: file.name,
    size: file.size,
    chunks: embedded,
    addedAt: Date.now(),
  };
}
```

**What this does:** Returns a complete `RagDoc` with all chunks embedded. This gets stored in ragStore and displayed in the sidebar doc list.

### Search Documents

```ts
export async function searchDocs(
  query: string,
  docs: RagDoc[],
  model: string,
  topK: number,
): Promise<RagChunk[]> {
  const queryEmbedding = await getEmbedding(query, model);   // Embed the user's question

  const scored: RagChunk[] = [];
  for (const doc of docs) {              // Loop every document
    for (const chunk of doc.chunks) {    // Loop every chunk in every document
      scored.push({
        ...chunk,
        score: cosineSim(queryEmbedding, chunk.embedding),  // How similar is this chunk to the question?
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);   // Sort: highest similarity first
  return scored.slice(0, topK);                // Return only the top K chunks
}
```

**What this does:** This is the "retrieval" in Retrieval-Augmented Generation. Embeds the user's question, compares it against every stored chunk using cosine similarity, and returns the most relevant ones. These chunks get injected into the system prompt so the LLM can reference them.

---

## 6. Zustand Stores — The App's Brain

Zustand is a state management library. Each store is a single JavaScript object that holds state and functions to modify it. When state changes, any React component subscribed to that slice re-renders.

### Settings Store

**File: `src/store/settingsStore.ts`**

```ts
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
```

**`create`** creates a Zustand store. **`persist`** wraps it so state is saved to `localStorage` — your settings survive page refreshes.

```ts
      params: defaultParams,       // Initial state: temperature 0.7, top_p 0.9, etc.
      systemPrompt: defaultSystemPrompt,

      updateParam: (key, value) =>
        set((state) => ({
          params: { ...state.params, [key]: value },
          //        ^^^^^^^^^^^^^^^^
          //  Spread: copy all existing params, then override just one key
        })),
```

**What `...state.params` does:** Creates a shallow copy of the params object with one value changed. This is immutable state update — we never mutate the existing object, we create a new one. React detects the new object reference and re-renders.

```ts
    { name: 'forge-settings' }   // localStorage key name
```

**What this does:** Zustand's `persist` middleware serializes the store to `localStorage` under this key. Open DevTools → Application → Local Storage to see it.

### Chat Store

**File: `src/store/chatStore.ts`**

```ts
export const useChatStore = create<ChatStore>()((set, get) => ({
```

**`set` and `get`:** `set` updates state (triggers re-renders). `get` reads current state without subscribing. We need `get` in `cancelGeneration` to access the abort controller.

```ts
  addMessage: (msg) => {
    const full: ChatMessage = {
      ...msg,
      id: generateId(),        // Generate unique ID
      timestamp: Date.now(),   // Current time
    }
    set((state) => ({ messages: [...state.messages, full] }))
    //                          ^^^^^^^^^^^^^^^^^^^^^^^
    //              New array with all existing messages + the new one
    return full   // Return the full message so the caller has the ID
  },
```

**Why return the message:** The send flow needs the assistant message's ID to later attach RAG sources to it or remove it if the response was empty.

```ts
  updateLastAssistantMessage: (content) => {
    set((state) => {
      const msgs = [...state.messages]          // Copy the array
      for (let i = msgs.length - 1; i >= 0; i--) {   // Walk backwards
        if (msgs[i].role === 'assistant') {
          msgs[i] = { ...msgs[i], content }     // Replace content (immutable)
          break                                   // Stop at the first (most recent) assistant msg
        }
      }
      return { messages: msgs }
    })
  },
```

**What this does:** During streaming, we call this function on every token. It finds the last assistant message and updates its content. Walking backwards is an optimization — the last assistant message is always near the end.

```ts
  cancelGeneration: () => {
    const { abortController } = get()   // Read current state (no subscription)
    abortController?.abort()            // Signal the fetch() to abort
    set({ isGenerating: false, abortController: null })
  },
```

**What this does:** When the user clicks the stop button, this aborts the HTTP request mid-stream. The `fetch()` in `streamChat` will throw an `AbortError`, which the send flow catches gracefully.

### Model Store

**File: `src/store/modelStore.ts`**

```ts
const EMBED_MODEL_NAMES = ['nomic-embed-text', 'mxbai-embed-large']
```

**What this does:** When loading models, if we find one with a name starting with these strings, we auto-select it as the embedding model. These are dedicated embedding models that are much faster and produce better vectors than using a chat model for embeddings.

```ts
  loadModels: async () => {
    try {
      set({ status: 'connecting', statusText: 'Connecting...' })
      const models = await fetchModels()
      const embedModel = models.find(m =>
        EMBED_MODEL_NAMES.some(e => m.name.startsWith(e))
      )
      set({
        models,
        selectedModel: models[0]?.name ?? '',        // Auto-select first model
        embedModel: embedModel?.name ?? '',          // Auto-select embed model if found
        status: 'online',
        statusText: `${models.length} model${models.length === 1 ? '' : 's'} available`,
      })
    } catch {
      set({
        models: [],
        status: 'offline',
        statusText: 'Ollama offline — run "ollama serve"',
      })
    }
  },
```

**What this does:** Called on app load and when reconnecting. Fetches all models, auto-selects sensible defaults, and updates the status bar. If Ollama is unreachable, sets status to offline.

```ts
  getActiveEmbedModel: () => {
    const { embedModel, selectedModel } = get()
    return embedModel || selectedModel   // Fallback: use chat model for embeddings
  },
```

**What this does:** If the user hasn't selected a dedicated embedding model (or none is available), fall back to the chat model. Chat models *can* produce embeddings, just slower.

---

## 7. The Send Flow — Tying It All Together

**File: `src/hooks/useSendMessage.ts`**

This is the most important file in the app. It orchestrates everything: stores, RAG, streaming, error handling.

### Setup: Pull Everything from Stores

```ts
export function useSendMessage() {
  const addMessage = useChatStore(s => s.addMessage);
  const updateLastAssistantMessage = useChatStore(s => s.updateLastAssistantMessage);
  const setGenerating = useChatStore(s => s.setGenerating);
  const messages = useChatStore(s => s.messages);
  const selectedModel = useModelStore(s => s.selectedModel);
  const getActiveEmbedModel = useModelStore(s => s.getActiveEmbedModel);
  const params = useSettingsStore(s => s.params);
  const systemPrompt = useSettingsStore(s => s.systemPrompt);
  const ragEnabled = useRagStore(s => s.enabled);
  const ragDocs = useRagStore(s => s.docs);
  const addToast = useToastStore(s => s.addToast);
```

**What `s => s.addMessage` does:** This is a Zustand selector. Instead of subscribing to the entire store (which would re-render on any change), we subscribe to just this one slice. This is a performance optimization — the component only re-renders when the specific value it cares about changes.

### The Send Function

```ts
  const send = async (userText: string) => {
    if (!userText.trim()) return;          // Ignore empty messages
    if (!selectedModel) {
      addToast('No model selected. Pick a model from the sidebar.', 'error');
      return;
    }

    addMessage({ role: 'user', content: userText.trim() });   // Add user bubble to chat
```

### RAG Context Injection

```ts
    let ragContext = '';
    let ragChunks: RagChunk[] = [];
    if (ragEnabled && ragDocs.length > 0) {
      try {
        ragChunks = await searchDocs(userText, ragDocs, getActiveEmbedModel(), params.top_k);
        if (ragChunks.length > 0) {
          ragContext = '\n\n## Retrieved Context\n' +
            ragChunks.map((c, i) => `[${i + 1}] (${c.source}): ${c.text}`).join('\n\n');
        }
```

**What this does:** If RAG is enabled with uploaded docs, it searches for relevant chunks. The found chunks get formatted into a string like:

```
## Retrieved Context
[1] (notes.txt): The transformer architecture was introduced in...
[2] (paper.md): Attention mechanisms allow the model to...
```

This string gets appended to the system prompt, so the LLM sees the relevant file content as part of its instructions.

### Build the Message Array

```ts
    const systemMsg = { role: 'system', content: systemPrompt + ragContext };
    const history = messages
      .filter(m => m.role !== 'system')   // Strip out old system messages
      .slice(-40)                          // Keep last 40 messages (20 turns)
      .map(m => ({ role: m.role, content: m.content }));  // Strip IDs/timestamps for Ollama
    const allMessages = [systemMsg, ...history, { role: 'user', content: userText.trim() }];
```

**Why `.slice(-40)`:** LLMs have a limited context window. Sending the entire chat history for a 200-message conversation would overflow it. We keep the last 20 user/assistant pairs as a reasonable balance between memory and context length.

**Why strip system messages:** There should only be one system message (the first one), and it should always be our current system prompt + RAG context, not an old one from a previous turn.

### Start Streaming

```ts
    const controller = new AbortController();
    setGenerating(true, controller);
    const assistantMsg = addMessage({ role: 'assistant', content: '' });
    //                                                   ^^^^^^^^^^
    //                              Empty bubble — will be filled in as tokens arrive
```

**What AbortController does:** Creates a cancellation mechanism. The controller's `signal` gets passed to `fetch()`. When the user clicks "Stop", we call `controller.abort()`, which makes `fetch()` throw an `AbortError`. This is the standard web API way to cancel HTTP requests.

```ts
    let fullText = '';
    try {
      for await (const chunk of streamChat({...})) {
        fullText += chunk;                          // Accumulate all tokens
        updateLastAssistantMessage(fullText);        // Update the bubble with everything so far
      }
```

**The `for await...of` loop:** This is how you consume an async generator. Each iteration waits for the next `yield` from `streamChat()`. On each iteration, `chunk` is a token (or a few tokens) like `" Hello"` or `" world"`. We append it to `fullText` and update the chat store, which triggers React to re-render the message bubble.

### Empty Response Handling

```ts
      if (!fullText.trim()) {
        useChatStore.setState(state => ({
          messages: state.messages.filter(m => m.id !== assistantMsg.id),
        }));
        addToast('Model returned an empty response. Try again or switch models.', 'error');
        return;
      }
```

**What this does:** Some models (especially with thinking mode) may produce no visible output. Instead of leaving a blank bubble, we remove it and show an error toast.

### Error Handling

```ts
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        if (!fullText) {
          updateLastAssistantMessage('[Generation cancelled]');
        }
        // If there IS partial text, just leave it as-is
      } else {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        addToast(`Generation failed: ${msg}`, 'error');
        if (!fullText) {
          updateLastAssistantMessage(`[Error: ${msg}]`);
        }
      }
    } finally {
      setGenerating(false);   // Always runs — resets the generating state
    }
```

**Two error paths:**
1. **AbortError** — User clicked cancel. If partial text exists, keep it. Otherwise show "[Generation cancelled]".
2. **Any other error** — Network issue, model crash, etc. Show a toast and put the error in the bubble.

**`finally`** guarantees `setGenerating(false)` runs even if an error occurred. Without this, the UI would be stuck in "generating" state forever.

---

## 8. React Components — What the User Sees

### App.tsx — The Root

**File: `src/App.tsx`**

```ts
  useEffect(() => {
    loadModels();
  }, [loadModels]);
```

**What this does:** On first render, fetch the model list from Ollama. The `[loadModels]` dependency array means this only runs once (the function reference is stable thanks to Zustand).

```ts
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isGenerating) return;        // Don't health-check while streaming
      const healthy = await checkHealth();
      const currentStatus = useModelStore.getState().status;

      if (healthy && currentStatus === 'offline') {
        loadModels();                  // Came back online — reload models
      } else if (!healthy && currentStatus === 'online') {
        useModelStore.setState({       // Went offline — update status
          status: 'offline',
          statusText: 'Ollama offline — run "ollama serve"',
        });
      }
    }, 12000);

    return () => clearInterval(interval);   // Cleanup on unmount
  }, [isGenerating, loadModels]);
```

**What this does:** Every 12 seconds, pings Ollama. If it went from offline→online, auto-reload models. If online→offline, update the status dot to red. Skipped during generation to avoid interfering with the stream.

### MessageBubble.tsx — Chat Bubbles

**File: `src/components/chat/MessageBubble.tsx`**

```ts
  const isUser = message.role === 'user';
  const isLastAssistant = !isUser && messages[messages.length - 1]?.id === message.id;
  const isStreaming = isLastAssistant && isGenerating;
```

**What this does:** Determines if this bubble should show the streaming cursor. Only the *last* assistant message (the one currently being generated) gets the cursor — older messages don't.

```ts
  {isStreaming && message.content && (
    <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-pulse" />
  )}
```

**What this does:** The blinking orange cursor that appears at the end of text while the model is still generating. It's a tiny orange rectangle with a CSS pulse animation.

### InputArea.tsx — Where You Type

**File: `src/components/chat/InputArea.tsx`**

```ts
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = '48px';                              // Reset to minimum
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';  // Expand to fit content (max 200px)
    }
  }, [text]);
```

**What this does:** Auto-resizes the textarea as you type. Resets to 48px first (so shrinking works), then expands to fit content up to 200px. The `[text]` dependency means it recalculates on every keystroke.

```ts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {   // Enter alone = send
      e.preventDefault();                       // Prevent newline insertion
      handleSubmit();
    }
    if (e.key === 'Escape' && isGenerating) {   // Esc while generating = cancel
      cancelGeneration();
    }
  };
```

**Shift+Enter:** Inserts a newline (default textarea behavior). Plain Enter sends the message. Escape cancels generation.

### Dropzone.tsx — File Upload for RAG

**File: `src/components/sidebar/Dropzone.tsx`**

```ts
  const [embedding, setEmbedding] = useState<Record<string, { current: number; total: number }>>({});
```

**What this does:** Tracks per-file embedding progress. The state is a dictionary: `{ "notes.txt": { current: 3, total: 12 } }`. The UI shows "3/12" next to each file being processed.

```ts
    await Promise.all(fileArr.map(async (file) => {
```

**What this does:** Processes multiple files in parallel (at the file level). But *within* each file, chunk embeddings are sequential. So if you drop 3 files, all 3 start processing simultaneously, but each file's chunks embed one at a time.

### Toast.tsx — Notification System

**File: `src/components/ui/Toast.tsx`**

```ts
export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  addToast: (message, type = 'default') => {
    const id = crypto.randomUUID();
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 3500);
  },
```

**What this does:** `addToast` creates a toast and schedules its removal after 3.5 seconds. The `setTimeout` captures the `id` in a closure, so it removes exactly this toast even if others were added in the meantime. Any component can import `useToastStore` and call `addToast` — it's a global notification system.

---

## 9. Config Files — The Plumbing

### vite.config.ts

```ts
proxy: {
  '/ollama': {
    target: 'http://localhost:11434',
    rewrite: path => path.replace(/^\/ollama/, ''),
    changeOrigin: true,
  }
}
```

**What this does:** When the browser requests `/ollama/api/chat`, Vite intercepts it, strips the `/ollama` prefix, and forwards it to `http://localhost:11434/api/chat`. The browser thinks it's talking to the same origin, so no CORS issues.

### tailwind.config.js

```ts
colors: {
  bg:       '#07070c',    // Near-black background
  surface:  '#0e0e18',    // Sidebar background (slightly lighter)
  surface2: '#14141f',    // Input fields, assistant bubbles
  surface3: '#1a1a28',    // Hover states, elevated surfaces
  border:   '#1e1e30',    // Subtle borders
  accent:   '#ff6b2b',    // Orange — primary brand color, buttons, links
  accent2:  '#ffd60a',    // Yellow — code syntax highlighting
  muted:    '#4e4e66',    // Gray — labels, secondary text
  danger:   '#ff4466',    // Red — errors, cancel button
  success:  '#00e5a0',    // Green — online status, success toasts
},
```

**What this does:** Defines custom color names you can use in Tailwind classes like `bg-surface`, `text-accent`, `border-border`. Every color in FORGE comes from this palette.

### vitest.config.ts

```ts
environment: 'jsdom',
```

**What this does:** Tests run in a simulated browser environment (jsdom) instead of Node.js. This is needed because our code uses browser APIs like `fetch`, `FileReader`, `crypto.randomUUID()`.

```ts
setupFiles: ['./src/test-setup.ts'],
```

**What this does:** Runs `test-setup.ts` before every test file. That file imports `@testing-library/jest-dom` which adds custom matchers like `toBeInTheDocument()`.

---

## Key Concepts Glossary

| Term | What It Means in FORGE |
|---|---|
| **Embedding** | An array of ~768 numbers that represents the *meaning* of a piece of text. Similar texts have similar embeddings. |
| **Cosine Similarity** | Math that measures how similar two embeddings are (0 = unrelated, 1 = identical meaning). |
| **Chunk** | A piece of a file, ~600 characters long, used for RAG search. |
| **Top-K** | The number of most-relevant chunks to retrieve and inject into the prompt. |
| **Streaming** | Getting the model's response token-by-token instead of waiting for the full response. |
| **AsyncGenerator** | A function that yields values over time. Used for streaming — yields one token per iteration. |
| **AbortController** | Browser API to cancel an in-progress fetch request. Used for the "Stop" button. |
| **Zustand Store** | A global state container. Components subscribe to slices of it and re-render when those slices change. |
| **Persist Middleware** | Zustand plugin that saves store state to localStorage automatically. |
| **Vite Proxy** | Dev server feature that forwards requests to a different origin, avoiding CORS issues. |
| **CORS** | Browser security that blocks requests to different origins. The proxy works around this. |
| **Quantization** | Compressing model weights (e.g., Q4_K_M = 4-bit). Smaller models fit in less VRAM but lose some quality. |
