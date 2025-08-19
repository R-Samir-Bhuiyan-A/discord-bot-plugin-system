# Plugin Entry Point

The entry point is the main file that the core system loads when initializing your plugin. It's responsible for setting up your plugin and registering its functionality with the core system.

## Structure

The entry point file (usually `index.js`) must export an object with specific functions that the core system can call:

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

## The `init(core)` Function

The `init(core)` function is called when your plugin is being initialized. It receives a `core` object that provides access to the core system's API.

### Parameters

- **core**: An object containing references to the core system and its APIs

### Core Object Structure

The `core` object provides access to all core functionality:

```javascript
{
  api: {
    // Plugin registration functions
    registerCommand(name, description, handler),
    registerEvent(event, handler),
    registerRoute(path, handler),
    registerPage(path, component),
    
    // Utility functions
    getLogger(name),
    getConfig(pluginName, key),
    setConfig(pluginName, key, value),
    getData(pluginName, key),
    setData(pluginName, key, value),
    deleteData(pluginName, key),
    
    // Plugin management functions
    enablePlugin(pluginName),
    disablePlugin(pluginName),
    deletePlugin(pluginName),
    getPlugins(),
    
    // Repository functions
    getAvailablePlugins(),
    installPlugin(pluginName)
  },
  
  // References to core components
  discord: DiscordManager,
  web: WebServer,
  plugins: PluginLoader,
  repo: PluginRepository,
  logger: Logger,
  
  // System information
  version: "1.0.0"
}
```

### Example Implementation

```javascript
// index.js
const { handleWeatherCommand } = require('./discord/commands/weather');
const { handleGuildCreate } = require('./discord/events/guildCreate');
const { getWeatherRoute } = require('./web/routes/weather');
const WeatherPage = require('./web/pages/WeatherPage');

async function init(core) {
  // Get a logger for this plugin
  const logger = core.api.getLogger('weather-plugin');
  logger.info('Initializing weather-plugin');
  
  // Register Discord commands
  core.api.registerCommand(
    'weather', 
    'Get weather information for a location', 
    handleWeatherCommand
  );
  
  // Register Discord event handlers
  core.api.registerEvent('guildCreate', handleGuildCreate);
  
  // Register web routes
  core.api.registerRoute('/api/weather', getWeatherRoute);
  
  // Register web pages
  core.api.registerPage('/weather', WeatherPage);
  
  logger.info('weather-plugin initialized successfully');
}

async function destroy() {
  console.log('weather-plugin destroyed');
  // Cleanup code (if needed)
}

module.exports = {
  init,
  destroy
};
```

## The `destroy()` Function

The `destroy()` function is called when your plugin is being disabled or removed. It's your opportunity to clean up any resources your plugin has allocated.

### Purpose

- Clean up timers, intervals, or timeouts
- Close database connections
- Unsubscribe from events
- Remove temporary files
- Free up any other resources

### Example Implementation

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

## Error Handling

Proper error handling in your entry point is crucial for plugin stability:

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

async function destroy() {
  try {
    // Cleanup code
    await cleanupPlugin();
    
    console.log('my-plugin destroyed successfully');
  } catch (error) {
    console.error('Error during plugin destruction:', error);
    // Note: Errors in destroy() won't prevent plugin from being disabled
  }
}

module.exports = {
  init,
  destroy
};
```

## Asynchronous Operations

Both `init()` and `destroy()` functions can be asynchronous, allowing you to perform async operations during initialization and cleanup:

```javascript
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  // Wait for async operations to complete
  await initializeDatabase();
  await loadConfiguration();
  await connectToExternalService();
  
  logger.info('All async operations completed');
}

async function destroy() {
  // Wait for cleanup operations to complete
  await closeDatabaseConnections();
  await disconnectFromExternalService();
  
  console.log('All cleanup operations completed');
}
```

## Best Practices

### 1. Keep Initialization Lightweight

While you can perform async operations during initialization, keep them lightweight to prevent slowing down the overall system startup:

```javascript
// Good: Quick initialization with background setup
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  // Register functionality immediately
  core.api.registerCommand('my-command', 'Description', handler);
  
  // Perform heavy initialization in background
  initializeInBackground(core).catch(error => {
    logger.error('Background initialization failed:', error);
  });
  
  logger.info('my-plugin initialized');
}
```

### 2. Handle Initialization Failures Gracefully

If your plugin fails to initialize, it shouldn't crash the entire system:

```javascript
async function init(core) {
  try {
    const logger = core.api.getLogger('my-plugin');
    
    // Attempt to initialize
    await initializePlugin(core);
    
    logger.info('my-plugin initialized successfully');
  } catch (error) {
    // Log the error but don't re-throw unless it's critical
    console.error('Non-critical initialization error:', error);
    // Plugin will still be considered loaded but may have limited functionality
  }
}
```

### 3. Clean Up All Resources

Ensure your `destroy()` function cleans up all resources:

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

### 4. Use Logging Appropriately

Log important events but avoid excessive logging:

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

## Common Patterns

### Configuration-Based Initialization

```javascript
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  // Get configuration
  const apiKey = await core.api.getConfig('my-plugin', 'apiKey');
  const enableFeature = await core.api.getConfig('my-plugin', 'enableFeature') || false;
  
  if (!apiKey) {
    logger.warn('API key not configured, some features may be disabled');
  }
  
  // Conditionally register functionality
  if (enableFeature) {
    core.api.registerCommand('feature-command', 'Feature command', handler);
  }
  
  logger.info('my-plugin initialized with configuration');
}
```

### Dependency Checking

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

By following these guidelines and patterns, you'll create robust plugin entry points that integrate well with the Discord Bot Plugin System and provide a good user experience.