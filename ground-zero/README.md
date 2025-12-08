# Ground-Zero Multi-Agent Orchestration

Production-ready multi-agent orchestration system for DigitalOcean deployment.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Windows PC (Kommandozentrale)            │
│  ┌──────────────────────┐                                   │
│  │  Claude Desktop      │                                   │
│  │  + groundzero-MCP    │ ←─── STDIO (Local)                │
│  │  (User Interface)    │                                   │
│  └──────────┬───────────┘                                   │
│             │ HTTP via Headscale VPN                        │
└─────────────┼───────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────┐
│            DigitalOcean Droplet (Execution Layer)           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Docker Network (172.20.0.0/16)                      │   │
│  │                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │   │
│  │  │ PostgreSQL  │  │   Redis     │  │   Ollama     │ │   │
│  │  │ (State DB)  │  │  (Cache)    │  │   (LLM)      │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘ │   │
│  │         │                │                │         │   │
│  │         └────────┬───────┴────────┬───────┘         │   │
│  │                  │                │                 │   │
│  │         ┌────────▼──────┐  ┌──────▼────────┐       │   │
│  │         │  Agent Zero   │  │     n8n       │       │   │
│  │         │ (Task Proc.)  │  │ (Workflows)   │       │   │
│  │         └───────────────┘  └───────────────┘       │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Components

### 1. Agent Zero Service
**Location:** `services/agent-zero/`

Python-based task processor with:
- **Queue Manager**: PostgreSQL-backed FIFO queue with priority support
- **State Manager**: Two-tier state (PostgreSQL + Redis cache)
- **Ollama Client**: LLM integration for complex reasoning
- **Checkpoint-based recovery**: Automatic task recovery on failures
- **Distributed locking**: Redis-based locks for critical sections

**Key Features:**
- Async/await architecture (asyncio)
- Retry logic with exponential backoff
- Health monitoring
- Prometheus metrics export

### 2. PostgreSQL (Source of Truth)
**Port:** 5432 (localhost only)

Tables:
- `task_queue`: FIFO queue with status tracking
- `unified_state`: Versioned state storage
- `event_bus`: Event pub/sub for inter-service communication
- `metrics`: Time-series metrics

**Features:**
- ACID transactions
- Row-level locking (FOR UPDATE SKIP LOCKED)
- Automatic cleanup of old tasks
- Built-in functions for queue stats

### 3. Redis (Cache Layer)
**Port:** 6379 (localhost only)

**Uses:**
- State caching (1h TTL)
- Distributed locks (SETNX)
- Pub/sub for events
- LRU eviction (512MB max memory)

### 4. Ollama (LLM Service)
**Port:** 11434 (localhost only)

**Supported Models:**
- llama2 (default)
- codellama
- mistral
- Custom models

**Features:**
- Local inference (no API costs)
- Streaming support
- Context management
- GPU acceleration (if available)

### 5. n8n (Workflow Orchestrator)
**Port:** 5678 (localhost only)

**Workflows:**
- Orchestrator: Enqueue tasks via webhook
- Worker: Process tasks from queue
- Critic: Validate outputs and retry failures

**Features:**
- Visual workflow editor
- PostgreSQL backend
- Bull queue with Redis
- Webhook triggers

### 6. Monitoring Stack (Optional)
**Prometheus:** Port 9090
**Grafana:** Port 3000

Metrics:
- Task queue length
- Processing duration
- Error rates
- Service health

## 📦 Quick Start

### Prerequisites

- **Server:** DigitalOcean Droplet (Ubuntu 22.04+, 4GB RAM minimum)
- **Local:** Windows PC with Claude Desktop
- **VPN:** Headscale for secure connection

### Deployment

#### 1. Clone Repository (on Droplet)
```bash
cd ~
git clone <your-repo-url> ground-zero
cd ground-zero
```

#### 2. Run Deployment Script
```bash
# Automated deployment (installs Docker, generates .env, starts services)
make deploy

# Or manually:
bash infrastructure/scripts/deploy-digitalocean.sh
```

The script will:
- ✅ Install Docker + Docker Compose
- ✅ Generate secure passwords (.env)
- ✅ Pull Ollama model
- ✅ Build Agent Zero image
- ✅ Start all services
- ✅ Run health checks

#### 3. Verify Deployment
```bash
# Check service status
make status

# View logs
make logs

# Run health checks
make test
```

Expected output:
```
PostgreSQL: ✅ Ready
Redis:      ✅ Ready
Ollama:     ✅ Ready
n8n:        ✅ Ready
Agent Zero: ✅ Ready
```

#### 4. Set Up VPN Access

1. Install Headscale on Droplet (see Headscale docs)
2. Install Tailscale on Windows PC
3. Connect via VPN
4. Access services:
   - n8n: http://[droplet-ip]:5678
   - Prometheus: http://[droplet-ip]:9090
   - Grafana: http://[droplet-ip]:3000 (if monitoring enabled)

#### 5. Import n8n Workflows

1. Open n8n at http://[droplet-ip]:5678
2. Login with credentials from `.env` file
3. Import workflows from `services/n8n-workflows/`
4. Activate "Ground-Zero Orchestrator" workflow

## 🛠️ Usage

### Enqueue a Task (via n8n Webhook)

```bash
curl -X POST http://localhost:5678/webhook/task \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "llm_reasoning",
    "payload": {
      "prompt": "Explain quantum computing in simple terms",
      "model": "llama2"
    },
    "priority": 5
  }'
```

Response:
```json
{
  "task_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "enqueued",
  "message": "Task enqueued successfully"
}
```

### Check Task Status (PostgreSQL)

```bash
# Via Makefile
make db-shell

# Then in PostgreSQL:
SELECT task_id, task_type, status, created_at, completed_at
FROM task_queue
WHERE task_id = '123e4567-e89b-12d3-a456-426614174000';
```

### View Agent Zero Logs

```bash
# Live logs
make logs-agent

# Last 100 lines
docker compose -f infrastructure/docker/docker-compose.yml logs --tail 100 agent-zero
```

## 📊 Monitoring

### Prometheus Metrics

Agent Zero exposes metrics at `http://localhost:8000/metrics`:

- `task_queue_length`: Current queue length
- `task_processing_duration_seconds`: Task processing time histogram
- `task_completed_total`: Total completed tasks (counter)
- `task_failed_total`: Total failed tasks (counter)

### Grafana Dashboards

Start monitoring stack:
```bash
make monitoring-start
```

Access Grafana at http://localhost:3000 and import dashboards.

## 🔧 Maintenance

### Common Commands

```bash
# Service management
make start          # Start all services
make stop           # Stop all services
make restart        # Restart all services

# Logs
make logs           # All services
make logs-agent     # Agent Zero only
make logs-n8n       # n8n only

# Database
make db-shell       # Open PostgreSQL shell
make db-backup      # Backup database
make db-restore     # Restore from backup

# Updates
make update         # Pull latest images and restart

# Health checks
make test           # Run all health checks
```

### Backup Strategy

**Automated daily backups:**
```bash
# Add to crontab
0 2 * * * cd ~/ground-zero && make db-backup
```

**Manual backup:**
```bash
make db-backup
```

Backups are saved to `backups/groundzero_YYYYMMDD_HHMMSS.sql`

### Update Ollama Model

```bash
# Pull new model
make ollama-pull MODEL=codellama

# List installed models
make ollama-list
```

## 🔐 Security

### Hardening Checklist

- ✅ All ports bound to localhost only
- ✅ Non-root containers (agent-zero runs as UID 1000)
- ✅ Capability dropping (cap_drop: ALL)
- ✅ Secure passwords (32+ characters, generated via OpenSSL)
- ✅ No plaintext secrets in code (.env gitignored)
- ✅ VPN-only access (Headscale)

### Password Rotation

1. Generate new passwords:
   ```bash
   openssl rand -base64 32
   ```

2. Update `.env` file:
   ```bash
   nano infrastructure/docker/.env
   ```

3. Restart services:
   ```bash
   make restart
   ```

## 🐛 Troubleshooting

### Agent Zero Not Processing Tasks

**Symptom:** Tasks stuck in "pending" status

**Solution:**
```bash
# Check Agent Zero logs
make logs-agent

# Restart Agent Zero
docker compose -f infrastructure/docker/docker-compose.yml restart agent-zero

# Verify PostgreSQL connection
make db-shell
SELECT COUNT(*) FROM task_queue WHERE status = 'pending';
```

### Ollama Model Not Found

**Symptom:** "model not found" in Agent Zero logs

**Solution:**
```bash
# List models
make ollama-list

# Pull missing model
make ollama-pull MODEL=llama2
```

### Redis Connection Refused

**Symptom:** "Connection refused" in logs

**Solution:**
```bash
# Check Redis health
docker compose -f infrastructure/docker/docker-compose.yml exec redis redis-cli ping

# Restart Redis
docker compose -f infrastructure/docker/docker-compose.yml restart redis
```

## 📂 Project Structure

```
ground-zero/
├── services/
│   ├── agent-zero/           # Python task processor
│   │   ├── agent.py          # Main entry point
│   │   ├── queue_manager.py  # Queue operations
│   │   ├── state_manager.py  # State management
│   │   ├── ollama_client.py  # LLM integration
│   │   ├── requirements.txt  # Python dependencies
│   │   └── Dockerfile        # Container build
│   │
│   └── n8n-workflows/        # n8n workflow definitions
│       └── orchestrator-workflow.json
│
├── infrastructure/
│   ├── docker/               # Docker configuration
│   │   ├── docker-compose.yml
│   │   ├── schema.sql        # PostgreSQL schema
│   │   ├── prometheus.yml    # Metrics config
│   │   ├── .env.example      # Environment template
│   │   └── .env              # Actual credentials (gitignored)
│   │
│   └── scripts/              # Deployment scripts
│       └── deploy-digitalocean.sh
│
├── Makefile                  # Common operations
├── README.md                 # This file
└── GROUND-ZERO-IMPLEMENTATION-PLAN.md  # Detailed plan
```

## 🚧 Roadmap

- [ ] Phase 2: Complete n8n workflows (Worker, Critic)
- [ ] Phase 3: MCP Server implementation (5 core tools)
- [ ] Phase 4: Full state synchronization with event bus
- [ ] Phase 6: Skills-MCP matrix documentation
- [ ] E2B Sandbox integration for code execution
- [ ] Auto-scaling with multiple Agent Zero workers
- [ ] Kubernetes deployment option

## 📄 License

MIT

## 🤝 Contributing

This is a solo-dev project. Contributions welcome!

## 📞 Support

See `GROUND-ZERO-IMPLEMENTATION-PLAN.md` for detailed specifications.
