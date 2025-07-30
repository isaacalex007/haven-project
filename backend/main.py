# backend/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Tuple
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import AgentExecutor, create_tool_calling_agent
from tools.property_tools import property_search, maps_service, yelp_service

load_dotenv()

class ChatRequest(BaseModel):
    message: str
    chat_history: List[Tuple[str, str]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    response: str

llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.4, google_api_key=os.getenv("GEMINI_API_KEY"))
tools = [property_search, maps_service, yelp_service]

prompt = ChatPromptTemplate.from_messages([
    ("system", """
    You are Haven, an expert AI real estate agent. Your goal is to be a proactive, insightful guide.
    - First, use the `property_search` tool to find a home that matches the user's dream.
    - **After finding a property**, you MUST use the `maps_service` and `yelp_service` tools to gather lifestyle data about that property's address.
    - Finally, synthesize all information from all tools into a single, clean JSON object with this structure: `{{"type": "property_card", "properties": [...]}}`. Do not add any text outside the JSON.
    """),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

app = FastAPI(title="Haven AI Backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.post("/api/v1/chat", response_model=ChatResponse, tags=["AI"])
async def chat(request: ChatRequest):
    try:
        # This corrected loop is easier to read and works correctly.
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
        return {"response": "An error occurred."}