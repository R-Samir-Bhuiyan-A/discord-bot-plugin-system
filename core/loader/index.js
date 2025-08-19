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
      console.log(`Loaded plugin states:`, pluginStates);

      // Load all plugins
      const pluginDirs = await fs.readdir(this.pluginPath);
      console.log(`Found plugin directories:`, pluginDirs);
      
      for (const dir of pluginDirs) {
        const pluginDir = path.join(this.pluginPath, dir);
        const stat = await fs.stat(pluginDir);
        
        if (stat.isDirectory()) {
          // Enable plugin if it's not explicitly disabled in the states file
          const shouldBeEnabled = pluginStates[dir] !== false;
          console.log(`Plugin ${dir} should be enabled: ${shouldBeEnabled} (state: ${pluginStates[dir]})`);
          await this.loadPlugin(dir, shouldBeEnabled);
        }
      }
      
      console.log(`Loaded ${this.plugins.size} plugins`);
      console.log(`Enabled plugins:`, Array.from(this.enabledPlugins.keys()));
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
      
      // Store plugin reference with correct enabled state
      const plugin = {
        name: pluginName,
        manifest,
        module: pluginModule,
        enabled: false // Initially false, will be set to true if enabled
      };
      
      this.plugins.set(pluginName, plugin);
      
      console.log(`Loaded plugin: ${pluginName} (should be enabled: ${shouldBeEnabled})`);
      
      // Enable the plugin if it should be enabled
      if (shouldBeEnabled) {
        console.log(`Enabling plugin ${pluginName} on startup`);
        // Call enablePlugin to ensure proper initialization and state saving
        await this.enablePlugin(pluginName);
      } else {
        console.log(`Plugin ${pluginName} will remain disabled on startup`);
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
      console.log(`[DEBUG] enablePlugin called with pluginName: ${pluginName}`);
      const plugin = this.plugins.get(pluginName);
      if (!plugin) {
        console.log(`[DEBUG] Plugin ${pluginName} not found in plugins map`);
        throw new Error(`Plugin ${pluginName} not found`);
      }
      
      if (plugin.enabled) {
        console.log(`[DEBUG] Plugin ${pluginName} is already enabled`);
        return;
      }
      
      console.log(`[DEBUG] Enabling plugin: ${pluginName}`);
      
      // Mark plugin as enabled BEFORE initializing in sandbox
      // This ensures the state is saved even if sandbox initialization fails
      plugin.enabled = true;
      this.enabledPlugins.set(pluginName, plugin);
      
      // Save plugin state immediately
      console.log(`[DEBUG] About to save plugin state for ${pluginName}: true`);
      try {
        await this.savePluginState(pluginName, true);
        console.log(`[DEBUG] Successfully saved plugin state for ${pluginName}`);
      } catch (error) {
        console.error(`[ERROR] Failed to save plugin state for ${pluginName}:`, error);
        // Even if saving fails, we still want to try to initialize the plugin
      }
      
      // Initialize plugin in sandbox
      try {
        console.log(`[DEBUG] About to initialize plugin ${pluginName} in sandbox`);
        await this.sandbox.runPluginMethod(pluginName, plugin.module, 'init', this.core);
        console.log(`[DEBUG] Successfully initialized plugin ${pluginName} in sandbox`);
      } catch (error) {
        console.error(`[ERROR] Failed to initialize plugin ${pluginName} in sandbox:`, error);
        // Don't re-throw the error - the plugin state should still be saved
      }
      
      console.log(`[DEBUG] Enabled plugin: ${pluginName}`);
    } catch (error) {
      console.error(`[ERROR] Failed to enable plugin ${pluginName}:`, error);
      // Make sure to mark the plugin as disabled if there was an error
      const plugin = this.plugins.get(pluginName);
      if (plugin) {
        plugin.enabled = false;
        this.enabledPlugins.delete(pluginName);
        // Try to save the disabled state
        try {
          await this.savePluginState(pluginName, false);
        } catch (saveError) {
          console.error(`[ERROR] Failed to save disabled state for ${pluginName}:`, saveError);
        }
      }
      throw error; // Re-throw the error so the API can handle it
    }
  }

  async disablePlugin(pluginName) {
    try {
      console.log(`[DEBUG] disablePlugin called with pluginName: ${pluginName}`);
      const plugin = this.plugins.get(pluginName);
      if (!plugin) {
        console.log(`[DEBUG] Plugin ${pluginName} not found in plugins map`);
        throw new Error(`Plugin ${pluginName} not found`);
      }
      
      if (!plugin.enabled) {
        console.log(`[DEBUG] Plugin ${pluginName} is already disabled`);
        return;
      }
      
      console.log(`[DEBUG] Disabling plugin: ${pluginName}`);
      
      // Mark plugin as disabled BEFORE destroying in sandbox
      // This ensures the state is saved even if sandbox destruction fails
      plugin.enabled = false;
      this.enabledPlugins.delete(pluginName);
      
      // Save plugin state immediately
      console.log(`[DEBUG] About to save plugin state for ${pluginName}: false`);
      try {
        await this.savePluginState(pluginName, false);
        console.log(`[DEBUG] Successfully saved plugin state for ${pluginName}`);
      } catch (error) {
        console.error(`[ERROR] Failed to save plugin state for ${pluginName}:`, error);
        // Even if saving fails, we still want to try to destroy the plugin
      }
      
      // Unregister plugin resources (commands, routes, etc.)
      this.sandbox.unregisterPluginResources(pluginName);
      
      // Destroy plugin in sandbox
      try {
        console.log(`[DEBUG] About to destroy plugin ${pluginName} in sandbox`);
        await this.sandbox.runPluginMethod(pluginName, plugin.module, 'destroy');
        console.log(`[DEBUG] Successfully destroyed plugin ${pluginName} in sandbox`);
      } catch (error) {
        console.error(`[ERROR] Failed to destroy plugin ${pluginName} in sandbox:`, error);
        // Don't re-throw the error - the plugin state should still be saved
      }
      
      console.log(`[DEBUG] Disabled plugin: ${pluginName}`);
    } catch (error) {
      console.error(`[ERROR] Failed to disable plugin ${pluginName}:`, error);
      // Make sure to mark the plugin as enabled if there was an error
      const plugin = this.plugins.get(pluginName);
      if (plugin) {
        plugin.enabled = true;
        this.enabledPlugins.set(pluginName, plugin);
        // Try to save the enabled state
        try {
          await this.savePluginState(pluginName, true);
        } catch (saveError) {
          console.error(`[ERROR] Failed to save enabled state for ${pluginName}:`, saveError);
        }
      }
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
    // Disable all plugins for cleanup (without saving state changes)
    for (const [pluginName] of this.enabledPlugins) {
      try {
        const plugin = this.plugins.get(pluginName);
        if (plugin) {
          // Unregister plugin resources (commands, routes, etc.)
          this.sandbox.unregisterPluginResources(pluginName);
          
          // Destroy plugin in sandbox
          try {
            await this.sandbox.runPluginMethod(pluginName, plugin.module, 'destroy');
          } catch (error) {
            console.error(`Failed to destroy plugin ${pluginName} in sandbox:`, error);
          }
          
          // Mark plugin as disabled (but don't save state)
          plugin.enabled = false;
        }
      } catch (error) {
        console.error(`Error disabling plugin ${pluginName} during shutdown:`, error);
      }
    }
    
    // Clear enabled plugins map
    this.enabledPlugins.clear();
    
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
      const states = JSON.parse(data);
      console.log(`[DEBUG] Loaded plugin states from file:`, states);
      return states;
    } catch (error) {
      console.log(`[DEBUG] Plugin states file not found or invalid, using defaults`);
      // If file doesn't exist or is invalid, return empty object
      return {};
    }
  }
  
  // Save plugin state to file
  async savePluginState(pluginName, enabled) {
    try {
      console.log(`[DEBUG] savePluginState called for ${pluginName} with value ${enabled}`);
      // Load existing states
      const states = await this.loadPluginStates();
      
      // Update state for this plugin
      states[pluginName] = enabled;
      
      console.log(`[DEBUG] Saving plugin state for ${pluginName}: ${enabled}`);
      console.log(`[DEBUG] Current states object:`, JSON.stringify(states, null, 2));
      
      // Create config directory if it doesn't exist
      const configDir = path.dirname(this.stateFile);
      try {
        await fs.access(configDir);
      } catch (error) {
        await fs.mkdir(configDir, { recursive: true });
      }
      
      // Save states to file
      console.log(`[DEBUG] Writing to file: ${this.stateFile}`);
      await fs.writeFile(this.stateFile, JSON.stringify(states, null, 2));
      console.log(`[DEBUG] Saved plugin states to file:`, states);
    } catch (error) {
      console.error(`[ERROR] Failed to save plugin state for ${pluginName}:`, error);
      console.error(`[ERROR] Error stack:`, error.stack);
      throw error;
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