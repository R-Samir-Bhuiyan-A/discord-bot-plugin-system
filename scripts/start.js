// scripts/start.js
const { spawn } = require('child_process');

function startApp() {
  const child = spawn('node', ['index.js'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  });

  child.on('exit', (code, signal) => {
    console.log(`Child process exited with code ${code} and signal ${signal}`);
    
    // If the process exited with an error code or was terminated by a signal,
    // restart it after a short delay
    if (code !== 0 || signal) {
      console.log('Restarting application in 5 seconds...');
      setTimeout(startApp, 5000);
    }
  });

  child.on('error', (error) => {
    console.error('Failed to start child process:', error);
  });
}

// Start the application
startApp();