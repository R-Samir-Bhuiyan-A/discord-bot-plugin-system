# Troubleshooting Guide

This guide helps you identify and resolve common issues with the Discord Bot Plugin System. Use this guide when you encounter problems with the bot, plugins, or web interface.

## 📋 Common Issues and Solutions

### Bot Connection Issues

#### Problem: Bot shows as "Disconnected" in the dashboard
**Possible Causes:**
- Invalid or missing Discord token
- Network connectivity issues
- Discord API outages
- Bot not added to any servers

**Solutions:**
1. Verify your `DISCORD_TOKEN` in the `.env` file
2. Check that the token is correct in the Discord Developer Portal
3. Ensure your bot has been added to at least one Discord server
4. Check network connectivity
5. Restart the application

#### Problem: "Invalid Token" error in logs
**Possible Causes:**
- Incorrect Discord token
- Token has been revoked
- Token copied incorrectly

**Solutions:**
1. Generate a new token in the Discord Developer Portal
2. Copy the new token exactly (no extra spaces)
3. Update the `DISCORD_TOKEN` in your `.env` file
4. Restart the application

#### Problem: Bot is online but not responding to commands
**Possible Causes:**
- Bot lacks necessary permissions
- Slash commands not registered
- Command conflicts between plugins
- Discord API caching delays

**Solutions:**
1. Verify bot permissions in Discord server settings
2. Check that plugins with commands are enabled
3. Restart the application to re-register commands
4. Wait up to an hour for Discord's command cache to update

### Web Interface Issues

#### Problem: Cannot access the web interface
**Possible Causes:**
- Server not running
- Incorrect port configuration
- Port conflicts
- Firewall blocking access

**Solutions:**
1. Verify the server is running with `npm run dev` or `npm start`
2. Check the configured port in `.env` file
3. Ensure the port is not being used by another application
4. Check firewall settings to allow access to the port

#### Problem: Web interface loads but shows errors
**Possible Causes:**
- JavaScript errors
- API connection issues
- Browser compatibility problems
- Network connectivity issues

**Solutions:**
1. Check browser console for JavaScript errors (F12 Developer Tools)
2. Verify the server is running and accessible
3. Try a different browser or clear browser cache
4. Check network connectivity

#### Problem: Plugin actions (enable/disable/delete) fail
**Possible Causes:**
- Server API errors
- Insufficient permissions
- Plugin conflicts
- Server not responding

**Solutions:**
1. Check server logs for error messages
2. Verify the action is valid (can't disable an already disabled plugin)
3. Restart the server
4. Check browser console for network errors

### Plugin Issues

#### Problem: Plugin fails to load
**Possible Causes:**
- Invalid `plugin.json` file
- Missing or incorrect entry point
- Syntax errors in plugin code
- Missing dependencies

**Solutions:**
1. Validate `plugin.json` syntax (use a JSON validator)
2. Verify the entry point file exists and is correctly specified
3. Check server logs for specific error messages
4. Ensure all required dependencies are installed

#### Problem: Plugin commands don't appear in Discord
**Possible Causes:**
- Plugin not enabled
- Command registration failed
- Discord API caching
- Permission issues

**Solutions:**
1. Verify the plugin is enabled in the web interface
2. Check server logs for command registration errors
3. Restart the server to force command re-registration
4. Wait up to an hour for Discord's command cache to update
5. Verify bot has permission to create commands

#### Problem: Plugin causes system instability
**Possible Causes:**
- Infinite loops in plugin code
- Memory leaks
- Unhandled exceptions
- Resource exhaustion

**Solutions:**
1. Disable the problematic plugin through the web interface
2. Check server logs for error messages from the plugin
3. Restart the server (plugins are disabled by default on restart)
4. Contact the plugin author to report the issue
5. Remove the plugin if problems persist

### Performance Issues

#### Problem: High CPU or memory usage
**Possible Causes:**
- Resource-intensive plugins
- Memory leaks
- Too many plugins running simultaneously
- Inefficient plugin code

**Solutions:**
1. Identify resource-heavy plugins through process monitoring
2. Disable plugins one by one to identify the culprit
3. Check for plugin updates that may address performance issues
4. Monitor system resources with tools like `htop` or `top`

#### Problem: Slow web interface response
**Possible Causes:**
- High server load
- Network latency
- Large number of plugins
- Inefficient API calls

**Solutions:**
1. Check server resource usage
2. Verify network connectivity
3. Disable unnecessary plugins
4. Check browser console for slow API calls

### Installation Issues

#### Problem: npm install fails
**Possible Causes:**
- Network connectivity issues
- npm registry problems
- Insufficient disk space
- Permission issues

**Solutions:**
1. Check network connectivity
2. Try again later if npm registry is down
3. Verify sufficient disk space available
4. Run with appropriate permissions (avoid sudo unless necessary)
5. Clear npm cache with `npm cache clean --force`

#### Problem: Server fails to start
**Possible Causes:**
- Port already in use
- Missing environment variables
- Syntax errors in code
- Missing dependencies

**Solutions:**
1. Check if another process is using the configured port
2. Verify all required environment variables are set
3. Check server logs for syntax error messages
4. Run `npm install` to ensure all dependencies are installed

## 🛠️ Diagnostic Tools

### Log Analysis
The system maintains detailed logs in the `logs/` directory:
- Check `logs/system.log` for general system messages
- Review error messages for specific details about failures
- Use log levels to filter relevant information

### Health Checks
Perform regular health checks:
1. Verify bot status in Discord
2. Check dashboard for errors
3. Review recent logs
4. Test plugin functionality

### Monitoring Commands
Useful commands for diagnostics:
```bash
# Check if server is running on configured port
netstat -tlnp | grep :3000

# Check system resource usage
htop

# View recent log entries
tail -f logs/system.log

# Check Node.js process
ps aux | grep node
```

## 🔧 Advanced Troubleshooting

### Debugging Plugin Issues
1. Enable DEBUG logging level in `.env`:
   ```env
   LOG_LEVEL=DEBUG
   ```
2. Restart the server
3. Reproduce the issue
4. Check logs for detailed error information
5. Look for plugin-specific log entries

### Network Troubleshooting
1. Verify internet connectivity:
   ```bash
   ping discord.com
   ```
2. Check DNS resolution:
   ```bash
   nslookup discord.com
   ```
3. Test connection to Discord API:
   ```bash
   curl -v https://discord.com/api/v10
   ```

### Database/Storage Issues
If using plugins with data storage:
1. Check available disk space:
   ```bash
   df -h
   ```
2. Verify file permissions on data directories
3. Check for database connection issues in logs
4. Validate data file integrity

## 🔄 Recovery Procedures

### Restoring from Backup
If system becomes unstable:
1. Stop the server
2. Locate the most recent backup in the `backups/` directory
3. Restore configuration files as needed
4. Restart the server

### Resetting Plugin States
To reset all plugin states:
1. Stop the server
2. Delete plugin state files (check `config/` directory)
3. Restart the server (all plugins will be disabled by default)
4. Re-enable plugins as needed

### Complete System Reset
As a last resort:
1. Backup important data
2. Delete the entire installation
3. Re-clone the repository
4. Reconfigure environment variables
5. Reinstall plugins

## 📊 Monitoring and Prevention

### Proactive Monitoring
Set up monitoring to catch issues early:
- Regular log reviews
- Resource usage monitoring
- Health check scripts
- Alerting for critical errors

### Preventive Maintenance
Regular maintenance tasks:
- Update plugins and core system
- Clean up old log files
- Verify backup integrity
- Review security settings

### Performance Baselines
Establish performance baselines:
- Normal CPU and memory usage
- Typical response times
- Expected resource consumption
- Plugin behavior patterns

## 🆘 Getting Help

### Community Support
If you can't resolve an issue:
1. Check existing GitHub issues
2. Search community forums
3. Ask for help in community Discord servers
4. Provide detailed information about your issue

### Information to Include When Seeking Help
When asking for help, provide:
- Error messages from logs
- System configuration details
- Steps to reproduce the issue
- Environment information (OS, Node.js version, etc.)
- Plugin list and versions

### Creating Bug Reports
For GitHub issues:
1. Use a clear, descriptive title
2. Describe the issue in detail
3. Include steps to reproduce
4. Provide relevant log excerpts
5. Mention your environment setup

## 🛡️ Security Troubleshooting

### Unauthorized Access Attempts
If you suspect security issues:
1. Check logs for suspicious activity
2. Rotate Discord bot token
3. Review firewall settings
4. Update system and plugin versions
5. Monitor for unusual behavior

### Data Breach Response
If you suspect a data breach:
1. Immediately disable affected plugins
2. Change all relevant credentials
3. Audit system for unauthorized changes
4. Review and enhance security measures
5. Notify affected users if necessary

This troubleshooting guide should help you resolve most common issues with the Discord Bot Plugin System. If you continue to experience problems, consider reaching out to the community or the development team for additional support.