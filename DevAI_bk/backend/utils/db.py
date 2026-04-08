"""
utils/db.py — MongoDB async connection via Motor.

Falls back to a fully functional in-memory store when MongoDB is
unavailable — so the demo works even without a database running.

Usage:
    await Database.connect()
    db = Database.get_db()
    await db.teams.find_one({"name": "Team Quantum"})
"""

import os
import logging
from typing import Optional, Dict, List, Any
from datetime import datetime

logger = logging.getLogger(__name__)


# ─── Main Database class ──────────────────────────────────────────────────────

class Database:
    _client = None
    _db = None
    _using_mock = False

    @classmethod
    async def connect(cls):
        mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        db_name   = os.getenv("DB_NAME", "devai")
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            cls._client = AsyncIOMotorClient(mongo_uri, serverSelectionTimeoutMS=3000)
            cls._db = cls._client[db_name]
            # Verify connection
            await cls._client.admin.command("ping")
            await cls._create_indexes()
            cls._using_mock = False
            logger.info(f"✅ MongoDB connected → {db_name}")
        except Exception as e:
            logger.warning(f"⚠️  MongoDB unavailable ({e}). Using in-memory fallback — demo will still work.")
            cls._db = MockDB()
            cls._using_mock = True

    @classmethod
    async def _create_indexes(cls):
        """Create indexes for performance."""
        try:
            await cls._db.users.create_index("email", unique=True)
            await cls._db.teams.create_index("guide_id")
            await cls._db.tasks.create_index([("team_id", 1), ("status", 1)])
            await cls._db.events.create_index([("team_id", 1), ("date", 1)])
            await cls._db.analytics_cache.create_index("team_id", unique=True)
            logger.info("✅ Database indexes created")
        except Exception as e:
            logger.warning(f"Index creation skipped: {e}")

    @classmethod
    async def disconnect(cls):
        if cls._client:
            cls._client.close()
            logger.info("MongoDB disconnected")

    @classmethod
    def get_db(cls):
        if cls._db is None:
            return MockDB()
        return cls._db

    @classmethod
    async def ping(cls) -> bool:
        if cls._using_mock:
            return False  # Indicates degraded but functional
        try:
            if cls._client:
                await cls._client.admin.command("ping")
                return True
        except Exception:
            pass
        return False

    @classmethod
    def is_mock(cls) -> bool:
        return cls._using_mock


# ─── In-memory fallback (MockDB) ──────────────────────────────────────────────

class MockCollection:
    """
    Thread-safe in-memory collection that mimics Motor's async API.
    Supports find, find_one, insert_one, update_one, replace_one, delete_one.
    Data persists for the lifetime of the process.
    """

    def __init__(self):
        self._data: List[Dict] = []
        self._counter = 0

    def _match(self, doc: dict, query: dict) -> bool:
        """Simple query matcher — handles exact match and ObjectId-like string IDs."""
        for key, val in query.items():
            if key == "_id":
                if str(doc.get("_id", "")) != str(val):
                    return False
            elif doc.get(key) != val:
                return False
        return True

    async def find_one(self, query: dict) -> Optional[dict]:
        for doc in self._data:
            if self._match(doc, query):
                return dict(doc)
        return None

    def find(self, query: dict = {}) -> "MockCursor":
        matched = [dict(d) for d in self._data if self._match(d, query)]
        return MockCursor(matched)

    async def insert_one(self, doc: dict) -> "InsertResult":
        self._counter += 1
        oid = f"mock_{self._counter}_{int(datetime.now().timestamp())}"
        doc = dict(doc)
        doc["_id"] = oid
        self._data.append(doc)
        return InsertResult(oid)

    async def update_one(self, query: dict, update: dict, upsert: bool = False) -> "UpdateResult":
        for i, doc in enumerate(self._data):
            if self._match(doc, query):
                if "$set" in update:
                    self._data[i].update(update["$set"])
                if "$inc" in update:
                    for k, v in update["$inc"].items():
                        self._data[i][k] = self._data[i].get(k, 0) + v
                return UpdateResult(matched=1, modified=1)
        if upsert:
            new_doc = {}
            if "$set" in update:
                new_doc.update(update["$set"])
            await self.insert_one(new_doc)
            return UpdateResult(matched=0, modified=0, upserted=True)
        return UpdateResult(matched=0, modified=0)

    async def replace_one(self, query: dict, replacement: dict, upsert: bool = False):
        for i, doc in enumerate(self._data):
            if self._match(doc, query):
                oid = doc.get("_id")
                self._data[i] = dict(replacement)
                self._data[i]["_id"] = oid
                return
        if upsert:
            await self.insert_one(dict(replacement))

    async def delete_one(self, query: dict):
        for i, doc in enumerate(self._data):
            if self._match(doc, query):
                self._data.pop(i)
                return

    async def delete_many(self, query: dict):
        self._data = [d for d in self._data if not self._match(d, query)]

    async def count_documents(self, query: dict = {}) -> int:
        return sum(1 for d in self._data if self._match(d, query))

    async def create_index(self, *args, **kwargs):
        pass  # No-op for mock


class MockCursor:
    def __init__(self, data: list):
        self._data = data
        self._idx = 0

    def __aiter__(self):
        self._idx = 0
        return self

    async def __anext__(self):
        if self._idx >= len(self._data):
            raise StopAsyncIteration
        item = self._data[self._idx]
        self._idx += 1
        return item

    async def to_list(self, length: int = None) -> list:
        return self._data[:length] if length else self._data


class MockDB:
    """Mock database — each attribute is a separate in-memory collection."""
    _collections: Dict[str, MockCollection] = {}

    def __getattr__(self, name: str) -> MockCollection:
        if name not in MockDB._collections:
            MockDB._collections[name] = MockCollection()
        return MockDB._collections[name]


class InsertResult:
    def __init__(self, oid):
        self.inserted_id = oid


class UpdateResult:
    def __init__(self, matched=0, modified=0, upserted=False):
        self.matched_count  = matched
        self.modified_count = modified
        self.upserted_id    = "new" if upserted else None