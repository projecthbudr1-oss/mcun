'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Skull, Swords, Minus, ArrowRight } from 'lucide-react';
import type { MCUCharacter } from '@/data/characters';

interface CharacterQuickPeekProps {
  character: MCUCharacter;
  visible: boolean;
  anchorRect: DOMRect | null;
  onClose: () => void;
  onViewFull: () => void;
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

const STAT_KEYS: { key: keyof MCUCharacter['stats']; label: string }[] = [
  { key: 'intelligence', label: 'INT' },
  { key: 'strength', label: 'STR' },
  { key: 'speed', label: 'SPD' },
  { key: 'durability', label: 'DUR' },
  { key: 'energyProjection', label: 'EP' },
  { key: 'fightingSkills', label: 'FSK' },
];

function getPosition(anchorRect: DOMRect | null) {
  if (!anchorRect) return { top: 0, left: 0, origin: 'left' as const };

  const cardCenterX = anchorRect.left + anchorRect.width / 2;
  const cardCenterY = anchorRect.top + anchorRect.height / 2;
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;

  const peekW = 320;
  const peekH = 340;

  // Determine if card is on the right side
  const onRight = cardCenterX > viewW / 2;
  const origin: 'left' | 'right' = onRight ? 'right' : 'left';

  // Position near the card vertically
  let top = cardCenterY - peekH / 2;
  top = Math.max(80, Math.min(top, viewH - peekH - 20));

  let left: number;
  if (onRight) {
    left = anchorRect.left - peekW - 12;
    if (left < 12) left = 12;
  } else {
    left = anchorRect.right + 12;
    if (left + peekW > viewW - 12) left = viewW - peekW - 12;
  }

  return { top, left, origin };
}

export default function CharacterQuickPeek({
  character,
  visible,
  anchorRect,
  onClose,
  onViewFull,
}: CharacterQuickPeekProps) {
  const align = alignmentConfig[character.alignment];
  const tier = tierConfig[character.powerTier] || tierConfig.normal;
  const containerRef = useRef<HTMLDivElement>(null);

  // Get top 3 stats
  const topStats = STAT_KEYS
    .map(({ key, label }) => ({ key, label, value: character.stats[key] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const pos = getPosition(anchorRect);
  const firstApp = character.appearances[0];

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && anchorRect && (
        <>
          {/* Invisible backdrop to detect mouse leave */}
          <div
            className="fixed inset-0 z-[100]"
            style={{ pointerEvents: 'none' }}
            onMouseEnter={onClose}
          />
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[101] pointer-events-auto"
            style={{
              top: `${pos.top}px`,
              left: `${pos.left}px`,
              width: '320px',
            }}
          >
            <div
              className="rounded-xl overflow-hidden border shadow-2xl"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderColor: character.haloColor + '30',
                boxShadow: `0 0 30px ${character.haloColor}15, 0 20px 60px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Top accent line */}
              <div
                className="h-0.5"
                style={{
                  background: `linear-gradient(90deg, transparent, ${character.haloColor}, transparent)`,
                }}
              />

              {/* Character header */}
              <div className="flex items-start gap-3 p-4 pb-3">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border"
                  style={{ borderColor: character.haloColor + '40' }}>
                  <Image
                    src={character.images.switcher}
                    alt={character.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-bold leading-tight truncate">{character.name}</h4>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs mt-0.5">{character.actorName}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`${align.bg} ${align.text} text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full`}>
                      {align.label}
                    </span>
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{
                        color: tier.color,
                        backgroundColor: tier.color + '15',
                        border: `1px solid ${tier.color}30`,
                      }}
                    >
                      {tier.icon} {tier.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top 3 Stats */}
              <div className="px-4 pb-3">
                <div className="space-y-1.5">
                  {topStats.map((stat) => (
                    <div key={stat.key} className="flex items-center gap-2">
                      <span className="text-[10px] text-[rgba(255,255,255,0.35)] w-7 font-semibold">{stat.label}</span>
                      <div className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: character.haloColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <span className="text-[10px] text-white font-bold w-5 text-right">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* First appearance */}
              {firstApp && (
                <div className="px-4 pb-3">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-[rgba(255,255,255,0.25)]">Debut:</span>
                    <span className="text-[rgba(255,255,255,0.5)] font-medium">{firstApp.movie}</span>
                    <span className="text-[rgba(255,255,255,0.2)]">({firstApp.year})</span>
                  </div>
                </div>
              )}

              {/* Tagline */}
              <div className="px-4 pb-4">
                <p className="text-[rgba(255,255,255,0.3)] text-[11px] italic leading-snug">&ldquo;{character.tagline}&rdquo;</p>
              </div>

              {/* View Full Profile button */}
              <div
                className="px-4 pb-4 pt-1 border-t border-[rgba(255,255,255,0.06)]"
              >
                <button
                  onClick={onViewFull}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] btn-press"
                  style={{
                    color: character.haloColor,
                    backgroundColor: character.haloColor + '10',
                    border: `1px solid ${character.haloColor}25`,
                  }}
                >
                  View Full Profile
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
