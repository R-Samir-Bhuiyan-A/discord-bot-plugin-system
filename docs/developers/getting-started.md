# Getting Started

This guide will help you set up your development environment and create your first plugin for the Discord Bot Plugin System.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm (usually comes with Node.js)
- Git
- A code editor (VS Code recommended)

## Setting Up the Development Environment

1. Clone the repository:
```bash
git clone <repository-url>
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

4. Start the development server:
```bash
npm run dev
```

The system will be available at `http://localhost:3000`

## Project Structure

```
discord-bot-plugin-system/
├── core/                 # Core system files
│   ├── discord/          # Discord connection and management
│   ├── web/              # Web UI and API
│   ├── api/              # Core API exposed to plugins
│   ├── loader/           # Plugin loader and manager
│   ├── repo/             # Plugin repository manager
│   └── sandbox/          # Plugin sandboxing system
├── plugins/              # Installed plugins (this is where you'll work)
│   └── example-plugin/   # Example plugin to get you started
├── docs/                 # Documentation (including this guide)
├── logs/                 # System logs
├── config/               # Configuration files
├── backups/              # Plugin and config backups
├── tests/                # Automated tests
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
└── README.md             # Project overview
```

## Creating Your First Plugin

1. Navigate to the `plugins/` directory
2. Create a new directory for your plugin (use kebab-case naming):
```bash
cd plugins
mkdir my-first-plugin
cd my-first-plugin
```

3. Create a `plugin.json` manifest file:
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

4. Create an `index.js` entry point:
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

5. Restart the development server to load your plugin:
```bash
npm run dev
```

6. Test your plugin:
- Go to your Discord server where the bot is installed
- Type `/hello` in any channel
- You should see the response "Hello from my first plugin!"

## Next Steps

Now that you've created your first plugin, explore these topics:
- [Plugin Development Guide](plugin-development/basics.md) for deeper understanding
- [API Reference](api/core.md) to learn about all available core functions
- [Best Practices](best-practices.md) for writing quality plugins
- [Plugin Examples](examples/) to see more complex implementations

Happy coding!