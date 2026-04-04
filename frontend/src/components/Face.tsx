import type { CompanionState } from "../types";
import "./Face.css";

interface FaceProps {
  state: CompanionState;
  onClick?: () => void;
}

export function Face({ state, onClick }: FaceProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`face face--${state}`}
      onClick={onClick}
      role="button"
      aria-label="Tap to talk"
    >
      <defs>
        <radialGradient id="faceGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#3d3d7e" />
          <stop offset="100%" stopColor="#2d2d5e" />
        </radialGradient>
      </defs>

      {/* Head */}
      <circle cx="100" cy="100" r="88" className="face__head" />

      {/* Left eye */}
      <g className="face__eye face__eye--left">
        <ellipse cx="70" cy="82" rx="14" ry="16" className="face__eye-white" />
        <circle cx="70" cy="84" r="7" className="face__pupil" />
        <circle cx="73" cy="80" r="2.5" className="face__highlight" />
      </g>

      {/* Right eye */}
      <g className="face__eye face__eye--right">
        <ellipse cx="130" cy="82" rx="14" ry="16" className="face__eye-white" />
        <circle cx="130" cy="84" r="7" className="face__pupil" />
        <circle cx="133" cy="80" r="2.5" className="face__highlight" />
      </g>

      {/* Mouths — one per state, toggled via CSS opacity */}
      <path
        d="M 75 128 Q 100 148 125 128"
        className="face__mouth face__mouth--idle"
      />
      <ellipse
        cx="100"
        cy="133"
        rx="12"
        ry="8"
        className="face__mouth face__mouth--listening"
      />
      <path
        d="M 80 135 Q 100 130 120 135"
        className="face__mouth face__mouth--thinking"
      />
      <ellipse
        cx="100"
        cy="132"
        rx="18"
        ry="14"
        className="face__mouth face__mouth--speaking"
      />

      {/* Thinking dots */}
      <g className="face__thinking-dots">
        <circle cx="82" cy="158" r="4" />
        <circle cx="100" cy="158" r="4" />
        <circle cx="118" cy="158" r="4" />
      </g>
    </svg>
  );
}
