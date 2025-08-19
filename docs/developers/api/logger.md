# Logger API Reference

The Logger API provides a centralized logging system for the Discord Bot Plugin System and its plugins.

## Table of Contents

1. [Overview](#overview)
2. [Getting a Logger](#getting-a-logger)
3. [Logger Methods](#logger-methods)
4. [Log Levels](#log-levels)
5. [Configuration](#configuration)
6. [Best Practices](#best-practices)

## Overview

The Logger API provides a consistent, configurable logging system that all plugins can use. It supports multiple log levels, structured logging, and configurable output formats.

Logs are written to both the console and log files, with rotation to prevent excessive disk usage.

## Getting a Logger

### getLogger(name)

Gets a logger instance for the specified name.

**Parameters:**
- `name` (string): The logger name (typically your plugin name)

**Returns:**
- Logger object with methods for different log levels

**Example:**
```javascript
// In your plugin's init function
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  logger.info('Plugin initialized successfully');
}
```

## Logger Methods

Each logger instance provides methods for different log levels:

### debug(message[, metadata])

Logs a debug message. These are typically only shown in development environments.

**Parameters:**
- `message` (string): The log message
- `metadata` (object, optional): Additional metadata to include with the log

**Example:**
```javascript
const logger = core.api.getLogger('my-plugin');
logger.debug('Processing user data', { userId: 123, action: 'login' });
```

### info(message[, metadata])

Logs an informational message. These are general information messages about normal operations.

**Parameters:**
- `message` (string): The log message
- `metadata` (object, optional): Additional metadata to include with the log

**Example:**
```javascript
const logger = core.api.getLogger('my-plugin');
logger.info('User logged in successfully', { userId: 123 });
```

### warn(message[, metadata])

Logs a warning message. These indicate potential issues that don't prevent normal operation.

**Parameters:**
- `message` (string): The log message
- `metadata` (object, optional): Additional metadata to include with the log

**Example:**
```javascript
const logger = core.api.getLogger('my-plugin');
logger.warn('API rate limit approaching', { requestsRemaining: 5 });
```

### error(message[, metadata])

Logs an error message. These indicate issues that may prevent normal operation.

**Parameters:**
- `message` (string): The log message
- `metadata` (object, optional): Additional metadata to include with the log

**Example:**
```javascript
const logger = core.api.getLogger('my-plugin');
logger.error('Failed to process payment', { 
  userId: 123, 
  error: 'Insufficient funds' 
});
```

## Log Levels

The logging system supports the following log levels, in order of severity:

1. **DEBUG**: Detailed debug information, typically only shown in development
2. **INFO**: General information about normal operations
3. **WARN**: Warning messages about potential issues
4. **ERROR**: Error messages about failures

The system can be configured to show only messages at or above a certain level. For example, in production you might only show WARN and ERROR messages.

### Setting Log Level

Log levels can be set through environment variables:

```env
LOG_LEVEL=DEBUG  # Show all messages
LOG_LEVEL=INFO   # Show info, warn, and error messages
LOG_LEVEL=WARN   # Show warn and error messages
LOG_LEVEL=ERROR  # Show only error messages
```

## Configuration

The Logger API can be configured through environment variables and configuration files.

### Environment Variables

- `LOG_LEVEL`: The minimum log level to display (DEBUG, INFO, WARN, ERROR)
- `LOG_FORMAT`: The format for log messages (JSON, SIMPLE, DETAILED)
- `LOG_FILE`: The file to write logs to (default: logs/system.log)
- `LOG_MAX_SIZE`: Maximum size of log files before rotation (default: 10MB)
- `LOG_MAX_FILES`: Maximum number of log files to keep (default: 5)

### Example Configuration

```env
LOG_LEVEL=INFO
LOG_FORMAT=JSON
LOG_FILE=logs/my-plugin.log
LOG_MAX_SIZE=20MB
LOG_MAX_FILES=10
```

## Best Practices

### 1. Use Appropriate Log Levels

Choose the right log level for each message:

```javascript
const logger = core.api.getLogger('my-plugin');

// DEBUG: Detailed information for diagnosing problems
logger.debug('Processing batch item', { 
  batchId: 'abc123', 
  itemIndex: 5, 
  totalItems: 100 
});

// INFO: General information about normal operations
logger.info('Batch processing completed', { 
  batchId: 'abc123', 
  itemsProcessed: 100 
});

// WARN: Something unexpected happened but processing can continue
logger.warn('Batch contained invalid items', { 
  batchId: 'abc123', 
  invalidItems: 3 
});

// ERROR: A serious problem that prevented normal operation
logger.error('Failed to process batch', { 
  batchId: 'abc123', 
  error: 'Database connection failed' 
});
```

### 2. Include Contextual Information

Include relevant context in log messages:

```javascript
// Good: Includes relevant context
logger.info('User login successful', { 
  userId: user.id, 
  ipAddress: req.ip, 
  userAgent: req.get('User-Agent') 
});

// Bad: Lacks context
logger.info('User login successful');
```

### 3. Avoid Logging Sensitive Data

Never log sensitive information like passwords, API keys, or personal data:

```javascript
// Bad: Logs sensitive data
logger.debug('API request', { 
  url: '/api/users', 
  headers: req.headers,  // May contain auth tokens
  body: req.body         // May contain passwords
});

// Good: Logs only safe information
logger.debug('API request', { 
  url: '/api/users', 
  method: req.method,
  userId: req.user?.id
});
```

### 4. Use Structured Logging

Use structured data rather than concatenating strings:

```javascript
// Good: Structured data
logger.info('Payment processed', {
  userId: 123,
  amount: 99.99,
  currency: 'USD',
  paymentMethod: 'credit_card'
});

// Bad: String concatenation
logger.info(`Payment processed for user 123: $99.99 USD via credit_card`);
```

### 5. Handle Errors Gracefully

Always log errors with full context:

```javascript
try {
  await processPayment(paymentData);
  logger.info('Payment processed successfully', { paymentId: paymentData.id });
} catch (error) {
  logger.error('Payment processing failed', {
    paymentId: paymentData.id,
    userId: paymentData.userId,
    error: error.message,
    stack: error.stack
  });
}
```

### 6. Log at Appropriate Points

Log at key points in your application flow:

```javascript
async function handleCommand(interaction) {
  const logger = core.api.getLogger('my-plugin');
  
  logger.info('Command received', {
    command: interaction.commandName,
    userId: interaction.user.id,
    guildId: interaction.guildId
  });
  
  try {
    const result = await processCommand(interaction);
    
    logger.info('Command processed successfully', {
      command: interaction.commandName,
      userId: interaction.user.id,
      result: result.summary
    });
    
    await interaction.reply(result.message);
  } catch (error) {
    logger.error('Command processing failed', {
      command: interaction.commandName,
      userId: interaction.user.id,
      error: error.message
    });
    
    await interaction.reply({ 
      content: 'Sorry, something went wrong!', 
      ephemeral: true 
    });
  }
}
```

By following these guidelines and using the Logger API effectively, you can create plugins that are easy to debug and monitor in production environments.