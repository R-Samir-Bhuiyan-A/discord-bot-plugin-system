# Comprehensive Plugin Development Guide

This guide provides everything you need to know to create powerful, reliable plugins for the Discord Bot Plugin System.

## Table of Contents

1. [Introduction to Plugin Development](#introduction-to-plugin-development)
2. [Plugin Fundamentals](#plugin-fundamentals)
3. [Creating Your First Plugin](#creating-your-first-plugin)
4. [Plugin Structure and Organization](#plugin-structure-and-organization)
5. [Plugin Manifest (plugin.json)](#plugin-manifest-pluginjson)
6. [Plugin Entry Point](#plugin-entry-point)
7. [Discord Integration](#discord-integration)
8. [Web UI Integration](#web-ui-integration)
9. [Data Storage and Configuration](#data-storage-and-configuration)
10. [Plugin Lifecycle Management](#plugin-lifecycle-management)
11. [Error Handling and Logging](#error-handling-and-logging)
12. [Security Best Practices](#security-best-practices)
13. [Performance Optimization](#performance-optimization)
14. [Testing Your Plugins](#testing-your-plugins)
15. [Plugin Distribution](#plugin-distribution)
16. [Advanced Topics](#advanced-topics)

## Introduction to Plugin Development

The Discord Bot Plugin System is designed with extensibility at its core. All functionality beyond the basic Discord connection and web server is implemented through plugins. This architecture ensures that:

- The core system remains stable and unchanging
- New features can be added without modifying core code
- Plugins can be developed, tested, and deployed independently
- The system can be extended by anyone with JavaScript knowledge

### Key Benefits of the Plugin System

1. **Isolation**: Each plugin runs in its own context, preventing one plugin from affecting others
2. **Modularity**: Plugins can be enabled, disabled, or removed without impacting the system
3. **Extensibility**: The core API provides hooks for plugins to extend functionality
4. **Sandboxing**: Plugins are sandboxed for security and stability
5. **Versioning**: Each plugin can be versioned independently

## Plugin Fundamentals

### What is a Plugin?

A plugin is a self-contained module that extends the functionality of the Discord Bot Plugin System. Plugins can:

- Add new Discord commands
- Respond to Discord events
- Provide web API routes
- Add web UI pages
- Schedule tasks
- Store and retrieve data
- Communicate with other plugins

### Plugin Structure

All plugins follow a consistent structure:

```
plugins/
└── my-plugin/
    ├── plugin.json          # Plugin manifest (required)
    ├── index.js             # Entry point (required)
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
    ├── docs/                # Plugin-specific documentation
    ├── README.md            # Plugin documentation
    └── LICENSE              # License information
```

Not all directories are required. You can structure your plugin as needed, but following this pattern helps maintain consistency.

## Creating Your First Plugin

Let's create a simple plugin that adds a Discord command and a web page.

### Step 1: Create the Plugin Directory

Navigate to the `plugins/` directory and create a new folder for your plugin:

```bash
cd plugins
mkdir greeting-plugin
cd greeting-plugin
```

### Step 2: Create the Plugin Manifest

Create a `plugin.json` file with the following content:

```json
{
  "name": "greeting-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A plugin that adds greeting commands and a web page",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands"],
    "web": ["routes", "pages"]
  },
  "dependencies": [],
  "entry": "./index.js"
}
```

### Step 3: Create the Entry Point

Create an `index.js` file with the following content:

```javascript
// Import plugin components
const { handleGreetCommand } = require('./discord/commands/greet');
const GreetingPage = require('./web/pages/GreetingPage');

// Plugin initialization
async function init(core) {
  const logger = core.api.getLogger('greeting-plugin');
  logger.info('Initializing greeting-plugin');
  
  // Register Discord command
  core.api.registerCommand(
    'greet', 
    'Greet a user', 
    handleGreetCommand
  );
  
  // Register web page
  core.api.registerPage('/greeting', GreetingPage);
  
  logger.info('greeting-plugin initialized successfully');
}

// Plugin cleanup
async function destroy() {
  console.log('greeting-plugin destroyed');
}

// Export plugin functions
module.exports = {
  init,
  destroy
};
```

### Step 4: Create Discord Command Handler

Create the directory structure and command handler:

```bash
mkdir -p discord/commands
```

Create `discord/commands/greet.js`:

```javascript
async function handleGreetCommand(interaction) {
  try {
    const user = interaction.options.getUser('user') || interaction.user;
    await interaction.reply(`Hello, ${user.username}! 👋`);
  } catch (error) {
    console.error('Error in greet command:', error);
    await interaction.reply({ 
      content: 'Sorry, something went wrong!', 
      ephemeral: true 
    });
  }
}

module.exports = { handleGreetCommand };
```

### Step 5: Create Web Page Component

Create the directory structure:

```bash
mkdir -p web/pages
```

Create `web/pages/GreetingPage.js`:

```javascript
function GreetingPage() {
  return `
    <div class="container">
      <h1>Greeting Plugin</h1>
      <p>This plugin adds greeting functionality to the bot.</p>
      <div class="card">
        <h2>Features</h2>
        <ul>
          <li>/greet command to greet users</li>
          <li>Web interface for plugin management</li>
        </ul>
      </div>
    </div>
  `;
}

module.exports = GreetingPage;
```

### Step 6: Test Your Plugin

Restart the development server to load your plugin:

```bash
npm run dev
```

Test your plugin:
- Go to your Discord server where the bot is installed
- Type `/greet` in any channel
- You should see the response "Hello from my first plugin!"
- Visit `http://localhost:3000/greeting` to see the web page

## Plugin Structure and Organization

### Directory Structure Guidelines

1. **Use descriptive names**: Choose clear, descriptive names for directories and files
2. **Group related functionality**: Organize code into logical directories
3. **Separate concerns**: Keep Discord, web, and utility code in separate directories
4. **Follow conventions**: Use the standard directory structure when possible

### File Naming Conventions

- Use kebab-case for directory and file names (`discord-commands.js`)
- Use camelCase for function and variable names (`handleGreetCommand`)
- Use PascalCase for class and component names (`GreetingPage`)

### Code Organization

Organize your plugin code into logical modules:

```javascript
// Good: Well-organized code structure
discord/
├── commands/
│   ├── greet.js
│   ├── help.js
│   └── info.js
├── events/
│   ├── guildCreate.js
│   └── messageCreate.js
└── services/
    └── userService.js

web/
├── pages/
│   ├── DashboardPage.js
│   └── SettingsPage.js
├── routes/
│   ├── api.js
│   └── auth.js
└── components/
    ├── UserCard.js
    └── LoadingSpinner.js

utils/
├── logger.js
├── helpers.js
└── validators.js
```

## Plugin Manifest (plugin.json)

The `plugin.json` file is the heart of every plugin. It contains metadata about the plugin and is used by the core system to load and manage it properly.

### Required Fields

```json
{
  "name": "plugin-identifier",
  "version": "1.0.0",
  "author": "Author Name",
  "description": "Plugin description",
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "entry": "./index.js"
}
```

### Optional Fields

```json
{
  "name": "weather-plugin",
  "version": "2.1.3",
  "author": "Weather Dev",
  "description": "Provides weather information for Discord servers",
  "homepage": "https://github.com/weather-dev/weather-plugin",
  "repository": {
    "type": "git",
    "url": "https://github.com/weather-dev/weather-plugin.git"
  },
  "bugs": {
    "url": "https://github.com/weather-dev/weather-plugin/issues"
  },
  "license": "MIT",
  "keywords": ["weather", "forecast", "discord", "bot"],
  "compatibility": {
    "core": ">=1.5.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": ["database-plugin"],
  "config": {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "API key for OpenWeatherMap service"
    },
    "units": {
      "type": "string",
      "required": false,
      "default": "metric",
      "description": "Temperature units (metric or imperial)"
    }
  },
  "entry": "./index.js"
}
```

### Permissions System

The permissions system controls what resources and APIs a plugin can access:

```json
{
  "permissions": {
    "discord": ["commands", "events", "messages"],
    "web": ["routes", "pages"]
  }
}
```

## Plugin Entry Point

The entry point is the main file that the core system loads when initializing your plugin.

### Structure

```javascript
module.exports = {
  async init(core) {
    // Plugin initialization code
  },
  
  async destroy() {
    // Cleanup code
  }
};
```

### The `init(core)` Function

The `init(core)` function is called when your plugin is being initialized.

```javascript
async function init(core) {
  try {
    const logger = core.api.getLogger('my-plugin');
    logger.info('Initializing my-plugin');
    
    // Plugin initialization code
    await initializePlugin(core);
    
    logger.info('my-plugin initialized successfully');
  } catch (error) {
    // Log the error
    console.error('Failed to initialize my-plugin:', error);
    
    // Optionally, re-throw to prevent plugin from loading
    throw new Error(`Plugin initialization failed: ${error.message}`);
  }
}
```

### The `destroy()` Function

The `destroy()` function is called when your plugin is being disabled or removed.

```javascript
let updateInterval;

async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  // Set up a recurring task
  updateInterval = setInterval(() => {
    // Update some data
    logger.info('Performing periodic update');
  }, 300000); // Every 5 minutes
  
  logger.info('my-plugin initialized');
}

async function destroy() {
  // Clean up the interval
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  
  console.log('my-plugin destroyed');
}

module.exports = {
  init,
  destroy
};
```

## Discord Integration

Plugins can interact with Discord through the core API.

### Registering Discord Commands

```javascript
core.api.registerCommand('ping', 'Ping the bot', async (interaction) => {
  await interaction.reply('Pong!');
});
```

### Advanced Command with Options

```javascript
core.api.registerCommand('greet', 'Greet a user', async (interaction) => {
  const user = interaction.options.getUser('user') || interaction.user;
  await interaction.reply(`Hello, ${user.username}! 👋`);
}, {
  options: [
    {
      name: 'user',
      description: 'The user to greet',
      type: 'USER',
      required: false
    }
  ]
});
```

### Registering Discord Events

```javascript
core.api.registerEvent('messageCreate', (message) => {
  const logger = core.api.getLogger('my-plugin');
  logger.info(`New message from ${message.author.username}: ${message.content}`);
});
```

## Web UI Integration

Plugins can extend the web interface by adding custom routes and pages.

### Registering Web Routes

```javascript
core.api.registerRoute('/api/my-plugin/status', async (req, res) => {
  res.json({ status: 'ok', plugin: 'my-plugin' });
});
```

### Registering Web Pages

```javascript
// web/pages/MyPluginPage.js
import React from 'react';

export default function MyPluginPage() {
  return (
    <div className="container">
      <h1>My Plugin Dashboard</h1>
      <p>Welcome to the My Plugin dashboard!</p>
    </div>
  );
}

// In your plugin's index.js
const MyPluginPage = require('./web/pages/MyPluginPage');

async function init(core) {
  core.api.registerPage('/my-plugin', MyPluginPage);
}
```

## Data Storage and Configuration

Plugins can store data and manage configuration through the core API.

### Configuration Management

```javascript
async function init(core) {
  // Get configuration
  const apiKey = await core.api.getConfig('my-plugin', 'apiKey');
  const enableFeature = await core.api.getConfig('my-plugin', 'enableFeature') || false;
  
  // Set configuration
  await core.api.setConfig('my-plugin', 'lastUpdated', new Date().toISOString());
}
```

### Data Storage

```javascript
async function init(core) {
  // Store data
  await core.api.setData('my-plugin', 'userCount', 100);
  
  // Retrieve data
  const userCount = await core.api.getData('my-plugin', 'userCount');
  
  // Delete data
  await core.api.deleteData('my-plugin', 'userCount');
}
```

## Plugin Lifecycle Management

Understanding the plugin lifecycle is crucial for proper resource management.

### Lifecycle Stages

1. **Discovery**: The PluginLoader scans the `plugins/` directory
2. **Validation**: Each plugin's `plugin.json` is validated
3. **Loading**: The plugin's entry point file is loaded
4. **Initialization**: The plugin's `init(core)` function is called
5. **Registration**: Plugins register commands, events, routes, and pages
6. **Activation**: Enabled plugins become active and functional
7. **Destruction**: When disabled, the `destroy()` function is called

### Resource Management

Always clean up resources in the `destroy()` function:

```javascript
let timers = [];
let connections = [];

async function init(core) {
  // Set up timers
  const timer = setTimeout(() => {
    // Do something
  }, 5000);
  timers.push(timer);
  
  // Set up connections
  const connection = await connectToService();
  connections.push(connection);
}

async function destroy() {
  // Clear all timers
  timers.forEach(timer => clearTimeout(timer));
  timers = [];
  
  // Close all connections
  await Promise.all(connections.map(conn => conn.close()));
  connections = [];
  
  console.log('All resources cleaned up');
}
```

## Error Handling and Logging

Proper error handling and logging are essential for plugin reliability.

### Error Handling

```javascript
core.api.registerCommand('error-prone', 'A command that might fail', async (interaction) => {
  try {
    // Potentially failing operation
    const result = await riskyOperation();
    await interaction.reply(`Success: ${result}`);
  } catch (error) {
    const logger = core.api.getLogger('my-plugin');
    logger.error('Command failed:', error);
    
    // Send user-friendly error message
    await interaction.reply({ 
      content: 'Sorry, something went wrong!', 
      ephemeral: true 
    });
  }
});
```

### Logging

```javascript
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  logger.info('Initializing my-plugin');
  
  try {
    await initializePlugin(core);
    logger.info('Plugin initialization completed');
  } catch (error) {
    logger.error('Plugin initialization failed:', error);
    throw error; // Re-throw if initialization is critical
  }
}
```

## Security Best Practices

Security is paramount in plugin development.

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
}, {
  options: [
    {
      name: 'message',
      description: 'The message to echo',
      type: 'STRING',
      required: true
    }
  ]
});
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
  
  try {
    // Execute expensive operation
    const result = await expensiveOperation();
    await interaction.reply(result);
  } catch (error) {
    await interaction.reply({ 
      content: 'Sorry, something went wrong!', 
      ephemeral: true 
    });
  }
});
```

## Performance Optimization

Optimize your plugins for better performance.

### Efficient Data Structures

```javascript
// Good: Using Set for fast lookups
const bannedUsers = new Set();
bannedUsers.add(userId);
if (bannedUsers.has(userId)) {
  // User is banned
}

// Bad: Using Array for frequent lookups
const bannedUsers = [];
bannedUsers.push(userId);
if (bannedUsers.includes(userId)) {
  // User is banned (O(n) complexity)
}
```

### Caching

```javascript
// Good: Caching expensive operations
const weatherCache = new Map();

async function getWeather(location) {
  const cacheKey = `${location}-${Math.floor(Date.now() / 300000)}`; // 5-minute cache
  if (weatherCache.has(cacheKey)) {
    return weatherCache.get(cacheKey);
  }
  
  const weather = await fetchWeatherFromApi(location);
  weatherCache.set(cacheKey, weather);
  return weather;
}
```

## Testing Your Plugins

Thorough testing ensures plugin reliability.

### Unit Testing

```javascript
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
  });
});
```

### Integration Testing

```javascript
// tests/integration/plugin.test.js
describe('Plugin Integration', () => {
  test('should initialize without errors', async () => {
    const mockCore = {
      api: {
        registerCommand: jest.fn(),
        registerEvent: jest.fn(),
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
});
```

## Plugin Distribution

Share your plugins with the community.

### Creating a Plugin Repository

1. Set up directory structure:
```bash
mkdir my-plugin-repository
cd my-plugin-repository
mkdir plugins
touch plugins.json
```

2. Add plugins:
```bash
mkdir plugins/weather-plugin
```

3. Create plugin.json files:
```json
{
  "name": "weather-plugin",
  "version": "1.2.3",
  "author": "Weather Dev",
  "description": "Provides weather information for Discord servers",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands"],
    "web": ["routes"]
  },
  "files": [
    "index.js",
    "utils/weather.js"
  ],
  "entry": "./index.js"
}
```

4. Update plugins.json:
```json
[
  {
    "name": "weather-plugin",
    "version": "1.2.3",
    "author": "Weather Dev",
    "description": "Provides weather information for Discord servers",
    "url": "/plugins/weather-plugin/plugin.json"
  }
]
```

## Advanced Topics

### Plugin Dependencies

Declare dependencies in your plugin.json:

```json
{
  "dependencies": ["database-plugin", "auth-plugin"]
}
```

Check for dependencies in your plugin:

```javascript
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  // Check for required dependencies
  const plugins = await core.api.getPlugins();
  const databasePlugin = plugins.find(p => p.name === 'database-plugin');
  
  if (!databasePlugin || !databasePlugin.enabled) {
    logger.error('Database plugin is required but not available');
    throw new Error('Missing required dependency: database-plugin');
  }
  
  logger.info('All dependencies satisfied');
}
```

### Scheduling Tasks

Use the core's scheduling system:

```javascript
async function init(core) {
  // Schedule a task to run every hour
  core.api.scheduleTask('0 0 * * *', async () => {
    const logger = core.api.getLogger('my-plugin');
    logger.info('Running hourly task');
    await performHourlyTask();
  });
}
```

### Inter-Plugin Communication

Use events for communication between plugins:

```javascript
// In one plugin
core.api.emitEvent('my-plugin:user-joined', { userId, guildId });

// In another plugin
core.api.registerEvent('my-plugin:user-joined', (data) => {
  console.log(`User ${data.userId} joined guild ${data.guildId}`);
});
```

This comprehensive guide covers everything you need to know to create powerful, reliable plugins for the Discord Bot Plugin System. As you develop more plugins, you'll discover additional patterns and best practices that work for your specific use cases.