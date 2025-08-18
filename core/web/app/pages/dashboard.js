// core/web/app/pages/dashboard.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [botStatus, setBotStatus] = useState({
    status: 'loading',
    username: null,
    guildCount: 0,
    userCount: 0,
    uptime: 0
  });
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bot status
  useEffect(() => {
    const fetchBotStatus = async () => {
      try {
        const response = await fetch('/api/bot/status');
        const data = await response.json();
        setBotStatus(data);
      } catch (err) {
        setError('Failed to fetch bot status');
        console.error(err);
      }
    };

    // Fetch plugins
    const fetchPlugins = async () => {
      try {
        const response = await fetch('/api/plugins');
        const data = await response.json();
        setPlugins(data);
      } catch (err) {
        setError('Failed to fetch plugins');
        console.error(err);
      }
    };

    // Initial fetch
    fetchBotStatus();
    fetchPlugins();

    // Set up interval to refresh status every 5 seconds
    const interval = setInterval(() => {
      fetchBotStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Format uptime
  const formatUptime = (ms) => {
    if (!ms) return '0s';
    
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Discord Bot Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Real-time monitoring and management of your Discord bot
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            {error}
          </div>
        )}

        {/* Bot Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Bot Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(botStatus.status)}`}></div>
                <span className="font-medium">Status</span>
              </div>
              <div className="text-2xl font-bold mt-2 capitalize">{botStatus.status}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="font-medium">Bot Name</div>
              <div className="text-2xl font-bold mt-2 truncate">
                {botStatus.username || 'Not connected'}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="font-medium">Servers</div>
              <div className="text-2xl font-bold mt-2">{botStatus.guildCount}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="font-medium">Uptime</div>
              <div className="text-2xl font-bold mt-2">{formatUptime(botStatus.uptime)}</div>
            </div>
          </div>
        </div>

        {/* Plugin Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Plugin Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {plugins.length}
              </div>
              <div className="text-gray-600">Total Plugins</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {plugins.filter(p => p.enabled).length}
              </div>
              <div className="text-gray-600">Enabled Plugins</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {plugins.filter(p => !p.enabled).length}
              </div>
              <div className="text-gray-600">Disabled Plugins</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2 className="dashboard-card-title">Plugin Management</h2>
            <p className="dashboard-card-content">
              Enable, disable, and manage your plugins in real-time
            </p>
            <a href="/plugins" className="dashboard-card-link">
              Go to Plugin Store →
            </a>
          </div>

          <div className="dashboard-card">
            <h2 className="dashboard-card-title">Activity Logs</h2>
            <p className="dashboard-card-content">
              View detailed logs of bot and plugin activities
            </p>
            <div className="text-gray-400 font-medium">
              Coming soon
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="dashboard-card-title">Analytics</h2>
            <p className="dashboard-card-content">
              Monitor your bot's performance and usage statistics
            </p>
            <div className="text-gray-400 font-medium">
              Coming soon
            </div>
          </div>
        </div>

        {/* Recent Plugins */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Recently Installed Plugins</h2>
          {plugins.length === 0 ? (
            <p className="text-gray-500">No plugins installed</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plugins.slice(0, 3).map((plugin) => (
                <div key={plugin.name} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{plugin.manifest.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{plugin.manifest.description}</p>
                    </div>
                    <span className={plugin.enabled ? 'badge-success' : 'badge-error'}>
                      {plugin.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Version {plugin.manifest.version}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}