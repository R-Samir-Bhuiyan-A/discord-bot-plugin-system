// core/loader/index.js
const fs = require('fs').promises;
const path = require('path');
const PluginSandbox = require('../sandbox');

class PluginLoader {
  constructor(core) {
    this.core = core;
    this.plugins = new Map(); // All loaded plugins
    this.enabledPlugins = new Map(); // Currently enabled plugins
    this.pluginPath = path.join(__dirname, '..', '..', 'plugins');
    this.sandbox = new PluginSandbox(core);
  }

  async init() {
    try {
      // Create plugins directory if it doesn't exist
      try {
        await fs.access(this.pluginPath);
      } catch (error) {
        await fs.mkdir(this.pluginPath, { recursive: true });
      }

      // Load all plugins
      const pluginDirs = await fs.readdir(this.pluginPath);
      
      for (const dir of pluginDirs) {
        const pluginDir = path.join(this.pluginPath, dir);
        const stat = await fs.stat(pluginDir);
        
        if (stat.isDirectory()) {
          await this.loadPlugin(dir);
        }
      }
      
      console.log(`Loaded ${this.plugins.size} plugins`);
    } catch (error) {
      console.error('Failed to initialize plugin loader:', error);
      throw error;
    }
  }

  async loadPlugin(pluginName) {
    try {
      const pluginDir = path.join(this.pluginPath, pluginName);
      const manifestPath = path.join(pluginDir, 'plugin.json');
      
      // Read plugin manifest
      const manifestData = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestData);
      
      // Validate manifest
      if (!manifest.name || !manifest.entry) {
        throw new Error('Invalid plugin manifest: missing required fields');
      }
      
      // Check compatibility
      if (manifest.compatibility && manifest.compatibility.core) {
        // In a real implementation, we would check version compatibility here
        console.log(`Plugin ${pluginName} has compatibility requirements: ${manifest.compatibility.core}`);
      }
      
      // Load plugin entry point
      const entryPath = path.join(pluginDir, manifest.entry);
      const pluginModule = require(entryPath);
      
      // Store plugin reference
      this.plugins.set(pluginName, {
        manifest,
        module: pluginModule,
        enabled: false
      });
      
      console.log(`Loaded plugin: ${pluginName}`);
      
      // Enable the plugin by default
      await this.enablePlugin(pluginName);
    } catch (error) {
      console.error(`Failed to load plugin ${pluginName}:`, error);
    }
  }

  async unloadPlugin(pluginName) {
    try {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) {
        throw new Error(`Plugin ${pluginName} is not loaded`);
      }
      
      // Disable plugin if it's enabled
      if (plugin.enabled) {
        await this.disablePlugin(pluginName);
      }
      
      // Remove plugin reference
      this.plugins.delete(pluginName);
      
      console.log(`Unloaded plugin: ${pluginName}`);
    } catch (error) {
      console.error(`Failed to unload plugin ${pluginName}:`, error);
    }
  }

  async enablePlugin(pluginName) {
    try {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) {
        throw new Error(`Plugin ${pluginName} is not loaded`);
      }
      
      if (plugin.enabled) {
        console.log(`Plugin ${pluginName} is already enabled`);
        return;
      }
      
      // Initialize plugin in sandbox
      try {
        await this.sandbox.runPluginMethod(pluginName, plugin.module, 'init', this.core);
      } catch (error) {
        console.error(`Failed to initialize plugin ${pluginName} in sandbox:`, error);
        throw error;
      }
      
      // Mark plugin as enabled
      plugin.enabled = true;
      this.enabledPlugins.set(pluginName, plugin);
      
      console.log(`Enabled plugin: ${pluginName}`);
    } catch (error) {
      console.error(`Failed to enable plugin ${pluginName}:`, error);
    }
  }

  async disablePlugin(pluginName) {
    try {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) {
        throw new Error(`Plugin ${pluginName} is not loaded`);
      }
      
      if (!plugin.enabled) {
        console.log(`Plugin ${pluginName} is already disabled`);
        return;
      }
      
      // Destroy plugin in sandbox
      try {
        await this.sandbox.runPluginMethod(pluginName, plugin.module, 'destroy');
      } catch (error) {
        console.error(`Failed to destroy plugin ${pluginName} in sandbox:`, error);
      }
      
      // Mark plugin as disabled
      plugin.enabled = false;
      this.enabledPlugins.delete(pluginName);
      
      console.log(`Disabled plugin: ${pluginName}`);
    } catch (error) {
      console.error(`Failed to disable plugin ${pluginName}:`, error);
    }
  }

  async destroy() {
    // Disable all plugins
    for (const [pluginName] of this.enabledPlugins) {
      await this.disablePlugin(pluginName);
    }
    
    // Unload all plugins
    for (const [pluginName] of this.plugins) {
      await this.unloadPlugin(pluginName);
    }
  }
  
  // Get list of all plugins
  getPlugins() {
    return Array.from(this.plugins.entries()).map(([name, plugin]) => ({
      name,
      manifest: plugin.manifest,
      enabled: plugin.enabled
    }));
  }
  
  // Get list of enabled plugins
  getEnabledPlugins() {
    return Array.from(this.enabledPlugins.keys());
  }
}

module.exports = PluginLoader;