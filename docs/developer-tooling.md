# Developer Tooling

This document describes the developer tooling available for the Discord Bot Plugin System to enhance the plugin development experience.

## Overview

The developer tooling provides utilities and tools to help plugin developers create, test, and debug their plugins more efficiently. These tools are designed to streamline the development process and improve code quality.

## Plugin Development CLI

A command-line interface (CLI) tool to assist with plugin development tasks:

### Installation

```bash
npm install -g discord-bot-plugin-cli
```

### Commands

1. **Create Plugin**
   ```bash
   plugin-cli create my-plugin
   ```
   Creates a new plugin directory with the template structure.

2. **Validate Plugin**
   ```bash
   plugin-cli validate my-plugin
   ```
   Validates the plugin manifest and structure.

3. **Test Plugin**
   ```bash
   plugin-cli test my-plugin
   ```
   Runs the plugin's test suite.

4. **Package Plugin**
   ```bash
   plugin-cli package my-plugin
   ```
   Packages the plugin for distribution.

5. **Deploy Plugin**
   ```bash
   plugin-cli deploy my-plugin --repo http://localhost:8080
   ```
   Deploys the plugin to a repository.

### Implementation

```javascript
// cli/index.js
#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs').promises;
const path = require('path');

program
  .name('plugin-cli')
  .description('CLI tool for Discord Bot Plugin System development')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new plugin')
  .argument('<plugin-name>', 'name of the plugin')
  .action(async (pluginName) => {
    try {
      // Create plugin directory
      await fs.mkdir(pluginName, { recursive: true });
      
      // Copy template files
      const templateDir = path.join(__dirname, '..', 'templates', 'plugin-template');
      const files = await fs.readdir(templateDir);
      
      for (const file of files) {
        const src = path.join(templateDir, file);
        const dest = path.join(pluginName, file);
        await fs.copyFile(src, dest);
      }
      
      console.log(`Plugin "${pluginName}" created successfully!`);
    } catch (error) {
      console.error('Failed to create plugin:', error);
    }
  });

program
  .command('validate')
  .description('Validate a plugin')
  .argument('<plugin-path>', 'path to the plugin')
  .action(async (pluginPath) => {
    try {
      // Check if plugin.json exists
      const manifestPath = path.join(pluginPath, 'plugin.json');
      await fs.access(manifestPath);
      
      // Parse and validate manifest
      const manifestData = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestData);
      
      // Check required fields
      const requiredFields = ['name', 'version', 'author', 'description', 'entry'];
      for (const field of requiredFields) {
        if (!manifest[field]) {
          throw new Error(`Missing required field in plugin.json: ${field}`);
        }
      }
      
      // Check if entry file exists
      const entryPath = path.join(pluginPath, manifest.entry);
      await fs.access(entryPath);
      
      console.log(`Plugin "${manifest.name}" is valid!`);
    } catch (error) {
      console.error('Plugin validation failed:', error);
    }
  });

program.parse();
```

## Plugin Development Server

A development server that provides hot-reloading for plugins during development:

### Features

1. **Hot Reloading**: Automatically reloads plugins when files change
2. **Sandboxed Execution**: Runs plugins in a sandboxed environment
3. **Debugging Support**: Integrates with Node.js debugging tools
4. **Log Streaming**: Streams plugin logs to the console

### Implementation

```javascript
// dev-server/index.js
const chokidar = require('chokidar');
const path = require('path');
const PluginSandbox = require('../core/sandbox');

class PluginDevServer {
  constructor(pluginPath) {
    this.pluginPath = pluginPath;
    this.sandbox = new PluginSandbox();
    this.watcher = null;
  }

  start() {
    console.log(`Starting plugin development server for ${this.pluginPath}`);
    
    // Load plugin initially
    this.loadPlugin();
    
    // Watch for file changes
    this.watcher = chokidar.watch(this.pluginPath, {
      ignored: /node_modules/,
      persistent: true
    });
    
    this.watcher
      .on('change', (filePath) => {
        console.log(`File changed: ${filePath}`);
        this.loadPlugin();
      })
      .on('error', (error) => {
        console.error('Watcher error:', error);
      });
  }

  async loadPlugin() {
    try {
      // Clear module cache
      Object.keys(require.cache).forEach(key => {
        if (key.startsWith(path.resolve(this.pluginPath))) {
          delete require.cache[key];
        }
      });
      
      // Load plugin module
      const pluginModule = require(this.pluginPath);
      
      // Run plugin in sandbox
      await this.sandbox.runPluginMethod('dev-plugin', pluginModule, 'init', {});
      
      console.log('Plugin loaded successfully');
    } catch (error) {
      console.error('Failed to load plugin:', error);
    }
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

module.exports = PluginDevServer;
```

## Plugin Testing Framework

Enhanced testing framework specifically for plugins:

### Features

1. **Plugin-Specific Test Runner**: Runs tests in a plugin-aware environment
2. **Mock Core API**: Provides mock implementations of the core API for testing
3. **Sandboxed Testing**: Tests plugins in a sandboxed environment
4. **Coverage Reporting**: Generates code coverage reports for plugins

### Implementation

```javascript
// test-framework/index.js
const jest = require('jest');
const path = require('path');

class PluginTestFramework {
  constructor(pluginPath) {
    this.pluginPath = pluginPath;
  }

  async runTests() {
    const config = {
      roots: [this.pluginPath],
      testMatch: ['**/tests/**/*.js', '**/*.test.js'],
      setupFilesAfterEnv: [path.join(__dirname, 'setup.js')],
      collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/tests/**'
      ]
    };

    try {
      await jest.runCLI(config, [this.pluginPath]);
    } catch (error) {
      console.error('Test execution failed:', error);
    }
  }
}

module.exports = PluginTestFramework;
```

### Test Setup

```javascript
// test-framework/setup.js
// Mock core API for testing
global.core = {
  api: {
    registerCommand: jest.fn(),
    registerEvent: jest.fn(),
    registerRoute: jest.fn(),
    registerPage: jest.fn(),
    getLogger: () => ({
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    })
  }
};

// Mock Discord.js for testing
jest.mock('discord.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    login: jest.fn().mockResolvedValue(),
    on: jest.fn(),
    once: jest.fn()
  })),
  GatewayIntentBits: {
    Guilds: 1,
    GuildMessages: 2,
    MessageContent: 4
  }
}));
```

## Plugin Debugger

A debugging tool that provides enhanced debugging capabilities for plugins:

### Features

1. **Enhanced Logging**: Provides detailed logging for plugin execution
2. **Performance Profiling**: Profiles plugin performance and resource usage
3. **Error Tracking**: Tracks and reports plugin errors with detailed context
4. **Interactive Debugging**: Integrates with Node.js debugger for interactive debugging

### Implementation

```javascript
// debugger/index.js
class PluginDebugger {
  constructor(pluginName) {
    this.pluginName = pluginName;
    this.logs = [];
  }

  log(level, message, context = {}) {
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      plugin: this.pluginName,
      context
    };
    
    this.logs.push(logEntry);
    console.log(`[${logEntry.timestamp.toISOString()}] [${logEntry.level.toUpperCase()}] [${logEntry.plugin}] ${logEntry.message}`);
  }

  debug(message, context) {
    this.log('debug', message, context);
  }

  info(message, context) {
    this.log('info', message, context);
  }

  warn(message, context) {
    this.log('warn', message, context);
  }

  error(message, context) {
    this.log('error', message, context);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  // Profile a function execution
  profile(fn, name) {
    return async (...args) => {
      const start = process.hrtime.bigint();
      try {
        const result = await fn(...args);
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000; // Convert to milliseconds
        this.info(`Function "${name}" executed in ${duration}ms`);
        return result;
      } catch (error) {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000; // Convert to milliseconds
        this.error(`Function "${name}" failed after ${duration}ms`, { error: error.message });
        throw error;
      }
    };
  }
}

module.exports = PluginDebugger;
```

## Plugin Linter

A linter that enforces coding standards and best practices for plugins:

### Features

1. **Plugin-Specific Rules**: Enforces rules specific to plugin development
2. **Configuration Validation**: Validates plugin configuration files
3. **Security Checks**: Checks for potential security issues in plugin code
4. **Performance Recommendations**: Provides recommendations for performance optimization

### Implementation

```javascript
// linter/index.js
const fs = require('fs').promises;
const path = require('path');
const eslint = require('eslint');

class PluginLinter {
  constructor(pluginPath) {
    this.pluginPath = pluginPath;
  }

  async lint() {
    const cli = new eslint.ESLint({
      overrideConfig: {
        rules: {
          // Plugin-specific rules
          'plugin/require-init': 'error',
          'plugin/require-destroy': 'error',
          'plugin/no-core-access': 'warn'
        }
      },
      useEslintrc: false
    });

    try {
      const results = await cli.lintFiles([`${this.pluginPath}/**/*.js`]);
      const formatter = await cli.loadFormatter('stylish');
      const resultText = formatter.format(results);
      
      console.log(resultText);
      
      // Check for errors
      const hasErrors = results.some(result => result.errorCount > 0);
      if (hasErrors) {
        throw new Error('Linting failed with errors');
      }
    } catch (error) {
      console.error('Linting failed:', error);
    }
  }

  async validateManifest() {
    try {
      const manifestPath = path.join(this.pluginPath, 'plugin.json');
      const manifestData = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestData);
      
      // Validate required fields
      const requiredFields = ['name', 'version', 'author', 'description', 'entry'];
      for (const field of requiredFields) {
        if (!manifest[field]) {
          throw new Error(`Missing required field in plugin.json: ${field}`);
        }
      }
      
      // Validate version format
      if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
        throw new Error('Invalid version format. Use semantic versioning (e.g., 1.0.0)');
      }
      
      console.log('Manifest validation passed');
    } catch (error) {
      console.error('Manifest validation failed:', error);
    }
  }
}

module.exports = PluginLinter;
```

## Integration with Development Environment

### VS Code Extension

A Visual Studio Code extension that integrates the developer tooling:

1. **Syntax Highlighting**: Provides syntax highlighting for plugin files
2. **IntelliSense**: Offers intelligent code completion for the core API
3. **Debugging Integration**: Integrates with the plugin debugger
4. **Task Runner**: Provides tasks for common plugin development operations

### WebStorm Integration

Integration with WebStorm IDE:

1. **Code Templates**: Provides code templates for plugin development
2. **Run Configurations**: Offers run configurations for plugin testing
3. **Live Templates**: Includes live templates for common plugin patterns

## Documentation Generator

A tool that automatically generates documentation for plugins:

### Features

1. **API Documentation**: Generates API documentation from code comments
2. **Configuration Documentation**: Generates documentation for plugin configuration
3. **Example Documentation**: Includes examples in the generated documentation
4. **Markdown Output**: Generates documentation in Markdown format

### Implementation

```javascript
// doc-generator/index.js
const fs = require('fs').promises;
const path = require('path');

class PluginDocGenerator {
  constructor(pluginPath) {
    this.pluginPath = pluginPath;
  }

  async generate() {
    try {
      // Read plugin manifest
      const manifestPath = path.join(this.pluginPath, 'plugin.json');
      const manifestData = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestData);
      
      // Generate documentation
      const doc = `
# ${manifest.name}

${manifest.description}

## Metadata
- Version: ${manifest.version}
- Author: ${manifest.author}
- Entry Point: ${manifest.entry}

## Description
${manifest.description}

## Installation
1. Copy this directory to the \`plugins/\` folder
2. Enable the plugin through the web UI

## Usage
<!-- Add usage instructions here -->

## Configuration
<!-- Add configuration details here -->

## API
<!-- Add API documentation here -->
      `.trim();
      
      // Write documentation to file
      const docPath = path.join(this.pluginPath, 'README.md');
      await fs.writeFile(docPath, doc);
      
      console.log(`Documentation generated at ${docPath}`);
    } catch (error) {
      console.error('Failed to generate documentation:', error);
    }
  }
}

module.exports = PluginDocGenerator;
```

## Future Enhancements

1. **GUI Development Tool**: Create a graphical interface for plugin development
2. **Plugin Marketplace Integration**: Integrate with the plugin repository for easy publishing
3. **Collaborative Development Features**: Add features for collaborative plugin development
4. **AI-Assisted Development**: Integrate AI tools to assist with code generation and debugging
5. **Continuous Integration Integration**: Provide templates for CI/CD pipelines for plugins
6. **Performance Benchmarking**: Add tools for benchmarking plugin performance
7. **Security Scanning**: Implement automated security scanning for plugins
8. **Dependency Management**: Provide tools for managing plugin dependencies

The developer tooling aims to provide a comprehensive suite of tools that make plugin development more efficient, reliable, and enjoyable for developers.