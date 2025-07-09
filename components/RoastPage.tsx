"use client"

import React, { useState } from "react";

export default function RoastPage() {
  const [goals, setGoals] = useState("");
  const [profileText, setProfileText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goals.trim() || !profileText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goals: goals,
          profileText: profileText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate roast');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating roast. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">LinkedIn Roast AI</h1>
          <p className="text-gray-400">🔥 Test Mode - No Database Storage</p>
        </div>

        {!result ? (
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What are your career goals? *
                </label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g., 'I want to switch from marketing to data science' or 'I want to attract more freelance clients'"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Paste your LinkedIn profile text here * 
                </label>
                <textarea
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  placeholder="Paste your LinkedIn 'About' section, professional summary, or bio here..."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  rows={8}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!goals.trim() || !profileText.trim() || isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
              >
                {isSubmitting ? '🔥 Generating Roast...' : '🔥 Roast Me!'}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Your Roast Results</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">Score:</h3>
                  <p className="text-3xl font-bold">{result.savage_score}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">🔥 Roast:</h3>
                  <p className="text-gray-300 bg-gray-700 p-3 rounded">{result.roast}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-2">💀 Brutal Feedback:</h3>
                  <p className="text-gray-300 bg-gray-700 p-3 rounded">{result.brutal_feedback}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-400 mb-2">💡 Constructive Path:</h3>
                  <p className="text-gray-300 bg-gray-700 p-3 rounded">{result.constructive_path_forward}</p>
                </div>

                {result.vibe_tags && result.vibe_tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">🏷️ Vibe Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.vibe_tags.map((tag: string, idx: number) => (
                        <span key={idx} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.share_quote && (
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-2">📱 Share Quote:</h3>
                    <p className="text-gray-300 bg-gray-700 p-3 rounded italic">"{result.share_quote}"</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-red-400 mb-2">🚫 Hashtags to Avoid:</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags_to_avoid.map((hashtag: string, idx: number) => (
                      <span key={idx} className="bg-red-900 text-red-200 px-2 py-1 rounded text-sm">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-green-400 mb-2">⭐ Skills to Highlight:</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.top_skills_to_highlight.map((skill: string, idx: number) => (
                      <span key={idx} className="bg-green-900 text-green-200 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResult(null);
                  setGoals("");
                  setProfileText("");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                🔄 Try Again
              </button>
              
              <button
                onClick={() => {
                  const textToCopy = `LinkedIn Roast Results:\n\nScore: ${result.savage_score}\n\nRoast: ${result.roast}\n\nBrutal Feedback: ${result.brutal_feedback}\n\nConstructive Path: ${result.constructive_path_forward}`;
                  navigator.clipboard.writeText(textToCopy);
                  alert('Results copied to clipboard!');
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                📋 Copy Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 