// core/web/app/pages/index.js
import React, { useEffect } from 'react';

export default function Home() {
  // Redirect to dashboard
  useEffect(() => {
    window.location.href = '/dashboard';
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}