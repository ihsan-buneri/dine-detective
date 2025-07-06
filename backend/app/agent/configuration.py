from dotenv import load_dotenv
import os
import logging


from agents import (
    OpenAIChatCompletionsModel,
    set_tracing_disabled,
    AsyncOpenAI,
    enable_verbose_stdout_logging,
)


set_tracing_disabled(disabled=True)


load_dotenv()


API_KEY = os.getenv("GROQ_API_KEY")
MODEL = os.getenv("BASE_MODEL")
BASE_URL = os.getenv("BASE_URL")

if not API_KEY or not MODEL or not BASE_URL:
    raise RuntimeError("Missing GEMINI_API_KEY or MODEL or BASE URL in your .env")

client = AsyncOpenAI(api_key=API_KEY, base_url=BASE_URL)

model = OpenAIChatCompletionsModel(
    model=MODEL,
    openai_client=client,
)


enable_verbose_stdout_logging()

os.makedirs("./logs/agent", exist_ok=True)

# Configure logger
logger = logging.getLogger("openai.agents")
logger.setLevel(logging.DEBUG)  # Set to lowest level to capture everything

# Create and configure file handler
file_handler = logging.FileHandler("./logs/agent/agent.log")
file_handler.setLevel(logging.DEBUG)  # Capture all levels
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
file_handler.setFormatter(formatter)


# Clear existing handlers and add new ones
logger.handlers.clear()
logger.addHandler(file_handler)
