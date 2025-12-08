#!/usr/bin/env node

/**
 * Ground-Zero MCP Server
 * Connects Claude Desktop (Windows) to DigitalOcean Droplet via HTTP
 *
 * Architecture:
 * Claude Desktop <--STDIO--> MCP Server <--HTTP/VPN--> DigitalOcean n8n
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Configuration
const DIGITALOCEAN_HOST = process.env.DIGITALOCEAN_HOST || "http://localhost";
const N8N_WEBHOOK_BASE = process.env.N8N_WEBHOOK_BASE || `${DIGITALOCEAN_HOST}:5678/webhook`;
const POSTGRES_API_BASE = process.env.POSTGRES_API_BASE || `${DIGITALOCEAN_HOST}:5432`;

// Axios instance with VPN timeout
const httpClient = axios.create({
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// MCP Server instance
const server = new Server(
  {
    name: "groundzero-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool: enqueue_task
 * Enqueue a task to Ground-Zero queue via n8n webhook
 */
const enqueueTaskSchema = z.object({
  task_type: z.string().describe("Type of task (e.g., 'llm_reasoning', 'code_execution')"),
  payload: z.record(z.any()).describe("Task payload as JSON object"),
  priority: z.number().min(1).max(10).optional().describe("Priority (1=highest, 10=lowest, default=5)"),
});

/**
 * Tool: get_task_status
 * Get status of a task by ID
 */
const getTaskStatusSchema = z.object({
  task_id: z.string().uuid().describe("UUID of the task"),
});

/**
 * Tool: list_tasks
 * List tasks filtered by status
 */
const listTasksSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "failed", "retrying"]).optional(),
  limit: z.number().min(1).max(100).optional().describe("Max results (default: 10)"),
});

/**
 * Tool: get_queue_stats
 * Get queue statistics (counts by status)
 */
const getQueueStatsSchema = z.object({});

/**
 * Tool: cancel_task
 * Cancel a pending task
 */
const cancelTaskSchema = z.object({
  task_id: z.string().uuid().describe("UUID of the task to cancel"),
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "enqueue_task",
        description: "Enqueue a new task to Ground-Zero orchestration system. Returns task_id for tracking.",
        inputSchema: {
          type: "object",
          properties: {
            task_type: {
              type: "string",
              description: "Type of task. Options: 'llm_reasoning' (use Ollama LLM), 'code_execution' (run code), 'simple_computation' (math operations), 'external_api_call' (HTTP requests)",
            },
            payload: {
              type: "object",
              description: "Task-specific parameters. For llm_reasoning: {prompt, model?, temperature?}. For simple_computation: {operation, args}.",
            },
            priority: {
              type: "number",
              description: "Priority level (1=highest, 10=lowest). Default: 5",
              minimum: 1,
              maximum: 10,
            },
          },
          required: ["task_type", "payload"],
        },
      },
      {
        name: "get_task_status",
        description: "Get detailed status of a task by its UUID. Returns task info, status, result, and error if any.",
        inputSchema: {
          type: "object",
          properties: {
            task_id: {
              type: "string",
              description: "UUID of the task (returned by enqueue_task)",
              pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            },
          },
          required: ["task_id"],
        },
      },
      {
        name: "list_tasks",
        description: "List tasks filtered by status. Returns array of tasks with metadata.",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Filter by status",
              enum: ["pending", "in_progress", "completed", "failed", "retrying"],
            },
            limit: {
              type: "number",
              description: "Maximum number of results (1-100). Default: 10",
              minimum: 1,
              maximum: 100,
            },
          },
        },
      },
      {
        name: "get_queue_stats",
        description: "Get queue statistics including task counts by status, average processing time, etc.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "cancel_task",
        description: "Cancel a pending task. Only works for tasks in 'pending' status.",
        inputSchema: {
          type: "object",
          properties: {
            task_id: {
              type: "string",
              description: "UUID of the task to cancel",
              pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
            },
          },
          required: ["task_id"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "enqueue_task": {
        const validatedArgs = enqueueTaskSchema.parse(args);
        const response = await httpClient.post(`${N8N_WEBHOOK_BASE}/task`, {
          task_type: validatedArgs.task_type,
          payload: validatedArgs.payload,
          priority: validatedArgs.priority || 5,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                task_id: response.data.task_id,
                status: response.data.status,
                message: response.data.message,
              }, null, 2),
            },
          ],
        };
      }

      case "get_task_status": {
        const validatedArgs = getTaskStatusSchema.parse(args);
        const response = await httpClient.get(
          `${N8N_WEBHOOK_BASE}/task/${validatedArgs.task_id}/status`
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                task: response.data,
              }, null, 2),
            },
          ],
        };
      }

      case "list_tasks": {
        const validatedArgs = listTasksSchema.parse(args);
        const params = new URLSearchParams();
        if (validatedArgs.status) params.append("status", validatedArgs.status);
        if (validatedArgs.limit) params.append("limit", validatedArgs.limit.toString());
        else params.append("limit", "10");

        const response = await httpClient.get(
          `${N8N_WEBHOOK_BASE}/tasks?${params.toString()}`
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                count: response.data.count,
                tasks: response.data.tasks,
              }, null, 2),
            },
          ],
        };
      }

      case "get_queue_stats": {
        getQueueStatsSchema.parse(args);
        const response = await httpClient.get(`${N8N_WEBHOOK_BASE}/queue/stats`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                stats: response.data,
              }, null, 2),
            },
          ],
        };
      }

      case "cancel_task": {
        const validatedArgs = cancelTaskSchema.parse(args);
        const response = await httpClient.post(
          `${N8N_WEBHOOK_BASE}/task/${validatedArgs.task_id}/cancel`
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: response.data.message,
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // Handle errors
    let errorMessage = "Unknown error";
    let errorDetails = {};

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
        errorDetails = error.response.data;
      } else if (error.request) {
        // No response (network error, timeout, VPN down)
        errorMessage = "Network error: Unable to reach DigitalOcean droplet. Check VPN connection.";
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof z.ZodError) {
      // Validation error
      errorMessage = "Invalid arguments";
      errorDetails = { errors: error.errors };
    } else {
      errorMessage = error.message;
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: errorMessage,
            details: errorDetails,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  console.error("Ground-Zero MCP Server starting...");
  console.error(`Target: ${DIGITALOCEAN_HOST}`);
  console.error(`n8n Webhook: ${N8N_WEBHOOK_BASE}`);
  console.error("");

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Ground-Zero MCP Server running on STDIO");
  console.error("Waiting for Claude Desktop connections...");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
