// tests/repo.test.js
const PluginRepository = require('../core/repo');

describe('PluginRepository', () => {
  let repo;
  let mockCore;

  beforeEach(() => {
    mockCore = {
      plugins: {
        pluginPath: '/tmp/plugins'
      }
    };
    repo = new PluginRepository(mockCore);
  });

  test('should create repository manager', () => {
    expect(repo).toBeInstanceOf(PluginRepository);
    expect(repo.repoUrl).toBe('https://raw.githubusercontent.com/R-Samir-Bhuiyan-A/discord-bot-plugin-repo/main');
    expect(repo.cache).toBeInstanceOf(Map);
  });

  test('should set repository URL', () => {
    const newUrl = 'https://example.com/plugins';
    repo.setRepoUrl(newUrl);
    expect(repo.repoUrl).toBe(newUrl);
    expect(repo.cache.size).toBe(0); // Cache should be cleared
  });

  test('should have repository API methods', () => {
    expect(repo.getAvailablePlugins).toBeInstanceOf(Function);
    expect(repo.getPluginInfo).toBeInstanceOf(Function);
    expect(repo.installPlugin).toBeInstanceOf(Function);
    expect(repo.fetchJson).toBeInstanceOf(Function);
    expect(repo.fetchText).toBeInstanceOf(Function);
  });
});