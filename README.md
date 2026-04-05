# Terminal 1: Ollama

ollama serve
ollama pull llama3.2:1b

# Terminal 2: Backend

cd ~/myproject/backend
export PATH=$HOME/go-install/go/bin:$PATH
go run main.go

# Terminal 3: Frontend

cd ~/myproject/frontend
npm run dev

Then open http://localhost:5173 (voice mode) or http://localhost:5173?text=1 (text mode).

    Backend (Go + Fiber):

- POST /api/chat — receives user message, calls Ollama LLM, returns sarcastic response
- Pluggable Provider interface — swap Ollama for OpenAI/Claude by adding one file
- Sarcastic personality baked into system prompt ("Chandler Bing meets a tired life coach")
- Config via env vars (PORT, OLLAMA_URL, OLLAMA_MODEL, CORS_ORIGINS)

Frontend (React + TypeScript):

- SVG cartoon face with 4 animated states (idle/listening/thinking/speaking)
- Voice input via Web Speech API, voice output via SpeechSynthesis
- useVoiceFlow hook orchestrates the full listen → think → speak loop
- Text input fallback when mic unavailable (or add ?text=1 to URL)
- Dark theme, optimized for old phones (CSS-only animations, system fonts)


 # Terminal 1: Whisper (first time will download ~75MB model)
  pip install faster-whisper-server
  WHISPER__MODEL=tiny WHISPER__INFERENCE_DEVICE=cpu faster-whisper-server

  # Terminal 2: Ollama + Backend
  ollama serve &
  cd backend && go run main.go

  # Terminal 3: Frontend
  cd frontend && npm run dev

  Key improvement: MediaRecorder works on all browsers (Chrome, Edge, Firefox, Safari) — no more not-allowed
  errors. The mic permission prompt will still appear once, but it's the standard one that always works.