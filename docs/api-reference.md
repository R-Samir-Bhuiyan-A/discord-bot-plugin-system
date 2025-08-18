# API Reference

This document describes the core API that plugins can use to extend the system.

## Core API

The `core.api` object provides methods for plugins to register functionality.

### registerCommand(name, description, handler)

Registers a new Discord command.

- `name` (string): The command name
- `description` (string): The command description
- `handler` (function): The function to call when the command is used

Example:
```javascript
core.api.registerCommand('hello', 'Say hello', async (interaction) => {
  await interaction.reply('Hello, world!');
});
```

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

Registers a new web route.

- `path` (string): The URL path
- `handler` (function): The function to call when the route is accessed

Example:
```javascript
core.api.registerRoute('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});
```

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