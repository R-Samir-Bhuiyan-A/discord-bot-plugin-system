# Plugin Manifest

The `plugin.json` file is the heart of every plugin. It contains metadata about the plugin and is used by the core system to load and manage it properly.

## Purpose

The plugin manifest serves several important purposes:

1. **Identification**: Uniquely identifies the plugin to the system
2. **Metadata**: Provides descriptive information about the plugin
3. **Dependencies**: Declares plugin dependencies and compatibility requirements
4. **Permissions**: Specifies what resources and APIs the plugin needs access to
5. **Entry Point**: Defines the plugin's entry point file

## Required Fields

These fields must be present in every `plugin.json` file:

### name
- **Type**: String
- **Description**: Unique identifier for the plugin
- **Format**: Lowercase letters, numbers, and hyphens only
- **Example**: `"weather-plugin"`

### version
- **Type**: String
- **Description**: Semantic version of the plugin
- **Format**: Major.Minor.Patch (e.g., "1.2.3")
- **Example**: `"1.0.0"`

### author
- **Type**: String
- **Description**: Name of the plugin author
- **Example**: `"Jane Doe"`

### description
- **Type**: String
- **Description**: Brief description of what the plugin does
- **Example**: `"Provides weather information for Discord servers"`

### permissions
- **Type**: Object
- **Description**: Permissions required by the plugin
- **Structure**:
  ```json
  {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  }
  ```
- **Details**: See the Permissions section below

### entry
- **Type**: String
- **Description**: Path to the plugin's entry point file
- **Example**: `"./index.js"`

## Optional Fields

These fields are optional but recommended for better plugin management:

### compatibility
- **Type**: Object
- **Description**: Compatibility requirements with the core system
- **Structure**:
  ```json
  {
    "core": ">=1.0.0"
  }
  ```
- **Example**: 
  ```json
  {
    "core": ">=1.2.0 <2.0.0"
  }
  ```

### dependencies
- **Type**: Array of strings
- **Description**: List of other plugins this plugin depends on
- **Example**: `["database-plugin", "auth-plugin"]`

### homepage
- **Type**: String
- **Description**: URL to the plugin's homepage or repository
- **Example**: `"https://github.com/username/weather-plugin"`

### repository
- **Type**: Object or String
- **Description**: Information about the plugin's source repository
- **Examples**:
  ```json
  "repository": "https://github.com/username/weather-plugin"
  ```
  ```json
  "repository": {
    "type": "git",
    "url": "https://github.com/username/weather-plugin.git"
  }
  ```

### bugs
- **Type**: Object or String
- **Description**: Information about where to report bugs
- **Examples**:
  ```json
  "bugs": "https://github.com/username/weather-plugin/issues"
  ```
  ```json
  "bugs": {
    "url": "https://github.com/username/weather-plugin/issues",
    "email": "support@example.com"
  }
  ```

### license
- **Type**: String
- **Description**: SPDX license identifier
- **Example**: `"MIT"`

### keywords
- **Type**: Array of strings
- **Description**: Keywords to help users find the plugin
- **Example**: `["weather", "forecast", "discord", "bot"]`

### config
- **Type**: Object
- **Description**: Configuration schema for the plugin
- **Example**:
  ```json
  {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "API key for weather service"
    },
    "units": {
      "type": "string",
      "required": false,
      "default": "metric",
      "description": "Temperature units (metric or imperial)"
    }
  }
  ```

## Permissions System

The permissions system controls what resources and APIs a plugin can access. This enhances security by limiting plugin capabilities to only what they need.

### Discord Permissions
- **commands**: Allows registering Discord slash commands
- **events**: Allows registering Discord event handlers
- **messages**: Allows sending and receiving messages
- **reactions**: Allows adding and removing reactions
- **members**: Allows accessing member information
- **roles**: Allows managing roles
- **channels**: Allows managing channels
- **guilds**: Allows accessing guild information

### Web Permissions
- **routes**: Allows registering API routes
- **pages**: Allows registering web pages
- **middleware**: Allows using middleware functions
- **assets**: Allows serving static assets

### Example Permissions Declaration
```json
{
  "permissions": {
    "discord": ["commands", "events", "messages"],
    "web": ["routes", "pages"]
  }
}
```

## Complete Example

Here's a complete example of a `plugin.json` file:

```json
{
  "name": "weather-plugin",
  "version": "2.1.3",
  "author": "Weather Dev",
  "description": "Provides weather information for Discord servers",
  "homepage": "https://github.com/weather-dev/weather-plugin",
  "repository": {
    "type": "git",
    "url": "https://github.com/weather-dev/weather-plugin.git"
  },
  "bugs": {
    "url": "https://github.com/weather-dev/weather-plugin/issues"
  },
  "license": "MIT",
  "keywords": ["weather", "forecast", "discord", "bot", "information"],
  "compatibility": {
    "core": ">=1.5.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": ["database-plugin"],
  "config": {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "API key for OpenWeatherMap service"
    },
    "units": {
      "type": "string",
      "required": false,
      "default": "metric",
      "description": "Temperature units (metric or imperial)"
    },
    "defaultLocation": {
      "type": "string",
      "required": false,
      "default": "New York",
      "description": "Default location for weather queries"
    }
  },
  "entry": "./index.js"
}
```

## Validation

The core system validates plugin manifests when loading plugins. If a manifest is invalid or missing required fields, the plugin will not be loaded, and an error will be logged.

## Best Practices

1. **Keep It Updated**: Always update the version number when making changes
2. **Be Descriptive**: Provide clear descriptions for your plugin and configuration options
3. **Specify Compatibility**: Define compatibility requirements to prevent issues
4. **Declare Permissions**: Only request the permissions your plugin actually needs
5. **List Dependencies**: Declare all plugin dependencies to ensure proper loading order
6. **Include Metadata**: Provide useful metadata like homepage, repository, and license information
7. **Use Semantic Versioning**: Follow semantic versioning (SemVer) for version numbers

By following these guidelines, you'll create well-documented, secure, and maintainable plugins that integrate smoothly with the Discord Bot Plugin System.