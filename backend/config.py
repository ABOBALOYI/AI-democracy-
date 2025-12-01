"""Configuration for the LLM Council."""

import os
from dotenv import load_dotenv

load_dotenv()

# OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Council members - list of OpenRouter model identifiers
COUNCIL_MODELS = [
    "openai/gpt-4o",
    "google/gemini-2.0-flash-001",
    "anthropic/claude-3.5-sonnet",
    "x-ai/grok-3-mini-beta",
    "deepseek/deepseek-chat",
    "perplexity/sonar-pro",
]

# Default chairman model - synthesizes final response
DEFAULT_CHAIRMAN_MODEL = "google/gemini-2.0-flash-001"

# For backwards compatibility
CHAIRMAN_MODEL = DEFAULT_CHAIRMAN_MODEL

# OpenRouter API endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
