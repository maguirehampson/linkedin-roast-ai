"use client"

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, File, X, AlertCircle } from "lucide-react";

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes: string;
  label: string;
  file: File | null;
  maxSize?: number; // in bytes
}

export default function FileUploadZone({ 
  onFileSelect, 
  acceptedTypes, 
  label, 
  file, 
  maxSize = 10 * 1024 * 1024 // 10MB default
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`;
    }

    // Check file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.substring(1);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Invalid file type. Please upload: ${acceptedTypes}`;
    }

    return null;
  };

  const handleFileSelect = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    onFileSelect(selectedFile);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const inputId = `file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`;

  if (file) {
    return (
      <div className="bg-gray-700 rounded-xl p-4 flex items-center justify-between border border-green-500">
        <div className="flex items-center gap-3">
          <File className="w-5 h-5 text-green-400" />
          <div>
            <span className="text-sm text-white">{file.name}</span>
            <div className="text-xs text-gray-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onFileSelect(null);
            setError(null);
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col justify-center items-center cursor-pointer transition-colors duration-200
        ${dragActive ? "border-red-500 bg-gray-800" : "border-gray-600 hover:border-red-500"}
        ${error ? "border-red-500" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id={inputId}
          type="file"
          accept={acceptedTypes}
          onChange={handleChange}
          className="hidden"
        />
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center"
        >
          <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
          <span className="font-semibold text-white">{label}</span>
          <span className="text-xs text-gray-400">
            Drag & drop or click to upload (max {Math.round(maxSize / 1024 / 1024)}MB)
          </span>
        </motion.div>
      </label>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
} 