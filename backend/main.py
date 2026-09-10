from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ollama_interface import ChatLLM


app = FastAPI(
    title="Day Planner API",
    version="1.0.0"
)


chat_llm = ChatLLM()


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str


@app.get("/check")
def health():

    return {
        "status": "ok"
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    try:

        answer = chat_llm.chat(request.question)

        return {
            "answer": answer
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@app.get("/history")
def get_history():

    return {
        "history": chat_llm.getHistory()
    }


@app.get("/summary")
def get_summary():

    return {
        "summary": chat_llm.getSummary()
    }
