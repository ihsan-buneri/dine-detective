from openai import OpenAI
import json
import os
from dotenv import load_dotenv


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def restaurant_discovery_agent(prompt: str, user_id: str):
    with open("data/restaurants.json", "r", encoding="utf-8") as f:
        restaurants = json.load(f)

    messages = [
        {"role": "system", "content": "You help users find restaurants."},
        {"role": "user", "content": prompt}
    ]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages
    )

    # La respuesta está en:
    # response.choices[0].message.content

    return restaurants[:3]
