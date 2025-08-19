# Discord Bot Plugin System Developer Guide

This guide is intended for developers who want to contribute to the core system or create plugins for the Discord Bot Plugin System.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Core System Architecture](#core-system-architecture)
4. [Setting Up Development Environment](#setting-up-development-environment)
5. [Running the System](#running-the-system)
6. [Core Development](#core-development)
7. [Plugin Development](#plugin-development)
8. [Testing](#testing)
9. [Building and Deployment](#building-and-deployment)
10. [Contributing](#contributing)

## Getting Started

The Discord Bot Plugin System is a modular, plugin-driven Discord bot with a Web UI for management. The system is designed with the following principles:

- The core system is permanent and never changes after initial creation
- All features and extensions live in plugins
- Core provides a stable API layer exposing functionality to plugins
- Plugins can be enabled, disabled, updated, removed, or configured in real-time

## Project Structure

The project follows a highly modular structure:

```
project-root/
├── core/
│   ├── discord/       # Base bot connection
│   ├── web/           # Base Web UI + plugin store
│   ├── api/           # Core API exposed to plugins
│   ├── loader/        # Plugin loader and manager
│   └── repo/          # Plugin repository manager
├── plugins/           # Installed plugins
│   └── example-plugin/
│       ├── plugin.json
│       ├── index.js
│       ├── discord/
│       └── web/
├── docs/              # Markdown docs for AI/human handover
│   ├── roadmap.md
│   ├── plugin-dev-guide.md
│   ├── api-reference.md
│   └── change-log.md
├── logs/              # Debugging & monitoring logs
├── config/            # Configurations & environment
├── backups/           # Plugin & config backups
├── tests/             # Automated tests
├── package.json
└── README.md
```

## Core System Architecture

The core system consists of several key components:

### CoreSystem
The main class that initializes and manages all other components.

### DiscordManager
Handles Discord connection and command registration.

### WebServer
Manages the web server and routes.

### PluginLoader
Loads and manages plugins.

### PluginRepository
Handles plugin installation from repositories.

### API
Provides the API that plugins use to register functionality.

### PluginSandbox
Runs plugins in isolated contexts to prevent crashes.

## Setting Up Development Environment

1. **Prerequisites**:
   - Node.js (version 14 or higher)
   - npm (version 6 or higher)
   - Git

2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd discord-bot-plugin-system
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the project root with the following variables:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   PORT=3000
   NODE_ENV=development
   LOG_LEVEL=INFO
   ```

## Running the System

### Development Mode
```bash
npm run dev
```
This starts the system with hot reloading enabled.

### Production Mode
```bash
npm run build
npm start
```
This builds the web UI and starts the system in production mode.

## Core Development

### Adding New Core Functionality

When adding new functionality to the core system, follow these guidelines:

1. **Maintain Permanence**: Ensure that any new functionality becomes part of the permanent core
2. **Provide API Access**: Expose new functionality through the core API for plugins to use
3. **Maintain Backward Compatibility**: Ensure that new features don't break existing plugins
4. **Document Changes**: Update the documentation in the `docs/` directory
5. **Add Tests**: Write tests for new functionality

### Core API Development

The core API is the interface that plugins use to interact with the system. When extending the API:

1. **Define Clear Contracts**: Clearly define what each API method does and what parameters it accepts
2. **Handle Errors Gracefully**: Ensure API methods handle errors appropriately and provide useful error messages
3. **Maintain Consistency**: Keep API method signatures and behavior consistent
4. **Document Methods**: Update the API reference documentation

### Web UI Development

The Web UI is built with Next.js and React. When developing new Web UI features:

1. **Follow Design Principles**: Maintain consistency with the existing dark theme and design language
2. **Ensure Responsiveness**: Make sure new features work well on all screen sizes
3. **Use Reusable Components**: Create reusable components that can be used throughout the application
4. **Implement Accessibility**: Ensure new features are accessible to users with disabilities

## Plugin Development

### Creating a New Plugin

To create a new plugin:

1. Create a new directory in the `plugins/` folder with your plugin name
2. Create a `plugin.json` file with the required metadata
3. Create an entry point file (usually `index.js`)
4. Implement the `init(core)` and `destroy()` functions
5. Register commands, events, routes, or pages as needed

### Plugin Manifest

Every plugin must include a `plugin.json` file:

```json
{
  "name": "example-plugin",
  "version": "1.0.0",
  "author": "Author Name",
  "description": "A sample plugin that adds a Discord command and a Web UI page.",
  "compatibility": {
    "core": ">=1.0.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": ["other-plugin-name"],
  "entry": "./index.js"
}
```

### Plugin Entry Point

The entry point should export an object with `init` and `destroy` functions:

```javascript
module.exports = {
  async init(core) {
    // Plugin initialization code
  },
  
  async destroy() {
    // Cleanup code
  }
};
```

### Registering Functionality

Plugins can register various types of functionality:

#### Discord Commands
```javascript
core.api.registerCommand('command-name', 'Command description', async (interaction) => {
  // Command handler
});
```

#### Discord Events
```javascript
core.api.registerEvent('eventName', (data) => {
  // Event handler
});
```

#### Web Routes
```javascript
core.api.registerRoute('/api/route', (req, res) => {
  // Route handler
});
```

#### Web Pages
```javascript
core.api.registerPage('/page', PageComponent);
```

### Best Practices

1. **Error Handling**: Always validate inputs and handle errors gracefully
2. **Logging**: Use the logging system to provide useful information about your plugin's operation
3. **Resource Cleanup**: Clean up resources in the `destroy()` function
4. **Documentation**: Document your plugin's functionality and configuration options
5. **Testing**: Test your plugin thoroughly before distributing it
6. **Versioning**: Follow semantic versioning for your plugin releases
7. **Compatibility**: Clearly specify compatibility requirements and dependencies
8. **Naming**: Use descriptive names for commands and routes to avoid conflicts
9. **Privacy**: Respect user privacy and only collect necessary data

## Testing

### Running Tests

To run the test suite:
```bash
npm test
```

### Writing Tests

Tests are written with Jest. When adding new tests:

1. **Place Tests Appropriately**: Put tests in the `tests/` directory
2. **Follow Naming Conventions**: Name test files with a `.test.js` extension
3. **Test Core Functionality**: Write tests for core system components
4. **Test Plugin Functionality**: Write tests for plugin loading and management
5. **Test API Endpoints**: Write tests for API endpoint functionality
6. **Test Error Conditions**: Write tests for error handling and edge cases

### Test Coverage

The test suite should cover:

- Plugin loading and management
- API endpoint functionality
- Discord command registration
- Web route handling
- Plugin sandboxing
- Repository functionality

## Building and Deployment

### Building for Production

To build the web UI for production:
```bash
npm run build
```

### Deployment

To deploy the system:

1. Install dependencies with `npm install`
2. Set environment variables
3. Build the web UI with `npm run build`
4. Start the system with `npm start`

For development, you can use `npm run dev` to start the system with hot reloading.

### Environment Variables

The system uses the following environment variables:

- `DISCORD_TOKEN`: The Discord bot token
- `PORT`: The port for the web server (default: 3000)
- `NODE_ENV`: The environment (development, production)
- `LOG_LEVEL`: The logging level (DEBUG, INFO, WARN, ERROR)

## Contributing

We welcome contributions to the project. To contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Write tests for your changes
5. Run the test suite to ensure everything works
6. Submit a pull request

### Code Style

Follow the coding style used in the project:

- Use consistent indentation (2 spaces)
- Use camelCase for variables and functions
- Use PascalCase for classes and components
- Write clear, descriptive variable and function names
- Comment complex code sections
- Keep functions small and focused

### Commit Messages

Write clear, descriptive commit messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Pull Requests

When submitting a pull request:

1. Provide a clear description of the changes
2. Reference any related issues
3. Ensure all tests pass
4. Follow the code style guidelines
5. Update documentation as needed
6. Be responsive to feedback during the review process

This developer guide provides a comprehensive overview of how to work with the Discord Bot Plugin System. For more detailed information about specific aspects of the system, please refer to the individual documentation files in the `docs/` directory.