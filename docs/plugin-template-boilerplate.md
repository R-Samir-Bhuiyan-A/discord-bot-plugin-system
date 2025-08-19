# Plugin Template Boilerplate

This document describes the plugin template boilerplate that helps developers quickly create new plugins for the Discord Bot Plugin System.

## Overview

The plugin template boilerplate provides a standardized starting point for creating new plugins. It includes the basic directory structure, required files, and example code to help developers get started quickly.

## Template Structure

The plugin template follows the standard plugin structure:

```
plugin-template/
├── plugin.json
├── index.js
├── README.md
├── LICENSE
├── discord/
│   └── commands/
├── web/
│   ├── pages/
│   └── components/
├── utils/
└── tests/
```

## Template Files

### plugin.json

```json
{
  "name": "plugin-template",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A template for creating new plugins",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": [],
  "entry": "./index.js"
}
```

### index.js

```javascript
// index.js - Plugin entry point
const { registerCommand, registerEvent, registerRoute, registerPage } = require('./utils/registration');
const { getLogger } = require('./utils/logger');

// Plugin initialization
async function init(core) {
  const logger = getLogger('plugin-template');
  logger.info('Initializing plugin-template');
  
  // Register Discord commands
  // await registerCommand(core, 'template-command', 'A template command', handleCommand);
  
  // Register Discord event handlers
  // core.api.registerEvent('messageCreate', handleMessageCreate);
  
  // Register web routes
  // registerRoute(core, '/api/template', handleApiRequest);
  
  // Register web pages
  // registerPage(core, '/template', TemplatePage);
  
  logger.info('plugin-template initialized successfully');
}

// Plugin cleanup
async function destroy() {
  console.log('plugin-template destroyed');
}

// Command handler
async function handleCommand(interaction) {
  await interaction.reply('Hello from the template plugin!');
}

// Event handler
function handleMessageCreate(message) {
  // Handle message create event
}

// API route handler
function handleApiRequest(req, res) {
  res.json({ message: 'Hello from the template plugin API!' });
}

// Export plugin functions
module.exports = {
  init,
  destroy
};
```

### README.md

```markdown
# Plugin Template

A template for creating new plugins for the Discord Bot Plugin System.

## Description

This plugin serves as a template for creating new plugins. It demonstrates the basic structure and functionality of a plugin.

## Features

- Example Discord command
- Example web route
- Example web page
- Proper error handling
- Logging integration

## Installation

1. Copy this directory to the `plugins/` folder
2. Rename the directory to your plugin name
3. Update `plugin.json` with your plugin information
4. Modify the code to implement your desired functionality
5. Enable the plugin through the web UI

## Usage

After installation and enabling the plugin:

1. Use the `/template-command` Discord command
2. Visit `/template` in the web UI
3. Access `/api/template` for the API endpoint

## Configuration

This plugin does not require any configuration.

## Dependencies

This plugin does not have any dependencies.

## License

MIT
```

### LICENSE

```text
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### utils/registration.js

```javascript
// utils/registration.js - Utility functions for registering plugin components

/**
 * Register a Discord command with proper error handling
 * @param {Object} core - The core system object
 * @param {string} name - The command name
 * @param {string} description - The command description
 * @param {Function} handler - The command handler function
 */
async function registerCommand(core, name, description, handler) {
  try {
    core.api.registerCommand(name, description, handler);
    console.log(`Registered command: ${name}`);
  } catch (error) {
    console.error(`Failed to register command ${name}:`, error);
  }
}

/**
 * Register a web route with proper error handling
 * @param {Object} core - The core system object
 * @param {string} path - The route path
 * @param {Function} handler - The route handler function
 */
function registerRoute(core, path, handler) {
  try {
    core.api.registerRoute(path, handler);
    console.log(`Registered route: ${path}`);
  } catch (error) {
    console.error(`Failed to register route ${path}:`, error);
  }
}

/**
 * Register a web page with proper error handling
 * @param {Object} core - The core system object
 * @param {string} path - The page path
 * @param {Function} component - The page component
 */
function registerPage(core, path, component) {
  try {
    core.api.registerPage(path, component);
    console.log(`Registered page: ${path}`);
  } catch (error) {
    console.error(`Failed to register page ${path}:`, error);
  }
}

module.exports = {
  registerCommand,
  registerRoute,
  registerPage
};
```

### utils/logger.js

```javascript
// utils/logger.js - Logger utility for plugins

/**
 * Get a logger instance for the plugin
 * @param {string} pluginName - The name of the plugin
 * @returns {Object} Logger object with log methods
 */
function getLogger(pluginName) {
  return {
    debug: (message) => console.debug(`[DEBUG] [${pluginName}] ${message}`),
    info: (message) => console.info(`[INFO] [${pluginName}] ${message}`),
    warn: (message) => console.warn(`[WARN] [${pluginName}] ${message}`),
    error: (message) => console.error(`[ERROR] [${pluginName}] ${message}`)
  };
}

module.exports = {
  getLogger
};
```

### discord/commands/template-command.js

```javascript
// discord/commands/template-command.js - Example Discord command

/**
 * Handle the template command
 * @param {Object} interaction - The Discord interaction object
 */
async function handleTemplateCommand(interaction) {
  try {
    await interaction.reply('Hello from the template command!');
  } catch (error) {
    console.error('Error in template command:', error);
    await interaction.reply({ 
      content: 'There was an error executing this command!', 
      ephemeral: true 
    });
  }
}

module.exports = {
  handleTemplateCommand
};
```

### web/pages/TemplatePage.js

```javascript
// web/pages/TemplatePage.js - Example web page

import React from 'react';

export default function TemplatePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Template Plugin Page</h1>
      <p className="mb-4">This is a template page for the plugin.</p>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Plugin Information</h2>
        <p>Name: Plugin Template</p>
        <p>Version: 1.0.0</p>
        <p>Description: A template for creating new plugins</p>
      </div>
    </div>
  );
}
```

### tests/plugin.test.js

```javascript
// tests/plugin.test.js - Example plugin tests

const plugin = require('../index');

describe('Plugin Template', () => {
  test('should export init and destroy functions', () => {
    expect(plugin.init).toBeInstanceOf(Function);
    expect(plugin.destroy).toBeInstanceOf(Function);
  });

  test('should initialize without errors', async () => {
    // Mock core object
    const core = {
      api: {
        registerCommand: jest.fn(),
        registerEvent: jest.fn(),
        registerRoute: jest.fn(),
        registerPage: jest.fn()
      }
    };

    // This test would need to be more sophisticated in a real plugin
    // We're just checking that the function exists and doesn't throw
    await expect(plugin.init(core)).resolves.toBeUndefined();
  });

  test('should destroy without errors', async () => {
    await expect(plugin.destroy()).resolves.toBeUndefined();
  });
});
```

## Using the Template

To use the plugin template:

1. Copy the entire template directory
2. Rename it to your desired plugin name
3. Update `plugin.json` with your plugin's information
4. Modify the code in `index.js` and other files to implement your plugin's functionality
5. Add any additional files or directories as needed
6. Test your plugin thoroughly
7. Document your plugin in the README.md file

## Benefits of Using the Template

1. **Standardized Structure**: All plugins follow the same organization, making them easier to understand and maintain
2. **Best Practices**: The template includes examples of best practices for error handling, logging, and registration
3. **Quick Start**: Developers can start implementing their plugin logic immediately without worrying about the basic structure
4. **Consistent API Usage**: The template shows the correct way to use the core API for registering commands, events, routes, and pages
5. **Testing Framework**: Includes a basic test structure to encourage testing
6. **Documentation**: Provides a template for documenting the plugin

## Customizing the Template

While the template provides a good starting point, you should customize it for your specific plugin:

1. **Update Metadata**: Modify `plugin.json` with your plugin's name, version, author, and description
2. **Implement Functionality**: Replace the example code with your actual plugin logic
3. **Add Dependencies**: If your plugin requires additional dependencies, add them to the template
4. **Extend Structure**: Add additional directories or files as needed for your plugin's complexity
5. **Enhance Documentation**: Provide detailed documentation in README.md about your plugin's features and usage
6. **Add Tests**: Implement comprehensive tests for your plugin's functionality

The plugin template boilerplate is designed to accelerate plugin development while maintaining consistency and quality across the plugin ecosystem.