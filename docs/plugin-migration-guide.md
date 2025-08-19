# Plugin Migration Guide

This guide provides instructions for migrating plugins between different versions of the Discord Bot Plugin System, particularly when breaking changes are introduced.

## Table of Contents

1. [Understanding Breaking Changes](#understanding-breaking-changes)
2. [Migration Process](#migration-process)
3. [Common Migration Scenarios](#common-migration-scenarios)
4. [Version-Specific Migration Guides](#version-specific-migration-guides)
5. [Testing Migrated Plugins](#testing-migrated-plugins)
6. [Rollback Procedures](#rollback-procedures)
7. [Best Practices](#best-practices)

## Understanding Breaking Changes

Breaking changes are modifications to the core system that require plugins to be updated to maintain compatibility. These can include:

### API Changes

- Removal or modification of core API methods
- Changes to method signatures
- Deprecation of features

### Structural Changes

- Changes to plugin manifest format
- Directory structure modifications
- Configuration schema updates

### Behavioral Changes

- Changes to how certain features work
- Updated security requirements
- Performance optimizations that affect plugin behavior

### Dependency Changes

- Updated Node.js version requirements
- New required dependencies
- Removed or replaced optional dependencies

## Migration Process

### Step 1: Assessment

Before starting the migration, assess the impact:

1. **Review Changelog**: Check the core system changelog for breaking changes
2. **Analyze Plugin**: Identify which parts of your plugin are affected
3. **Estimate Effort**: Determine the time and resources needed for migration
4. **Plan Timeline**: Schedule the migration work

### Step 2: Backup

Always create backups before making changes:

```bash
# Backup plugin directory
cp -r my-plugin my-plugin-backup-$(date +%Y%m%d)

# Backup configuration
cp config/my-plugin-config.json config/my-plugin-config-backup-$(date +%Y%m%d).json

# Export plugin data
npm run plugin:export-data my-plugin > my-plugin-data-$(date +%Y%m%d).json
```

### Step 3: Environment Setup

Set up a development environment for migration:

```bash
# Create a new branch for migration work
git checkout -b migrate-to-v2.0

# Install the new core system version
npm install discord-bot-plugin-system@latest

# Set up development environment
npm run dev:setup
```

### Step 4: Update Plugin Manifest

Update the plugin manifest to reflect new requirements:

```json
{
  "name": "my-plugin",
  "version": "2.0.0", // Update version
  "author": "Plugin Author",
  "description": "Updated plugin description",
  "compatibility": {
    "core": ">=2.0.0" // Update compatibility
  },
  "permissions": {
    "discord": ["commands", "events"],
    "web": ["routes", "pages"]
  },
  "dependencies": [], // Update dependencies if needed
  "config": {
    // Update configuration schema if needed
    "newOption": {
      "type": "string",
      "required": false,
      "default": "default-value"
    }
  },
  "entry": "./index.js"
}
```

### Step 5: Code Migration

Update the plugin code to work with the new system:

1. **API Updates**: Replace deprecated API calls with new ones
2. **Structure Changes**: Update directory structure if needed
3. **Configuration**: Update configuration handling
4. **Dependencies**: Update or add dependencies

### Step 6: Testing

Thoroughly test the migrated plugin:

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Test in development environment
npm run dev:test-plugin my-plugin
```

### Step 7: Documentation

Update documentation for the new version:

1. **README.md**: Update installation and usage instructions
2. **Migration Guide**: Document changes made during migration
3. **Changelog**: Record changes in the plugin's changelog

### Step 8: Deployment

Deploy the migrated plugin:

```bash
# Build the plugin
npm run build

# Test in staging environment
npm run test:staging

# Deploy to production
npm run deploy
```

## Common Migration Scenarios

### API Method Changes

When core API methods are changed or removed:

```javascript
// Before (v1.x)
core.api.registerDiscordCommand('my-command', handler);

// After (v2.x)
core.api.registerCommand('my-command', 'Command description', handler);
```

### Configuration Schema Updates

When configuration schemas change:

```javascript
// Before (v1.x)
const config = {
  apiKey: 'my-api-key',
  maxResults: 10
};

// After (v2.x)
const config = {
  api: {
    key: 'my-api-key'
  },
  limits: {
    maxResults: 10
  }
};
```

### Directory Structure Changes

When directory structures are updated:

```
# Before (v1.x)
my-plugin/
├── commands/
├── events/
├── web/
└── utils/

# After (v2.x)
my-plugin/
├── discord/
│   ├── commands/
│   └── events/
├── web/
│   ├── pages/
│   └── routes/
└── utils/
```

### Dependency Updates

When dependencies change:

```json
// Before (v1.x)
{
  "dependencies": {
    "old-library": "^1.0.0"
  }
}

// After (v2.x)
{
  "dependencies": {
    "new-library": "^2.0.0"
  }
}
```

## Version-Specific Migration Guides

### Migrating from v1.x to v2.x

#### Breaking Changes in v2.0

1. **API Restructuring**: Core API methods have been reorganized
2. **Configuration Schema**: Configuration format has changed
3. **Event System**: Event handling has been updated
4. **Web UI Components**: Web UI component structure has changed

#### Migration Steps

1. **Update Plugin Manifest**:
   ```json
   {
     "compatibility": {
       "core": ">=2.0.0"
     }
   }
   ```

2. **Update API Calls**:
   ```javascript
   // Before
   core.api.registerDiscordCommand('command', handler);
   
   // After
   core.api.registerCommand('command', 'Description', handler);
   ```

3. **Update Configuration Handling**:
   ```javascript
   // Before
   const apiKey = await core.api.getConfig('my-plugin', 'apiKey');
   
   // After
   const apiKey = await core.api.getConfig('my-plugin', 'api.key');
   ```

4. **Update Event Registration**:
   ```javascript
   // Before
   core.api.on('message', handler);
   
   // After
   core.api.registerEvent('messageCreate', handler);
   ```

5. **Update Web UI Components**:
   ```javascript
   // Before
   core.api.registerComponent('/dashboard', Dashboard);
   
   // After
   core.api.registerPage('/dashboard', Dashboard);
   ```

#### Example Migration

Here's a complete example of migrating a simple plugin:

```javascript
// Before (v1.x)
// index.js
module.exports = {
  async init(core) {
    core.api.registerDiscordCommand('hello', async (interaction) => {
      const name = interaction.options.getString('name');
      await interaction.reply(`Hello, ${name}!`);
    }, {
      options: [{
        name: 'name',
        description: 'Name to greet',
        type: 'STRING',
        required: true
      }]
    });
  },
  
  async destroy() {
    console.log('Plugin destroyed');
  }
};

// After (v2.x)
// index.js
module.exports = {
  async init(core) {
    core.api.registerCommand('hello', 'Greet a user', async (interaction) => {
      const name = interaction.options.getString('name');
      await interaction.reply(`Hello, ${name}!`);
    }, {
      options: [{
        name: 'name',
        description: 'Name to greet',
        type: 'STRING',
        required: true
      }]
    });
  },
  
  async destroy() {
    console.log('Plugin destroyed');
  }
};
```

### Migrating from v2.x to v3.x

#### Breaking Changes in v3.0

1. **Async/Await Requirements**: All API methods now return promises
2. **Error Handling**: Enhanced error handling with custom error types
3. **Data Storage**: New data storage API with better performance
4. **Security Enhancements**: Stricter security requirements

#### Migration Steps

1. **Update Async/Await Usage**:
   ```javascript
   // Before
   core.api.getData('my-plugin', 'key', (err, data) => {
     if (err) return console.error(err);
     console.log(data);
   });
   
   // After
   try {
     const data = await core.api.getData('my-plugin', 'key');
     console.log(data);
   } catch (error) {
     console.error(error);
   }
   ```

2. **Update Error Handling**:
   ```javascript
   // Before
   try {
     await core.api.someMethod();
   } catch (error) {
     console.error('Operation failed');
   }
   
   // After
   try {
     await core.api.someMethod();
   } catch (error) {
     if (error instanceof core.errors.ValidationError) {
       console.error('Validation failed:', error.message);
     } else {
       console.error('Operation failed:', error.message);
     }
   }
   ```

3. **Update Data Storage**:
   ```javascript
   // Before
   core.api.setData('my-plugin', 'key', 'value');
   
   // After
   await core.api.setData('my-plugin', 'key', 'value');
   ```

## Testing Migrated Plugins

### Unit Testing

Ensure all unit tests pass after migration:

```javascript
// tests/unit/migration.test.js
describe('Migrated Plugin', () => {
  test('should initialize with new API', async () => {
    const mockCore = {
      api: {
        registerCommand: jest.fn(),
        getLogger: () => ({ info: jest.fn() })
      }
    };
    
    await expect(plugin.init(mockCore)).resolves.toBeUndefined();
    expect(mockCore.api.registerCommand).toHaveBeenCalled();
  });
  
  test('should handle configuration correctly', async () => {
    const mockCore = {
      api: {
        getConfig: jest.fn().mockResolvedValue('test-value'),
        getLogger: () => ({ info: jest.fn() })
      }
    };
    
    await plugin.init(mockCore);
    expect(mockCore.api.getConfig).toHaveBeenCalledWith('my-plugin', 'new.config.path');
  });
});
```

### Integration Testing

Test integration with the new core system:

```javascript
// tests/integration/migration.test.js
describe('Integration with v2.0 Core', () => {
  test('should register commands correctly', async () => {
    const registeredCommands = [];
    
    const mockCore = {
      api: {
        registerCommand: (name, description, handler) => {
          registeredCommands.push({ name, description });
        },
        getLogger: () => ({ info: jest.fn() })
      }
    };
    
    await plugin.init(mockCore);
    
    expect(registeredCommands).toContainEqual({
      name: 'hello',
      description: 'Greet a user'
    });
  });
});
```

### Regression Testing

Ensure no functionality was broken during migration:

```javascript
// tests/regression/migration.test.js
describe('Regression Tests', () => {
  test('should maintain backward compatibility where possible', async () => {
    // Test that existing functionality still works
    const result = await plugin.oldFunctionality();
    expect(result).toEqual(expectedResult);
  });
  
  test('should handle edge cases correctly', async () => {
    // Test edge cases that might have been affected by migration
    await expect(plugin.handleEdgeCase()).resolves.not.toThrow();
  });
});
```

## Rollback Procedures

### When to Rollback

Consider rolling back if:

1. Critical bugs are discovered after deployment
2. Performance degrades significantly
3. User complaints increase substantially
4. Security vulnerabilities are found

### Rollback Process

1. **Stop New Deployments**: Prevent further deployments of the migrated version
2. **Restore Backup**: Restore the previous version from backup
3. **Verify Functionality**: Ensure the rollback was successful
4. **Monitor System**: Watch for any issues after rollback
5. **Investigate Issues**: Determine the cause of problems
6. **Plan Fix**: Develop a plan to fix the issues
7. **Re-attempt Migration**: Try the migration again after fixes

### Rollback Script

Create a rollback script for quick recovery:

```bash
#!/bin/bash
# rollback.sh

echo "Rolling back plugin to previous version..."

# Stop plugin service
pm2 stop my-plugin

# Restore from backup
cp -r backups/my-plugin-$(date -d "1 day ago" +%Y%m%d) plugins/my-plugin

# Restart plugin service
pm2 start my-plugin

# Verify rollback
echo "Rollback complete. Please verify functionality."
```

## Best Practices

### Before Migration

1. **Thorough Testing**: Ensure current version is stable
2. **Complete Documentation**: Document current functionality
3. **Backup Strategy**: Create comprehensive backups
4. **Stakeholder Communication**: Inform stakeholders of planned migration

### During Migration

1. **Incremental Changes**: Make small, incremental changes
2. **Frequent Testing**: Test after each significant change
3. **Version Control**: Use version control for all changes
4. **Detailed Logging**: Log all migration activities

### After Migration

1. **Comprehensive Testing**: Test all functionality thoroughly
2. **User Communication**: Inform users of changes
3. **Monitor Performance**: Watch for performance issues
4. **Update Documentation**: Keep documentation current

### Long-term Maintenance

1. **Regular Updates**: Keep plugins updated with core changes
2. **Security Audits**: Regularly audit for security issues
3. **Performance Monitoring**: Monitor plugin performance
4. **User Feedback**: Collect and act on user feedback

By following this migration guide, you can successfully migrate your plugins to new versions of the Discord Bot Plugin System while minimizing disruption and maintaining quality. Remember that migration is an ongoing process, and staying current with core system updates will make future migrations easier.