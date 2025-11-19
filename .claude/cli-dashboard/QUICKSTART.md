# Quick Start Guide

## Installation & Launch (30 seconds)

```bash
# Navigate to the dashboard
cd .claude/cli-dashboard

# Launch (auto-installs dependencies if needed)
./start.sh
```

That's it! The dashboard will start automatically.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `q` | Quit |
| `o` | Overview (todos, agents, metrics) |
| `l` | Logs view |
| `r` | Refresh |
| `h` | Help |
| `d` | Demo mode |

## What You'll See

### Overview View
- **Top Left**: Todo list with progress bar
- **Top Right**: Live agent status (coder, tester, stuck)
- **Bottom**: Performance charts and metrics

### Logs View
- **Main Area**: Color-coded system logs
- **Bottom**: Active filters display

## Demo Mode

Press `d` to activate demo mode - simulates agent activity without needing real data.

## Troubleshooting

### Dashboard won't start?
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### No updates showing?
- Ensure `.claude/todos.json` exists
- Check that file watcher started (press `l` for logs)

## What It Monitors

- `.claude/todos.json` - Todo list changes
- `.claude/metrics/*.json` - Performance data
- `.claude/sessions/*.json` - Agent activity
- `.claude/logs/*.log` - System logs

All updates appear in **real-time**!

## Examples

### Watch todos update
```bash
# Terminal 1: Run dashboard
./start.sh

# Terminal 2: Update todos
echo '{"todos":[{"id":1,"title":"Test","status":"completed"}]}' > ../.claude/todos.json

# Dashboard updates instantly!
```

### View agent activity
1. Start dashboard
2. Press `o` for overview
3. Watch "Agent Activity" panel
4. See agents work in real-time

### Check logs
1. Press `l` for logs view
2. See color-coded entries
3. Scroll with arrow keys
4. Press `ESC` to go back

That's all you need to know! Press `h` in the dashboard for more help.
