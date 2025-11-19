const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Helper to get the base .claude directory
const getClaudeDir = () => {
  return path.join(__dirname, '../../../');
};

// GET /api/todos - Get all todos
router.get('/todos', async (req, res) => {
  try {
    const workspace = req.query.workspace || 'default-project';
    const todosPath = path.join(getClaudeDir(), 'persistence', workspace, 'todos.json');

    const data = await fs.readFile(todosPath, 'utf8');
    const todos = JSON.parse(data);

    res.json({
      success: true,
      workspace,
      todos,
      count: todos.length
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json({ success: true, todos: [], count: 0 });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// GET /api/metrics/session/:id - Get metrics for a specific session
router.get('/metrics/session/:id', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const metricsPath = path.join(getClaudeDir(), 'metrics', 'sessions', `${sessionId}.json`);

    const data = await fs.readFile(metricsPath, 'utf8');
    const metrics = JSON.parse(data);

    res.json({
      success: true,
      sessionId,
      metrics
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// GET /api/metrics/daily - Get daily aggregated metrics
router.get('/metrics/daily', async (req, res) => {
  try {
    const dailyPath = path.join(getClaudeDir(), 'metrics', 'daily');

    // Read all daily metric files
    const files = await fs.readdir(dailyPath);
    const dailyMetrics = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const data = await fs.readFile(path.join(dailyPath, file), 'utf8');
        const metrics = JSON.parse(data);
        dailyMetrics.push({
          date: file.replace('.json', ''),
          ...metrics
        });
      }
    }

    // Sort by date descending
    dailyMetrics.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      metrics: dailyMetrics,
      count: dailyMetrics.length
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json({ success: true, metrics: [], count: 0 });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// GET /api/agents - Get agent status and statistics
router.get('/agents', async (req, res) => {
  try {
    const agentsDir = path.join(getClaudeDir(), 'agents');
    const metricsDir = path.join(getClaudeDir(), 'metrics');

    // Read agent definitions
    const agentFiles = await fs.readdir(agentsDir);
    const agents = [];

    for (const file of agentFiles) {
      if (file.endsWith('.md')) {
        const agentName = file.replace('.md', '');
        const content = await fs.readFile(path.join(agentsDir, file), 'utf8');

        // Parse agent metadata from frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let metadata = { name: agentName, description: '' };

        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const lines = frontmatter.split('\n');
          lines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
              metadata[key.trim()] = valueParts.join(':').trim();
            }
          });
        }

        // Try to get agent statistics from metrics
        let stats = {
          invocations: 0,
          successes: 0,
          failures: 0,
          averageDuration: 0
        };

        try {
          const agentMetricsPath = path.join(metricsDir, 'agents', `${agentName}.json`);
          const metricsData = await fs.readFile(agentMetricsPath, 'utf8');
          stats = JSON.parse(metricsData);
        } catch (err) {
          // No metrics yet for this agent
        }

        agents.push({
          ...metadata,
          stats,
          status: 'available'
        });
      }
    }

    res.json({
      success: true,
      agents,
      count: agents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/workspaces - Get all workspaces
router.get('/workspaces', async (req, res) => {
  try {
    const workspacesDir = path.join(getClaudeDir(), 'workspaces');

    const workspaces = [];

    // Read workspace directories
    const dirs = await fs.readdir(workspacesDir);

    for (const dir of dirs) {
      const stat = await fs.stat(path.join(workspacesDir, dir));
      if (stat.isDirectory()) {
        try {
          const metadataPath = path.join(workspacesDir, dir, 'metadata.json');
          const todosPath = path.join(workspacesDir, dir, 'todos.json');

          let metadata = { name: dir };
          let todoCount = 0;

          try {
            const metaData = await fs.readFile(metadataPath, 'utf8');
            metadata = JSON.parse(metaData);
          } catch (err) {
            // No metadata file
          }

          try {
            const todosData = await fs.readFile(todosPath, 'utf8');
            const todos = JSON.parse(todosData);
            todoCount = todos.length;
          } catch (err) {
            // No todos file
          }

          workspaces.push({
            name: dir,
            ...metadata,
            todoCount,
            path: path.join(workspacesDir, dir)
          });
        } catch (err) {
          // Skip invalid workspaces
        }
      }
    }

    res.json({
      success: true,
      workspaces,
      count: workspaces.length
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json({ success: true, workspaces: [], count: 0 });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// POST /api/workspace/switch - Switch active workspace
router.post('/workspace/switch', async (req, res) => {
  try {
    const { workspace } = req.body;

    if (!workspace) {
      return res.status(400).json({
        success: false,
        error: 'Workspace name is required'
      });
    }

    const workspacePath = path.join(getClaudeDir(), 'workspaces', workspace);

    // Check if workspace exists
    try {
      await fs.access(workspacePath);
    } catch (err) {
      return res.status(404).json({
        success: false,
        error: 'Workspace not found'
      });
    }

    // In a real implementation, you would update a config file or session state
    // For now, we just return success
    res.json({
      success: true,
      workspace,
      message: `Switched to workspace: ${workspace}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/health - Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
