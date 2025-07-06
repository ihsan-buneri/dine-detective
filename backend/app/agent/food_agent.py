from .configuration import model

from .prompts.travel_agent_instruction import instructions

from agents import Agent

food_agent = Agent(
    name="Food Agent",
    instructions=instructions,
    model=model,
)
