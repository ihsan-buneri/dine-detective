from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from app.models import OrderRequest, ChatRequest
from app.agents import restaurant_discovery_agent
from app.knowledge_graph import update_user_profile


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

@app.post("/discover")
async def discover_restaurants(request: ChatRequest):
    results = restaurant_discovery_agent(request.query, request.user_id)
    update_user_profile(request.user_id, "searched", request.query)
    return {"recommendations": results}

@app.post("/order")
async def place_order(order: OrderRequest):
    update_user_profile(order.user_id, "ordered", order.item)
    return {"status": "success", "message": f"Order placed for {order.item}"}