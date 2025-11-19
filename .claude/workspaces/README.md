# Multi-Project Workspace System

## Overview

The workspace system allows you to manage multiple independent projects within the Claude Code orchestration system. Each workspace maintains its own todos, configuration, and session history while sharing the same agent framework.

## Architecture

### Directory Structure

```
.claude/
├── workspaces/
│   ├── README.md                    # This file
│   ├── workspace-config.json        # Global workspace configuration
│   ├── active-workspace.json        # Tracks currently active workspace
│   ├── project-a/                   # Example workspace
│   │   ├── config.json              # Project-specific configuration
│   │   ├── todos.json               # Project todos (links to persistence layer)
│   │   └── history.json             # Session history for this project
│   └── project-b/                   # Another workspace
│       ├── config.json
│       ├── todos.json
│       └── history.json
└── persistence/
    ├── schema.json                  # Shared schema for all workspaces
    └── default-project/             # Default workspace storage
        ├── todos.json
        └── metadata.json
```

## How It Works

### Workspace Isolation

Each workspace is completely isolated:
- **Separate todos**: Each project has its own todo list
- **Independent configuration**: Different agent settings, priorities, etc.
- **Session history**: Track what's been done in each project
- **Shared agents**: All workspaces use the same agent definitions

### Integration with Persistence Layer

The workspace system integrates with the existing persistence layer:
- **Schema**: All workspaces conform to `.claude/persistence/schema.json`
- **Storage**: Each workspace can store data in `.claude/persistence/{workspace-name}/`
- **Backwards compatible**: Existing `default-project` continues to work

## Commands for Workspace Management

### Creating a New Workspace

1. **Manual creation**:
   ```bash
   mkdir -p .claude/workspaces/my-new-project
   ```

2. **Create configuration** (copy from template below)

3. **Initialize files**:
   - `config.json` - Project configuration
   - `todos.json` - Empty todo array `[]`
   - `history.json` - Empty history array `[]`

4. **Register in workspace-config.json**:
   Add your workspace to the `workspaces` array

### Switching Between Workspaces

To switch workspaces, update `active-workspace.json`:

```json
{
  "currentWorkspace": "project-a",
  "lastSwitched": "2025-11-18T22:00:00.000Z",
  "previousWorkspace": "default-project"
}
```

The orchestrator will read this file to determine which workspace to use for:
- Loading/saving todos
- Applying project-specific configuration
- Recording session history

### Quick Switch Back

The `previousWorkspace` field allows quick switching back to the last workspace:

```bash
# Pseudo-code for workspace switching logic
previous = readActiveWorkspace().previousWorkspace
updateActiveWorkspace(previous)
```

## Workspace Configuration

### Global Configuration (workspace-config.json)

Contains settings that apply across all workspaces:
- List of all available workspaces
- Default workspace (used when no workspace is active)
- Global preferences (model settings, etc.)

### Project Configuration (project-name/config.json)

Each workspace has its own configuration:
- **Project metadata**: Name, description, purpose
- **Enabled agents**: Which agents are available for this project
- **Agent settings**: Custom configurations for specific agents
- **Project preferences**: Auto-archive, priorities, etc.

## File Formats

### config.json (Project Configuration)

```json
{
  "name": "project-a",
  "description": "Full-stack web application",
  "created": "2025-11-18T22:00:00.000Z",
  "lastModified": "2025-11-18T22:00:00.000Z",
  "enabledAgents": [
    "coder",
    "tester",
    "stuck",
    "researcher",
    "security-auditor",
    "performance-optimizer"
  ],
  "agentConfig": {
    "coder": {
      "defaultLanguage": "typescript",
      "lintingEnabled": true
    },
    "tester": {
      "defaultBrowser": "chromium",
      "screenshotOnFailure": true
    }
  },
  "settings": {
    "autoArchive": true,
    "maxCompletedTodos": 50,
    "archiveAfterDays": 14,
    "defaultPriority": "high",
    "requireAssignment": true
  }
}
```

### todos.json (Todo List)

Follows the schema defined in `.claude/persistence/schema.json`:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Set up React project with TypeScript",
    "status": "completed",
    "timestamp": "2025-11-18T22:00:00.000Z",
    "createdAt": "2025-11-18T22:00:00.000Z",
    "completedAt": "2025-11-18T22:15:00.000Z",
    "assignedTo": "coder",
    "priority": "high",
    "tags": ["setup", "react", "typescript"]
  }
]
```

### history.json (Session History)

Tracks all actions performed in this workspace:

```json
[
  {
    "timestamp": "2025-11-18T22:00:00.000Z",
    "action": "todo_created",
    "details": {
      "todoId": "550e8400-e29b-41d4-a716-446655440000",
      "content": "Set up React project with TypeScript"
    }
  },
  {
    "timestamp": "2025-11-18T22:05:00.000Z",
    "action": "agent_invoked",
    "details": {
      "agent": "coder",
      "todoId": "550e8400-e29b-41d4-a716-446655440000"
    }
  },
  {
    "timestamp": "2025-11-18T22:15:00.000Z",
    "action": "todo_completed",
    "details": {
      "todoId": "550e8400-e29b-41d4-a716-446655440000",
      "assignedTo": "coder"
    }
  }
]
```

## Use Cases

### Multiple Independent Projects

```
workspaces/
├── frontend-app/        # React frontend project
├── backend-api/         # Node.js API project
├── mobile-app/          # React Native mobile app
└── documentation/       # Documentation website
```

Each project maintains its own:
- Todo list and progress
- Agent configurations
- Session history
- Settings and preferences

### Client Projects

```
workspaces/
├── client-acme/         # Project for Acme Corp
├── client-globex/       # Project for Globex Inc
└── internal-tools/      # Internal tooling
```

Keep client work isolated with separate configurations and histories.

### Feature Branches as Workspaces

```
workspaces/
├── main-development/    # Main development work
├── feature-auth/        # Authentication feature
└── feature-payments/    # Payment integration feature
```

Track progress on different features independently.

## Best Practices

### Naming Conventions

- Use lowercase with hyphens: `my-project-name`
- Be descriptive but concise: `ecommerce-frontend` not `proj1`
- Avoid special characters except hyphens and underscores

### Workspace Organization

1. **Create workspaces for distinct projects** - Don't create a workspace for every small feature
2. **Use tags in todos** - For organizing within a workspace
3. **Archive completed workspaces** - Move to `workspaces/archived/` when done
4. **Document your workspace** - Use the description field in config.json

### Session History

The history.json file is valuable for:
- **Auditing**: What was done and when
- **Analytics**: Which agents are used most
- **Debugging**: Trace back when issues were introduced
- **Reporting**: Generate progress reports

### Agent Configuration

Enable only the agents you need for each workspace:
- **Minimal project**: `["coder", "tester", "stuck"]`
- **Full-stack app**: `["coder", "tester", "stuck", "researcher"]`
- **Production service**: `["coder", "tester", "stuck", "security-auditor", "performance-optimizer"]`

## Integration Examples

### Orchestrator Reading Active Workspace

```javascript
// Pseudo-code for orchestrator
const activeWorkspace = readJSON('.claude/workspaces/active-workspace.json');
const workspaceName = activeWorkspace.currentWorkspace;
const config = readJSON(`.claude/workspaces/${workspaceName}/config.json`);
const todos = readJSON(`.claude/workspaces/${workspaceName}/todos.json`);

// Use config to determine available agents
const enabledAgents = config.enabledAgents;

// Use todos for task delegation
const nextTodo = todos.find(t => t.status === 'pending');
```

### Creating a Todo in Current Workspace

```javascript
// Pseudo-code for TodoWrite tool
const activeWorkspace = readJSON('.claude/workspaces/active-workspace.json');
const workspaceName = activeWorkspace.currentWorkspace;
const todosPath = `.claude/workspaces/${workspaceName}/todos.json`;
const historyPath = `.claude/workspaces/${workspaceName}/history.json`;

// Add todo
const todos = readJSON(todosPath);
todos.push(newTodo);
writeJSON(todosPath, todos);

// Record in history
const history = readJSON(historyPath);
history.push({
  timestamp: new Date().toISOString(),
  action: 'todo_created',
  details: { todoId: newTodo.id, content: newTodo.content }
});
writeJSON(historyPath, history);
```

## Migration from Single-Project

If you're currently using the single-project system:

1. **Existing todos preserved**: They remain in `.claude/persistence/default-project/`
2. **Create default workspace**: Copy existing todos to `workspaces/default-project/`
3. **Set as active**: Update `active-workspace.json` to use `default-project`
4. **Create new workspaces**: As needed for new projects

## Troubleshooting

### Workspace not loading

- Check `active-workspace.json` has valid workspace name
- Verify workspace directory exists in `.claude/workspaces/`
- Ensure `config.json` exists and is valid JSON

### Todos not persisting

- Check write permissions on workspace directory
- Verify todos.json is valid JSON array
- Ensure schema compliance (use schema.json for validation)

### Agent not available

- Check workspace's `config.json` has agent in `enabledAgents`
- Verify agent exists in `.claude/agents/`
- Check global `workspace-config.json` doesn't disable agent

## Future Enhancements

Potential features for the workspace system:

- **Workspace templates**: Quick-start templates for common project types
- **Import/export**: Share workspace configurations with team
- **Workspace search**: Search todos across all workspaces
- **Analytics dashboard**: Visualize progress across workspaces
- **Auto-switching**: Switch workspace based on git branch
- **Workspace linking**: Dependencies between workspaces

## Schema Compliance

All workspace files must comply with the schema at:
`.claude/persistence/schema.json`

This ensures:
- Type safety
- Validation
- Backwards compatibility
- Tool integration

## Summary

The workspace system provides:
- **Isolation**: Separate projects don't interfere
- **Organization**: Clear structure for multiple projects
- **Flexibility**: Configure each project independently
- **History**: Track what happened and when
- **Scalability**: Manage dozens of projects easily

Start by creating your first workspace and experimenting with the configuration options!
