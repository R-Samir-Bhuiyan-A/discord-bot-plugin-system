// core/repo/index.js
const fs = require('fs').promises;
const path = require('path');
const https = require('http'); // Use http instead of https for local server

class PluginRepository {
  constructor(core) {
    this.core = core;
    this.repoUrl = 'http://localhost:8080'; // Local repo URL
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
      if (manifest.files && Array.isArray(manifest.files)) {
        for (const file of manifest.files) {
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