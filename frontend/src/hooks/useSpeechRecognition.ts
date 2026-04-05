import { useCallback, useRef, useMemo } from "react";
import { transcribe } from "../services/api";

interface SpeechRecognitionHook {
  listen: () => Promise<string>;
  stopListening: () => void;
  isSupported: boolean;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const isSupported = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== "undefined",
    []
  );

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const listen = useCallback((): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      if (!isSupported) {
        reject(new Error("Audio recording not supported"));
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Pick a supported MIME type
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "audio/mp4";

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          // Stop all tracks to release the mic
          stream.getTracks().forEach((track) => track.stop());

          const audioBlob = new Blob(chunksRef.current, { type: mimeType });

          // Don't send empty recordings
          if (audioBlob.size < 1000) {
            resolve("");
            return;
          }

          try {
            const text = await transcribe(audioBlob);
            resolve(text.trim());
          } catch (err) {
            reject(err instanceof Error ? err : new Error("Transcription failed"));
          }
        };

        mediaRecorder.onerror = () => {
          stream.getTracks().forEach((track) => track.stop());
          reject(new Error("Recording failed"));
        };

        // Start recording
        mediaRecorder.start();

        // Auto-stop after 15 seconds max
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }, 15000);
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          reject(new Error("Microphone access denied. Please allow mic access in browser settings."));
        } else {
          reject(err instanceof Error ? err : new Error("Failed to start recording"));
        }
      }
    });
  }, [isSupported]);

  return { listen, stopListening, isSupported };
}
