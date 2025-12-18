import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import gsap from "gsap";

export default function LoadingIndicator() {
  const dotsRef = useRef([]);

  useEffect(() => {
    dotsRef.current.forEach((dot, i) => {
      if (dot) {
        gsap.to(dot, {
          y: -10,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          delay: i * 0.15,
          ease: "power1.inOut"
        });
      }
    });
  }, []);

  return (
    <div className="flex items-center gap-2 justify-center py-6">
      <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={el => dotsRef.current[i] = el}
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
        ))}
      </div>
      <span className="text-gray-600 text-sm ml-2">AI is thinking...</span>
    </div>
  );
}