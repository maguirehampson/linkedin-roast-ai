"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Share2, Copy, Twitter, Linkedin } from "lucide-react";

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

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roastData: RoastResult | null;
}

export default function ShareModal({ isOpen, onClose, roastData }: ShareModalProps) {
  const shareText = `I just got roasted by LinkedIn AI! 🔥 

My profile scored ${roastData?.savage_score} and got called out for these hashtags: ${roastData?.hashtags_to_avoid?.join(", ")}

Get your own brutal LinkedIn roast at LinkedInRoast.ai`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    alert("Copied to clipboard!");
  };

  const shareOnTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(tweetUrl, '_blank');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(linkedInUrl, '_blank');
  };

  if (!roastData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Share2 className="w-6 h-6 text-blue-500" />
            Share Your Roast
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <p className="text-sm text-gray-300 whitespace-pre-line">
              {shareText}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={copyToClipboard}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            
            <Button
              onClick={shareOnTwitter}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Share on Twitter
            </Button>
            
            <Button
              onClick={shareOnLinkedIn}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              Share on LinkedIn
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 