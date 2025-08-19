# Plugin Testing Guide

This guide provides comprehensive instructions for testing plugins in the Discord Bot Plugin System, ensuring they are reliable, secure, and performant.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Types of Testing](#types-of-testing)
3. [Testing Framework](#testing-framework)
4. [Unit Testing](#unit-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)
9. [Testing Tools](#testing-tools)
10. [Continuous Integration](#continuous-integration)
11. [Test Coverage](#test-coverage)
12. [Best Practices](#best-practices)

## Testing Philosophy

Testing is an integral part of plugin development that ensures quality, reliability, and maintainability. Effective testing involves:

- **Prevention over Detection**: Writing tests helps prevent bugs rather than just detecting them
- **Early and Often**: Test throughout the development process, not just at the end
- **Automation**: Automate tests to run consistently and frequently
- **Comprehensiveness**: Test all critical paths, edge cases, and error conditions
- **Maintainability**: Write tests that are easy to understand and maintain

## Types of Testing

### Unit Testing

Unit tests verify the correctness of individual functions, methods, or components in isolation. They should:

- Test one thing at a time
- Run quickly (milliseconds)
- Not depend on external systems
- Be deterministic (same input always produces same output)

### Integration Testing

Integration tests verify that different parts of your plugin work together correctly, and that your plugin integrates properly with the core system. They should:

- Test interactions between components
- Verify API contracts
- Include external dependencies (when practical)
- Run reasonably quickly (seconds)

### End-to-End Testing

End-to-end tests verify complete user workflows from start to finish. They should:

- Test real user scenarios
- Include the full stack (Discord API, web UI, etc.)
- Run in environments similar to production
- Be more tolerant of longer execution times

### Performance Testing

Performance tests verify that your plugin meets performance requirements under various conditions. They should:

- Measure response times
- Test under load
- Identify bottlenecks
- Validate resource usage

### Security Testing

Security tests verify that your plugin is secure and doesn't introduce vulnerabilities. They should:

- Test for common vulnerabilities
- Validate input sanitization
- Verify access controls
- Check for data leakage

## Testing Framework

The Discord Bot Plugin System uses Jest as the primary testing framework. Jest provides:

- A powerful assertion library
- Built-in mocking capabilities
- Code coverage reporting
- Snapshot testing
- Async testing support

### Test Structure

Tests should be organized in a clear, consistent structure:

```
plugins/
└── my-plugin/
    ├── tests/
    │   ├── unit/
    │   │   ├── commands/
    │   │   ├── utils/
    │   │   └── services/
    │   ├── integration/
    │   │   ├── discord/
    │   │   └── web/
    │   ├── e2e/
    │   │   ├── discord.e2e.test.js
    │   │   └── web.e2e.test.js
    │   ├── performance/
    │   │   └── performance.test.js
    │   └── security/
    │       └── security.test.js
    └── jest.config.js
```

### Configuration

Create a `jest.config.js` file in your plugin directory:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'index.js',
    'discord/**/*.js',
    'web/**/*.js',
    'utils/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

## Unit Testing

Unit tests focus on testing individual functions and components in isolation.

### Testing Functions

```javascript
// utils/calculator.js
function add(a, b) {
  return a + b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

module.exports = { add, divide };

// tests/unit/utils/calculator.test.js
const { add, divide } = require('../../../utils/calculator');

describe('Calculator', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    test('should add mixed positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });
  });

  describe('divide', () => {
    test('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });
});
```

### Testing with Mocks

Use mocks to isolate the code under test from external dependencies:

```javascript
// discord/commands/weather.js
const weatherApi = require('../../utils/weatherApi');

async function handleWeatherCommand(interaction) {
  const location = interaction.options.getString('location');
  try {
    const weather = await weatherApi.getWeather(location);
    await interaction.reply(`The weather in ${location} is ${weather.description}`);
  } catch (error) {
    await interaction.reply({ 
      content: 'Sorry, I couldn't get the weather information.', 
      ephemeral: true 
    });
  }
}

module.exports = { handleWeatherCommand };

// tests/unit/discord/commands/weather.test.js
const { handleWeatherCommand } = require('../../../../discord/commands/weather');

// Mock the weather API
jest.mock('../../../../utils/weatherApi', () => ({
  getWeather: jest.fn()
}));

const weatherApi = require('../../../../utils/weatherApi');

describe('Weather Command', () => {
  let mockInteraction;

  beforeEach(() => {
    mockInteraction = {
      options: {
        getString: jest.fn().mockReturnValue('London')
      },
      reply: jest.fn()
    };
  });

  test('should reply with weather information', async () => {
    weatherApi.getWeather.mockResolvedValue({ description: 'sunny' });
    
    await handleWeatherCommand(mockInteraction);
    
    expect(mockInteraction.reply).toHaveBeenCalledWith('The weather in London is sunny');
  });

  test('should handle API errors gracefully', async () => {
    weatherApi.getWeather.mockRejectedValue(new Error('API error'));
    
    await handleWeatherCommand(mockInteraction);
    
    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: 'Sorry, I couldn't get the weather information.',
      ephemeral: true
    });
  });
});
```

### Testing Async Functions

Test asynchronous functions properly:

```javascript
// utils/dataFetcher.js
async function fetchUserData(userId) {
  // Simulate API call
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}

module.exports = { fetchUserData };

// tests/unit/utils/dataFetcher.test.js
const { fetchUserData } = require('../../../utils/dataFetcher');

// Mock fetch
global.fetch = jest.fn();

describe('Data Fetcher', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should fetch user data successfully', async () => {
    const mockUser = { id: '123', name: 'John Doe' };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockUser)
    });

    const user = await fetchUserData('123');
    
    expect(user).toEqual(mockUser);
    expect(fetch).toHaveBeenCalledWith('/api/users/123');
  });

  test('should throw error for non-existent user', async () => {
    fetch.mockResolvedValue({
      ok: false
    });

    await expect(fetchUserData('999')).rejects.toThrow('User not found');
  });
});
```

## Integration Testing

Integration tests verify that different parts of your plugin work together correctly.

### Testing Plugin Initialization

```javascript
// tests/integration/plugin.test.js
const plugin = require('../../index');

describe('Plugin Integration', () => {
  test('should initialize without errors', async () => {
    const mockCore = {
      api: {
        registerCommand: jest.fn(),
        registerEvent: jest.fn(),
        registerRoute: jest.fn(),
        getLogger: () => ({
          info: jest.fn(),
          error: jest.fn()
        })
      }
    };

    await expect(plugin.init(mockCore)).resolves.toBeUndefined();
    
    // Verify that commands were registered
    expect(mockCore.api.registerCommand).toHaveBeenCalledWith(
      'weather',
      expect.any(String),
      expect.any(Function)
    );
  });

  test('should clean up resources on destroy', async () => {
    // Initialize plugin
    const mockCore = {
      api: {
        registerCommand: jest.fn(),
        getLogger: () => ({ info: jest.fn() })
      }
    };
    
    await plugin.init(mockCore);
    
    // Test destroy function
    await expect(plugin.destroy()).resolves.toBeUndefined();
  });
});
```

### Testing Discord Integration

```javascript
// tests/integration/discord.test.js
describe('Discord Integration', () => {
  test('should register Discord commands correctly', async () => {
    const registeredCommands = [];
    
    const mockCore = {
      api: {
        registerCommand: (name, description, handler) => {
          registeredCommands.push({ name, description, handler });
        },
        getLogger: () => ({ info: jest.fn() })
      }
    };

    await plugin.init(mockCore);
    
    expect(registeredCommands).toContainEqual({
      name: 'weather',
      description: 'Get current weather for a location',
      handler: expect.any(Function)
    });
  });

  test('should register Discord events correctly', async () => {
    const registeredEvents = [];
    
    const mockCore = {
      api: {
        registerEvent: (event, handler) => {
          registeredEvents.push({ event, handler });
        },
        getLogger: () => ({ info: jest.fn() })
      }
    };

    await plugin.init(mockCore);
    
    expect(registeredEvents).toContainEqual({
      event: 'messageCreate',
      handler: expect.any(Function)
    });
  });
});
```

### Testing Web Integration

```javascript
// tests/integration/web.test.js
describe('Web Integration', () => {
  test('should register web routes correctly', async () => {
    const registeredRoutes = [];
    
    const mockCore = {
      api: {
        registerRoute: (path, handler) => {
          registeredRoutes.push({ path, handler });
        },
        getLogger: () => ({ info: jest.fn() })
      }
    };

    await plugin.init(mockCore);
    
    expect(registeredRoutes).toContainEqual({
      path: '/api/weather',
      handler: expect.any(Function)
    });
  });

  test('should register web pages correctly', async () => {
    const registeredPages = [];
    
    const mockCore = {
      api: {
        registerPage: (path, component) => {
          registeredPages.push({ path, component });
        },
        getLogger: () => ({ info: jest.fn() })
      }
    };

    await plugin.init(mockCore);
    
    expect(registeredPages).toContainEqual({
      path: '/weather',
      component: expect.any(Function)
    });
  });
});
```

## End-to-End Testing

End-to-end tests verify complete user workflows.

### Testing Discord Commands

```javascript
// tests/e2e/discord.e2e.test.js
describe('Discord Commands E2E', () => {
  // Note: These tests would require a test Discord server and bot
  // This is a simplified example of what such tests might look like
  
  test('should respond to weather command', async () => {
    // This would involve:
    // 1. Sending a command to the test bot
    // 2. Waiting for the response
    // 3. Verifying the response content
    
    // Example (pseudocode):
    // const response = await sendDiscordCommand('/weather London');
    // expect(response.content).toContain('The weather in London');
  }, 10000); // Longer timeout for E2E tests

  test('should handle invalid locations gracefully', async () => {
    // Example (pseudocode):
    // const response = await sendDiscordCommand('/weather InvalidLocation');
    // expect(response.content).toContain('Sorry, I couldn't find that location');
  }, 10000);
});
```

### Testing Web UI

```javascript
// tests/e2e/web.e2e.test.js
describe('Web UI E2E', () => {
  // Note: These tests would require a running instance of the web server
  // and a tool like Puppeteer or Playwright for browser automation
  
  test('should display weather dashboard', async () => {
    // This would involve:
    // 1. Navigating to the weather page
    // 2. Verifying page elements are present
    // 3. Checking that data is displayed correctly
    
    // Example (pseudocode):
    // await page.goto('http://localhost:3000/weather');
    // await expect(page).toMatch('Weather Dashboard');
  }, 15000); // Longer timeout for E2E tests

  test('should allow location search', async () => {
    // Example (pseudocode):
    // await page.type('#location-input', 'London');
    // await page.click('#search-button');
    // await expect(page).toMatch('Weather for London');
  }, 15000);
});
```

## Performance Testing

Performance tests verify that your plugin meets performance requirements.

### Load Testing

```javascript
// tests/performance/performance.test.js
describe('Performance', () => {
  test('should handle concurrent requests', async () => {
    const concurrentRequests = 100;
    const promises = [];
    
    // Measure response time
    const startTime = Date.now();
    
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(plugin.handleRequest({ location: 'London' }));
    }
    
    await Promise.all(promises);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / concurrentRequests;
    
    // Assert performance requirements
    expect(averageTime).toBeLessThan(100); // Average response time < 100ms
  }, 30000); // Longer timeout for performance tests

  test('should not exceed memory limits', async () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Perform operations that might use memory
    for (let i = 0; i < 1000; i++) {
      await plugin.processData({ id: i });
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryGrowth = finalMemory - initialMemory;
    
    // Assert memory usage is reasonable
    expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // < 50MB growth
  });
});
```

### Benchmarking

```javascript
// tests/performance/benchmark.test.js
const Benchmark = require('benchmark');

describe('Benchmark', () => {
  test('should benchmark critical functions', () => {
    const suite = new Benchmark.Suite();
    
    suite
      .add('Weather API Call', {
        defer: true,
        fn: async (deferred) => {
          await plugin.getWeather('London');
          deferred.resolve();
        }
      })
      .add('Data Processing', () => {
        plugin.processData({ temperature: 20, humidity: 65 });
      })
      .on('cycle', (event) => {
        console.log(String(event.target));
      })
      .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
      })
      .run({ async: true });
  }, 60000); // Longer timeout for benchmarking
});
```

## Security Testing

Security tests verify that your plugin is secure.

### Input Validation Testing

```javascript
// tests/security/security.test.js
describe('Security', () => {
  test('should sanitize user input', async () => {
    const maliciousInput = '<script>alert("xss")</script>';
    
    const result = plugin.sanitizeInput(maliciousInput);
    
    // Ensure malicious content is removed or escaped
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  test('should prevent SQL injection', async () => {
    const sqlInjection = "'; DROP TABLE users; --";
    
    // This would test that your database queries are properly parameterized
    // and don't allow SQL injection
    const query = plugin.buildQuery(sqlInjection);
    expect(query).toBeSafeFromSQLInjection();
  });

  test('should validate API keys', async () => {
    const invalidApiKey = 'invalid-key-123';
    
    await expect(plugin.validateApiKey(invalidApiKey))
      .rejects.toThrow('Invalid API key');
  });
});
```

### Authentication Testing

```javascript
// tests/security/auth.test.js
describe('Authentication', () => {
  test('should reject unauthorized access', async () => {
    const unauthorizedRequest = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    };
    
    await expect(plugin.handleProtectedRoute(unauthorizedRequest))
      .rejects.toThrow('Unauthorized');
  });

  test('should allow authorized access', async () => {
    const validToken = await plugin.generateToken({ userId: '123' });
    const authorizedRequest = {
      headers: {
        authorization: `Bearer ${validToken}`
      }
    };
    
    await expect(plugin.handleProtectedRoute(authorizedRequest))
      .resolves.not.toThrow();
  });
});
```

## Testing Tools

### Mocking Libraries

Jest provides built-in mocking capabilities:

```javascript
// Mocking modules
jest.mock('../utils/api');

// Mocking specific functions
const api = require('../utils/api');
api.getData.mockResolvedValue({ id: 1, name: 'Test' });

// Mocking timers
jest.useFakeTimers();
jest.advanceTimersByTime(1000);
```

### Test Data Factories

Create factories for generating test data:

```javascript
// tests/factories/userFactory.js
function createUser(overrides = {}) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    username: 'testuser',
    email: 'test@example.com',
    ...overrides
  };
}

module.exports = { createUser };

// Usage in tests
const { createUser } = require('../factories/userFactory');

test('should process user data', async () => {
  const user = createUser({ username: 'john_doe' });
  // Test with the generated user
});
```

### Test Utilities

Create utility functions for common testing tasks:

```javascript
// tests/utils/testHelpers.js
async function waitForCondition(conditionFn, timeout = 5000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await conditionFn()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error('Condition not met within timeout');
}

module.exports = { waitForCondition };
```

## Continuous Integration

Set up continuous integration to automatically run tests:

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Check coverage
        run: npm run test:coverage
```

### Test Scripts

Add test scripts to package.json:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration"
  }
}
```

## Test Coverage

Aim for comprehensive test coverage:

### Coverage Thresholds

Set coverage thresholds in jest.config.js:

```javascript
module.exports = {
  // ... other config
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Coverage Reports

Generate and review coverage reports:

```bash
npm run test:coverage
```

This will generate both text and HTML coverage reports in the `coverage/` directory.

## Best Practices

### Write Tests First

Follow Test-Driven Development (TDD) principles when possible:

1. Write a failing test
2. Write the minimum code to make the test pass
3. Refactor the code while keeping tests passing

### Keep Tests Independent

Each test should be able to run independently of others:

```javascript
// Good: Independent tests
beforeEach(() => {
  // Reset state before each test
  mockApi.reset();
});

test('should handle success case', () => {
  // Test implementation
});

test('should handle error case', () => {
  // This test doesn't depend on the previous test
  // Test implementation
});

// Bad: Dependent tests
let result;

test('should process data', () => {
  result = processData(input);
});

test('should use processed data', () => {
  // This test depends on the previous test
  expect(result).toBeDefined();
});
```

### Use Descriptive Test Names

Write clear, descriptive test names that explain what is being tested:

```javascript
// Good: Descriptive test names
test('should return user data when valid ID is provided', () => {
  // Test implementation
});

test('should throw error when invalid ID is provided', () => {
  // Test implementation
});

// Bad: Unclear test names
test('test 1', () => {
  // Test implementation
});

test('test user function', () => {
  // Test implementation
});
```

### Test Edge Cases

Don't just test the happy path - test edge cases and error conditions:

```javascript
describe('divide function', () => {
  test('should divide positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('should divide negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  test('should divide by decimal numbers', () => {
    expect(divide(10, 0.5)).toBe(20);
  });

  test('should throw error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });

  test('should handle very large numbers', () => {
    expect(divide(Number.MAX_SAFE_INTEGER, 2)).toBe(Number.MAX_SAFE_INTEGER / 2);
  });

  test('should handle very small numbers', () => {
    expect(divide(1, Number.MAX_SAFE_INTEGER)).toBeCloseTo(0);
  });
});
```

### Avoid Implementation Details

Test behavior, not implementation details:

```javascript
// Good: Testing behavior
test('should send welcome message to new user', async () => {
  const user = createUser();
  await sendWelcomeMessage(user);
  
  expect(messageService.send).toHaveBeenCalledWith(
    user.id,
    expect.stringContaining('Welcome')
  );
});

// Bad: Testing implementation details
test('should call private method with correct parameters', () => {
  const user = createUser();
  plugin._sendWelcomeMessage(user);
  
  expect(plugin._formatWelcomeMessage).toHaveBeenCalledWith(user);
});
```

### Keep Tests Fast

Write tests that run quickly to maintain a fast feedback loop:

```javascript
// Good: Fast tests
test('should validate email format', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid-email')).toBe(false);
});

// Bad: Slow tests
test('should fetch and validate real email', async () => {
  // This would make a real API call
  const isValid = await validateRealEmail('test@example.com');
  expect(isValid).toBe(true);
}, 10000); // Long timeout indicates slow test
```

By following this comprehensive testing guide, you can ensure that your plugins are reliable, secure, and performant. Remember that testing is an ongoing process, and you should continuously improve your tests as your plugin evolves.