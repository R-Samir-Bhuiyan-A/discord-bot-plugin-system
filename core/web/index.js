// core/web/index.js
const path = require('path');
const { createServer } = require('http');
const next = require('next');

class WebServer {
  constructor(core) {
    this.core = core;
    this.app = null;
    this.server = null;
  }

  async init() {
    try {
      // Create Next.js app
      const dev = process.env.NODE_ENV !== 'production';
      const appDir = path.join(__dirname, 'app');
      this.app = next({ dev, dir: appDir });
      const handle = this.app.getRequestHandler();

      // Prepare Next.js app
      await this.app.prepare();

      // Create HTTP server
      this.server = createServer(async (req, res) => {
        // Add body parsing for POST requests
        if (req.method === 'POST' || req.method === 'PUT') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              req.body = JSON.parse(body);
            } catch (error) {
              req.body = {};
            }
            this.handleRequest(req, res, handle);
          });
        } else {
          this.handleRequest(req, res, handle);
        }
      });

      // Start server
      const port = process.env.PORT || 3000;
      this.server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
      });
    } catch (error) {
      console.error('Failed to initialize web server:', error);
      throw error;
    }
  }

  async handleRequest(req, res, nextHandler) {
    try {
      // Handle routes registered by plugins
      const routeHandler = this.core.api.routes.get(req.url);
      if (routeHandler) {
        // Wrap res.json to provide Express-like functionality
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        // Execute the route handler in a try-catch block to prevent crashes
        try {
          await routeHandler(req, res);
        } catch (error) {
          console.error(`Error in route handler for ${req.url}:`, error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.json({ error: 'Internal server error' });
          }
        }
        return;
      }

      // Default to Next.js handler
      return nextHandler(req, res);
    } catch (error) {
      console.error('Error in handleRequest:', error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }
  }

  async destroy() {
    if (this.server) {
      await new Promise(resolve => {
        this.server.close(() => {
          resolve();
        });
      });
    }
  }
}

module.exports = WebServer;