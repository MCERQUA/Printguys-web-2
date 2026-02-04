'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Copy, Check, Image, FileImage, RefreshCw, AlertCircle } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'png' | 'jpg') => Promise<string | null>;
  designCount: { front: number; back: number };
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  designCount,
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'share'>('download');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewFormat, setPreviewFormat] = useState<'png' | 'jpg'>('png');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate preview when modal opens
  const generatePreview = useCallback(async (format: 'png' | 'jpg' = 'png') => {
    setIsGenerating(true);
    setError(null);
    try {
      const url = await onExport(format);
      if (url) {
        setPreviewImage(url);
        setPreviewFormat(format);
      } else {
        setError('Failed to generate image. Please try again.');
      }
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [onExport]);

  // Auto-generate preview when modal opens
  useEffect(() => {
    if (isOpen && !previewImage && !isGenerating) {
      generatePreview('png');
    }
  }, [isOpen, previewImage, isGenerating, generatePreview]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPreviewImage(null);
      setError(null);
      setActiveTab('download');
    }
  }, [isOpen]);

  const handleDownload = () => {
    if (!previewImage) return;

    const link = document.createElement('a');
    link.href = previewImage;
    link.download = `printguys-design-${Date.now()}.${previewFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFormatChange = async (format: 'png' | 'jpg') => {
    if (format !== previewFormat) {
      await generatePreview(format);
    }
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/design-studio`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) return;

    try {
      if (previewImage && navigator.canShare) {
        const response = await fetch(previewImage);
        const blob = await response.blob();
        const file = new File([blob], `printguys-design.${previewFormat}`, {
          type: previewFormat === 'png' ? 'image/png' : 'image/jpeg'
        });

        const shareData = {
          title: 'My Printguys Design',
          text: 'Check out my custom design!',
          files: [file],
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      await navigator.share({
        title: 'My Printguys Design',
        text: 'Check out my custom design!',
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    } catch (err) {
      console.log('Share cancelled or failed:', err);
    }
  };

  const handleSaveImage = () => {
    if (!previewImage) return;

    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <title>Printguys Design</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #111;
              }
              img { max-width: 100%; max-height: 100vh; }
            </style>
          </head>
          <body>
            <img src="${previewImage}" alt="Printguys Design" />
          </body>
        </html>
      `);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ boxShadow: '0 0 60px rgba(239,68,68,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
              <h2 className="font-bold text-xl text-white">Export Design</h2>
              <motion.button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Image Preview Section */}
            <div className="p-4 border-b border-white/10 shrink-0">
              <div className="relative aspect-[4/5] max-h-[300px] mx-auto bg-black rounded-xl overflow-hidden border border-white/10">
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Generating preview...</span>
                  </div>
                ) : error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                    <span className="text-sm text-gray-400">{error}</span>
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm"
                      onClick={() => generatePreview(previewFormat)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </motion.button>
                  </div>
                ) : previewImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewImage}
                    alt="Design Preview"
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-gray-500">No preview available</span>
                  </div>
                )}
              </div>

              {/* Design Count */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  <span className="text-white font-semibold">{designCount.front}</span> design(s) on front,{' '}
                  <span className="text-white font-semibold">{designCount.back}</span> on back
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 shrink-0">
              <button
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'download'
                    ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('download')}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'share'
                    ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('share')}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto">
              {activeTab === 'download' && (
                <div className="space-y-4">
                  {/* Format Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors ${
                        previewFormat === 'png'
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-white/10 hover:border-red-500/50 bg-white/5'
                      }`}
                      onClick={() => handleFormatChange('png')}
                      disabled={isGenerating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        previewFormat === 'png' ? 'bg-red-500/30' : 'bg-red-500/20'
                      }`}>
                        <Image className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-white text-sm">PNG</p>
                        <p className="text-[10px] text-gray-500">Transparent</p>
                      </div>
                    </motion.button>

                    <motion.button
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors ${
                        previewFormat === 'jpg'
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-white/10 hover:border-red-500/50 bg-white/5'
                      }`}
                      onClick={() => handleFormatChange('jpg')}
                      disabled={isGenerating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        previewFormat === 'jpg' ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <FileImage className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-white text-sm">JPG</p>
                        <p className="text-[10px] text-gray-500">With background</p>
                      </div>
                    </motion.button>
                  </div>

                  {/* Download Button */}
                  <motion.button
                    className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDownload}
                    disabled={!previewImage || isGenerating}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(239,68,68,0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-5 h-5" />
                    Download {previewFormat.toUpperCase()}
                  </motion.button>
                </div>
              )}

              {activeTab === 'share' && (
                <div className="space-y-4">
                  {/* Share with Image Button */}
                  {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                    <motion.button
                      className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                      onClick={handleNativeShare}
                      disabled={!previewImage || isGenerating}
                      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(239,68,68,0.5)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Share2 className="w-5 h-5" />
                      Share Design Image
                    </motion.button>
                  )}

                  {/* Open Image in New Tab */}
                  <motion.button
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    onClick={handleSaveImage}
                    disabled={!previewImage || isGenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image className="w-5 h-5" />
                    Open Image in New Tab
                  </motion.button>

                  {/* Copy Link */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Or copy link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={typeof window !== 'undefined' ? `${window.location.origin}/design-studio` : ''}
                        className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
                      />
                      <motion.button
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2"
                        onClick={handleCopyLink}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    Tip: Use &quot;Share Design Image&quot; to share the actual design with your image attached
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
};
