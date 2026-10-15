import { useEffect, useRef, useState } from "react";

export default function VoiceAssistant({ onTranscript }) {
  const [language, setLanguage] = useState("hi-IN");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = (message, lang) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = lang;
    speech.rate = 0.9;

    window.speechSynthesis.speak(speech);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported.");
      return;
    }

    setError("");

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      onTranscript(transcript);

      speak(
        language === "hi-IN"
          ? "आपकी शिकायत भर दी गई है। कृपया जांच लें।"
          : "Your complaint has been filled. Please review it.",
        language
      );
    };

    recognition.onerror = (event) => {
      setError(`Microphone error: ${event.error}`);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (err) {
      setError(err.message);
      setListening(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 from-blue-50 to-indigo-50 p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md">
          🎙️
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            JanSetu AI Voice Assistant
          </h3>
          <p className="text-xs text-slate-500">
            Speak your civic complaint
          </p>
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="voice-language"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Select Language / भाषा चुनें
        </label>

        <select
          id="voice-language"
          value={language}
          disabled={listening}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
        >
          <option value="hi-IN">🇮🇳 हिंदी (Hindi)</option>
          <option value="en-IN">🇮🇳 English</option>
        </select>
      </div>

      <div className="flex flex-col items-center gap-3 rounded-xl bg-white/70 p-5">
        <button
          type="button"
          onClick={
            listening
              ? () => recognitionRef.current?.stop()
              : startListening
          }
          aria-label={
            listening ? "Stop listening" : "Start voice recording"
          }
          className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white shadow-lg transition-all duration-300 hover:scale-105 ${
            listening
              ? "animate-pulse bg-red-500"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {listening ? "⏹" : "🎤"}
        </button>

        <p className="text-center text-sm font-medium text-slate-700">
          {listening
            ? language === "hi-IN"
              ? "सुन रहा हूँ... अपनी समस्या बताइए।"
              : "Listening... Describe your problem."
            : language === "hi-IN"
              ? "माइक दबाकर अपनी शिकायत बोलें।"
              : "Tap the microphone to speak your complaint."}
        </p>

        {listening && (
          <span className="flex items-center gap-2 text-xs font-semibold text-red-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            {language === "hi-IN" ? "रिकॉर्डिंग जारी है" : "Listening"}
          </span>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
    </div>
  );
}