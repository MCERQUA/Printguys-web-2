'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductSide, ProductColor, ProductType } from './types';
import { PRODUCT_COLORS, PRODUCT_CONFIGS } from './constants';
import {
  Download,
  RefreshCcw,
  Shirt,
  ArrowUp,
  ArrowDown,
  Share2,
  ShoppingCart,
  Save,
  ChevronDown,
} from 'lucide-react';

interface DesignStudioToolbarProps {
  currentSide: ProductSide;
  productColor: ProductColor;
  productType: ProductType;
  onToggleSide: () => void;
  onChangeColor: (color: ProductColor) => void;
  onChangeProductType: (type: ProductType) => void;
  onReset: () => void;
  onExport: () => void;
  onShare: () => void;
  onOrder: () => void;
  onSave?: () => void;
  onLayerUp?: () => void;
  onLayerDown?: () => void;
  canLayerUp?: boolean;
  canLayerDown?: boolean;
  hasSelection?: boolean;
  isLoggedIn?: boolean;
  isSaving?: boolean;
  isSidebarOpen?: boolean;
}

export const DesignStudioToolbar: React.FC<DesignStudioToolbarProps> = ({
  currentSide,
  productColor,
  productType,
  onToggleSide,
  onChangeColor,
  onChangeProductType,
  onReset,
  onExport,
  onShare,
  onOrder,
  onSave,
  onLayerUp,
  onLayerDown,
  canLayerUp,
  canLayerDown,
  hasSelection,
  isLoggedIn,
  isSaving,
  isSidebarOpen,
}) => {
  const [showProductMenu, setShowProductMenu] = React.useState(false);

  return (
    <motion.div
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 sm:p-3 rounded-xl sm:rounded-2xl flex items-center justify-between sm:justify-start gap-1 sm:gap-3 z-30 transition-all duration-300 overflow-x-auto ${
        isSidebarOpen ? 'lg:translate-x-[calc(-50%+10rem)]' : ''
      }`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      style={{
        boxShadow: '0 0 40px rgba(0,0,0,0.5), 0 0 60px rgba(239,68,68,0.1)',
      }}
    >
      {/* Product Type Selector */}
      <div className="relative shrink-0">
        <motion.button
          onClick={() => setShowProductMenu(!showProductMenu)}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline sm:inline">{PRODUCT_CONFIGS[productType].label}</span>
          <ChevronDown className="w-3 h-3" />
        </motion.button>

        {/* Product Type Dropdown */}
        <AnimatePresence>
          {showProductMenu && (
            <motion.div
              className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[140px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {Object.values(PRODUCT_CONFIGS).map((config) => (
                <button
                  key={config.type}
                  onClick={() => {
                    onChangeProductType(config.type);
                    setShowProductMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                    productType === config.type
                      ? 'bg-red-500/20 text-red-500'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Toggles */}
      <div className="flex bg-white/5 rounded-lg p-0.5 sm:p-1 shrink-0">
        <motion.button
          onClick={() => currentSide !== 'front' && onToggleSide()}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold transition-all ${
            currentSide === 'front'
              ? 'bg-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          whileTap={{ scale: 0.98 }}
          style={currentSide === 'front' ? { boxShadow: '0 0 15px rgba(239,68,68,0.4)' } : {}}
        >
          <span>Front</span>
        </motion.button>
        <motion.button
          onClick={() => currentSide !== 'back' && onToggleSide()}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold transition-all ${
            currentSide === 'back'
              ? 'bg-red-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
          whileTap={{ scale: 0.98 }}
          style={currentSide === 'back' ? { boxShadow: '0 0 15px rgba(239,68,68,0.4)' } : {}}
        >
          <span>Back</span>
        </motion.button>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-8 bg-white/10 shrink-0" />

      {/* Layer Controls - visible only when selected */}
      <AnimatePresence>
        {hasSelection && (
          <motion.div
            className="flex items-center gap-0.5 sm:gap-1 shrink-0"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
          >
            <motion.button
              className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md sm:rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              onClick={onLayerDown}
              disabled={!canLayerDown}
              whileTap={canLayerDown ? { scale: 0.95 } : {}}
              title="Send Backward"
            >
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.button>
            <motion.button
              className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md sm:rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              onClick={onLayerUp}
              disabled={!canLayerUp}
              whileTap={canLayerUp ? { scale: 0.95 } : {}}
              title="Bring Forward"
            >
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
        <motion.button
          className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md sm:rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          onClick={onReset}
          whileTap={{ scale: 0.95 }}
          title="Reset"
        >
          <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </motion.button>

        {isLoggedIn && onSave && (
          <motion.button
            className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md sm:rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
            onClick={onSave}
            disabled={isSaving}
            whileTap={{ scale: 0.95 }}
            title="Save Design"
          >
            <Save className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ${isSaving ? 'animate-pulse' : ''}`} />
          </motion.button>
        )}

        <motion.button
          className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md sm:rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          onClick={onShare}
          whileTap={{ scale: 0.95 }}
          title="Share Design"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </motion.button>

        <motion.button
          className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md sm:rounded-lg bg-white/10 hover:bg-white/20 transition-colors sm:w-auto sm:px-4 sm:py-2"
          onClick={onExport}
          whileTap={{ scale: 0.98 }}
          title="Export"
        >
          <Download className="w-4 h-4 sm:w-4 sm:h-4 text-white" />
          <span className="hidden sm:inline ml-2 font-semibold text-white text-sm">Export</span>
        </motion.button>

        <motion.button
          className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-red-500 hover:bg-red-600 transition-colors font-bold text-white text-xs sm:text-sm"
          onClick={onOrder}
          whileTap={{ scale: 0.98 }}
          style={{ boxShadow: '0 0 15px rgba(239,68,68,0.3)' }}
        >
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Get Quote</span>
        </motion.button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 sm:h-8 bg-white/10 shrink-0" />

      {/* Color Selector */}
      <div className="flex items-center gap-1 shrink-0 min-w-0">
        {PRODUCT_COLORS.slice(0, 4).map((color) => (
          <motion.button
            key={color.value}
            onClick={() => onChangeColor(color.value)}
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all shrink-0 ${
              productColor === color.value
                ? 'border-red-500 scale-110'
                : 'border-white/20 hover:border-white/40'
            }`}
            style={{ backgroundColor: color.hex }}
            whileTap={{ scale: 0.9 }}
            title={color.label}
          />
        ))}
        {/* Show remaining colors only on larger screens */}
        {PRODUCT_COLORS.slice(4).map((color) => (
          <motion.button
            key={color.value}
            onClick={() => onChangeColor(color.value)}
            className={`hidden md:flex w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all shrink-0 ${
              productColor === color.value
                ? 'border-red-500 scale-110'
                : 'border-white/20 hover:border-white/40'
            }`}
            style={{ backgroundColor: color.hex }}
            whileTap={{ scale: 0.9 }}
            title={color.label}
          />
        ))}
      </div>
    </motion.div>
  );
};
