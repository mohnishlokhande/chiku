package handler

import (
	"alive-companion/llm"
	"alive-companion/model"

	"github.com/gofiber/fiber/v2"
)

func NewChatHandler(provider llm.Provider) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req model.ChatRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid request body"})
		}
		if req.Message == "" {
			return c.Status(400).JSON(fiber.Map{"error": "message is required"})
		}

		raw, err := provider.Complete(c.Context(), req.Message)
		if err != nil {
			return c.Status(502).JSON(fiber.Map{"error": "LLM unavailable"})
		}

		result := llm.ParseResponse(raw)

		return c.JSON(model.ChatResponse{
			Reply:   result.Reply,
			Emotion: result.Emotion,
		})
	}
}
