from .configuration import model

from .prompts.travel_agent_instruction import instructions

from agents import Agent

travel_agent = Agent(
    name="Travel Agent",
    instructions=instructions,
    model=model,
)
