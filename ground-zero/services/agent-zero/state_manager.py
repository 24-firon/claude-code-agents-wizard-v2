"""
Ground-Zero State Manager
Manages task state with PostgreSQL as source of truth and Redis as cache layer.
"""

import asyncpg
import redis.asyncio as redis
import json
from typing import Dict, Any, Optional
from datetime import datetime
import structlog

logger = structlog.get_logger()


class UnifiedStateManager:
    """
    Two-tier state management:
    - PostgreSQL: Source of Truth (ACID, persistent)
    - Redis: Cache Layer (fast reads, 1h TTL)

    Write Strategy: Write-through cache
    Read Strategy: Cache-aside pattern
    Conflict Resolution: Last-Write-Wins with version numbers
    """

    def __init__(
        self,
        pg_conn: asyncpg.Connection,
        redis_conn: redis.Redis
    ):
        self.pg = pg_conn
        self.redis = redis_conn
        self.CACHE_TTL = 3600  # 1 hour
        self.logger = logger.bind(component="state_manager")

    async def save_state(
        self,
        task_id: str,
        state_type: str,
        data: Dict[str, Any],
        use_cache: bool = True
    ) -> str:
        """
        Save state to PostgreSQL (source of truth) + Cache in Redis.

        Args:
            task_id: UUID of task
            state_type: Type of state (e.g., "checkpoint", "intermediate", "final")
            data: State data as JSON-serializable dict
            use_cache: Whether to update Redis cache (default: True)

        Returns:
            state_id: UUID of saved state
        """
        # 1. Save to PostgreSQL (ACID)
        query = """
            INSERT INTO unified_state (
                task_id,
                state_type,
                data,
                created_at,
                source,
                version
            )
            VALUES ($1, $2, $3, NOW(), 'postgres', 1)
            ON CONFLICT (task_id, state_type)
            DO UPDATE SET
                data = EXCLUDED.data,
                created_at = NOW(),
                version = unified_state.version + 1
            RETURNING state_id, version
        """
        row = await self.pg.fetchrow(
            query,
            task_id,
            state_type,
            json.dumps(data)
        )

        state_id = str(row["state_id"])
        version = row["version"]

        # 2. Update Redis cache (write-through)
        if use_cache:
            cache_key = f"state:{task_id}:{state_type}"
            cache_data = {
                "state_id": state_id,
                "data": data,
                "timestamp": datetime.utcnow().isoformat(),
                "version": version,
                "source": "redis"
            }
            await self.redis.setex(
                cache_key,
                self.CACHE_TTL,
                json.dumps(cache_data)
            )

        self.logger.info(
            "state_saved",
            task_id=task_id,
            state_type=state_type,
            state_id=state_id,
            version=version,
            cached=use_cache
        )
        return state_id

    async def get_state(
        self,
        task_id: str,
        state_type: str,
        use_cache: bool = True
    ) -> Optional[Dict[str, Any]]:
        """
        Get state with cache-aside pattern.

        Flow:
        1. Try Redis cache first (fast)
        2. If cache miss, query PostgreSQL
        3. Populate cache for future reads

        Args:
            task_id: UUID of task
            state_type: Type of state
            use_cache: Whether to use Redis cache (default: True)

        Returns:
            State data dict or None if not found
        """
        cache_key = f"state:{task_id}:{state_type}"

        # 1. Try cache first
        if use_cache:
            cached = await self.redis.get(cache_key)
            if cached:
                cache_data = json.loads(cached)
                self.logger.debug(
                    "state_cache_hit",
                    task_id=task_id,
                    state_type=state_type
                )
                return cache_data["data"]

        # 2. Cache miss - query PostgreSQL
        query = """
            SELECT data, version, created_at
            FROM unified_state
            WHERE task_id = $1 AND state_type = $2
            ORDER BY version DESC
            LIMIT 1
        """
        row = await self.pg.fetchrow(query, task_id, state_type)

        if not row:
            return None

        data = json.loads(row["data"])

        # 3. Populate cache (cache-aside)
        if use_cache:
            cache_data = {
                "data": data,
                "version": row["version"],
                "timestamp": row["created_at"].isoformat(),
                "source": "postgres"
            }
            await self.redis.setex(
                cache_key,
                self.CACHE_TTL,
                json.dumps(cache_data)
            )

        self.logger.debug(
            "state_retrieved",
            task_id=task_id,
            state_type=state_type,
            source="postgres"
        )
        return data

    async def save_checkpoint(
        self,
        task_id: str,
        checkpoint_name: str,
        data: Dict[str, Any]
    ) -> str:
        """
        Save task checkpoint for recovery.

        Args:
            task_id: UUID of task
            checkpoint_name: Name of checkpoint (e.g., "initial", "step_1", "final")
            data: Checkpoint data

        Returns:
            state_id: UUID of saved checkpoint
        """
        return await self.save_state(
            task_id,
            f"checkpoint:{checkpoint_name}",
            data
        )

    async def get_checkpoint(
        self,
        task_id: str,
        checkpoint_name: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get task checkpoint.

        Args:
            task_id: UUID of task
            checkpoint_name: Name of checkpoint

        Returns:
            Checkpoint data or None
        """
        return await self.get_state(
            task_id,
            f"checkpoint:{checkpoint_name}"
        )

    async def acquire_lock(
        self,
        resource_id: str,
        timeout: int = 10
    ) -> bool:
        """
        Acquire distributed lock via Redis.

        Prevents race conditions in multi-worker environments.
        Uses Redis SETNX (SET if Not eXists) for atomicity.

        Args:
            resource_id: Unique resource identifier
            timeout: Lock timeout in seconds (auto-expires)

        Returns:
            True if lock acquired, False if already locked
        """
        lock_key = f"lock:{resource_id}"
        acquired = await self.redis.set(
            lock_key,
            "locked",
            nx=True,  # Only set if not exists
            ex=timeout  # Auto-expire after timeout
        )

        if acquired:
            self.logger.debug(
                "lock_acquired",
                resource_id=resource_id,
                timeout=timeout
            )
        else:
            self.logger.warning(
                "lock_failed",
                resource_id=resource_id
            )

        return acquired is not None

    async def release_lock(self, resource_id: str):
        """
        Release distributed lock.

        Args:
            resource_id: Unique resource identifier
        """
        lock_key = f"lock:{resource_id}"
        deleted = await self.redis.delete(lock_key)

        if deleted:
            self.logger.debug(
                "lock_released",
                resource_id=resource_id
            )

    async def invalidate_cache(self, task_id: str, state_type: str):
        """
        Invalidate Redis cache for specific state.

        Args:
            task_id: UUID of task
            state_type: Type of state
        """
        cache_key = f"state:{task_id}:{state_type}"
        deleted = await self.redis.delete(cache_key)

        if deleted:
            self.logger.debug(
                "cache_invalidated",
                task_id=task_id,
                state_type=state_type
            )

    async def get_state_history(
        self,
        task_id: str,
        state_type: str,
        limit: int = 10
    ) -> list[Dict[str, Any]]:
        """
        Get version history for a state (PostgreSQL only).

        Args:
            task_id: UUID of task
            state_type: Type of state
            limit: Max number of versions to return

        Returns:
            List of state versions (newest first)
        """
        query = """
            SELECT
                state_id,
                data,
                version,
                created_at
            FROM unified_state
            WHERE task_id = $1 AND state_type = $2
            ORDER BY version DESC
            LIMIT $3
        """
        rows = await self.pg.fetch(query, task_id, state_type, limit)

        history = [
            {
                "state_id": str(row["state_id"]),
                "data": json.loads(row["data"]),
                "version": row["version"],
                "created_at": row["created_at"].isoformat()
            }
            for row in rows
        ]

        return history
