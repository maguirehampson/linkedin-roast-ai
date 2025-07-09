"use client"

import React, { useState, useEffect } from "react";

export default function RoastPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Test Supabase connection
    const testConnection = async () => {
      try {
        const response = await fetch('/api/roast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            goals: "test",
            profileText: "test profile",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'API connection failed');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Connection test failed:', error);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Connection failed');
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Testing connection...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Connection Error</h1>
          <p className="text-gray-300 mb-4">{errorMessage}</p>
          <p className="text-sm text-gray-500">
            This might be due to Supabase usage limits. Please check your Supabase dashboard.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">LinkedIn Roast AI</h1>
        <p className="text-green-400 mb-2">✅ Connection successful!</p>
        <p className="text-gray-400">Debug: Basic component rendering</p>
        <p className="text-sm text-gray-500 mt-2">If you see this, the component is working</p>
      </div>
    </div>
  );
} 