// core/web/app/components/Layout.js
import Link from 'next/link';
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-content">
            <div className="flex items-center">
              <Link href="/" className="navbar-brand">
                Discord Bot Plugin System
              </Link>
            </div>
            <div className="navbar-nav">
              <Link href="/" className="nav-link">
                Dashboard
              </Link>
              <Link href="/plugins" className="nav-link">
                Plugins
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container main-content">
        {children}
      </main>
      
      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-500 text-sm">
            Discord Bot Plugin System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}