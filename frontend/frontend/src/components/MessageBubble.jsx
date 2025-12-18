import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MessageBubble({ message, isUser }) {
  const bubbleRef = useRef(null);

  // 🛡️ ABSOLUTE SAFETY
  let safeMessage = message;

  if (typeof safeMessage !== "string") {
    try {
      safeMessage = JSON.stringify(safeMessage);
    } catch {
      safeMessage = "⚠️ Invalid message";
    }
  }

  useEffect(() => {
    if (!bubbleRef.current) return;

    gsap.fromTo(
      bubbleRef.current,
      {
        x: isUser ? 40 : -40,
        opacity: 0,
        scale: 0.95,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "power3.out",
      }
    );
  }, []); // run once

  return (
    <div
      ref={bubbleRef}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            : "bg-white border border-gray-200 text-gray-800"
        }`}
      >
        {safeMessage}
      </div>
    </div>
  );
}
