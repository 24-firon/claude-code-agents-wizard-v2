"""
Ground-Zero Ollama Client
Handles LLM reasoning via Ollama for complex tasks.
"""

import ollama
import asyncio
from typing import Dict, Any, Optional, List
import structlog

logger = structlog.get_logger()


class OllamaClient:
    """
    Async wrapper for Ollama Python SDK.

    Features:
    - Streaming support for long responses
    - Context management for multi-turn conversations
    - Temperature/sampling controls
    - Timeout handling
    """

    def __init__(
        self,
        host: str = "http://localhost:11434",
        default_model: str = "llama2"
    ):
        self.host = host
        self.default_model = default_model
        self.client = ollama.Client(host=host)
        self.logger = logger.bind(component="ollama_client")

    async def generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        context: Optional[List[int]] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        timeout: int = 120
    ) -> Dict[str, Any]:
        """
        Generate LLM response for a prompt.

        Args:
            prompt: Input prompt for the model
            model: Model name (default: llama2)
            context: Context tokens from previous turn (for multi-turn)
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum tokens to generate
            timeout: Timeout in seconds

        Returns:
            Dict with {response, context, done, duration_ms}
        """
        model = model or self.default_model

        self.logger.info(
            "llm_generate_start",
            model=model,
            prompt_length=len(prompt),
            temperature=temperature
        )

        try:
            # Run sync ollama.generate in thread pool
            loop = asyncio.get_event_loop()
            result = await asyncio.wait_for(
                loop.run_in_executor(
                    None,
                    lambda: self.client.generate(
                        model=model,
                        prompt=prompt,
                        context=context,
                        options={
                            "temperature": temperature,
                            "num_predict": max_tokens
                        }
                    )
                ),
                timeout=timeout
            )

            response_text = result["response"]
            new_context = result.get("context", [])

            self.logger.info(
                "llm_generate_success",
                model=model,
                response_length=len(response_text),
                duration_ms=result.get("total_duration", 0) / 1_000_000
            )

            return {
                "response": response_text,
                "context": new_context,
                "done": result.get("done", True),
                "duration_ms": result.get("total_duration", 0) / 1_000_000
            }

        except asyncio.TimeoutError:
            self.logger.error(
                "llm_generate_timeout",
                model=model,
                timeout=timeout
            )
            raise

        except Exception as e:
            self.logger.error(
                "llm_generate_error",
                model=model,
                error=str(e)
            )
            raise

    async def generate_streaming(
        self,
        prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.7
    ):
        """
        Generate LLM response with streaming (async generator).

        Args:
            prompt: Input prompt
            model: Model name
            temperature: Sampling temperature

        Yields:
            Dict chunks with {response, done}
        """
        model = model or self.default_model

        self.logger.info(
            "llm_streaming_start",
            model=model
        )

        try:
            # Ollama streaming is sync, so run in thread pool
            loop = asyncio.get_event_loop()

            def _stream():
                return self.client.generate(
                    model=model,
                    prompt=prompt,
                    stream=True,
                    options={"temperature": temperature}
                )

            stream = await loop.run_in_executor(None, _stream)

            for chunk in stream:
                yield {
                    "response": chunk["response"],
                    "done": chunk.get("done", False)
                }

        except Exception as e:
            self.logger.error(
                "llm_streaming_error",
                model=model,
                error=str(e)
            )
            raise

    async def chat(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Multi-turn chat conversation.

        Args:
            messages: List of {role, content} dicts
                      role: "system", "user", or "assistant"
            model: Model name
            temperature: Sampling temperature

        Returns:
            Dict with {message, done}
        """
        model = model or self.default_model

        self.logger.info(
            "llm_chat_start",
            model=model,
            message_count=len(messages)
        )

        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                lambda: self.client.chat(
                    model=model,
                    messages=messages,
                    options={"temperature": temperature}
                )
            )

            response_message = result["message"]

            self.logger.info(
                "llm_chat_success",
                model=model,
                response_role=response_message["role"]
            )

            return {
                "message": response_message,
                "done": result.get("done", True)
            }

        except Exception as e:
            self.logger.error(
                "llm_chat_error",
                model=model,
                error=str(e)
            )
            raise

    async def list_models(self) -> List[str]:
        """
        List available models on Ollama server.

        Returns:
            List of model names
        """
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self.client.list
            )

            models = [model["name"] for model in result["models"]]

            self.logger.info(
                "models_listed",
                count=len(models)
            )

            return models

        except Exception as e:
            self.logger.error(
                "models_list_error",
                error=str(e)
            )
            raise

    async def pull_model(self, model: str):
        """
        Pull/download a model from Ollama library.

        Args:
            model: Model name to pull (e.g., "llama2", "codellama")
        """
        self.logger.info(
            "model_pull_start",
            model=model
        )

        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.client.pull(model)
            )

            self.logger.info(
                "model_pull_success",
                model=model
            )

        except Exception as e:
            self.logger.error(
                "model_pull_error",
                model=model,
                error=str(e)
            )
            raise

    async def health_check(self) -> bool:
        """
        Check if Ollama server is reachable.

        Returns:
            True if healthy, False otherwise
        """
        try:
            models = await self.list_models()
            return len(models) >= 0  # Even 0 models means server is up

        except Exception:
            return False
