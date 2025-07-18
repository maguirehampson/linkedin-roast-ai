"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Flame, Zap, Target, FileText, Goal } from "lucide-react";
import FileUploadZone from "./FileUploadZone";
import { Input } from "@/components/ui/input";

interface RoastFormProps {
  onSubmit: (data: { profilePdf?: File; linkedinUrl?: string; goals: string; contextFile?: File }) => Promise<void>;
}

export default function RoastForm({ onSubmit }: RoastFormProps) {
  const [profilePdf, setProfilePdf] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [goals, setGoals] = useState("");
  const [contextFile, setContextFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState<'pdf' | 'linkedin'>('pdf');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (inputMode === 'pdf' && !profilePdf) ||
      (inputMode === 'linkedin' && !linkedinUrl.trim()) ||
      !goals.trim()
    ) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        profilePdf: inputMode === 'pdf' ? profilePdf ?? undefined : undefined,
        linkedinUrl: inputMode === 'linkedin' ? linkedinUrl : undefined,
        goals,
        contextFile: contextFile ?? undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold">Ready to get roasted?</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Choose Input Mode */}
        <div className="flex gap-4 mb-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-semibold border ${inputMode === 'pdf' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-200'}`}
            onClick={() => setInputMode('pdf')}
            disabled={isSubmitting}
          >
            Upload PDF
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg font-semibold border ${inputMode === 'linkedin' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
            onClick={() => setInputMode('linkedin')}
            disabled={isSubmitting}
          >
            Use LinkedIn URL
          </button>
        </div>
        {/* Step 2: Profile PDF Upload or LinkedIn URL */}
        {inputMode === 'pdf' ? (
          <div className="space-y-2">
            <label className="font-semibold flex items-center gap-2">
              <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
              Upload LinkedIn Profile (PDF)
              <span className="text-red-500">*</span>
            </label>
            <FileUploadZone
              onFileSelect={setProfilePdf}
              acceptedTypes=".pdf"
              label="Upload PDF Profile"
              file={profilePdf}
              maxSize={10 * 1024 * 1024} // 10MB
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="linkedinUrl" className="font-semibold flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
              LinkedIn Profile URL
              <span className="text-blue-600">*</span>
            </label>
            <Input
              id="linkedinUrl"
              type="text"
              placeholder="LinkedIn profile URL or username (e.g. https://www.linkedin.com/in/username/ or just username)"
              value={linkedinUrl}
              onChange={e => setLinkedinUrl(e.target.value)}
              disabled={isSubmitting}
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 rounded-xl"
            />
          </div>
        )}
        {/* Step 3: Goals Textbox */}
        <div className="space-y-2">
          <label htmlFor="goals" className="font-semibold flex items-center gap-2">
            <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
            Describe Your Goals
            <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g., 'I'm trying to switch from marketing to data science,' or 'I want to attract more freelance clients for web design.'"
            className="min-h-24 bg-gray-900 border-gray-600 text-white placeholder-gray-400 rounded-xl resize-none custom-scrollbar"
            disabled={isSubmitting}
          />
        </div>
        {/* Step 4: Optional Context Upload */}
        <div className="space-y-2">
          <label className="font-semibold flex items-center gap-2">
            <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">3</span>
            Upload Resume/CV (Optional)
          </label>
          <FileUploadZone
            onFileSelect={setContextFile}
            acceptedTypes=".pdf,.doc,.docx"
            label="Upload Resume/Portfolio"
            file={contextFile}
            maxSize={10 * 1024 * 1024} // 10MB
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !goals.trim() ||
              (inputMode === 'pdf' && !profilePdf) ||
              (inputMode === 'linkedin' && !linkedinUrl.trim())
            }
            className="flex-1 fire-gradient hover:opacity-90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 glow-effect"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Roasting...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 mr-2" />
                Roast Me 🔥
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
} 