# Plugin Templates and Examples

This document provides templates and examples to help developers create plugins for the Discord Bot Plugin System.

## Plugin Template

Here's a basic template for a new plugin:

```
my-plugin/
├── plugin.json
├── index.js
├── discord/
└── web/
```

### plugin.json

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A brief description of what this plugin does",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": [],
  "entry": "./index.js"
}
```

### index.js

```javascript
// plugins/my-plugin/index.js

module.exports = {
  async init(core) {
    // Get a logger for this plugin
    const logger = core.api.getLogger('my-plugin');
    
    logger.info('Initializing my-plugin');
    
    // Register Discord commands
    // core.api.registerCommand('command-name', 'Command description', async (interaction) => {
    //   // Command handler code
    // });
    
    // Register Discord event handlers
    // core.api.registerEvent('messageCreate', (message) => {
    //   // Event handler code
    // });
    
    // Register web routes
    // core.api.registerRoute('/api/my-plugin', (req, res) => {
    //   // Route handler code
    // });
    
    // Register web pages
    // core.api.registerPage('/my-plugin', MyPluginComponent);
  },

  async destroy() {
    // Cleanup code when plugin is disabled
    console.log('my-plugin destroyed');
  }
};
```

## Example Plugins

### 1. Simple Discord Command Plugin

This plugin adds a simple Discord command that responds with a greeting.

```
greeting-plugin/
├── plugin.json
└── index.js
```

#### plugin.json

```json
{
  "name": "greeting-plugin",
  "version": "1.0.0",
  "author": "Plugin Developer",
  "description": "A plugin that adds a greeting command",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands"]
  },
  "entry": "./index.js"
}
```

#### index.js

```javascript
// plugins/greeting-plugin/index.js

module.exports = {
  async init(core) {
    const logger = core.api.getLogger('greeting-plugin');
    
    logger.info('Initializing greeting-plugin');
    
    // Register a Discord command
    core.api.registerCommand('greet', 'Send a greeting message', async (interaction) => {
      const user = interaction.user;
      await interaction.reply(`Hello, ${user.username}! Welcome to the server!`);
    });
  },

  async destroy() {
    console.log('greeting-plugin destroyed');
  }
};
```

### 2. Web Dashboard Plugin

This plugin adds a web dashboard page with server statistics.

```
dashboard-plugin/
├── plugin.json
├── index.js
└── web/
    └── DashboardPage.js
```

#### plugin.json

```json
{
  "name": "dashboard-plugin",
  "version": "1.0.0",
  "author": "Plugin Developer",
  "description": "A plugin that adds a dashboard page with server statistics",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "web": ["pages"]
  },
  "entry": "./index.js"
}
```

#### index.js

```javascript
// plugins/dashboard-plugin/index.js
const DashboardPage = require('./web/DashboardPage');

module.exports = {
  async init(core) {
    const logger = core.api.getLogger('dashboard-plugin');
    
    logger.info('Initializing dashboard-plugin');
    
    // Register a web page
    core.api.registerPage('/dashboard/stats', DashboardPage);
  },

  async destroy() {
    console.log('dashboard-plugin destroyed');
  }
};
```

#### web/DashboardPage.js

```javascript
// plugins/dashboard-plugin/web/DashboardPage.js
import React, { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    guildCount: 0,
    userCount: 0,
    uptime: 0
  });
  
  useEffect(() => {
    // Fetch stats from an API endpoint
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/bot/status');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Server Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Servers</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.guildCount}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-3xl font-bold text-green-600">{stats.userCount}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Uptime</h2>
          <p className="text-3xl font-bold text-purple-600">
            {Math.floor(stats.uptime / (1000 * 60 * 60))}h {Math.floor((stats.uptime % (1000 * 60 * 60)) / (1000 * 60))}m
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 3. Scheduled Task Plugin

This plugin demonstrates how to create a plugin with a scheduled task using the core system's scheduler (to be implemented).

```
scheduled-task-plugin/
├── plugin.json
└── index.js
```

#### plugin.json

```json
{
  "name": "scheduled-task-plugin",
  "version": "1.0.0",
  "author": "Plugin Developer",
  "description": "A plugin that runs a scheduled task",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands"]
  },
  "entry": "./index.js"
}
```

#### index.js

```javascript
// plugins/scheduled-task-plugin/index.js

module.exports = {
  async init(core) {
    const logger = core.api.getLogger('scheduled-task-plugin');
    
    logger.info('Initializing scheduled-task-plugin');
    
    // Register a command to manually trigger the task
    core.api.registerCommand('run-task', 'Manually run the scheduled task', async (interaction) => {
      await this.runTask(core, interaction);
    });
    
    // Schedule the task to run every hour
    // Note: This is a conceptual example. The actual implementation of the scheduler
    // would depend on the core system's capabilities.
    /*
    core.scheduler.addTask({
      name: 'scheduled-task-plugin-hourly',
      cron: '0 * * * *', // Every hour
      handler: () => this.runTask(core)
    });
    */
  },

  async destroy() {
    // Remove scheduled task
    // core.scheduler.removeTask('scheduled-task-plugin-hourly');
    console.log('scheduled-task-plugin destroyed');
  },
  
  async runTask(core, interaction = null) {
    const logger = core.api.getLogger('scheduled-task-plugin');
    logger.info('Running scheduled task');
    
    // Perform some task
    // For example, send a message to a specific channel
    // or update some data
    
    if (interaction) {
      await interaction.reply('Scheduled task executed successfully!');
    }
  }
};
```

### 4. Plugin with Configuration

This plugin demonstrates how to handle configuration settings.

```
configurable-plugin/
├── plugin.json
├── index.js
└── config.js
```

#### plugin.json

```json
{
  "name": "configurable-plugin",
  "version": "1.0.0",
  "author": "Plugin Developer",
  "description": "A plugin with configurable settings",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands"],
    "web": ["routes"]
  },
  "entry": "./index.js"
}
```

#### index.js

```javascript
// plugins/configurable-plugin/index.js
const { getConfig, setConfig } = require('./config');

module.exports = {
  async init(core) {
    const logger = core.api.getLogger('configurable-plugin');
    
    logger.info('Initializing configurable-plugin');
    
    // Register a command to get a configuration value
    core.api.registerCommand('get-config', 'Get a configuration value', async (interaction) => {
      const key = interaction.options.getString('key');
      const value = getConfig(key);
      
      if (value !== undefined) {
        await interaction.reply(`Configuration value for "${key}": ${value}`);
      } else {
        await interaction.reply(`Configuration key "${key}" not found`);
      }
    });
    
    // Register a command to set a configuration value
    core.api.registerCommand('set-config', 'Set a configuration value', async (interaction) => {
      const key = interaction.options.getString('key');
      const value = interaction.options.getString('value');
      
      setConfig(key, value);
      await interaction.reply(`Configuration value for "${key}" set to "${value}"`);
    });
    
    // Register a web route to get all configuration values
    core.api.registerRoute('/api/configurable-plugin/config', (req, res) => {
      // In a real implementation, you would want to add authentication
      res.json(getAllConfig());
    });
  },

  async destroy() {
    console.log('configurable-plugin destroyed');
  }
};
```

#### config.js

```javascript
// plugins/configurable-plugin/config.js
const fs = require('fs').promises;
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
let config = {};

// Load configuration from file
async function loadConfig() {
  try {
    const data = await fs.readFile(configPath, 'utf8');
    config = JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, use default config
    config = {
      defaultSetting: 'defaultValue'
    };
    await saveConfig();
  }
}

// Save configuration to file
async function saveConfig() {
  try {
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Failed to save configuration:', error);
  }
}

// Get a configuration value
function getConfig(key) {
  return config[key];
}

// Set a configuration value
async function setConfig(key, value) {
  config[key] = value;
  await saveConfig();
}

// Get all configuration values
function getAllConfig() {
  return config;
}

// Initialize configuration
loadConfig().catch(console.error);

module.exports = {
  getConfig,
  setConfig,
  getAllConfig
};
```

## Best Practices for Example Plugins

1. **Clear Documentation**: Each example plugin should have clear comments explaining what it does and how it works.

2. **Error Handling**: Examples should demonstrate proper error handling techniques.

3. **Logging**: Show how to use the core logging system effectively.

4. **Resource Management**: Demonstrate how to properly clean up resources in the `destroy()` function.

5. **Modularity**: Break complex functionality into separate modules when appropriate.

6. **Configuration**: Show how to handle plugin configuration, either through files or API endpoints.

7. **Security**: Examples should demonstrate secure coding practices, especially for web routes.

8. **Testing**: While not shown in these examples, real plugins should include tests.

These templates and examples should provide a solid foundation for developers to create their own plugins for the Discord Bot Plugin System.