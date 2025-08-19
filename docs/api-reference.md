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

## Plugin Development

### Creating a New Plugin

To create a new plugin, follow these steps:

1. Create a new directory in the `plugins/` folder with your plugin name
2. Create a `plugin.json` file with the required metadata
3. Create an entry point file (usually `index.js`)
4. Implement the `init(core)` and `destroy()` functions
5. Register commands, events, routes, or pages as needed

Example `plugin.json`:
```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "An awesome plugin that does amazing things",
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

Example `index.js`:
```javascript
module.exports = {
  async init(core) {
    // Get a logger for this plugin
    const logger = core.api.getLogger('my-awesome-plugin');
    
    // Register a Discord command
    core.api.registerCommand('awesome', 'An awesome command', async (interaction) => {
      await interaction.reply('This is an awesome command!');
    });
    
    // Register a web route
    core.api.registerRoute('/api/awesome', (req, res) => {
      res.json({ message: 'Hello from the awesome plugin!' });
    });
    
    logger.info('My awesome plugin has been initialized');
  },
  
  async destroy() {
    // Cleanup code (if needed)
    console.log('My awesome plugin has been destroyed');
  }
};
```

### Best Practices for Plugin Development

1. Always validate inputs and handle errors gracefully
2. Use the logging system to provide useful information about your plugin's operation
3. Clean up resources in the `destroy()` function
4. Document your plugin's functionality and configuration options
5. Test your plugin thoroughly before distributing it
6. Follow semantic versioning for your plugin releases
7. Clearly specify compatibility requirements and dependencies
8. Use descriptive names for commands and routes to avoid conflicts
9. Provide clear error messages when operations fail
10. Respect user privacy and only collect necessary data

## Core System Architecture

The core system is designed to be modular and extensible. It consists of several key components:

1. **CoreSystem**: The main class that initializes and manages all other components
2. **DiscordManager**: Handles Discord connection and command registration
3. **WebServer**: Manages the web server and routes
4. **PluginLoader**: Loads and manages plugins
5. **PluginRepository**: Handles plugin installation from repositories
6. **API**: Provides the API that plugins use to register functionality
7. **PluginSandbox**: Runs plugins in isolated contexts to prevent crashes

Each component has a specific responsibility and interacts with others through well-defined interfaces.

### Core System Lifecycle

1. **Initialization**: The core system initializes all components in the correct order
2. **Plugin Loading**: The PluginLoader loads all plugins from the `plugins/` directory
3. **Plugin Initialization**: Each plugin's `init(core)` function is called
4. **Command Registration**: Discord commands are registered with the Discord API
5. **Web Server Start**: The web server starts listening for requests
6. **Runtime**: The system runs, handling Discord events and web requests
7. **Shutdown**: When shutting down, plugins' `destroy()` functions are called and components are cleaned up

## Web UI Components

The Web UI is built with Next.js and React. It includes several reusable components:

### Layout Component

The Layout component provides consistent navigation across all pages. It includes:
- A navigation bar with links to main sections
- A footer with copyright information
- Responsive design for different screen sizes

### Custom CSS Classes

The system includes several custom CSS classes for consistent styling:

- `.btn`: Base button styles
- `.btn-primary`, `.btn-secondary`, `.btn-success`, `.btn-warning`, `.btn-danger`: Different button variants
- `.card`: Card component for content sections
- `.badge`: Badge component for status indicators
- `.input`, `.textarea`: Form input components
- `.alert`: Alert component for messages
- Various layout and typography classes

## Environment Variables

The system uses environment variables for configuration:

- `DISCORD_TOKEN`: The Discord bot token
- `PORT`: The port for the web server (default: 3000)
- `NODE_ENV`: The environment (development, production)
- `LOG_LEVEL`: The logging level (DEBUG, INFO, WARN, ERROR)

## Testing

The system includes automated tests for core functionality:

- Plugin loading and management
- API endpoint functionality
- Discord command registration
- Web route handling
- Plugin sandboxing
- Repository functionality

Tests are written with Jest and can be run with `npm test`.

## Deployment

To deploy the system:

1. Install dependencies with `npm install`
2. Set environment variables
3. Build the web UI with `npm run build`
4. Start the system with `npm start`

For development, you can use `npm run dev` to start the system with hot reloading.

## Contributing

We welcome contributions to the project. To contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Write tests for your changes
5. Run the test suite to ensure everything works
6. Submit a pull request

Please follow the coding style used in the project and provide clear commit messages.