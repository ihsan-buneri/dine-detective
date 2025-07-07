# this should contain schemas for request and response validation
from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    user_id: Optional[int] = None
    chat_id: Optional[int] = None
    query: str


class Response(BaseModel):
    status: str
    data: str
