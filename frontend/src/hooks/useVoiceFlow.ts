import { useState, useCallback } from "react";
import type { CompanionState, Emotion } from "../types";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { chat } from "../services/api";

interface VoiceFlowHook {
  state: CompanionState;
  emotion: Emotion;
  start: () => void;
  sendText: (text: string) => void;
  lastUserText: string;
  lastReply: string;
  error: string | null;
  voiceSupported: boolean;
}

export function useVoiceFlow(): VoiceFlowHook {
  const [state, setState] = useState<CompanionState>("idle");
  const [emotion, setEmotion] = useState<Emotion>("sarcastic");
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
        const result = await chat(text);
        setLastReply(result.reply);
        setEmotion(result.emotion);

        // Speaking — show the emotion on the face while speaking
        if (synthSupported) {
          setState("speaking");
          await speak(result.reply);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setEmotion("sad");
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
    emotion,
    start,
    sendText,
    lastUserText,
    lastReply,
    error,
    voiceSupported: speechSupported,
  };
}
