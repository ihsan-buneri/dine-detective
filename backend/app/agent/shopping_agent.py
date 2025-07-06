from .configuration import model

from .prompts.shopping_agent_instruction import instructions

from agents import Agent

shopping_agent = Agent(
    name="Shopping Agent",
    instructions=instructions,
    model=model,
)
