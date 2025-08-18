# Plugin Development Guide

This guide explains how to create plugins for the Discord Bot Plugin System.

## Plugin Structure

All plugins must follow this structure:

```
plugin-name/
├── plugin.json
├── index.js
├── discord/
└── web/
```

## plugin.json

Every plugin must include a `plugin.json` file with the following format:

```json
{
  "name": "example-plugin",
  "version": "1.0.0",
  "author": "Author Name",
  "description": "A sample plugin that adds a Discord command and a Web UI page.",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": ["other-plugin-name"],
  "entry": "./index.js"
}
```

## Plugin Entry Point

The entry point (usually `index.js`) should export functions that the core system can call:

```javascript
module.exports = {
  // Initialize the plugin
  async init(core) {
    // Plugin initialization code
  },
  
  // Clean up when plugin is disabled
  async destroy() {
    // Cleanup code
  }
};
```

## Discord Integration

Plugins can interact with Discord through the core API:

```javascript
module.exports = {
  async init(core) {
    // Register a Discord command
    core.api.registerCommand('hello', 'Say hello', async (interaction) => {
      await interaction.reply('Hello, world!');
    });
  }
};
```

## Web UI Integration

Plugins can add pages to the Web UI:

```javascript
module.exports = {
  async init(core) {
    // Register a web route
    core.api.registerRoute('/hello', (req, res) => {
      res.send('Hello from plugin!');
    });
  }
};
```