# Todo Persistence System

## Overview

The persistence layer provides a file-based storage system for managing todos and project metadata in the Claude Code Agent Orchestration System. It enables todos to persist across sessions and supports future multi-project workflows.

## Directory Structure

```
.claude/persistence/
├── README.md                    # This file - system documentation
├── schema.json                  # JSON schema for validation
└── default-project/             # Default project workspace
    ├── todos.json              # Todo items for default project
    └── metadata.json           # Project metadata
```

## How It Works

### Project Organization

Each project gets its own subdirectory under `.claude/persistence/` containing:
- `todos.json` - Array of todo items for the project
- `metadata.json` - Project information and timestamps

The `default-project/` is used when no specific project is specified.

### Todo Lifecycle

1. **Creation**: TodoWrite tool creates new todo items
2. **Storage**: Todos are appended to `todos.json`
3. **Updates**: Status changes are written back to the file
4. **Completion**: Completed todos remain in the file with updated status
5. **Archiving**: (Future) Old completed todos can be moved to archive

## File Formats

### todos.json

Array of todo objects, each containing:

```json
[
  {
    "id": "unique-uuid-v4",
    "content": "Implement feature X",
    "status": "pending",
    "activeForm": false,
    "timestamp": "2025-11-18T22:30:00.000Z",
    "createdAt": "2025-11-18T22:30:00.000Z",
    "completedAt": null,
    "assignedTo": null,
    "priority": "normal",
    "tags": []
  }
]
```

**Fields:**
- `id` (required): UUID v4 unique identifier
- `content` (required): Description of the todo item
- `status` (required): One of: "pending", "in-progress", "completed", "blocked"
- `activeForm` (optional): Boolean for UI rendering state
- `timestamp` (required): Last modified timestamp (ISO 8601)
- `createdAt` (required): Creation timestamp (ISO 8601)
- `completedAt` (optional): Completion timestamp (ISO 8601)
- `assignedTo` (optional): Which subagent is working on this ("coder", "tester", etc.)
- `priority` (optional): One of: "low", "normal", "high", "critical"
- `tags` (optional): Array of string tags for categorization

### metadata.json

Project information object:

```json
{
  "name": "project-name",
  "description": "Project description",
  "created": "2025-11-18T22:30:00.000Z",
  "lastModified": "2025-11-18T22:30:00.000Z",
  "version": "1.0.0",
  "settings": {
    "autoArchive": false,
    "maxCompletedTodos": 100
  }
}
```

**Fields:**
- `name` (required): Project identifier (alphanumeric, hyphens, underscores)
- `description` (optional): Human-readable project description
- `created` (required): Project creation timestamp (ISO 8601)
- `lastModified` (required): Last modification timestamp (ISO 8601)
- `version` (optional): Semantic version for schema compatibility
- `settings` (optional): Project-specific settings

## Manual Editing

You can manually edit the JSON files if needed:

1. **Always validate against schema**: Use `schema.json` for reference
2. **Preserve formatting**: Use 2-space indentation
3. **Update timestamps**: Set `lastModified` to current time when editing
4. **Maintain IDs**: Never change or duplicate todo IDs
5. **Backup first**: Copy files before manual edits

### Example Manual Edit

```bash
# Backup current todos
cp .claude/persistence/default-project/todos.json todos.backup.json

# Edit the file
nano .claude/persistence/default-project/todos.json

# Validate (requires jq)
jq empty .claude/persistence/default-project/todos.json && echo "Valid JSON"
```

## Multi-Project Support (Future)

The system is designed to support multiple projects:

```
.claude/persistence/
├── default-project/
│   ├── todos.json
│   └── metadata.json
├── my-website/
│   ├── todos.json
│   └── metadata.json
└── api-backend/
    ├── todos.json
    └── metadata.json
```

Projects can be switched using a project selector (to be implemented).

## Integration with TodoWrite

The TodoWrite tool should:
1. Read current `todos.json`
2. Append new todo with generated UUID
3. Update metadata `lastModified` timestamp
4. Write both files atomically
5. Validate against schema before writing

## Best Practices

1. **Never delete the schema.json**: Tools may depend on it
2. **Keep todos.json valid**: Always maintain array structure
3. **Update lastModified**: Every change should update the timestamp
4. **Use meaningful IDs**: UUID v4 ensures uniqueness
5. **Tag appropriately**: Use tags for filtering and organization
6. **Set priorities**: Help orchestrator prioritize work
7. **Archive regularly**: Move old completed todos to archive (future)

## Error Handling

If corruption occurs:
1. Check JSON syntax with `jq` or online validator
2. Restore from git history if available
3. Recreate from empty template
4. Report to stuck agent if during automation

## Schema Validation

All JSON files should validate against `schema.json`. Tools should:
1. Load schema before write operations
2. Validate data against schema
3. Reject invalid data and report to stuck agent
4. Never write invalid JSON

## Performance Considerations

- Files are loaded into memory for each read/write
- For large todo lists (1000+ items), consider pagination
- Archive completed todos periodically
- Keep active todos < 500 for optimal performance

## Security

- Files are local only, no network transmission
- Standard file permissions apply
- Sensitive data should not be stored in todos
- Use .gitignore if todos contain project-specific paths

## Troubleshooting

**Problem**: todos.json is corrupted
**Solution**: Restore from git or recreate from template

**Problem**: Duplicate todo IDs
**Solution**: Regenerate IDs with UUID v4, update todos.json

**Problem**: Invalid timestamp format
**Solution**: Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)

**Problem**: Schema validation fails
**Solution**: Check required fields and data types against schema.json

## Future Enhancements

- [ ] Project switching CLI command
- [ ] Todo archiving automation
- [ ] Search and filter capabilities
- [ ] Export to markdown/PDF
- [ ] Analytics dashboard
- [ ] Sync across machines
- [ ] Integration with issue trackers

## Support

For issues or questions:
1. Check this README
2. Validate against schema.json
3. Invoke stuck agent for help
4. Join [ISS AI Automation School](https://www.skool.com/iss-ai-automation-school-6342/about)
