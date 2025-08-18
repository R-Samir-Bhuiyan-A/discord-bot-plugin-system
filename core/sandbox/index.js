// core/sandbox/index.js
const vm = require('vm');
const fs = require('fs').promises;
const path = require('path');

class PluginSandbox {
  constructor(core) {
    this.core = core;
    this.pluginCommands = new Map(); // Track commands registered by each plugin
    this.pluginRoutes = new Map(); // Track routes registered by each plugin
  }

  async runPluginMethod(pluginName, pluginModule, method, ...args) {
    return new Promise((resolve, reject) => {
      try {
        // Create a timeout to prevent infinite loops
        const timeout = setTimeout(() => {
          reject(new Error(`Plugin ${pluginName} timed out`));
        }, 5000);

        // Create a sandboxed context
        const sandbox = {
          // Provide limited access to core API
          console: {
            log: (...args) => console.log(`[${pluginName}]`, ...args),
            warn: (...args) => console.warn(`[${pluginName}]`, ...args),
            error: (...args) => console.error(`[${pluginName}]`, ...args),
            debug: (...args) => console.debug(`[${pluginName}]`, ...args),
          },
          // Plugin can access core API but in a controlled way
          core: this.createSandboxedCoreAPI(pluginName),
          // Standard JavaScript globals
          setTimeout,
          setInterval,
          clearTimeout,
          clearInterval,
          Promise,
          JSON,
          Math,
          Date,
          RegExp,
          // Error constructors
          Error,
          TypeError,
          ReferenceError,
          SyntaxError,
          RangeError,
          URIError,
          EvalError,
          // Result and control variables
          result: undefined,
          args: args,
          method: method,
          module: pluginModule,
          // Resolve and reject functions
          resolve: (value) => {
            clearTimeout(timeout);
            resolve(value);
          },
          reject: (error) => {
            clearTimeout(timeout);
            reject(error);
          }
        };

        // Create a script that will run the plugin method
        const scriptCode = `
          try {
            if (module && typeof module[method] === 'function') {
              // Run the plugin method
              Promise.resolve(module[method](...args))
                .then(resolve)
                .catch(reject);
            } else {
              reject(new Error('Method ' + method + ' not found in plugin'));
            }
          } catch (error) {
            reject(error);
          }
        `;

        // Create a script from the code
        const script = new vm.Script(scriptCode);

        // Create a context with the sandbox
        const context = vm.createContext(sandbox);
        
        // Run the script
        script.runInContext(context);
      } catch (error) {
        console.error(`Error running plugin ${pluginName} in sandbox:`, error);
        reject(error);
      }
    });
  }

  createSandboxedCoreAPI(pluginName) {
    // Create a limited version of the core API
    // This prevents plugins from accessing sensitive parts of the core
    return {
      api: {
        // Plugin-specific command registration
        registerCommand: (name, description, handler) => {
          console.log(`Plugin registering command: ${name}`);
          // Track the command for this plugin
          if (!this.pluginCommands.has(pluginName)) {
            this.pluginCommands.set(pluginName, []);
          }
          this.pluginCommands.get(pluginName).push(name);
          
          // Delegate to the core API's plugin-specific command registration
          this.core.api.registerPluginCommand(pluginName, name, description, handler);
        },
        // Plugin-specific route registration
        registerRoute: (path, handler) => {
          console.log(`Plugin registering route: ${path}`);
          // Track the route for this plugin
          if (!this.pluginRoutes.has(pluginName)) {
            this.pluginRoutes.set(pluginName, []);
          }
          this.pluginRoutes.get(pluginName).push(path);
          
          // Delegate to the core API's plugin-specific route registration
          this.core.api.registerPluginRoute(pluginName, path, handler);
        },
        registerEvent: this.core.api.registerEvent.bind(this.core.api),
        registerPage: this.core.api.registerPage.bind(this.core.api),
        getLogger: this.core.api.getLogger.bind(this.core.api),
        // Plugin management functions
        enablePlugin: this.core.api.enablePlugin.bind(this.core.api),
        disablePlugin: this.core.api.disablePlugin.bind(this.core.api),
        getPlugins: this.core.api.getPlugins.bind(this.core.api),
      }
    };
  }
  
  // Unregister all commands and routes associated with a plugin
  unregisterPluginResources(pluginName) {
    // Unregister commands
    if (this.pluginCommands.has(pluginName)) {
      // Unregister commands from DiscordManager
      this.core.discord.unregisterPluginCommands(pluginName);
      
      // Remove tracking
      this.pluginCommands.delete(pluginName);
    }
    
    // Unregister routes
    if (this.pluginRoutes.has(pluginName)) {
      // Unregister routes from API
      this.core.api.unregisterPluginRoutes(pluginName);
      
      // Remove tracking
      this.pluginRoutes.delete(pluginName);
    }
  }
}

module.exports = PluginSandbox;