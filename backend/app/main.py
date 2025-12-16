from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.agent import run_agent

app = FastAPI(title="Weather AI Assistant")

# ✅ CORS (required for Swagger + React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Request schema
class QueryRequest(BaseModel):
    query: str

# ✅ Health check
@app.get("/")
def health():
    return {"status": "Backend running"}

# ✅ AI-powered weather endpoint
@app.post("/query")
def query_weather(payload: QueryRequest):
    """
    Takes a natural language weather query,
    generates AI-based weather explanation + advice.
    """
    response = run_agent(payload.query)
    return {"response": response}
