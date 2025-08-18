// core/index.js
const DiscordManager = require('./discord');
const WebServer = require('./web');
const PluginLoader = require('./loader');
const API = require('./api');

class CoreSystem {
  constructor() {
    this.discord = new DiscordManager(this);
    this.web = new WebServer(this);
    this.plugins = new PluginLoader(this);
    this.api = new API(this);
    
    // Bind API to this context
    this.api.registerCommand = this.api.registerCommand.bind(this.api);
    this.api.registerEvent = this.api.registerEvent.bind(this.api);
    this.api.registerRoute = this.api.registerRoute.bind(this.api);
    this.api.registerPage = this.api.registerPage.bind(this.api);
    this.api.getLogger = this.api.getLogger.bind(this.api);
    
    // Bind plugin management functions to API
    this.api.enablePlugin = this.plugins.enablePlugin.bind(this.plugins);
    this.api.disablePlugin = this.plugins.disablePlugin.bind(this.plugins);
    this.api.getPlugins = this.plugins.getPlugins.bind(this.plugins);
  }

  async start() {
    try {
      console.log('Starting core system...');
      
      // Initialize components in order
      await this.discord.init();
      await this.web.init();
      await this.plugins.init();
      
      // Register Discord commands after plugins are loaded
      await this.discord.registerCommands();
      
      console.log('Core system started successfully');
    } catch (error) {
      console.error('Failed to start core system:', error);
      process.exit(1);
    }
  }

  async stop() {
    try {
      console.log('Stopping core system...');
      
      // Clean up components
      await this.plugins.destroy();
      await this.web.destroy();
      await this.discord.destroy();
      
      console.log('Core system stopped successfully');
    } catch (error) {
      console.error('Error while stopping core system:', error);
    }
  }
}

module.exports = CoreSystem;