.PHONY: dev dev-frontend dev-backend dev-whisper install setup stop

# Run everything with one command
dev:
	@echo "Starting Alive AI Companion..."
	@echo "  - Whisper (speech-to-text) on :8000"
	@echo "  - Backend (Go) on :3000"
	@echo "  - Frontend (Vite) on :5173"
	@echo ""
	@echo "Open http://localhost:5173 in your browser"
	@echo "Press Ctrl+C to stop all services"
	@echo ""
	@trap 'kill 0' EXIT; \
		WHISPER__MODEL=tiny WHISPER__INFERENCE_DEVICE=cpu faster-whisper-server & \
		cd backend && go run main.go & \
		cd frontend && npm run dev & \
		wait

# Run individual services
dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && go run main.go

dev-whisper:
	WHISPER__MODEL=tiny WHISPER__INFERENCE_DEVICE=cpu faster-whisper-server

# Install all dependencies
install:
	cd frontend && npm install
	cd backend && go mod download
	pip install faster-whisper-server

# First-time setup (install + pull Ollama model)
setup: install
	@echo "Pulling Ollama model (llama3.2:1b)..."
	ollama pull llama3.2:1b
	@echo ""
	@echo "Setup complete. Run 'make dev' to start."

# Stop any leftover processes
stop:
	@-pkill -f "faster-whisper-server" 2>/dev/null || true
	@-pkill -f "go run main.go" 2>/dev/null || true
	@-pkill -f "vite" 2>/dev/null || true
	@echo "All services stopped."
