cat > models/user.py << 'EOF'
from enum import Enum
from pydantic import BaseModel
from typing import Optional

class UserRole(str, Enum):
    DEVELOPER = "developer"
    GUIDE = "guide"

class User(BaseModel):
    id: str
    username: str
    email: str
    role: UserRole
    group_id: Optional[str] = None
EOF