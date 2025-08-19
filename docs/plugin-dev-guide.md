# Plugin Development Guide

This guide explains how to create plugins for the Discord Bot Plugin System.

## Plugin Structure

All plugins must follow this structure:

```
plugin-name/
├── plugin.json
├── index.js
├── discord/
└── web/
```

## plugin.json

Every plugin must include a `plugin.json` file with the following format:

```json
{
  "name": "example-plugin",
  "version": "1.0.0",
  "author": "Author Name",
  "description": "A sample plugin that adds a Discord command and a Web UI page.",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": ["other-plugin-name"],
  "entry": "./index.js"
}
```

### Fields in plugin.json

- `name` (string, required): The unique name of the plugin
- `version` (string, required): The version of the plugin using semantic versioning
- `author` (string, required): The author of the plugin
- `description` (string, required): A brief description of what the plugin does
- `compatibility` (object, optional): Compatibility requirements with the core system
  - `core` (string): Version requirement for the core system (e.g., ">=1.0.0")
- `permissions` (object, optional): Permissions required by the plugin
  - `discord` (array): Discord permissions (e.g., ["commands", "events"])
  - `web` (array): Web permissions (e.g., ["routes", "pages"])
- `dependencies` (array, optional): List of other plugins this plugin depends on
- `entry` (string, required): Path to the plugin's entry point file

## Plugin Entry Point

The entry point (usually `index.js`) should export functions that the core system can call:

```javascript
module.exports = {
  // Initialize the plugin
  async init(core) {
    // Plugin initialization code
  },
  
  // Clean up when plugin is disabled
  async destroy() {
    // Cleanup code
  }
};
```

### Plugin Lifecycle Methods

- `init(core)`: Called when the plugin is loaded and enabled. This is where you register commands, routes, etc.
- `destroy()`: Called when the plugin is disabled or the system is shutting down. This is where you clean up resources.

## Discord Integration

Plugins can interact with Discord through the core API:

```javascript
module.exports = {
  async init(core) {
    // Register a Discord command
    core.api.registerCommand('hello', 'Say hello', async (interaction) => {
      await interaction.reply('Hello, world!');
    });
    
    // Register an event handler
    core.api.registerEvent('messageCreate', (message) => {
      console.log(`New message: ${message.content}`);
    });
  }
};
```

### Available Discord Methods

- `core.api.registerCommand(name, description, handler)`: Register a new Discord slash command
- `core.api.registerEvent(event, handler)`: Register an event handler for Discord events

## Web UI Integration

Plugins can add pages to the Web UI:

```javascript
module.exports = {
  async init(core) {
    // Register a web route
    core.api.registerRoute('/hello', (req, res) => {
      res.send('Hello from plugin!');
    });
    
    // Register a web page
    core.api.registerPage('/dashboard', DashboardComponent);
  }
};
```

### Available Web Methods

- `core.api.registerRoute(path, handler)`: Register a new web route
- `core.api.registerPage(path, component)`: Register a new web page

## Logging

Plugins can use the centralized logging system provided by the core:

```javascript
module.exports = {
  async init(core) {
    // Get a logger for this plugin
    const logger = core.api.getLogger('my-plugin');
    
    // Log messages at different levels
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
  }
};
```

The logging system supports the following levels:
- `debug`: Detailed debug information
- `info`: General information about plugin operations
- `warn`: Warning messages about potential issues
- `error`: Error messages about failures

The log level can be configured through the `LOG_LEVEL` environment variable.

## Plugin Lifecycle

Plugins have a specific lifecycle managed by the core system:

1. **Loading**: When the system starts, it loads all plugins from the `plugins/` directory
2. **Initialization**: The `init(core)` function is called for each plugin
3. **Enable/Disable**: Plugins can be enabled or disabled at runtime through the Web UI
4. **Deletion**: Plugins can be permanently deleted through the Web UI
5. **Destruction**: The `destroy()` function is called when a plugin is disabled or the system shuts down

When a plugin is disabled, its state is persisted so it remains disabled after a system restart.
When a plugin is deleted, all its files are permanently removed from the system.

When a plugin is disabled:
- All commands registered by that plugin are automatically unregistered from Discord
- All web routes registered by that plugin are automatically unregistered
- The plugin's `destroy()` function is called

When a plugin is re-enabled:
- The plugin's `init(core)` function is called again
- Commands and routes are re-registered

## Plugin Templates

To help developers get started quickly, we provide a plugin template that includes the basic structure and example code. You can copy this template and modify it to create your own plugins.

## Best Practices

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

## Example Plugins

We've created several example plugins to demonstrate different aspects of the plugin system:

1. **example-plugin**: A simple plugin that registers a Discord command and a web route
2. **error-test-plugin**: A plugin that throws an error to verify sandboxing

You can find these example plugins in the `plugins/` directory of the project repository.

## Plugin Distribution

Plugins can be distributed in two ways:

1. **Manual Installation**: Users can copy plugin files directly to the `plugins/` directory
2. **Repository Installation**: Users can install plugins from a plugin repository through the Web UI

To make your plugin available through the repository, you need to:
1. Create a plugin manifest (`plugin.json`)
2. Host your plugin files on a web server
3. Add your plugin to the repository's plugin list (`plugins.json`)

For more information on creating a plugin repository, see the repository documentation.

## Troubleshooting

If you encounter issues while developing or using plugins, check the following:

1. Verify that your `plugin.json` file is correctly formatted and contains all required fields
2. Check that your entry point file exports the required functions (`init` and `destroy`)
3. Ensure that your plugin's dependencies are installed and compatible
4. Look at the system logs for error messages that might indicate the cause of the issue
5. Test your plugin in isolation to identify conflicts with other plugins
6. Verify that your plugin is compatible with the current version of the core system
7. Check that you're using the core API correctly according to the API reference
8. Make sure your plugin doesn't exceed resource limits or timeout during initialization

If you're still having trouble, you can reach out to the community for help or file an issue on the project repository.