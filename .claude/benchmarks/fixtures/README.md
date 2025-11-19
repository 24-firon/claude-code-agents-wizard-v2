# Benchmark Fixtures

This directory contains test fixtures and sample data used by benchmarks.

## Directory Structure

- **sample-code.js** - Sample JavaScript code for testing coder agent benchmarks
- **temp-workspace/** - Temporary workspace created during benchmarks (auto-cleaned)
- **temp-persistence/** - Temporary storage for persistence benchmarks (auto-cleaned)

## Usage

Fixtures are automatically loaded by benchmark suites. Temporary directories are created during setup and cleaned during teardown.

## Adding New Fixtures

To add new fixtures:

1. Create your fixture file in this directory
2. Reference it in your benchmark suite
3. Ensure proper cleanup in teardown hooks
