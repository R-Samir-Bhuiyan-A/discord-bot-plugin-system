# Plugin Distribution Guide

This guide explains how to distribute plugins for the Discord Bot Plugin System, including packaging, publishing, and making plugins available through repositories.

## Table of Contents

1. [Overview](#overview)
2. [Preparing Plugins for Distribution](#preparing-plugins-for-distribution)
3. [Package Structure](#package-structure)
4. [Publishing to Repositories](#publishing-to-repositories)
5. [Manual Distribution](#manual-distribution)
6. [Version Management](#version-management)
7. [Licensing and Legal Considerations](#licensing-and-legal-considerations)
8. [Best Practices](#best-practices)

## Overview

Plugin distribution is the process of making your plugins available to other users of the Discord Bot Plugin System. There are several ways to distribute plugins:

1. **Repository Publishing**: Publish to official or community repositories
2. **Manual Distribution**: Share plugin files directly
3. **Git Repositories**: Host plugins in version control systems
4. **Package Managers**: Use npm or other package managers (for plugins with external dependencies)

The most common and recommended approach is publishing to repositories, which provides the best user experience.

## Preparing Plugins for Distribution

### Quality Assurance

Before distributing a plugin, ensure it meets quality standards:

1. **Testing**: Run comprehensive tests
2. **Documentation**: Provide clear documentation
3. **Security Review**: Check for vulnerabilities
4. **Performance Testing**: Verify performance under load
5. **Compatibility Testing**: Test with different core versions

### Code Preparation

Prepare your plugin code for distribution:

```javascript
// Ensure all dependencies are properly declared
// Remove any development-only code
// Minify/obfuscate code if desired (optional)
// Include all necessary files
```

### Documentation

Include comprehensive documentation:

1. **README.md**: Plugin overview, installation, and usage
2. **LICENSE**: License information
3. **CHANGELOG.md**: Version history and changes
4. **docs/**: Detailed documentation files

## Package Structure

### Standard Distribution Package

A properly packaged plugin for distribution should include:

```
my-plugin-1.2.3.zip
├── plugin.json
├── index.js
├── README.md
├── LICENSE
├── CHANGELOG.md
├── config/
├── data/
├── discord/
│   ├── commands/
│   └── events/
├── web/
│   ├── pages/
│   └── routes/
├── utils/
├── docs/
└── package.json (if external dependencies are needed)
```

### plugin.json for Distribution

Ensure your plugin.json is complete and accurate:

```json
{
  "name": "my-plugin",
  "version": "1.2.3",
  "author": "Your Name <your.email@example.com>",
  "description": "A comprehensive plugin that does amazing things",
  "homepage": "https://github.com/username/my-plugin",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-plugin.git"
  },
  "bugs": {
    "url": "https://github.com/username/my-plugin/issues"
  },
  "license": "MIT",
  "keywords": ["discord", "bot", "utility", "tool"],
  "compatibility": {
    "core": ">=1.5.0"
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": [],
  "config": {
    "apiKey": {
      "type": "string",
      "required": true,
      "description": "API key for external service"
    }
  },
  "entry": "./index.js"
}
```

## Publishing to Repositories

### Repository Requirements

Before publishing, ensure your plugin meets repository requirements:

1. **Valid plugin.json**: All required fields are present
2. **Working Code**: Plugin loads and functions correctly
3. **Documentation**: README.md and other docs are provided
4. **License**: Appropriate license is specified
5. **Security**: No known security vulnerabilities

### Publication Process

1. **Create Repository Account**: Register on the target repository
2. **Prepare Plugin Archive**: Package your plugin files
3. **Submit Plugin**: Follow repository submission guidelines
4. **Await Review**: Wait for repository maintainer review
5. **Publish**: Once approved, plugin becomes available

### Example Submission Script

```javascript
// publish-plugin.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function publishPlugin(pluginPath, repositoryUrl, apiKey) {
  // Validate plugin
  const manifest = JSON.parse(fs.readFileSync(path.join(pluginPath, 'plugin.json'), 'utf8'));
  
  // Create archive
  const archivePath = await createArchive(pluginPath, manifest);
  
  // Upload to repository
  const formData = new FormData();
  formData.append('plugin', fs.createReadStream(archivePath));
  formData.append('manifest', JSON.stringify(manifest));
  
  const response = await fetch(`${repositoryUrl}/api/plugins`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData
  });
  
  if (response.ok) {
    console.log('Plugin published successfully!');
  } else {
    const error = await response.text();
    console.error('Failed to publish plugin:', error);
  }
}

async function createArchive(pluginPath, manifest) {
  const archiveName = `${manifest.name}-${manifest.version}.zip`;
  // Implementation to create zip archive
  return archiveName;
}
```

## Manual Distribution

### Direct File Sharing

For manual distribution, package your plugin as a ZIP file:

```bash
# Create distribution package
cd my-plugin
zip -r my-plugin-1.2.3.zip . -x "*.git*" "node_modules/*" "*.log"
```

### Installation Instructions

Provide clear installation instructions:

```markdown
## Installation

1. Download the plugin package
2. Extract the files to your bot's `plugins/` directory
3. Restart your bot
4. Enable the plugin through the web interface
```

### Update Process

For manual updates:

```markdown
## Updating

1. Download the new version
2. Backup your current plugin directory
3. Replace the files with the new version
4. Restart your bot
```

## Version Management

### Semantic Versioning

Follow semantic versioning (SemVer) for plugin versions:

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

```json
{
  "version": "2.1.3",
  "changelog": {
    "2.1.3": [
      "Fixed issue with command parsing",
      "Improved error handling"
    ],
    "2.1.2": [
      "Added new configuration option",
      "Updated dependencies"
    ]
  }
}
```

### Version Compatibility

Specify compatibility with core system versions:

```json
{
  "compatibility": {
    "core": ">=1.5.0 <3.0.0"
  }
}
```

### Deprecation Policy

Handle deprecated features gracefully:

```javascript
// In your plugin code
if (config.oldSetting) {
  logger.warn('oldSetting is deprecated, use newSetting instead');
  config.newSetting = config.oldSetting;
}
```

## Licensing and Legal Considerations

### Choosing a License

Select an appropriate open-source license:

1. **MIT**: Permissive, simple
2. **Apache 2.0**: Patent protection
3. **GPL**: Copyleft, requires derivative works to be open source

### License Compliance

Ensure compliance with all dependencies:

```json
{
  "license": "MIT",
  "dependencies": {
    "some-library": "MIT",
    "another-library": "Apache-2.0"
  }
}
```

### Attribution

Provide proper attribution for third-party code:

```markdown
## Attribution

This plugin includes code from:
- [Library Name](https://example.com) - MIT License
- [Another Library](https://example.com) - Apache 2.0 License
```

## Best Practices

### Distribution Quality

1. **Thorough Testing**: Test on multiple environments
2. **Clear Documentation**: Provide comprehensive docs
3. **Security Audits**: Check for vulnerabilities
4. **Performance Testing**: Ensure good performance
5. **User Feedback**: Incorporate user suggestions

### Versioning Best Practices

1. **Consistent Versioning**: Follow SemVer strictly
2. **Clear Changelogs**: Document all changes
3. **Backward Compatibility**: Maintain when possible
4. **Migration Guides**: Help users with breaking changes

### Repository Publishing

1. **Complete Metadata**: Fill all plugin.json fields
2. **Quality Screenshots**: Include screenshots if applicable
3. **Detailed Descriptions**: Explain features clearly
4. **Proper Categorization**: Use appropriate categories
5. **Regular Updates**: Keep plugins up to date

### Manual Distribution

1. **Clear Instructions**: Provide step-by-step guides
2. **Backup Recommendations**: Advise users to backup
3. **Compatibility Info**: Specify system requirements
4. **Support Channels**: Provide support contact info

### Community Engagement

1. **Issue Tracking**: Monitor and respond to issues
2. **Feature Requests**: Consider user suggestions
3. **Regular Updates**: Maintain plugins actively
4. **User Documentation**: Keep docs current

By following these distribution guidelines, you can ensure your plugins reach users effectively while maintaining high quality and providing a good user experience.