// index.js
const CoreSystem = require('./core');

async function main() {
  const core = new CoreSystem();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    await core.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    await core.stop();
    process.exit(0);
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await core.stop();
    process.exit(1);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await core.stop();
    process.exit(1);
  });
  
  // Start the core system
  await core.start();
}

// Run the application
main().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});