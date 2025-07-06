from pydantic import BaseModel

class ChatRequest(BaseModel):
    user_id: str
    query: str

class OrderRequest(BaseModel):
    user_id: str
    restaurant: str
    item: str
