cat > models/group.py << 'EOF'
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Member(BaseModel):
    name: str
    email: str
    github_username: Optional[str] = None

class Group(BaseModel):
    id: str
    name: str
    repo_url: str
    guide_id: str
    members: List[Member]
    created_at: datetime
    progress: int = 0
    last_analyzed: Optional[datetime] = None
EOF