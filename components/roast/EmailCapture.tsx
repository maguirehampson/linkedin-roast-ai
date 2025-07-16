"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Mail, Sparkles, X } from "lucide-react";

interface EmailCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export default function EmailCapture(props: EmailCaptureProps) {
  const { isOpen, onClose, onSubmit } = props;
  const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  if (TEST_MODE) {
    return (
      <div className="p-4 border border-gray-600 rounded-xl bg-gray-800 text-center text-gray-400">
        Email capture is paused in Test Mode.
      </div>
    );
  }

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(email);
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Want a Full Makeover?
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              Get a complete LinkedIn profile rewrite + personal branding teardown sent to your inbox.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>No spam</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>Free upgrade</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 h-12 rounded-xl"
              required
            />
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Maybe Later
              </Button>
              <Button
                type="submit"
                disabled={!email.trim() || isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Upgrade
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 