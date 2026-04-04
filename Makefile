.PHONY: dev dev-frontend dev-backend install

install:
	cd frontend && npm install
	cd backend && go mod download

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && go run main.go

dev:
	make dev-backend & make dev-frontend & wait
