// plugins/error-test-plugin/index.js
module.exports = {
  async init(core) {
    // Register a web route that throws an error
    core.api.registerRoute('/api/error-test', (req, res) => {
      // This will throw an error
      throw new Error('This is a test error from the error-test-plugin');
    });

    console.log('Error test plugin initialized');
  },

  async destroy() {
    console.log('Error test plugin destroyed');
  }
};