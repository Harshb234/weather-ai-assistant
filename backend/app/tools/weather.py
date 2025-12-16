import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")
print("API KEY:", API_KEY)

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def get_weather(city: str):
    if not API_KEY:
        return {"error": "API key missing"}

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200:
        return {"error": "City not found"}

    data = response.json()

    return {
        "city": city,
        "temperature": data["main"]["temp"],
        "condition": data["weather"][0]["main"],
        "humidity": data["main"]["humidity"]
    }
