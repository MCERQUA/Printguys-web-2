"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenTool, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export function FloatingDesignButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Hide on design studio pages
  const hideOnPaths = ['/design-studio', '/design-studio/shared'];
  const shouldHide = hideOnPaths.some(path => pathname.startsWith(path));

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (shouldHide) return null;

  return (
    <Link
      href="/design-studio"
      className="fixed bottom-6 right-6 z-40 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pulse Effect */}
      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 group-hover:opacity-40 transition-opacity duration-300" />

      {/* Main Button */}
      <div className={`
        relative flex items-center gap-3 px-6 py-4 bg-red-600 hover:bg-red-500 text-white
        rounded-full shadow-2xl shadow-red-600/50 hover:shadow-red-600/70
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
        ${isHovered ? 'scale-110 pr-8' : 'scale-100'}
      `}>
        <div className="relative">
          <PenTool className="w-6 h-6" />
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
        </div>

        {/* Expanded Text */}
        <span className={`
          font-black uppercase tracking-wider text-lg whitespace-nowrap
          transition-all duration-300 overflow-hidden
          ${isHovered ? 'max-w-32 opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0'}
        `}>
          Design
        </span>
      </div>

      {/* Hover Glow */}
      <div className={`
        absolute inset-0 bg-gradient-radial from-red-500/40 to-transparent rounded-full blur-xl
        transition-opacity duration-300
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `} />
    </Link>
  );
}
