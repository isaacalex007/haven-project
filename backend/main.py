# backend/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Tuple
from dotenv import load_dotenv

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain.agents import AgentExecutor, create_tool_calling_agent

# Import our custom tools
from tools.property_tools import find_properties, find_properties_with_criteria

load_dotenv()

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    message: str
    chat_history: List[Tuple[str, str]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    response: str

# --- Agent Setup ---
llm = ChatGroq(model="Llama3-8b-8192", temperature=0.2, api_key=os.getenv("GROQ_API_KEY"))
tools = [find_properties, find_properties_with_criteria]

# --- 1. Refined the prompt for a more empathetic and proactive personality ---
prompt = ChatPromptTemplate.from_messages([
    ("system", """
    You are Haven, a world-class AI real estate assistant with a high degree of emotional intelligence.
    
    Your primary goal is to be a helpful, empathetic, and proactive guide. Don't just answer questions; anticipate the user's needs and lead the conversation to truly understand their "Life Brief." Your responses should always be warm, encouraging, and natural.

    - If a location is ambiguous (like "Portland"), you MUST ask for the state in a friendly way.
    - When a tool finds properties, your Final Answer MUST be a single, clean JSON object with this structure: `{{"type": "property_scorecard", ...}}`.
    - For all other conversational turns, respond with a helpful, friendly text message.
    """),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)

# --- 2. Set `verbose=False` for a clean demonstration ---
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=False)


# --- FastAPI App ---
app = FastAPI(title="Haven AI Backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/api/v1/health", tags=["Status"])
def get_health():
    return {"status": "ok"}

@app.post("/api/v1/chat", response_model=ChatResponse, tags=["AI"])
async def chat(request: ChatRequest):
    """Receives a user message and chat history, returns the agent's response."""
    try:
        history = []
        for human_msg, ai_msg in request.chat_history:
            history.append(("human", human_msg))
            history.append(("ai", ai_msg))

        response = await agent_executor.ainvoke({
            "input": request.message,
            "chat_history": history
        })
        return {"response": response.get("output")}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"response": "Sorry, I encountered an error. Please try again."}