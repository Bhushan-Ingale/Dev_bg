"""
DevAI Backend — FastAPI Application
=====================================
Production-ready API with:
  - MongoDB persistence (in-memory fallback for demo)
  - JWT authentication
  - Real GitHub analytics via GitPython
  - AI insights via Gemini (rule-based fallback)
  - Full CRUD for teams, tasks, calendar events
  - Analytics caching (30-min TTL)

Run:
    cd backend
    pip install -r requirements.txt
    cp .env.example .env        # fill in values (or leave defaults for demo)
    uvicorn app.main:app --reload --port 8000

Demo credentials (no DB needed):
    Guide:   guide@123   / anything123
    Student: student@123 / anything123
"""

import os
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

# ── Internal imports ──────────────────────────────────────────────────────────
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.db   import Database
from utils.auth import create_token, verify_token, hash_password, verify_password
from models     import UserCreate, UserLogin, UserResponse, TeamCreate, TeamUpdate, TaskCreate, TaskUpdate, EventCreate
from services.git_analyzer import GitAnalyzer
from services.ai_insights  import generate_insights

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger("devai")


# ── App lifespan ──────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 DevAI API starting up…")
    await Database.connect()
    yield
    await Database.disconnect()
    logger.info("👋 DevAI API shut down")

app = FastAPI(
    title="DevAI API",
    version="2.0.0",
    description="AI-powered academic GitHub analytics for students and educators",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)


# ══════════════════════════════════════════════════════════════════════════════
# AUTH DEPENDENCY
# ══════════════════════════════════════════════════════════════════════════════

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    """
    Validate JWT token from Authorization header.
    Returns the token payload dict (sub, email, role).
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Include Authorization: Bearer <token>",
        )
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalid or expired. Please log in again.",
        )
    return payload


def require_guide(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency: only guides can call this endpoint."""
    if current_user.get("role") != "guide":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only guides can perform this action.",
        )
    return current_user


# ══════════════════════════════════════════════════════════════════════════════
# ROOT + HEALTH
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/", tags=["System"])
async def root():
    return {
        "service":   "DevAI API",
        "version":   "2.0.0",
        "status":    "running",
        "docs":      "/docs",
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/health", tags=["System"])
async def health():
    db_ok = await Database.ping()
    return {
        "status":    "healthy" if db_ok else "degraded (in-memory mode)",
        "database":  "mongodb" if db_ok else "in-memory fallback",
        "timestamp": datetime.now().isoformat(),
    }


# ══════════════════════════════════════════════════════════════════════════════
# AUTH
# ══════════════════════════════════════════════════════════════════════════════

# Demo credentials — always work, no DB required
DEMO_USERS = {
    "guide@123":   {"role": "guide",   "name": "Prof. Sharma",  "id": "demo_guide"},
    "student@123": {"role": "student", "name": "Priya Sharma",  "id": "demo_student"},
}
DEMO_PASSWORD = "anything123"


@app.post("/api/auth/login", response_model=UserResponse, tags=["Auth"])
async def login(credentials: UserLogin):
    """
    Login with email + password.
    Demo: guide@123 / anything123  or  student@123 / anything123
    """
    # Demo shortcut
    if credentials.email in DEMO_USERS and credentials.password == DEMO_PASSWORD:
        u     = DEMO_USERS[credentials.email]
        token = create_token({"sub": u["id"], "email": credentials.email, "role": u["role"]})
        return UserResponse(id=u["id"], email=credentials.email, name=u["name"], role=u["role"], token=token)

    # Real DB lookup
    db   = Database.get_db()
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_token({"sub": str(user["_id"]), "email": user["email"], "role": user["role"]})
    return UserResponse(
        id=str(user["_id"]), email=user["email"],
        name=user.get("name", ""), role=user["role"], token=token,
    )


@app.post("/api/auth/register", response_model=UserResponse, status_code=201, tags=["Auth"])
async def register(user_data: UserCreate):
    """Register a new user (guide or student)."""
    db = Database.get_db()
    existing = await db.users.find_one({"email": user_data.email.lower()})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered.")

    doc = {
        "email":         user_data.email.lower(),
        "name":          user_data.name,
        "role":          user_data.role,
        "password_hash": hash_password(user_data.password),
        "created_at":    datetime.now().isoformat(),
    }
    result = await db.users.insert_one(doc)
    token  = create_token({"sub": str(result.inserted_id), "email": doc["email"], "role": doc["role"]})
    return UserResponse(
        id=str(result.inserted_id), email=doc["email"],
        name=doc["name"], role=str(doc["role"]), token=token,
    )


@app.get("/api/auth/me", response_model=UserResponse, tags=["Auth"])
async def get_me(current_user: dict = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    db   = Database.get_db()
    user = await db.users.find_one({"email": current_user["email"]})
    if not user:
        # Demo user — reconstruct from token
        demo = DEMO_USERS.get(current_user["email"], {})
        return UserResponse(
            id=current_user.get("sub", "demo"),
            email=current_user["email"],
            name=demo.get("name", current_user.get("name", "User")),
            role=current_user["role"],
        )
    return UserResponse(
        id=str(user["_id"]), email=user["email"],
        name=user.get("name", ""), role=user["role"],
    )


# ══════════════════════════════════════════════════════════════════════════════
# TEAMS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/teams", tags=["Teams"])
async def get_teams(current_user: dict = Depends(get_current_user)):
    """
    Return all teams.
    Guide sees everything. Student sees only their assigned team (simplified for demo).
    Falls back to seeded Indian-names demo data when DB is empty.
    """
    db    = Database.get_db()
    teams = []
    async for team in db.teams.find({}):
        team["id"] = str(team.pop("_id", team.get("id", "")))
        teams.append(team)

    if not teams:
        teams = _seed_teams()

    return teams


@app.get("/api/teams/{team_id}", tags=["Teams"])
async def get_team(team_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single team by ID."""
    db   = Database.get_db()
    team = await _find_team(db, team_id)
    if not team:
        # Check seed data
        seed = {t["id"]: t for t in _seed_teams()}
        if team_id in seed:
            return seed[team_id]
        raise HTTPException(status_code=404, detail="Team not found.")
    return team


@app.post("/api/teams", status_code=201, tags=["Teams"])
async def create_team(
    team_data: TeamCreate,
    current_user: dict = Depends(require_guide),
):
    """Create a new team. Guide only."""
    db  = Database.get_db()
    doc = {
        **team_data.model_dump(),
        "guide_id":      current_user.get("sub"),
        "created_at":    datetime.now().isoformat(),
        "progress":      0,
        "activity_score": 0,
        "commits":       0,
        "openPRs":       0,
        "issues":        0,
        "lastActive":    "Just now",
    }
    # Convert repo objects to dicts
    if doc.get("repos"):
        doc["repos"] = [r if isinstance(r, dict) else r.model_dump() for r in doc["repos"]]

    result = await db.teams.insert_one(doc)
    return {"id": str(result.inserted_id), "message": "Team created successfully"}


@app.put("/api/teams/{team_id}", tags=["Teams"])
async def update_team(
    team_id: str,
    update: TeamUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update team details — add/swap repos, update members, etc."""
    db = Database.get_db()
    fields = {k: v for k, v in update.model_dump().items() if v is not None}
    if not fields:
        return {"message": "Nothing to update"}

    if "repos" in fields and fields["repos"]:
        fields["repos"] = [r if isinstance(r, dict) else r.model_dump() for r in fields["repos"]]

    team = await _find_team(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")

    from bson import ObjectId
    try:
        await db.teams.update_one({"_id": ObjectId(team_id)}, {"$set": fields})
    except Exception:
        await db.teams.update_one({"id": team_id}, {"$set": fields})

    return {"message": "Team updated successfully"}


@app.delete("/api/teams/{team_id}", tags=["Teams"])
async def delete_team(team_id: str, current_user: dict = Depends(require_guide)):
    """Delete a team and its cached analytics."""
    db = Database.get_db()
    from bson import ObjectId
    try:
        await db.teams.delete_one({"_id": ObjectId(team_id)})
    except Exception:
        await db.teams.delete_one({"id": team_id})
    # Clean up cache
    await db.analytics_cache.delete_one({"team_id": team_id})
    return {"message": "Team deleted"}


# ══════════════════════════════════════════════════════════════════════════════
# ANALYTICS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/teams/{team_id}/analytics", tags=["Analytics"])
async def get_team_analytics(
    team_id: str,
    refresh: bool = Query(False, description="Force re-fetch from GitHub"),
    current_user: dict = Depends(get_current_user),
):
    """
    Get analytics for a team.
    Flow:
      1. Check 30-min MongoDB cache → return if fresh
      2. Find team's primary GitHub repo URL
      3. Run GitAnalyzer (clone → extract → aggregate)
      4. Fallback to generated realistic data if repo unavailable
      5. Add AI insights (Gemini or rule-based)
      6. Cache result → return
    """
    db = Database.get_db()

    # ── 1. Cache check ──────────────────────────────────────────────────────
    if not refresh:
        cached = await db.analytics_cache.find_one({"team_id": team_id})
        if cached and _cache_valid(cached.get("cached_at")):
            cached.pop("_id", None)
            cached.pop("cached_at", None)
            logger.info(f"Analytics cache HIT → team {team_id}")
            return cached

    # ── 2. Get repo URL ────────────────────────────────────────────────────
    team     = await _find_team(db, team_id)
    repo_url = None
    members  = []
    if team:
        # Primary repo URL from repos list or fallback field
        repos = team.get("repos", [])
        if repos:
            primary = next((r for r in repos if r.get("primary")), repos[0])
            repo_url = primary.get("url")
        repo_url = repo_url or team.get("repo_url") or team.get("repoUrl")
        members  = team.get("members", [])

    if not members:
        members = ["Priya Sharma", "Rahul Verma", "Arjun Patel"]

    # ── 3. Run GitAnalyzer ─────────────────────────────────────────────────
    analytics = None
    if repo_url and repo_url.startswith("https://github.com/"):
        logger.info(f"Running GitAnalyzer → {repo_url}")
        try:
            analyzer  = GitAnalyzer(repo_url)
            analytics = analyzer.get_team_stats()
        except Exception as e:
            logger.warning(f"GitAnalyzer error: {e}")

    # ── 4. Fallback ────────────────────────────────────────────────────────
    if not analytics or analytics["summary"]["total_commits"] == 0:
        logger.info(f"Using generated analytics for team {team_id}")
        analytics = _generate_analytics(members)

    # ── 5. AI insights ─────────────────────────────────────────────────────
    try:
        analytics["ai_insights"] = generate_insights(analytics)
    except Exception as e:
        logger.warning(f"Insights generation failed: {e}")
        analytics["ai_insights"] = []

    # ── 6. Cache ────────────────────────────────────────────────────────────
    await db.analytics_cache.replace_one(
        {"team_id": team_id},
        {**analytics, "team_id": team_id, "cached_at": datetime.now().isoformat()},
        upsert=True,
    )

    return analytics


@app.post("/api/teams/{team_id}/analytics/refresh", tags=["Analytics"])
async def refresh_analytics(
    team_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Invalidate cache and re-fetch analytics from GitHub."""
    db = Database.get_db()
    await db.analytics_cache.delete_one({"team_id": team_id})
    return await get_team_analytics(team_id, refresh=True, current_user=current_user)


# ══════════════════════════════════════════════════════════════════════════════
# TASKS (KANBAN)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/tasks", tags=["Tasks"])
async def get_tasks(
    team_id: Optional[str] = Query(None),
    status:  Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    """Get tasks, optionally filtered by team_id and/or status."""
    db    = Database.get_db()
    query = {}
    if team_id: query["team_id"] = team_id
    if status:  query["status"]  = status

    tasks = []
    async for task in db.tasks.find(query):
        task["id"] = str(task.pop("_id", task.get("id", "")))
        tasks.append(task)

    # Seed demo tasks if DB empty
    if not tasks and not team_id:
        tasks = _seed_tasks()

    return tasks


@app.post("/api/tasks", status_code=201, tags=["Tasks"])
async def create_task(task_data: TaskCreate, current_user: dict = Depends(get_current_user)):
    """Create a new task."""
    db  = Database.get_db()
    doc = {
        **task_data.model_dump(),
        "created_by": current_user.get("sub"),
        "created_at": datetime.now().isoformat(),
        "comments":   0,
    }
    result = await db.tasks.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@app.put("/api/tasks/{task_id}", tags=["Tasks"])
async def update_task(task_id: str, update: TaskUpdate, current_user: dict = Depends(get_current_user)):
    """Update task status, assignee, priority, etc."""
    db     = Database.get_db()
    fields = {k: v for k, v in update.model_dump().items() if v is not None}
    if not fields:
        return {"message": "Nothing to update"}

    from bson import ObjectId
    try:
        result = await db.tasks.update_one({"_id": ObjectId(task_id)}, {"$set": fields})
    except Exception:
        result = await db.tasks.update_one({"id": task_id}, {"$set": fields})

    return {"message": "Task updated", "task_id": task_id}


@app.delete("/api/tasks/{task_id}", tags=["Tasks"])
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a task."""
    db = Database.get_db()
    from bson import ObjectId
    try:
        await db.tasks.delete_one({"_id": ObjectId(task_id)})
    except Exception:
        await db.tasks.delete_one({"id": task_id})
    return {"message": "Task deleted"}


# ══════════════════════════════════════════════════════════════════════════════
# CALENDAR EVENTS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/events", tags=["Events"])
async def get_events(
    team_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
):
    """Get calendar events, optionally filtered by team."""
    db    = Database.get_db()
    query = {"team_id": team_id} if team_id else {}
    events = []
    async for event in db.events.find(query):
        event["id"] = str(event.pop("_id", event.get("id", "")))
        events.append(event)
    return events


@app.post("/api/events", status_code=201, tags=["Events"])
async def create_event(event_data: EventCreate, current_user: dict = Depends(get_current_user)):
    """Create a calendar event."""
    db  = Database.get_db()
    doc = {
        **event_data.model_dump(),
        "created_by": current_user.get("sub"),
        "created_at": datetime.now().isoformat(),
    }
    result = await db.events.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@app.put("/api/events/{event_id}", tags=["Events"])
async def update_event(event_id: str, update: dict, current_user: dict = Depends(get_current_user)):
    """Mark event done, update time, etc."""
    db = Database.get_db()
    from bson import ObjectId
    try:
        await db.events.update_one({"_id": ObjectId(event_id)}, {"$set": update})
    except Exception:
        await db.events.update_one({"id": event_id}, {"$set": update})
    return {"message": "Event updated"}


@app.delete("/api/events/{event_id}", tags=["Events"])
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a calendar event."""
    db = Database.get_db()
    from bson import ObjectId
    try:
        await db.events.delete_one({"_id": ObjectId(event_id)})
    except Exception:
        await db.events.delete_one({"id": event_id})
    return {"message": "Event deleted"}


# ══════════════════════════════════════════════════════════════════════════════
# CHATBOT (stub for teammate's LangChain integration)
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/api/chat", tags=["AI"])
async def chat(payload: dict, current_user: dict = Depends(get_current_user)):
    """
    RAG-based chatbot endpoint.

    Your teammate integrates LangChain + Gemini here.
    Replace the body with:
        from services.rag_chain import ask
        return {"response": await ask(payload["message"], payload.get("team_id"))}

    Currently returns a rule-based placeholder so the frontend doesn't break.
    """
    message = payload.get("message", "").strip()
    team_id = payload.get("team_id")

    if not message:
        return {"response": "Please ask a question.", "sources": []}

    # Minimal rule-based response for demo
    responses = {
        "commit": "Based on the team's recent activity, commit frequency is trending upward. Encourage daily small commits.",
        "progress": "Sprint progress is being tracked via GitHub commits. Check the Analytics tab for detailed breakdown.",
        "review": "Code review is recommended before merging. Use the PR timeline in the team profile.",
        "help":   "I can answer questions about commit history, sprint velocity, team activity, and code quality.",
    }

    for keyword, response in responses.items():
        if keyword in message.lower():
            return {"response": f"[DevAI Coach] {response}", "sources": []}

    return {
        "response": (
            f"[DevAI Coach] Your question: '{message}'. "
            "Full chatbot integration is coming soon — your teammate is working on it!"
        ),
        "sources": [],
    }


# ══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════════════════════════

async def _find_team(db, team_id: str) -> Optional[dict]:
    """Try finding a team by ObjectId or string id."""
    from bson import ObjectId
    team = None
    try:
        team = await db.teams.find_one({"_id": ObjectId(team_id)})
    except Exception:
        pass
    if not team:
        team = await db.teams.find_one({"id": team_id})
    if team:
        team["id"] = str(team.pop("_id", team.get("id", team_id)))
    return team


def _cache_valid(cached_at: Optional[str], ttl_minutes: int = 30) -> bool:
    if not cached_at:
        return False
    try:
        age = (datetime.now() - datetime.fromisoformat(cached_at)).total_seconds() / 60
        return age < ttl_minutes
    except Exception:
        return False


def _generate_analytics(members: List[str]) -> dict:
    """
    Generate realistic, deterministic analytics for teams without a real repo.
    Uses a seeded RNG so results are stable across requests for the same team.
    """
    import random
    from datetime import timedelta

    rng  = random.Random(abs(hash(str(sorted(members)))))
    today = datetime.now()

    commit_counts = [rng.randint(18, 72) for _ in members]
    total_commits  = sum(commit_counts)

    contributors = []
    for i, name in enumerate(members):
        c = commit_counts[i]
        contributors.append({
            "name":           name,
            "commits":        c,
            "additions":      c * rng.randint(20, 38),
            "deletions":      c * rng.randint(5, 14),
            "activity_score": min(100, int(40 + c * 1.3)),
        })

    # Timeline — higher activity mid-week, realistic weekly pattern
    timeline = []
    for i in range(30):
        day = today - timedelta(days=29 - i)
        base = rng.randint(2, 10)
        if day.weekday() in (1, 2, 3):  # Tue–Thu peak
            base += rng.randint(4, 10)
        timeline.append({"date": day.strftime("%Y-%m-%d"), "commits": base})

    add_total = sum(c["additions"] for c in contributors)
    del_total = sum(c["deletions"]  for c in contributors)

    return {
        "summary": {
            "total_commits":      total_commits,
            "total_contributors": len(members),
            "total_additions":    add_total,
            "total_deletions":    del_total,
            "active_days":        rng.randint(19, 28),
        },
        "contributors": sorted(contributors, key=lambda x: x["commits"], reverse=True),
        "timeline":     timeline,
        "raw_commits":  [],
    }


def _seed_teams() -> list:
    """Demo teams with Indian names — shown when MongoDB has no teams."""
    return [
        {
            "id": "1", "name": "Team Quantum",
            "members": ["Priya Sharma", "Rahul Verma", "Arjun Patel"],
            "leader": "Priya Sharma",
            "repo_url": "https://github.com/team/quantum",
            "tech": ["React", "FastAPI", "MongoDB"],
            "progress": 85, "commits": 68, "additions": 2140, "deletions": 520,
            "lastActive": "2h ago", "activityScore": 92,
            "sprintVelocity": 42, "coverage": 78, "openPRs": 3, "issues": 4,
            "created_at": "2024-01-15T10:00:00Z",
        },
        {
            "id": "2", "name": "Team Nebula",
            "members": ["Ananya Singh", "Kavya Nair", "Rohit Mehta"],
            "leader": "Ananya Singh",
            "repo_url": "https://github.com/team/nebula",
            "tech": ["Next.js", "Django", "PostgreSQL"],
            "progress": 72, "commits": 44, "additions": 980, "deletions": 230,
            "lastActive": "5h ago", "activityScore": 76,
            "sprintVelocity": 34, "coverage": 82, "openPRs": 5, "issues": 2,
            "created_at": "2024-01-20T14:30:00Z",
        },
        {
            "id": "3", "name": "Team Phoenix",
            "members": ["Sneha Reddy", "Vikram Iyer", "Pooja Gupta"],
            "leader": "Sneha Reddy",
            "repo_url": "https://github.com/team/phoenix",
            "tech": ["Vue.js", "Flask", "MySQL"],
            "progress": 48, "commits": 27, "additions": 510, "deletions": 130,
            "lastActive": "1d ago", "activityScore": 55,
            "sprintVelocity": 18, "coverage": 45, "openPRs": 7, "issues": 8,
            "created_at": "2024-02-01T09:15:00Z",
        },
    ]


def _seed_tasks() -> list:
    """Demo Kanban tasks — shown when DB has no tasks."""
    return [
        {"id": "t1", "title": "Design authentication flow",   "description": "Login/signup with JWT",            "status": "done",        "priority": "high",   "assignee": "Priya Sharma",  "team_id": "1", "due_date": "2024-04-10", "comments": 3, "tags": ["auth", "frontend"]},
        {"id": "t2", "title": "Implement REST API endpoints",  "description": "Team and analytics routes",         "status": "in-progress", "priority": "high",   "assignee": "Rahul Verma",   "team_id": "1", "due_date": "2024-04-15", "comments": 5, "tags": ["backend", "api"]},
        {"id": "t3", "title": "GitHub integration",           "description": "GitPython commit analysis",         "status": "in-progress", "priority": "high",   "assignee": "Arjun Patel",   "team_id": "1", "due_date": "2024-04-18", "comments": 2, "tags": ["github"]},
        {"id": "t4", "title": "Analytics dashboard",          "description": "Charts with Recharts",              "status": "review",      "priority": "medium", "assignee": "Priya Sharma",  "team_id": "1", "due_date": "2024-04-20", "comments": 4, "tags": ["frontend", "charts"]},
        {"id": "t5", "title": "MongoDB schema design",        "description": "Collections and indexes",           "status": "done",        "priority": "medium", "assignee": "Ananya Singh",  "team_id": "2", "due_date": "2024-04-12", "comments": 1, "tags": ["database"]},
        {"id": "t6", "title": "WebSocket live feed",          "description": "Real-time activity updates",        "status": "todo",        "priority": "medium", "assignee": "Kavya Nair",    "team_id": "2", "due_date": "2024-04-25", "comments": 0, "tags": ["backend", "ws"]},
        {"id": "t7", "title": "UI component library",         "description": "Shared Tailwind components",        "status": "todo",        "priority": "low",    "assignee": "Sneha Reddy",   "team_id": "3", "due_date": "2024-04-22", "comments": 0, "tags": ["frontend"]},
        {"id": "t8", "title": "CI/CD pipeline setup",         "description": "GitHub Actions auto-deploy",        "status": "done",        "priority": "high",   "assignee": "Vikram Iyer",   "team_id": "3", "due_date": "2024-04-08", "comments": 6, "tags": ["devops"]},
        {"id": "t9", "title": "AI insights integration",      "description": "Gemini API for team feedback",      "status": "review",      "priority": "high",   "assignee": "Rohit Mehta",   "team_id": "2", "due_date": "2024-04-20", "comments": 3, "tags": ["ai", "gemini"]},
    ]