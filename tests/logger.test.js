// tests/logger.test.js
const Logger = require('../core/logger');

describe('Logger', () => {
  let logger;
  
  beforeEach(() => {
    logger = new Logger({});
  });
  
  test('should create logger instance', () => {
    expect(logger).toBeInstanceOf(Logger);
    expect(logger.logLevel).toBe('INFO');
  });
  
  test('should get logger for namespace', () => {
    const namespaceLogger = logger.getLogger('test-namespace');
    expect(namespaceLogger).toBeDefined();
    expect(typeof namespaceLogger.debug).toBe('function');
    expect(typeof namespaceLogger.info).toBe('function');
    expect(typeof namespaceLogger.warn).toBe('function');
    expect(typeof namespaceLogger.error).toBe('function');
  });
  
  test('should set log level', () => {
    logger.setLogLevel('DEBUG');
    expect(logger.logLevel).toBe('DEBUG');
    
    logger.setLogLevel('INVALID');
    expect(logger.logLevel).toBe('DEBUG'); // Should not change
  });
  
  test('should format log message correctly', () => {
    const formatted = logger.formatLogMessage('INFO', 'test', 'message');
    expect(formatted).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\] \[test\] message/);
  });
});