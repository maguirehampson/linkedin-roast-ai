"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";
import RoastForm from "./roast/RoastForm";
import RoastResults from "./roast/RoastResults";
import LoadingState from "./roast/LoadingState";
import EmailCapture from "./roast/EmailCapture";
import ShareModal from "./roast/ShareModal";

interface RoastResult {
  id: string;
  goals_text: string;
  profile_pdf_url: string;
  context_file_url?: string;
  roast_text: string;
  savage_score: string;
  score_breakdown?: {
    clarity: number;
    specificity: number;
    authenticity: number;
    professionalism: number;
    impact: number;
  };
  brutal_feedback: string;
  constructive_path_forward: string;
  hashtags_to_avoid: string[];
  top_skills_to_highlight: string[];
  session_id: string;
  vibe_tags: string[];
  share_quote: string;
  meme_caption: string;
  diagnostics: { type: string; text: string; comment: string }[];
}

export default function RoastPage() {
  const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  const [currentStep, setCurrentStep] = useState<'form' | 'loading' | 'results'>('form');
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleRoastSubmit = async (data: { profilePdf: File; goals: string; contextFile?: File }) => {
    setCurrentStep('loading');

    try {
      // Step 1: Upload profile PDF
      const profileFormData = new FormData();
      profileFormData.append('file', data.profilePdf);

      const profileUploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: profileFormData,
      });

      if (!profileUploadResponse.ok) {
        throw new Error('Failed to upload profile PDF');
      }

      const profileUploadResult = await profileUploadResponse.json();

      // Step 2: Extract text from profile PDF
      const extractResponse = await fetch('/api/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl: profileUploadResult.file_url }),
      });

      if (!extractResponse.ok) {
        throw new Error('Failed to extract text from profile PDF');
      }

      const extractResult = await extractResponse.json();

      // Step 3: Handle context file if provided
      let contextText = '';
      if (data.contextFile) {
        const contextFormData = new FormData();
        contextFormData.append('file', data.contextFile);

        const contextUploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: contextFormData,
        });

        if (contextUploadResponse.ok) {
          const contextUploadResult = await contextUploadResponse.json();

          const contextExtractResponse = await fetch('/api/extract-text', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileUrl: contextUploadResult.file_url }),
          });

          if (contextExtractResponse.ok) {
            const contextExtractResult = await contextExtractResponse.json();
            contextText = contextExtractResult.text;
          }
        }
      }

      // Step 4: Generate roast
      const roastResponse = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goals: data.goals,
          profileText: extractResult.text,
          contextText: contextText,
        }),
      });

      if (!roastResponse.ok) {
        const errorData = await roastResponse.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to generate roast');
      }

      const roastData = await roastResponse.json();

      // Transform the API response to match our interface
      const transformedResult: RoastResult = {
        id: roastData.id || Math.random().toString(36).substring(2, 11),
        goals_text: data.goals,
        profile_pdf_url: profileUploadResult.file_url,
        context_file_url: data.contextFile ? '' : undefined, // Would be set if context file was uploaded
        roast_text: roastData.roast,
        savage_score: `${roastData.savage_score}/100`,
        score_breakdown: roastData.score_breakdown || undefined,
        brutal_feedback: roastData.brutal_feedback,
        constructive_path_forward: roastData.constructive_path_forward,
        hashtags_to_avoid: roastData.hashtags_to_avoid || [],
        top_skills_to_highlight: roastData.top_skills_to_highlight || [],
        session_id: roastData.id || Math.random().toString(36).substring(2, 11),
        vibe_tags: roastData.vibe_tags || [],
        share_quote: roastData.share_quote || '',
        meme_caption: roastData.meme_caption || '',
        diagnostics: roastData.diagnostics || [],
      };

      setRoastResult(transformedResult);
      setCurrentStep('results');
    } catch (error) {
      console.error('Error generating roast:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error generating roast: ${errorMessage}`);
      setCurrentStep('form');
    }
  };

  const handleTryAgain = () => {
    setCurrentStep('form');
    setRoastResult(null);
  };

  const handleEmailCapture = () => {
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = async (email: string) => {
    if (TEST_MODE) {
      console.log('Email capture in test mode:', email);
      setShowEmailCapture(false);
      return;
    }

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          roast_id: roastResult?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture email');
      }

      setShowEmailCapture(false);
      alert('Thanks! We\'ll send your full makeover soon.');
    } catch (error) {
      console.error('Error capturing email:', error);
      alert('Error saving email. Please try again.');
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Flame className="w-16 h-16 text-red-500" />
            </motion.div>
            <h1 className="text-6xl font-bold text-shadow">
              LinkedIn <span className="text-red-500">Roast</span> AI
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </motion.div>
          </div>

          <p className="text-xl text-gray-300 mb-4">
            Get brutally honest feedback on your LinkedIn profile
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Actionable Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Savage but Helpful</span>
            </div>
          </div>

          {TEST_MODE && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 border border-yellow-600 rounded-xl bg-yellow-900/20 text-center text-yellow-300"
            >
              🧪 Test Mode Active - All features enabled for testing. Database and email features are simulated.
            </motion.div>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'form' && (
            <RoastForm onSubmit={handleRoastSubmit} />
          )}

          {currentStep === 'loading' && (
            <LoadingState />
          )}

          {currentStep === 'results' && roastResult && (
            <RoastResults
              roastData={roastResult}
              onTryAgain={handleTryAgain}
              onEmailCapture={handleEmailCapture}
              onShare={handleShare}
            />
          )}
        </div>

        {/* Modals */}
        <EmailCapture
          isOpen={showEmailCapture}
          onClose={() => setShowEmailCapture(false)}
          onSubmit={handleEmailSubmit}
        />

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          roastData={roastResult}
        />
      </div>
    </div>
  );
}