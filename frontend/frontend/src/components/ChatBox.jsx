import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatBox({ onSend, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || loading) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white border-2 border-blue-200 shadow-lg rounded-xl p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about weather… (e.g., Weather in Pune)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={loading}
            className="flex-1 h-11 rounded-lg border-2 border-blue-300 px-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600
                       hover:from-blue-600 hover:to-purple-700
                       text-white px-4 rounded-lg
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
