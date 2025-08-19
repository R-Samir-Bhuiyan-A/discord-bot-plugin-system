# Plugin Repository Guide

The Plugin Repository system allows users to easily discover, install, and update plugins for their Discord bot. This guide explains how to create, manage, and use plugin repositories.

## Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [Creating a Repository](#creating-a-repository)
4. [Repository Server](#repository-server)
5. [Plugin Distribution](#plugin-distribution)
6. [Repository Management](#repository-management)
7. [Security Considerations](#security-considerations)
8. [Best Practices](#best-practices)

## Overview

The plugin repository system provides a centralized location for plugin distribution and management. It enables:

- Easy discovery of plugins
- One-click installation
- Automatic updates
- Plugin ratings and reviews
- Categorization and search

Repositories can be public or private, and users can configure multiple repositories to install plugins from different sources.

## Repository Structure

A plugin repository follows a specific structure to ensure compatibility with the plugin system:

```
repository/
├── plugins.json
├── plugins/
│   ├── plugin-name-1/
│   │   ├── plugin.json
│   │   ├── index.js
│   │   └── other-files...
│   ├── plugin-name-2/
│   │   ├── plugin.json
│   │   ├── index.js
│   │   └── other-files...
│   └── ...
└── (optional) categories.json
```

### plugins.json

The `plugins.json` file is the main index of the repository. It contains a list of all available plugins with their basic information:

```json
[
  {
    "name": "weather-plugin",
    "version": "1.2.3",
    "author": "Weather Dev",
    "description": "Provides weather information for Discord servers",
    "url": "/plugins/weather-plugin/plugin.json",
    "category": "Utilities",
    "tags": ["weather", "forecast", "utility"],
    "downloads": 12500,
    "rating": 4.8,
    "createdAt": "2023-01-15T10:30:00Z",
    "updatedAt": "2023-06-20T14:45:00Z"
  },
  {
    "name": "moderation-tools",
    "version": "2.1.0",
    "author": "Moderation Team",
    "description": "Comprehensive moderation tools for Discord servers",
    "url": "/plugins/moderation-tools/plugin.json",
    "category": "Moderation",
    "tags": ["moderation", "ban", "kick", "warn"],
    "downloads": 8900,
    "rating": 4.6,
    "createdAt": "2022-11-03T09:15:00Z",
    "updatedAt": "2023-05-10T16:20:00Z"
  }
]
```

### Plugin Directories

Each plugin has its own directory containing:

1. `plugin.json`: The plugin manifest file with detailed information
2. Plugin files: The actual plugin code and assets
3. Any additional files required by the plugin

### categories.json (Optional)

An optional `categories.json` file can define categories for organizing plugins:

```json
[
  {
    "id": "utilities",
    "name": "Utilities",
    "description": "Plugins that provide useful utilities and tools"
  },
  {
    "id": "moderation",
    "name": "Moderation",
    "description": "Plugins for moderating Discord servers"
  },
  {
    "id": "entertainment",
    "name": "Entertainment",
    "description": "Plugins for entertainment and games"
  }
]
```

## Creating a Repository

### Step 1: Set Up Directory Structure

Create the basic repository structure:

```bash
mkdir my-plugin-repository
cd my-plugin-repository
mkdir plugins
touch plugins.json
```

### Step 2: Add Plugins

Add plugins to the repository by creating directories for each plugin:

```bash
mkdir plugins/weather-plugin
mkdir plugins/moderation-tools
```

Each plugin directory should contain at least a `plugin.json` file and the plugin code.

### Step 3: Create Plugin Manifests

Create `plugin.json` files for each plugin:

```json
// plugins/weather-plugin/plugin.json
{
  "name": "weather-plugin",
  "version": "1.2.3",
  "author": "Weather Dev",
  "description": "Provides weather information for Discord servers",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands"],
    "web": ["routes"]
  },
  "files": [
    "index.js",
    "utils/weather.js"
  ],
  "entry": "./index.js"
}
```

### Step 4: Update plugins.json

Add entries to `plugins.json` for each plugin:

```json
[
  {
    "name": "weather-plugin",
    "version": "1.2.3",
    "author": "Weather Dev",
    "description": "Provides weather information for Discord servers",
    "url": "/plugins/weather-plugin/plugin.json"
  }
]
```

## Repository Server

### Simple Static Server

For a simple repository, you can use a static file server:

```javascript
// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the repository directory
app.use(express.static(path.join(__dirname, 'repository')));

// Start the server
app.listen(PORT, () => {
  console.log(`Plugin repository server running on http://localhost:${PORT}`);
});
```

### Advanced Repository Server

For a more advanced repository with features like search, ratings, and statistics:

```javascript
// advanced-server.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.static(path.join(__dirname, 'repository')));
app.use(express.json());

// In-memory data store (in production, use a database)
let pluginStats = {};

// API Routes
app.get('/api/plugins', async (req, res) => {
  try {
    const pluginsData = await fs.readFile(path.join(__dirname, 'repository', 'plugins.json'), 'utf8');
    const plugins = JSON.parse(pluginsData);
    
    // Add statistics to plugin data
    const pluginsWithStats = plugins.map(plugin => ({
      ...plugin,
      downloads: pluginStats[plugin.name]?.downloads || 0,
      rating: pluginStats[plugin.name]?.rating || 0
    }));
    
    res.json(pluginsWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plugins' });
  }
});

app.get('/api/plugins/:name', async (req, res) => {
  try {
    const pluginName = req.params.name;
    const pluginPath = path.join(__dirname, 'repository', 'plugins', pluginName, 'plugin.json');
    
    const pluginData = await fs.readFile(pluginPath, 'utf8');
    const plugin = JSON.parse(pluginData);
    
    // Add statistics
    plugin.downloads = pluginStats[pluginName]?.downloads || 0;
    plugin.rating = pluginStats[pluginName]?.rating || 0;
    
    res.json(plugin);
  } catch (error) {
    res.status(404).json({ error: 'Plugin not found' });
  }
});

app.post('/api/plugins/:name/download', (req, res) => {
  const pluginName = req.params.name;
  
  // Update download statistics
  if (!pluginStats[pluginName]) {
    pluginStats[pluginName] = { downloads: 0, rating: 0 };
  }
  pluginStats[pluginName].downloads += 1;
  
  res.json({ success: true });
});

app.post('/api/plugins/:name/rate', (req, res) => {
  const pluginName = req.params.name;
  const { rating } = req.body;
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  if (!pluginStats[pluginName]) {
    pluginStats[pluginName] = { downloads: 0, rating: 0 };
  }
  
  // Calculate new average rating (simplified)
  const currentStats = pluginStats[pluginName];
  const newRating = (currentStats.rating + rating) / 2;
  pluginStats[pluginName].rating = newRating;
  
  res.json({ success: true, rating: newRating });
});

// Serve plugin files
app.get('/plugins/:name/*', (req, res) => {
  const pluginName = req.params.name;
  const filePath = req.params[0];
  const fullPath = path.join(__dirname, 'repository', 'plugins', pluginName, filePath);
  
  res.sendFile(fullPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Advanced plugin repository server running on http://localhost:${PORT}`);
});
```

## Plugin Distribution

### Publishing Plugins

To publish a plugin to a repository:

1. Create the plugin following the standard structure
2. Create a `plugin.json` manifest file
3. Add the plugin files to the repository
4. Update `plugins.json` with the plugin information

### Plugin Versioning

Follow semantic versioning for plugins:

```json
{
  "name": "my-plugin",
  "version": "1.2.3", // MAJOR.MINOR.PATCH
  "author": "Plugin Author",
  "description": "A sample plugin"
}
```

### Plugin Updates

To update a plugin:

1. Increment the version number in `plugin.json`
2. Update the plugin files
3. Update the entry in `plugins.json` with the new version

## Repository Management

### Adding Plugins

To add a new plugin to the repository:

1. Create a new directory in the `plugins/` folder
2. Add the plugin files to the directory
3. Create a `plugin.json` file with plugin metadata
4. Update `plugins.json` with the new plugin information

### Removing Plugins

To remove a plugin from the repository:

1. Remove the plugin directory from `plugins/`
2. Remove the plugin entry from `plugins.json`

### Updating Plugin Information

To update plugin information:

1. Modify the `plugin.json` file in the plugin directory
2. Update the corresponding entry in `plugins.json`

### Category Management

To manage plugin categories:

1. Create or update `categories.json`
2. Assign categories to plugins in `plugins.json`

## Security Considerations

### Plugin Verification

Implement plugin verification to ensure authenticity:

```javascript
// server.js
const crypto = require('crypto');

// Function to verify plugin signature
function verifyPluginSignature(pluginData, signature, publicKey) {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(JSON.stringify(pluginData));
  return verifier.verify(publicKey, signature, 'hex');
}

app.get('/api/plugins/:name', async (req, res) => {
  try {
    const pluginName = req.params.name;
    const pluginPath = path.join(__dirname, 'repository', 'plugins', pluginName, 'plugin.json');
    
    const pluginData = await fs.readFile(pluginPath, 'utf8');
    const plugin = JSON.parse(pluginData);
    
    // Verify signature if present
    if (plugin.signature && plugin.publicKey) {
      const isValid = verifyPluginSignature(
        { name: plugin.name, version: plugin.version },
        plugin.signature,
        plugin.publicKey
      );
      
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid plugin signature' });
      }
    }
    
    res.json(plugin);
  } catch (error) {
    res.status(404).json({ error: 'Plugin not found' });
  }
});
```

### HTTPS

Always use HTTPS for repository communication to protect data in transit:

```javascript
// server.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`Secure plugin repository server running on https://localhost:${PORT}`);
});
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
// server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Input Validation

Validate all input to prevent injection attacks:

```javascript
// server.js
app.get('/api/plugins/:name', async (req, res) => {
  const pluginName = req.params.name;
  
  // Validate plugin name
  if (!/^[a-zA-Z0-9-_]+$/.test(pluginName)) {
    return res.status(400).json({ error: 'Invalid plugin name' });
  }
  
  // Continue with plugin retrieval
});
```

## Best Practices

### Repository Organization

1. **Clear Structure**: Maintain a consistent directory structure
2. **Descriptive Names**: Use clear, descriptive names for plugins and files
3. **Version Control**: Use Git or another version control system
4. **Documentation**: Include README files for the repository and plugins

### Plugin Quality

1. **Testing**: Ensure plugins are thoroughly tested before publishing
2. **Documentation**: Provide comprehensive documentation for each plugin
3. **Licensing**: Include appropriate license information
4. **Security**: Review plugins for security vulnerabilities

### Performance

1. **Caching**: Implement caching for frequently accessed data
2. **Compression**: Use gzip compression for file transfers
3. **CDN**: Consider using a CDN for better performance
4. **Optimization**: Optimize plugin files for size and performance

### User Experience

1. **Search**: Implement search functionality for large repositories
2. **Categories**: Organize plugins into logical categories
3. **Ratings**: Allow users to rate and review plugins
4. **Statistics**: Show download counts and other statistics

### Maintenance

1. **Regular Updates**: Keep plugins up to date with core system changes
2. **Deprecation**: Properly deprecate old plugins
3. **Backup**: Regularly backup the repository
4. **Monitoring**: Monitor repository performance and usage

### Community

1. **Contributions**: Accept contributions from the community
2. **Feedback**: Provide channels for user feedback
3. **Support**: Offer support for plugin users
4. **Guidelines**: Establish clear guidelines for plugin submission

By following this guide, you can create and maintain a robust plugin repository that provides value to users of the Discord Bot Plugin System. Remember to regularly review and update your repository practices to ensure security, performance, and usability.