🌦️ Weather AI Assistant

An intelligent Weather AI Assistant that provides real-time weather information with a modern chat-based UI and AI-generated summaries.
Built using FastAPI + React, powered by OpenWeatherMap API and a free Hugging Face LLM (with graceful fallback).

🚀 Features

🌍 Real-time weather data (temperature, condition, humidity, wind, visibility)

💬 Chat-based interface with smooth animations (GSAP)

🤖 AI-generated weather summaries & tips

🧠 Smart city extraction from natural language queries

🎨 Dynamic UI themes based on weather (sunny, rainy, cloudy)

🛡️ Safe fallback responses when AI service is unavailable

🔐 Secure environment variable handling (.env ignored)

🛠️ Tech Stack
Frontend

React.js

Tailwind CSS

GSAP (animations)

Lucide Icons

Backend

FastAPI

Python

OpenWeatherMap API

Hugging Face Inference API (Free LLM)

📂 Project Structure
weather-ai-assistant/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── agent.py
│   │   ├── tools/
│   │   │   └── weather.py
│   └── .env (ignored)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── .env (ignored)
│
└── README.md

⚙️ Environment Variables

Create a .env file inside backend/:

WEATHER_API_KEY=your_openweather_api_key
HF_API_TOKEN=your_huggingface_token   # optional (fallback works without it)


⚠️ .env files are ignored by Git for security reasons.

▶️ Running the Project
1️⃣ Backend Setup
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload


Backend runs at:

http://127.0.0.1:8000


API docs:

http://127.0.0.1:8000/docs

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

💬 Example Queries

Weather in Pune

Will it rain today in Mumbai?

Is Delhi cold right now?

How hot is Chennai today?

🧠 How It Works

User asks a question in natural language

Backend extracts the city name

Weather data fetched from OpenWeatherMap

AI model summarizes weather (if available)

If AI fails → deterministic fallback response

Frontend displays:

Chat response

Weather card

Animated UI feedback

🔐 Security Notes

API keys are never committed

GitHub secret scanning enabled

History rewritten to remove leaked credentials

.env files ignored via .gitignore

📈 Future Improvements

🌐 Multi-day weather forecast

📍 Location-based auto detection

🧠 Better NLP intent detection

📱 Mobile-first UI enhancements

☁️ Cloud deployment (AWS / Vercel / Render)

👤 Author

Harsh Bambatkar
Computer Science Engineer | Frontend • Cloud • AI
GitHub: @Harshb234
