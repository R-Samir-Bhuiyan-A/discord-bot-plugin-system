// core/web/app/pages/test.js
import React from 'react';

export default function Test() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Tailwind CSS Test</h1>
        <p className="text-gray-700 text-center mb-6">
          If you can see styled elements below, Tailwind CSS is working correctly.
        </p>
        
        <div className="space-y-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            This is a red alert box
          </div>
          
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            This is a green alert box
          </div>
          
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            This is a blue alert box
          </div>
          
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            This is a button
          </button>
        </div>
      </div>
    </div>
  );
}