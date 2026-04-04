import { useState, useCallback } from "react";
import { Face } from "./components/Face";
import { StatusBar } from "./components/StatusBar";
import { Transcript } from "./components/Transcript";
import { useVoiceFlow } from "./hooks/useVoiceFlow";
import "./App.css";

function App() {
  const { state, start, sendText, lastUserText, lastReply, error, voiceSupported } =
    useVoiceFlow();

  const useTextMode =
    !voiceSupported || new URLSearchParams(window.location.search).has("text");

  const [textInput, setTextInput] = useState("");

  const handleTextSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (textInput.trim()) {
        sendText(textInput.trim());
        setTextInput("");
      }
    },
    [textInput, sendText]
  );

  return (
    <div className="app">
      <div className="app__face-area">
        <Face state={state} onClick={useTextMode ? undefined : start} />
      </div>

      <StatusBar state={state} error={error} />
      <Transcript userText={lastUserText} reply={lastReply} />

      {useTextMode && (
        <form className="text-input" onSubmit={handleTextSubmit}>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type a message..."
            disabled={state !== "idle"}
            className="text-input__field"
          />
          <button
            type="submit"
            disabled={state !== "idle" || !textInput.trim()}
            className="text-input__btn"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
