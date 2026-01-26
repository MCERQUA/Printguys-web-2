'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, LayoutGrid, ChevronRight, ChevronLeft, Building2, Sparkles } from 'lucide-react';
import type { DesignAsset } from './types';

interface DesignStudioSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddDesign: (url: string) => void;
}

type LibraryTab = 'designs' | 'logos';

// Sample preset designs - these would be loaded from your public folder in production
const SAMPLE_DESIGNS: DesignAsset[] = [
  { id: 'design-1', name: 'Abstract Wave', url: '/images/designs/sample-1.png', category: 'design' },
  { id: 'design-2', name: 'Geometric', url: '/images/designs/sample-2.png', category: 'design' },
];

const SAMPLE_LOGOS: DesignAsset[] = [
  { id: 'logo-1', name: 'Company Logo', url: '/images/logos/sample-1.png', category: 'logo' },
];

export const DesignStudioSidebar: React.FC<DesignStudioSidebarProps> = ({
  isOpen,
  onToggle,
  onAddDesign,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<LibraryTab>('designs');
  const [designs, setDesigns] = useState<DesignAsset[]>([]);
  const [logos, setLogos] = useState<DesignAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load design assets on mount
  useEffect(() => {
    const loadAssets = async () => {
      try {
        // In production, you would fetch from an API that reads the public/images directories
        // For now, we'll use the sample designs
        setDesigns(SAMPLE_DESIGNS);
        setLogos(SAMPLE_LOGOS);
      } catch (error) {
        console.error('Failed to load design assets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAssets();
  }, []);

  const currentLibrary = activeTab === 'designs' ? designs : logos;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be under 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onAddDesign(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.div
        className={`fixed left-0 top-20 bottom-0 z-40 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl flex flex-col w-80`}
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}>
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">Design Lab</h1>
              <p className="text-xs text-gray-500">Printguys Design Studio</p>
            </div>
          </div>
          <motion.button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            onClick={onToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Library Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('designs')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'designs'
                ? 'border-red-500 text-red-500 bg-red-500/5'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Designs
          </button>
          <button
            onClick={() => setActiveTab('logos')}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'logos'
                ? 'border-red-500 text-red-500 bg-red-500/5'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Logos
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Upload Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Upload Your Design
            </h3>
            <motion.div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-red-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer group transition-all duration-300"
              whileHover={{ borderColor: 'rgba(239, 68, 68, 0.5)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <motion.div
                className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-3 border border-white/10 group-hover:border-red-500/50 transition-colors"
                whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(239,68,68,0.3)' }}
              >
                <Upload className="w-6 h-6 text-red-500" />
              </motion.div>
              <p className="text-sm font-medium text-white">Upload Image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 10MB</p>
            </motion.div>
          </div>

          {/* AI Design Generator Promo */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4 border border-red-500/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">AI Design Generator</h4>
                <p className="text-xs text-gray-400 mt-1">Coming soon! Generate custom designs with AI.</p>
              </div>
            </div>
          </div>

          {/* Library Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {activeTab === 'designs' ? 'Design Library' : 'Logo Library'}
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : currentLibrary.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  No {activeTab === 'designs' ? 'designs' : 'logos'} available yet
                </p>
                <p className="text-xs mt-1">
                  Upload your own or check back later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {currentLibrary.map((design, index) => (
                  <motion.button
                    key={design.id}
                    onClick={() => onAddDesign(design.url)}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group bg-black/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.3) }}
                    whileHover={{ scale: 1.02, borderColor: 'rgba(239, 68, 68, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={design.url}
                      alt={design.name}
                      className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Hide broken images
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                      <span className="text-[10px] font-semibold text-white text-center px-1 line-clamp-2">{design.name}</span>
                    </div>
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1, boxShadow: 'inset 0 0 30px rgba(239,68,68,0.3)' }}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Pro Tips
            </h3>
            <div className="bg-black/50 rounded-xl p-4 border border-white/5 space-y-2">
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="text-red-500 font-semibold">Drag</span> to move your design
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="text-red-500 font-semibold">Corner handle</span> to resize
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="text-red-500 font-semibold">Top handle</span> to rotate
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="text-red-500 font-semibold">Best resolution:</span> 300 DPI
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-xs text-gray-600">Printguys Design Studio</p>
        </div>
      </motion.div>

      {/* Pull Tab (always visible) */}
      <motion.button
        onClick={onToggle}
        className="fixed top-1/2 -translate-y-1/2 bg-gray-900/95 border border-white/10 border-l-0 p-3 rounded-r-xl shadow-xl z-40 flex items-center justify-center hover:bg-red-500/20 transition-colors group"
        initial={false}
        animate={{ left: isOpen ? 320 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        whileHover={{ x: isOpen ? -3 : 5 }}
        title={isOpen ? "Close Design Panel" : "Open Design Panel"}
      >
        {isOpen ? (
          <ChevronLeft className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" />
        ) : (
          <ChevronRight className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" />
        )}
      </motion.button>
    </>
  );
};
