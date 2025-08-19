# Plugin Management API Reference

The Plugin Management API provides methods for managing plugins programmatically, including enabling, disabling, and retrieving plugin information.

## Table of Contents

1. [Overview](#overview)
2. [Getting Plugin Information](#getting-plugin-information)
3. [Plugin State Management](#plugin-state-management)
4. [Plugin Lifecycle Control](#plugin-lifecycle-control)
5. [Repository Integration](#repository-integration)
6. [Best Practices](#best-practices)

## Overview

The Plugin Management API allows plugins to interact with other plugins and the plugin system itself. This includes retrieving information about installed plugins, enabling or disabling plugins, and managing plugin installations from repositories.

## Getting Plugin Information

### getPlugins()

Gets a list of all installed plugins with their current status.

**Returns:**
- Promise resolving to an array of plugin objects

**Example:**
```javascript
async function init(core) {
  const plugins = await core.api.getPlugins();
  
  console.log('Installed plugins:');
  plugins.forEach(plugin => {
    console.log(`- ${plugin.name} (${plugin.version}) - ${plugin.enabled ? 'Enabled' : 'Disabled'}`);
  });
}
```

### getPlugin(pluginName)

Gets detailed information about a specific plugin.

**Parameters:**
- `pluginName` (string): The name of the plugin

**Returns:**
- Promise resolving to a plugin object or null if not found

**Example:**
```javascript
async function init(core) {
  const plugin = await core.api.getPlugin('weather-plugin');
  
  if (plugin) {
    console.log(`Plugin: ${plugin.name}`);
    console.log(`Version: ${plugin.version}`);
    console.log(`Enabled: ${plugin.enabled}`);
    console.log(`Description: ${plugin.description}`);
  }
}
```

## Plugin State Management

### enablePlugin(pluginName)

Enables a plugin. If the plugin is already enabled, this method does nothing.

**Parameters:**
- `pluginName` (string): The name of the plugin to enable

**Returns:**
- Promise that resolves when the plugin is enabled

**Example:**
```javascript
async function init(core) {
  try {
    await core.api.enablePlugin('weather-plugin');
    console.log('Weather plugin enabled successfully');
  } catch (error) {
    console.error('Failed to enable weather plugin:', error);
  }
}
```

### disablePlugin(pluginName)

Disables a plugin. If the plugin is already disabled, this method does nothing.

**Parameters:**
- `pluginName` (string): The name of the plugin to disable

**Returns:**
- Promise that resolves when the plugin is disabled

**Example:**
```javascript
async function init(core) {
  try {
    await core.api.disablePlugin('weather-plugin');
    console.log('Weather plugin disabled successfully');
  } catch (error) {
    console.error('Failed to disable weather plugin:', error);
  }
}
```

### deletePlugin(pluginName)

Deletes a plugin permanently. This removes all plugin files from the system.

**Parameters:**
- `pluginName` (string): The name of the plugin to delete

**Returns:**
- Promise that resolves when the plugin is deleted

**Example:**
```javascript
async function init(core) {
  try {
    await core.api.deletePlugin('old-plugin');
    console.log('Old plugin deleted successfully');
  } catch (error) {
    console.error('Failed to delete old plugin:', error);
  }
}
```

## Plugin Lifecycle Control

### reloadPlugin(pluginName)

Reloads a plugin. This disables and then re-enables the plugin, causing its `destroy()` and `init()` methods to be called.

**Parameters:**
- `pluginName` (string): The name of the plugin to reload

**Returns:**
- Promise that resolves when the plugin is reloaded

**Example:**
```javascript
async function init(core) {
  try {
    await core.api.reloadPlugin('my-plugin');
    console.log('Plugin reloaded successfully');
  } catch (error) {
    console.error('Failed to reload plugin:', error);
  }
}
```

### isPluginEnabled(pluginName)

Checks if a plugin is currently enabled.

**Parameters:**
- `pluginName` (string): The name of the plugin

**Returns:**
- Promise resolving to a boolean indicating if the plugin is enabled

**Example:**
```javascript
async function init(core) {
  const isEnabled = await core.api.isPluginEnabled('weather-plugin');
  
  if (isEnabled) {
    console.log('Weather plugin is enabled');
  } else {
    console.log('Weather plugin is disabled');
  }
}
```

## Repository Integration

### getAvailablePlugins()

Gets a list of available plugins from the configured repository.

**Returns:**
- Promise resolving to an array of available plugin objects

**Example:**
```javascript
async function init(core) {
  try {
    const availablePlugins = await core.api.getAvailablePlugins();
    
    console.log('Available plugins:');
    availablePlugins.forEach(plugin => {
      console.log(`- ${plugin.name} (${plugin.version}) - ${plugin.description}`);
    });
  } catch (error) {
    console.error('Failed to fetch available plugins:', error);
  }
}
```

### installPlugin(pluginName)

Installs a plugin from the repository.

**Parameters:**
- `pluginName` (string): The name of the plugin to install

**Returns:**
- Promise that resolves when the plugin is installed

**Example:**
```javascript
async function init(core) {
  try {
    await core.api.installPlugin('new-plugin');
    console.log('New plugin installed successfully');
  } catch (error) {
    console.error('Failed to install new plugin:', error);
  }
}
```

### updatePlugin(pluginName)

Updates a plugin to the latest version available in the repository.

**Parameters:**
- `pluginName` (string): The name of the plugin to update

**Returns:**
- Promise that resolves when the plugin is updated

**Example:**
```javascript
async function init(core) {
  try {
    await core.api.updatePlugin('my-plugin');
    console.log('Plugin updated successfully');
  } catch (error) {
    console.error('Failed to update plugin:', error);
  }
}
```

## Best Practices

### 1. Check Plugin Dependencies

Always check if required plugins are installed and enabled before using them:

```javascript
async function init(core) {
  const requiredPlugins = ['database-plugin', 'auth-plugin'];
  
  for (const pluginName of requiredPlugins) {
    const plugin = await core.api.getPlugin(pluginName);
    
    if (!plugin) {
      throw new Error(`Required plugin ${pluginName} is not installed`);
    }
    
    if (!plugin.enabled) {
      throw new Error(`Required plugin ${pluginName} is not enabled`);
    }
  }
  
  console.log('All required plugins are available');
}
```

### 2. Handle Plugin Management Errors Gracefully

Always handle potential errors when managing plugins:

```javascript
async function init(core) {
  try {
    await core.api.enablePlugin('optional-plugin');
    console.log('Optional plugin enabled');
  } catch (error) {
    // This might fail if the plugin doesn't exist or has issues
    console.warn('Could not enable optional plugin:', error.message);
  }
}
```

### 3. Use Conditional Plugin Features

Enable or disable features based on the availability of other plugins:

```javascript
async function init(core) {
  const advancedAnalyticsPlugin = await core.api.getPlugin('advanced-analytics');
  
  if (advancedAnalyticsPlugin && advancedAnalyticsPlugin.enabled) {
    // Register advanced analytics features
    core.api.registerCommand('analytics', 'View advanced analytics', handleAnalyticsCommand);
  } else {
    // Register basic analytics features
    core.api.registerCommand('basic-analytics', 'View basic analytics', handleBasicAnalyticsCommand);
  }
}
```

### 4. Provide User Feedback for Plugin Operations

Give users feedback when performing plugin management operations:

```javascript
core.api.registerCommand('plugin-manager', 'Manage plugins', async (interaction) => {
  const subcommand = interaction.options.getSubcommand();
  
  try {
    switch (subcommand) {
      case 'enable':
        const pluginToEnable = interaction.options.getString('plugin');
        await core.api.enablePlugin(pluginToEnable);
        await interaction.reply(`Plugin "${pluginToEnable}" has been enabled successfully.`);
        break;
        
      case 'disable':
        const pluginToDisable = interaction.options.getString('plugin');
        await core.api.disablePlugin(pluginToDisable);
        await interaction.reply(`Plugin "${pluginToDisable}" has been disabled successfully.`);
        break;
        
      default:
        await interaction.reply('Unknown subcommand');
    }
  } catch (error) {
    await interaction.reply({ 
      content: `Operation failed: ${error.message}`, 
      ephemeral: true 
    });
  }
}, {
  options: [
    {
      name: 'enable',
      description: 'Enable a plugin',
      type: 'SUBCOMMAND',
      options: [
        {
          name: 'plugin',
          description: 'The plugin to enable',
          type: 'STRING',
          required: true
        }
      ]
    },
    {
      name: 'disable',
      description: 'Disable a plugin',
      type: 'SUBCOMMAND',
      options: [
        {
          name: 'plugin',
          description: 'The plugin to disable',
          type: 'STRING',
          required: true
        }
      ]
    }
  ]
});
```

### 5. Monitor Plugin Status Changes

Listen for plugin status changes to react accordingly:

```javascript
async function init(core) {
  // Check if a dependency plugin is enabled
  const databasePlugin = await core.api.getPlugin('database-plugin');
  
  if (databasePlugin && databasePlugin.enabled) {
    // Initialize database-dependent features
    await initializeDatabaseFeatures(core);
  }
  
  // Listen for plugin status changes
  core.api.listenForEvent('plugin:status-changed', async (data) => {
    if (data.pluginName === 'database-plugin') {
      if (data.enabled) {
        // Database plugin was enabled, initialize features
        await initializeDatabaseFeatures(core);
      } else {
        // Database plugin was disabled, cleanup features
        await cleanupDatabaseFeatures();
      }
    }
  });
}
```

By following these best practices and using the Plugin Management API effectively, you can create plugins that interact well with the plugin system and provide a great user experience.