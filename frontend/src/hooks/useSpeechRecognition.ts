import { useCallback, useMemo } from "react";

interface SpeechRecognitionHook {
  listen: () => Promise<string>;
  isSupported: boolean;
}

function getSpeechRecognition(): typeof SpeechRecognition | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const isSupported = useMemo(() => getSpeechRecognition() !== null, []);

  const listen = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const SpeechRecognitionClass = getSpeechRecognition();
      if (!SpeechRecognitionClass) {
        reject(new Error("Speech recognition not supported"));
        return;
      }

      const recognition = new SpeechRecognitionClass();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript ?? "";
        resolve(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.onnomatch = () => {
        reject(new Error("No speech detected"));
      };

      recognition.start();
    });
  }, []);

  return { listen, isSupported };
}
