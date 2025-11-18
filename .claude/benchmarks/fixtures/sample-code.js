/**
 * Sample code for benchmarking
 */

// Simple function
function add(a, b) {
  return a + b;
}

// Complex function with multiple operations
function processData(data) {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }

  return data
    .filter(item => item.active)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: new Date().toISOString()
    }))
    .sort((a, b) => a.priority - b.priority);
}

// Async function
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Class definition
class DataProcessor {
  constructor(options = {}) {
    this.options = options;
    this.cache = new Map();
  }

  process(data) {
    if (this.cache.has(data.id)) {
      return this.cache.get(data.id);
    }

    const result = this.transform(data);
    this.cache.set(data.id, result);
    return result;
  }

  transform(data) {
    return {
      ...data,
      transformed: true,
      timestamp: Date.now()
    };
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = {
  add,
  processData,
  fetchData,
  DataProcessor
};
