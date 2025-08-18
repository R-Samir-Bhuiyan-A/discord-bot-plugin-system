// tests/sandbox.test.js
const PluginSandbox = require('../core/sandbox');

describe('PluginSandbox', () => {
  let sandbox;
  let mockCore;

  beforeEach(() => {
    mockCore = {
      api: {
        registerCommand: jest.fn(),
        registerEvent: jest.fn(),
        registerRoute: jest.fn(),
        registerPage: jest.fn(),
        getLogger: jest.fn(),
        enablePlugin: jest.fn(),
        disablePlugin: jest.fn(),
        getPlugins: jest.fn(),
      }
    };
    sandbox = new PluginSandbox(mockCore);
  });

  test('should create sandboxed core API', () => {
    const sandboxedCore = sandbox.createSandboxedCoreAPI();
    
    // Check that the API methods exist (we can't use toBeInstanceOf with bound functions)
    expect(typeof sandboxedCore.api.registerCommand).toBe('function');
    expect(typeof sandboxedCore.api.registerEvent).toBe('function');
    expect(typeof sandboxedCore.api.registerRoute).toBe('function');
    expect(typeof sandboxedCore.api.registerPage).toBe('function');
    expect(typeof sandboxedCore.api.getLogger).toBe('function');
    expect(typeof sandboxedCore.api.enablePlugin).toBe('function');
    expect(typeof sandboxedCore.api.disablePlugin).toBe('function');
    expect(typeof sandboxedCore.api.getPlugins).toBe('function');
  });

  test('should run plugin method in sandbox', async () => {
    const pluginModule = {
      init: jest.fn().mockResolvedValue('initialized'),
      destroy: jest.fn().mockResolvedValue('destroyed')
    };

    // Test the init method
    const initResult = await sandbox.runPluginMethod('test-plugin', pluginModule, 'init', mockCore);
    expect(initResult).toBe('initialized');
    
    // Test the destroy method
    const destroyResult = await sandbox.runPluginMethod('test-plugin', pluginModule, 'destroy');
    expect(destroyResult).toBe('destroyed');
  });

  test('should handle errors in plugin methods', async () => {
    const pluginModule = {
      init: jest.fn().mockRejectedValue(new Error('Plugin initialization failed'))
    };

    await expect(sandbox.runPluginMethod('test-plugin', pluginModule, 'init', mockCore))
      .rejects.toThrow('Plugin initialization failed');
  });

  test('should handle missing plugin methods', async () => {
    const pluginModule = {};

    await expect(sandbox.runPluginMethod('test-plugin', pluginModule, 'init', mockCore))
      .rejects.toThrow('Method init not found in plugin');
  });
});