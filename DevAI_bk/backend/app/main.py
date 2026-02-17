from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random
from typing import Optional

app = FastAPI(title="DevAI API", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database
teams_db = {
    "1": {
        "id": "1",
        "name": "Team Quantum",
        "members": ["Alice Chen", "Bob Smith", "Charlie Brown"],
        "leader": "Alice Chen",
        "repo_url": "https://github.com/team/quantum",
        "created_at": "2024-01-15T10:00:00Z"
    },
    "2": {
        "id": "2",
        "name": "Team Nebula",
        "members": ["Diana Prince", "Eve Torres", "Frank Castle"],
        "leader": "Diana Prince",
        "repo_url": "https://github.com/team/nebula",
        "created_at": "2024-01-20T14:30:00Z"
    },
    "3": {
        "id": "3",
        "name": "Team Phoenix",
        "members": ["Grace Hopper", "Henry Ford", "Ivy Chen"],
        "leader": "Grace Hopper",
        "repo_url": "https://github.com/team/phoenix",
        "created_at": "2024-02-01T09:15:00Z"
    }
}

tasks_db = []
calendar_events_db = []

@app.get("/")
async def root():
    return {"message": "DevAI API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Team endpoints
@app.get("/api/teams")
async def get_teams():
    """Get all teams"""
    return list(teams_db.values())

@app.get("/api/teams/{team_id}")
async def get_team(team_id: str):
    """Get specific team"""
    if team_id not in teams_db:
        raise HTTPException(status_code=404, detail="Team not found")
    return teams_db[team_id]

@app.post("/api/teams")
async def create_team(team: dict):
    """Create new team"""
    team_id = f"team_{len(teams_db) + 1}"
    team["id"] = team_id
    team["created_at"] = datetime.now().isoformat()
    teams_db[team_id] = team
    return {"id": team_id, "message": "Team created successfully"}

# Analytics endpoints
@app.get("/api/teams/{team_id}/analytics")
async def get_team_analytics(team_id: str):
    """Get team analytics with mock data"""
    if team_id not in teams_db:
        raise HTTPException(status_code=404, detail="Team not found")
    
    team = teams_db[team_id]
    
    # Generate mock analytics
    return {
        "summary": {
            "total_commits": random.randint(50, 200),
            "total_contributors": len(team["members"]),
            "total_additions": random.randint(500, 3000),
            "total_deletions": random.randint(100, 1000),
            "active_days": random.randint(15, 30)
        },
        "contributors": [
            {
                "name": member,
                "commits": random.randint(10, 80),
                "additions": random.randint(200, 1500),
                "deletions": random.randint(50, 500),
                "activity_score": random.randint(50, 100)
            }
            for member in team["members"]
        ],
        "timeline": [
            {
                "date": (datetime.now().replace(day=d)).isoformat().split('T')[0],
                "commits": random.randint(2, 20)
            }
            for d in range(1, 31)
        ]
    }

# Task endpoints (Kanban)
@app.get("/api/tasks")
async def get_tasks(team_id: Optional[str] = None):
    """Get all tasks, optionally filtered by team"""
    if team_id:
        return [task for task in tasks_db if task.get("team_id") == team_id]
    return tasks_db

@app.post("/api/tasks")
async def create_task(task: dict):
    """Create new task"""
    task["id"] = f"task_{len(tasks_db) + 1}"
    task["created_at"] = datetime.now().isoformat()
    tasks_db.append(task)
    return task

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: str, task_update: dict):
    """Update task status"""
    for task in tasks_db:
        if task.get("id") == task_id:
            task.update(task_update)
            return task
    raise HTTPException(status_code=404, detail="Task not found")

# Calendar endpoints
@app.get("/api/events")
async def get_events(team_id: Optional[str] = None):
    """Get calendar events"""
    if team_id:
        return [event for event in calendar_events_db if event.get("team_id") == team_id]
    return calendar_events_db

@app.post("/api/events")
async def create_event(event: dict):
    """Create calendar event"""
    event["id"] = f"event_{len(calendar_events_db) + 1}"
    calendar_events_db.append(event)
    return event

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)