/**
 * Benchmark suite definition and builder
 */
class BenchmarkSuite {
  constructor(name, options = {}) {
    this.name = name;
    this.benchmarks = [];
    this.setupFn = null;
    this.teardownFn = null;
    this.options = options;
  }

  /**
   * Add a benchmark to the suite
   */
  add(name, fn, options = {}) {
    this.benchmarks.push({
      name,
      fn,
      options,
      skip: options.skip || false,
      before: options.before,
      after: options.after
    });
    return this;
  }

  /**
   * Add a parameterized benchmark
   */
  addParameterized(name, fn, parameters, options = {}) {
    parameters.forEach(param => {
      const paramName = typeof param === 'object'
        ? `${name} (${JSON.stringify(param)})`
        : `${name} (${param})`;

      this.add(
        paramName,
        async (context) => fn({ ...context, param }),
        options
      );
    });
    return this;
  }

  /**
   * Add multiple benchmarks in a group
   */
  addGroup(groupName, benchmarks) {
    benchmarks.forEach(({ name, fn, options }) => {
      this.add(`${groupName}: ${name}`, fn, options);
    });
    return this;
  }

  /**
   * Set setup function (runs before all benchmarks)
   */
  setup(fn) {
    this.setupFn = fn;
    return this;
  }

  /**
   * Set teardown function (runs after all benchmarks)
   */
  teardown(fn) {
    this.teardownFn = fn;
    return this;
  }

  /**
   * Build the suite for the runner
   */
  build() {
    return {
      name: this.name,
      benchmarks: this.benchmarks,
      setup: this.setupFn,
      teardown: this.teardownFn,
      options: this.options
    };
  }

  /**
   * Skip a specific benchmark
   */
  skip(name) {
    const benchmark = this.benchmarks.find(b => b.name === name);
    if (benchmark) {
      benchmark.skip = true;
    }
    return this;
  }

  /**
   * Only run specific benchmarks
   */
  only(names) {
    const nameSet = new Set(Array.isArray(names) ? names : [names]);
    this.benchmarks.forEach(b => {
      b.skip = !nameSet.has(b.name);
    });
    return this;
  }
}

/**
 * Create a new benchmark suite
 */
function createSuite(name, options) {
  return new BenchmarkSuite(name, options);
}

/**
 * Helper to create a benchmark function with async setup/teardown
 */
function benchmark(name, fn, options = {}) {
  return { name, fn, options };
}

module.exports = {
  BenchmarkSuite,
  createSuite,
  benchmark
};
