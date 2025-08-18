// tests/api.test.js
const API = require('../core/api');

describe('API', () => {
  let api;
  let mockCore;

  beforeEach(() => {
    mockCore = {};
    api = new API(mockCore);
  });

  test('should register a command', () => {
    const handler = jest.fn();
    api.registerCommand('test', 'A test command', handler);

    expect(api.commands.has('test')).toBe(true);
    expect(api.commands.get('test')).toEqual({
      description: 'A test command',
      handler
    });
  });

  test('should register an event', () => {
    const handler = jest.fn();
    api.registerEvent('messageCreate', handler);

    expect(api.events.has('messageCreate')).toBe(true);
    expect(api.events.get('messageCreate')).toContain(handler);
  });

  test('should register a route', () => {
    const handler = jest.fn();
    api.registerRoute('/test', handler);

    expect(api.routes.has('/test')).toBe(true);
    expect(api.routes.get('/test')).toBe(handler);
  });

  test('should register a page', () => {
    const component = {};
    api.registerPage('/test', component);

    expect(api.pages.has('/test')).toBe(true);
    expect(api.pages.get('/test')).toBe(component);
  });

  test('should get a logger', () => {
    const logger = api.getLogger('test-plugin');
    
    expect(logger.info).toBeInstanceOf(Function);
    expect(logger.warn).toBeInstanceOf(Function);
    expect(logger.error).toBeInstanceOf(Function);
    expect(logger.debug).toBeInstanceOf(Function);
  });
});