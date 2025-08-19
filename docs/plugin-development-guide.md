# Comprehensive Plugin Development Guide

This guide provides detailed instructions for creating plugins for the Discord Bot Plugin System. It covers everything from basic plugin structure to advanced features and best practices.

## Table of Contents

1. [Understanding Plugins](#understanding-plugins)
2. [Plugin Structure](#plugin-structure)
3. [Plugin Manifest](#plugin-manifest)
4. [Plugin Entry Point](#plugin-entry-point)
5. [Discord Integration](#discord-integration)
6. [Web UI Integration](#web-ui-integration)
7. [Data Storage](#data-storage)
8. [Configuration](#configuration)
9. [Logging](#logging)
10. [Error Handling](#error-handling)
11. [Dependencies](#dependencies)
12. [Scheduling](#scheduling)
13. [Events and Notifications](#events-and-notifications)
14. [Security Considerations](#security-considerations)
15. [Testing Plugins](#testing-plugins)
16. [Publishing Plugins](#publishing-plugins)
17. [Best Practices](#best-practices)
18. [Troubleshooting](#troubleshooting)

## Understanding Plugins

Plugins are the fundamental building blocks of the Discord Bot Plugin System. They allow you to extend the functionality of the bot without modifying the core system. Each plugin is a self-contained module that can:

- Add new Discord commands
- Respond to Discord events
- Provide web routes and pages
- Store and retrieve data
- Schedule tasks
- Communicate with other plugins

Plugins are loaded dynamically at runtime and can be enabled, disabled, or removed without restarting the core system.

## Plugin Structure

A well-structured plugin follows this directory layout:

```
my-plugin/
├── plugin.json          # Plugin manifest
├── index.js             # Entry point
├── config/              # Configuration files
├── data/                # Data storage
├── discord/             # Discord-related code
│   ├── commands/        # Command handlers
│   ├── events/          # Event handlers
│   └── services/        # Service modules
├── web/                 # Web-related code
│   ├── pages/           # Web page components
│   ├── routes/          # API route handlers
│   └── components/      # Reusable UI components
├── utils/               # Utility functions
├── tests/               # Test files
├── README.md            # Plugin documentation
└── LICENSE              # License information
```

Not all directories are required. You can structure your plugin as needed, but following this pattern helps maintain consistency.

## Plugin Manifest

The `plugin.json` file is required for every plugin. It contains metadata about the plugin and is used by the system to load and manage it.

### Required Fields

```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A plugin that does awesome things",
  "entry": "./index.js"
}
```

### Optional Fields

```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A plugin that does awesome things",
  "entry": "./index.js",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": ["other-plugin"],
  "config": {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "API key for external service"
    }
  }
}
```

### Field Descriptions

- `name`: Unique identifier for the plugin (required)
- `version`: Semantic version of the plugin (required)
- `author`: Name of the plugin author (required)
- `description`: Brief description of what the plugin does (required)
- `entry`: Path to the plugin's entry point file (required)
- `compatibility`: Compatibility requirements with the core system
- `permissions`: Permissions required by the plugin
- `dependencies`: List of other plugins this plugin depends on
- `config`: Configuration schema for the plugin

## Plugin Entry Point

The entry point file (usually `index.js`) is the main file that the system loads when initializing your plugin. It must export an object with two functions:

### Initialization Function

```javascript
async function init(core) {
  // Plugin initialization code
  // Register commands, events, routes, etc.
}
```

### Cleanup Function

```javascript
async function destroy() {
  // Cleanup code
  // Close connections, clear timers, etc.
}
```

### Complete Example

```javascript
// index.js
module.exports = {
  async init(core) {
    const logger = core.api.getLogger('my-plugin');
    logger.info('Initializing my-plugin');
    
    // Register Discord commands
    core.api.registerCommand('hello', 'Say hello', async (interaction) => {
      await interaction.reply('Hello, world!');
    });
    
    // Register web routes
    core.api.registerRoute('/api/hello', (req, res) => {
      res.json({ message: 'Hello from my-plugin!' });
    });
    
    logger.info('my-plugin initialized successfully');
  },
  
  async destroy() {
    console.log('my-plugin destroyed');
  }
};
```

## Discord Integration

Plugins can interact with Discord through the core API, which provides methods for registering commands and events.

### Registering Commands

```javascript
core.api.registerCommand('command-name', 'Command description', async (interaction) => {
  // Handle the command
  await interaction.reply('Command response');
});
```

### Registering Events

```javascript
core.api.registerEvent('messageCreate', (message) => {
  // Handle the event
  console.log(`New message: ${message.content}`);
});
```

### Advanced Command Features

#### Command Options

```javascript
core.api.registerCommand('greet', 'Greet a user', async (interaction) => {
  const user = interaction.options.getUser('user');
  await interaction.reply(`Hello, ${user.username}!`);
}, {
  options: [
    {
      name: 'user',
      description: 'The user to greet',
      type: 'USER',
      required: true
    }
  ]
});
```

#### Subcommands

```javascript
core.api.registerCommand('mod', 'Moderation commands', async (interaction) => {
  const subcommand = interaction.options.getSubcommand();
  
  switch (subcommand) {
    case 'ban':
      // Handle ban
      break;
    case 'kick':
      // Handle kick
      break;
  }
}, {
  options: [
    {
      name: 'ban',
      description: 'Ban a user',
      type: 'SUBCOMMAND',
      options: [
        {
          name: 'user',
          description: 'The user to ban',
          type: 'USER',
          required: true
        }
      ]
    },
    {
      name: 'kick',
      description: 'Kick a user',
      type: 'SUBCOMMAND',
      options: [
        {
          name: 'user',
          description: 'The user to kick',
          type: 'USER',
          required: true
        }
      ]
    }
  ]
});
```

## Web UI Integration

Plugins can extend the web interface by registering routes and pages.

### Registering Routes

```javascript
core.api.registerRoute('/api/my-plugin/data', (req, res) => {
  // Handle API request
  res.json({ data: 'Some data' });
});
```

### Registering Pages

```javascript
// web/pages/MyPage.js
import React from 'react';

export default function MyPage() {
  return (
    <div>
      <h1>My Plugin Page</h1>
      <p>This is a page from my plugin.</p>
    </div>
  );
}

// In the plugin's index.js
const MyPage = require('./web/pages/MyPage');
core.api.registerPage('/my-plugin', MyPage);
```

### Advanced Web Features

#### Middleware

```javascript
core.api.registerRoute('/api/my-plugin/protected', (req, res) => {
  // This route will only be accessible to authenticated users
  res.json({ message: 'Protected data' });
}, {
  middleware: ['auth']
});
```

#### Custom CSS

```javascript
core.api.registerRoute('/api/my-plugin/styles', (req, res) => {
  res.send(`
    <style>
      .my-plugin-widget {
        background: #4f46e5;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
      }
    </style>
    <div class="my-plugin-widget">
      <h2>My Plugin Widget</h2>
      <p>This widget is styled by my plugin.</p>
    </div>
  `);
});
```

## Data Storage

Plugins can store data using the core's data storage system.

### Simple Key-Value Storage

```javascript
// Store data
await core.api.setData('my-plugin', 'key', 'value');

// Retrieve data
const value = await core.api.getData('my-plugin', 'key');

// Delete data
await core.api.deleteData('my-plugin', 'key');
```

### Complex Data Structures

```javascript
// Store an object
const userData = {
  id: '123',
  preferences: {
    theme: 'dark',
    notifications: true
  }
};
await core.api.setData('my-plugin', 'user-123', userData);

// Retrieve and modify
const user = await core.api.getData('my-plugin', 'user-123');
user.preferences.theme = 'light';
await core.api.setData('my-plugin', 'user-123', user);
```

### Data Persistence

All data stored through the API is automatically persisted to disk and will survive system restarts.

## Configuration

Plugins can define configuration options that users can set through the web interface.

### Defining Configuration Schema

In `plugin.json`:

```json
{
  "name": "weather-plugin",
  "version": "1.0.0",
  "author": "Weather Dev",
  "description": "Provides weather information",
  "entry": "./index.js",
  "config": {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "API key for weather service"
    },
    "units": {
      "type": "string",
      "required": false,
      "default": "metric",
      "description": "Temperature units (metric or imperial)"
    }
  }
}
```

### Accessing Configuration

```javascript
async function init(core) {
  // Get configuration values
  const apiKey = await core.api.getConfig('weather-plugin', 'apiKey');
  const units = await core.api.getConfig('weather-plugin', 'units') || 'metric';
  
  // Use configuration in your plugin
  core.api.registerCommand('weather', 'Get weather information', async (interaction) => {
    const location = interaction.options.getString('location');
    const weather = await getWeather(apiKey, location, units);
    await interaction.reply(weather);
  });
}
```

### Updating Configuration

Users can update configuration through the web interface. Plugins can also update their own configuration programmatically:

```javascript
await core.api.setConfig('weather-plugin', 'units', 'imperial');
```

## Logging

The system provides a centralized logging system that all plugins can use.

### Getting a Logger

```javascript
const logger = core.api.getLogger('my-plugin');
```

### Logging Messages

```javascript
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### Structured Logging

```javascript
logger.info('User action', {
  userId: '123',
  action: 'command_used',
  command: 'hello'
});
```

### Log Levels

The system supports the following log levels:

1. `DEBUG`: Detailed debug information
2. `INFO`: General information about plugin operations
3. `WARN`: Warning messages about potential issues
4. `ERROR`: Error messages about failures

The log level can be configured through the `LOG_LEVEL` environment variable.

## Error Handling

Proper error handling is crucial for plugin reliability.

### Handling Asynchronous Errors

```javascript
core.api.registerCommand('risky-command', 'A command that might fail', async (interaction) => {
  try {
    const result = await riskyOperation();
    await interaction.reply(`Success: ${result}`);
  } catch (error) {
    logger.error('Command failed', { error: error.message });
    await interaction.reply({ 
      content: 'Sorry, something went wrong!', 
      ephemeral: true 
    });
  }
});
```

### Graceful Degradation

```javascript
async function init(core) {
  try {
    await initializeExternalService();
    // Register features that depend on external service
  } catch (error) {
    logger.warn('External service unavailable, running in limited mode');
    // Register fallback features or disable certain functionality
  }
}
```

### Error Boundaries

For web UI components, implement error boundaries to prevent crashes:

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Plugin error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## Dependencies

Plugins can declare dependencies on other plugins.

### Declaring Dependencies

In `plugin.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "author": "Plugin Author",
  "description": "A plugin that depends on another plugin",
  "entry": "./index.js",
  "dependencies": ["database-plugin", "auth-plugin"]
}
```

### Using Dependencies

```javascript
async function init(core) {
  // Check if dependencies are available
  const databasePlugin = core.plugins.get('database-plugin');
  if (!databasePlugin) {
    logger.error('Database plugin is required but not installed');
    return;
  }
  
  // Use functionality from the dependency
  const db = databasePlugin.getDatabase();
  const data = await db.query('SELECT * FROM users');
}
```

### Circular Dependencies

Avoid circular dependencies between plugins. If two plugins need to communicate with each other, consider creating a third plugin that provides a shared interface.

## Scheduling

Plugins can schedule tasks to run at specific times or intervals.

### One-time Scheduling

```javascript
// Schedule a task to run in 5 minutes
core.api.scheduleTask('my-plugin', 'reminder', Date.now() + 300000, {
  userId: '123',
  message: 'Remember to do something!'
});
```

### Recurring Scheduling

```javascript
// Schedule a task to run every hour
core.api.scheduleTask('my-plugin', 'hourly-check', '0 * * * *', async () => {
  // Perform hourly check
  await performHourlyCheck();
});
```

### Cron Syntax

The scheduling system uses cron syntax for recurring tasks:

```
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └── Day of week (0 - 7) (0 or 7 is Sunday)
│ │ │ │ └──── Month (1 - 12)
│ │ │ └────── Day of month (1 - 31)
│ │ └──────── Hour (0 - 23)
│ └────────── Minute (0 - 59)
└──────────── Second (0 - 59, optional)
```

### Task Handlers

```javascript
// Register a task handler
core.api.registerTaskHandler('my-plugin', 'reminder', async (data) => {
  const { userId, message } = data;
  // Send reminder to user
  await sendReminder(userId, message);
});
```

## Events and Notifications

Plugins can emit and listen to events to communicate with other plugins.

### Emitting Events

```javascript
// Emit an event that other plugins can listen to
core.api.emitEvent('my-plugin:user-joined', {
  userId: '123',
  guildId: '456'
});
```

### Listening to Events

```javascript
// Listen to events from other plugins
core.api.onEvent('auth-plugin:user-logged-in', (data) => {
  const { userId } = data;
  // Handle user login
  handleUserLogin(userId);
});
```

### Event Best Practices

1. Use descriptive event names with namespace prefixes
2. Document the data structure of emitted events
3. Handle events asynchronously to avoid blocking
4. Clean up event listeners in the destroy function

## Security Considerations

Security is critical when developing plugins.

### Input Validation

```javascript
core.api.registerCommand('echo', 'Echo a message', async (interaction) => {
  const message = interaction.options.getString('message');
  
  // Validate input
  if (!message || message.length > 1000) {
    await interaction.reply({ 
      content: 'Message must be between 1 and 1000 characters', 
      ephemeral: true 
    });
    return;
  }
  
  await interaction.reply(message);
});
```

### Sanitizing Output

```javascript
function sanitizeOutput(text) {
  // Remove or escape potentially dangerous characters
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

### Rate Limiting

```javascript
const rateLimiter = new Map();

core.api.registerCommand('expensive-command', 'An expensive command', async (interaction) => {
  const userId = interaction.user.id;
  const now = Date.now();
  
  // Check if user is rate limited
  const lastUsed = rateLimiter.get(userId) || 0;
  if (now - lastUsed < 60000) { // 1 minute cooldown
    await interaction.reply({ 
      content: 'Please wait before using this command again', 
      ephemeral: true 
    });
    return;
  }
  
  // Update rate limiter
  rateLimiter.set(userId, now);
  
  // Execute expensive operation
  const result = await expensiveOperation();
  await interaction.reply(result);
});
```

### Secure Configuration

1. Never log sensitive configuration values
2. Encrypt sensitive data when storing
3. Use environment variables for secrets when possible
4. Validate configuration values before use

## Testing Plugins

Testing is essential for plugin quality and reliability.

### Unit Testing

```javascript
// tests/plugin.test.js
const plugin = require('../index');

describe('My Plugin', () => {
  test('should export init and destroy functions', () => {
    expect(plugin.init).toBeInstanceOf(Function);
    expect(plugin.destroy).toBeInstanceOf(Function);
  });

  test('should initialize without errors', async () => {
    const core = {
      api: {
        registerCommand: jest.fn(),
        registerEvent: jest.fn(),
        getLogger: () => ({
          info: jest.fn(),
          error: jest.fn()
        })
      }
    };

    await expect(plugin.init(core)).resolves.toBeUndefined();
  });
});
```

### Integration Testing

```javascript
// tests/integration.test.js
describe('Plugin Integration', () => {
  test('should register commands correctly', async () => {
    const registeredCommands = [];
    
    const core = {
      api: {
        registerCommand: (name, description, handler) => {
          registeredCommands.push({ name, description });
        },
        getLogger: () => ({
          info: jest.fn(),
          error: jest.fn()
        })
      }
    };

    await plugin.init(core);
    
    expect(registeredCommands).toContainEqual({
      name: 'hello',
      description: 'Say hello'
    });
  });
});
```

### Testing Best Practices

1. Write tests for all critical functionality
2. Test error conditions and edge cases
3. Use mocking to isolate the code under test
4. Test both success and failure scenarios
5. Keep tests fast and focused
6. Use descriptive test names

## Publishing Plugins

To make your plugin available to others, you can publish it to a plugin repository.

### Preparing for Publication

1. Ensure your plugin has a unique name
2. Use semantic versioning
3. Write comprehensive documentation
4. Include a README.md with usage instructions
5. Add a LICENSE file
6. Test your plugin thoroughly
7. Remove any sensitive information

### Repository Structure

When publishing to a repository, your plugin should have this structure:

```
my-plugin/
├── plugin.json
├── index.js
├── README.md
├── LICENSE
└── other-files...
```

### Publishing Process

1. Create a plugin manifest (`plugin.json`)
2. Host your plugin files on a web server
3. Add your plugin to the repository's plugin list (`plugins.json`)

Example `plugins.json` entry:

```json
[
  {
    "name": "my-plugin",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "A plugin that does awesome things",
    "url": "/plugins/my-plugin/plugin.json"
  }
]
```

## Best Practices

### Code Quality

1. **Follow Consistent Style**: Use consistent naming conventions, indentation, and formatting
2. **Write Clean Code**: Keep functions small and focused, use descriptive names
3. **Comment Complex Logic**: Explain why something is done, not just what is done
4. **Avoid Magic Numbers**: Use named constants for values
5. **Handle Errors Gracefully**: Always consider what could go wrong

### Performance

1. **Optimize Critical Paths**: Profile and optimize frequently called code
2. **Use Caching**: Cache expensive operations when appropriate
3. **Limit API Calls**: Batch requests and implement rate limiting
4. **Clean Up Resources**: Close connections and clear timers in destroy functions
5. **Avoid Blocking Operations**: Use asynchronous operations when possible

### Maintainability

1. **Modular Design**: Break complex functionality into smaller modules
2. **Clear Documentation**: Document public APIs and complex logic
3. **Versioning**: Follow semantic versioning for releases
4. **Backward Compatibility**: Maintain compatibility with older versions when possible
5. **Deprecation Warnings**: Warn users before removing features

### User Experience

1. **Clear Error Messages**: Provide helpful error messages to users
2. **Responsive Commands**: Acknowledge commands quickly, even if processing takes time
3. **Helpful Documentation**: Include examples and clear usage instructions
4. **Consistent Interface**: Follow Discord's design patterns
5. **Accessibility**: Consider accessibility in web UI components

## Troubleshooting

### Common Issues

#### Plugin Not Loading

1. Check that `plugin.json` is valid JSON
2. Verify the entry point file exists and exports the required functions
3. Check the system logs for error messages
4. Ensure all dependencies are installed

#### Commands Not Registering

1. Check that the command name is unique
2. Verify the command handler is a function
3. Ensure the plugin is enabled
4. Check for errors in the command registration code

#### Web Routes Not Working

1. Verify the route path is correct
2. Check that the route handler is a function
3. Ensure the plugin is enabled
4. Check for conflicts with other routes

### Debugging Tips

1. **Use Logging**: Add log messages to trace execution flow
2. **Check System Logs**: Look at the main system logs for error messages
3. **Test in Isolation**: Disable other plugins to identify conflicts
4. **Use Development Mode**: Run the system in development mode for better error messages
5. **Validate Configuration**: Check that all required configuration values are set

### Getting Help

1. **Check Documentation**: Review the plugin development guide and API reference
2. **Search Issues**: Look for similar issues in the project repository
3. **Ask Community**: Reach out to the community for help
4. **File Bugs**: Report bugs with detailed information about the issue

This comprehensive plugin development guide should provide you with all the information you need to create high-quality plugins for the Discord Bot Plugin System. Remember to test your plugins thoroughly and follow best practices for security, performance, and maintainability.