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
    this.stateFile = path.join(__dirname, '..', '..', 'config', 'plugin-states.json');
  }

  async init() {
    try {
      // Create plugins directory if it doesn't exist
      try {
        await fs.access(this.pluginPath);
      } catch (error) {
        await fs.mkdir(this.pluginPath, { recursive: true });
      }

      // Load plugin states
      const pluginStates = await this.loadPluginStates();

      // Load all plugins
      const pluginDirs = await fs.readdir(this.pluginPath);
      
      for (const dir of pluginDirs) {
        const pluginDir = path.join(this.pluginPath, dir);
        const stat = await fs.stat(pluginDir);
        
        if (stat.isDirectory()) {
          await this.loadPlugin(dir, pluginStates[dir] !== false); // Enable by default unless explicitly disabled
        }
      }
      
      console.log(`Loaded ${this.plugins.size} plugins`);
    } catch (error) {
      console.error('Failed to initialize plugin loader:', error);
      throw error;
    }
  }

  async loadPlugin(pluginName, shouldBeEnabled = true) {
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
      const plugin = {
        name: pluginName,
        manifest,
        module: pluginModule,
        enabled: false
      };
      
      this.plugins.set(pluginName, plugin);
      
      console.log(`Loaded plugin: ${pluginName}`);
      
      // Enable the plugin if it should be enabled
      if (shouldBeEnabled) {
        await this.enablePlugin(pluginName);
      }
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
        throw new Error(`Plugin ${pluginName} not found`);
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
      
      // Save plugin state
      await this.savePluginState(pluginName, true);
      
      console.log(`Enabled plugin: ${pluginName}`);
    } catch (error) {
      console.error(`Failed to enable plugin ${pluginName}:`, error);
      throw error; // Re-throw the error so the API can handle it
    }
  }

  async disablePlugin(pluginName) {
    try {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) {
        throw new Error(`Plugin ${pluginName} not found`);
      }
      
      if (!plugin.enabled) {
        console.log(`Plugin ${pluginName} is already disabled`);
        return;
      }
      
      // Unregister plugin commands
      this.sandbox.unregisterPluginCommands(pluginName);
      
      // Destroy plugin in sandbox
      try {
        await this.sandbox.runPluginMethod(pluginName, plugin.module, 'destroy');
      } catch (error) {
        console.error(`Failed to destroy plugin ${pluginName} in sandbox:`, error);
      }
      
      // Mark plugin as disabled
      plugin.enabled = false;
      this.enabledPlugins.delete(pluginName);
      
      // Save plugin state
      await this.savePluginState(pluginName, false);
      
      console.log(`Disabled plugin: ${pluginName}`);
    } catch (error) {
      console.error(`Failed to disable plugin ${pluginName}:`, error);
      throw error; // Re-throw the error so the API can handle it
    }
  }

  async deletePlugin(pluginName) {
    try {
      const plugin = this.plugins.get(pluginName);
      if (!plugin) {
        throw new Error(`Plugin ${pluginName} not found`);
      }
      
      console.log(`Deleting plugin: ${pluginName}`);
      
      // Disable plugin if it's enabled
      if (plugin.enabled) {
        console.log(`Disabling plugin ${pluginName} before deletion`);
        await this.disablePlugin(pluginName);
      }
      
      // Remove plugin directory
      const pluginDir = path.join(this.pluginPath, pluginName);
      console.log(`Removing plugin directory: ${pluginDir}`);
      await fs.rm(pluginDir, { recursive: true, force: true });
      
      // Remove plugin reference
      this.plugins.delete(pluginName);
      
      // Remove plugin state
      console.log(`Removing plugin state for: ${pluginName}`);
      await this.removePluginState(pluginName);
      
      console.log(`Deleted plugin: ${pluginName}`);
    } catch (error) {
      console.error(`Failed to delete plugin ${pluginName}:`, error);
      throw error;
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
  
  // Load plugin states from file
  async loadPluginStates() {
    try {
      const data = await fs.readFile(this.stateFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is invalid, return empty object
      return {};
    }
  }
  
  // Save plugin state to file
  async savePluginState(pluginName, enabled) {
    try {
      // Load existing states
      const states = await this.loadPluginStates();
      
      // Update state for this plugin
      states[pluginName] = enabled;
      
      // Create config directory if it doesn't exist
      const configDir = path.dirname(this.stateFile);
      try {
        await fs.access(configDir);
      } catch (error) {
        await fs.mkdir(configDir, { recursive: true });
      }
      
      // Save states to file
      await fs.writeFile(this.stateFile, JSON.stringify(states, null, 2));
    } catch (error) {
      console.error(`Failed to save plugin state for ${pluginName}:`, error);
    }
  }
  
  // Remove plugin state from file
  async removePluginState(pluginName) {
    try {
      // Load existing states
      const states = await this.loadPluginStates();
      
      // Remove state for this plugin
      delete states[pluginName];
      
      // Create config directory if it doesn't exist
      const configDir = path.dirname(this.stateFile);
      try {
        await fs.access(configDir);
      } catch (error) {
        // If config directory doesn't exist, there's nothing to remove
        return;
      }
      
      // Save states to file
      await fs.writeFile(this.stateFile, JSON.stringify(states, null, 2));
    } catch (error) {
      console.error(`Failed to remove plugin state for ${pluginName}:`, error);
    }
  }
}

module.exports = PluginLoader;