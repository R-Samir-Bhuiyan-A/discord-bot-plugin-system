# Analytics and Metrics

This document describes the analytics and metrics system for the Discord Bot Plugin System.

## Overview

The analytics and metrics system provides insights into the bot's performance, plugin usage, and overall system health. This information is valuable for both developers and administrators to understand how the system is being used and where improvements can be made.

## Types of Metrics

### 1. System Metrics

- **Uptime**: Track how long the system has been running
- **Restart Count**: Number of times the system has restarted
- **Memory Usage**: Current memory consumption of the Node.js process
- **CPU Usage**: Current CPU usage of the Node.js process
- **Event Loop Delay**: Measure of how long the event loop is being blocked

### 2. Discord Metrics

- **Command Usage**: Track how often each command is used
- **Event Processing**: Track how many Discord events are processed
- **API Latency**: Measure of Discord API response times
- **Guild Count**: Number of Discord servers the bot is in
- **User Count**: Number of users the bot can see

### 3. Plugin Metrics

- **Plugin Load Time**: How long each plugin takes to load
- **Plugin Enable/Disable Count**: Track how often plugins are enabled/disabled
- **Plugin Error Count**: Number of errors occurring in each plugin
- **Plugin Command Usage**: Track command usage by plugin

### 4. Web Metrics

- **Page Views**: Track how often each web page is accessed
- **API Request Count**: Number of API requests handled
- **API Response Time**: Measure of how long API requests take to process
- **Error Rates**: Track the number of errors in web requests

## Implementation Plan

### Core Metrics Collection

The core system will collect basic metrics about its own operation:

```javascript
// core/metrics/index.js
class MetricsCollector {
  constructor() {
    this.metrics = {
      system: {
        uptime: 0,
        restartCount: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        eventLoopDelay: 0
      },
      discord: {
        commandUsage: {},
        eventProcessing: 0,
        apiLatency: 0,
        guildCount: 0,
        userCount: 0
      },
      plugins: {
        loadTime: {},
        enableDisableCount: {},
        errorCount: {},
        commandUsage: {}
      },
      web: {
        pageViews: {},
        apiRequestCount: 0,
        apiResponseTime: [],
        errorRates: 0
      }
    };
    
    // Start collecting system metrics
    this.startSystemMetricsCollection();
  }
  
  startSystemMetricsCollection() {
    // Collect system metrics every 10 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 10000);
  }
  
  collectSystemMetrics() {
    const memoryUsage = process.memoryUsage();
    this.metrics.system.memoryUsage = memoryUsage.heapUsed;
    
    // CPU usage would require additional libraries like pidusage
    // Event loop delay would require additional tracking
    
    this.metrics.system.uptime = process.uptime();
  }
  
  // Methods to record specific metrics
  recordCommandUsage(commandName) {
    if (!this.metrics.discord.commandUsage[commandName]) {
      this.metrics.discord.commandUsage[commandName] = 0;
    }
    this.metrics.discord.commandUsage[commandName]++;
  }
  
  recordPluginLoadTime(pluginName, timeMs) {
    this.metrics.plugins.loadTime[pluginName] = timeMs;
  }
  
  incrementPluginErrorCount(pluginName) {
    if (!this.metrics.plugins.errorCount[pluginName]) {
      this.metrics.plugins.errorCount[pluginName] = 0;
    }
    this.metrics.plugins.errorCount[pluginName]++;
  }
  
  // Get all metrics
  getMetrics() {
    return this.metrics;
  }
}

module.exports = MetricsCollector;
```

### Plugin Integration

Plugins can record their own metrics using the core API:

```javascript
// In a plugin's index.js
module.exports = {
  async init(core) {
    // Record plugin load time
    const startTime = Date.now();
    // ... plugin initialization code ...
    const endTime = Date.now();
    core.metrics.recordPluginLoadTime('my-plugin', endTime - startTime);
    
    // Register a command that records usage
    core.api.registerCommand('my-command', 'A sample command', async (interaction) => {
      // Record command usage
      core.metrics.recordCommandUsage('my-command');
      
      // Command implementation
      await interaction.reply('Hello from my plugin!');
    });
  }
};
```

### Web API for Metrics

The system will expose a web API endpoint to retrieve metrics:

```javascript
// In core/index.js
async registerCoreAPIRoutes() {
  // ... existing routes ...
  
  // Metrics endpoint
  this.api.registerRoute('/api/metrics', (req, res) => {
    try {
      const metrics = this.metrics.getMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.statusCode = 500;
      res.json({ error: 'Failed to fetch metrics' });
    }
  });
}
```

## Dashboard Integration

The metrics will be displayed in the web dashboard:

```javascript
// core/web/app/pages/dashboard.js
// Add to the existing dashboard component

// Fetch metrics
useEffect(() => {
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError('Failed to fetch metrics');
      console.error(err);
    }
  };

  fetchMetrics();
  
  // Set up interval to refresh metrics every 30 seconds
  const interval = setInterval(() => {
    fetchMetrics();
  }, 30000);

  return () => clearInterval(interval);
}, []);

// Add to the JSX
{
  metrics && (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">System Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="font-medium">Uptime</div>
          <div className="text-2xl font-bold mt-2">
            {Math.floor(metrics.system.uptime / 3600)}h {Math.floor((metrics.system.uptime % 3600) / 60)}m
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="font-medium">Memory Usage</div>
          <div className="text-2xl font-bold mt-2">
            {(metrics.system.memoryUsage / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="font-medium">Total Commands</div>
          <div className="text-2xl font-bold mt-2">
            {Object.values(metrics.discord.commandUsage).reduce((a, b) => a + b, 0)}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="font-medium">Active Plugins</div>
          <div className="text-2xl font-bold mt-2">
            {Object.keys(metrics.plugins.loadTime).length}
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Data Storage

For a production system, metrics should be stored persistently. Options include:

1. **In-memory storage** (current implementation) - Simple but data is lost on restart
2. **File-based storage** - Store metrics in JSON files
3. **Database storage** - Use a database like MongoDB or PostgreSQL
4. **External analytics service** - Integrate with services like Prometheus, Grafana, or Google Analytics

For now, we'll implement in-memory storage with periodic file backups:

```javascript
// core/metrics/index.js
const fs = require('fs').promises;
const path = require('path');

class MetricsCollector {
  constructor() {
    // ... existing code ...
    
    this.metricsFile = path.join(__dirname, '..', '..', 'logs', 'metrics.json');
    this.loadMetricsFromFile();
    this.startMetricsBackup();
  }
  
  async loadMetricsFromFile() {
    try {
      const data = await fs.readFile(this.metricsFile, 'utf8');
      this.metrics = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is invalid, use default metrics
      console.log('No existing metrics file found, starting fresh');
    }
  }
  
  async saveMetricsToFile() {
    try {
      // Create logs directory if it doesn't exist
      const logsDir = path.dirname(this.metricsFile);
      await fs.mkdir(logsDir, { recursive: true });
      
      await fs.writeFile(this.metricsFile, JSON.stringify(this.metrics, null, 2));
    } catch (error) {
      console.error('Failed to save metrics to file:', error);
    }
  }
  
  startMetricsBackup() {
    // Save metrics to file every 5 minutes
    setInterval(() => {
      this.saveMetricsToFile();
    }, 5 * 60 * 1000);
  }
  
  // ... rest of the class ...
}
```

## Privacy Considerations

When collecting metrics, it's important to consider user privacy:

1. **Anonymization**: Don't collect personally identifiable information (PII)
2. **Opt-in/Opt-out**: Allow users to disable metrics collection
3. **Data Retention**: Implement policies for how long metrics data is kept
4. **Transparency**: Clearly document what data is collected and how it's used
5. **Security**: Ensure metrics data is stored securely

## Future Enhancements

1. **Real-time Dashboards**: Implement real-time updates for metrics in the web UI
2. **Alerting System**: Set up alerts for critical metrics (e.g., high error rates)
3. **Historical Data**: Store and display historical metrics data
4. **Export Functionality**: Allow exporting metrics data for further analysis
5. **Integration with External Tools**: Integrate with popular analytics platforms

This analytics and metrics system will provide valuable insights into the operation of the Discord Bot Plugin System, helping developers and administrators understand how the system is performing and where improvements can be made.