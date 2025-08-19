# Configuration Guide

This guide explains how to configure the Discord Bot Plugin System. Proper configuration ensures optimal performance, security, and functionality of your bot.

## 📁 Configuration Files

The system uses several configuration files and methods:

### Environment Variables (Primary Configuration)
The main configuration is done through environment variables in the `.env` file. This file is not committed to version control for security reasons.

### Plugin Configuration
Individual plugins may have their own configuration files or methods, typically stored in the `config/` directory.

### System Configuration
Core system settings are managed through environment variables, with some defaults built into the system.

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

### Required Variables

```env
# Discord Bot Token (required)
DISCORD_TOKEN=your_discord_bot_token_here

# Web Server Port (default: 3000)
PORT=3000
```

### Optional Variables

```env
# Environment (development|production, default: development)
NODE_ENV=development

# Logging Level (DEBUG|INFO|WARN|ERROR, default: INFO)
LOG_LEVEL=INFO

# Plugin Repository URL (default: http://localhost:8080)
REPO_URL=http://localhost:8080

# Data Directory (default: ./data)
DATA_DIR=./data

# Backup Directory (default: ./backups)
BACKUP_DIR=./backups

# Maximum Log File Size (default: 10MB)
MAX_LOG_SIZE=10MB

# Maximum Number of Log Files (default: 5)
MAX_LOG_FILES=5
```

### Variable Details

#### DISCORD_TOKEN
- **Required**: Yes
- **Description**: Your Discord bot token from the Discord Developer Portal
- **Security**: Keep this secret! Never share or commit this token
- **Format**: A long string of characters provided by Discord

#### PORT
- **Required**: No (defaults to 3000)
- **Description**: The port on which the web interface will run
- **Valid Values**: Any available port number (1-65535)
- **Example**: `PORT=8080`

#### NODE_ENV
- **Required**: No (defaults to development)
- **Description**: The runtime environment
- **Valid Values**: `development` or `production`
- **Development**: Enables additional debugging features
- **Production**: Optimizes performance and disables debugging

#### LOG_LEVEL
- **Required**: No (defaults to INFO)
- **Description**: The minimum level of messages to log
- **Valid Values**: `DEBUG`, `INFO`, `WARN`, `ERROR`
- **DEBUG**: Most verbose, includes detailed debugging information
- **INFO**: General information about system operations
- **WARN**: Warning messages about potential issues
- **ERROR**: Error messages about failures

#### REPO_URL
- **Required**: No (defaults to http://localhost:8080)
- **Description**: The URL of the plugin repository server
- **Format**: Full URL including protocol (http:// or https://)
- **Example**: `REPO_URL=https://plugins.example.com`

#### DATA_DIR
- **Required**: No (defaults to ./data)
- **Description**: Directory for storing plugin data
- **Format**: Path relative to the project root or absolute path
- **Permissions**: Directory must be writable by the application

#### BACKUP_DIR
- **Required**: No (defaults to ./backups)
- **Description**: Directory for storing plugin and configuration backups
- **Format**: Path relative to the project root or absolute path
- **Permissions**: Directory must be writable by the application

#### MAX_LOG_SIZE
- **Required**: No (defaults to 10MB)
- **Description**: Maximum size of each log file before rotation
- **Format**: Number followed by size unit (B, KB, MB, GB)
- **Example**: `MAX_LOG_SIZE=50MB`

#### MAX_LOG_FILES
- **Required**: No (defaults to 5)
- **Description**: Maximum number of log files to keep
- **Format**: Positive integer
- **Example**: `MAX_LOG_FILES=10`

## 🛠️ Creating the .env File

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your preferred text editor:
```bash
nano .env
```

3. Update the values as needed:
```env
# Discord Bot Configuration
DISCORD_TOKEN=your_actual_discord_bot_token_here
PORT=3000
NODE_ENV=development
LOG_LEVEL=INFO

# Plugin Repository
REPO_URL=http://localhost:8080

# Data and Backup Directories
DATA_DIR=./data
BACKUP_DIR=./backups

# Logging Configuration
MAX_LOG_SIZE=10MB
MAX_LOG_FILES=5
```

## 🔐 Security Considerations

### Protecting Sensitive Information
- Never commit the `.env` file to version control
- The `.gitignore` file should exclude `.env`
- Use different tokens for development and production
- Regularly rotate your Discord bot token

### File Permissions
- Set appropriate permissions on the `.env` file:
```bash
chmod 600 .env
```
- Ensure the application user can read the file
- Restrict access to authorized users only

### Network Security
- Use HTTPS for production deployments
- Restrict access to the web interface with authentication (future feature)
- Use firewalls to limit access to necessary ports only

## 🌐 Web Server Configuration

### Port Configuration
Choose an available port that doesn't conflict with other services:
- Common choices: 3000, 8080, 8000
- Ports below 1024 require administrator privileges
- For public access, consider using a reverse proxy

### Reverse Proxy Setup (Nginx Example)
For production deployments, use a reverse proxy like Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📦 Plugin Configuration

### Individual Plugin Settings
Plugins may require their own configuration:
- Check each plugin's documentation for specific requirements
- Configuration files are typically placed in the `config/` directory
- Some plugins use environment variables prefixed with the plugin name

### Example Plugin Configuration
For a plugin named "moderation-tools", configuration might look like:
```env
# Moderation Tools Plugin Configuration
MODERATION_LOG_CHANNEL=moderation-log
MODERATION_MAX_WARNINGS=3
MODERATION_BAN_DURATION=7d
```

## 📊 Logging Configuration

### Log Levels
The system supports four log levels:
1. **DEBUG**: Detailed information for diagnosing problems
2. **INFO**: General information about system operation
3. **WARN**: Warning messages about potential issues
4. **ERROR**: Error messages about failures

### Log File Management
- Logs are automatically rotated when they reach the maximum size
- Old log files are deleted when the maximum number is exceeded
- Log files are stored in the `logs/` directory

### Log Format
Logs follow a structured format:
```
[TIMESTAMP] [LEVEL] [NAMESPACE] Message
```

Example:
```
[2023-08-18T14:30:45.123Z] [INFO] [core] System started successfully
[2023-08-18T14:30:46.456Z] [DEBUG] [plugin-loader] Loading plugin: example-plugin
```

## 🔄 Environment-Specific Configuration

### Development Environment
Optimized for debugging and development:
```env
NODE_ENV=development
LOG_LEVEL=DEBUG
PORT=3000
```

### Production Environment
Optimized for performance and security:
```env
NODE_ENV=production
LOG_LEVEL=INFO
PORT=80
```

## 🧪 Testing Configuration

### Verification Steps
1. Check that all required environment variables are set
2. Verify that the Discord token is valid
3. Confirm that the configured port is available
4. Test that the web interface loads correctly
5. Check that plugins load without errors

### Common Issues

1. **Missing DISCORD_TOKEN**:
   - Error: "Discord token is required"
   - Solution: Add your Discord token to the `.env` file

2. **Port Already in Use**:
   - Error: "Port already in use"
   - Solution: Change the PORT variable or stop the conflicting service

3. **Invalid Log Level**:
   - Error: "Invalid log level"
   - Solution: Check that LOG_LEVEL is one of DEBUG, INFO, WARN, ERROR

4. **Permission Denied**:
   - Error: "Permission denied" when accessing files
   - Solution: Check file permissions and ownership

## 📈 Performance Configuration

### Memory Usage
Monitor memory usage and adjust configuration if needed:
- Large numbers of plugins may require more memory
- High log levels (DEBUG) generate more data
- Consider log rotation settings for busy systems

### Resource Limits
Set appropriate resource limits for your environment:
- Memory limits for Node.js process
- File descriptor limits
- Network connection limits

## 🛡️ Backup Configuration

### Automated Backups
The system automatically creates backups of:
- Plugin configurations
- Plugin states
- System settings

### Backup Location
Backups are stored in the directory specified by `BACKUP_DIR`:
- Ensure sufficient disk space
- Regularly verify backup integrity
- Test restore procedures periodically

### Backup Retention
- Backups are retained for a configurable period
- Old backups are automatically cleaned up
- Customize retention policies as needed

## 🌍 Internationalization

### Time Zones
The system uses UTC for logging:
- Log timestamps are in UTC
- Convert to local time as needed
- Consider user time zones in plugins

### Character Encoding
- All files use UTF-8 encoding
- Environment variables support Unicode
- Ensure proper encoding in plugin data

## 📚 Best Practices

### Configuration Management
1. Use version control for configuration templates
2. Keep environment-specific configurations separate
3. Document all configuration options
4. Regularly review and update configurations

### Security
1. Protect sensitive configuration files
2. Use different tokens for development and production
3. Regularly rotate credentials
4. Limit access to configuration data

### Monitoring
1. Monitor log file sizes
2. Watch for configuration-related errors
3. Regularly review configuration settings
4. Test configuration changes in development first

### Documentation
1. Document all custom configuration options
2. Keep a record of configuration changes
3. Provide clear instructions for configuration
4. Include examples for complex settings

This configuration guide should help you properly set up and maintain your Discord Bot Plugin System. Remember to regularly review your configuration settings and update them as needed for optimal performance and security.