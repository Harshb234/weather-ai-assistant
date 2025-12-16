import os
import re
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

from app.tools.weather import get_weather

load_dotenv()

# -----------------------------
# LLM (OpenRouter)
# -----------------------------
llm = ChatOpenAI(
    openai_api_key=os.getenv("OPENROUTER_API_KEY"),
    model=os.getenv("OPENROUTER_MODEL"),
    base_url="https://openrouter.ai/api/v1",
    temperature=0.7,
    default_headers={
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Weather AI Assistant",
    },
)

# -----------------------------
# Robust city extractor (regex)
# -----------------------------
def extract_city(query: str) -> str:
    """
    Extracts city name from phrases like:
    - weather in Pune
    - weather of Mumbai today
    - is it hot in Delhi now
    """
    query = query.lower()

    match = re.search(r"(?:in|of)\s+([a-zA-Z\s]+)", query)
    if match:
        city = match.group(1)
        city = re.sub(r"\b(today|now|tomorrow|please)\b", "", city)
        return city.strip().title()

    return ""

# -----------------------------
# Main function
# -----------------------------
def run_agent(query: str) -> str:
    city = extract_city(query)

    if not city:
        return "🤔 I couldn’t detect the city. Try asking like: **Weather in Pune**."

    weather = get_weather(city)

    if "error" in weather:
        return f"❌ I couldn’t find weather data for **{city}**. Please check the city name."

    prompt = f"""
You are a friendly AI weather assistant.

Weather data:
City: {city}
Data: {weather}

Explain the weather in simple language and give short advice.
Use emojis if suitable.
Keep it under 3 lines.
"""

    response = llm.invoke(prompt)
    return response.content
