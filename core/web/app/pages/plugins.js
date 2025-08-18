// core/web/app/pages/plugins.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Plugins() {
  const [plugins, setPlugins] = useState([]);
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch installed plugins
  useEffect(() => {
    fetchInstalledPlugins();
  }, []);

  const fetchInstalledPlugins = async () => {
    try {
      const response = await fetch('/api/plugins');
      const data = await response.json();
      setPlugins(data);
    } catch (err) {
      setError('Failed to fetch installed plugins');
      console.error(err);
    }
  };

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

  // Enable a plugin
  const enablePlugin = async (pluginName) => {
    try {
      const response = await fetch('/api/plugins/enable', {
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
        setError(data.error || 'Failed to enable plugin');
      }
    } catch (err) {
      setError('Failed to enable plugin');
      console.error(err);
    }
  };

  // Disable a plugin
  const disablePlugin = async (pluginName) => {
    try {
      const response = await fetch('/api/plugins/disable', {
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
        setError(data.error || 'Failed to disable plugin');
      }
    } catch (err) {
      setError('Failed to disable plugin');
      console.error(err);
    }
  };

  // Delete a plugin
  const deletePlugin = async (pluginName) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete the plugin "${pluginName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      console.log(`Deleting plugin: ${pluginName}`);
      const response = await fetch('/api/plugins/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pluginName }),
      });
      
      const data = await response.json();
      console.log('Delete response:', data);
      
      if (response.ok) {
        console.log(`Plugin ${pluginName} deleted successfully`);
        fetchInstalledPlugins(); // Refresh the list
      } else {
        console.error('Delete error:', data.error);
        setError(data.error || 'Failed to delete plugin');
      }
    } catch (err) {
      console.error('Network error when deleting plugin:', err);
      setError('Failed to delete plugin: Network error');
      console.error(err);
    }
  };

  // Install a plugin from repository
  const installPlugin = async (pluginName) => {
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

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Plugin Store</h1>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <div className="plugin-grid">
          {/* Installed Plugins Section */}
          <div className="plugin-section">
            <div className="plugin-section-header">
              <h2 className="plugin-section-title">Installed Plugins</h2>
            </div>
            
            {plugins.length === 0 ? (
              <p className="text-gray-500">No plugins installed</p>
            ) : (
              <div className="plugin-list">
                {plugins.map((plugin) => (
                  <div key={plugin.name} className="plugin-item">
                    <div className="plugin-item-header">
                      <div className="plugin-item-content">
                        <h3 className="plugin-item-title">{plugin.manifest.name}</h3>
                        <p className="plugin-item-description">{plugin.manifest.description}</p>
                        <p className="plugin-item-meta">Version {plugin.manifest.version}</p>
                      </div>
                      <span className={plugin.enabled ? 'badge-success' : 'badge-error'}>
                        {plugin.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    
                    <div className="plugin-item-actions">
                      {plugin.enabled ? (
                        <button
                          onClick={() => disablePlugin(plugin.name)}
                          className="btn btn-warning btn-sm"
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          onClick={() => enablePlugin(plugin.name)}
                          className="btn btn-success btn-sm"
                        >
                          Enable
                        </button>
                      )}
                      <button
                        onClick={() => deletePlugin(plugin.name)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Available Plugins Section */}
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
                        <p className="plugin-item-meta">Version {plugin.version}</p>
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
        </div>
      </div>
    </Layout>
  );
}