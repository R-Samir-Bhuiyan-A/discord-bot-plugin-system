// plugins/example-plugin/index.js
module.exports = {
  async init(core) {
    // Register a Discord command
    core.api.registerCommand('hello', 'Say hello', async (interaction) => {
      await interaction.reply('Hello, world! This is the example plugin.');
    });

    // Register a web route using plugin-specific method
    core.api.registerRoute('/api/hello', (req, res) => {
      res.json({ message: 'Hello from the example plugin!' });
    });

    console.log('Example plugin initialized');
  },

  async destroy() {
    console.log('Example plugin destroyed');
  }
};