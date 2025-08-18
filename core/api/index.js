// core/api/index.js
class API {
  constructor(core) {
    this.core = core;
    this.commands = new Map();
    this.events = new Map();
    this.routes = new Map();
    this.pages = new Map();
    this.pluginRoutes = new Map(); // Track routes registered by each plugin
  }

  // Register a Discord command
  registerCommand(name, description, handler) {
    if (typeof name !== 'string' || typeof description !== 'string' || typeof handler !== 'function') {
      throw new Error('Invalid parameters for registerCommand');
    }
    
    this.commands.set(name, { description, handler });
    console.log(`Registered command: ${name}`);
  }
  
  // Register a Discord command from a plugin
  registerPluginCommand(pluginName, name, description, handler) {
    if (typeof name !== 'string' || typeof description !== 'string' || typeof handler !== 'function') {
      throw new Error('Invalid parameters for registerCommand');
    }
    
    // Delegate to DiscordManager for plugin-specific command registration
    this.core.discord.registerPluginCommand(pluginName, name, description, handler);
  }

  // Register an event handler
  registerEvent(event, handler) {
    if (typeof event !== 'string' || typeof handler !== 'function') {
      throw new Error('Invalid parameters for registerEvent');
    }
    
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    this.events.get(event).push(handler);
    console.log(`Registered event handler for: ${event}`);
  }

  // Register a web route
  registerRoute(path, handler) {
    if (typeof path !== 'string' || typeof handler !== 'function') {
      throw new Error('Invalid parameters for registerRoute');
    }
    
    this.routes.set(path, handler);
    console.log(`Registered route: ${path}`);
  }
  
  // Register a web route from a plugin
  registerPluginRoute(pluginName, path, handler) {
    if (typeof path !== 'string' || typeof handler !== 'function') {
      throw new Error('Invalid parameters for registerRoute');
    }
    
    // Track the route for this plugin
    if (!this.pluginRoutes.has(pluginName)) {
      this.pluginRoutes.set(pluginName, []);
    }
    this.pluginRoutes.get(pluginName).push(path);
    
    // Register the route
    this.routes.set(path, handler);
    console.log(`Registered plugin route: ${path}`);
  }
  
  // Unregister all routes associated with a plugin
  unregisterPluginRoutes(pluginName) {
    if (this.pluginRoutes.has(pluginName)) {
      const routes = this.pluginRoutes.get(pluginName);
      for (const path of routes) {
        this.routes.delete(path);
        console.log(`Unregistered plugin route: ${path}`);
      }
      this.pluginRoutes.delete(pluginName);
    }
  }

  // Register a web page
  registerPage(path, component) {
    if (typeof path !== 'string') {
      throw new Error('Invalid parameters for registerPage');
    }
    
    this.pages.set(path, component);
    console.log(`Registered page: ${path}`);
  }

  // Get a logger instance
  getLogger(name) {
    return {
      info: (message) => console.log(`[INFO] [${name}] ${message}`),
      warn: (message) => console.warn(`[WARN] [${name}] ${message}`),
      error: (message) => console.error(`[ERROR] [${name}] ${message}`),
      debug: (message) => console.debug(`[DEBUG] [${name}] ${message}`)
    };
  }
  
  // Plugin management functions (bound to PluginLoader in CoreSystem)
  // These will be bound to PluginLoader instance
  enablePlugin(pluginName) {
    // This will be bound to PluginLoader.enablePlugin
    throw new Error('enablePlugin not bound to PluginLoader');
  }
  
  disablePlugin(pluginName) {
    // This will be bound to PluginLoader.disablePlugin
    throw new Error('disablePlugin not bound to PluginLoader');
  }
  
  deletePlugin(pluginName) {
    // This will be bound to PluginLoader.deletePlugin
    throw new Error('deletePlugin not bound to PluginLoader');
  }
  
  getPlugins() {
    // This will be bound to PluginLoader.getPlugins
    throw new Error('getPlugins not bound to PluginLoader');
  }
  
  // Repository functions (bound to PluginRepository in CoreSystem)
  // These will be bound to PluginRepository instance
  getAvailablePlugins() {
    // This will be bound to PluginRepository.getAvailablePlugins
    throw new Error('getAvailablePlugins not bound to PluginRepository');
  }
  
  installPlugin(pluginName) {
    // This will be bound to PluginRepository.installPlugin
    throw new Error('installPlugin not bound to PluginRepository');
  }
}

module.exports = API;