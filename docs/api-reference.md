# API Reference

This document describes the core API that plugins can use to extend the system.

## Core API

The `core.api` object provides methods for plugins to register functionality.

### registerCommand(name, description, handler)

Registers a new Discord command. This method is used internally by the core system. Plugins should use the plugin-specific version.

- `name` (string): The command name
- `description` (string): The command description
- `handler` (function): The function to call when the command is used

### registerPluginCommand(pluginName, name, description, handler)

Registers a new Discord command from a plugin. This is the plugin-specific version that tracks command ownership.

- `pluginName` (string): The name of the plugin registering the command
- `name` (string): The command name
- `description` (string): The command description
- `handler` (function): The function to call when the command is used

### registerEvent(event, handler)

Registers an event handler.

- `event` (string): The event name
- `handler` (function): The function to call when the event occurs

Example:
```javascript
core.api.registerEvent('messageCreate', (message) => {
  console.log(`New message: ${message.content}`);
});
```

### registerRoute(path, handler)

Registers a new web route. This method is used internally by the core system. Plugins should use the plugin-specific version.

- `path` (string): The URL path
- `handler` (function): The function to call when the route is accessed

### registerPluginRoute(pluginName, path, handler)

Registers a new web route from a plugin. This is the plugin-specific version that tracks route ownership.

- `pluginName` (string): The name of the plugin registering the route
- `path` (string): The URL path
- `handler` (function): The function to call when the route is accessed

### registerPage(path, component)

Registers a new web page.

- `path` (string): The URL path
- `component` (React component): The React component to render

Example:
```javascript
core.api.registerPage('/dashboard', DashboardComponent);
```

### getLogger(name)

Gets a logger instance for the plugin.

- `name` (string): The logger name

Example:
```javascript
const logger = core.api.getLogger('my-plugin');
logger.info('Plugin loaded');
```

### unregisterPluginRoutes(pluginName)

Unregisters all web routes associated with a plugin.

- `pluginName` (string): The name of the plugin whose routes should be unregistered

## Logger API

The core system provides a centralized logging system with configurable levels:

### debug(namespace, message)

Logs a debug message.

- `namespace` (string): The namespace for the log message
- `message` (string): The log message

### info(namespace, message)

Logs an info message.

- `namespace` (string): The namespace for the log message
- `message` (string): The log message

### warn(namespace, message)

Logs a warning message.

- `namespace` (string): The namespace for the log message
- `message` (string): The log message

### error(namespace, message)

Logs an error message.

- `namespace` (string): The namespace for the log message
- `message` (string): The log message

### getLogger(namespace)

Gets a logger instance for a specific namespace.

- `namespace` (string): The namespace for the logger

Example:
```javascript
const logger = core.logger.getLogger('my-plugin');
logger.info('Plugin loaded');
```

### setLogLevel(level)

Sets the log level.

- `level` (string): The log level (DEBUG, INFO, WARN, ERROR)

## Plugin Management API

The core system also provides API endpoints for managing plugins through the Web UI:

### GET /api/plugins

Get a list of all installed plugins with their current status (enabled/disabled).

### POST /api/plugins/enable

Enable a plugin.

- Body: `{ "pluginName": "plugin-name" }`

### POST /api/plugins/disable

Disable a plugin.

- Body: `{ "pluginName": "plugin-name" }`

### POST /api/plugins/delete

Delete a plugin permanently.

- Body: `{ "pluginName": "plugin-name" }`

### GET /api/repo/plugins

Get a list of available plugins from the repository.

### POST /api/repo/install

Install a plugin from the repository.

- Body: `{ "pluginName": "plugin-name" }`

## Bot Status API

### GET /api/bot/status

Get the current status of the Discord bot.

Response:
```json
{
  "status": "online|connecting|disconnected",
  "username": "BotUsername#0000",
  "guildCount": 10,
  "userCount": 1000,
  "uptime": 3600000
}
```