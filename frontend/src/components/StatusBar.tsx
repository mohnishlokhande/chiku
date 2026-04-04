import type { CompanionState } from "../types";

const STATUS_TEXT: Record<CompanionState, string> = {
  idle: "Tap to talk",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
};

interface StatusBarProps {
  state: CompanionState;
  error: string | null;
}

export function StatusBar({ state, error }: StatusBarProps) {
  return (
    <div className="status-bar">
      {error ? (
        <span className="status-bar__error">{error}</span>
      ) : (
        <span className="status-bar__text">{STATUS_TEXT[state]}</span>
      )}
    </div>
  );
}
