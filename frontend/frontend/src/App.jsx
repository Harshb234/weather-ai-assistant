import { useState, useEffect, useRef } from "react";
import { Cloud, Sun, CloudRain } from "lucide-react";
import gsap from "gsap";

import ChatBox from "./components/ChatBox.jsx";
import MessageBubble from "./components/MessageBubble.jsx";
import LoadingIndicator from "./components/LoadingIndicator.jsx";
import WeatherResponse from "./components/WeatherResponse.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { askWeather } from "./services/api.js";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [theme, setTheme] = useState("cloud");

  const titleRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* ---------------- Header animation ---------------- */
  useEffect(() => {
    if (!titleRef.current) return;

    gsap.fromTo(
      titleRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  /* ---------------- Auto scroll ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------------- Theme detection (SAFE) ---------------- */
  const detectTheme = (text = "") => {
    if (typeof text !== "string") return "cloud";

    const t = text.toLowerCase();
    if (t.includes("rain")) return "rain";
    if (t.includes("sun") || t.includes("hot") || t.includes("clear"))
      return "sun";
    return "cloud";
  };

  /* ---------------- Send handler (FINAL) ---------------- */
  const handleSend = async (query) => {
    if (!query?.trim() || loading) return;

    setMessages((prev) => [...prev, { text: query, isUser: true }]);
    setLoading(true);
    setWeather(null);

    try {
      const data = await askWeather(query);

      const aiText =
        typeof data?.response === "string"
          ? data.response
          : "⚠️ No response received.";

      setMessages((prev) => [
        ...prev,
        { text: aiText, isUser: false },
      ]);

      if (data?.weather && typeof data.weather === "object") {
        setWeather(data.weather);
      }

      setTheme(detectTheme(aiText));
    } catch (err) {
      console.error("Frontend error:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Something went wrong. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Background theme ---------------- */
  const backgroundClass =
    theme === "rain"
      ? "from-blue-200 to-gray-300"
      : theme === "sun"
      ? "from-yellow-100 to-pink-200"
      : "from-blue-50 via-purple-50 to-pink-50";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${backgroundClass} transition-all duration-500`}
    >
      <div className="container mx-auto px-4 py-6 max-w-4xl flex flex-col min-h-screen">

        {/* Header */}
        <div ref={titleRef} className="text-center mb-6">
          <div className="inline-flex items-center gap-3">
            <Cloud className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Weather AI Assistant
            </h1>
            <Sun className="w-10 h-10 text-yellow-500" />
          </div>
          <p className="text-gray-600 mt-2">
            Ask me anything about the weather
          </p>
        </div>

        {/* Chat Area */}
        <ErrorBoundary>
          <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-6 overflow-y-auto">

            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <CloudRain className="w-16 h-16 opacity-50" />
                <p className="font-medium">Try asking:</p>

                {[
                  "Weather in Pune",
                  "Will it rain today in Mumbai?",
                  "Is Delhi cold right now?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="px-4 py-2 bg-white rounded-full shadow hover:bg-blue-50 transition disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <MessageBubble
                key={`${i}-${msg.isUser}`}
                message={msg.text}
                isUser={msg.isUser}
              />
            ))}

            {loading && <LoadingIndicator />}

            {weather && typeof weather === "object" && (
              <WeatherResponse weather={weather} />
            )}

            <div ref={messagesEndRef} />
          </div>
        </ErrorBoundary>

        {/* Input */}
        <div className="mt-4">
          <ChatBox onSend={handleSend} loading={loading} />
        </div>
      </div>
    </div>
  );
}
