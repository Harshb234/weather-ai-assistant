import os
import re
import requests
from dotenv import load_dotenv

from app.tools.weather import get_weather

load_dotenv()

# -----------------------------
# Hugging Face FREE model
# -----------------------------
# -----------------------------
# Hugging Face FREE model (UPDATED)
# -----------------------------
HF_MODEL_URL = (
    "https://router.huggingface.co/hf-inference/models/"
    "mistralai/Mistral-7B-Instruct-v0.2"
)

HF_API_TOKEN = os.getenv("HF_API_TOKEN")

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {HF_API_TOKEN}" if HF_API_TOKEN else ""
}


# -----------------------------
# Robust city extractor
# -----------------------------
def extract_city(query: str) -> str:
    query = query.lower()

    patterns = [
        r"weather in ([a-zA-Z\s]+)",
        r"rain.*in ([a-zA-Z\s]+)",
        r"cold.*in ([a-zA-Z\s]+)",
        r"hot.*in ([a-zA-Z\s]+)",
        r"in ([a-zA-Z\s]+)"
    ]

    for pattern in patterns:
        match = re.search(pattern, query)
        if match:
            city = match.group(1)
            city = re.sub(r"\b(today|now|tomorrow|right now|please)\b", "", city)
            return city.strip().title()

    return ""

# -----------------------------
# Main agent
# -----------------------------
def run_agent(query: str) -> dict:
    city = extract_city(query)

    if not city:
        return {
            "response": "🤔 Please mention a city, e.g. **Weather in Pune**.",
            "weather": None
        }

    weather = get_weather(city)

    if not isinstance(weather, dict) or "error" in weather:
        return {
            "response": f"❌ I couldn’t find weather data for **{city}**.",
            "weather": None
        }

    # -----------------------------
    # Prepare AI prompt
    # -----------------------------
    prompt = (
        "You are a friendly weather assistant.\n"
        "Summarize the weather and give short advice.\n\n"
        f"City: {city}\n"
        f"Weather Data: {weather}\n"
    )

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 120,
            "temperature": 0.7,
            "return_full_text": False
        }
    }

    # -----------------------------
    # Try AI response
    # -----------------------------
    ai_text = None

    if HF_API_TOKEN:
        try:
            response = requests.post(
                HF_MODEL_URL,
                headers=HEADERS,
                json=payload,
                timeout=25
            )

            data = response.json()

            # HF error / loading / rate-limit
            if isinstance(data, dict) and data.get("error"):
                raise Exception(data["error"])

            if isinstance(data, list) and data:
                text = data[0].get("generated_text")
                if isinstance(text, str) and text.strip():
                    ai_text = text.strip()

        except Exception as e:
            print("HF error:", e)

    # -----------------------------
    # Fallback (ALWAYS RETURNS)
    # -----------------------------
    if not ai_text:
        ai_text = (
            f"🌤️ Weather in **{city}** is {weather.get('description', 'pleasant')}.\n"
            f"🌡️ Temperature is around {weather.get('temperature', 'N/A')}°C.\n"
            f"💡 Tip: Stay hydrated and plan your day accordingly!"
        )

    return {
        "response": ai_text,
        "weather": {
            "city": city,
            "temp": weather.get("temperature"),
            "condition": weather.get("description"),
            "humidity": weather.get("humidity"),
            "windSpeed": weather.get("wind_speed"),
            "visibility": weather.get("visibility"),
        }
    }
