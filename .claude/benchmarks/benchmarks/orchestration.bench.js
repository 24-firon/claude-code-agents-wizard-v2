const { createSuite } = require('../suite');

/**
 * Orchestration System Benchmarks
 */

const suite = createSuite('Orchestration Performance');

/**
 * Todo delegation benchmark
 */
suite.add(
  'Todo Delegation Speed',
  async () => {
    const todos = [
      { id: 1, task: 'Create component', agent: 'coder' },
      { id: 2, task: 'Test component', agent: 'tester' },
      { id: 3, task: 'Research API', agent: 'researcher' },
      { id: 4, task: 'Optimize performance', agent: 'optimizer' },
      { id: 5, task: 'Security audit', agent: 'security' }
    ];

    const delegations = [];

    for (const todo of todos) {
      const startTime = Date.now();

      // Mock delegation process
      await new Promise(resolve => setTimeout(resolve, 5));

      const endTime = Date.now();

      delegations.push({
        todoId: todo.id,
        agent: todo.agent,
        delegationTime: endTime - startTime
      });
    }

    return {
      todosDelegated: todos.length,
      avgDelegationTime: delegations.reduce((sum, d) => sum + d.delegationTime, 0) / delegations.length,
      agents: [...new Set(delegations.map(d => d.agent))].length
    };
  },
  { iterations: 100 }
);

/**
 * Context switching benchmark
 */
suite.add(
  'Context Switching Overhead',
  async () => {
    const contexts = [
      { name: 'orchestrator', size: 50000 },
      { name: 'coder', size: 30000 },
      { name: 'tester', size: 20000 },
      { name: 'researcher', size: 25000 }
    ];

    const switches = [];

    for (let i = 0; i < contexts.length - 1; i++) {
      const from = contexts[i];
      const to = contexts[i + 1];

      const startTime = Date.now();

      // Mock context switch (proportional to context size)
      const delay = Math.floor((from.size + to.size) / 10000);
      await new Promise(resolve => setTimeout(resolve, delay));

      const endTime = Date.now();

      switches.push({
        from: from.name,
        to: to.name,
        switchTime: endTime - startTime,
        contextSize: from.size + to.size
      });
    }

    return {
      contextSwitches: switches.length,
      avgSwitchTime: switches.reduce((sum, s) => sum + s.switchTime, 0) / switches.length,
      totalContextSize: contexts.reduce((sum, c) => sum + c.size, 0)
    };
  },
  { iterations: 50 }
);

/**
 * Multi-agent coordination benchmark
 */
suite.add(
  'Multi-Agent Coordination',
  async () => {
    const workflow = [
      { step: 1, agent: 'coder', duration: 50 },
      { step: 2, agent: 'tester', duration: 30, dependsOn: 1 },
      { step: 3, agent: 'coder', duration: 20, dependsOn: 2 },
      { step: 4, agent: 'tester', duration: 25, dependsOn: 3 },
      { step: 5, agent: 'researcher', duration: 40, dependsOn: 1 }
    ];

    const execution = [];
    const completed = new Set();

    for (const task of workflow) {
      // Wait for dependencies
      if (task.dependsOn && !completed.has(task.dependsOn)) {
        await new Promise(resolve => setTimeout(resolve, 5));
      }

      const startTime = Date.now();

      // Execute task
      await new Promise(resolve => setTimeout(resolve, task.duration));

      const endTime = Date.now();

      execution.push({
        step: task.step,
        agent: task.agent,
        executionTime: endTime - startTime
      });

      completed.add(task.step);
    }

    return {
      totalSteps: workflow.length,
      totalExecutionTime: execution.reduce((sum, e) => sum + e.executionTime, 0),
      parallelOpportunities: workflow.filter(t => !t.dependsOn).length
    };
  },
  { iterations: 30 }
);

/**
 * Workspace switching benchmark
 */
suite.add(
  'Workspace Switching Performance',
  async () => {
    const workspaces = [
      { id: 'ws-1', projects: 5, files: 100 },
      { id: 'ws-2', projects: 3, files: 50 },
      { id: 'ws-3', projects: 8, files: 200 }
    ];

    const switches = [];

    for (const workspace of workspaces) {
      const startTime = Date.now();

      // Mock workspace loading (proportional to content)
      const delay = Math.floor((workspace.projects + workspace.files) / 20);
      await new Promise(resolve => setTimeout(resolve, delay));

      const endTime = Date.now();

      switches.push({
        workspaceId: workspace.id,
        loadTime: endTime - startTime,
        projects: workspace.projects,
        files: workspace.files
      });
    }

    return {
      workspacesSwitched: workspaces.length,
      avgLoadTime: switches.reduce((sum, s) => sum + s.loadTime, 0) / switches.length,
      totalFiles: workspaces.reduce((sum, w) => sum + w.files, 0)
    };
  },
  { iterations: 40 }
);

/**
 * Agent queue management benchmark
 */
suite.add(
  'Agent Queue Management',
  async () => {
    const queue = [];
    const maxConcurrent = 3;

    // Generate tasks
    for (let i = 0; i < 20; i++) {
      queue.push({
        id: i,
        agent: ['coder', 'tester', 'researcher'][i % 3],
        priority: Math.floor(Math.random() * 3)
      });
    }

    const processed = [];
    let active = 0;

    while (queue.length > 0 || active > 0) {
      // Process tasks up to max concurrent
      while (active < maxConcurrent && queue.length > 0) {
        const task = queue.shift();
        active++;

        // Mock task execution
        setTimeout(() => {
          active--;
          processed.push(task);
        }, 5);
      }

      await new Promise(resolve => setTimeout(resolve, 2));
    }

    return {
      totalTasks: processed.length,
      maxConcurrent,
      avgQueueSize: 10 // Mock average queue size
    };
  },
  { iterations: 25 }
);

/**
 * Error propagation benchmark
 */
suite.add(
  'Error Propagation',
  async () => {
    const tasks = [
      { id: 1, willFail: false },
      { id: 2, willFail: true },
      { id: 3, willFail: false },
      { id: 4, willFail: false }
    ];

    const results = [];

    for (const task of tasks) {
      try {
        // Mock task execution
        await new Promise(resolve => setTimeout(resolve, 5));

        if (task.willFail) {
          throw new Error('Task failed');
        }

        results.push({ taskId: task.id, status: 'success' });
      } catch (error) {
        // Mock error handling and propagation
        await new Promise(resolve => setTimeout(resolve, 3));

        results.push({
          taskId: task.id,
          status: 'failed',
          error: error.message,
          propagated: true
        });
      }
    }

    return {
      tasksExecuted: tasks.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      errorsPropagated: results.filter(r => r.propagated).length
    };
  },
  { iterations: 50 }
);

/**
 * State synchronization benchmark
 */
suite.add(
  'State Synchronization',
  async () => {
    const agents = ['orchestrator', 'coder', 'tester', 'researcher'];
    const updates = 50;

    const syncOperations = [];

    for (let i = 0; i < updates; i++) {
      const startTime = Date.now();

      // Mock state update broadcast to all agents
      const broadcasts = agents.map(async (agent) => {
        await new Promise(resolve => setTimeout(resolve, 2));
      });

      await Promise.all(broadcasts);

      const endTime = Date.now();

      syncOperations.push({
        updateId: i,
        syncTime: endTime - startTime,
        agentsSynced: agents.length
      });
    }

    return {
      totalUpdates: updates,
      agents: agents.length,
      avgSyncTime: syncOperations.reduce((sum, s) => sum + s.syncTime, 0) / syncOperations.length
    };
  },
  { iterations: 30 }
);

module.exports = suite.build();
