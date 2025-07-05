from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("greet/{name}")
def greet(name: str):
    return {"Message": f"Hello, {name}!"}
