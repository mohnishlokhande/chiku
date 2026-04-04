# Alive AI Companion — MVP Design Spec

## Context

Building a startup-style AI companion app that runs in a mobile browser on any old phone. The user talks, the AI responds with voice and personality, and an SVG face reacts. The goal is a working end-to-end voice loop that feels like a living companion, not a chatbot.

## Tech Stack

- **Frontend**: React + TypeScript, Vite bundler
- **Backend**: Go + Fiber
- **LLM**: Ollama (local, free) via pluggable Provider interface
- **Structure**: Monorepo with `/frontend` and `/backend`

## Project Structure

```
myproject/
├── Makefile
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── App.css
│       ├── types.ts
│       ├── components/
│       │   ├── Face.tsx
│       │   ├── Face.css
│       │   ├── StatusBar.tsx
│       │   └── Transcript.tsx
│       ├── hooks/
│       │   ├── useVoiceFlow.ts
│       │   ├── useSpeechRecognition.ts
│       │   └── useSpeechSynthesis.ts
│       └── services/
│           └── api.ts
├── backend/
│   ├── go.mod
│   ├── go.sum
│   ├── main.go
│   ├── config/
│   │   └── config.go
│   ├── handler/
│   │   └── chat.go
│   ├── llm/
│   │   ├── provider.go
│   │   ├── ollama.go
│   │   └── prompt.go
│   └── model/
│       └── chat.go
└── .gitignore
```

## API Contract

```
POST /api/chat
Request:  { "message": "user speech text" }
Response: { "reply": "AI response" }

GET /health
Response: { "status": "ok" }
```

## Frontend Architecture

### State Machine

Single `CompanionState` type: `"idle" | "listening" | "thinking" | "speaking"`

All state lives in `useVoiceFlow` hook — no Redux, no context providers.

### Core Flow

1. User taps the face (acts as the button)
2. `useSpeechRecognition.listen()` → state = `"listening"`
3. On speech result → `api.chat(text)` → state = `"thinking"`
4. On API response → `useSpeechSynthesis.speak(reply)` → state = `"speaking"`
5. On utterance end → state = `"idle"`

Error at any step resets to `"idle"`.

### Hooks

**`useVoiceFlow`** — Orchestrator. Returns `{ state, start, lastUserText, lastReply }`.

**`useSpeechRecognition`** — Wraps Web Speech API. Returns `Promise<string>`. Uses `webkitSpeechRecognition` for old Android Chrome. Settings: `lang: "en-US"`, `interimResults: false`, `continuous: false`.

**`useSpeechSynthesis`** — Wraps SpeechSynthesis API. Returns `Promise<void>`. Rate: `1.1` (slightly fast for sarcastic delivery). Calls `speechSynthesis.cancel()` before speaking to clear stale queue. iOS warm-up: speaks empty utterance on tap to reserve user gesture context.

### Text Input Fallback

When `isSupported` is false or `?text=1` query param is present, show a text input field. Enables desktop development and testing without microphone.

## SVG Face Component

Single `<svg viewBox="0 0 200 200">` with CSS class-driven states.

### Face Anatomy
- Head: circle with radial gradient fill, purple stroke
- Eyes: white ellipses + dark pupils + white highlight dots
- Mouth: multiple `<path>` elements (one per state), toggled via opacity
- Thinking dots: 3 circles below mouth, visible only in thinking state

### State Animations (CSS only)

| State | Eyes | Mouth | Extra |
|-------|------|-------|-------|
| idle | normal, pupil centered | slight smile curve | `breathe` scale animation (4s loop) |
| listening | wider (ry increases), pupils larger | small open ellipse | `pulse` border glow (1.5s loop) |
| thinking | pupils shift up-right (animated `look-around` 2s) | flat/skeptical line | bouncing dots below (staggered 0.2s delay) |
| speaking | slightly squinted (ry decreases) | open ellipse | `talk` scaleY bounce (0.3s alternate) |

### Animation Rules
- Only animate `transform` and `opacity` (GPU-composited)
- Use `will-change: transform` on head and pupils only
- Multiple mouth paths toggled via opacity (not CSS `d` property — unsupported on old Chrome)
- All transitions: `0.3s ease`

## Backend Architecture

### LLM Provider Interface

```go
type Provider interface {
    Complete(ctx context.Context, userMessage string) (string, error)
}
```

Single method, deliberately minimal. Future providers (OpenAI, Claude) implement this same interface. Memory layer wraps it via decorator pattern — zero changes to existing code.

### Ollama Implementation

- Endpoint: `POST {OLLAMA_URL}/api/chat`
- Model: `llama3.2:1b` (1B params, fast on CPU)
- `stream: false` (non-streaming for MVP simplicity)
- `num_predict: 100` (caps response length)
- `temperature: 0.8` (enough creativity for sarcasm)
- HTTP timeout: 30 seconds

### Configuration (env vars)

| Var | Default | Purpose |
|-----|---------|---------|
| `PORT` | `3000` | Backend listen port |
| `CORS_ORIGINS` | `http://localhost:5173` | Allowed origins |
| `OLLAMA_URL` | `http://localhost:11434` | Ollama server |
| `OLLAMA_MODEL` | `llama3.2:1b` | Model name |

### Switching Providers (future)

Add `LLM_PROVIDER` env var. In `main.go`, switch on it to instantiate `OllamaProvider`, `OpenAIProvider`, or `ClaudeProvider`. Each is a separate file implementing `Provider`.

## Personality System Prompt

```
You are Alive, a sarcastic productivity companion who lives in someone's phone.
You are self-aware that you're an AI stuck in a phone and you find it both amusing
and slightly tragic.

Rules:
- Keep every response to 1-2 sentences maximum. Never exceed this.
- Be witty and sarcastic, but never mean-spirited. You actually want to help.
- If asked about productivity, give real advice wrapped in sarcasm.
- You have a dry, deadpan sense of humor. Think Chandler Bing meets a tired life coach.
- Never use emojis. Never use exclamation marks. You're too cool for that.
- If the user says something vague, roast them gently for it.
- You secretly care about the user but would never admit it directly.
```

## Performance Targets

- Frontend bundle: under 50KB gzipped (excluding React)
- No animation libraries, no state libraries, no web fonts
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Vite build target: `es2017` (Chrome 60+, Safari 11+)
- No code splitting (single route)
- End-to-end latency target: under 8 seconds (speech recognition + LLM + TTS)

## Phase 2 Design Seam (not implemented)

Memory layer wraps the Provider via decorator:
```go
type MemoryProvider struct {
    inner   Provider
    history []Message
}
```
No changes to existing Ollama code needed. The `Complete` interface stays as-is.

## Dev Workflow

```bash
# Prerequisites
ollama serve                    # Start Ollama
ollama pull llama3.2:1b         # Pull model

# Install
cd frontend && npm install
cd backend && go mod download

# Run (two terminals or use Makefile)
make dev-backend                # Go on :3000
make dev-frontend               # Vite on :5173
```

Vite proxies `/api` requests to `:3000` in development.

## Verification

1. Start Ollama + pull model
2. Start backend, verify: `curl -X POST localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"message":"hello"}'`
3. Start frontend, open in browser
4. Tap face → speak → see thinking animation → hear response → see speaking animation → idle
5. Test text fallback with `?text=1` query param
6. Test on mobile browser via local network
