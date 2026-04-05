import type { CompanionState, Emotion } from "../types";
import "./Face.css";

interface FaceProps {
  state: CompanionState;
  emotion: Emotion;
  onClick?: () => void;
}

// The ghost shows a combined visual: the state controls animations (float, pulse, etc.)
// and the emotion controls the facial expression (eyes, mouth, extras).
// During "speaking" and "idle", we show the emotion face.
// During "listening" and "thinking", those have their own fixed expressions.

export function Face({ state, emotion, onClick }: FaceProps) {
  // Which expression to render
  const expression =
    state === "listening" || state === "thinking" ? state : emotion;

  return (
    <svg
      viewBox="0 0 200 200"
      className={`ghost ghost--${state}`}
      onClick={onClick}
      role="button"
      aria-label="Tap to talk"
    >
      {/* Ghost body */}
      <g className="ghost__body">
        <path
          d="M 50 100 Q 50 40 100 40 Q 150 40 150 100 L 150 150 Q 140 140 130 150 Q 120 160 110 150 Q 100 140 90 150 Q 80 160 70 150 Q 60 140 50 150 Z"
          className={`ghost__shape ghost__shape--${expression}`}
        />
        {/* Inner glow */}
        <path
          d="M 55 100 Q 55 47 100 47 Q 145 47 145 100 L 145 145 Q 137 137 130 145 Q 122 153 113 145 Q 103 137 93 145 Q 83 153 73 145 Q 63 137 55 145 Z"
          fill="#3b0764"
          opacity="0.4"
        />
      </g>

      {/* Expression layer — only one visible at a time */}
      <g
        className={`ghost__expression`}
        style={{
          opacity:
            (expression as string) === "idle" || expression === "sarcastic"
              ? 1
              : 0,
        }}
      >
        <IdleFace />
      </g>
      <g style={{ opacity: expression === "listening" ? 1 : 0 }}>
        <ListeningFace />
      </g>
      <g style={{ opacity: expression === "thinking" ? 1 : 0 }}>
        <ThinkingFace />
      </g>
      <g style={{ opacity: expression === "happy" ? 1 : 0 }}>
        <HappyFace />
      </g>
      <g style={{ opacity: expression === "sad" ? 1 : 0 }}>
        <SadFace />
      </g>
      <g style={{ opacity: expression === "angry" ? 1 : 0 }}>
        <AngryFace />
      </g>
      <g style={{ opacity: expression === "annoyed" ? 1 : 0 }}>
        <AnnoyedFace />
      </g>
      <g style={{ opacity: expression === "surprised" ? 1 : 0 }}>
        <SurprisedFace />
      </g>

      {/* Speaking mouth overlay — animated on top of emotion face */}
      {state === "speaking" && (
        <g className="ghost__speaking-mouth">
          <ellipse
            cx="100"
            cy="115"
            rx="14"
            ry="10"
            fill="#0f0326"
            stroke="#c4b5fd"
            strokeWidth="1.5"
          />
          <ellipse
            cx="100"
            cy="120"
            rx="8"
            ry="4"
            fill="#7c3aed"
            opacity="0.4"
          />
          {/* Speech lines */}
          <line
            x1="160"
            y1="98"
            x2="172"
            y2="95"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <line
            x1="160"
            y1="106"
            x2="175"
            y2="106"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
          <line
            x1="160"
            y1="114"
            x2="170"
            y2="117"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>
      )}

      {/* Particles */}
      <g className="ghost__particles">
        <circle cx="40" cy="70" r="2" fill="#8b5cf6" opacity="0.4" />
        <circle cx="160" cy="60" r="1.5" fill="#a78bfa" opacity="0.3" />
        <circle cx="45" cy="130" r="1.5" fill="#7c3aed" opacity="0.3" />
        <circle cx="155" cy="120" r="2" fill="#8b5cf6" opacity="0.4" />
      </g>
    </svg>
  );
}

/* ====== Expression sub-components ====== */

function IdleFace() {
  return (
    <>
      {/* Normal glowing eyes */}
      <ellipse cx="78" cy="88" rx="14" ry="16" fill="#0f0326" />
      <ellipse cx="122" cy="88" rx="14" ry="16" fill="#0f0326" />
      <circle cx="78" cy="86" r="8" fill="#a78bfa" />
      <circle cx="122" cy="86" r="8" fill="#a78bfa" />
      <circle cx="78" cy="86" r="4" fill="#e9d5ff" />
      <circle cx="122" cy="86" r="4" fill="#e9d5ff" />
      <circle cx="82" cy="82" r="2.5" fill="#fff" />
      <circle cx="126" cy="82" r="2.5" fill="#fff" />
      {/* Smirk */}
      <path
        d="M 90 112 Q 100 118 115 110"
        stroke="#c4b5fd"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </>
  );
}

function ListeningFace() {
  return (
    <>
      {/* Big alert eyes */}
      <ellipse cx="78" cy="86" rx="16" ry="19" fill="#0f0326" />
      <ellipse cx="122" cy="86" rx="16" ry="19" fill="#0f0326" />
      <circle cx="78" cy="84" r="10" fill="#a78bfa" />
      <circle cx="122" cy="84" r="10" fill="#a78bfa" />
      <circle cx="78" cy="84" r="5" fill="#e9d5ff" />
      <circle cx="122" cy="84" r="5" fill="#e9d5ff" />
      <circle cx="83" cy="80" r="3" fill="#fff" />
      <circle cx="127" cy="80" r="3" fill="#fff" />
      {/* Small O mouth */}
      <ellipse
        cx="100"
        cy="115"
        rx="6"
        ry="7"
        fill="#0f0326"
        stroke="#c4b5fd"
        strokeWidth="1.5"
      />
      {/* Sound waves */}
      <path
        d="M 38 95 Q 32 100 38 105"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 30 90 Q 22 100 30 110"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M 162 95 Q 168 100 162 105"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 170 90 Q 178 100 170 110"
        stroke="#8b5cf6"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
    </>
  );
}

function ThinkingFace() {
  return (
    <>
      {/* Eyes looking up */}
      <ellipse cx="78" cy="88" rx="14" ry="16" fill="#0f0326" />
      <ellipse cx="122" cy="88" rx="14" ry="16" fill="#0f0326" />
      <circle
        cx="82"
        cy="82"
        r="7"
        fill="#a78bfa"
        className="ghost__thinking-pupil"
      />
      <circle
        cx="126"
        cy="82"
        r="7"
        fill="#a78bfa"
        className="ghost__thinking-pupil"
      />
      <circle cx="82" cy="82" r="3.5" fill="#e9d5ff" />
      <circle cx="126" cy="82" r="3.5" fill="#e9d5ff" />
      <circle cx="85" cy="79" r="2" fill="#fff" />
      <circle cx="129" cy="79" r="2" fill="#fff" />
      {/* Flat mouth */}
      <path
        d="M 88 114 L 112 112"
        stroke="#c4b5fd"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Thought bubbles */}
      <circle
        cx="155"
        cy="50"
        r="8"
        fill="#3b0764"
        stroke="#7c3aed"
        strokeWidth="1"
        className="ghost__thought-bubble"
      />
      <circle
        cx="148"
        cy="65"
        r="5"
        fill="#3b0764"
        stroke="#7c3aed"
        strokeWidth="1"
        opacity="0.7"
      />
      <circle
        cx="143"
        cy="75"
        r="3"
        fill="#3b0764"
        stroke="#7c3aed"
        strokeWidth="1"
        opacity="0.5"
      />
    </>
  );
}

function HappyFace() {
  return (
    <>
      {/* ^_^ closed arc eyes */}
      <path
        d="M 62 88 Q 78 72 94 88"
        stroke="#e9d5ff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 106 88 Q 122 72 138 88"
        stroke="#e9d5ff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Big smile */}
      <path
        d="M 78 110 Q 100 132 122 110"
        stroke="#c4b5fd"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Blush */}
      <ellipse cx="65" cy="100" rx="8" ry="5" fill="#ec4899" opacity="0.2" />
      <ellipse cx="135" cy="100" rx="8" ry="5" fill="#ec4899" opacity="0.2" />
      {/* Sparkles */}
      <path
        d="M 40 55 L 43 48 L 46 55 L 43 62 Z"
        fill="#fbbf24"
        opacity="0.7"
        className="ghost__sparkle"
      />
      <path
        d="M 158 50 L 161 43 L 164 50 L 161 57 Z"
        fill="#fbbf24"
        opacity="0.5"
        className="ghost__sparkle"
      />
      <circle cx="35" cy="110" r="2" fill="#fbbf24" opacity="0.4" />
    </>
  );
}

function SadFace() {
  return (
    <>
      {/* Droopy eyes */}
      <ellipse cx="78" cy="90" rx="14" ry="16" fill="#0f0326" />
      <ellipse cx="122" cy="90" rx="14" ry="16" fill="#0f0326" />
      <circle cx="78" cy="92" r="7" fill="#7c3aed" opacity="0.7" />
      <circle cx="122" cy="92" r="7" fill="#7c3aed" opacity="0.7" />
      <circle cx="78" cy="92" r="3.5" fill="#c4b5fd" />
      <circle cx="122" cy="92" r="3.5" fill="#c4b5fd" />
      <circle cx="81" cy="89" r="2" fill="#fff" opacity="0.7" />
      <circle cx="125" cy="89" r="2" fill="#fff" opacity="0.7" />
      {/* Sad eyebrows */}
      <path
        d="M 62 78 Q 72 82 88 76"
        stroke="#a78bfa"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 138 78 Q 128 82 112 76"
        stroke="#a78bfa"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Frown */}
      <path
        d="M 85 120 Q 100 110 115 120"
        stroke="#c4b5fd"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Teardrop */}
      <path
        d="M 90 100 Q 88 108 90 112"
        stroke="#60a5fa"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
        className="ghost__tear"
      />
      <circle
        cx="90"
        cy="113"
        r="2"
        fill="#60a5fa"
        opacity="0.5"
        className="ghost__tear"
      />
    </>
  );
}

function AngryFace() {
  return (
    <>
      {/* Narrow angry eyes */}
      <ellipse cx="78" cy="90" rx="14" ry="10" fill="#0f0326" />
      <ellipse cx="122" cy="90" rx="14" ry="10" fill="#0f0326" />
      <circle cx="78" cy="90" r="6" fill="#ef4444" opacity="0.8" />
      <circle cx="122" cy="90" r="6" fill="#ef4444" opacity="0.8" />
      <circle cx="78" cy="90" r="3" fill="#fca5a5" />
      <circle cx="122" cy="90" r="3" fill="#fca5a5" />
      {/* V eyebrows */}
      <path
        d="M 60 76 L 90 82"
        stroke="#ef4444"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 140 76 L 110 82"
        stroke="#ef4444"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Zigzag mouth */}
      <path
        d="M 80 116 L 88 112 L 96 118 L 104 112 L 112 118 L 120 114"
        stroke="#ef4444"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Fury particles */}
      <path
        d="M 42 50 L 48 45 L 46 55"
        stroke="#ef4444"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
        className="ghost__fury"
      />
      <path
        d="M 155 48 L 160 42 L 158 52"
        stroke="#ef4444"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
        className="ghost__fury"
      />
    </>
  );
}

function AnnoyedFace() {
  return (
    <>
      {/* Half-lidded eyes */}
      <ellipse cx="78" cy="90" rx="14" ry="8" fill="#0f0326" />
      <ellipse cx="122" cy="90" rx="14" ry="8" fill="#0f0326" />
      <circle cx="78" cy="90" r="5" fill="#a78bfa" opacity="0.7" />
      <circle cx="122" cy="90" r="5" fill="#a78bfa" opacity="0.7" />
      <circle cx="78" cy="90" r="2.5" fill="#e9d5ff" />
      <circle cx="122" cy="90" r="2.5" fill="#e9d5ff" />
      {/* One raised eyebrow */}
      <path
        d="M 62 80 Q 72 82 88 80"
        stroke="#a78bfa"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 112 76 Q 128 72 140 78"
        stroke="#a78bfa"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Crooked flat mouth */}
      <path
        d="M 85 116 Q 98 114 115 118"
        stroke="#c4b5fd"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Sweat drop */}
      <ellipse
        cx="148"
        cy="68"
        rx="3"
        ry="5"
        fill="#60a5fa"
        opacity="0.3"
        className="ghost__sweat"
      />
    </>
  );
}

function SurprisedFace() {
  return (
    <>
      {/* Huge round eyes */}
      <ellipse cx="78" cy="85" rx="18" ry="22" fill="#0f0326" />
      <ellipse cx="122" cy="85" rx="18" ry="22" fill="#0f0326" />
      <circle cx="78" cy="83" r="12" fill="#c084fc" />
      <circle cx="122" cy="83" r="12" fill="#c084fc" />
      <circle cx="78" cy="83" r="6" fill="#f5f3ff" />
      <circle cx="122" cy="83" r="6" fill="#f5f3ff" />
      <circle cx="83" cy="78" r="3.5" fill="#fff" />
      <circle cx="127" cy="78" r="3.5" fill="#fff" />
      {/* Big O mouth */}
      <ellipse
        cx="100"
        cy="120"
        rx="10"
        ry="12"
        fill="#0f0326"
        stroke="#c4b5fd"
        strokeWidth="1.5"
      />
      {/* Impact lines */}
      <line
        x1="35"
        y1="60"
        x2="28"
        y2="55"
        stroke="#c084fc"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="38"
        y1="75"
        x2="28"
        y2="75"
        stroke="#c084fc"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="165"
        y1="60"
        x2="172"
        y2="55"
        stroke="#c084fc"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="162"
        y1="75"
        x2="172"
        y2="75"
        stroke="#c084fc"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </>
  );
}
