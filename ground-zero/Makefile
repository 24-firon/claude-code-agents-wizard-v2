# Ground-Zero Makefile
# Simplifies common operations for DigitalOcean deployment

.PHONY: help deploy start stop restart logs status clean test backup

# Default target
help:
	@echo "Ground-Zero Multi-Agent Orchestration - Management Commands"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy          - Deploy complete stack on DigitalOcean"
	@echo "  make start           - Start all services"
	@echo "  make stop            - Stop all services"
	@echo "  make restart         - Restart all services"
	@echo ""
	@echo "Monitoring:"
	@echo "  make logs            - View live logs (all services)"
	@echo "  make logs-agent      - View Agent Zero logs only"
	@echo "  make logs-n8n        - View n8n logs only"
	@echo "  make status          - Show service status"
	@echo "  make ps              - Show running containers"
	@echo ""
	@echo "Database:"
	@echo "  make db-shell        - Open PostgreSQL shell"
	@echo "  make db-backup       - Backup PostgreSQL database"
	@echo "  make db-restore      - Restore PostgreSQL database"
	@echo ""
	@echo "Maintenance:"
	@echo "  make update          - Pull latest images and restart"
	@echo "  make clean           - Stop and remove all containers + volumes"
	@echo "  make test            - Run health checks"
	@echo ""
	@echo "Development:"
	@echo "  make build           - Build Agent Zero image"
	@echo "  make shell-agent     - Shell into Agent Zero container"
	@echo "  make shell-postgres  - Shell into PostgreSQL container"

# Deployment
deploy:
	@echo "🚀 Deploying Ground-Zero to DigitalOcean..."
	@bash infrastructure/scripts/deploy-digitalocean.sh

# Service management
start:
	@echo "▶️  Starting Ground-Zero services..."
	@cd infrastructure/docker && docker compose up -d
	@echo "✅ Services started"

stop:
	@echo "⏹️  Stopping Ground-Zero services..."
	@cd infrastructure/docker && docker compose down
	@echo "✅ Services stopped"

restart:
	@echo "🔄 Restarting Ground-Zero services..."
	@cd infrastructure/docker && docker compose restart
	@echo "✅ Services restarted"

# Monitoring
logs:
	@cd infrastructure/docker && docker compose logs -f

logs-agent:
	@cd infrastructure/docker && docker compose logs -f agent-zero

logs-n8n:
	@cd infrastructure/docker && docker compose logs -f n8n

logs-postgres:
	@cd infrastructure/docker && docker compose logs -f postgres

status:
	@cd infrastructure/docker && docker compose ps

ps:
	@docker ps --filter "name=groundzero-*" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Database operations
db-shell:
	@echo "🗄️  Opening PostgreSQL shell..."
	@cd infrastructure/docker && docker compose exec postgres psql -U groundzero -d groundzero

db-backup:
	@echo "💾 Backing up PostgreSQL database..."
	@mkdir -p backups
	@cd infrastructure/docker && docker compose exec -T postgres pg_dump -U groundzero groundzero > ../../backups/groundzero_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup saved to backups/"

db-restore:
	@echo "⚠️  This will restore the database from the latest backup."
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read
	@cd infrastructure/docker && cat ../../backups/$$(ls -t ../../backups/*.sql | head -1) | docker compose exec -T postgres psql -U groundzero -d groundzero
	@echo "✅ Database restored"

# Maintenance
update:
	@echo "🔄 Updating Ground-Zero..."
	@cd infrastructure/docker && docker compose pull
	@cd infrastructure/docker && docker compose up -d
	@echo "✅ Update complete"

clean:
	@echo "⚠️  WARNING: This will delete all containers, volumes, and data!"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read
	@cd infrastructure/docker && docker compose down -v
	@echo "✅ Cleaned"

test:
	@echo "🔍 Running health checks..."
	@echo ""
	@echo "PostgreSQL:"
	@cd infrastructure/docker && docker compose exec postgres pg_isready -U groundzero || echo "❌ PostgreSQL not ready"
	@echo ""
	@echo "Redis:"
	@cd infrastructure/docker && docker compose exec redis redis-cli ping || echo "❌ Redis not ready"
	@echo ""
	@echo "Ollama:"
	@curl -sf http://localhost:11434/api/tags > /dev/null && echo "✅ Ollama ready" || echo "❌ Ollama not ready"
	@echo ""
	@echo "n8n:"
	@curl -sf http://localhost:5678/healthz > /dev/null && echo "✅ n8n ready" || echo "❌ n8n not ready"
	@echo ""

# Development
build:
	@echo "🔨 Building Agent Zero image..."
	@cd infrastructure/docker && docker compose build agent-zero
	@echo "✅ Build complete"

shell-agent:
	@echo "🐚 Opening shell in Agent Zero container..."
	@cd infrastructure/docker && docker compose exec agent-zero /bin/bash

shell-postgres:
	@echo "🐚 Opening shell in PostgreSQL container..."
	@cd infrastructure/docker && docker compose exec postgres /bin/bash

shell-redis:
	@echo "🐚 Opening Redis CLI..."
	@cd infrastructure/docker && docker compose exec redis redis-cli -a $$(grep REDIS_PASSWORD infrastructure/docker/.env | cut -d '=' -f2)

# Ollama operations
ollama-pull:
	@echo "📥 Pulling Ollama model: $(MODEL)"
	@cd infrastructure/docker && docker compose exec ollama ollama pull $(MODEL)

ollama-list:
	@echo "📋 Installed Ollama models:"
	@cd infrastructure/docker && docker compose exec ollama ollama list

# Monitoring profile
monitoring-start:
	@echo "📊 Starting monitoring stack (Prometheus + Grafana)..."
	@cd infrastructure/docker && docker compose --profile monitoring up -d
	@echo "✅ Monitoring started"
	@echo "   Prometheus: http://localhost:9090"
	@echo "   Grafana:    http://localhost:3000"

monitoring-stop:
	@cd infrastructure/docker && docker compose --profile monitoring down
