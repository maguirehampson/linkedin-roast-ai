"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Target, Share2, Mail, RefreshCw } from "lucide-react";

import RoastForm from "./roast/RoastForm";
import LoadingState from "./roast/LoadingState";
import RoastResults from "./roast/RoastResults";
// import EmailCapture from "./roast/EmailCapture";
// import ShareModal from "./roast/ShareModal";

// Proper TypeScript interfaces
interface RoastResult {
  id: string;
  goals_text: string;
  profile_pdf_url: string;
  context_file_url?: string;
  roast_text: string;
  savage_score: string; // e.g., "65/100"
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

interface EmailLead {
  id: string;
  email: string;
  roast_result_id?: string;
  wants_upgrade: boolean;
}

interface RoastFormData {
  profilePdf: File;
  goals: string;
  contextFile?: File;
}

// File upload function with proper error handling
const UploadFile = async ({ file }: { file: File }): Promise<{ file_url: string }> => {
  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload PDF or Word documents only.');
  }

  // Upload file to server
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload file');
  }

  const result = await response.json();
  return { file_url: result.file_url };
};

// PDF text extraction function
const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // First upload the file
    const { file_url } = await UploadFile({ file });
    
    // Then extract text from the uploaded file
    const response = await fetch('/api/extract-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileUrl: file_url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to extract text from PDF');
    }

    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to extract text from PDF');
  }
};

// AI roast generation function
const InvokeLLM = async ({ goals, profileText, contextText }: { goals: string; profileText: string; contextText?: string }) => {
  const response = await fetch('/api/roast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      goals,
      profileText,
      contextText,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate roast');
  }

  return await response.json();
};

// Database operations (now using real API)
const RoastResult = {
  create: async (data: Omit<RoastResult, 'id'> & { id?: string }): Promise<RoastResult> => {
    // The roast is already created in the API, just return the data
    return {
      id: data.id || Math.random().toString(36).substr(2, 9),
      ...data
    };
  }
};

const EmailLead = {
  create: async (data: Omit<EmailLead, 'id'>): Promise<EmailLead> => {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to save email');
    }

    const result = await response.json();
    return {
      id: result.id,
      ...data
    };
  }
};

export default function RoastPage() {
  const [currentStep, setCurrentStep] = useState<"input" | "loading" | "results">("input");
  const [roastData, setRoastData] = useState<RoastResult | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));

  const handleRoastSubmit = async (formData: RoastFormData) => {
    setCurrentStep("loading");
    setError(null);
    
    try {
      const { profilePdf, goals, contextFile } = formData;
      const fileUrls = [];
      let profilePdfUrl = '';
      let contextFileUrl: string | null = null;

      // Upload profile PDF
      const { file_url: pdfUrl } = await UploadFile({ file: profilePdf });
      profilePdfUrl = pdfUrl;
      fileUrls.push(profilePdfUrl);

      // Upload context file if it exists
      if (contextFile) {
        const { file_url: contextUrl } = await UploadFile({ file: contextFile });
        contextFileUrl = contextUrl;
        fileUrls.push(contextUrl);
      }

      // Extract text from PDF
      const profileText = await extractTextFromPDF(profilePdf);
      
      const contextText = contextFile ? await extractTextFromPDF(contextFile) : undefined;

      const response = await InvokeLLM({
        goals,
        profileText,
        contextText,
      });

      const result = await RoastResult.create({
        goals_text: goals,
        profile_pdf_url: profilePdfUrl,
        context_file_url: contextFileUrl || undefined,
        roast_text: response.roast,
        savage_score: response.savage_score,
        brutal_feedback: response.brutal_feedback,
        constructive_path_forward: response.constructive_path_forward,
        hashtags_to_avoid: response.hashtags_to_avoid,
        top_skills_to_highlight: response.top_skills_to_highlight,
        vibe_tags: response.vibe_tags,
        share_quote: response.share_quote,
        meme_caption: response.meme_caption,
        diagnostics: response.diagnostics,
        session_id: sessionId
      });

      setRoastData(result);
      setCurrentStep("results");
    } catch (error) {
      console.error('Error generating roast:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate roast');
      setCurrentStep("input");
    }
  };

  const handleTryAgain = () => {
    setCurrentStep("input");
    setRoastData(null);
    setError(null);
  };

  const handleEmailCapture = async (email: string, wantsUpgrade: boolean = false) => {
    try {
      await EmailLead.create({
        email,
        roast_result_id: roastData?.id,
        wants_upgrade: wantsUpgrade
      });
      setShowEmailCapture(false);
      // You could show a success message here
    } catch (error) {
      console.error('Error saving email:', error);
      // Handle error appropriately
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RoastForm onSubmit={handleRoastSubmit} />
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg"
                >
                  <p className="text-red-200">{error}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {currentStep === "results" && roastData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RoastResults 
                roastData={roastData}
                onTryAgain={handleTryAgain}
                onEmailCapture={() => setShowEmailCapture(true)}
                onShare={handleShare}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Temporarily commented out to debug
        {showEmailCapture && (
          <EmailCapture
            isOpen={showEmailCapture}
            onClose={() => setShowEmailCapture(false)}
            onSubmit={handleEmailCapture}
          />
        )}

        {showShareModal && roastData && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            roastData={roastData}
          />
        )}
        */}
      </div>
    </div>
  );
} 