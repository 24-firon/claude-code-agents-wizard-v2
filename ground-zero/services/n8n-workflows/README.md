# Ground-Zero n8n Workflows

n8n workflows for Ground-Zero orchestration system.

## 📋 Available Workflows

### 1. orchestrator-workflow.json
**Purpose:** Main entry point for task enqueueing

**Endpoints:**
- `POST /webhook/task` - Enqueue new task
- Validates input
- Inserts to PostgreSQL
- Publishes event to Redis
- Returns task_id

**Trigger:** Webhook (HTTP POST)

**Example Request:**
```bash
curl -X POST http://localhost:5678/webhook/task \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "llm_reasoning",
    "payload": {
      "prompt": "Hello world",
      "model": "llama2"
    },
    "priority": 5
  }'
```

**Example Response:**
```json
{
  "task_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "enqueued",
  "message": "Task enqueued successfully"
}
```

### 2. status-endpoints-workflow.json (TODO)
**Purpose:** Query task status and queue stats

**Endpoints:**
- `GET /webhook/task/:task_id/status` - Get task status
- `GET /webhook/tasks?status=X&limit=N` - List tasks
- `GET /webhook/queue/stats` - Queue statistics
- `POST /webhook/task/:task_id/cancel` - Cancel task

### 3. worker-workflow.json (TODO)
**Purpose:** Process tasks from queue (alternative to Agent Zero)

**Trigger:** Cron (every 5 seconds)

**Flow:**
1. Dequeue task from PostgreSQL
2. Route based on task_type
3. Execute task
4. Update result in PostgreSQL

### 4. critic-workflow.json (TODO)
**Purpose:** Validate outputs and retry failures

**Trigger:** Database trigger (on task completion)

**Flow:**
1. Check result quality
2. If invalid → mark for retry
3. If valid → finalize

## 🚀 Installation

### Step 1: Access n8n

```bash
# Via VPN
http://[droplet-ip]:5678
```

Login with credentials from `.env`:
- Username: `admin`
- Password: (from `N8N_PASSWORD`)

### Step 2: Import Workflows

1. Click "Workflows" → "Import from File"
2. Select `orchestrator-workflow.json`
3. Click "Import"
4. Repeat for other workflows

### Step 3: Configure Database Connection

Each workflow needs PostgreSQL credentials:

1. Open workflow
2. Click PostgreSQL node
3. Create credential:
   - **Host:** postgres (Docker network)
   - **Port:** 5432
   - **Database:** groundzero
   - **User:** groundzero
   - **Password:** (from `.env` POSTGRES_PASSWORD)

### Step 4: Configure Redis Connection

For event publishing:

1. Click Redis node
2. Create credential:
   - **Host:** redis
   - **Port:** 6379
   - **Password:** (from `.env` REDIS_PASSWORD)

### Step 5: Activate Workflows

1. Click toggle in top-right: "Inactive" → "Active"
2. Test webhook:
   ```bash
   curl -X POST http://localhost:5678/webhook/task \
     -H "Content-Type: application/json" \
     -d '{"task_type": "simple_computation", "payload": {"operation": "add", "args": [1,2,3]}, "priority": 5}'
   ```

Expected: `{"task_id": "...", "status": "enqueued"}`

## 🔧 Customization

### Add New Task Type

1. Open orchestrator-workflow.json
2. Add validation for new task_type
3. Update schema in PostgreSQL if needed

### Change Queue Polling Interval

Worker workflow (when implemented):
1. Open worker-workflow.json
2. Edit Cron trigger: `*/5 * * * * *` (every 5 seconds)
3. Adjust to desired interval

## 📊 Monitoring

### View Workflow Executions

1. Open workflow
2. Click "Executions" tab
3. See success/failure history

### Enable Execution Logging

In `docker-compose.yml`:
```yaml
EXECUTIONS_DATA_SAVE_ON_SUCCESS: all
EXECUTIONS_DATA_SAVE_ON_ERROR: all
```

## 🐛 Troubleshooting

### Webhook Returns 404

**Cause:** Workflow not activated or wrong URL

**Solution:**
1. Check workflow is "Active"
2. Verify webhook path: `/webhook/task` (not `/webhook-test/task`)

### Database Connection Error

**Cause:** Wrong credentials or PostgreSQL not running

**Solution:**
1. Check PostgreSQL is running:
   ```bash
   docker ps | grep postgres
   ```
2. Verify credentials match `.env`

### Redis Connection Error

**Cause:** Wrong password or Redis not running

**Solution:**
1. Check Redis:
   ```bash
   docker ps | grep redis
   ```
2. Test Redis password:
   ```bash
   docker exec groundzero-redis redis-cli -a <password> ping
   ```

## 📄 Related Documentation

- Main README: `../../README.md`
- Agent Zero: `../agent-zero/`
- MCP Server: `../mcp-server/`
