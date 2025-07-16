"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Lightbulb, Tag, Share2, Mail, RefreshCw } from "lucide-react";

interface RoastResult {
  id: string;
  goals_text: string;
  profile_pdf_url: string;
  context_file_url?: string;
  roast_text: string;
  savage_score: string; // e.g., "65/100"
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

interface RoastResultsProps {
  roastData: RoastResult;
  onTryAgain: () => void;
  onEmailCapture: () => void;
  onShare: () => void;
}

const getScoreColor = (score: string) => {
  const numericScore = parseInt(score.split('/')[0]);
  if (numericScore >= 80) return "text-green-400";
  if (numericScore >= 60) return "text-yellow-400";
  if (numericScore >= 40) return "text-orange-400";
  return "text-red-400";
};

const getScoreEmoji = (score: string) => {
  const numericScore = parseInt(score.split('/')[0]);
  if (numericScore >= 80) return "🔥";
  if (numericScore >= 60) return "👍";
  if (numericScore >= 40) return "😬";
  return "💀";
};

const getScoreMessage = (score: string) => {
  const numericScore = parseInt(score.split('/')[0]);
  if (numericScore >= 80) return "LinkedIn Legend!";
  if (numericScore >= 60) return "Not bad, but could be better";
  if (numericScore >= 40) return "Room for improvement";
  return "Time for a complete overhaul";
};

export default function RoastResults({ roastData, onTryAgain, onEmailCapture, onShare }: RoastResultsProps) {
  // Copy to clipboard helpers
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <Flame className="w-12 h-12 text-red-500" />
          <h1 className="text-4xl font-bold">Your Roast Results</h1>
        </motion.div>
        <p className="text-gray-400">Here's what our AI thinks about your LinkedIn profile</p>
      </div>

      {/* New Viral/Shareable Content Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 rounded-2xl p-6 border border-gray-700 mb-4"
      >
        {/* Vibe Tags */}
        <div className="mb-2 flex flex-wrap gap-2 justify-center">
          {roastData.vibe_tags && roastData.vibe_tags.length > 0 && roastData.vibe_tags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs px-2 py-1 border-blue-400 text-blue-300">
              {tag}
            </Badge>
          ))}
        </div>
        {/* Share Quote & Meme Caption */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-2">
          {roastData.share_quote && (
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
              <span className="italic text-gray-200">"{roastData.share_quote}"</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  copyToClipboard(roastData.share_quote);
                  alert('Share quote copied to clipboard!');
                }} 
                title="Copy share quote"
                className="ml-2 hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4 text-blue-400" />
                Copy
              </Button>
            </div>
          )}
          {roastData.meme_caption && (
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-3">
              <span className="italic text-gray-400">{roastData.meme_caption}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  copyToClipboard(roastData.meme_caption);
                  alert('Meme caption copied to clipboard!');
                }} 
                title="Copy meme caption"
                className="ml-2 hover:bg-yellow-700"
              >
                <Share2 className="w-4 h-4 text-yellow-400" />
                Copy
              </Button>
            </div>
          )}
        </div>
        {/* Diagnostics */}
        {roastData.diagnostics && roastData.diagnostics.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm font-bold text-red-300 mb-1 flex items-center gap-1"><Tag className="w-4 h-4 text-red-400" /> Diagnostics</h3>
            <ul className="space-y-1">
              {roastData.diagnostics.map((diag, idx) => (
                <li key={idx} className="text-xs text-gray-300 bg-gray-800 rounded px-2 py-1">
                  <span className="font-semibold text-red-400">[{diag.type}]</span> <span className="text-blue-200">"{diag.text}"</span> <span className="text-gray-400">— {diag.comment}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Profile Score</h2>
            </div>
            
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold ${getScoreColor(roastData.savage_score)} mb-2`}>
                {roastData.savage_score}
              </div>
              <div className="text-4xl mb-4">{getScoreEmoji(roastData.savage_score)}</div>
              
              <div className="bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${parseInt(roastData.savage_score.split('/')[0])}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="score-gradient h-4 rounded-full"
                />
              </div>
              
              <p className="text-lg font-semibold">
                {getScoreMessage(roastData.savage_score)}
              </p>
            </div>

            {/* Score Breakdown */}
            {roastData.score_breakdown && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Score Breakdown</h3>
                {Object.entries(roastData.score_breakdown).map(([category, score]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-gray-300">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(score as number / 20) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className={`h-2 rounded-full ${
                            (score as number) >= 16 ? 'bg-green-500' :
                            (score as number) >= 12 ? 'bg-yellow-500' :
                            (score as number) >= 8 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8 text-right">{score}/20</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Brutal Feedback */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold">Brutal Feedback 🔥</h2>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                {roastData.brutal_feedback}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Constructive Path Forward */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Constructive Path Forward 💡</h2>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                {roastData.constructive_path_forward}
              </p>
            </div>
          </motion.div>

          {/* Hashtags to Avoid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold">Hashtags to Avoid 🚫</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {roastData.hashtags_to_avoid.map((hashtag, index) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="text-sm px-3 py-1"
                >
                  {hashtag}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Skills to Highlight */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold">Skills to Highlight ⭐</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {roastData.top_skills_to_highlight.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm px-3 py-1 bg-green-900 text-green-100 border-green-700"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
      >
        <Button
          onClick={onTryAgain}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        
        <Button
          onClick={onEmailCapture}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
        >
          <Mail className="w-4 h-4" />
          Get Full Makeover
        </Button>
        
        <Button
          onClick={onShare}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </motion.div>
    </motion.div>
  );
} 