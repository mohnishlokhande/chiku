export type CompanionState = "idle" | "listening" | "thinking" | "speaking";

export type Emotion = "happy" | "sad" | "angry" | "annoyed" | "sarcastic" | "surprised";

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  emotion: Emotion;
}
