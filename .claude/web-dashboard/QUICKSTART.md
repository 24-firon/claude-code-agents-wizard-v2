# Quick Start Guide

Get the Agent Dashboard up and running in 5 minutes!

## Option 1: Docker (Recommended)

The fastest way to get started:

```bash
# Navigate to the dashboard directory
cd .claude/web-dashboard

# Start everything with Docker Compose
docker-compose up -d

# Access the dashboard
# Frontend: http://localhost:3000
# Backend: http://localhost:4000

# View logs
docker-compose logs -f

# Stop when done
docker-compose down
```

## Option 2: Local Development

For active development:

### 1. Start the Backend

```bash
cd .claude/web-dashboard/server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start server (with auto-reload)
npm run dev
```

The backend server will start on http://localhost:4000

### 2. Start the Frontend (New Terminal)

```bash
cd .claude/web-dashboard/client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on http://localhost:3000

## First Time Setup

1. **Backend** runs on port 4000
2. **Frontend** runs on port 3000
3. **WebSocket** connection is automatic
4. **Real-time updates** work immediately

## What You'll See

### Dashboard Page
- Active tasks with real-time updates
- Agent status cards
- Task statistics
- Completion rates

### Metrics Page
- Beautiful charts showing task performance
- Agent comparison graphs
- Success rate trends
- Interactive time range filters

### Agents Page
- All available agents with stats
- Success/failure rates
- Average execution times
- Search and filter capabilities

### Workspaces Page
- Switch between different projects
- Export workspace data
- Workspace statistics

## Troubleshooting

### Port Already in Use

If port 3000 or 4000 is already in use:

```bash
# Find process using the port
lsof -i :3000  # or :4000

# Kill the process
kill -9 <PID>
```

Or change the ports in:
- Backend: `server/.env` (PORT=4000)
- Frontend: `client/vite.config.ts` (port: 3000)

### WebSocket Connection Failed

Make sure:
1. Backend is running on port 4000
2. No firewall blocking connections
3. Check browser console for errors

### Data Not Showing

The dashboard reads from:
- `../.claude/persistence/` for todos
- `../.claude/metrics/` for metrics data
- `../.claude/agents/` for agent definitions
- `../.claude/workspaces/` for workspace data

Make sure these directories exist and have data.

## Next Steps

1. Explore the dashboard pages
2. Watch real-time updates as agents work
3. Analyze performance metrics
4. Switch between workspaces
5. Customize the theme (light/dark)

## Production Deployment

For production:

```bash
# Build optimized containers
docker-compose build

# Start in production mode
NODE_ENV=production docker-compose up -d

# Monitor
docker-compose logs -f
```

## Support

- Full docs: See [README.md](./README.md)
- Issues: Check the troubleshooting section
- Community: [ISS AI Automation School](https://www.skool.com/iss-ai-automation-school-6342/about)

Happy monitoring! 🚀
