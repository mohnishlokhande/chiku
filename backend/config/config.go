package config

import "os"

type Config struct {
	Port        string
	CORSOrigins string
	OllamaURL   string
	OllamaModel string
	WhisperURL  string
}

func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", "3000"),
		CORSOrigins: getEnv("CORS_ORIGINS", "http://localhost:5173"),
		OllamaURL:   getEnv("OLLAMA_URL", "http://localhost:11434"),
		OllamaModel: getEnv("OLLAMA_MODEL", "llama3.2:1b"),
		WhisperURL:  getEnv("WHISPER_URL", "http://localhost:8000"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
