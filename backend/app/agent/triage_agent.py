from .configuration import model

from .prompts.triage_agent_instruction import instructions

from .travel_agent import travel_agent
from .food_agent import food_agent
from .shopping_agent import shopping_agent
from agents import Agent

traige_agent = Agent(
    name="Triage Agent",
    instructions=instructions,
    model=model,
    handoffs=[travel_agent, food_agent, shopping_agent],
)
