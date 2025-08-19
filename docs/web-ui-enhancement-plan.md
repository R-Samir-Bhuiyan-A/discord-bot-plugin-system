# Web UI Enhancement Plan

This document outlines the plan for enhancing the Web UI of the Discord Bot Plugin System with a dark theme, animations, and responsive design.

## Overview

The goal of this enhancement is to create a modern, visually appealing, and fully responsive Web UI that serves as the foundation for all plugins and future updates. The UI will feature a dark theme as default, subtle animations, and a modular component architecture.

## Design Principles

1. **Dark Theme**: Implement a dark theme as the default with high contrast elements for readability
2. **Animations**: Add subtle animations for buttons, menus, notifications, and transitions
3. **Responsive Design**: Ensure the UI works well on desktop, tablet, and mobile devices
4. **Modularity**: Create reusable components that can be easily integrated into plugins
5. **Accessibility**: Maintain proper contrast, keyboard navigation, and screen reader compatibility
6. **Consistency**: Use a unified design language throughout the application

## Implementation Steps

### 1. Dark Theme Implementation

#### Color Palette
- Primary: #4f46e5 (Indigo)
- Secondary: #f9fafb (Light Gray)
- Background: #111827 (Dark Gray)
- Surface: #1f2937 (Slate Gray)
- Text: #f9fafb (Light Gray)
- Success: #10b981 (Green)
- Warning: #f59e0b (Amber)
- Error: #ef4444 (Red)

#### CSS Custom Properties
```css
:root {
  /* Dark theme colors */
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-secondary: #f9fafb;
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-border: #374151;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}
```

#### Base Styles
Update the base styles in `core/web/app/styles/globals.css` to use the dark theme colors:

```css
/* core/web/app/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS custom properties for dark theme */
:root {
  /* Dark theme colors */
  --color-primary: #4f46e5;
  --color-primary-hover: #4338ca;
  --color-secondary: #f9fafb;
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-border: #374151;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

/* Base styles */
html, body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text);
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

/* Update existing component classes to use dark theme colors */
.btn {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn-secondary {
  @apply btn;
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn-secondary:hover {
  background-color: #374151;
  border-color: #4b5563;
}

.btn-success {
  @apply btn;
  background-color: var(--color-success);
  border-color: var(--color-success);
}

.btn-success:hover {
  background-color: #059669;
  border-color: #059669;
}

.btn-warning {
  @apply btn;
  background-color: var(--color-warning);
  border-color: var(--color-warning);
}

.btn-warning:hover {
  background-color: #d97706;
  border-color: #d97706;
}

.btn-danger {
  @apply btn;
  background-color: var(--color-error);
  border-color: var(--color-error);
}

.btn-danger:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}

.card {
  @apply rounded-lg shadow-md overflow-hidden transition-shadow duration-300;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success {
  @apply badge;
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.badge-warning {
  @apply badge;
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.badge-error {
  @apply badge;
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.badge-info {
  @apply badge;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--color-primary);
}

.input, .textarea {
  @apply block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm;
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

.input:focus, .textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.form-label {
  @apply block text-sm font-medium mb-1;
  color: var(--color-text);
}

.alert {
  @apply p-4 rounded-md;
}

.alert-success {
  @apply alert;
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
  border-color: rgba(16, 185, 129, 0.2);
}

.alert-warning {
  @apply alert;
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
  border-color: rgba(245, 158, 11, 0.2);
}

.alert-error {
  @apply alert;
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
  border-color: rgba(239, 68, 68, 0.2);
}

.alert-info {
  @apply alert;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--color-primary);
  border-color: rgba(79, 70, 229, 0.2);
}

.navbar {
  @apply shadow-sm;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.navbar-brand {
  @apply flex items-center text-xl font-bold hover:text-gray-300 transition-colors;
  color: var(--color-text);
}

.nav-link {
  @apply text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors;
}

.nav-link-active {
  @apply text-white bg-gray-900;
}

/* Add dark theme styles for other components as needed */
```

### 2. Animations and Transitions

#### CSS Animations
Add CSS animations for various UI elements:

```css
/* Add to globals.css */

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

/* Slide in from right animation */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in-right {
  animation: slideInRight 0.3s ease-in-out;
}

/* Pulse animation for loading states */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Spin animation for loading indicators */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Button hover animation */
.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Card hover animation */
.card {
  transition: all 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
}

/* Navigation link animation */
.nav-link {
  position: relative;
  transition: color 0.2s ease-in-out;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: var(--color-primary);
  transition: width 0.2s ease-in-out;
}

.nav-link:hover::after {
  width: 100%;
}

/* Modal fade animation */
.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  animation: slideInRight 0.3s ease-out;
}
```

#### JavaScript Animations
For more complex animations, we can use JavaScript libraries like Framer Motion or implement custom solutions.

### 3. Responsive Design

#### Mobile-First Approach
Update the Tailwind configuration to support mobile-first design:

```javascript
// core/web/app/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./core/web/app/pages/**/*.{js,ts,jsx,tsx}",
    "./core/web/app/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'md': 'var(--font-size-md)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}
```

#### Responsive Layouts
Update the Layout component to be responsive:

```javascript
// core/web/app/components/Layout.js
import Link from 'next/link';
import React, { useState } from 'react';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-text bg-surface rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="flex items-center">
              <Link href="/dashboard" className="navbar-brand">
                Discord Bot Plugin System
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="navbar-nav hidden md:flex space-x-4">
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link href="/plugins" className="nav-link">
                Plugins
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background z-40 pt-16">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/dashboard" className="nav-link block px-3 py-2 rounded-md">
              Dashboard
            </Link>
            <Link href="/plugins" className="nav-link block px-3 py-2 rounded-md">
              Plugins
            </Link>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-8">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-text-secondary text-sm">
            Discord Bot Plugin System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
```

### 4. Modular Components

#### Component Structure
Create a components directory with reusable UI components:

```
core/web/app/components/
├── Layout.js
├── Button.js
├── Card.js
├── Badge.js
├── Input.js
├── Textarea.js
├── Alert.js
├── Modal.js
├── LoadingSpinner.js
├── PluginItem.js
├── DashboardCard.js
└── ...
```

#### Example Component
Create a reusable Button component:

```javascript
// core/web/app/components/Button.js
import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false, 
  onClick, 
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover text-white focus:ring-primary border border-transparent',
    secondary: 'bg-surface hover:bg-gray-700 text-text focus:ring-primary border border-border',
    success: 'bg-success hover:bg-green-700 text-white focus:ring-green-500 border border-transparent',
    warning: 'bg-warning hover:bg-amber-700 text-white focus:ring-amber-500 border border-transparent',
    danger: 'bg-error hover:bg-red-700 text-white focus:ring-red-500 border border-transparent',
  };
  
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const loadingClasses = 'opacity-75 cursor-not-allowed';
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && disabledClasses,
    isLoading && loadingClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
```

### 5. Enhanced Dashboard

Update the dashboard with dark theme, animations, and responsive design:

```javascript
// core/web/app/pages/dashboard.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [botStatus, setBotStatus] = useState({
    status: 'loading',
    username: null,
    guildCount: 0,
    userCount: 0,
    uptime: 0
  });
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bot status
  useEffect(() => {
    const fetchBotStatus = async () => {
      try {
        const response = await fetch('/api/bot/status');
        const data = await response.json();
        setBotStatus(data);
      } catch (err) {
        setError('Failed to fetch bot status');
        console.error(err);
      }
    };

    // Fetch plugins
    const fetchPlugins = async () => {
      try {
        const response = await fetch('/api/plugins');
        const data = await response.json();
        setPlugins(data);
      } catch (err) {
        setError('Failed to fetch plugins');
        console.error(err);
      }
    };

    // Initial fetch
    fetchBotStatus();
    fetchPlugins();

    // Set up interval to refresh status every 5 seconds
    const interval = setInterval(() => {
      fetchBotStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Format uptime
  const formatUptime = (ms) => {
    if (!ms) return '0s';
    
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-success';
      case 'connecting':
        return 'bg-warning';
      case 'disconnected':
        return 'bg-error';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="dashboard-header text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2 md:mb-4">
            Discord Bot Dashboard
          </h1>
          <p className="text-text-secondary text-lg">
            Real-time monitoring and management of your Discord bot
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6 fade-in">
            {error}
          </div>
        )}

        {/* Bot Status Card */}
        <div className="card mb-6 fade-in">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Bot Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(botStatus.status)}`}></div>
                  <span className="font-medium text-text">Status</span>
                </div>
                <div className="text-2xl font-bold mt-2 capitalize text-text">{botStatus.status}</div>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <div className="font-medium text-text">Bot Name</div>
                <div className="text-2xl font-bold mt-2 truncate text-text">
                  {botStatus.username || 'Not connected'}
                </div>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <div className="font-medium text-text">Servers</div>
                <div className="text-2xl font-bold mt-2 text-text">{botStatus.guildCount}</div>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <div className="font-medium text-text">Uptime</div>
                <div className="text-2xl font-bold mt-2 text-text">{formatUptime(botStatus.uptime)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Plugin Status */}
        <div className="card mb-6 fade-in">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Plugin Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {plugins.length}
                </div>
                <div className="text-text-secondary">Total Plugins</div>
              </div>
              
              <div className="border border-border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-success">
                  {plugins.filter(p => p.enabled).length}
                </div>
                <div className="text-text-secondary">Enabled Plugins</div>
              </div>
              
              <div className="border border-border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-error">
                  {plugins.filter(p => !p.enabled).length}
                </div>
                <div className="text-text-secondary">Disabled Plugins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="fade-in">
            <h2 className="text-xl font-semibold mb-2 text-text">Plugin Management</h2>
            <p className="text-text-secondary mb-4">
              Enable, disable, and manage your plugins in real-time
            </p>
            <Button variant="primary" href="/plugins">
              Go to Plugin Store
            </Button>
          </Card>

          <Card className="fade-in">
            <h2 className="text-xl font-semibold mb-2 text-text">Activity Logs</h2>
            <p className="text-text-secondary mb-4">
              View detailed logs of bot and plugin activities
            </p>
            <div className="text-text-secondary font-medium">
              Coming soon
            </div>
          </Card>

          <Card className="fade-in">
            <h2 className="text-xl font-semibold mb-2 text-text">Analytics</h2>
            <p className="text-text-secondary mb-4">
              Monitor your bot's performance and usage statistics
            </p>
            <div className="text-text-secondary font-medium">
              Coming soon
            </div>
          </Card>
        </div>

        {/* Recent Plugins */}
        <div className="card fade-in">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-text">Recently Installed Plugins</h2>
            {plugins.length === 0 ? (
              <p className="text-text-secondary">No plugins installed</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plugins.slice(0, 3).map((plugin) => (
                  <div key={plugin.name} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-text">{plugin.manifest.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">{plugin.manifest.description}</p>
                      </div>
                      <span className={plugin.enabled ? 'badge-success' : 'badge-error'}>
                        {plugin.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="text-xs text-text-secondary mt-2">
                      Version {plugin.manifest.version}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

### 6. Enhanced Plugin Store

Update the plugin store with dark theme, animations, and responsive design:

```javascript
// core/web/app/pages/plugins.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

export default function Plugins() {
  const [plugins, setPlugins] = useState([]);
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch installed plugins
  useEffect(() => {
    fetchInstalledPlugins();
  }, []);

  const fetchInstalledPlugins = async () => {
    try {
      const response = await fetch('/api/plugins');
      const data = await response.json();
      setPlugins(data);
    } catch (err) {
      setError('Failed to fetch installed plugins');
      console.error(err);
    }
  };

  // Fetch available plugins from repository
  const fetchAvailablePlugins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/repo/plugins');
      const data = await response.json();
      setAvailablePlugins(data);
    } catch (err) {
      setError('Failed to fetch available plugins');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Enable a plugin
  const enablePlugin = async (pluginName) => {
    try {
      const response = await fetch('/api/plugins/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pluginName }),
      });
      
      if (response.ok) {
        fetchInstalledPlugins(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to enable plugin');
      }
    } catch (err) {
      setError('Failed to enable plugin');
      console.error(err);
    }
  };

  // Disable a plugin
  const disablePlugin = async (pluginName) => {
    try {
      const response = await fetch('/api/plugins/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pluginName }),
      });
      
      if (response.ok) {
        fetchInstalledPlugins(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to disable plugin');
      }
    } catch (err) {
      setError('Failed to disable plugin');
      console.error(err);
    }
  };

  // Delete a plugin
  const deletePlugin = async (pluginName) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete the plugin "${pluginName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      console.log(`Deleting plugin: ${pluginName}`);
      const response = await fetch('/api/plugins/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pluginName }),
      });
      
      const data = await response.json();
      console.log('Delete response:', data);
      
      if (response.ok) {
        console.log(`Plugin ${pluginName} deleted successfully`);
        fetchInstalledPlugins(); // Refresh the list
      } else {
        console.error('Delete error:', data.error);
        setError(data.error || 'Failed to delete plugin');
      }
    } catch (err) {
      console.error('Network error when deleting plugin:', err);
      setError('Failed to delete plugin: Network error');
      console.error(err);
    }
  };

  // Install a plugin from repository
  const installPlugin = async (pluginName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/repo/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pluginName }),
      });
      
      if (response.ok) {
        fetchInstalledPlugins(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to install plugin');
      }
    } catch (err) {
      setError('Failed to install plugin');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-text">Plugin Store</h1>
        
        {error && (
          <Alert variant="error" className="mb-6 fade-in">
            {error}
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Installed Plugins Section */}
          <Card className="fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-text">Installed Plugins</h2>
            </div>
            
            {plugins.length === 0 ? (
              <p className="text-text-secondary">No plugins installed</p>
            ) : (
              <div className="space-y-4">
                {plugins.map((plugin) => (
                  <div key={plugin.name} className="border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-text">{plugin.manifest.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">{plugin.manifest.description}</p>
                        <p className="text-xs text-text-secondary mt-1">Version {plugin.manifest.version}</p>
                      </div>
                      <span className={plugin.enabled ? 'badge-success' : 'badge-error'}>
                        {plugin.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {plugin.enabled ? (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => disablePlugin(plugin.name)}
                        >
                          Disable
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => enablePlugin(plugin.name)}
                        >
                          Enable
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deletePlugin(plugin.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          {/* Available Plugins Section */}
          <Card className="fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-text">Available Plugins</h2>
              <Button
                variant="primary"
                size="sm"
                onClick={fetchAvailablePlugins}
                disabled={loading}
                isLoading={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            
            {availablePlugins.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary mb-4">No available plugins. Click refresh to load.</p>
                <Button
                  variant="primary"
                  onClick={fetchAvailablePlugins}
                  disabled={loading}
                  isLoading={loading}
                >
                  {loading ? 'Loading...' : 'Load Plugins'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {availablePlugins.map((plugin) => (
                  <div key={plugin.name} className="border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-text">{plugin.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">{plugin.description}</p>
                        <p className="text-xs text-text-secondary mt-1">Version {plugin.version} by {plugin.author}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => installPlugin(plugin.name)}
                        disabled={loading}
                        isLoading={loading}
                      >
                        {loading ? 'Installing...' : 'Install'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
```

## Developer-Friendly Considerations

### Component Library
Create a component library with the following components:
1. Button - For all button elements with different variants
2. Card - For content sections
3. Badge - For status indicators
4. Input/Textarea - For form elements
5. Alert - For notifications and error messages
6. Modal - For popups and dialogs
7. LoadingSpinner - For loading states
8. PluginItem - For displaying plugin information
9. DashboardCard - For dashboard statistics

### Style Guide
Create a style guide document that includes:
1. Color palette with CSS variables
2. Typography hierarchy
3. Spacing system
4. Component usage examples
5. Animation guidelines

### CSS Architecture
Use a modular CSS architecture:
1. Base styles (reset, typography)
2. Component styles (buttons, cards, etc.)
3. Layout styles (grid, spacing)
4. Utility classes (margin, padding, display)
5. Theme variables (colors, fonts, spacing)

## Testing
1. Test the UI on different screen sizes (mobile, tablet, desktop)
2. Verify all animations work correctly
3. Ensure proper contrast for accessibility
4. Test keyboard navigation
5. Validate all components work as expected

## Future Enhancements
1. Add more advanced animations with libraries like Framer Motion
2. Implement a theme switcher for light/dark mode
3. Add more reusable components
4. Create a design system documentation site
5. Implement internationalization support
6. Add keyboard shortcuts for common actions
7. Implement drag-and-drop for plugin management
8. Add search and filtering for plugins

This enhancement plan will transform the Web UI into a modern, visually appealing, and fully responsive interface that provides an excellent user experience while maintaining developer-friendly practices.