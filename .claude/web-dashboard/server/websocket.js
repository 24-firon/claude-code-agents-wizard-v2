const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');

/**
 * Initialize WebSocket server and file watchers
 * @param {SocketIO.Server} io - Socket.io server instance
 * @param {Winston.Logger} logger - Winston logger instance
 */
function initializeWebSocket(io, logger) {
  const claudeDir = path.join(__dirname, '../../');

  // Store connected clients
  const clients = new Map();

  // Connection handler
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    clients.set(socket.id, {
      socket,
      connectedAt: new Date(),
      subscriptions: new Set()
    });

    // Send initial connection success
    socket.emit('connected', {
      message: 'Connected to Agent Dashboard',
      timestamp: new Date().toISOString()
    });

    // Handle subscription to specific data streams
    socket.on('subscribe', (data) => {
      const { streams } = data;
      const client = clients.get(socket.id);

      if (client && streams) {
        streams.forEach(stream => {
          client.subscriptions.add(stream);
          logger.info(`Client ${socket.id} subscribed to ${stream}`);
        });

        socket.emit('subscribed', {
          streams: Array.from(client.subscriptions),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle unsubscribe
    socket.on('unsubscribe', (data) => {
      const { streams } = data;
      const client = clients.get(socket.id);

      if (client && streams) {
        streams.forEach(stream => {
          client.subscriptions.delete(stream);
          logger.info(`Client ${socket.id} unsubscribed from ${stream}`);
        });
      }
    });

    // Disconnection handler
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
      clients.delete(socket.id);
    });

    // Error handler
    socket.on('error', (error) => {
      logger.error(`Socket error for client ${socket.id}:`, error);
    });
  });

  // Broadcast helper function
  function broadcast(event, data, stream = null) {
    clients.forEach((client) => {
      if (!stream || client.subscriptions.has(stream)) {
        client.socket.emit(event, data);
      }
    });
  }

  // Watch todos.json files for changes
  const todosWatcher = chokidar.watch(
    path.join(claudeDir, 'persistence/**/todos.json'),
    {
      persistent: true,
      ignoreInitial: true
    }
  );

  todosWatcher.on('change', async (filePath) => {
    try {
      logger.info(`Todos file changed: ${filePath}`);
      const data = await fs.readFile(filePath, 'utf8');
      const todos = JSON.parse(data);

      // Extract workspace name from path
      const pathParts = filePath.split(path.sep);
      const workspace = pathParts[pathParts.length - 2];

      broadcast('todos:updated', {
        workspace,
        todos,
        timestamp: new Date().toISOString()
      }, 'todos');
    } catch (error) {
      logger.error('Error reading todos file:', error);
    }
  });

  // Watch metrics files for changes
  const metricsWatcher = chokidar.watch(
    [
      path.join(claudeDir, 'metrics/sessions/*.json'),
      path.join(claudeDir, 'metrics/daily/*.json'),
      path.join(claudeDir, 'metrics/agents/*.json')
    ],
    {
      persistent: true,
      ignoreInitial: true
    }
  );

  metricsWatcher.on('add', async (filePath) => {
    try {
      logger.info(`New metrics file: ${filePath}`);
      const data = await fs.readFile(filePath, 'utf8');
      const metrics = JSON.parse(data);

      const fileName = path.basename(filePath, '.json');
      const type = filePath.includes('/sessions/')
        ? 'session'
        : filePath.includes('/daily/')
        ? 'daily'
        : 'agent';

      broadcast('metrics:new', {
        type,
        id: fileName,
        metrics,
        timestamp: new Date().toISOString()
      }, 'metrics');
    } catch (error) {
      logger.error('Error reading metrics file:', error);
    }
  });

  metricsWatcher.on('change', async (filePath) => {
    try {
      logger.info(`Metrics file changed: ${filePath}`);
      const data = await fs.readFile(filePath, 'utf8');
      const metrics = JSON.parse(data);

      const fileName = path.basename(filePath, '.json');
      const type = filePath.includes('/sessions/')
        ? 'session'
        : filePath.includes('/daily/')
        ? 'daily'
        : 'agent';

      broadcast('metrics:updated', {
        type,
        id: fileName,
        metrics,
        timestamp: new Date().toISOString()
      }, 'metrics');
    } catch (error) {
      logger.error('Error reading metrics file:', error);
    }
  });

  // Watch workspace changes
  const workspaceWatcher = chokidar.watch(
    path.join(claudeDir, 'workspaces/*/metadata.json'),
    {
      persistent: true,
      ignoreInitial: true
    }
  );

  workspaceWatcher.on('all', async (event, filePath) => {
    try {
      logger.info(`Workspace change detected: ${event} - ${filePath}`);

      const pathParts = filePath.split(path.sep);
      const workspace = pathParts[pathParts.length - 2];

      let metadata = null;
      if (event !== 'unlink') {
        const data = await fs.readFile(filePath, 'utf8');
        metadata = JSON.parse(data);
      }

      broadcast('workspace:changed', {
        event,
        workspace,
        metadata,
        timestamp: new Date().toISOString()
      }, 'workspaces');
    } catch (error) {
      logger.error('Error processing workspace change:', error);
    }
  });

  // Heartbeat to keep connections alive
  setInterval(() => {
    broadcast('heartbeat', {
      timestamp: new Date().toISOString(),
      clients: clients.size
    });
  }, 30000); // Every 30 seconds

  // Cleanup on shutdown
  process.on('SIGTERM', () => {
    todosWatcher.close();
    metricsWatcher.close();
    workspaceWatcher.close();
    logger.info('File watchers closed');
  });

  logger.info('WebSocket initialized with file watchers');
  logger.info(`Watching: ${claudeDir}`);

  return {
    broadcast,
    getClients: () => clients,
    watchers: {
      todos: todosWatcher,
      metrics: metricsWatcher,
      workspace: workspaceWatcher
    }
  };
}

module.exports = { initializeWebSocket };
