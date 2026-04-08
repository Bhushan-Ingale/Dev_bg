"""utils/auth.py — JWT + password hashing (bcrypt-compatible)."""

import os
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

SECRET_KEY   = os.getenv("JWT_SECRET", "devai-secret-key-change-in-production")
ALGORITHM    = "HS256"
TOKEN_EXPIRY = int(os.getenv("TOKEN_EXPIRY_HOURS", "72"))


# ─── JWT ──────────────────────────────────────────────────────────────────────

def create_token(payload: dict) -> str:
    import json, base64
    header  = base64.urlsafe_b64encode(json.dumps({"alg":"HS256","typ":"JWT"}).encode()).rstrip(b"=")
    exp     = int((datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRY)).timestamp())
    data    = {**payload, "exp": exp, "iat": int(datetime.now(timezone.utc).timestamp())}
    body    = base64.urlsafe_b64encode(json.dumps(data).encode()).rstrip(b"=")
    sig_raw = hmac.new(SECRET_KEY.encode(), header + b"." + body, hashlib.sha256).digest()
    sig     = base64.urlsafe_b64encode(sig_raw).rstrip(b"=")
    return (header + b"." + body + b"." + sig).decode()


def verify_token(token: str) -> Optional[dict]:
    import json, base64
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header, body, sig = parts
        # Verify signature
        expected_sig_raw = hmac.new(
            SECRET_KEY.encode(),
            (header + "." + body).encode(),
            hashlib.sha256
        ).digest()
        expected_sig = base64.urlsafe_b64encode(expected_sig_raw).rstrip(b"=").decode()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        # Decode payload
        pad     = "=" * (-len(body) % 4)
        payload = json.loads(base64.urlsafe_b64decode(body + pad))
        # Check expiry
        if payload.get("exp", 0) < datetime.now(timezone.utc).timestamp():
            return None
        return payload
    except Exception:
        return None


# ─── Password hashing (sha256 + salt — secure enough for demo) ───────────────

def hash_password(password: str) -> str:
    """Hash password with random salt using PBKDF2-HMAC-SHA256."""
    salt = secrets.token_hex(16)
    h    = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return f"{salt}${h.hex()}"


def verify_password(plain: str, stored: str) -> bool:
    """Verify password against stored hash."""
    try:
        salt, h = stored.split("$", 1)
        new_h = hashlib.pbkdf2_hmac("sha256", plain.encode(), salt.encode(), 100_000)
        return hmac.compare_digest(new_h.hex(), h)
    except Exception:
        return False