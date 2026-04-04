import { useState, useCallback } from "react";
import type { CompanionState } from "../types";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { chat } from "../services/api";

interface VoiceFlowHook {
  state: CompanionState;
  start: () => void;
  sendText: (text: string) => void;
  lastUserText: string;
  lastReply: string;
  error: string | null;
  voiceSupported: boolean;
}

export function useVoiceFlow(): VoiceFlowHook {
  const [state, setState] = useState<CompanionState>("idle");
  const [lastUserText, setLastUserText] = useState("");
  const [lastReply, setLastReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { listen, isSupported: speechSupported } = useSpeechRecognition();
  const { speak, warmUp, isSupported: synthSupported } = useSpeechSynthesis();

  const processMessage = useCallback(
    async (text: string) => {
      setLastUserText(text);
      setError(null);

      try {
        // Thinking
        setState("thinking");
        const reply = await chat(text);
        setLastReply(reply);

        // Speaking
        if (synthSupported) {
          setState("speaking");
          await speak(reply);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setState("idle");
      }
    },
    [speak, synthSupported]
  );

  const start = useCallback(async () => {
    if (state !== "idle") return;
    setError(null);

    // Warm up speech synthesis on user gesture (iOS fix)
    warmUp();

    try {
      setState("listening");
      const text = await listen();
      if (text.trim()) {
        await processMessage(text.trim());
      } else {
        setState("idle");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speech recognition failed");
      setState("idle");
    }
  }, [state, listen, warmUp, processMessage]);

  const sendText = useCallback(
    (text: string) => {
      if (state !== "idle" || !text.trim()) return;
      processMessage(text.trim());
    },
    [state, processMessage]
  );

  return {
    state,
    start,
    sendText,
    lastUserText,
    lastReply,
    error,
    voiceSupported: speechSupported,
  };
}
