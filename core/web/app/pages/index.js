// core/web/app/pages/index.js
import React from 'react';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Discord Bot Plugin System
          </h1>
          <p className="dashboard-subtitle">
            A modular, plugin-driven Discord bot with Web UI for management
          </p>
        </div>

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
            <h2 className="dashboard-card-title">Discord Integration</h2>
            <p className="dashboard-card-content">
              Extend your Discord bot with custom commands and features
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

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Install plugins from the Plugin Store</li>
            <li>Enable plugins to activate their features</li>
            <li>Use Discord commands registered by plugins</li>
            <li>Monitor plugin performance and usage</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
}