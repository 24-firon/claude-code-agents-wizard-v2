#!/bin/bash
# Ground-Zero Deployment Script for DigitalOcean Droplet
# Deploys complete stack: PostgreSQL, Redis, Ollama, n8n, Agent Zero

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════╗
║   Ground-Zero Multi-Agent Orchestration       ║
║   DigitalOcean Droplet Deployment             ║
╚═══════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    log_error "Do not run this script as root. Run as regular user with sudo privileges."
    exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION=$VERSION_ID
else
    log_error "Cannot detect OS. This script supports Ubuntu 20.04+ and Debian 11+"
    exit 1
fi

log_info "Detected OS: $OS $VERSION"

# Validate OS
if [[ "$OS" != "ubuntu" && "$OS" != "debian" ]]; then
    log_error "Unsupported OS. This script requires Ubuntu 20.04+ or Debian 11+"
    exit 1
fi

# Step 1: Update system
log_info "Step 1/8: Updating system packages..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
log_success "System updated"

# Step 2: Install Docker
log_info "Step 2/8: Installing Docker..."
if ! command -v docker &> /dev/null; then
    # Install dependencies
    sudo apt-get install -y -qq \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # Add Docker GPG key
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/$OS/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    # Add Docker repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker
    sudo apt-get update -qq
    sudo apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # Add user to docker group
    sudo usermod -aG docker $USER

    log_success "Docker installed"
    log_warning "You may need to log out and log back in for group changes to take effect"
else
    log_success "Docker already installed ($(docker --version))"
fi

# Step 3: Install Docker Compose
log_info "Step 3/8: Installing Docker Compose..."
if ! command -v docker compose &> /dev/null; then
    sudo apt-get install -y -qq docker-compose-plugin
    log_success "Docker Compose installed"
else
    log_success "Docker Compose already installed ($(docker compose version))"
fi

# Step 4: Create project directory
log_info "Step 4/8: Creating project directory..."
PROJECT_DIR="$HOME/ground-zero"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR
log_success "Project directory: $PROJECT_DIR"

# Step 5: Clone repository (or copy files)
log_info "Step 5/8: Setting up project files..."
# TODO: Replace with actual git clone or file copy
log_warning "Please copy your Ground-Zero files to $PROJECT_DIR"
log_warning "Required structure:"
cat << EOF
  $PROJECT_DIR/
  ├── infrastructure/docker/
  │   ├── docker-compose.yml
  │   ├── schema.sql
  │   ├── prometheus.yml
  │   └── .env (create from .env.example)
  └── services/agent-zero/
      ├── agent.py
      ├── queue_manager.py
      ├── state_manager.py
      ├── ollama_client.py
      ├── requirements.txt
      └── Dockerfile
EOF

# Step 6: Generate environment file
log_info "Step 6/8: Generating .env file..."
ENV_FILE="$PROJECT_DIR/infrastructure/docker/.env"

if [ -f "$ENV_FILE" ]; then
    log_warning ".env file already exists. Skipping generation."
    log_warning "To regenerate, delete $ENV_FILE first"
else
    log_info "Generating secure passwords..."

    POSTGRES_PASSWORD=$(openssl rand -base64 32)
    REDIS_PASSWORD=$(openssl rand -base64 32)
    N8N_PASSWORD=$(openssl rand -base64 32)
    GRAFANA_PASSWORD=$(openssl rand -base64 32)

    cat > "$ENV_FILE" << ENVEOF
# Ground-Zero Infrastructure - Environment Configuration
# Generated: $(date)

# PostgreSQL
POSTGRES_USER=groundzero
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DB=groundzero

# Redis
REDIS_PASSWORD=$REDIS_PASSWORD

# n8n
N8N_USER=admin
N8N_PASSWORD=$N8N_PASSWORD
N8N_HOST=localhost
N8N_WEBHOOK_URL=http://localhost:5678

# Ollama
OLLAMA_MODEL=llama2

# Agent Zero
AGENT_POLL_INTERVAL=5
AGENT_MAX_RETRIES=3
LOG_LEVEL=INFO

# Timezone
TZ=UTC

# Monitoring
GRAFANA_USER=admin
GRAFANA_PASSWORD=$GRAFANA_PASSWORD
ENVEOF

    chmod 600 "$ENV_FILE"
    log_success ".env file generated at $ENV_FILE"
    log_warning "SAVE THESE CREDENTIALS SECURELY!"
    log_info "PostgreSQL Password: $POSTGRES_PASSWORD"
    log_info "Redis Password: $REDIS_PASSWORD"
    log_info "n8n Password: $N8N_PASSWORD"
    log_info "Grafana Password: $GRAFANA_PASSWORD"
fi

# Step 7: Pull Ollama model
log_info "Step 7/8: Pre-pulling Ollama model (this may take 5-10 minutes)..."
cd $PROJECT_DIR/infrastructure/docker

# Start only Ollama first
docker compose up -d ollama

log_info "Waiting for Ollama to start..."
sleep 30

# Pull model
OLLAMA_MODEL=${OLLAMA_MODEL:-llama2}
log_info "Pulling model: $OLLAMA_MODEL"
docker exec groundzero-ollama ollama pull $OLLAMA_MODEL || log_warning "Failed to pull model. You can pull it manually later."

log_success "Ollama ready"

# Step 8: Start all services
log_info "Step 8/8: Starting all services..."
cd $PROJECT_DIR/infrastructure/docker

# Build custom images (Agent Zero)
log_info "Building Agent Zero image..."
docker compose build agent-zero

# Start all services
log_info "Starting Ground-Zero stack..."
docker compose up -d

# Wait for services to be healthy
log_info "Waiting for services to become healthy (30 seconds)..."
sleep 30

# Check service health
log_info "Checking service health..."
docker compose ps

log_success "Deployment complete!"

# Print access information
echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}   Ground-Zero is now running!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Service URLs (access via Headscale VPN):${NC}"
echo "  n8n:        http://localhost:5678"
echo "  Prometheus: http://localhost:9090"
echo "  Grafana:    http://localhost:3000 (optional, run: docker compose --profile monitoring up -d)"
echo ""
echo -e "${BLUE}Service Status:${NC}"
docker compose ps
echo ""
echo -e "${BLUE}Credentials (from .env):${NC}"
echo "  Location: $ENV_FILE"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Set up Headscale VPN on your Windows PC"
echo "  2. Connect to this droplet via VPN"
echo "  3. Access n8n at http://localhost:5678"
echo "  4. Import workflows from infrastructure/n8n-workflows/"
echo "  5. Test Agent Zero by enqueuing a task"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View logs:      docker compose logs -f"
echo "  Stop services:  docker compose down"
echo "  Restart:        docker compose restart"
echo "  Update:         docker compose pull && docker compose up -d"
echo ""
echo -e "${GREEN}Happy orchestrating! 🚀${NC}"
