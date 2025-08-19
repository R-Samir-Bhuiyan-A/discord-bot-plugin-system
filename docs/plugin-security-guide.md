# Plugin Security Guide

This guide provides comprehensive security best practices for developing, deploying, and maintaining plugins for the Discord Bot Plugin System.

## Table of Contents

1. [Security Principles](#security-principles)
2. [Input Validation](#input-validation)
3. [Authentication and Authorization](#authentication-and-authorization)
4. [Data Protection](#data-protection)
5. [Secure Coding Practices](#secure-coding-practices)
6. [Dependency Management](#dependency-management)
7. [Network Security](#network-security)
8. [Error Handling](#error-handling)
9. [Logging and Monitoring](#logging-and-monitoring)
10. [Security Testing](#security-testing)
11. [Incident Response](#incident-response)
12. [Compliance](#compliance)

## Security Principles

### Defense in Depth

Implement multiple layers of security to protect against various attack vectors:

1. **Perimeter Security**: Secure the network boundary
2. **Application Security**: Secure the application code
3. **Data Security**: Protect data at rest and in transit
4. **Operational Security**: Secure deployment and operations

### Principle of Least Privilege

Grant plugins only the minimum permissions necessary to function:

```json
{
  "name": "weather-plugin",
  "permissions": {
    "discord": ["commands"],  // Only commands, not events or services
    "web": ["routes"]         // Only API routes, not pages
  }
}
```

### Secure by Default

Configure plugins securely by default, requiring explicit action to reduce security:

```javascript
// Good: Secure defaults
const config = {
  enableDebug: false,        // Debug mode off by default
  logLevel: 'info',          // Limited logging by default
  rateLimit: 100             // Rate limiting enabled by default
};
```

### Fail Securely

Ensure plugins fail in a secure state when errors occur:

```javascript
// Good: Fail securely
try {
  const userData = await getUserData(userId);
  if (!userData) {
    // Return safe default instead of exposing error
    return getDefaultUserData();
  }
  return userData;
} catch (error) {
  // Log error securely and return safe response
  logger.error('Failed to fetch user data', { userId });
  return getDefaultUserData();
}
```

## Input Validation

### Validate All Input

Never trust input from users, Discord, or external systems:

```javascript
// Good: Comprehensive input validation
core.api.registerCommand('greet', 'Greet a user', async (interaction) => {
  const userInput = interaction.options.getString('name');
  
  // Validate length
  if (!userInput || userInput.length > 100) {
    await interaction.reply({ 
      content: 'Name must be between 1 and 100 characters', 
      ephemeral: true 
    });
    return;
  }
  
  // Validate format
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(userInput)) {
    await interaction.reply({ 
      content: 'Name contains invalid characters', 
      ephemeral: true 
    });
    return;
  }
  
  // Sanitize output
  const sanitizedName = sanitizeHtml(userInput);
  await interaction.reply(`Hello, ${sanitizedName}!`);
});
```

### Use Whitelisting

Prefer whitelisting over blacklisting for validation:

```javascript
// Good: Whitelisting
const validCategories = ['news', 'sports', 'weather'];
if (!validCategories.includes(category)) {
  throw new Error('Invalid category');
}

// Bad: Blacklisting
const invalidChars = ['<', '>', '&', '"', "'"];
if (invalidChars.some(char => input.includes(char))) {
  throw new Error('Invalid input');
}
```

### Sanitize Output

Always sanitize data before displaying it:

```javascript
// Good: Output sanitization
const userContent = await getUserGeneratedContent();
const safeContent = sanitizeHtml(userContent, {
  allowedTags: ['b', 'i', 'em', 'strong'],
  allowedAttributes: {}
});

await interaction.reply(safeContent);
```

## Authentication and Authorization

### Secure Authentication

Implement strong authentication for plugin features:

```javascript
// Good: Secure authentication
async function authenticateUser(token) {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
}
```

### Role-Based Access Control

Implement role-based access control for plugin features:

```javascript
// Good: Role-based access control
async function checkPermission(userId, permission) {
  const userRole = await getUserRole(userId);
  const requiredRoles = getRequiredRoles(permission);
  
  if (!requiredRoles.includes(userRole)) {
    throw new Error('Insufficient permissions');
  }
}

core.api.registerRoute('/api/admin', async (req, res) => {
  try {
    const userId = await authenticateUser(req.headers.authorization);
    await checkPermission(userId, 'admin');
    
    // Admin functionality
    res.json({ data: 'Admin data' });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});
```

### Session Management

Implement secure session management:

```javascript
// Good: Secure session management
const sessionStore = new Map();

function createSession(userId) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  sessionStore.set(sessionId, {
    userId,
    expiresAt
  });
  
  return sessionId;
}

function validateSession(sessionId) {
  const session = sessionStore.get(sessionId);
  if (!session || session.expiresAt < Date.now()) {
    sessionStore.delete(sessionId);
    return null;
  }
  return session.userId;
}
```

## Data Protection

### Encryption at Rest

Encrypt sensitive data stored by plugins:

```javascript
// Good: Encryption at rest
const crypto = require('crypto');

function encryptData(data, key) {
  const algorithm = 'aes-256-gcm';
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex')
  };
}

function decryptData(encryptedData, key) {
  const algorithm = 'aes-256-gcm';
  const { encrypted, iv, authTag } = encryptedData;
  
  const decipher = crypto.createDecipher(algorithm, key);
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Secure Data Transmission

Use HTTPS for all data transmission:

```javascript
// Good: HTTPS for external API calls
const https = require('https');

async function callExternalApi(endpoint, data) {
  const options = {
    hostname: 'api.example.com',
    port: 443,
    path: endpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}
```

### Data Minimization

Collect and store only necessary data:

```javascript
// Good: Data minimization
async function processUserData(userData) {
  // Only store necessary fields
  const minimalData = {
    userId: userData.id,
    preferences: userData.preferences || {}
  };
  
  await core.api.setData('my-plugin', `user-${userData.id}`, minimalData);
}
```

## Secure Coding Practices

### Avoid Code Injection

Prevent code injection vulnerabilities:

```javascript
// Good: Avoiding code injection
// Use parameterized queries for database operations
const query = 'SELECT * FROM users WHERE id = ?';
const result = await db.query(query, [userId]);

// Avoid eval() and similar functions
// Bad: const result = eval(userInput);

// Use safe JSON parsing
try {
  const data = JSON.parse(userInput);
  // Process data safely
} catch (error) {
  // Handle parsing errors
}
```

### Prevent Path Traversal

Prevent path traversal attacks:

```javascript
// Good: Preventing path traversal
const path = require('path');

function getSafeFilePath(userInput) {
  const basePath = '/safe/plugin/data/';
  const resolvedPath = path.resolve(basePath);
  const requestedPath = path.resolve(basePath, userInput);
  
  // Ensure requested path is within base path
  if (!requestedPath.startsWith(resolvedPath)) {
    throw new Error('Invalid file path');
  }
  
  return requestedPath;
}
```

### Secure Random Number Generation

Use cryptographically secure random number generation:

```javascript
// Good: Secure random generation
const crypto = require('crypto');

// Generate secure random strings
const randomString = crypto.randomBytes(32).toString('hex');

// Generate secure random numbers
const randomNumber = crypto.randomInt(1, 100);

// Generate secure tokens
const token = crypto.randomBytes(64).toString('base64url');
```

## Dependency Management

### Vet Dependencies

Carefully vet all dependencies before adding them:

```json
{
  "dependencies": {
    // Only use well-maintained, reputable libraries
    "express": "^4.18.0",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    // Keep development dependencies separate
    "jest": "^29.0.0"
  }
}
```

### Regular Updates

Keep dependencies up to date:

```bash
# Regularly check for updates
npm outdated

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

### Lock Files

Use lock files to ensure consistent dependencies:

```bash
# Generate package-lock.json
npm install

# Commit lock file to version control
git add package-lock.json
git commit -m "Update dependencies"
```

## Network Security

### Secure Connections

Use secure connections for all network communication:

```javascript
// Good: Secure HTTPS connections
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: true,  // Verify certificates
  keepAlive: true            // Reuse connections
});

async function secureApiCall(url, data) {
  const options = {
    method: 'POST',
    agent,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // Implementation
}
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
// Good: Rate limiting implementation
const rateLimiter = new Map();

function checkRateLimit(userId, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const key = `${userId}:${Math.floor(now / windowMs)}`;
  
  const current = rateLimiter.get(key) || 0;
  if (current >= limit) {
    throw new Error('Rate limit exceeded');
  }
  
  rateLimiter.set(key, current + 1);
  return true;
}

core.api.registerCommand('expensive-command', 'Expensive operation', async (interaction) => {
  try {
    checkRateLimit(interaction.user.id);
    // Command implementation
  } catch (error) {
    await interaction.reply({ 
      content: error.message, 
      ephemeral: true 
    });
  }
});
```

### Firewall Rules

Implement appropriate firewall rules:

```javascript
// Good: Restricting network access
const allowedDomains = [
  'api.discord.com',
  'api.example.com'
];

function isAllowedDomain(domain) {
  return allowedDomains.includes(domain);
}
```

## Error Handling

### Secure Error Messages

Don't expose sensitive information in error messages:

```javascript
// Good: Secure error handling
try {
  await performSensitiveOperation();
  await interaction.reply('Operation completed successfully');
} catch (error) {
  // Log detailed error securely
  logger.error('Operation failed', {
    userId: interaction.user.id,
    error: error.message,
    stack: error.stack
  });
  
  // Send generic error message to user
  await interaction.reply({ 
    content: 'Sorry, the operation failed. The issue has been logged.', 
    ephemeral: true 
  });
}
```

### Error Boundaries

Implement error boundaries to prevent crashes:

```javascript
// Good: Error boundaries
class PluginErrorBoundary {
  constructor() {
    this.errors = [];
  }
  
  async execute(operation, fallback) {
    try {
      return await operation();
    } catch (error) {
      this.errors.push({
        timestamp: new Date().toISOString(),
        error: error.message
      });
      
      if (fallback) {
        return await fallback();
      }
      
      throw error;
    }
  }
  
  getErrors() {
    return this.errors;
  }
}

const errorBoundary = new PluginErrorBoundary();

async function init(core) {
  await errorBoundary.execute(
    async () => {
      // Primary initialization
      await initializePlugin(core);
    },
    async () => {
      // Fallback initialization
      await initializePluginFallback(core);
    }
  );
}
```

## Logging and Monitoring

### Secure Logging

Log security-relevant information without exposing sensitive data:

```javascript
// Good: Secure logging
const logger = core.api.getLogger('my-plugin');

function logSecurityEvent(event, data) {
  logger.info('Security event', {
    event,
    userId: data.userId,
    timestamp: new Date().toISOString(),
    // Never log sensitive data like passwords or tokens
    // ip: data.ip, // Only if necessary and properly handled
  });
}

// Bad: Logging sensitive data
logger.info('User login', {
  username: user.username,
  password: user.password,  // Never log passwords
  token: user.token         // Never log tokens
});
```

### Monitor for Anomalies

Monitor for suspicious activity:

```javascript
// Good: Anomaly detection
const activityMonitor = {
  failedLogins: new Map(),
  
  recordFailedLogin(userId) {
    const count = this.failedLogins.get(userId) || 0;
    this.failedLogins.set(userId, count + 1);
    
    if (count >= 5) {
      logger.warn('Multiple failed login attempts', { userId });
      // Implement account lockout or notification
    }
  },
  
  resetFailedLogins(userId) {
    this.failedLogins.delete(userId);
  }
};
```

## Security Testing

### Static Analysis

Use static analysis tools to find security issues:

```bash
# Install security-focused linters
npm install --save-dev eslint-plugin-security

# Configure ESLint for security
# .eslintrc.js
module.exports = {
  plugins: ['security'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-unsafe-regex': 'error'
  }
};
```

### Dynamic Analysis

Test for runtime security vulnerabilities:

```javascript
// tests/security/input-validation.test.js
describe('Input Validation', () => {
  test('should reject malicious input', async () => {
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      "'; DROP TABLE users; --",
      '../../../../etc/passwd'
    ];
    
    for (const input of maliciousInputs) {
      expect(() => validateInput(input)).toThrow();
    }
  });
  
  test('should accept valid input', async () => {
    const validInputs = ['John Doe', 'Test123', 'user@example.com'];
    
    for (const input of validInputs) {
      expect(() => validateInput(input)).not.toThrow();
    }
  });
});
```

### Penetration Testing

Regular penetration testing:

```javascript
// tests/security/penetration.test.js
describe('Penetration Testing', () => {
  test('should resist common attack vectors', async () => {
    // Test for SQL injection
    await expect(apiCall("'; DROP TABLE users; --")).rejects.toThrow();
    
    // Test for XSS
    await expect(apiCall('<script>alert("xss")</script>')).resolves.not.toContain('<script>');
    
    // Test for directory traversal
    await expect(apiCall('../../etc/passwd')).rejects.toThrow();
  });
});
```

## Incident Response

### Incident Detection

Implement mechanisms to detect security incidents:

```javascript
// Good: Incident detection
const incidentDetector = {
  suspiciousActivities: [],
  
  logSuspiciousActivity(activity) {
    this.suspiciousActivities.push({
      ...activity,
      timestamp: new Date().toISOString()
    });
    
    // Alert if threshold exceeded
    if (this.suspiciousActivities.length > 10) {
      this.alertSecurityTeam();
    }
  },
  
  alertSecurityTeam() {
    logger.error('Potential security incident detected');
    // Send alert to security team
  }
};
```

### Response Procedures

Establish clear incident response procedures:

```javascript
// Good: Incident response
async function handleSecurityIncident(incident) {
  // 1. Contain the incident
  await containIncident(incident);
  
  // 2. Investigate
  const investigation = await investigateIncident(incident);
  
  // 3. Eradicate
  await eradicateThreat(investigation);
  
  // 4. Recover
  await recoverFromIncident(incident);
  
  // 5. Report
  await reportIncident(incident, investigation);
}
```

## Compliance

### Data Privacy

Ensure compliance with data privacy regulations:

```javascript
// Good: Data privacy compliance
async function handleUserDataRequest(userId, requestType) {
  switch (requestType) {
    case 'access':
      return await getUserData(userId);
    case 'delete':
      return await deleteUserData(userId);
    case 'portability':
      return await exportUserData(userId);
    default:
      throw new Error('Invalid request type');
  }
}

// Implement data retention policies
async function cleanupOldData() {
  const cutoffDate = new Date(Date.now() - (365 * 24 * 60 * 60 * 1000)); // 1 year
  await deleteDataOlderThan(cutoffDate);
}
```

### Audit Trails

Maintain audit trails for compliance:

```javascript
// Good: Audit trails
async function logAuditEvent(event, userId, details) {
  const auditLog = {
    timestamp: new Date().toISOString(),
    event,
    userId,
    details: {
      ...details,
      // Remove sensitive information
      ip: undefined,
      userAgent: undefined
    }
  };
  
  await core.api.setData('audit-logs', `event-${Date.now()}`, auditLog);
}
```

By following this comprehensive security guide, you can develop plugins that are secure, reliable, and compliant with industry standards. Remember that security is an ongoing process that requires constant vigilance, regular updates, and continuous improvement. Always stay informed about the latest security threats and best practices to keep your plugins and users safe.