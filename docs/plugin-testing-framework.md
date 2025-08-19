# Comprehensive Plugin Testing Framework

This document describes the comprehensive testing framework for plugins in the Discord Bot Plugin System.

## Overview

The testing framework provides a robust set of tools and methodologies to ensure plugin quality, reliability, and compatibility. It includes unit tests, integration tests, and end-to-end tests for plugins.

## Test Structure

Plugins should follow a standardized test structure:

```
plugin-name/
├── plugin.json
├── index.js
├── src/
│   ├── commands/
│   ├── events/
│   ├── routes/
│   └── utils/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── fixtures/
│   ├── mocks/
│   └── helpers/
└── jest.config.js
```

## Testing Libraries

The testing framework uses the following libraries:

1. **Jest**: For unit and integration testing
2. **Puppeteer**: For end-to-end web testing
3. **Supertest**: For API testing
4. **Mocking libraries**: For mocking dependencies

## Unit Testing

Unit tests focus on testing individual functions and components in isolation.

### Example Unit Test

```javascript
// tests/unit/commands/example-command.test.js
const { handleExampleCommand } = require('../../src/commands/example-command');

describe('Example Command', () => {
  test('should reply with correct message', async () => {
    // Mock interaction object
    const interaction = {
      reply: jest.fn().mockResolvedValue()
    };
    
    // Call the command handler
    await handleExampleCommand(interaction);
    
    // Assert the reply was called with correct message
    expect(interaction.reply).toHaveBeenCalledWith('Hello from the example command!');
  });
  
  test('should handle errors gracefully', async () => {
    // Mock interaction object that throws an error
    const interaction = {
      reply: jest.fn().mockRejectedValue(new Error('Test error'))
    };
    
    // Mock console.error to prevent output
    console.error = jest.fn();
    
    // Call the command handler
    await handleExampleCommand(interaction);
    
    // Assert error was logged
    expect(console.error).toHaveBeenCalledWith('Error in example command:', expect.any(Error));
  });
});
```

## Integration Testing

Integration tests verify that different components of a plugin work together correctly.

### Example Integration Test

```javascript
// tests/integration/plugin-init.test.js
const plugin = require('../../index');
const { clearMocks, mockCore } = require('../mocks/core-mock');

describe('Plugin Initialization', () => {
  beforeEach(() => {
    clearMocks();
  });
  
  test('should register commands during initialization', async () => {
    // Initialize the plugin
    await plugin.init(mockCore);
    
    // Assert commands were registered
    expect(mockCore.api.registerCommand).toHaveBeenCalledWith(
      'example',
      'An example command',
      expect.any(Function)
    );
  });
  
  test('should register routes during initialization', async () => {
    // Initialize the plugin
    await plugin.init(mockCore);
    
    // Assert routes were registered
    expect(mockCore.api.registerRoute).toHaveBeenCalledWith(
      '/api/example',
      expect.any(Function)
    );
  });
});
```

## End-to-End Testing

End-to-end tests verify the complete functionality of a plugin in a real environment.

### Example E2E Test for Discord Commands

```javascript
// tests/e2e/discord-commands.test.js
const { Client, Events } = require('discord.js');
const plugin = require('../../index');

// Mock Discord client
jest.mock('discord.js');

describe('Discord Commands E2E', () => {
  let client;
  let mockCore;
  
  beforeEach(() => {
    // Create mock client
    client = new Client({ intents: [] });
    client.login = jest.fn().mockResolvedValue();
    client.on = jest.fn();
    client.once = jest.fn();
    
    // Create mock core
    mockCore = {
      discord: {
        client
      },
      api: {
        registerCommand: jest.fn(),
        commands: new Map()
      }
    };
  });
  
  test('should handle command interactions correctly', async () => {
    // Initialize plugin
    await plugin.init(mockCore);
    
    // Get the registered command handler
    const commandHandler = mockCore.api.commands.get('example');
    expect(commandHandler).toBeDefined();
    
    // Mock interaction
    const interaction = {
      commandName: 'example',
      reply: jest.fn().mockResolvedValue()
    };
    
    // Simulate command interaction
    await commandHandler.handler(interaction);
    
    // Assert reply was sent
    expect(interaction.reply).toHaveBeenCalledWith('Hello from the example command!');
  });
});
```

### Example E2E Test for Web Routes

```javascript
// tests/e2e/web-routes.test.js
const request = require('supertest');
const express = require('express');
const plugin = require('../../index');

describe('Web Routes E2E', () => {
  let app;
  let mockCore;
  
  beforeEach(() => {
    // Create express app for testing
    app = express();
    app.use(express.json());
    
    // Create mock core
    mockCore = {
      api: {
        registerRoute: (path, handler) => {
          app.get(path, handler);
        }
      }
    };
  });
  
  test('should respond to API requests', async () => {
    // Initialize plugin
    await plugin.init(mockCore);
    
    // Test the route
    const response = await request(app)
      .get('/api/example')
      .expect(200);
    
    // Assert response
    expect(response.body).toEqual({ message: 'Hello from the example plugin!' });
  });
});
```

## Mocking Framework

A comprehensive mocking framework for testing plugins in isolation.

### Core API Mocks

```javascript
// tests/mocks/core-mock.js
const { jest } = require('@jest/globals');

// Mock logger
const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock core API
const mockCore = {
  api: {
    registerCommand: jest.fn(),
    registerEvent: jest.fn(),
    registerRoute: jest.fn(),
    registerPage: jest.fn(),
    commands: new Map(),
    events: new Map(),
    routes: new Map(),
    pages: new Map(),
    getLogger: jest.fn().mockReturnValue(mockLogger)
  },
  discord: {
    client: null,
    registerPluginCommand: jest.fn()
  }
};

// Function to clear all mocks
function clearMocks() {
  Object.values(mockCore.api).forEach(method => {
    if (typeof method === 'function' && method.mockClear) {
      method.mockClear();
    }
  });
  
  Object.values(mockLogger).forEach(method => {
    if (typeof method === 'function' && method.mockClear) {
      method.mockClear();
    }
  });
  
  mockCore.api.commands.clear();
  mockCore.api.events.clear();
  mockCore.api.routes.clear();
  mockCore.api.pages.clear();
}

module.exports = {
  mockCore,
  mockLogger,
  clearMocks
};
```

### Discord.js Mocks

```javascript
// tests/mocks/discord-mock.js
const { jest } = require('@jest/globals');

// Mock Discord client
const createMockClient = () => ({
  login: jest.fn().mockResolvedValue(),
  on: jest.fn(),
  once: jest.fn(),
  user: {
    tag: 'TestBot#0000'
  },
  guilds: {
    cache: {
      size: 5
    }
  },
  users: {
    cache: {
      size: 100
    }
  },
  uptime: 3600000
});

// Mock interaction
const createMockInteraction = (overrides = {}) => ({
  commandName: 'test',
  user: {
    username: 'TestUser'
  },
  reply: jest.fn().mockResolvedValue(),
  ...overrides
});

// Mock message
const createMockMessage = (overrides = {}) => ({
  content: 'Test message',
  author: {
    username: 'TestUser'
  },
  channel: {
    send: jest.fn().mockResolvedValue()
  },
  ...overrides
});

module.exports = {
  createMockClient,
  createMockInteraction,
  createMockMessage
};
```

## Test Fixtures

Reusable test data and objects.

### Example Fixtures

```javascript
// tests/fixtures/plugin-manifests.js
const validManifest = {
  name: 'test-plugin',
  version: '1.0.0',
  author: 'Test Author',
  description: 'A test plugin',
  compatibility: {
    core: '>=1.0.0'
  },
  permissions: {
    discord: ['commands'],
    web: ['routes']
  },
  entry: './index.js'
};

const invalidManifest = {
  name: 'test-plugin',
  // Missing version, author, description, entry
  permissions: {
    discord: ['commands']
  }
};

module.exports = {
  validManifest,
  invalidManifest
};
```

## Test Helpers

Utility functions for common testing scenarios.

### Example Helpers

```javascript
// tests/helpers/test-utils.js
const path = require('path');
const fs = require('fs').promises;

// Create a temporary plugin directory for testing
async function createTempPlugin(name, files = {}) {
  const tempDir = path.join(__dirname, '..', 'temp', name);
  await fs.mkdir(tempDir, { recursive: true });
  
  // Write files
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(tempDir, filename);
    await fs.writeFile(filePath, content);
  }
  
  return tempDir;
}

// Remove temporary plugin directory
async function removeTempPlugin(dir) {
  await fs.rm(dir, { recursive: true, force: true });
}

// Wait for a condition to be true
async function waitForCondition(condition, timeout = 5000, interval = 100) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error('Condition not met within timeout');
}

module.exports = {
  createTempPlugin,
  removeTempPlugin,
  waitForCondition
};
```

## Configuration

Jest configuration for plugin testing.

### jest.config.js

```javascript
// jest.config.js
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Root directory
  rootDir: '.',
  
  // Test file patterns
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js',
    '**/tests/e2e/**/*.test.js'
  ],
  
  // Module path ignore patterns
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  
  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks
  clearMocks: true,
  
  // Reset modules
  resetModules: true
};
```

### Test Setup

```javascript
// tests/setup.js
// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Reduce log output during tests

// Mock external dependencies
jest.mock('discord.js');
jest.mock('fs').mockImplementation(() => require('memfs').fs); // Use in-memory filesystem for file operations

// Global test utilities
global.testUtils = require('./helpers/test-utils');

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});
```

## Running Tests

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

## Continuous Integration

Example GitHub Actions workflow for plugin testing.

### .github/workflows/test.yml

```yaml
name: Test Plugin

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on the state from other tests
2. **Mock External Dependencies**: Use mocks for external services like Discord API or databases
3. **Test Edge Cases**: Include tests for error conditions and edge cases
4. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
5. **Keep Tests Fast**: Optimize tests to run quickly to encourage frequent execution
6. **Maintain Test Coverage**: Aim for high test coverage but focus on quality over quantity
7. **Regular Test Execution**: Run tests regularly during development
8. **Automated Testing**: Set up CI/CD pipelines to automatically run tests
9. **Fix Broken Tests Immediately**: Don't let failing tests accumulate
10. **Refactor Tests**: Keep tests maintainable by refactoring when needed

## Performance Testing

For plugins that may have performance-critical components:

```javascript
// tests/performance/command-performance.test.js
const { performance } = require('perf_hooks');
const { handleExampleCommand } = require('../../src/commands/example-command');
const { createMockInteraction } = require('../mocks/discord-mock');

describe('Command Performance', () => {
  test('should execute within acceptable time', async () => {
    const interaction = createMockInteraction();
    
    // Measure execution time
    const start = performance.now();
    await handleExampleCommand(interaction);
    const end = performance.now();
    
    const executionTime = end - start;
    expect(executionTime).toBeLessThan(100); // Should execute in less than 100ms
  });
});
```

## Security Testing

For plugins that handle sensitive data or external inputs:

```javascript
// tests/security/input-validation.test.js
const { handleExampleCommand } = require('../../src/commands/example-command');
const { createMockInteraction } = require('../mocks/discord-mock');

describe('Input Validation', () => {
  test('should handle malicious input safely', async () => {
    const maliciousInput = {
      commandName: 'example',
      options: {
        // Attempt to inject malicious code
        text: '<script>alert("xss")</script>'
      },
      reply: jest.fn().mockResolvedValue()
    };
    
    // Mock console.error to prevent output
    console.error = jest.fn();
    
    // Call the command handler
    await handleExampleCommand(maliciousInput);
    
    // Assert that the malicious input was sanitized
    // This would depend on the implementation of the command handler
    expect(maliciousInput.reply).toHaveBeenCalledWith(
      expect.not.stringContaining('<script>')
    );
  });
});
```

This comprehensive testing framework ensures that plugins are reliable, performant, and secure. By following these guidelines and using the provided tools, plugin developers can create high-quality plugins for the Discord Bot Plugin System.