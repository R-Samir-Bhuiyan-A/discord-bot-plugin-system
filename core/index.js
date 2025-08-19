// core/index.js
const DiscordManager = require('./discord');
const WebServer = require('./web');
const PluginLoader = require('./loader');
const PluginRepository = require('./repo');
const API = require('./api');
const Logger = require('./logger');

class CoreSystem {
  constructor() {
    this.discord = new DiscordManager(this);
    this.web = new WebServer(this);
    this.plugins = new PluginLoader(this);
    this.repo = new PluginRepository(this);
    this.logger = new Logger(this);
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
    this.api.deletePlugin = this.plugins.deletePlugin.bind(this.plugins);
    this.api.getPlugins = this.plugins.getPlugins.bind(this.plugins);
    
    // Bind repository functions to API
    this.api.getAvailablePlugins = this.repo.getAvailablePlugins.bind(this.repo);
    this.api.installPlugin = this.repo.installPlugin.bind(this.repo);
  }

  async start() {
    try {
      console.log('Starting core system...');
      
      // Initialize components in order
      await this.discord.init();
      await this.web.init();
      await this.plugins.init();
      
      // Register core API routes for plugin management
      await this.registerCoreAPIRoutes();
      
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
  
  // Register core API routes for plugin management
  async registerCoreAPIRoutes() {
    // Get list of installed plugins
    this.api.registerRoute('/api/plugins', (req, res) => {
      try {
        const plugins = this.api.getPlugins();
        res.json(plugins);
      } catch (error) {
        console.error('Error fetching plugins:', error);
        res.statusCode = 500;
        res.json({ error: 'Failed to fetch plugins' });
      }
    });
    
    // Enable a plugin
    this.api.registerRoute('/api/plugins/enable', async (req, res) => {
      try {
        const { pluginName } = req.body;
        if (!pluginName) {
          res.statusCode = 400;
          return res.json({ error: 'Plugin name is required' });
        }
        
        console.log(`API request to enable plugin: ${pluginName}`);
        console.log(`About to call this.api.enablePlugin(${pluginName})`);
        await this.api.enablePlugin(pluginName);
        console.log(`Successfully enabled plugin: ${pluginName}`);
        res.json({ message: `Plugin ${pluginName} enabled successfully` });
      } catch (error) {
        console.error('Error enabling plugin:', error);
        console.error('Error stack:', error.stack);
        res.statusCode = 500;
        res.json({ error: error.message || 'Failed to enable plugin' });
      }
    });
    
    // Disable a plugin
    this.api.registerRoute('/api/plugins/disable', async (req, res) => {
      try {
        const { pluginName } = req.body;
        if (!pluginName) {
          res.statusCode = 400;
          return res.json({ error: 'Plugin name is required' });
        }
        
        console.log(`API request to disable plugin: ${pluginName}`);
        console.log(`About to call this.api.disablePlugin(${pluginName})`);
        await this.api.disablePlugin(pluginName);
        console.log(`Successfully disabled plugin: ${pluginName}`);
        res.json({ message: `Plugin ${pluginName} disabled successfully` });
      } catch (error) {
        console.error('Error disabling plugin:', error);
        console.error('Error stack:', error.stack);
        res.statusCode = 500;
        res.json({ error: error.message || 'Failed to disable plugin' });
      }
    });
    
    // Delete a plugin
    this.api.registerRoute('/api/plugins/delete', async (req, res) => {
      try {
        const { pluginName } = req.body;
        if (!pluginName) {
          res.statusCode = 400;
          return res.json({ error: 'Plugin name is required' });
        }
        
        console.log(`API request to delete plugin: ${pluginName}`);
        await this.api.deletePlugin(pluginName);
        res.json({ message: `Plugin ${pluginName} deleted successfully` });
      } catch (error) {
        console.error('Error deleting plugin:', error);
        res.statusCode = 500;
        res.json({ error: error.message || 'Failed to delete plugin' });
      }
    });
    
    // Get list of available plugins from repository
    this.api.registerRoute('/api/repo/plugins', async (req, res) => {
      try {
        const plugins = await this.api.getAvailablePlugins();
        res.json(plugins);
      } catch (error) {
        console.error('Error fetching available plugins:', error);
        res.statusCode = 500;
        res.json({ error: error.message || 'Failed to fetch available plugins' });
      }
    });
    
    // Install a plugin from repository
    this.api.registerRoute('/api/repo/install', async (req, res) => {
      try {
        const { pluginName } = req.body;
        if (!pluginName) {
          res.statusCode = 400;
          return res.json({ error: 'Plugin name is required' });
        }
        
        console.log(`API request to install plugin: ${pluginName}`);
        await this.api.installPlugin(pluginName);
        res.json({ message: `Plugin ${pluginName} installed successfully` });
      } catch (error) {
        console.error('Error installing plugin:', error);
        res.statusCode = 500;
        res.json({ error: error.message || 'Failed to install plugin' });
      }
    });
    
    // Get bot status
    this.api.registerRoute('/api/bot/status', (req, res) => {
      try {
        const status = this.discord.getBotStatus();
        res.json(status);
      } catch (error) {
        console.error('Error fetching bot status:', error);
        res.statusCode = 500;
        res.json({ error: 'Failed to fetch bot status' });
      }
    });
    
    console.log('Registered core API routes for plugin management');
  }
}

module.exports = CoreSystem;