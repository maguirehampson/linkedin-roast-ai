"use client"

import React from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Target, Brain } from "lucide-react";

export default function LoadingState() {
  const loadingMessages = [
    "Analyzing your professional cringe...",
    "Summoning brutal honesty...",
    "Decoding corporate buzzwords...",
    "Preparing savage feedback...",
    "Consulting the roast gods...",
    "Loading sarcasm algorithms...",
    "Measuring your LinkedIn energy...",
    "Calculating cringe levels..."
  ];

  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800 rounded-2xl p-12 shadow-2xl border border-gray-700 text-center"
    >
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mx-auto mb-6"
        >
          <div className="w-full h-full rounded-full border-4 border-gray-600 border-t-red-500 border-r-yellow-400"></div>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Brain className="w-12 h-12 text-red-500" />
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4 text-red-500"
      >
        Roasting in Progress...
      </motion.h2>

      <motion.p
        key={currentMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-xl text-gray-300 mb-8"
      >
        {loadingMessages[currentMessage]}
      </motion.p>

      <div className="flex justify-center gap-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          className="flex flex-col items-center gap-2"
        >
          <Flame className="w-8 h-8 text-orange-500" />
          <span className="text-sm text-gray-400">Analyzing</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <Zap className="w-8 h-8 text-yellow-500" />
          <span className="text-sm text-gray-400">Processing</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <Target className="w-8 h-8 text-red-500" />
          <span className="text-sm text-gray-400">Roasting</span>
        </motion.div>
      </div>
    </motion.div>
  );
} 