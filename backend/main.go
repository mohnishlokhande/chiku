package main

import (
	"log"
	"time"

	"alive-companion/config"
	"alive-companion/handler"
	"alive-companion/llm"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	cfg := config.Load()

	provider := llm.NewOllamaProvider(cfg.OllamaURL, cfg.OllamaModel)

	app := fiber.New(fiber.Config{
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: cfg.CORSOrigins,
		AllowMethods: "POST,GET",
		AllowHeaders: "Content-Type",
	}))

	app.Post("/api/chat", handler.NewChatHandler(provider))
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	log.Printf("Alive companion backend starting on :%s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
