# Core API Reference

The Core API provides the fundamental interface for plugins to interact with the Discord Bot Plugin System.

## Table of Contents

1. [Overview](#overview)
2. [Command Registration](#command-registration)
3. [Event Registration](#event-registration)
4. [Route Registration](#route-registration)
5. [Page Registration](#page-registration)
6. [Logging](#logging)
7. [Configuration](#configuration)
8. [Data Storage](#data-storage)
9. [Plugin Management](#plugin-management)
10. [Repository Integration](#repository-integration)
11. [Scheduling](#scheduling)
12. [Messaging](#messaging)

## Overview

The Core API is accessible through the `core.api` object passed to your plugin's `init` function. It provides a stable interface for plugins to register functionality, manage data, and interact with the system.

```javascript
module.exports = {
  async init(core) {
    // Access the Core API through core.api
    core.api.registerCommand('my-command', 'Description', handler);
  }
};
```

## Command Registration

### registerCommand(name, description, handler[, options])

Registers a new Discord slash command.

**Parameters:**
- `name` (string): The command name (must be unique)
- `description` (string): A brief description of what the command does
- `handler` (function): An async function that handles the command interaction
- `options` (object, optional): Command options and parameters

**Example:**
```javascript
core.api.registerCommand('ping', 'Ping the bot', async (interaction) => {
  await interaction.reply('Pong!');
});
```

### registerPluginCommand(pluginName, name, description, handler[, options])

Registers a new Discord slash command specific to a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin registering the command
- `name` (string): The command name (must be unique)
- `description` (string): A brief description of what the command does
- `handler` (function): An async function that handles the command interaction
- `options` (object, optional): Command options and parameters

**Example:**
```javascript
core.api.registerPluginCommand('my-plugin', 'plugin-ping', 'Ping the bot', async (interaction) => {
  await interaction.reply('Pong from my plugin!');
});
```

## Event Registration

### registerEvent(event, handler)

Registers a handler for a Discord event.

**Parameters:**
- `event` (string): The Discord event name (e.g., 'messageCreate', 'guildMemberAdd')
- `handler` (function): An async function that handles the event

**Example:**
```javascript
core.api.registerEvent('messageCreate', (message) => {
  console.log(`New message: ${message.content}`);
});
```

### registerPluginEvent(pluginName, event, handler)

Registers a handler for a Discord event specific to a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin registering the event
- `event` (string): The Discord event name
- `handler` (function): An async function that handles the event

**Example:**
```javascript
core.api.registerPluginEvent('my-plugin', 'messageCreate', (message) => {
  console.log(`New message for my plugin: ${message.content}`);
});
```

## Route Registration

### registerRoute(path, handler)

Registers a new web API route.

**Parameters:**
- `path` (string): The route path (e.g., '/api/my-plugin/data')
- `handler` (function): An async function that handles the request

**Example:**
```javascript
core.api.registerRoute('/api/my-plugin/status', async (req, res) => {
  res.json({ status: 'ok', plugin: 'my-plugin' });
});
```

### registerPluginRoute(pluginName, path, handler)

Registers a new web API route specific to a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin registering the route
- `path` (string): The route path
- `handler` (function): An async function that handles the request

**Example:**
```javascript
core.api.registerPluginRoute('my-plugin', '/status', async (req, res) => {
  res.json({ status: 'ok' });
});
```

## Page Registration

### registerPage(path, component)

Registers a new web page.

**Parameters:**
- `path` (string): The page path (e.g., '/my-plugin/dashboard')
- `component` (React component): A React component that renders the page

**Example:**
```javascript
const MyDashboard = require('./web/pages/MyDashboard');

core.api.registerPage('/my-plugin/dashboard', MyDashboard);
```

### registerPluginPage(pluginName, path, component)

Registers a new web page specific to a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin registering the page
- `path` (string): The page path
- `component` (React component): A React component that renders the page

**Example:**
```javascript
const PluginDashboard = require('./web/pages/PluginDashboard');

core.api.registerPluginPage('my-plugin', '/dashboard', PluginDashboard);
```

## Logging

### getLogger(name)

Gets a logger instance for the specified name.

**Parameters:**
- `name` (string): The logger name (typically your plugin name)

**Returns:**
- Logger object with methods for different log levels

**Example:**
```javascript
const logger = core.api.getLogger('my-plugin');
logger.info('Plugin initialized');
logger.error('An error occurred');
```

### Logger Methods

- `logger.debug(message)`: Log debug information
- `logger.info(message)`: Log general information
- `logger.warn(message)`: Log warnings
- `logger.error(message)`: Log errors

## Configuration

### getConfig(pluginName, key)

Gets a configuration value for a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin
- `key` (string): The configuration key

**Returns:**
- The configuration value or null if not found

**Example:**
```javascript
const apiKey = await core.api.getConfig('my-plugin', 'apiKey');
```

### setConfig(pluginName, key, value)

Sets a configuration value for a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin
- `key` (string): The configuration key
- `value` (any): The configuration value

**Example:**
```javascript
await core.api.setConfig('my-plugin', 'lastUpdated', new Date().toISOString());
```

### deleteConfig(pluginName, key)

Deletes a configuration value for a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin
- `key` (string): The configuration key

**Example:**
```javascript
await core.api.deleteConfig('my-plugin', 'tempValue');
```

## Data Storage

### getData(pluginName, key)

Gets a data value for a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin
- `key` (string): The data key

**Returns:**
- The data value or null if not found

**Example:**
```javascript
const userData = await core.api.getData('my-plugin', 'userCount');
```

### setData(pluginName, key, value)

Sets a data value for a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin
- `key` (string): The data key
- `value` (any): The data value

**Example:**
```javascript
await core.api.setData('my-plugin', 'userCount', 100);
```

### deleteData(pluginName, key)

Deletes a data value for a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin
- `key` (string): The data key

**Example:**
```javascript
await core.api.deleteData('my-plugin', 'tempData');
```

## Plugin Management

### getPlugins()

Gets a list of all installed plugins.

**Returns:**
- Array of plugin objects with status information

**Example:**
```javascript
const plugins = await core.api.getPlugins();
const enabledPlugins = plugins.filter(p => p.enabled);
```

### enablePlugin(pluginName)

Enables a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin to enable

**Example:**
```javascript
await core.api.enablePlugin('my-plugin');
```

### disablePlugin(pluginName)

Disables a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin to disable

**Example:**
```javascript
await core.api.disablePlugin('my-plugin');
```

### deletePlugin(pluginName)

Deletes a plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin to delete

**Example:**
```javascript
await core.api.deletePlugin('my-plugin');
```

## Repository Integration

### getAvailablePlugins()

Gets a list of available plugins from the repository.

**Returns:**
- Array of available plugin objects

**Example:**
```javascript
const availablePlugins = await core.api.getAvailablePlugins();
```

### installPlugin(pluginName)

Installs a plugin from the repository.

**Parameters:**
- `pluginName` (string): The name of the plugin to install

**Example:**
```javascript
await core.api.installPlugin('weather-plugin');
```

## Scheduling

### scheduleTask(cronExpression, task)

Schedules a task to run on a cron schedule.

**Parameters:**
- `cronExpression` (string): A cron expression defining when to run the task
- `task` (function): An async function to execute

**Example:**
```javascript
// Run every hour
core.api.scheduleTask('0 0 * * *', async () => {
  console.log('Hourly task executed');
});
```

### cancelScheduledTask(taskId)

Cancels a scheduled task.

**Parameters:**
- `taskId` (string): The ID of the task to cancel

**Example:**
```javascript
const taskId = core.api.scheduleTask('0 0 * * *', hourlyTask);
// Later...
core.api.cancelScheduledTask(taskId);
```

## Messaging

### emitEvent(eventName, data)

Emits an event that other plugins can listen for.

**Parameters:**
- `eventName` (string): The name of the event
- `data` (any): Data to pass with the event

**Example:**
```javascript
core.api.emitEvent('my-plugin:user-action', { userId: '123', action: 'login' });
```

### listenForEvent(eventName, handler)

Listens for events emitted by other plugins.

**Parameters:**
- `eventName` (string): The name of the event to listen for
- `handler` (function): Function to call when the event is emitted

**Example:**
```javascript
core.api.listenForEvent('my-plugin:user-action', (data) => {
  console.log(`User action: ${data.action} by user ${data.userId}`);
});
```

This API reference provides a comprehensive overview of all available methods in the Core API. Each method is designed to be simple to use while providing powerful functionality for plugin developers.