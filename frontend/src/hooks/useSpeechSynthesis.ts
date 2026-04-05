import { useCallback, useMemo, useState, useEffect } from "react";

interface SpeechSynthesisHook {
  speak: (text: string) => Promise<void>;
  warmUp: () => void;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setVoiceByName: (name: string) => void;
}

// Prefer these voices in order (good for a sarcastic AI companion)
const PREFERRED_VOICES = [
  "Google US Indian Male",
  "Daniel", // macOS/iOS British male
  "Microsoft Mark", // Windows
  "Google US Indian Female",
  "Samantha", // macOS/iOS
  "Google US English",
];

function pickBestVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // Try preferred voices first
  for (const preferred of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name.includes(preferred));
    if (match) return match;
  }

  // Fallback: first English voice
  const english = voices.find((v) => v.lang.startsWith("en"));
  if (english) return english;

  // Last resort: first available
  return voices[0];
}

export function useSpeechSynthesis(): SpeechSynthesisHook {
  const isSupported = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    []
  );

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  // Load voices (they load asynchronously on some browsers)
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const available = speechSynthesis.getVoices();
      setVoices(available);
      if (!selectedVoice) {
        setSelectedVoice(pickBestVoice(available));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [isSupported, selectedVoice]);

  const setVoiceByName = useCallback(
    (name: string) => {
      const match = voices.find((v) => v.name === name);
      if (match) setSelectedVoice(match);
    },
    [voices]
  );

  const warmUp = useCallback(() => {
    if (!isSupported) return;
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

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 0.95;

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (event) =>
          reject(new Error(`Speech synthesis error: ${event.error}`));

        speechSynthesis.speak(utterance);
      });
    },
    [isSupported, selectedVoice]
  );

  return { speak, warmUp, isSupported, voices, selectedVoice, setVoiceByName };
}
