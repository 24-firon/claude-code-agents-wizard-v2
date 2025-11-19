const { createSuite } = require('../suite');
const fs = require('fs').promises;
const path = require('path');

/**
 * Coder Agent Benchmarks
 */

const suite = createSuite('Coder Agent Performance');

// Setup: Create temporary workspace
suite.setup(async () => {
  const workspaceDir = path.join(__dirname, '../fixtures/temp-workspace');
  await fs.mkdir(workspaceDir, { recursive: true });
  global.testWorkspace = workspaceDir;
});

// Teardown: Clean up temporary workspace
suite.teardown(async () => {
  if (global.testWorkspace) {
    await fs.rm(global.testWorkspace, { recursive: true, force: true });
  }
});

/**
 * Simple component creation benchmark
 */
suite.add(
  'Simple React Component Creation',
  async () => {
    const componentCode = `
import React from 'react';

const SimpleButton = ({ label, onClick }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

export default SimpleButton;
`;

    const filePath = path.join(global.testWorkspace, `SimpleButton-${Date.now()}.jsx`);
    await fs.writeFile(filePath, componentCode);

    // Simulate code analysis
    const lines = componentCode.split('\n').length;
    const chars = componentCode.length;

    return { lines, chars };
  },
  { iterations: 50 }
);

/**
 * Complex refactoring benchmark
 */
suite.add(
  'Complex Component Refactoring',
  async () => {
    const originalCode = `
class ComplexComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, items: [] };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const response = await fetch('/api/items');
    const items = await response.json();
    this.setState({ items });
  };

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <h1>Count: {this.state.count}</h1>
        <button onClick={this.handleClick}>Increment</button>
        <ul>
          {this.state.items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}
`;

    // Simulate refactoring to hooks
    const refactoredCode = `
import React, { useState, useEffect } from 'react';

const ComplexComponent = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/items');
      const items = await response.json();
      setItems(items);
    };
    fetchData();
  }, []);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>Increment</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ComplexComponent;
`;

    const filePath = path.join(global.testWorkspace, `RefactoredComponent-${Date.now()}.jsx`);
    await fs.writeFile(filePath, refactoredCode);

    return {
      originalLines: originalCode.split('\n').length,
      refactoredLines: refactoredCode.split('\n').length
    };
  },
  { iterations: 30 }
);

/**
 * Multi-file changes benchmark
 */
suite.add(
  'Multi-File Changes',
  async () => {
    const files = [
      { name: 'component.jsx', size: 500 },
      { name: 'styles.css', size: 300 },
      { name: 'test.spec.js', size: 400 },
      { name: 'index.js', size: 100 }
    ];

    const writes = files.map(async (file) => {
      const content = 'x'.repeat(file.size);
      const filePath = path.join(global.testWorkspace, `${Date.now()}-${file.name}`);
      await fs.writeFile(filePath, content);
    });

    await Promise.all(writes);

    return { filesCreated: files.length };
  },
  { iterations: 40 }
);

/**
 * Large codebase navigation benchmark
 */
suite.add(
  'Large Codebase Navigation',
  async () => {
    // Simulate navigating through file structure
    const fileTree = [];
    const dirs = 10;
    const filesPerDir = 20;

    for (let i = 0; i < dirs; i++) {
      const dirPath = path.join(global.testWorkspace, `dir-${i}`);
      await fs.mkdir(dirPath, { recursive: true });

      for (let j = 0; j < filesPerDir; j++) {
        const filePath = path.join(dirPath, `file-${j}.js`);
        await fs.writeFile(filePath, `// File ${i}-${j}\n`);
        fileTree.push(filePath);
      }
    }

    // Simulate searching through files
    const searches = fileTree.slice(0, 50).map(async (filePath) => {
      const content = await fs.readFile(filePath, 'utf8');
      return content.includes('File');
    });

    const results = await Promise.all(searches);

    return {
      totalFiles: fileTree.length,
      searched: results.length,
      found: results.filter(Boolean).length
    };
  },
  { iterations: 10 }
);

/**
 * Error recovery benchmark
 */
suite.add(
  'Error Recovery',
  async () => {
    const errors = [];

    // Simulate various error scenarios
    try {
      await fs.readFile('/nonexistent/file.js');
    } catch (err) {
      errors.push({ type: 'FileNotFound', recovered: true });
    }

    try {
      JSON.parse('invalid json');
    } catch (err) {
      errors.push({ type: 'ParseError', recovered: true });
    }

    // Simulate recovery
    const recoveryTime = errors.length * 10; // Mock recovery time

    return {
      errorsHandled: errors.length,
      recoveryTime
    };
  },
  { iterations: 100 }
);

/**
 * Code analysis benchmark
 */
suite.add(
  'Code Analysis',
  async () => {
    const code = `
function complexFunction(data) {
  if (data.length === 0) return null;

  const result = data
    .filter(item => item.active)
    .map(item => ({
      id: item.id,
      name: item.name,
      value: item.value * 2
    }))
    .reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

  return result;
}
`;

    // Simulate code analysis
    const metrics = {
      lines: code.split('\n').length,
      functions: (code.match(/function/g) || []).length,
      variables: (code.match(/const|let|var/g) || []).length,
      complexity: 5 // Mock cyclomatic complexity
    };

    return metrics;
  },
  { iterations: 100 }
);

module.exports = suite.build();
