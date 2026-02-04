'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import { DesignStudioCanvas } from './canvas';
import { DesignStudioSidebar } from './sidebar';
import { DesignStudioToolbar } from './toolbar';
import { ExportModal } from './export-modal';
import { OrderForm } from './order-form';
import { PRODUCT_COLORS, PRODUCT_CONFIGS } from './constants';
import type { ProductState, PlacedDecal, ProductSide, ProductColor, ProductType } from './types';
import { trackDesignSave } from '@/components/analytics/google-analytics';

interface DesignStudioProps {
  onSave?: (state: ProductState) => Promise<void>;
  isLoggedIn?: boolean;
  initialState?: ProductState;
}

export const DesignStudio: React.FC<DesignStudioProps> = ({
  onSave,
  isLoggedIn = false,
  initialState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSide, setCurrentSide] = useState<ProductSide>('front');
  const [selectedDecalId, setSelectedDecalId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [productState, setProductState] = useState<ProductState>(
    initialState || {
      front: [],
      back: [],
      color: 'black',
      type: 'tshirt',
    }
  );

  // Handlers
  const handleToggleSide = () => {
    setCurrentSide(prev => (prev === 'front' ? 'back' : 'front'));
    setSelectedDecalId(null);
  };

  const handleAddDesign = (url: string) => {
    const newDecal: PlacedDecal = {
      id: Date.now().toString(),
      assetId: 'custom',
      url,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      width: 150,
      height: 150,
      aspectRatio: 1,
    };

    setProductState(prev => ({
      ...prev,
      [currentSide]: [...prev[currentSide], newDecal],
    }));

    setSelectedDecalId(newDecal.id);
    // Close sidebar on mobile after adding
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleUpdateDecal = (id: string, updates: Partial<PlacedDecal>) => {
    setProductState(prev => ({
      ...prev,
      [currentSide]: prev[currentSide].map(d => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const handleRemoveDecal = (id: string) => {
    setProductState(prev => ({
      ...prev,
      [currentSide]: prev[currentSide].filter(d => d.id !== id),
    }));
    if (selectedDecalId === id) setSelectedDecalId(null);
  };

  const handleReset = () => {
    if (confirm('Clear all designs from the current side?')) {
      setProductState(prev => ({
        ...prev,
        [currentSide]: [],
      }));
      setSelectedDecalId(null);
    }
  };

  const handleChangeColor = (color: ProductColor) => {
    setProductState(prev => ({ ...prev, color }));
  };

  const handleChangeProductType = (type: ProductType) => {
    setProductState(prev => ({ ...prev, type }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(productState);
      // Track successful design save
      trackDesignSave(productState.type);
    } finally {
      setIsSaving(false);
    }
  };

  // Layer Management
  const handleLayerUp = () => {
    if (!selectedDecalId) return;
    setProductState(prev => {
      const list = [...prev[currentSide]];
      const idx = list.findIndex(d => d.id === selectedDecalId);
      if (idx < 0 || idx >= list.length - 1) return prev;
      [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
      return { ...prev, [currentSide]: list };
    });
  };

  const handleLayerDown = () => {
    if (!selectedDecalId) return;
    setProductState(prev => {
      const list = [...prev[currentSide]];
      const idx = list.findIndex(d => d.id === selectedDecalId);
      if (idx <= 0) return prev;
      [list[idx], list[idx - 1]] = [list[idx - 1], list[idx]];
      return { ...prev, [currentSide]: list };
    });
  };

  // Export handler using native Canvas API
  const handleExport = async (format: 'png' | 'jpg'): Promise<string | null> => {
    try {
      console.log('[Export] Starting native canvas export...');

      const scale = 2;
      const baseWidth = 500;
      const baseHeight = 500;
      const width = baseWidth * scale;
      const height = baseHeight * scale;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('[Export] Could not get canvas context');
        return null;
      }

      const colorConfig = PRODUCT_COLORS.find(c => c.value === productState.color) || PRODUCT_COLORS[0];
      const productConfig = PRODUCT_CONFIGS[productState.type];
      const strokeColor = productState.color === 'white' ? '#e2e8f0' : 'rgba(255,255,255,0.15)';

      // Background for JPG
      if (format === 'jpg') {
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, width, height);
      }

      // Draw product SVG
      const neckline = currentSide === 'front' ? productConfig.necklineFront : productConfig.necklineBack;
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="${width}" height="${height}">
          <path
            d="${productConfig.svgPath}"
            fill="${colorConfig.hex}"
            stroke="${strokeColor}"
            stroke-width="1"
          />
          <path d="${neckline}" fill="none" stroke="${strokeColor}" stroke-width="2" opacity="0.5"/>
          <path d="M200,130 Q250,145 300,130" fill="none" stroke="${strokeColor}" stroke-width="0.5" opacity="0.3"/>
        </svg>
      `;

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      await new Promise<void>((resolve, reject) => {
        const productImg = new Image();
        productImg.onload = () => {
          ctx.drawImage(productImg, 0, 0, width, height);
          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        productImg.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          reject(new Error('Failed to load product SVG'));
        };
        productImg.src = svgUrl;
      });

      // Print area bounds
      const printArea = {
        left: (productConfig.printArea.left / 100) * width,
        top: (productConfig.printArea.top / 100) * height,
        width: (productConfig.printArea.width / 100) * width,
        height: (productConfig.printArea.height / 100) * height,
      };

      // Draw each decal
      const decals = productState[currentSide];
      for (const decal of decals) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const x = printArea.left + (decal.x / 100) * printArea.width;
            const y = printArea.top + (decal.y / 100) * printArea.height;
            const imgWidth = decal.width * decal.scale * scale;
            const actualAspectRatio = img.naturalWidth / img.naturalHeight;
            const imgHeight = imgWidth / actualAspectRatio;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((decal.rotation * Math.PI) / 180);
            ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
            ctx.restore();
            resolve();
          };
          img.onerror = () => {
            console.warn(`[Export] Failed to load decal: ${decal.url}`);
            resolve();
          };
          img.src = decal.url;
        });
      }

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'jpg' ? 0.95 : undefined;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      console.log('[Export] Export complete, data URL length:', dataUrl.length);
      return dataUrl;
    } catch (error) {
      console.error('[Export] Export failed:', error);
      return null;
    }
  };

  const handleShare = () => {
    setIsExportModalOpen(true);
  };

  const handleOrder = () => {
    if (productState.front.length === 0 && productState.back.length === 0) {
      alert('Please add at least one design before requesting a quote.');
      return;
    }
    setIsOrderFormOpen(true);
  };

  // Derived state
  const currentDecals = productState[currentSide];
  const selectedIndex = currentDecals.findIndex(d => d.id === selectedDecalId);
  const canLayerUp = selectedIndex >= 0 && selectedIndex < currentDecals.length - 1;
  const canLayerDown = selectedIndex > 0;
  const hasSelection = selectedDecalId !== null;

  return (
    <section
      id="design-studio"
      ref={containerRef}
      className="min-h-screen bg-black pt-28 pb-20 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        {/* Red glow spots */}
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-[150px] opacity-20"
          style={{ background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-[150px] opacity-10"
          style={{ background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)' }}
        />
      </div>

      {/* Sidebar */}
      <DesignStudioSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onAddDesign={handleAddDesign}
      />

      {/* Main Content */}
      <div className={`relative z-10 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : 'ml-0'}`}>
        {/* Header */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-3 h-3" />
                Design Tool
              </motion.div>
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                DESIGN <span className="text-red-500">STUDIO</span>
              </motion.h2>
              <motion.p
                className="text-gray-400 mt-2 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Upload your artwork, position it perfectly, and get a quote for your custom printed apparel.
              </motion.p>
            </div>

            <motion.div
              className="flex items-center gap-2 bg-black/80 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Zap className="w-4 h-4 text-green-500 fill-green-500" />
              <span className="text-sm font-medium text-green-500">Ready to Print</span>
            </motion.div>
          </div>
        </div>

        {/* Canvas Area */}
        <motion.div
          ref={canvasContainerRef}
          className="container mx-auto px-4 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedDecalId(null);
            }
          }}
        >
          <DesignStudioCanvas
            side={currentSide}
            productColor={productState.color}
            productType={productState.type}
            decals={productState[currentSide]}
            selectedDecalId={selectedDecalId}
            onSelectDecal={setSelectedDecalId}
            onUpdateDecal={handleUpdateDecal}
            onRemoveDecal={handleRemoveDecal}
          />
        </motion.div>

        {/* Mobile Sidebar Toggle Hint */}
        {!isSidebarOpen && productState.front.length === 0 && productState.back.length === 0 && (
          <motion.div
            className="fixed bottom-24 left-4 lg:hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-500 px-4 py-2 rounded-full text-sm font-semibold"
              onClick={() => setIsSidebarOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span>Tap to add designs</span>
              <span className="text-lg">→</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Toolbar */}
      <DesignStudioToolbar
        currentSide={currentSide}
        productColor={productState.color}
        productType={productState.type}
        onToggleSide={handleToggleSide}
        onChangeColor={handleChangeColor}
        onChangeProductType={handleChangeProductType}
        onReset={handleReset}
        onExport={() => setIsExportModalOpen(true)}
        onShare={handleShare}
        onOrder={handleOrder}
        onSave={onSave ? handleSave : undefined}
        onLayerUp={handleLayerUp}
        onLayerDown={handleLayerDown}
        canLayerUp={canLayerUp}
        canLayerDown={canLayerDown}
        hasSelection={hasSelection}
        isLoggedIn={isLoggedIn}
        isSaving={isSaving}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        designCount={{ front: productState.front.length, back: productState.back.length }}
      />

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        productState={productState}
        productColor={productState.color}
        productType={productState.type}
      />
    </section>
  );
};

export default DesignStudio;
