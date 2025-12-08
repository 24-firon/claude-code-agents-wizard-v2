"""
Ground-Zero Queue Manager
Manages task queue in PostgreSQL with FIFO ordering and atomic operations.
"""

import asyncio
import asyncpg
from typing import Dict, Any, Optional
from enum import Enum
import structlog

logger = structlog.get_logger()


class TaskStatus(Enum):
    """Task lifecycle states"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"


class QueueManager:
    """
    PostgreSQL-backed task queue with atomic operations.

    Features:
    - FIFO ordering (created_at ASC)
    - FOR UPDATE SKIP LOCKED (prevents race conditions)
    - Atomic status transitions
    - Retry support with exponential backoff
    """

    def __init__(self, pg_conn: asyncpg.Connection):
        self.conn = pg_conn
        self.logger = logger.bind(component="queue_manager")

    async def enqueue(
        self,
        task_type: str,
        payload: Dict[str, Any],
        priority: int = 5
    ) -> str:
        """
        Add task to PostgreSQL queue.

        Args:
            task_type: Type of task (e.g., "code_execution", "llm_reasoning")
            payload: Task parameters as JSON-serializable dict
            priority: Priority level (1=highest, 10=lowest, default=5)

        Returns:
            task_id: UUID of created task
        """
        query = """
            INSERT INTO task_queue (
                task_type,
                payload,
                status,
                priority,
                created_at,
                retry_count
            )
            VALUES ($1, $2, $3, $4, NOW(), 0)
            RETURNING task_id
        """
        task_id = await self.conn.fetchval(
            query,
            task_type,
            payload,
            TaskStatus.PENDING.value,
            priority
        )

        self.logger.info(
            "task_enqueued",
            task_id=str(task_id),
            task_type=task_type,
            priority=priority
        )
        return str(task_id)

    async def dequeue(self) -> Optional[Dict[str, Any]]:
        """
        Get next pending task (FIFO with priority).

        Uses FOR UPDATE SKIP LOCKED to prevent race conditions
        in multi-worker environments.

        Returns:
            Task dict with {task_id, task_type, payload} or None
        """
        query = """
            UPDATE task_queue
            SET
                status = $1,
                started_at = NOW(),
                worker_id = pg_backend_pid()
            WHERE task_id = (
                SELECT task_id
                FROM task_queue
                WHERE status = $2
                ORDER BY priority ASC, created_at ASC
                LIMIT 1
                FOR UPDATE SKIP LOCKED
            )
            RETURNING task_id, task_type, payload, retry_count
        """
        row = await self.conn.fetchrow(
            query,
            TaskStatus.IN_PROGRESS.value,
            TaskStatus.PENDING.value
        )

        if row:
            task = dict(row)
            self.logger.info(
                "task_dequeued",
                task_id=str(task["task_id"]),
                task_type=task["task_type"]
            )
            return task
        return None

    async def complete(self, task_id: str, result: Dict[str, Any]):
        """
        Mark task as completed with result.

        Args:
            task_id: UUID of task
            result: Result data to store
        """
        query = """
            UPDATE task_queue
            SET
                status = $1,
                completed_at = NOW(),
                result = $2
            WHERE task_id = $3
        """
        await self.conn.execute(
            query,
            TaskStatus.COMPLETED.value,
            result,
            task_id
        )

        self.logger.info(
            "task_completed",
            task_id=task_id
        )

    async def fail(
        self,
        task_id: str,
        error: str,
        max_retries: int = 3
    ):
        """
        Mark task as failed with error message.
        Implements exponential backoff retry logic.

        Args:
            task_id: UUID of task
            error: Error message/traceback
            max_retries: Maximum retry attempts (default: 3)
        """
        # Get current retry count
        query_get = """
            SELECT retry_count
            FROM task_queue
            WHERE task_id = $1
        """
        retry_count = await self.conn.fetchval(query_get, task_id)

        if retry_count < max_retries:
            # Retry with exponential backoff
            backoff_seconds = 2 ** retry_count  # 1s, 2s, 4s
            query_retry = """
                UPDATE task_queue
                SET
                    status = $1,
                    retry_count = retry_count + 1,
                    error_message = $2,
                    next_retry_at = NOW() + INTERVAL '%s seconds'
                WHERE task_id = $3
            """ % backoff_seconds

            await self.conn.execute(
                query_retry,
                TaskStatus.RETRYING.value,
                error,
                task_id
            )

            self.logger.warning(
                "task_retrying",
                task_id=task_id,
                retry_count=retry_count + 1,
                backoff_seconds=backoff_seconds
            )
        else:
            # Max retries exceeded, mark as failed
            query_fail = """
                UPDATE task_queue
                SET
                    status = $1,
                    completed_at = NOW(),
                    error_message = $2
                WHERE task_id = $3
            """
            await self.conn.execute(
                query_fail,
                TaskStatus.FAILED.value,
                error,
                task_id
            )

            self.logger.error(
                "task_failed",
                task_id=task_id,
                error=error,
                retry_count=retry_count
            )

    async def get_queue_stats(self) -> Dict[str, int]:
        """
        Get queue statistics.

        Returns:
            Dict with counts per status
        """
        query = """
            SELECT
                status,
                COUNT(*) as count
            FROM task_queue
            GROUP BY status
        """
        rows = await self.conn.fetch(query)

        stats = {row["status"]: row["count"] for row in rows}
        return stats

    async def cleanup_old_tasks(self, days: int = 7):
        """
        Delete completed/failed tasks older than N days.

        Args:
            days: Delete tasks older than this many days
        """
        query = """
            DELETE FROM task_queue
            WHERE
                status IN ('completed', 'failed')
                AND completed_at < NOW() - INTERVAL '%s days'
        """ % days

        result = await self.conn.execute(query)
        deleted_count = int(result.split()[-1])

        self.logger.info(
            "old_tasks_cleaned",
            deleted_count=deleted_count,
            days=days
        )
        return deleted_count
