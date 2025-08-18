// core/logger/index.js
const fs = require('fs').promises;
const path = require('path');

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// Default log level
const DEFAULT_LOG_LEVEL = 'INFO';

// Log file path
const LOG_FILE_PATH = path.join(__dirname, '..', '..', 'logs', 'application.log');

class Logger {
  constructor(core) {
    this.core = core;
    this.logLevel = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
    this.logFilePath = LOG_FILE_PATH;
    
    // Ensure logs directory exists
    this.ensureLogsDirectory();
  }
  
  // Ensure logs directory exists
  async ensureLogsDirectory() {
    try {
      const logsDir = path.dirname(this.logFilePath);
      await fs.access(logsDir);
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(path.dirname(this.logFilePath), { recursive: true });
    }
  }
  
  // Get numeric value of log level
  getLogLevelValue(level) {
    return LOG_LEVELS[level] || LOG_LEVELS[DEFAULT_LOG_LEVEL];
  }
  
  // Check if log should be written based on current log level
  shouldLog(level) {
    return this.getLogLevelValue(level) >= this.getLogLevelValue(this.logLevel);
  }
  
  // Format log message
  formatLogMessage(level, namespace, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${namespace}] ${message}`;
  }
  
  // Write log to file
  async writeLogToFile(formattedMessage) {
    try {
      // Ensure logs directory exists
      await this.ensureLogsDirectory();
      
      // Append to log file
      await fs.appendFile(this.logFilePath, formattedMessage + '\n');
    } catch (error) {
      // If we can't write to file, log to console as fallback
      console.error('Failed to write to log file:', error);
    }
  }
  
  // Log debug message
  debug(namespace, message) {
    if (this.shouldLog('DEBUG')) {
      const formattedMessage = this.formatLogMessage('DEBUG', namespace, message);
      console.debug(formattedMessage);
      this.writeLogToFile(formattedMessage);
    }
  }
  
  // Log info message
  info(namespace, message) {
    if (this.shouldLog('INFO')) {
      const formattedMessage = this.formatLogMessage('INFO', namespace, message);
      console.log(formattedMessage);
      this.writeLogToFile(formattedMessage);
    }
  }
  
  // Log warning message
  warn(namespace, message) {
    if (this.shouldLog('WARN')) {
      const formattedMessage = this.formatLogMessage('WARN', namespace, message);
      console.warn(formattedMessage);
      this.writeLogToFile(formattedMessage);
    }
  }
  
  // Log error message
  error(namespace, message) {
    if (this.shouldLog('ERROR')) {
      const formattedMessage = this.formatLogMessage('ERROR', namespace, message);
      console.error(formattedMessage);
      this.writeLogToFile(formattedMessage);
    }
  }
  
  // Get logger instance for a specific namespace
  getLogger(namespace) {
    return {
      debug: (message) => this.debug(namespace, message),
      info: (message) => this.info(namespace, message),
      warn: (message) => this.warn(namespace, message),
      error: (message) => this.error(namespace, message)
    };
  }
  
  // Set log level
  setLogLevel(level) {
    if (LOG_LEVELS.hasOwnProperty(level)) {
      this.logLevel = level;
      this.info('Logger', `Log level set to ${level}`);
    } else {
      this.warn('Logger', `Invalid log level: ${level}. Using default level: ${DEFAULT_LOG_LEVEL}`);
    }
  }
  
  // Rotate log file
  async rotateLogFile() {
    try {
      // Check if log file exists
      try {
        await fs.access(this.logFilePath);
      } catch (error) {
        // Log file doesn't exist, nothing to rotate
        return;
      }
      
      // Get current log file stats
      const stats = await fs.stat(this.logFilePath);
      
      // If file is larger than 10MB, rotate it
      if (stats.size > 10 * 1024 * 1024) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFilePath = `${this.logFilePath}.${timestamp}`;
        
        // Rename current log file to rotated file
        await fs.rename(this.logFilePath, rotatedFilePath);
        
        this.info('Logger', `Log file rotated to ${rotatedFilePath}`);
      }
    } catch (error) {
      this.error('Logger', `Failed to rotate log file: ${error.message}`);
    }
  }
  
  // Clean up old log files
  async cleanupOldLogs() {
    try {
      const logsDir = path.dirname(this.logFilePath);
      
      // Check if logs directory exists
      try {
        await fs.access(logsDir);
      } catch (error) {
        // Logs directory doesn't exist, nothing to clean up
        return;
      }
      
      // Get all files in logs directory
      const files = await fs.readdir(logsDir);
      
      // Filter log files (files that start with 'application.log')
      const logFiles = files.filter(file => file.startsWith('application.log'));
      
      // If we have more than 10 log files, delete the oldest ones
      if (logFiles.length > 10) {
        // Sort files by modification time (oldest first)
        const sortedFiles = logFiles.sort(async (a, b) => {
          const aStats = await fs.stat(path.join(logsDir, a));
          const bStats = await fs.stat(path.join(logsDir, b));
          return aStats.mtime.getTime() - bStats.mtime.getTime();
        });
        
        // Delete oldest files
        const filesToDelete = sortedFiles.slice(0, logFiles.length - 10);
        for (const file of filesToDelete) {
          const filePath = path.join(logsDir, file);
          await fs.unlink(filePath);
          this.info('Logger', `Deleted old log file: ${filePath}`);
        }
      }
    } catch (error) {
      this.error('Logger', `Failed to clean up old log files: ${error.message}`);
    }
  }
}

module.exports = Logger;