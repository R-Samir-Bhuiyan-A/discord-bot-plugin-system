# Getting Started Guide

Welcome to the Discord Bot Plugin System! This guide will help you set up the system, create your first plugin, and start extending your Discord bot with powerful functionality.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm (usually comes with Node.js)
- Git
- A Discord account with a bot token

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/discord-bot-plugin-system.git
cd discord-bot-plugin-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```env
DISCORD_TOKEN=your_discord_bot_token_here
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
```

Replace `your_discord_bot_token_here` with your actual Discord bot token.

4. Start the development server:
```bash
npm run dev
```

The system will be available at `http://localhost:3000`

## 🌐 Accessing the Web Interface

Once the server is running, you can access the web interface at `http://localhost:3000` (or your configured port). The interface includes:

- **Dashboard**: Real-time monitoring of your bot's status and activity
- **Plugin Store**: Browse, install, enable/disable, and manage plugins

## 🤖 Adding Your Bot to a Server

To add your bot to a Discord server:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application or create a new one
3. Go to the "Bot" section and copy your bot token
4. Go to the "OAuth2" → "URL Generator" section
5. Select the "bot" scope
6. Select the permissions your bot needs
7. Copy the generated URL and open it in your browser
8. Select the server where you want to add the bot

## 🧪 Testing the System

After starting the server and adding your bot to a server:

1. Visit `http://localhost:3000` to see the dashboard
2. Check that the bot status shows as "Online"
3. You should see the example plugin installed by default

## 📦 Installing Plugins

You can install plugins in two ways:

### From Repository
1. Go to the Plugin Store in the web interface
2. Click "Available Plugins" tab
3. Click "Load Available Plugins" to fetch the plugin list
4. Find a plugin you want to install and click "Install"

### Manual Installation
1. Download or create a plugin folder
2. Place it in the `plugins/` directory
3. Restart the server or refresh the plugin list in the web interface

## 🚀 Creating Your First Plugin

Let's create a simple plugin that adds a Discord command:

1. Navigate to the `plugins/` directory:
```bash
cd plugins
mkdir my-first-plugin
cd my-first-plugin
```

2. Create a `plugin.json` manifest file:
```json
{
  "name": "my-first-plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "My first plugin for the Discord Bot Plugin System",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands"],
    "web": []
  },
  "entry": "./index.js"
}
```

3. Create an `index.js` entry point:
```javascript
module.exports = {
  async init(core) {
    const logger = core.api.getLogger('my-first-plugin');
    
    // Register a simple Discord command
    core.api.registerCommand('hello', 'Say hello', async (interaction) => {
      await interaction.reply('Hello from my first plugin!');
    });
    
    logger.info('My first plugin initialized successfully');
  },

  async destroy() {
    console.log('My first plugin is being destroyed');
  }
};
```

4. Restart the development server to load your plugin:
```bash
npm run dev
```

5. Test your plugin:
- Go to your Discord server where the bot is installed
- Type `/hello` in any channel
- You should see the response "Hello from my first plugin!"

## 📊 Monitoring Your Bot

The dashboard provides real-time information about your bot:

- **Bot Status**: Online/Connecting/Disconnected status
- **Bot Name**: The name of your bot
- **Servers**: Number of servers your bot is in
- **Uptime**: How long your bot has been running
- **Plugin Status**: Overview of installed plugins
- **Recent Plugins**: Recently installed plugins

## 🛠️ Managing Plugins

In the Plugin Store, you can:

- **View Installed Plugins**: See all plugins currently installed
- **Enable/Disable Plugins**: Turn plugins on or off without removing them
- **Delete Plugins**: Permanently remove plugins
- **Browse Available Plugins**: Discover and install new plugins from the repository

## 🧪 Troubleshooting

If you encounter issues:

1. **Bot Not Connecting**:
   - Check that your `DISCORD_TOKEN` is correct
   - Ensure your bot is added to at least one server
   - Check the logs for error messages

2. **Plugins Not Loading**:
   - Verify that your `plugin.json` file is correctly formatted
   - Check that your entry point file exports the required functions
   - Look at the system logs for error messages

3. **Web Interface Issues**:
   - Ensure the server is running
   - Check that the port is not being used by another application
   - Verify your browser's console for client-side errors

4. **Permission Errors**:
   - Check that your bot has the necessary Discord permissions
   - Verify that file permissions allow the server to read plugin files

## 📚 Next Steps

Now that you've set up the system and created your first plugin, explore these topics:

- [Plugin Development Guide](developers/plugin-development/basics.md) for deeper understanding
- [API Reference](api-reference.md) to learn about all available core functions
- [Plugin Best Practices](plugin-best-practices.md) for writing quality plugins
- [Example Plugins](examples/) to see more complex implementations

## 🆘 Getting Help

If you need help:

1. Check the [documentation](README.md)
2. Look at the [example plugins](examples/)
3. Review the [troubleshooting guide](troubleshooting.md)
4. Open an issue on [GitHub](https://github.com/your-username/discord-bot-plugin-system/issues)
5. Join our community Discord server (link in the project README)

Happy coding!