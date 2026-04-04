package llm

import (
	"context"
	"regexp"
	"strings"
)

// Provider is the pluggable LLM interface. Ollama implements it now.
// OpenAI and Claude implementations can be added later.
type Provider interface {
	Complete(ctx context.Context, userMessage string) (string, error)
}

// LLMResult holds the parsed response from the LLM.
type LLMResult struct {
	Reply   string
	Emotion string
}

var emotionRegex = regexp.MustCompile(`(?i)^\[(happy|sad|angry|annoyed|sarcastic|surprised)\]\s*`)

// ParseResponse extracts the emotion tag and clean reply from LLM output.
func ParseResponse(raw string) LLMResult {
	raw = strings.TrimSpace(raw)

	match := emotionRegex.FindStringSubmatch(raw)
	if match != nil {
		emotion := strings.ToLower(match[1])
		reply := strings.TrimSpace(raw[len(match[0]):])
		return LLMResult{Reply: reply, Emotion: emotion}
	}

	// Fallback: no emotion tag found
	return LLMResult{Reply: raw, Emotion: "sarcastic"}
}
