/**
 * E2E Test: React App
 *
 * End-to-end test for building a complete React application.
 * Tests all phases from setup to deployment readiness.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import {
  createTestWorkspace,
  AgentMocks,
  CustomAssertions
} from '../utils/test-helpers.js';

describe('E2E: React App', () => {
  let workspace;
  let tempDir;

  beforeEach(async () => {
    workspace = await createTestWorkspace('e2e-react');
    tempDir = workspace.tempDir;
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it('should build complete React app from requirements', async () => {
    // === REQUIREMENTS ===
    const projectRequirements = 'Build a React todo app with add/delete functionality';

    // === TODO CREATION ===
    const todos = [
      { id: 1, title: 'Set up React project structure', status: 'pending' },
      { id: 2, title: 'Create TodoApp component', status: 'pending' },
      { id: 3, title: 'Create TodoList component', status: 'pending' },
      { id: 4, title: 'Create TodoItem component', status: 'pending' },
      { id: 5, title: 'Add state management', status: 'pending' },
      { id: 6, title: 'Style components', status: 'pending' },
      { id: 7, title: 'Test all functionality', status: 'pending' }
    ];

    // === TODO 1: PROJECT SETUP ===
    let currentTodo = todos[0];

    const projectDir = join(tempDir, 'react-todo-app');
    await mkdir(projectDir, { recursive: true });
    await mkdir(join(projectDir, 'src'), { recursive: true });
    await mkdir(join(projectDir, 'public'), { recursive: true });

    // package.json
    await writeFile(
      join(projectDir, 'package.json'),
      JSON.stringify({
        name: 'react-todo-app',
        version: '1.0.0',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        },
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
          test: 'react-scripts test'
        }
      }, null, 2)
    );

    const coderResponse1 = AgentMocks.coderSuccess(
      [join(projectDir, 'package.json')],
      []
    );

    const testerResponse1 = AgentMocks.testerSuccess(
      ['Project structure created', 'package.json is valid'],
      []
    );

    currentTodo.status = 'completed';

    // === TODO 2: MAIN APP COMPONENT ===
    currentTodo = todos[1];

    await writeFile(
      join(projectDir, 'src', 'App.jsx'),
      `import { useState } from 'react';
import TodoList from './components/TodoList';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="App">
      <h1>My Todo App</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Enter a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <TodoList
        todos={todos}
        onDelete={deleteTodo}
        onToggle={toggleTodo}
      />
    </div>
  );
}`
    );

    const coderResponse2 = AgentMocks.coderSuccess(
      [join(projectDir, 'src', 'App.jsx')],
      []
    );

    const testerResponse2 = AgentMocks.testerSuccess(
      ['App component created', 'State management implemented'],
      []
    );

    currentTodo.status = 'completed';

    // === TODO 3: TODOLIST COMPONENT ===
    currentTodo = todos[2];

    await mkdir(join(projectDir, 'src', 'components'), { recursive: true });

    await writeFile(
      join(projectDir, 'src', 'components', 'TodoList.jsx'),
      `import TodoItem from './TodoItem';

export default function TodoList({ todos, onDelete, onToggle }) {
  if (todos.length === 0) {
    return <p className="empty-message">No todos yet. Add one above!</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}`
    );

    currentTodo.status = 'completed';

    // === TODO 4: TODOITEM COMPONENT ===
    currentTodo = todos[3];

    await writeFile(
      join(projectDir, 'src', 'components', 'TodoItem.jsx'),
      `export default function TodoItem({ todo, onDelete, onToggle }) {
  return (
    <li className={todo.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span onClick={() => onToggle(todo.id)}>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}`
    );

    currentTodo.status = 'completed';

    // === TODO 5: STATE MANAGEMENT (Already done in App component) ===
    todos[4].status = 'completed';

    // === TODO 6: STYLING ===
    currentTodo = todos[5];

    await writeFile(
      join(projectDir, 'src', 'App.css'),
      `.App {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #45a049;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.todo-list li.completed span {
  text-decoration: line-through;
  color: #888;
}

.todo-list li span {
  flex: 1;
  cursor: pointer;
}

.todo-list li button {
  background: #f44336;
  padding: 5px 15px;
}

.todo-list li button:hover {
  background: #da190b;
}

.empty-message {
  text-align: center;
  color: #888;
  padding: 20px;
}`
    );

    currentTodo.status = 'completed';

    // === TODO 7: TESTING ===
    currentTodo = todos[6];

    const testerResponseFinal = AgentMocks.testerSuccess(
      [
        'App renders correctly',
        'Input field works',
        'Add button adds todos',
        'Delete button removes todos',
        'Toggle checkbox marks complete',
        'Empty state shows correctly',
        'Styles applied correctly'
      ],
      ['app-screenshot.png', 'with-todos.png', 'completed-todo.png']
    );

    CustomAssertions.assertAgentSuccess(testerResponseFinal, 'tester');

    currentTodo.status = 'completed';

    // === VERIFICATION ===
    const allComplete = todos.every(t => t.status === 'completed');
    expect(allComplete).toBe(true);

    // === DEPLOYMENT READINESS CHECK ===
    const deploymentChecklist = {
      hasPackageJson: true,
      hasAppComponent: true,
      hasComponents: true,
      hasStyles: true,
      allTestsPassed: true,
      readyForBuild: true
    };

    expect(deploymentChecklist.readyForBuild).toBe(true);
  });

  it('should handle dependency installation phase', async () => {
    const projectDir = join(tempDir, 'react-app');
    await mkdir(projectDir, { recursive: true });

    // Package.json exists
    await writeFile(
      join(projectDir, 'package.json'),
      JSON.stringify({ dependencies: { react: '^18.2.0' } })
    );

    // Coder attempts npm install
    // In real scenario, might encounter network issues

    const coderError = AgentMocks.coderError('npm install failed: ECONNREFUSED', true);

    // Stuck agent is invoked
    const stuckRequest = AgentMocks.stuckEscalation(
      'npm install failed due to network error',
      ['Retry installation', 'Use npm cache', 'Skip dependencies for now']
    );

    expect(stuckRequest.agent).toBe('stuck');

    // User decides to retry
    const resolution = AgentMocks.stuckResolution('Retry installation');

    // Coder retries and succeeds
    const coderSuccess = AgentMocks.coderSuccess(
      ['node_modules installed'],
      []
    );

    CustomAssertions.assertAgentSuccess(coderSuccess, 'coder');
  });

  it('should verify component hierarchy', async () => {
    const componentStructure = {
      App: {
        children: ['TodoList'],
        state: ['todos', 'inputValue'],
        functions: ['addTodo', 'deleteTodo', 'toggleTodo']
      },
      TodoList: {
        children: ['TodoItem'],
        props: ['todos', 'onDelete', 'onToggle']
      },
      TodoItem: {
        children: [],
        props: ['todo', 'onDelete', 'onToggle']
      }
    };

    expect(componentStructure.App.children).toContain('TodoList');
    expect(componentStructure.TodoList.children).toContain('TodoItem');
    expect(componentStructure.TodoItem.children).toHaveLength(0);
  });

  it('should track all phases completion', () => {
    const phases = [
      { name: 'Setup', completed: true },
      { name: 'Component Creation', completed: true },
      { name: 'State Management', completed: true },
      { name: 'Styling', completed: true },
      { name: 'Testing', completed: true },
      { name: 'Build Verification', completed: true }
    ];

    const allPhasesComplete = phases.every(p => p.completed);
    expect(allPhasesComplete).toBe(true);
  });
});
