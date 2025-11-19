# Agent Dashboard - Real-time Monitoring System

A stunning, production-ready web-based monitoring tool for the Claude Code Agent Orchestration System. Built with modern technologies and featuring real-time updates, beautiful visualizations, and a responsive design.

## Features

- **Real-time Updates**: WebSocket-powered live data streaming
- **Beautiful UI**: Modern, responsive design with dark/light themes
- **Interactive Charts**: Rich visualizations using Recharts
- **Agent Monitoring**: Track agent performance, invocations, and success rates
- **Task Management**: View and monitor todos across workspaces
- **Workspace Support**: Switch between different project workspaces
- **Production Ready**: Dockerized deployment with Nginx and Node.js

## Tech Stack

### Backend
- **Express.js** - Fast, minimalist web framework
- **Socket.io** - Real-time bidirectional event-based communication
- **Winston** - Professional logging
- **Chokidar** - File system watching
- **Helmet** - Security middleware
- **Compression** - Response compression

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Composable charting library
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **Vite** - Fast build tool

## Architecture

```
.claude/web-dashboard/
├── server/                 # Backend Express + Socket.io server
│   ├── index.js           # Main server entry point
│   ├── routes/
│   │   └── api.js         # REST API endpoints
│   ├── websocket.js       # WebSocket handlers
│   ├── package.json       # Backend dependencies
│   └── Dockerfile         # Backend container config
│
├── client/                # Frontend React application
│   ├── src/
│   │   ├── App.tsx        # Main app component
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Metrics.tsx
│   │   │   ├── Agents.tsx
│   │   │   └── Workspaces.tsx
│   │   ├── components/    # Reusable components
│   │   │   ├── TodoCard.tsx
│   │   │   ├── AgentCard.tsx
│   │   │   └── MetricsChart.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useWebSocket.ts
│   │   │   └── useMetrics.ts
│   │   └── store/         # State management
│   │       └── useStore.ts
│   ├── package.json       # Frontend dependencies
│   ├── Dockerfile         # Frontend container config
│   └── nginx.conf         # Nginx configuration
│
└── docker-compose.yml     # Docker orchestration
```

## Installation

### Prerequisites
- Node.js 18+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- npm or yarn

### Local Development

#### 1. Install Backend Dependencies
```bash
cd server
npm install
```

#### 2. Configure Backend
```bash
cp .env.example .env
# Edit .env with your configuration
```

#### 3. Start Backend Server
```bash
npm run dev
# Server runs on http://localhost:4000
```

#### 4. Install Frontend Dependencies
```bash
cd ../client
npm install
```

#### 5. Start Frontend Development Server
```bash
npm run dev
# Client runs on http://localhost:3000
```

### Docker Deployment

#### 1. Build and Start All Services
```bash
docker-compose up -d
```

#### 2. Access the Dashboard
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

#### 3. View Logs
```bash
docker-compose logs -f
```

#### 4. Stop Services
```bash
docker-compose down
```

## API Documentation

### REST Endpoints

#### GET /api/todos
Get all todos for a workspace.

**Query Parameters:**
- `workspace` (optional): Workspace name (default: "default-project")

**Response:**
```json
{
  "success": true,
  "workspace": "default-project",
  "todos": [...],
  "count": 10
}
```

#### GET /api/metrics/session/:id
Get metrics for a specific session.

**Response:**
```json
{
  "success": true,
  "sessionId": "session-123",
  "metrics": {...}
}
```

#### GET /api/metrics/daily
Get daily aggregated metrics.

**Response:**
```json
{
  "success": true,
  "metrics": [
    {
      "date": "2025-11-18",
      "totalTasks": 45,
      "completedTasks": 40,
      "failedTasks": 5
    }
  ],
  "count": 30
}
```

#### GET /api/agents
Get all agents with their statistics.

**Response:**
```json
{
  "success": true,
  "agents": [
    {
      "name": "coder",
      "description": "Implementation specialist",
      "status": "available",
      "stats": {
        "invocations": 150,
        "successes": 145,
        "failures": 5,
        "averageDuration": 2500
      }
    }
  ],
  "count": 5
}
```

#### GET /api/workspaces
Get all workspaces.

**Response:**
```json
{
  "success": true,
  "workspaces": [
    {
      "name": "project-a",
      "description": "Main project",
      "todoCount": 25,
      "created": "2025-11-18T10:00:00.000Z"
    }
  ],
  "count": 3
}
```

#### POST /api/workspace/switch
Switch active workspace.

**Body:**
```json
{
  "workspace": "project-b"
}
```

**Response:**
```json
{
  "success": true,
  "workspace": "project-b",
  "message": "Switched to workspace: project-b"
}
```

### WebSocket Events

#### Client → Server

**subscribe**
```json
{
  "streams": ["todos", "metrics", "workspaces"]
}
```

**unsubscribe**
```json
{
  "streams": ["todos"]
}
```

#### Server → Client

**connected**
```json
{
  "message": "Connected to Agent Dashboard",
  "timestamp": "2025-11-18T10:00:00.000Z"
}
```

**todos:updated**
```json
{
  "workspace": "default-project",
  "todos": [...],
  "timestamp": "2025-11-18T10:00:00.000Z"
}
```

**metrics:updated**
```json
{
  "type": "daily",
  "id": "2025-11-18",
  "metrics": {...},
  "timestamp": "2025-11-18T10:00:00.000Z"
}
```

**heartbeat**
```json
{
  "timestamp": "2025-11-18T10:00:00.000Z",
  "clients": 3
}
```

## Configuration

### Backend (.env)
```env
PORT=4000                    # Server port
NODE_ENV=development         # Environment
CLIENT_URL=http://localhost:3000  # CORS origin
LOG_LEVEL=info              # Logging level
RATE_LIMIT_WINDOW=60000     # Rate limit window (ms)
MAX_REQUESTS=100            # Max requests per window
```

### Frontend
Edit `client/vite.config.ts` to change proxy settings or build options.

## Development Guide

### Adding a New Page

1. Create page component in `client/src/pages/`:
```tsx
export function MyPage() {
  return <div>My Page</div>;
}
```

2. Add route in `client/src/App.tsx`:
```tsx
<Route path="/my-page" element={<MyPage />} />
```

3. Add navigation item:
```tsx
{ name: 'My Page', href: '/my-page', icon: MyIcon }
```

### Adding a New API Endpoint

1. Add route in `server/routes/api.js`:
```javascript
router.get('/my-endpoint', async (req, res) => {
  // Implementation
});
```

2. Create hook in `client/src/hooks/useMetrics.ts`:
```typescript
export function useMyData() {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: async () => {
      const response = await fetch('/api/my-endpoint');
      return response.json();
    },
  });
}
```

### Customizing Theme

Edit `client/tailwind.config.js` to customize colors, fonts, and more:
```javascript
theme: {
  extend: {
    colors: {
      primary: {...},
    },
  },
}
```

## Performance Optimization

### Backend
- **Rate Limiting**: Prevents API abuse
- **Compression**: Reduces response sizes
- **File Watching**: Efficient change detection
- **Connection Pooling**: Reuses WebSocket connections

### Frontend
- **Code Splitting**: Lazy loading with React.lazy
- **Memoization**: React.memo and useMemo
- **Debouncing**: Search inputs and filters
- **Virtual Scrolling**: Large lists (add if needed)

## Security

### Backend
- **Helmet**: Sets security headers
- **CORS**: Restricts cross-origin requests
- **Rate Limiting**: Prevents DDoS
- **Input Validation**: Sanitizes user input

### Frontend
- **CSP**: Content Security Policy via Helmet
- **XSS Protection**: React's built-in escaping
- **Secure Headers**: Via Nginx configuration

## Troubleshooting

### Backend won't start
- Check if port 4000 is available: `lsof -i :4000`
- Verify .claude directory exists and is readable
- Check logs: `docker-compose logs server`

### Frontend won't connect to backend
- Verify backend is running
- Check CORS configuration in backend
- Inspect browser console for errors
- Verify proxy settings in vite.config.ts

### WebSocket connection fails
- Check firewall settings
- Verify Socket.io compatibility
- Check browser console for errors
- Ensure server is accessible

### Docker build fails
- Update Docker to latest version
- Clear Docker cache: `docker system prune -a`
- Check Dockerfile syntax
- Verify all files are committed

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -am 'Add my feature'`
6. Push: `git push origin feature/my-feature`
7. Create a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check this README
2. Review the [ISS AI Automation School](https://www.skool.com/iss-ai-automation-school-6342/about)
3. Open an issue on GitHub

## Roadmap

- [ ] User authentication
- [ ] Role-based access control
- [ ] Export reports to PDF
- [ ] Mobile app (React Native)
- [ ] Advanced filtering and search
- [ ] Custom dashboard layouts
- [ ] Notification system
- [ ] Integration with external tools

---

**Built with love by the Claude Code Agent Team** 🚀
