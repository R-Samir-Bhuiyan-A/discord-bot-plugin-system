// plugins/example-plugin/index.js
module.exports = {
  async init(core) {
    // Register a Discord command
    core.api.registerCommand('hello', 'Say hello', async (interaction) => {
      await interaction.reply('Hello, world! This is the example plugin.');
    });

    // Register a web route
    core.api.registerRoute('/api/hello', (req, res) => {
      res.json({ message: 'Hello from the example plugin!' });
    });
    
    // Register plugin management routes
    core.api.registerRoute('/api/plugins', (req, res) => {
      const plugins = core.api.getPlugins();
      res.json(plugins);
    });
    
    core.api.registerRoute('/api/plugins/enable', async (req, res) => {
      try {
        const { pluginName } = req.body;
        if (!pluginName) {
          return res.status(400).json({ error: 'Plugin name is required' });
        }
        
        await core.api.enablePlugin(pluginName);
        res.json({ message: `Plugin ${pluginName} enabled successfully` });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    core.api.registerRoute('/api/plugins/disable', async (req, res) => {
      try {
        const { pluginName } = req.body;
        if (!pluginName) {
          return res.status(400).json({ error: 'Plugin name is required' });
        }
        
        await core.api.disablePlugin(pluginName);
        res.json({ message: `Plugin ${pluginName} disabled successfully` });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    console.log('Example plugin initialized');
  },

  async destroy() {
    console.log('Example plugin destroyed');
  }
};