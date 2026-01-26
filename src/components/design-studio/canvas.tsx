'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlacedDecal, ProductSide, ProductColor, ProductType } from './types';
import { Decal } from './decal';
import { PRODUCT_COLORS, PRODUCT_CONFIGS } from './constants';

interface DesignStudioCanvasProps {
  side: ProductSide;
  productColor: ProductColor;
  productType: ProductType;
  decals: PlacedDecal[];
  selectedDecalId: string | null;
  onSelectDecal: (id: string | null) => void;
  onUpdateDecal: (id: string, updates: Partial<PlacedDecal>) => void;
  onRemoveDecal: (id: string) => void;
}

export const DesignStudioCanvas: React.FC<DesignStudioCanvasProps> = ({
  side,
  productColor,
  productType,
  decals,
  selectedDecalId,
  onSelectDecal,
  onUpdateDecal,
  onRemoveDecal,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = () => {
    onSelectDecal(null);
  };

  const colorConfig = PRODUCT_COLORS.find(c => c.value === productColor) || PRODUCT_COLORS[0];
  const productConfig = PRODUCT_CONFIGS[productType];
  const strokeColor = productColor === 'white' ? '#e2e8f0' : 'rgba(255,255,255,0.15)';

  return (
    <div
      className="relative w-full max-w-[500px] aspect-square mx-auto select-none flex items-center justify-center"
      onClick={() => onSelectDecal(null)}
    >
      {/* Canvas Glow Effect */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          boxShadow: `
            0 0 60px rgba(239, 68, 68, 0.1),
            0 0 100px rgba(239, 68, 68, 0.05),
            0 25px 50px rgba(0, 0, 0, 0.5)
          `,
        }}
      />

      {/* Base Product Shape (SVG) */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }}
      >
        <defs>
          <linearGradient id="productGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorConfig.hex} />
            <stop offset="50%" stopColor={colorConfig.hex} />
            <stop offset="100%" stopColor={productColor === 'white' ? '#f0f0f0' : 'rgba(0,0,0,0.2)'} />
          </linearGradient>
          <filter id="fabric-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="1" result="light">
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
            <feBlend in="SourceGraphic" in2="light" mode="multiply" />
          </filter>
        </defs>

        {/* The Product Color Background */}
        <path
          d={productConfig.svgPath}
          fill={colorConfig.hex}
          stroke={strokeColor}
          strokeWidth="1"
        />

        {/* Neckline detail for Front vs Back */}
        {side === 'front' ? (
          <path
            d={productConfig.necklineFront}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            opacity="0.5"
          />
        ) : (
          <path
            d={productConfig.necklineBack}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            opacity="0.5"
          />
        )}

        {/* Subtle fold lines */}
        <path
          d="M200,130 Q250,145 300,130"
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>

      {/* Printable Area Container */}
      <div
        className="absolute transition-all duration-300 bg-transparent overflow-hidden"
        ref={printAreaRef}
        style={{
          top: `${productConfig.printArea.top}%`,
          left: `${productConfig.printArea.left}%`,
          width: `${productConfig.printArea.width}%`,
          height: `${productConfig.printArea.height}%`,
          border: decals.length === 0 ? '2px dashed rgba(239, 68, 68, 0.4)' : '2px dashed rgba(239, 68, 68, 0.2)',
          boxShadow: decals.length > 0 ? '0 0 30px rgba(239, 68, 68, 0.15)' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleBackgroundClick();
        }}
        id="print-area"
      >
        {/* Label for print area */}
        <AnimatePresence>
          {decals.length === 0 && (
            <motion.div
              data-drop-hint
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-xs text-red-500/60 font-medium uppercase tracking-widest border border-red-500/30 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                Drop Design Here
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decals Rendered Inside Mask */}
        <AnimatePresence>
          {decals.map((decal) => (
            <Decal
              key={decal.id}
              decal={decal}
              isSelected={selectedDecalId === decal.id}
              onSelect={onSelectDecal}
              onUpdate={onUpdateDecal}
              onRemove={onRemoveDecal}
              containerRef={printAreaRef}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Fabric Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-black/20 rounded-2xl" />
      </div>

      {/* Side & Product Indicator Badge */}
      <motion.div
        data-side-badge
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/80 border border-white/10 backdrop-blur-sm"
        key={`${side}-${productType}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <span className="text-red-500">{side}</span>
        <span className="text-gray-500 ml-1">• {productConfig.label}</span>
      </motion.div>
    </div>
  );
};
