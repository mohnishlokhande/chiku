package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
)

type transcribeResponse struct {
	Text string `json:"text"`
}

func NewTranscribeHandler(whisperURL string) fiber.Handler {
	client := &http.Client{Timeout: 30 * time.Second}

	return func(c *fiber.Ctx) error {
		// Get the uploaded audio file
		fileHeader, err := c.FormFile("audio")
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "audio file is required"})
		}

		file, err := fileHeader.Open()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to read audio file"})
		}
		defer file.Close()

		// Build multipart request for Whisper API
		var body bytes.Buffer
		writer := multipart.NewWriter(&body)

		part, err := writer.CreateFormFile("file", fileHeader.Filename)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create form"})
		}

		if _, err := io.Copy(part, file); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to copy audio"})
		}

		// Add model field (OpenAI-compatible API format)
		writer.WriteField("model", "whisper-1")
		writer.WriteField("response_format", "json")
		writer.Close()

		// Send to Whisper server
		req, err := http.NewRequestWithContext(c.Context(), "POST",
			whisperURL+"/v1/audio/transcriptions", &body)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to create request"})
		}
		req.Header.Set("Content-Type", writer.FormDataContentType())

		resp, err := client.Do(req)
		if err != nil {
			return c.Status(502).JSON(fiber.Map{"error": "whisper server unavailable"})
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			b, _ := io.ReadAll(resp.Body)
			return c.Status(502).JSON(fiber.Map{
				"error": fmt.Sprintf("whisper error %d: %s", resp.StatusCode, string(b)),
			})
		}

		var result transcribeResponse
		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "failed to parse transcription"})
		}

		return c.JSON(fiber.Map{"text": result.Text})
	}
}
