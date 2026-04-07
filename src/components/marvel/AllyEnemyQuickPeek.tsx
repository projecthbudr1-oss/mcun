'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Skull, Swords, Minus, ArrowRight } from 'lucide-react';
import type { MCUCharacter } from '@/data/characters';

interface AllyEnemyQuickPeekProps {
  character: MCUCharacter;
  visible: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

const alignmentConfig = {
  hero: { label: 'Hero', bg: 'bg-green-500/20', text: 'text-green-400', icon: Shield },
  villain: { label: 'Villain', bg: 'bg-red-500/20', text: 'text-red-400', icon: Skull },
  'anti-hero': { label: 'Anti-Hero', bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Swords },
  neutral: { label: 'Neutral', bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Minus },
};

const tierConfig: Record<string, { label: string; color: string; icon: string }> = {
  cosmic: { label: 'Cosmic', color: '#FFD54F', icon: '🌟' },
  omega: { label: 'Omega', color: '#7C4DFF', icon: '💎' },
  alpha: { label: 'Alpha', color: '#4FC3F7', icon: '⚡' },
  beta: { label: 'Beta', color: '#76FF03', icon: '🔰' },
  gamma: { label: 'Gamma', color: '#FF6D00', icon: '✦' },
  normal: { label: 'Normal', color: '#9E9E9E', icon: '○' },
};

function getPopupPosition(anchorEl: HTMLElement | null) {
  if (!anchorEl) return { top: 0, left: 0 };

  const rect = anchorEl.getBoundingClientRect();
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const popW = 240;
  const popH = 140;

  // Default: show below and to the right
  let top = rect.bottom + 8;
  let left = rect.left + rect.width / 2 - popW / 2;

  // If it would overflow the bottom, show above
  if (top + popH > viewH - 20) {
    top = rect.top - popH - 8;
  }

  // Clamp horizontal
  left = Math.max(12, Math.min(left, viewW - popW - 12));

  // Clamp vertical
  top = Math.max(12, Math.min(top, viewH - popH - 12));

  return { top, left };
}

export default function AllyEnemyQuickPeek({
  character,
  visible,
  anchorEl,
  onClose,
  onNavigate,
}: AllyEnemyQuickPeekProps) {
  const align = alignmentConfig[character.alignment];
  const tier = tierConfig[character.powerTier] || tierConfig.normal;
  const pos = getPopupPosition(anchorEl);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, onClose]);

  const handleViewProfile = useCallback(() => {
    onNavigate(character.slug);
  }, [character.slug, onNavigate]);

  return (
    <AnimatePresence>
      {visible && anchorEl && (
        <>
          {/* Invisible backdrop to detect mouse leave */}
          <div
            className="fixed inset-0 z-[100]"
            style={{ pointerEvents: 'none' }}
            onMouseEnter={onClose}
          />
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.92, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[101] pointer-events-auto"
            style={{
              top: `${pos.top}px`,
              left: `${pos.left}px`,
              width: '240px',
            }}
          >
            <div
              className="rounded-lg overflow-hidden border shadow-2xl"
              style={{
                background: 'rgba(18, 18, 18, 0.96)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderColor: character.haloColor + '25',
                boxShadow: `0 0 20px ${character.haloColor}10, 0 12px 40px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Top accent line */}
              <div
                className="h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${character.haloColor}60, transparent)`,
                }}
              />

              <div className="flex items-center gap-3 p-3 pb-2">
                {/* Character image - 40x40 */}
                <div
                  className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border"
                  style={{ borderColor: character.haloColor + '30' }}
                >
                  <Image
                    src={character.images.switcher}
                    alt={character.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name */}
                  <h4 className="text-white text-sm font-bold leading-tight truncate">
                    {character.name}
                  </h4>

                  {/* Alignment badge + Power tier */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`${align.bg} ${align.text} text-[8px] font-semibold uppercase tracking-wider px-1.5 py-[1px] rounded-full leading-none`}
                    >
                      {align.label}
                    </span>
                    <span
                      className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-[1px] rounded-full leading-none"
                      style={{
                        color: tier.color,
                        backgroundColor: tier.color + '12',
                        border: `1px solid ${tier.color}25`,
                      }}
                    >
                      {tier.icon} {tier.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Profile link */}
              <div className="px-3 pb-3">
                <button
                  onClick={handleViewProfile}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] btn-press"
                  style={{
                    color: character.haloColor,
                    backgroundColor: character.haloColor + '08',
                    border: `1px solid ${character.haloColor}20`,
                  }}
                >
                  View Profile
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
