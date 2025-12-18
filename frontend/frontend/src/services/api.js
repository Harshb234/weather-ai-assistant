// src/services/api.js
export async function askWeather(query) {
  const res = await fetch("http://127.0.0.1:8000/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error("API request failed");
  }

  const data = await res.json();

  // ✅ normalize response shape
  if (typeof data === "string") {
    return {
      response: data,
      weather: null,
    };
  }

  return {
    response: data.response ?? "⚠️ No AI response generated.",
    weather: data.weather ?? null,
  };
}
