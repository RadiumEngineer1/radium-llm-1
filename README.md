# FORGE - Local LLM Interface

A production-grade chat interface for [Ollama](https://ollama.ai) with streaming responses, multi-model switching, and a full RAG (Retrieval-Augmented Generation) pipeline. Runs entirely locally on your RTX 4090 (24GB VRAM) — no cloud, no auth, no database.

---

## Prerequisites

Before running FORGE, ensure the following are installed and available:

| Requirement | Version | Purpose |
|---|---|---|
| **Node.js** | >= 18.x | Runtime for Vite dev server and build |
| **npm** | >= 9.x | Package management |
| **Ollama** | Latest | Local LLM inference engine |
| **NVIDIA GPU Driver** | >= 535.x | RTX 4090 CUDA support |
| **CUDA Toolkit** | >= 12.x | GPU acceleration for Ollama |

### Hardware

- **GPU:** NVIDIA RTX 4090 (24GB VRAM)
- **RAM:** 32GB+ recommended (models load partially into system RAM)
- **Storage:** 50GB+ free for model weights

### Install Ollama

Download from [ollama.ai](https://ollama.ai) or via command line:

```bash
# Windows — download installer from https://ollama.ai/download
# Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

### Pull Recommended Models

These models run well on a 24GB VRAM GPU:

```bash
ollama pull llama3.3:70b          # Best general purpose (Q4 quantized fits in 24GB)
ollama pull qwen2.5:72b           # Great at code + reasoning
ollama pull deepseek-r1:70b       # Reasoning / chain-of-thought
ollama pull nomic-embed-text      # Dedicated RAG embeddings (fast, small)
```

Start the Ollama server:

```bash
ollama serve
```

Verify it's running:

```bash
curl http://localhost:11434/api/tags
# Should return JSON with your downloaded models
```

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/RadiumEngineer1/radium-llm-1.git
cd radium-llm-1

# 2. Create and set up the Vite project
npm create vite@latest forge -- --template react-ts
cd forge

# 3. Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install zustand react-markdown remark-gfm rehype-highlight highlight.js lucide-react

# 4. Install test dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom happy-dom

# 5. Start dev server
npm run dev
# Open http://localhost:5173
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Vite + React 18 | Fast HMR, small bundle |
| Language | TypeScript | Type safety for RAG vector ops and API layer |
| Styling | Tailwind CSS v3 | Utility-first, no runtime overhead |
| State | Zustand | Lightweight, no boilerplate |
| Markdown | react-markdown + remark-gfm + rehype-highlight | GFM support, syntax highlighting |
| Icons | lucide-react | Clean, consistent |
| Testing | Vitest + React Testing Library | Fast, Vite-native, TDD workflow |

---

## Project Structure

```
forge/
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Root layout component
│   ├── index.css                   # Tailwind base + custom globals
│   ├── store/                      # Zustand state management
│   │   ├── chatStore.ts
│   │   ├── modelStore.ts
│   │   ├── ragStore.ts
│   │   └── settingsStore.ts
│   ├── lib/                        # Core logic (API, RAG, utils)
│   │   ├── ollama.ts               # Ollama API calls
│   │   ├── rag.ts                  # Chunking, embedding, vector search
│   │   └── utils.ts                # Cosine similarity, helpers
│   ├── components/
│   │   ├── layout/                 # Sidebar, MainPanel
│   │   ├── sidebar/                # Model selectors, params, RAG controls
│   │   ├── chat/                   # Messages, input, streaming UI
│   │   └── ui/                     # Slider, Toggle, IconButton, Toast, Select
│   └── types/
│       └── index.ts                # Shared TypeScript interfaces
├── __tests__/                      # Test files (mirrors src/ structure)
│   ├── lib/
│   │   ├── utils.test.ts
│   │   ├── rag.test.ts
│   │   └── ollama.test.ts
│   └── store/
│       ├── chatStore.test.ts
│       ├── modelStore.test.ts
│       ├── ragStore.test.ts
│       └── settingsStore.test.ts
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

---

## Testing (TDD Workflow)

FORGE uses **Vitest** as the test runner — it integrates natively with Vite and supports TypeScript out of the box.

### Running Tests

```bash
cd forge

# Run all tests once
npm test

# Watch mode (re-runs on file changes — ideal for TDD)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npx vitest run __tests__/lib/utils.test.ts
```

### TDD Cycle

1. **Red** — Write a failing test for the next piece of functionality
2. **Green** — Write the minimum code to make the test pass
3. **Refactor** — Clean up while keeping tests green

### Test Categories

| Category | What's Tested | Example |
|---|---|---|
| **Unit — Utils** | `cosineSim`, file reading helpers | Vector math correctness, edge cases |
| **Unit — RAG** | `chunkText`, `searchDocs` | Chunk sizes, overlap, ranking |
| **Unit — Stores** | Zustand store actions | State transitions, message CRUD |
| **Integration — Ollama** | API layer with mocked fetch | Stream parsing, error handling |
| **Component** | React components with RTL | User interactions, rendering |

### Vitest Configuration

Add to `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test-setup.ts'],
    },
  },
})
```

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Architecture

```
Browser (localhost:5173)
    │
    ├── React UI (Vite + Tailwind)
    │     ├── Sidebar: model select, params, RAG controls
    │     └── Chat: streaming messages, markdown rendering
    │
    ├── Zustand Stores (in-memory state)
    │     ├── modelStore  → available models, selection, Ollama status
    │     ├── chatStore   → messages, generation state, abort control
    │     ├── ragStore    → uploaded docs, chunks, embeddings
    │     └── settingsStore → params, system prompt (persisted to localStorage)
    │
    └── Ollama API (localhost:11434)
          ├── GET  /api/tags        → list models
          ├── POST /api/chat        → streaming completions
          ├── POST /api/embeddings  → vector embeddings (RAG)
          └── GET  /                → health check
```

### RAG Pipeline Flow

```
File Upload → Text Extraction → Chunking (600 char, 80 overlap)
    → Sequential Embedding via Ollama → Stored in ragStore

User Query → Embed Query → Cosine Similarity vs All Chunks
    → Top-K Retrieval → Inject into System Prompt → Stream Response
```

---

## Key Features

- **Streaming Chat** — Real-time token-by-token output via ReadableStream
- **Multi-Model Switching** — Hot-swap between any Ollama model
- **RAG Pipeline** — Upload .txt/.md/.json/.csv/.py files, auto-chunk + embed, retrieve on query
- **Generation Controls** — Temperature, Top-P, Max Tokens, Repeat Penalty sliders
- **Dedicated Embed Model** — Use `nomic-embed-text` for fast RAG embeddings
- **Auto Health Check** — Polls Ollama every 12s, auto-reconnects
- **Export Chat** — Download conversation as markdown
- **Keyboard Shortcuts** — Enter to send, Shift+Enter for newline, Esc to cancel
- **Dark Theme** — Custom dark palette with ambient glow effects

---

## Environment Variables / Config

No `.env` file needed. All configuration is in-app:

- **Ollama URL:** Hardcoded to `http://localhost:11434` (proxied through Vite in dev as `/ollama`)
- **Settings:** Stored in `localStorage` (generation params + system prompt)
- **Models:** Auto-detected from Ollama at startup

If you hit CORS issues, set the Ollama environment variable:

```bash
OLLAMA_ORIGINS=* ollama serve
```

---

## Build for Production

```bash
cd forge
npm run build
# Output in dist/ — serve with any static file server
```

For static file usage (no Vite dev server), the app uses `http://localhost:11434` directly instead of the `/ollama` proxy.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| "Ollama offline" in status bar | Run `ollama serve` in a terminal |
| No models listed | Run `ollama pull llama3.3:70b` (or any model) |
| CORS errors | Start Ollama with `OLLAMA_ORIGINS=* ollama serve` |
| Out of VRAM | Use a smaller model (e.g., `llama3.2:13b`) or reduce `num_predict` |
| Slow embeddings | Pull `nomic-embed-text` — it's much faster than using a chat model |
| Build fails | Ensure Node >= 18 and run `npm install` first |

---

## License

Private project — RadiumEngineer1
