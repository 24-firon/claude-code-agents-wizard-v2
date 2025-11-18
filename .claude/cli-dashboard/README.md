# 🚀 Claude Agent Dashboard

An **EPIC** interactive CLI dashboard for monitoring the Claude agent orchestration system in real-time.

![Dashboard](https://img.shields.io/badge/Status-Live-brightgreen)
![Node](https://img.shields.io/badge/Node-%3E%3D14.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 📋 Real-Time Todo Monitoring
- Live updates as todos are created, assigned, and completed
- Color-coded status indicators
- Progress bar showing completion percentage
- Task assignment tracking

### 🤖 Agent Activity Tracking
- Monitor all three agents (coder, tester, stuck)
- See current status (idle, working, success, failure)
- View current task for each agent
- Performance statistics (success/failure counts)
- Recent activity timeline

### 📊 Metrics & Visualization
- **Line Charts**: Task completion over time
- **Bar Charts**: Agent performance comparison
- **Sparklines**: Compact data visualization
- Real-time metrics updates
- Historical data viewing

### 📜 Comprehensive Logging
- View all system logs in real-time
- Filter by agent, level, or keyword
- Color-coded log levels (info, warn, error, success, debug)
- Export logs to file
- Scrollable log history (500+ entries)

### 🎨 Beautiful UI
- Terminal-based UI with blessed & blessed-contrib
- Multiple views (Overview, Logs)
- Responsive layout
- Smooth animations
- Color-coded everything!

## 🚀 Quick Start

### Installation

```bash
# Navigate to the dashboard directory
cd .claude/cli-dashboard

# Install dependencies
npm install

# Start the dashboard
npm start
```

Or use the automated launch script:

```bash
# Make the script executable
chmod +x .claude/cli-dashboard/start.sh

# Run the dashboard
./.claude/cli-dashboard/start.sh
```

## 📖 Usage

### Launching the Dashboard

```bash
npm start
```

The dashboard will automatically:
1. Connect to the `.claude` directory
2. Start watching for file changes
3. Display real-time updates

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `q` | Quit dashboard |
| `o` | Switch to Overview view |
| `l` | Switch to Logs view |
| `r` | Refresh display |
| `h` or `?` | Show help |
| `d` | Demo mode (simulate data) |
| `ESC` | Close dialogs |

### Views

#### Overview View
```
┌─────────────────────────────────────────────────────────────┐
│  🚀 CLAUDE AGENT ORCHESTRATION DASHBOARD                    │
└─────────────────────────────────────────────────────────────┘

┌─📋 Todo List──────┐  ┌─🤖 Agent Activity──┐
│ 1. ✓ Setup        │  │ CODER              │
│ 2. ⟳ Implement    │  │  Status: ⟳ working │
│ 3. ○ Test         │  │  Task: Build UI... │
│                   │  │  Stats: ✓ 5 | ⨯ 0 │
│ Progress: 33%     │  │                    │
└───────────────────┘  └────────────────────┘

┌─📈 Task Completion Timeline──────────────────────┐
│  Completed ──────                                │
│  Failed    ------                                │
└──────────────────────────────────────────────────┘

┌─📊 Agent Performance─────────────────────────────┐
│  CODER   ████████                                │
│  TESTER  ██████                                  │
│  STUCK   ██                                      │
└──────────────────────────────────────────────────┘
```

#### Logs View
```
┌─📜 System Logs────────────────────────────────────┐
│ [12:34:56] ✓ [coder] Task completed successfully │
│ [12:35:01] ● [tester] Starting verification      │
│ [12:35:05] ✓ [tester] Tests passed               │
│ [12:35:10] ● Dashboard refresh triggered         │
└───────────────────────────────────────────────────┘

┌─🔍 Filters────────────────────────────────────────┐
│ No active filters - showing all logs              │
└───────────────────────────────────────────────────┘
```

## 🎯 What It Monitors

### Files Watched

- **`todos.json`** - Todo list updates
- **`metrics/*.json`** - Performance metrics
- **`sessions/*.json`** - Agent activity sessions
- **`logs/*.log`** - System logs

### Events Tracked

- Todo creation, updates, completion
- Agent invocations and results
- Performance metrics changes
- System events and errors
- Log entries

## 🛠️ Configuration

### Custom Base Path

```javascript
const dashboard = new AgentDashboard({
  basePath: '/custom/path/to/.claude'
});
```

### Development Mode

```bash
npm run dev
```

Enables additional debugging information and verbose logging.

## 📦 Dependencies

- **blessed** - Terminal UI framework
- **blessed-contrib** - Charts and graphs
- **chalk** - Terminal colors
- **chokidar** - File system watching
- **inquirer** - Interactive prompts
- **ora** - Loading spinners
- **ws** - WebSocket support (future real-time features)
- **dayjs** - Date/time formatting
- **cli-table3** - ASCII tables

## 🎨 Color Coding

### Status Indicators

- 🟢 **Green** (`✓`) - Completed, Success
- 🟡 **Yellow** (`⟳`) - In Progress, Working
- ⚪ **Grey** (`○`) - Pending, Idle
- 🔴 **Red** (`⨯`) - Failed, Blocked, Stuck

### Log Levels

- 🔵 **Blue** (`◆`) - Debug
- ⚪ **White** (`●`) - Info
- 🟡 **Yellow** (`⚠`) - Warning
- 🔴 **Red** (`✗`) - Error
- 🟢 **Green** (`✓`) - Success

## 🚀 Advanced Features

### Demo Mode

Press `d` to activate demo mode, which simulates agent activity and metrics for testing the dashboard without a real workload.

### Log Export

```javascript
// Export logs to file
logWidget.exportLogs('/path/to/export.log');
```

### Custom Filters

```javascript
// Filter logs by agent
logWidget.setFilter('agent', 'coder');

// Filter by log level
logWidget.setFilter('level', 'error');

// Filter by keyword
logWidget.setFilter('keyword', 'failed');

// Clear all filters
logWidget.clearFilters();
```

## 🐛 Troubleshooting

### Dashboard won't start

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm start
```

### Missing updates

- Ensure `.claude` directory exists
- Check file permissions
- Verify watcher is running (check logs)

### UI rendering issues

- Use a terminal with full Unicode support
- Ensure terminal size is at least 80x24
- Try resizing terminal window

## 📝 Examples

### ASCII Art Preview

```
╔═══════════════════════════════════════════════════════════════╗
║  🚀 CLAUDE AGENT ORCHESTRATION DASHBOARD                      ║
╚═══════════════════════════════════════════════════════════════╝
[OVERVIEW]  Press q to quit | o overview | l logs | r refresh

┌─📋 Todo List────────────┐  ┌─🤖 Agent Activity──────────────┐
│                          │  │                                │
│  Summary: 2/5 completed  │  │  CODER                         │
│                          │  │    Status: ⟳ working           │
│  1.  ✓ Setup React       │  │    Task: Create components     │
│  2.  ✓ Create UI         │  │    Stats: ✓ 3 | ⨯ 0          │
│  3.  ⟳ Add state         │  │                                │
│  4.  ○ Test app          │  │  TESTER                        │
│  5.  ○ Deploy            │  │    Status: ○ idle              │
│                          │  │    Stats: ✓ 2 | ⨯ 0          │
│  Progress: [████████  ]  │  │                                │
│            40%           │  │  STUCK                         │
└──────────────────────────┘  │    Status: ○ idle              │
                              │    Stats: ✓ 1 | ⨯ 0          │
┌─📊 Agent Stats───────────┐  └────────────────────────────────┘
│ Agent   │Status │Success │
│ CODER   │work   │3       │  ┌─📈 Task Completion Timeline───┐
│ TESTER  │idle   │2       │  │                                │
│ STUCK   │idle   │1       │  │  Completed ──────              │
└──────────────────────────┘  │  Failed    ------              │
                              └────────────────────────────────┘
┌─📈 Task Completion Timeline─────────────────────────────────┐
│    10 │                                                      │
│     8 │              ╱──╲                                    │
│     6 │         ╱───╱    ╲                                   │
│     4 │    ╱───╱          ╲───╲                              │
│     2 │───╱                    ╲                             │
│     0 └────────────────────────────────────────────────────  │
│         12:00   12:15   12:30   12:45   13:00               │
└──────────────────────────────────────────────────────────────┘

┌─📊 Agent Performance────────────────────────────────────────┐
│                                                              │
│   CODER    ████████  8                                      │
│   TESTER   ██████    6                                      │
│   STUCK    ██        2                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🤝 Contributing

This dashboard is part of the Claude Agent orchestration system. Feel free to enhance it with:

- Additional metrics
- New chart types
- Custom themes
- Export features
- Alert notifications

## 📄 License

MIT License - Use freely and build amazing things!

## 🎉 Credits

Built with ❤️ for the Claude Agent ecosystem using:
- blessed & blessed-contrib for terminal UI
- Node.js for runtime
- Your terminal for display!

---

**Enjoy monitoring your agents in style!** 🚀✨
