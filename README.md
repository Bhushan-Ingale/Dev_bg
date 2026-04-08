# DevAI Backend — Setup & Run Guide

## Quick Start (Demo — No MongoDB needed)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env           # defaults work for demo
uvicorn app.main:app --reload --port 8000
```

Visit http://localhost:8000/docs to see all API endpoints.

---

## Demo Login Credentials

| Role    | Email         | Password     |
|---------|---------------|--------------|
| Guide   | guide@123     | anything123  |
| Student | student@123   | anything123  |

---

## With MongoDB Atlas (Persistent Data)

1. Create free account at https://mongodb.com/atlas
2. Create M0 cluster (free tier, no credit card)
3. Get connection string → add to `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true
```

4. Restart the server → data now persists between restarts.

---

## With Gemini AI (Real AI Insights)

1. Get free API key at https://makersuite.google.com/app/apikey
2. Add to `.env`:

```env
GEMINI_API_KEY=AIzaSy...your-key-here
```

3. Restart → analytics will include Gemini-generated insights.
   Falls back to rule-based engine if key is missing/invalid.

---

## API Endpoints Summary

| Method | Path                                | Description                        |
|--------|-------------------------------------|------------------------------------|
| POST   | /api/auth/login                     | Login (demo or DB users)           |
| POST   | /api/auth/register                  | Register new user                  |
| GET    | /api/auth/me                        | Get current user                   |
| GET    | /api/teams                          | List all teams                     |
| POST   | /api/teams                          | Create team (guide only)           |
| GET    | /api/teams/{id}                     | Get team by ID                     |
| PUT    | /api/teams/{id}                     | Update team (add/swap repos)       |
| DELETE | /api/teams/{id}                     | Delete team                        |
| GET    | /api/teams/{id}/analytics           | Get GitHub analytics (cached)      |
| GET    | /api/teams/{id}/analytics?refresh=true | Force re-fetch from GitHub      |
| POST   | /api/teams/{id}/analytics/refresh   | Same via POST                      |
| GET    | /api/tasks                          | List tasks (filter by team/status) |
| POST   | /api/tasks                          | Create task                        |
| PUT    | /api/tasks/{id}                     | Update task (drag-drop status)     |
| DELETE | /api/tasks/{id}                     | Delete task                        |
| GET    | /api/events                         | List calendar events               |
| POST   | /api/events                         | Create event                       |
| PUT    | /api/events/{id}                    | Update event                       |
| DELETE | /api/events/{id}                    | Delete event                       |
| POST   | /api/chat                           | AI chatbot (stub for teammate)     |
| GET    | /health                             | Health check (DB status)           |
| GET    | /docs                               | Swagger UI                         |

---

## Project Structure

```
backend/
├── app/
│   └── main.py          ← FastAPI app, all routes, seed data
├── models/
│   ├── user.py          ← UserCreate, UserLogin, UserResponse
│   ├── team.py          ← TeamCreate, TeamUpdate, RepoEntry (GitHub validation)
│   ├── task.py          ← TaskCreate, TaskUpdate, enums
│   └── event.py         ← EventCreate, EventType enum
├── services/
│   ├── git_analyzer.py  ← GitPython: clone → extract → aggregate
│   └── ai_insights.py   ← Gemini + rule-based fallback
├── utils/
│   ├── db.py            ← Motor async driver + in-memory MockDB fallback
│   └── auth.py          ← JWT create/verify, bcrypt password hashing
├── requirements.txt
├── .env.example
└── README.md
```

---

## How Analytics Work

```
GET /api/teams/{id}/analytics
        │
        ├─ Cache valid (< 30 min)? → Return cached
        │
        ├─ Has GitHub repo URL?
        │   ├─ Yes → GitAnalyzer.get_team_stats()
        │   │         (shallow clone → iter_commits → aggregate)
        │   └─ No  → _generate_analytics() (deterministic fake data)
        │
        ├─ GEMINI_API_KEY set?
        │   ├─ Yes → Gemini 1.5 Flash generates 3 insights
        │   └─ No  → Rule engine generates 3 insights
        │
        └─ Cache result → Return
```

---

## Chatbot Integration (for Teammate)

Replace the `/api/chat` endpoint body in `app/main.py`:

```python
# services/rag_chain.py  (teammate creates this)
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
import chromadb

async def ask(question: str, team_id: str) -> str:
    # 1. Load team's code embeddings from ChromaDB
    # 2. Retrieve relevant context
    # 3. Ask Gemini with context
    # 4. Return answer
    ...

# In app/main.py, replace chat() body:
from services.rag_chain import ask
return {"response": await ask(message, team_id), "sources": [...]}
```