package llm

import "context"

// Provider is the pluggable LLM interface. Ollama implements it now.
// OpenAI and Claude implementations can be added later.
type Provider interface {
	Complete(ctx context.Context, userMessage string) (string, error)
}
