export type CompanionState = "idle" | "listening" | "thinking" | "speaking";

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}
