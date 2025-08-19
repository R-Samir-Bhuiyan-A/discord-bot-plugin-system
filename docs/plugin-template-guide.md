# Plugin Template Guide

This guide explains how to use and customize the plugin template boilerplate to quickly create new plugins for the Discord Bot Plugin System.

## Table of Contents

1. [Overview](#overview)
2. [Template Structure](#template-structure)
3. [Using the Template](#using-the-template)
4. [Customizing the Template](#customizing-the-template)
5. [Template Files](#template-files)
6. [Best Practices](#best-practices)

## Overview

The plugin template boilerplate provides a standardized starting point for creating new plugins. It includes the basic directory structure, required files, and example code to help developers get started quickly.

Using the template ensures that all plugins follow a consistent structure and include essential components, making them easier to understand, maintain, and extend.

## Template Structure

The plugin template follows a well-organized structure:

```
plugin-template/
├── plugin.json
├── index.js
├── README.md
├── LICENSE
├── config/
├── data/
├── discord/
│   ├── commands/
│   ├── events/
│   └── services/
├── web/
│   ├── pages/
│   ├── routes/
│   └── components/
├── utils/
│   ├── logger.js
│   └── helpers.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/
    └── usage.md
```

Not all directories are required. You can remove or add directories as needed for your specific plugin.

## Using the Template

### Step 1: Copy the Template

Start by copying the template directory:

```bash
# Copy the template to a new plugin directory
cp -r plugin-template my-new-plugin

# Or rename the template directory
mv plugin-template my-new-plugin
```

### Step 2: Update Plugin Metadata

Update `plugin.json` with your plugin's information:

```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A plugin that does awesome things",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "entry": "./index.js"
}
```

### Step 3: Customize the Code

Modify the code in `index.js` and other files to implement your plugin's functionality:

```javascript
// index.js
const { registerCommand, registerEvent } = require('./utils/registration');
const { getLogger } = require('./utils/logger');

async function init(core) {
  const logger = getLogger('my-awesome-plugin');
  logger.info('Initializing my-awesome-plugin');
  
  // Register your plugin's functionality here
  // registerCommand(core, 'my-command', 'Description', handler);
  // registerEvent(core, 'messageCreate', handler);
  
  logger.info('my-awesome-plugin initialized successfully');
}

async function destroy() {
  console.log('my-awesome-plugin destroyed');
}

module.exports = {
  init,
  destroy
};
```

### Step 4: Add Plugin Files

Add any additional files or directories needed for your plugin's functionality.

### Step 5: Test Your Plugin

Test your plugin thoroughly:

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Test the plugin in the Discord Bot Plugin System
```

### Step 6: Document Your Plugin

Update the README.md file with documentation about your plugin's features and usage.

## Customizing the Template

### Updating Metadata

1. **Plugin Name**: Change the directory name and update `plugin.json`
2. **Version**: Start with "1.0.0" and follow semantic versioning
3. **Author**: Update with your name or organization
4. **Description**: Provide a clear, concise description of what your plugin does
5. **Compatibility**: Specify the core system version requirements
6. **Permissions**: List the Discord and web permissions your plugin requires

### Implementing Functionality

#### Discord Commands

Add command handlers in `discord/commands/`:

```javascript
// discord/commands/myCommand.js
async function handleMyCommand(interaction) {
  try {
    // Command logic here
    await interaction.reply('Command executed successfully!');
  } catch (error) {
    console.error('Command error:', error);
    await interaction.reply({ 
      content: 'Sorry, something went wrong!', 
      ephemeral: true 
    });
  }
}

module.exports = { handleMyCommand };
```

Register commands in `index.js`:

```javascript
const { handleMyCommand } = require('./discord/commands/myCommand');

async function init(core) {
  core.api.registerCommand('my-command', 'Description of my command', handleMyCommand);
}
```

#### Discord Events

Add event handlers in `discord/events/`:

```javascript
// discord/events/messageHandler.js
function handleMessageCreate(message) {
  // Event handling logic
  console.log(`New message from ${message.author.username}: ${message.content}`);
}

module.exports = { handleMessageCreate };
```

Register events in `index.js`:

```javascript
const { handleMessageCreate } = require('./discord/events/messageHandler');

async function init(core) {
  core.api.registerEvent('messageCreate', handleMessageCreate);
}
```

#### Web Routes

Add route handlers in `web/routes/`:

```javascript
// web/routes/api.js
function handleApiRequest(req, res) {
  res.json({ message: 'Hello from my plugin API!' });
}

module.exports = { handleApiRequest };
```

Register routes in `index.js`:

```javascript
const { handleApiRequest } = require('./web/routes/api');

async function init(core) {
  core.api.registerRoute('/api/my-plugin', handleApiRequest);
}
```

#### Web Pages

Add page components in `web/pages/`:

```javascript
// web/pages/MyPage.js
import React from 'react';

export default function MyPage() {
  return (
    <div>
      <h1>My Plugin Page</h1>
      <p>This is a page from my plugin.</p>
    </div>
  );
}
```

Register pages in `index.js`:

```javascript
const MyPage = require('./web/pages/MyPage');

async function init(core) {
  core.api.registerPage('/my-plugin', MyPage);
}
```

### Adding Configuration

Define configuration options in `plugin.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "author": "Plugin Author",
  "description": "A sample plugin",
  "config": {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "API key for external service"
    },
    "maxItems": {
      "type": "number",
      "required": false,
      "default": 10,
      "description": "Maximum number of items to display"
    }
  },
  "entry": "./index.js"
}
```

Access configuration in your plugin:

```javascript
async function init(core) {
  const apiKey = await core.api.getConfig('my-plugin', 'apiKey');
  const maxItems = await core.api.getConfig('my-plugin', 'maxItems') || 10;
  
  // Use configuration in your plugin
}
```

### Adding Data Storage

Use the core's data storage system:

```javascript
async function init(core) {
  // Store data
  await core.api.setData('my-plugin', 'key', 'value');
  
  // Retrieve data
  const value = await core.api.getData('my-plugin', 'key');
  
  // Delete data
  await core.api.deleteData('my-plugin', 'key');
}
```

### Adding Utilities

Add utility functions in `utils/`:

```javascript
// utils/helpers.js
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function sanitizeInput(input) {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

module.exports = {
  formatDate,
  sanitizeInput
};
```

Use utilities in your plugin:

```javascript
const { formatDate, sanitizeInput } = require('./utils/helpers');

async function init(core) {
  // Use utility functions
  const today = formatDate(new Date());
  const cleanInput = sanitizeInput(userInput);
}
```

## Template Files

### plugin.json

The plugin manifest file:

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

The plugin entry point:

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

Plugin documentation:

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

License information:

```text
MIT License

Copyright (c) 2023 Your Name

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

Utility functions for registering plugin components:

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
 * Register a Discord event with proper error handling
 * @param {Object} core - The core system object
 * @param {string} event - The event name
 * @param {Function} handler - The event handler function
 */
function registerEvent(core, event, handler) {
  try {
    core.api.registerEvent(event, handler);
    console.log(`Registered event: ${event}`);
  } catch (error) {
    console.error(`Failed to register event ${event}:`, error);
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
  registerEvent,
  registerRoute,
  registerPage
};
```

### utils/logger.js

Logger utility for plugins:

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

Example Discord command:

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

Example web page:

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

Example plugin tests:

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

## Best Practices

### Using the Template

1. **Start Simple**: Begin with the basic template and add complexity as needed
2. **Follow Conventions**: Maintain the directory structure and naming conventions
3. **Update Documentation**: Always update the README.md with information about your plugin
4. **Test Thoroughly**: Write tests for your plugin's functionality
5. **Version Properly**: Follow semantic versioning for your plugin releases

### Customizing the Template

1. **Remove Unused Files**: Delete files and directories you don't need
2. **Add Required Files**: Add any additional files required by your plugin
3. **Update Dependencies**: Add any npm dependencies your plugin requires
4. **Configure Linting**: Set up linting rules appropriate for your plugin
5. **Set Up CI/CD**: Configure continuous integration and deployment if needed

### Maintaining Quality

1. **Code Reviews**: Have others review your plugin code
2. **Security Audits**: Regularly check for security vulnerabilities
3. **Performance Testing**: Test your plugin under load
4. **User Feedback**: Collect and respond to user feedback
5. **Regular Updates**: Keep your plugin up to date with core system changes

### Community Engagement

1. **Clear Documentation**: Provide comprehensive documentation
2. **Support Channels**: Offer support for users of your plugin
3. **Contribution Guidelines**: Establish guidelines for contributions
4. **Issue Tracking**: Use issue tracking for bug reports and feature requests
5. **Release Notes**: Maintain detailed release notes for each version

By using the plugin template and following these guidelines, you can quickly create high-quality plugins for the Discord Bot Plugin System. The template provides a solid foundation that you can build upon to create plugins that are reliable, maintainable, and user-friendly.