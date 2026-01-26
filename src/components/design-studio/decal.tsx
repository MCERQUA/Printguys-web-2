'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { PlacedDecal } from './types';
import { X, RotateCw, Maximize2 } from 'lucide-react';

interface DecalProps {
  decal: PlacedDecal;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<PlacedDecal>) => void;
  onRemove: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const Decal: React.FC<DecalProps> = ({
  decal,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
  containerRef,
}) => {
  const decalRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialPosRef = useRef<{ x: number; y: number } | null>(null);

  // --- MOUSE HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(decal.id);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { x: decal.x, y: decal.y };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current || !initialPosRef.current || !containerRef.current) return;

      const deltaX = moveEvent.clientX - dragStartRef.current.x;
      const deltaY = moveEvent.clientY - dragStartRef.current.y;

      const containerRect = containerRef.current.getBoundingClientRect();

      const deltaXPercent = (deltaX / containerRect.width) * 100;
      const deltaYPercent = (deltaY / containerRect.height) * 100;

      onUpdate(decal.id, {
        x: initialPosRef.current.x + deltaXPercent,
        y: initialPosRef.current.y + deltaYPercent,
      });
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
      initialPosRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startScale = decal.scale;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.stopPropagation();
      const deltaX = moveEvent.clientX - startX;
      const scaleDelta = deltaX * 0.005;
      const newScale = Math.max(0.1, Math.min(3, startScale + scaleDelta));
      onUpdate(decal.id, { scale: newScale });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current || !decalRef.current) return;

    const rect = decalRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.stopPropagation();
      const radians = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX);
      const degree = radians * (180 / Math.PI);
      onUpdate(decal.id, { rotation: degree + 90 });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // --- TOUCH HANDLERS (Mobile) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    onSelect(decal.id);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    initialPosRef.current = { x: decal.x, y: decal.y };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!dragStartRef.current || !initialPosRef.current || !containerRef.current) return;
      moveEvent.preventDefault();

      const touch = moveEvent.touches[0];
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      const containerRect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = (deltaX / containerRect.width) * 100;
      const deltaYPercent = (deltaY / containerRect.height) * 100;

      onUpdate(decal.id, {
        x: initialPosRef.current.x + deltaXPercent,
        y: initialPosRef.current.y + deltaYPercent,
      });
    };

    const handleTouchEnd = () => {
      dragStartRef.current = null;
      initialPosRef.current = null;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleResizeTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startScale = decal.scale;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.stopPropagation();
      moveEvent.preventDefault();
      const moveTouch = moveEvent.touches[0];
      const deltaX = moveTouch.clientX - startX;
      const scaleDelta = deltaX * 0.005;
      const newScale = Math.max(0.1, Math.min(3, startScale + scaleDelta));
      onUpdate(decal.id, { scale: newScale });
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleRotateTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!containerRef.current || !decalRef.current) return;

    const rect = decalRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.stopPropagation();
      moveEvent.preventDefault();
      const moveTouch = moveEvent.touches[0];
      const radians = Math.atan2(moveTouch.clientY - centerY, moveTouch.clientX - centerX);
      const degree = radians * (180 / Math.PI);
      onUpdate(decal.id, { rotation: degree + 90 });
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <motion.div
      ref={decalRef}
      className="absolute select-none cursor-move group touch-none"
      style={{
        left: `${decal.x}%`,
        top: `${decal.y}%`,
        width: `${decal.width}px`,
        x: '-50%',
        y: '-50%',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: decal.scale,
        rotate: decal.rotation,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        {/* The Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={decal.url}
          alt="decal"
          className="w-full h-auto pointer-events-none block"
          style={{ maxWidth: '100%' }}
          draggable={false}
        />

        {/* Selection Interface - Red Theme for Printguys */}
        {isSelected && (
          <motion.div
            className="absolute -inset-3 border-2 border-red-500/60 rounded-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}
          >
            {/* Delete Button (Top Left) */}
            <motion.div
              data-delete-button
              className="absolute -top-5 -left-5 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer pointer-events-auto shadow-xl z-30 border-2 border-white/20"
              whileHover={{ scale: 1.15, boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(decal.id);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                onRemove(decal.id);
              }}
            >
              <X size={20} strokeWidth={3} />
            </motion.div>

            {/* Resize Handle (Bottom Right) */}
            <motion.div
              data-resize-handle
              className="absolute -bottom-5 -right-5 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center cursor-ew-resize pointer-events-auto shadow-xl z-30 border-2 border-white/20"
              whileHover={{ scale: 1.15, borderColor: '#ef4444' }}
              onMouseDown={handleResizeMouseDown}
              onTouchStart={handleResizeTouchStart}
            >
              <Maximize2 size={20} strokeWidth={3} />
            </motion.div>

            {/* Rotation Handle (Top Center) */}
            <motion.div
              data-rotate-handle
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto shadow-xl z-30 border-2 border-white/20"
              whileHover={{ scale: 1.15, borderColor: '#ef4444' }}
              onMouseDown={handleRotateMouseDown}
              onTouchStart={handleRotateTouchStart}
            >
              <RotateCw size={20} strokeWidth={3} />
            </motion.div>

            {/* Dashed line to rotation handle */}
            <div data-rotate-handle className="absolute -top-3 left-1/2 -translate-x-1/2 h-14 w-0.5 bg-red-500/50" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
