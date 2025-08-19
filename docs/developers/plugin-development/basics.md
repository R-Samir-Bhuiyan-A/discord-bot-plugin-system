# Plugin Development Basics

This guide covers the fundamentals of plugin development for the Discord Bot Plugin System. Understanding these concepts is essential for creating effective and reliable plugins.

## What is a Plugin?

A plugin is a self-contained module that extends the functionality of the Discord Bot Plugin System. Plugins can:

- Add new Discord commands
- Respond to Discord events
- Provide web API routes
- Add web UI pages
- Schedule tasks
- Store and retrieve data
- Communicate with other plugins

## Plugin Structure

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

## Plugin Lifecycle

Plugins go through a specific lifecycle managed by the core system:

### 1. Discovery
The PluginLoader scans the `plugins/` directory and discovers all plugins.

### 2. Validation
Each plugin's `plugin.json` manifest is validated for required fields and correct format.

### 3. Loading
The plugin's entry point file (`index.js`) is loaded in a sandboxed environment.

### 4. Initialization
The plugin's `init(core)` function is called, passing a reference to the core system.

### 5. Registration
During initialization, the plugin registers its functionality:
- Discord commands
- Event handlers
- Web routes
- Web pages

### 6. Activation
If the plugin is enabled, it becomes active and functional.

### 7. Destruction
When a plugin is disabled or removed, its `destroy()` function is called for cleanup.

## Creating a New Plugin

To create a new plugin, follow these steps:

1. Create a new directory in the `plugins/` folder with your plugin name (use kebab-case)
2. Create a `plugin.json` manifest file
3. Create an `index.js` entry point file
4. Implement the `init(core)` and `destroy()` functions
5. Register your plugin's functionality

### Example Plugin Structure

Let's create a simple plugin that adds a Discord command and a web page:

```bash
mkdir plugins/greeting-plugin
cd plugins/greeting-plugin
touch plugin.json index.js
mkdir discord web
mkdir discord/commands web/pages
```

### Plugin Manifest (`plugin.json`)

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

### Plugin Entry Point (`index.js`)

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

### Discord Command Handler (`discord/commands/greet.js`)

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

### Web Page Component (`web/pages/GreetingPage.js`)

```javascript
// This is a simplified example. In practice, you would use React components.
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

## Plugin Best Practices

### 1. Follow Naming Conventions
- Use kebab-case for directory and file names
- Use camelCase for function and variable names
- Use PascalCase for class and component names

### 2. Handle Errors Gracefully
- Always wrap async operations in try/catch blocks
- Provide meaningful error messages to users
- Log errors with sufficient context for debugging

### 3. Use the Logging System
- Get a logger with `core.api.getLogger('plugin-name')`
- Log important events and errors
- Use appropriate log levels (debug, info, warn, error)

### 4. Clean Up Resources
- Implement the `destroy()` function to clean up resources
- Close database connections, clear intervals, etc.
- Unregister event listeners if necessary

### 5. Validate Inputs
- Validate all user inputs and parameters
- Sanitize data before processing
- Provide clear feedback for invalid inputs

### 6. Write Documentation
- Include a comprehensive README.md
- Document all commands and features
- Provide usage examples

## Plugin Manifest Deep Dive

The `plugin.json` file is crucial for plugin functionality. Here's a detailed breakdown of all fields:

```json
{
  "name": "plugin-identifier",           // Required: Unique plugin identifier
  "version": "1.0.0",                   // Required: Semantic version
  "author": "Author Name",              // Required: Plugin author
  "description": "Plugin description",  // Required: Brief description
  "compatibility": {                    // Optional: Compatibility requirements
    "core": ">=1.0.0"                   // Minimum core version required
  },
  "permissions": {                      // Required: Permissions needed
    "discord": ["commands", "events"],  // Discord permissions
    "web": ["routes", "pages"]          // Web permissions
  },
  "dependencies": ["other-plugin"],     // Optional: Plugin dependencies
  "entry": "./index.js"                 // Required: Entry point file
}
```

## Conclusion

Understanding these basics is essential for effective plugin development. As you become more familiar with the system, you'll be able to create more complex and powerful plugins. Refer to the specific guides in this section for detailed information on implementing different aspects of your plugins.

Next, you might want to explore:
- [Plugin Manifest](manifest.md) for more details on the manifest file
- [Discord Integration](discord.md) for implementing Discord commands and events
- [Web UI Integration](web-ui.md) for adding web routes and pages
- [Data Storage](storage.md) for persisting plugin data