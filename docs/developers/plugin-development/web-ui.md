# Web UI Integration

The Discord Bot Plugin System provides a comprehensive web interface for managing plugins and interacting with the bot. Plugins can extend this interface by adding custom routes and pages.

## Overview

Plugins can register both API routes for backend functionality and web pages for user interfaces. The web UI is built with Next.js and React, providing a modern, responsive interface.

## Registering Web Routes

Plugins can register API routes using the `core.api.registerRoute()` method.

### Method Signature

```javascript
core.api.registerRoute(path, handler)
```

### Parameters

- **path** (string): The route path (e.g., '/api/my-plugin/data')
- **handler** (function): An async function that handles the request

### Route Handler Function

The handler function receives Express-style `req` and `res` objects:

```javascript
async function handler(req, res) {
  // Handle the request and send a response
  res.json({ message: 'Hello from my plugin!' });
}
```

### Basic Route Example

```javascript
// In your plugin's init function
async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  // Register a simple API route
  core.api.registerRoute('/api/my-plugin/status', async (req, res) => {
    res.json({ status: 'ok', plugin: 'my-plugin' });
  });
  
  logger.info('Registered web routes');
}
```

### Route with Parameters

Routes can include parameters:

```javascript
async function init(core) {
  // Route with URL parameters
  core.api.registerRoute('/api/my-plugin/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const userData = await getUserData(userId);
    res.json(userData);
  });
  
  // Route with query parameters
  core.api.registerRoute('/api/my-plugin/search', async (req, res) => {
    const { q, limit = 10 } = req.query;
    const results = await searchData(q, parseInt(limit));
    res.json(results);
  });
}
```

### Route with Request Body

Routes can handle POST requests with request bodies:

```javascript
async function init(core) {
  // Route that accepts POST data
  core.api.registerRoute('/api/my-plugin/create', async (req, res) => {
    const { name, description } = req.body;
    
    // Validate input
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    
    try {
      const newItem = await createItem({ name, description });
      res.status(201).json(newItem);
    } catch (error) {
      const logger = core.api.getLogger('my-plugin');
      logger.error('Failed to create item:', error);
      res.status(500).json({ error: 'Failed to create item' });
    }
  });
}
```

## Registering Web Pages

Plugins can register web pages using the `core.api.registerPage()` method.

### Method Signature

```javascript
core.api.registerPage(path, component)
```

### Parameters

- **path** (string): The page path (e.g., '/my-plugin/dashboard')
- **component** (React component): A React component that renders the page

### Basic Page Example

```javascript
// web/pages/MyPluginPage.js
import React from 'react';

export default function MyPluginPage() {
  return (
    <div className="container">
      <h1>My Plugin Dashboard</h1>
      <p>Welcome to the My Plugin dashboard!</p>
    </div>
  );
}

// In your plugin's index.js
const MyPluginPage = require('./web/pages/MyPluginPage');

async function init(core) {
  const logger = core.api.getLogger('my-plugin');
  
  // Register a web page
  core.api.registerPage('/my-plugin', MyPluginPage);
  
  logger.info('Registered web pages');
}
```

### Page with State Management

Pages can use React state and effects:

```javascript
// web/pages/PluginDashboard.js
import React, { useState, useEffect } from 'react';

export default function PluginDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/my-plugin/data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Plugin Dashboard</h1>
      <div className="data-list">
        {data.map(item => (
          <div key={item.id} className="data-item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Page with Forms

Pages can include forms for user input:

```javascript
// web/pages/ConfigurationPage.js
import React, { useState, useEffect } from 'react';

export default function ConfigurationPage() {
  const [config, setConfig] = useState({
    apiKey: '',
    enableNotifications: false,
    theme: 'dark'
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load current configuration
    fetch('/api/my-plugin/config')
      .then(response => response.json())
      .then(data => setConfig(data))
      .catch(error => console.error('Error loading config:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    
    try {
      const response = await fetch('/api/my-plugin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h1>Plugin Configuration</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="apiKey">API Key</label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            value={config.apiKey}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="enableNotifications"
              checked={config.enableNotifications}
              onChange={handleChange}
            />
            Enable Notifications
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            name="theme"
            value={config.theme}
            onChange={handleChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
        
        {saved && <div className="success-message">Configuration saved!</div>}
      </form>
    </div>
  );
}
```

## Web UI Components

The system provides several reusable components for building consistent interfaces:

### 1. Layout Component

All pages should use the Layout component:

```javascript
import React from 'react';
import Layout from '../../components/Layout';

export default function MyPage() {
  return (
    <Layout>
      <div className="container">
        <h1>My Plugin Page</h1>
        <p>Content goes here</p>
      </div>
    </Layout>
  );
}
```

### 2. Button Component

Use the Button component for consistent styling:

```javascript
import React from 'react';
import Button from '../../components/Button';

export default function MyPage() {
  const handleClick = () => {
    console.log('Button clicked');
  };

  return (
    <Layout>
      <div className="container">
        <h1>My Plugin Page</h1>
        <Button variant="primary" onClick={handleClick}>
          Primary Button
        </Button>
        <Button variant="secondary" onClick={handleClick}>
          Secondary Button
        </Button>
        <Button variant="success" onClick={handleClick}>
          Success Button
        </Button>
      </div>
    </Layout>
  );
}
```

### 3. Card Component

Use Card components for content sections:

```javascript
import React from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="container">
        <h1>Dashboard</h1>
        <div className="grid">
          <Card>
            <h2>Statistics</h2>
            <p>Some statistics here</p>
          </Card>
          <Card>
            <h2>Recent Activity</h2>
            <p>Recent activity here</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
```

## Styling Guidelines

The web UI uses CSS custom properties for consistent styling:

### Color Palette

Use the predefined color variables:

```css
:root {
  /* Primary colors */
  --primary-500: #6366f1;
  --primary-600: #4f46e5;
  
  /* Status colors */
  --success-500: #10b981;
  --warning-500: #f59e0b;
  --error-500: #ef4444;
  --info-500: #3b82f6;
  
  /* Dark theme colors */
  --dark-100: #f1f5f9;
  --dark-400: #94a3b8;
  --dark-800: #1e293b;
  --dark-900: #0f172a;
}
```

### Spacing System

Use the spacing scale for consistent spacing:

```css
:root {
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
}
```

### Example CSS Usage

```css
.my-component {
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  background-color: var(--dark-800);
  border: 1px solid var(--dark-700);
  border-radius: var(--radius-md);
}
```

## Best Practices

### 1. API Design

- Use RESTful conventions for API routes
- Return appropriate HTTP status codes
- Include error messages in JSON responses
- Validate all input data
- Implement proper error handling

```javascript
core.api.registerRoute('/api/my-plugin/items', async (req, res) => {
  try {
    // Handle GET request
    if (req.method === 'GET') {
      const items = await getAllItems();
      res.status(200).json(items);
      return;
    }
    
    // Handle POST request
    if (req.method === 'POST') {
      const { name, description } = req.body;
      
      // Validate input
      if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }
      
      const newItem = await createItem({ name, description });
      res.status(201).json(newItem);
      return;
    }
    
    // Method not allowed
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    const logger = core.api.getLogger('my-plugin');
    logger.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### 2. Frontend Performance

- Lazy load components when possible
- Optimize images and assets
- Use React.memo for performance optimization
- Implement proper loading states
- Handle errors gracefully

```javascript
import React, { useState, useEffect, useMemo } from 'react';

export default function OptimizedPage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  
  // Memoize filtered data to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);
  
  // Use effect for data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/my-plugin/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="container">
      <input 
        type="text" 
        placeholder="Filter items..." 
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="item-list">
        {filteredData.map(item => (
          <div key={item.id} className="item">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Security

- Validate and sanitize all user inputs
- Implement CSRF protection for forms
- Use HTTPS in production
- Protect sensitive API endpoints
- Implement rate limiting for public endpoints

```javascript
// Example of input validation
core.api.registerRoute('/api/my-plugin/submit', async (req, res) => {
  const { email, message } = req.body;
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(400).json({ error: 'Valid email is required' });
    return;
  }
  
  // Validate message length
  if (!message || message.length > 1000) {
    res.status(400).json({ error: 'Message must be between 1 and 1000 characters' });
    return;
  }
  
  // Process valid input
  try {
    await processSubmission({ email, message });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process submission' });
  }
});
```

### 4. Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure proper color contrast
- Implement keyboard navigation
- Use ARIA attributes when needed

```javascript
export default function AccessibleForm() {
  return (
    <form aria-labelledby="form-title">
      <h2 id="form-title">Contact Form</h2>
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          aria-describedby="email-help"
        />
        <div id="email-help" className="help-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

By following these guidelines and using the provided components, your plugin's web interface will integrate seamlessly with the Discord Bot Plugin System and provide a consistent, user-friendly experience.