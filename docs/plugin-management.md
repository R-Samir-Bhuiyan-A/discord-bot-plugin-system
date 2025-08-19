# Plugin Management Guide

This guide explains how to effectively manage plugins in the Discord Bot Plugin System. Plugins are the core of extending your bot's functionality, and proper management ensures a stable and feature-rich experience.

## 📦 Understanding Plugins

Plugins are self-contained modules that add functionality to your Discord bot. Each plugin:
- Has its own directory in the `plugins/` folder
- Includes a `plugin.json` manifest file
- Contains an entry point file (usually `index.js`)
- Can register Discord commands, events, web routes, and pages
- Can be enabled, disabled, or deleted independently

## 📋 Plugin States

Each plugin can be in one of three states:
- **Enabled**: The plugin is active and its functionality is available
- **Disabled**: The plugin is installed but not active
- **Not Installed**: The plugin is not present on the system

## 🛠️ Managing Plugins Through the Web Interface

The easiest way to manage plugins is through the web interface Plugin Store.

### Viewing Installed Plugins

1. Navigate to the Plugin Store (`/plugins`)
2. Click on the "Installed Plugins" tab
3. You'll see a list of all installed plugins with:
   - Plugin name and description
   - Current status (Enabled/Disabled)
   - Version number
   - Action buttons (Enable/Disable/Delete)

### Enabling a Plugin

To enable a disabled plugin:
1. Find the plugin in the "Installed Plugins" list
2. Click the "Enable" button
3. The plugin will initialize and its functionality will become available
4. The status badge will change to "Enabled"

When a plugin is enabled:
- Its `init(core)` function is called
- Any registered Discord commands become available
- Any registered web routes become active
- The plugin's functionality is fully operational

### Disabling a Plugin

To disable an enabled plugin:
1. Find the plugin in the "Installed Plugins" list
2. Click the "Disable" button
3. The plugin will be shut down gracefully
4. The status badge will change to "Disabled"

When a plugin is disabled:
- Its `destroy()` function is called for cleanup
- All registered Discord commands are unregistered
- All registered web routes are deactivated
- The plugin's functionality is no longer available
- Plugin state is preserved so it remains disabled after restart

### Deleting a Plugin

To permanently remove a plugin:
1. Find the plugin in the "Installed Plugins" list
2. Click the "Delete" button
3. Confirm the deletion in the dialog that appears
4. The plugin files will be permanently removed

⚠️ **Warning**: Plugin deletion cannot be undone. All plugin data and configuration will be lost.

When a plugin is deleted:
- All plugin files are permanently removed from the system
- Any registered functionality is unregistered
- Plugin data is removed (unless stored externally)
- The plugin no longer appears in the plugin list

## 🌐 Installing Plugins from Repository

The system includes a plugin repository feature for easy plugin installation.

### Browsing Available Plugins

1. Navigate to the Plugin Store (`/plugins`)
2. Click on the "Available Plugins" tab
3. Click "Load Available Plugins" to fetch the plugin list
4. Browse the available plugins

Each available plugin shows:
- Plugin name and description
- Author information
- Version number
- Rating (if available)
- Install button

### Installing a Plugin

To install a plugin from the repository:
1. Find the plugin you want to install
2. Click the "Install" button
3. Wait for the installation to complete
4. The plugin will appear in the "Installed Plugins" tab

During installation:
- The plugin files are downloaded from the repository
- The plugin is placed in the `plugins/` directory
- The plugin appears in the installed plugins list
- By default, newly installed plugins are disabled

### Repository Management

The repository system:
- Fetches plugin lists from a central server
- Downloads plugins securely
- Verifies plugin integrity
- Handles dependencies (future feature)

## 📁 Manual Plugin Installation

You can also install plugins manually by placing them in the `plugins/` directory.

### Installing a Plugin Manually

1. Obtain the plugin files (usually a folder with `plugin.json` and other files)
2. Place the plugin folder in the `plugins/` directory
3. Restart the server or refresh the plugin list in the web interface
4. The plugin will appear in the "Installed Plugins" list (disabled by default)

### Plugin Directory Structure

A properly formatted plugin directory should look like:
```
plugins/
└── plugin-name/
    ├── plugin.json
    ├── index.js
    ├── discord/
    ├── web/
    └── other-files...
```

## ⚙️ Plugin Configuration

Some plugins may require configuration. Configuration methods vary by plugin but typically include:

### Environment Variables
Plugins can read configuration from environment variables set in the `.env` file.

### Configuration Files
Plugins may create and use their own configuration files in the `config/` directory.

### Web Interface
Some plugins may provide configuration options through the web interface.

## 🔄 Plugin Updates

### Checking for Updates
1. Visit the "Available Plugins" tab in the Plugin Store
2. Compare versions of installed plugins with available versions
3. Plugins with newer versions available will be marked for update

### Updating Plugins
1. Delete the old version of the plugin
2. Install the new version from the repository
3. Reconfigure the plugin if necessary

⚠️ **Note**: Future versions will include automatic update functionality.

## 🧪 Plugin Testing and Validation

Before enabling a plugin in production, test it in a development environment:
1. Install the plugin in a test environment
2. Enable the plugin
3. Test all functionality
4. Check for errors in the logs
5. Verify compatibility with other plugins

## 🛡️ Plugin Security

### Trusted Sources
Only install plugins from trusted sources:
- Official repository
- Verified developers
- Well-reviewed community plugins

### Security Checks
The system performs basic security checks:
- Plugin manifest validation
- Entry point verification
- Sandbox execution (limits plugin capabilities)

### Reporting Issues
If you find a security issue with a plugin:
1. Disable the plugin immediately
2. Report the issue to the system maintainers
3. Contact the plugin author
4. Remove the plugin if necessary

## 📊 Plugin Monitoring

### Status Monitoring
Monitor plugin status through:
- Web interface status badges
- System logs
- Bot functionality testing

### Performance Monitoring
Watch for performance issues:
- High CPU or memory usage
- Slow response times
- Error rates

### Error Monitoring
Check logs for plugin errors:
- Initialization failures
- Runtime exceptions
- Resource access issues

## 🗑️ Plugin Cleanup

When removing plugins, consider:
- Data retention requirements
- Backup needs
- Dependencies on other plugins

### Data Retention
Some plugins may store data that you want to preserve:
- User preferences
- Configuration settings
- Generated content

### Backup Strategies
Before deleting plugins:
- Backup important data
- Document configuration settings
- Note any customizations

## 🤝 Plugin Dependencies

Some plugins may depend on other plugins:
- Required dependencies must be installed and enabled
- Missing dependencies will prevent plugin initialization
- Dependency conflicts should be resolved

## 📈 Plugin Analytics

Monitor plugin usage and performance:
- Command usage statistics
- Error frequency
- Response times
- Resource consumption

## 🆘 Troubleshooting Plugin Issues

### Common Problems

1. **Plugin Won't Enable**:
   - Check system logs for error messages
   - Verify plugin manifest is valid
   - Ensure dependencies are met
   - Check plugin code for syntax errors

2. **Plugin Functionality Not Working**:
   - Verify the plugin is enabled
   - Check Discord permissions
   - Review plugin documentation
   - Examine system logs

3. **Plugin Causing System Issues**:
   - Disable the problematic plugin
   - Check for conflicts with other plugins
   - Review recent changes
   - Consult plugin documentation

### Recovery Procedures

If a plugin causes system instability:
1. Restart the server (plugins are disabled by default)
2. Identify and disable the problematic plugin
3. Re-enable other plugins one by one
4. Contact plugin maintainer if issues persist

### Log Analysis

System logs provide detailed information about plugin operations:
- Plugin loading and initialization
- Command registration
- Error messages and stack traces
- Resource usage

## 📚 Best Practices

### Plugin Selection
- Choose plugins from reputable sources
- Read plugin documentation and reviews
- Check plugin compatibility with your system version
- Verify plugin maintenance status

### Plugin Management
- Regularly update plugins
- Monitor plugin performance
- Backup important plugin data
- Remove unused plugins

### Testing
- Test plugins in development environments
- Verify functionality before production use
- Monitor for conflicts between plugins
- Maintain rollback procedures

### Documentation
- Document plugin configurations
- Keep records of installed plugins
- Note any customizations
- Maintain contact information for plugin authors

## 🔄 Backup and Recovery

### Plugin Backups
- Version control plugin directories
- Backup configuration files
- Export plugin data regularly

### Recovery Procedures
- Restore plugin files from backups
- Reconfigure plugins as needed
- Test restored functionality
- Update plugin states

This guide should help you effectively manage plugins in your Discord Bot Plugin System. Remember to always test plugins in a development environment before deploying them in production, and keep regular backups of important data.