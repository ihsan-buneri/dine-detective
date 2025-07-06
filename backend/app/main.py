from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# from app.models import OrderRequest, ChatRequest
# from app.agents import restaurant_discovery_agent
# from app.knowledge_graph import update_user_profile

from .agent.triage_agent import traige_agent

from agents import Runner


from .schemas import ChatRequest, Response

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Basic route
@app.get("/")
def read_root():
    return {"Message": "Hello World! FastAPI is working."}


@app.get("/greet/{name}")
def greet(name: str):
    return {"Message": f"Hello, {name}!"}


@app.post("/chat/")
async def chat(req: ChatRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Message query cannot be empty")

    try:
        result = await Runner.run(traige_agent, input=req.query)
        print(f"Agent response: {result.final_output}")
        response = result.final_output

        print(f"Extracted response: {response}")
        if not response:
            raise HTTPException(
                status_code=500,
                detail="Failed to extract valid JSON from agent response",
            )
        return Response(status="success", data=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
