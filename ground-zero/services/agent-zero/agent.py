"""
Ground-Zero Agent Zero - Main Task Processor
Orchestrates task execution with LLM reasoning and checkpoint-based recovery.
"""

import asyncio
import asyncpg
import redis.asyncio as redis
from typing import Dict, Any, Optional
import structlog
import os
from dotenv import load_dotenv

from queue_manager import QueueManager, TaskStatus
from state_manager import UnifiedStateManager
from ollama_client import OllamaClient

load_dotenv()
logger = structlog.get_logger()


class AgentZero:
    """
    Main task processor for Ground-Zero system.

    Workflow:
    1. Dequeue task from PostgreSQL queue
    2. Save initial checkpoint
    3. Determine if LLM reasoning needed
    4. Process task (with or without LLM)
    5. Save intermediate checkpoints
    6. Save final checkpoint
    7. Mark task as complete/failed

    Features:
    - Checkpoint-based recovery
    - LLM integration for complex reasoning
    - Distributed locking for critical sections
    - Retry logic with exponential backoff
    """

    def __init__(
        self,
        pg_conn: asyncpg.Connection,
        redis_conn: redis.Redis,
        ollama_host: str = "http://localhost:11434"
    ):
        self.queue_mgr = QueueManager(pg_conn)
        self.state_mgr = UnifiedStateManager(pg_conn, redis_conn)
        self.ollama = OllamaClient(host=ollama_host)
        self.logger = logger.bind(component="agent_zero")
        self.running = False

    async def start(self, poll_interval: int = 5):
        """
        Start the agent's main processing loop.

        Args:
            poll_interval: Seconds between queue polls (default: 5)
        """
        self.running = True
        self.logger.info(
            "agent_started",
            poll_interval=poll_interval
        )

        while self.running:
            try:
                # Dequeue next task
                task = await self.queue_mgr.dequeue()

                if task:
                    await self.process_task(task)
                else:
                    # No tasks available, wait before polling again
                    await asyncio.sleep(poll_interval)

            except Exception as e:
                self.logger.error(
                    "main_loop_error",
                    error=str(e),
                    exc_info=True
                )
                await asyncio.sleep(poll_interval)

    async def stop(self):
        """Stop the agent gracefully."""
        self.running = False
        self.logger.info("agent_stopped")

    async def process_task(self, task: Dict[str, Any]):
        """
        Process a single task with checkpoint-based recovery.

        Args:
            task: Task dict with {task_id, task_type, payload, retry_count}
        """
        task_id = str(task["task_id"])
        task_type = task["task_type"]
        payload = task["payload"]

        self.logger.info(
            "task_processing_start",
            task_id=task_id,
            task_type=task_type
        )

        try:
            # Step 1: Save initial checkpoint
            await self.state_mgr.save_checkpoint(
                task_id,
                "initial",
                {
                    "task": task,
                    "timestamp": "now",
                    "status": "started"
                }
            )

            # Step 2: Acquire lock if needed (for critical tasks)
            if payload.get("requires_lock"):
                resource_id = payload["resource_id"]
                acquired = await self.state_mgr.acquire_lock(resource_id)

                if not acquired:
                    # Another worker is processing this resource
                    await self.queue_mgr.fail(
                        task_id,
                        f"Resource locked: {resource_id}"
                    )
                    return

            # Step 3: Route task to appropriate handler
            result = await self._route_task(task_id, task_type, payload)

            # Step 4: Save final checkpoint
            await self.state_mgr.save_checkpoint(
                task_id,
                "final",
                {
                    "result": result,
                    "status": "completed"
                }
            )

            # Step 5: Mark as complete
            await self.queue_mgr.complete(task_id, result)

            self.logger.info(
                "task_processing_success",
                task_id=task_id,
                task_type=task_type
            )

        except Exception as e:
            self.logger.error(
                "task_processing_error",
                task_id=task_id,
                error=str(e),
                exc_info=True
            )

            # Save error checkpoint
            await self.state_mgr.save_checkpoint(
                task_id,
                "error",
                {
                    "error": str(e),
                    "status": "failed"
                }
            )

            # Mark as failed (will retry if retries < max)
            await self.queue_mgr.fail(task_id, str(e))

        finally:
            # Release lock if acquired
            if payload.get("requires_lock"):
                resource_id = payload["resource_id"]
                await self.state_mgr.release_lock(resource_id)

    async def _route_task(
        self,
        task_id: str,
        task_type: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Route task to appropriate handler based on type.

        Args:
            task_id: UUID of task
            task_type: Type of task
            payload: Task parameters

        Returns:
            Result dict
        """
        handlers = {
            "llm_reasoning": self._handle_llm_reasoning,
            "code_execution": self._handle_code_execution,
            "simple_computation": self._handle_simple_computation,
            "external_api_call": self._handle_external_api
        }

        handler = handlers.get(task_type)

        if not handler:
            raise ValueError(f"Unknown task type: {task_type}")

        # Call handler
        result = await handler(task_id, payload)
        return result

    async def _handle_llm_reasoning(
        self,
        task_id: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Handle tasks requiring LLM reasoning.

        Args:
            task_id: Task UUID
            payload: {prompt, model?, temperature?}

        Returns:
            {llm_response, model, duration_ms}
        """
        prompt = payload["prompt"]
        model = payload.get("model", "llama2")
        temperature = payload.get("temperature", 0.7)

        # Save pre-LLM checkpoint
        await self.state_mgr.save_checkpoint(
            task_id,
            "pre_llm",
            {"prompt": prompt, "model": model}
        )

        # Generate LLM response
        result = await self.ollama.generate(
            prompt=prompt,
            model=model,
            temperature=temperature
        )

        # Save post-LLM checkpoint
        await self.state_mgr.save_checkpoint(
            task_id,
            "post_llm",
            {"response": result["response"]}
        )

        return {
            "llm_response": result["response"],
            "model": model,
            "duration_ms": result["duration_ms"]
        }

    async def _handle_code_execution(
        self,
        task_id: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Handle code execution tasks (placeholder - integrate with E2B).

        Args:
            task_id: Task UUID
            payload: {code, language, timeout?}

        Returns:
            {stdout, stderr, exit_code}
        """
        # TODO: Integrate with E2B sandbox
        code = payload["code"]
        language = payload["language"]

        self.logger.info(
            "code_execution_placeholder",
            task_id=task_id,
            language=language
        )

        # Placeholder: Return mock result
        return {
            "stdout": "Code execution not yet implemented",
            "stderr": "",
            "exit_code": 0
        }

    async def _handle_simple_computation(
        self,
        task_id: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Handle simple computations without LLM.

        Args:
            task_id: Task UUID
            payload: {operation, args}

        Returns:
            {result}
        """
        operation = payload["operation"]
        args = payload.get("args", [])

        if operation == "add":
            result = sum(args)
        elif operation == "multiply":
            result = 1
            for arg in args:
                result *= arg
        else:
            raise ValueError(f"Unknown operation: {operation}")

        return {"result": result}

    async def _handle_external_api(
        self,
        task_id: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Handle external API calls (placeholder).

        Args:
            task_id: Task UUID
            payload: {url, method, headers?, body?}

        Returns:
            {status_code, response}
        """
        # TODO: Implement with httpx
        url = payload["url"]
        method = payload.get("method", "GET")

        self.logger.info(
            "external_api_placeholder",
            task_id=task_id,
            url=url,
            method=method
        )

        return {
            "status_code": 200,
            "response": "External API not yet implemented"
        }


async def main():
    """
    Main entry point for Agent Zero service.
    """
    # Configure structured logging
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.add_log_level,
            structlog.processors.JSONRenderer()
        ]
    )

    # Load config from environment
    pg_host = os.getenv("POSTGRES_HOST", "localhost")
    pg_port = int(os.getenv("POSTGRES_PORT", "5432"))
    pg_user = os.getenv("POSTGRES_USER", "groundzero")
    pg_password = os.getenv("POSTGRES_PASSWORD", "")
    pg_database = os.getenv("POSTGRES_DB", "groundzero")

    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = int(os.getenv("REDIS_PORT", "6379"))
    redis_password = os.getenv("REDIS_PASSWORD", "")

    ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")

    # Connect to PostgreSQL
    pg_conn = await asyncpg.connect(
        host=pg_host,
        port=pg_port,
        user=pg_user,
        password=pg_password,
        database=pg_database
    )
    logger.info("postgres_connected", host=pg_host, database=pg_database)

    # Connect to Redis
    redis_conn = redis.Redis(
        host=redis_host,
        port=redis_port,
        password=redis_password,
        decode_responses=True
    )
    await redis_conn.ping()
    logger.info("redis_connected", host=redis_host)

    # Create Agent Zero instance
    agent = AgentZero(
        pg_conn=pg_conn,
        redis_conn=redis_conn,
        ollama_host=ollama_host
    )

    # Start processing
    try:
        await agent.start(poll_interval=5)
    except KeyboardInterrupt:
        logger.info("shutdown_signal_received")
        await agent.stop()
    finally:
        await pg_conn.close()
        await redis_conn.close()
        logger.info("connections_closed")


if __name__ == "__main__":
    asyncio.run(main())
