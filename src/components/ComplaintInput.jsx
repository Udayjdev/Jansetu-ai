import { useState, useRef } from "react";

export default function ComplaintInput({
  issueText,
  setIssueText,
}) {
  const [language, setLanguage] = useState("hi-IN");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [mode , setMode] = useState("voice");
  const recognitionRef = useRef(null);
  const [voiceText, setVoiceText] = useState("");
const [manualText, setManualText] = useState("");
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Use Chrome or Edge for voice input.");
      return;
    }

    setError("");

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = language;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();

      console.log("VOICE RECOGNIZED:", text);
if (text) {
  setVoiceText(text);
  setIssueText(text);

      }
    };

    recognition.onerror = (event) => {
      console.error("VOICE ERROR:", event.error);
      setError("Voice error: " + event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => { setMode("voice");
            setIssueText(voiceText);
        }}
        className={`rounded-xl px-4 py-3 font-semibold ${
          mode === "voice"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        🎤 Voice Complaint
      </button>

      <button
        type="button"
        onClick={() => {
          recognitionRef.current?.abort();
          setListening(false);
          setMode("text");
          setIssueText(manualText);
        }}
        className={`rounded-xl px-4 py-3 font-semibold ${
          mode === "text"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        ✍️ Text Complaint
      </button>
    </div>

    {mode === "voice" && (
      <div className="space-y-3">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-xl border p-3 text-black"
        >
          <option value="hi-IN">हिंदी (Hindi)</option>
          <option value="en-IN">English</option>
        </select>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={startListening}
            disabled={listening}
            className="rounded-xl bg-blue-600 px-4 py-3 text-white"
          >
            {listening ? "🎤 Listening..." : "🎤 Start Speaking"}
          </button>

          <button
            type="button"
            onClick={() => recognitionRef.current?.stop()}
            className="rounded-xl bg-red-600 px-4 py-3 text-white"
          >
            Stop
          </button>
        </div>
      </div>
    )}

    <div>
      <label className="mb-2 block font-medium">
        {mode === "voice"
          ? "Recognized Voice Complaint"
          : "Write Your Complaint"}
      </label>

       <textarea
  value={mode === "voice" ? voiceText : manualText}
  onChange={(e) => {
    const value = e.target.value;

    if (mode === "voice") {
      setVoiceText(value);
    } else {
      setManualText(value);
    }

    setIssueText(value);
  }}
  rows={5}
  placeholder={
    mode === "voice"
      ? "Your spoken complaint will appear here..."
      : "Type your complaint here..."
  }
  className="w-full rounded-xl border border-gray-300 p-4 text-black"
/>
    </div>

    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
   );
}