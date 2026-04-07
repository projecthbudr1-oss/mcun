'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, Skull, Swords, Minus, Heart } from 'lucide-react';
import type { MCUCharacter } from '@/data/characters';
import CharacterQuickPeek from '@/components/marvel/CharacterQuickPeek';

interface CharacterCardProps {
  character: MCUCharacter;
  onClick: () => void;
}

const alignmentConfig = {
  hero: { label: 'Hero', bg: 'bg-green-500/20', text: 'text-green-400', icon: Shield },
  villain: { label: 'Villain', bg: 'bg-red-500/20', text: 'text-red-400', icon: Skull },
  'anti-hero': { label: 'Anti-Hero', bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Swords },
  neutral: { label: 'Neutral', bg: 'bg-gray-500/20', text: 'text-gray-400', icon: Minus },
};

const tierIcons: Record<string, string> = {
  cosmic: '🌟',
  omega: '💎',
  alpha: '⚡',
  beta: '🔰',
  gamma: '✦',
  normal: '○',
};

const STAT_LABELS: { key: keyof MCUCharacter['stats']; label: string }[] = [
  { key: 'intelligence', label: 'INT' },
  { key: 'strength', label: 'STR' },
  { key: 'speed', label: 'SPD' },
  { key: 'durability', label: 'DUR' },
  { key: 'energyProjection', label: 'EP' },
  { key: 'fightingSkills', label: 'FSK' },
];

// Manage favorites in localStorage
function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('marvel-favorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function notifyFavoritesChanged() {
  window.dispatchEvent(new Event('favorites-changed'));
}

const HOVER_DELAY = 500;

export default function CharacterCard({ character, onClick }: CharacterCardProps) {
  const align = alignmentConfig[character.alignment];
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const isFavorite = mounted ? favorites.includes(character.slug) : false;

  // Quick Peek state
  const [peekVisible, setPeekVisible] = useState(false);
  const [peekAnchorRect, setPeekAnchorRect] = useState<DOMRect | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync favorites from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: syncing from localStorage after mount
    setFavorites(getFavorites());
    setMounted(true);
  }, []);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowTrailRef = useRef<HTMLDivElement>(null);

  const toggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const currentFavs = getFavorites();
    const alreadyFav = currentFavs.includes(character.slug);
    const updated = alreadyFav
      ? currentFavs.filter((s) => s !== character.slug)
      : [...currentFavs, character.slug];
    setFavorites(updated);
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 400);
    try {
      localStorage.setItem('marvel-favorites', JSON.stringify(updated));
    } catch {
      // Silently fail if localStorage is unavailable
    }
    notifyFavoritesChanged();
  }, [character.slug]);

  // Get top 3 stats for quick stats tooltip
  const topStats = useMemo(() => {
    return Object.entries(character.stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key, value]) => {
        const label = STAT_LABELS.find(s => s.key === key)?.label || key;
        return { label, value };
      });
  }, [character.stats]);

  // 3D tilt effect + glow trail on hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.03)`;

    // Set CSS variables for card-spotlight effect
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Update glow trail position — larger, smoother gradient
    const trail = glowTrailRef.current;
    if (trail) {
      trail.style.background = `radial-gradient(250px circle at ${x}px ${y}px, ${character.haloColor}18, ${character.haloColor}08 40%, transparent 70%)`;
    }
  }, [character.haloColor]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  }, []);

  // Quick Peek: desktop hover (500ms delay)
  const handleMouseEnter = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        setPeekAnchorRect(wrapper.getBoundingClientRect());
        setPeekVisible(true);
      }
    }, HOVER_DELAY);
  }, []);

  const handleMouseLeaveWrapper = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setPeekVisible(false);
  }, []);

  // Quick Peek: mobile long-press (500ms hold)
  const handleTouchStart = useCallback(() => {
    isLongPressRef.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      const wrapper = wrapperRef.current;
      if (wrapper) {
        setPeekAnchorRect(wrapper.getBoundingClientRect());
        setPeekVisible(true);
      }
    }, HOVER_DELAY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      setPeekVisible(false);
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const closePeek = useCallback(() => setPeekVisible(false), []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeaveWrapper}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <div
        ref={cardRef}
        className="character-card glass-card-enhanced card-spotlight group hover-lift"
        style={{ transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease' }}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Quick Stats Tooltip — Enhanced */}
        <div className="quick-stats-tooltip-enhanced">
          <div
            className="bg-[rgba(14,14,14,0.95)] backdrop-blur-xl border rounded-xl p-3.5 shadow-2xl"
            style={{ borderColor: character.haloColor + '25' }}
          >
            <div className="tooltip-arrow" />
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: character.haloColor }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: character.haloColor }} />
              Top Stats
            </p>
            <div className="space-y-2">
              {topStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold w-7" style={{ color: character.haloColor + 'AA' }}>{stat.label}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: character.haloColor + '15' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${stat.value}%`, backgroundColor: character.haloColor }}
                    />
                  </div>
                  <span className="text-[10px] text-white font-bold w-5 text-right">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover glow trail (radial gradient at cursor) */}
        <div ref={glowTrailRef} className="glow-trail" />

        {/* Gradient border glow on hover */}
        <div
          className="gradient-border-glow"
          style={{ '--card-glow-color': character.haloColor } as React.CSSProperties}
        />

        {/* Film-grain texture overlay on hover */}
        <div className="card-film-grain" />

        {/* Inner shadow for depth */}
        <div className="card-depth-shadow" />

        {/* Glow border on hover */}
        <div
          className="card-glow"
          style={{
            boxShadow: `inset 0 0 0 1px ${character.haloColor}50, 0 0 20px ${character.haloColor}20, 0 0 40px ${character.haloColor}10`,
            transition: 'box-shadow 0.4s ease',
          }}
        />

        {/* Favorite / Heart button with bounce animation */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 left-3 z-[15] w-8 h-8 rounded-full bg-[rgba(0,0,0,0.5)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[rgba(0,0,0,0.7)] btn-press"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            opacity: isFavorite ? 1 : 0,
            transform: isFavorite ? 'scale(1)' : 'scale(0.8)',
          }}
          onMouseEnter={(e) => {
            if (!isFavorite) {
              (e.currentTarget as HTMLElement).style.opacity = '1';
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isFavorite) {
              (e.currentTarget as HTMLElement).style.opacity = '0';
              (e.currentTarget as HTMLElement).style.transform = 'scale(0.8)';
            }
          }}
        >
          <Heart
            size={14}
            className={`${isFavorite ? 'text-red-500 fill-red-500' : 'text-white/70'} ${heartAnimating ? 'heart-bounce' : ''}`}
          />
        </button>

        {/* Image */}
        <div className="relative w-full h-full">
          <Image
            src={character.images.card}
            alt={character.name}
            fill
            className="card-image object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Power tier icon */}
          <div className="absolute top-3 right-3 z-[2] text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {tierIcons[character.powerTier] || '○'}
          </div>

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)',
            }}
          />

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 z-[2] p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm lg:text-base leading-tight mb-0.5">
                  {character.name}
                </h3>
                <p className="text-[rgba(255,255,255,0.35)] text-xs">
                  {character.actorName}
                </p>
              </div>
              <span className={`${align.bg} ${align.text} text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0`}>
                {align.label}
              </span>
            </div>

            {/* Quick Stats Bar — visible on hover only */}
            <div className="mt-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {topStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-1 flex-1 min-w-0">
                  <span className="text-[8px] font-bold w-5 flex-shrink-0" style={{ color: character.haloColor + 'BB' }}>
                    {stat.label}
                  </span>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: character.haloColor + '18' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${stat.value}%`, backgroundColor: character.haloColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Character Quick Peek Modal */}
      <CharacterQuickPeek
        character={character}
        visible={peekVisible}
        anchorRect={peekAnchorRect}
        onClose={closePeek}
        onViewFull={onClick}
      />
    </div>
  );
}
