# Plugin Repository System

This document describes the plugin repository system for the Discord Bot Plugin System.

## Overview

The plugin repository system allows users to easily discover, install, and update plugins for their Discord bot. It provides a centralized location for plugin distribution and management.

## Repository Structure

A plugin repository is a web server that hosts plugin files and metadata. The repository must have the following structure:

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
```

### plugins.json

The `plugins.json` file is the main index of the repository. It contains a list of all available plugins with their basic information:

```json
[
  {
    "name": "example-plugin",
    "version": "1.0.0",
    "author": "Plugin Author",
    "description": "A sample plugin that demonstrates the plugin system",
    "url": "/plugins/example-plugin/plugin.json"
  },
  {
    "name": "another-plugin",
    "version": "2.1.0",
    "author": "Another Author",
    "description": "Another plugin that does something useful",
    "url": "/plugins/another-plugin/plugin.json"
  }
]
```

### Plugin Directory

Each plugin has its own directory containing:

1. `plugin.json`: The plugin manifest file with detailed information
2. Plugin files: The actual plugin code and assets
3. Any additional files required by the plugin

## Repository API

The repository system uses simple HTTP requests to communicate with repositories. The core system implements the following endpoints:

### GET /plugins.json

Retrieve the list of available plugins.

Response:
```json
[
  {
    "name": "example-plugin",
    "version": "1.0.0",
    "author": "Plugin Author",
    "description": "A sample plugin that demonstrates the plugin system",
    "url": "/plugins/example-plugin/plugin.json"
  }
]
```

### GET /plugins/{plugin-name}/plugin.json

Retrieve detailed information about a specific plugin.

Response:
```json
{
  "name": "example-plugin",
  "version": "1.0.0",
  "author": "Plugin Author",
  "description": "A sample plugin that demonstrates the plugin system",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands"],
    "web": ["routes"]
  },
  "files": [
    "index.js",
    "README.md"
  ],
  "entry": "./index.js"
}
```

### GET /plugins/{plugin-name}/{file-name}

Retrieve a specific file from a plugin.

## Implementation Details

### Core Repository Manager

The core system includes a `PluginRepository` class that handles communication with repositories:

```javascript
// core/repo/index.js
const https = require('https');

class PluginRepository {
  constructor(core) {
    this.core = core;
    this.repoUrl = 'http://localhost:8080'; // Default repository URL
    this.cache = new Map(); // Cache for plugin manifests
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache timeout
  }

  // Get list of available plugins from repository
  async getAvailablePlugins() {
    try {
      // Check if we have cached data that's still valid
      const cached = this.cache.get('plugins');
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Fetch plugin list from repository
      const pluginList = await this.fetchJson(`${this.repoUrl}/plugins.json`);
      
      // Cache the result
      this.cache.set('plugins', {
        data: pluginList,
        timestamp: Date.now()
      });
      
      return pluginList;
    } catch (error) {
      console.error('Failed to fetch available plugins:', error);
      throw new Error(`Failed to fetch available plugins: ${error.message}`);
    }
  }

  // Get detailed information about a specific plugin
  async getPluginInfo(pluginName) {
    try {
      // Check if we have cached data that's still valid
      const cached = this.cache.get(`plugin-${pluginName}`);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Fetch plugin manifest from repository
      const pluginInfo = await this.fetchJson(`${this.repoUrl}/plugins/${pluginName}/plugin.json`);
      
      // Cache the result
      this.cache.set(`plugin-${pluginName}`, {
        data: pluginInfo,
        timestamp: Date.now()
      });
      
      return pluginInfo;
    } catch (error) {
      console.error(`Failed to fetch info for plugin ${pluginName}:`, error);
      throw new Error(`Failed to fetch info for plugin ${pluginName}: ${error.message}`);
    }
  }

  // Install a plugin from the repository
  async installPlugin(pluginName) {
    try {
      console.log(`Installing plugin ${pluginName}...`);
      
      // Get plugin info
      const pluginInfo = await this.getPluginInfo(pluginName);
      
      // Check compatibility
      if (pluginInfo.compatibility && pluginInfo.compatibility.core) {
        // In a real implementation, we would check version compatibility here
        console.log(`Plugin ${pluginName} has compatibility requirements: ${pluginInfo.compatibility.core}`);
      }
      
      // Create plugin directory
      const pluginDir = path.join(this.core.plugins.pluginPath, pluginName);
      await fs.mkdir(pluginDir, { recursive: true });
      
      // Download plugin manifest
      const manifestUrl = `${this.repoUrl}/plugins/${pluginName}/plugin.json`;
      const manifest = await this.fetchJson(manifestUrl);
      await fs.writeFile(
        path.join(pluginDir, 'plugin.json'),
        JSON.stringify(manifest, null, 2)
      );
      
      // Download plugin files
      if (pluginInfo.files && Array.isArray(pluginInfo.files)) {
        for (const file of pluginInfo.files) {
          const fileUrl = `${this.repoUrl}/plugins/${pluginName}/${file}`;
          const fileContent = await this.fetchText(fileUrl);
          await fs.writeFile(
            path.join(pluginDir, file),
            fileContent
          );
        }
      } else {
        // Try to download index.js by default
        try {
          const fileUrl = `${this.repoUrl}/plugins/${pluginName}/index.js`;
          const fileContent = await this.fetchText(fileUrl);
          await fs.writeFile(
            path.join(pluginDir, 'index.js'),
            fileContent
          );
        } catch (error) {
          console.warn(`Could not download index.js for plugin ${pluginName}`);
        }
      }
      
      // Load the newly installed plugin
      await this.core.plugins.loadPlugin(pluginName);
      
      console.log(`Plugin ${pluginName} installed successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to install plugin ${pluginName}:`, error);
      throw new Error(`Failed to install plugin ${pluginName}: ${error.message}`);
    }
  }

  // Helper method to fetch JSON data
  async fetchJson(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET'
      };
      
      const req = https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            // Check if response is successful
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(JSON.parse(data));
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse JSON response: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Network error: ${error.message}`));
      });
      
      // Set a timeout for the request
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  // Helper method to fetch text data
  async fetchText(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET'
      };
      
      const req = https.get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          // Check if response is successful
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Network error: ${error.message}`));
      });
      
      // Set a timeout for the request
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  // Set repository URL
  setRepoUrl(url) {
    this.repoUrl = url;
    // Clear cache when changing repository
    this.cache.clear();
  }
}

module.exports = PluginRepository;
```

### Web UI Integration

The web UI provides a user-friendly interface for browsing and installing plugins from the repository:

```javascript
// core/web/app/pages/plugins.js
// Add to the existing plugins page component

// State for repository plugins
const [availablePlugins, setAvailablePlugins] = useState([]);
const [loading, setLoading] = useState(false);

// Fetch available plugins from repository
const fetchAvailablePlugins = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/repo/plugins');
    const data = await response.json();
    setAvailablePlugins(data);
  } catch (err) {
    setError('Failed to fetch available plugins');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

// Install a plugin from repository
const installPlugin = async (pluginName) {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/repo/install', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pluginName }),
    });
    
    if (response.ok) {
      fetchInstalledPlugins(); // Refresh the list
    } else {
      const data = await response.json();
      setError(data.error || 'Failed to install plugin');
    }
  } catch (err) {
    setError('Failed to install plugin');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

// Add to the JSX
{
  /* Available Plugins Section */
}
<div className="plugin-section">
  <div className="plugin-section-header">
    <h2 className="plugin-section-title">Available Plugins</h2>
    <button
      onClick={fetchAvailablePlugins}
      disabled={loading}
      className={loading ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
    >
      {loading ? 'Loading...' : 'Refresh'}
    </button>
  </div>
  
  {availablePlugins.length === 0 ? (
    <p className="text-gray-500">No available plugins. Click refresh to load.</p>
  ) : (
    <div className="plugin-list">
      {availablePlugins.map((plugin) => (
        <div key={plugin.name} className="plugin-item">
          <div className="plugin-item-header">
            <div className="plugin-item-content">
              <h3 className="plugin-item-title">{plugin.name}</h3>
              <p className="plugin-item-description">{plugin.description}</p>
              <p className="plugin-item-meta">Version {plugin.version} by {plugin.author}</p>
            </div>
          </div>
          
          <div className="plugin-item-actions">
            <button
              onClick={() => installPlugin(plugin.name)}
              disabled={loading}
              className={loading ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
            >
              {loading ? 'Installing...' : 'Install'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

## Creating a Repository

To create a plugin repository, follow these steps:

1. Create a web server to host the repository files
2. Create the repository structure as described above
3. Create a `plugins.json` file with the list of available plugins
4. Create directories for each plugin with their manifest and files
5. Deploy the repository to a web-accessible location

### Example Repository Server

Here's a simple example of a repository server using Node.js and Express:

```javascript
// repo-server/index.js
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

### Repository Directory Structure

```
repo-server/
├── index.js
├── package.json
└── repository/
    ├── plugins.json
    └── plugins/
        ├── example-plugin/
        │   ├── plugin.json
        │   └── index.js
        └── ...
```

### Sample plugins.json

```json
[
  {
    "name": "example-plugin",
    "version": "1.0.0",
    "author": "Project Team",
    "description": "A sample plugin that adds a Discord command and a Web UI page.",
    "url": "/plugins/example-plugin/plugin.json"
  }
]
```

### Sample plugin.json

```json
{
  "name": "example-plugin",
  "version": "1.0.0",
  "author": "Project Team",
  "description": "A sample plugin that adds a Discord command and a Web UI page.",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands"],
    "web": ["routes"]
  },
  "files": [
    "index.js"
  ],
  "entry": "./index.js"
}
```

## Security Considerations

When implementing and using plugin repositories, consider the following security aspects:

1. **Plugin Verification**: Implement a system to verify the authenticity and integrity of plugins
2. **HTTPS**: Always use HTTPS for repository communication
3. **Sandboxing**: Ensure plugins run in a sandboxed environment to prevent malicious code from affecting the system
4. **Permissions**: Clearly define and enforce plugin permissions
5. **Code Review**: Encourage code review for plugins in public repositories
6. **Vulnerability Scanning**: Implement automated scanning for known vulnerabilities in plugin code

## Future Enhancements

1. **Plugin Ratings and Reviews**: Allow users to rate and review plugins
2. **Plugin Categories**: Organize plugins into categories for easier discovery
3. **Search Functionality**: Implement search capabilities for the plugin repository
4. **Plugin Dependencies**: Handle plugin dependencies automatically
5. **Plugin Updates**: Implement an update mechanism for installed plugins
6. **Multiple Repositories**: Support multiple plugin repositories
7. **Plugin Verification**: Implement a system to verify plugin authenticity
8. **Plugin Statistics**: Collect and display download statistics for plugins

The plugin repository system provides a convenient way for users to discover and install plugins, making the Discord Bot Plugin System more accessible and extensible.