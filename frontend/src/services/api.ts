import type { ChatResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function chat(message: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  const data: ChatResponse = await res.json();
  return data.reply;
}
