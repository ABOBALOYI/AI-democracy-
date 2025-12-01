# AI Democracy

![AI Democracy](header.jpg)

> 🙏 **Credits:** This project is a fork of [LLM Council](https://github.com/karpathy/llm-council) by [Andrej Karpathy](https://github.com/karpathy). Original concept and implementation by Karpathy.

A democratic AI council where multiple LLMs vote on the best response. Instead of asking a single AI, you consult a council of 6 AI models who respond, vote on each other's answers, and the winner synthesizes the final response.

## How It Works

1. **Stage 1: Individual Responses** - All 6 AI models answer your question independently
2. **Stage 2: Peer Voting** - Each model ranks the others' responses (anonymized to prevent bias)
3. **Stage 3: Chairman Synthesis** - The winning model (or your chosen chairman) synthesizes the final answer

## ✨ New Features (AI Democracy Edition)

### 🎨 Redesigned UI
- Glassmorphism design with soft shadows and blur effects
- Clean, minimal aesthetic inspired by modern chat interfaces
- Responsive layout with smooth animations

### 👑 Auto Chairman
- **Winner becomes chairman** - The top-ranked model from voting automatically synthesizes Stage 3
- **Manual override** - Select any of the 6 models as chairman if you prefer
- **Winner badge** - Shows 👑 crown and "Winner" label on the chairman

### 📊 Compare All Responses
- Side-by-side view of all AI responses in a grid layout
- Quick access via "Compare" button after responses arrive
- Press `Escape` to close modals

### 🗂️ Conversation Management
- Auto-generated titles from your first message
- Delete conversations with hover delete button
- Chat header showing current conversation title

## Setup

### 1. Install Dependencies

**Backend:**
```bash
uv sync
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure API Key

Create a `.env` file in the project root:

```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

Get your API key at [openrouter.ai](https://openrouter.ai/).

### 3. Configure Models (Optional)

Edit `backend/config.py` to customize the council:

```python
COUNCIL_MODELS = [
    "openai/gpt-4o",
    "google/gemini-2.0-flash-001",
    "anthropic/claude-3.5-sonnet",
    "x-ai/grok-3-mini-beta",
    "deepseek/deepseek-chat",
    "perplexity/sonar-pro",
]
```

## Running the Application

**Option 1: Use the start script**
```bash
./start.sh
```

**Option 2: Run manually**

Terminal 1 (Backend):
```bash
uv run python -m backend.main
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## Tech Stack

- **Backend:** FastAPI, async httpx, OpenRouter API
- **Frontend:** React + Vite, react-markdown
- **Storage:** JSON files in `data/conversations/`
- **Design:** Glassmorphism, CSS variables

## License

MIT - See original [LLM Council](https://github.com/karpathy/llm-council) for details.
