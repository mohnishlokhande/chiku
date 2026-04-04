import { useCallback, useMemo } from "react";

interface SpeechSynthesisHook {
  speak: (text: string) => Promise<void>;
  warmUp: () => void;
  isSupported: boolean;
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const isSupported = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    []
  );

  const warmUp = useCallback(() => {
    if (!isSupported) return;
    // iOS requires speechSynthesis to be triggered from a user gesture.
    // Speak an empty utterance on tap to reserve the gesture context.
    const utterance = new SpeechSynthesisUtterance("");
    utterance.volume = 0;
    speechSynthesis.speak(utterance);
  }, [isSupported]);

  const speak = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!isSupported) {
          reject(new Error("Speech synthesis not supported"));
          return;
        }

        // Clear any queued speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 1.0;

        utterance.onend = () => resolve();
        utterance.onerror = (event) =>
          reject(new Error(`Speech synthesis error: ${event.error}`));

        speechSynthesis.speak(utterance);
      });
    },
    [isSupported]
  );

  return { speak, warmUp, isSupported };
}
