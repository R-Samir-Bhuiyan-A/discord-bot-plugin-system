// tests/core.test.js
const CoreSystem = require('../core');

// Mock process.exit to prevent tests from exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

describe('CoreSystem', () => {
  let core;

  beforeEach(() => {
    core = new CoreSystem();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create core system instance', () => {
    expect(core).toBeInstanceOf(CoreSystem);
    expect(core.discord).toBeDefined();
    expect(core.web).toBeDefined();
    expect(core.plugins).toBeDefined();
    expect(core.api).toBeDefined();
  });

  test('should have API methods', () => {
    expect(core.api.registerCommand).toBeInstanceOf(Function);
    expect(core.api.registerEvent).toBeInstanceOf(Function);
    expect(core.api.registerRoute).toBeInstanceOf(Function);
    expect(core.api.registerPage).toBeInstanceOf(Function);
    expect(core.api.getLogger).toBeInstanceOf(Function);
  });
});