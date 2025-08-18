# Change Log

## 2025-08-18

- Project structure created
- Added package.json with dependencies
- Created README.md
- Created initial documentation files:
  - roadmap.md
  - plugin-dev-guide.md
  - api-reference.md
  - change-log.md (this file)
- Began implementing core system
- Created core/index.js with main CoreSystem class
- Created core/api/index.js with API class
- Created core/discord/index.js with DiscordManager class
- Created core/loader/index.js with PluginLoader class
- Created core/web/index.js with WebServer class
- Created core/web/app/pages/index.js with main dashboard
- Created core/web/app/pages/plugins.js with plugin store
- Created index.js as main application entry point
- Created example plugin to demonstrate plugin system
- Created start script with auto-restart capability
- Created tests for core system and API
- Added Jest configuration
- Successfully ran tests to verify implementation
- Updated roadmap to reflect completed core setup
- Added dotenv for environment variable management
- Created .env file for configuration
- Added .gitignore to prevent sensitive files from being committed
- Fixed web server implementation to properly handle JSON responses
- Fixed Discord command registration with Discord API
- Fixed command registration timing issue by registering commands after plugins are loaded
- Successfully tested Discord command functionality
- Enhanced plugin loader with enable/disable functionality
- Added plugin management API endpoints
- Updated web server to handle POST requests with JSON body parsing
- Implemented plugin sandboxing to prevent plugins from crashing the system
- Created tests for plugin sandboxing functionality
- Fixed web server to prevent plugin errors from crashing the system