'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Trophy, Users, Sparkles, Shield, Star, Swords, Crown } from 'lucide-react';
import { characters, type MCUCharacter } from '@/data/characters';
import { teams } from '@/data/teams';
import { useAppStore } from '@/store/useAppStore';
import ScrollReveal from '@/components/marvel/ScrollReveal';

const STORAGE_KEY = 'mcu-collection';

function getCollectedSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveCollectedSlugs(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

function getCollectionTier(percentage: number): { label: string; color: string; icon: string } {
  if (percentage >= 100) return { label: 'Master', color: '#FFD54F', icon: '👑' };
  if (percentage >= 75) return { label: 'Expert', color: '#76FF03', icon: '⭐' };
  if (percentage >= 50) return { label: 'Fan', color: '#4FC3F7', icon: '🔥' };
  if (percentage >= 25) return { label: 'Novice', color: '#FF6D00', icon: '🔰' };
  return { label: 'Beginner', color: '#9E9E9E', icon: '○' };
}

const ACHIEVEMENTS = [
  { id: 'first', title: 'First Collection', desc: 'Collect your first character', icon: '🌟', check: (collected: number) => collected >= 1 },
  { id: 'team-player', title: 'Team Player', desc: 'Collect all members of any team', icon: '👥', check: (_c: number, chars: string[], allChars: MCUCharacter[]) => {
    for (const team of teams) {
      if (team.members.length === 0) continue;
      const teamInRoster = team.members.filter(m => allChars.some(c => c.slug === m));
      if (teamInRoster.length > 0 && teamInRoster.every(m => chars.includes(m))) return true;
    }
    return false;
  }},
  { id: 'cosmic', title: 'Cosmic Power', desc: 'Collect all cosmic-tier characters', icon: '💎', check: (_c: number, chars: string[], allChars: MCUCharacter[]) => {
    const cosmicSlugs = allChars.filter(c => c.powerTier === 'cosmic').map(c => c.slug);
    return cosmicSlugs.length > 0 && cosmicSlugs.every(s => chars.includes(s));
  }},
  { id: 'half', title: 'Halfway There', desc: 'Collect 50% of all characters', icon: '🎯', check: (collected: number, _c: string[], _a: MCUCharacter[]) => collected >= Math.ceil(_a.length / 2) },
  { id: 'completionist', title: 'Completionist', desc: 'Collect ALL characters', icon: '🏆', check: (collected: number, _c: string[], allChars: MCUCharacter[]) => collected >= allChars.length },
];

// Count-up hook
function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    let startTime: number;
    let frame: number;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return count;
}

// Progress Ring Component
function ProgressRing({ percentage, size = 160, strokeWidth = 10 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const tier = getCollectionTier(percentage);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="collection-progress-ring progress-ring-animated" style={{ '--ring-color': tier.color } as React.CSSProperties}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tier.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold count-up" style={{ color: tier.color }}>
          {percentage}%
        </span>
        <span className="text-[10px] text-[rgba(255,255,255,0.35)] uppercase tracking-wider">Complete</span>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  const { navigate, showToast } = useAppStore();
  const [collected, setCollected] = useState<string[]>(() => getCollectedSlugs());

  // Listen for character-viewed events
  useEffect(() => {
    const handleViewed = (e: Event) => {
      const detail = (e as CustomEvent).detail as { slug: string };
      if (detail?.slug && !collected.includes(detail.slug)) {
        setCollected(prev => {
          const next = [...prev, detail.slug];
          saveCollectedSlugs(next);
          return next;
        });
      }
    };
    window.addEventListener('character-viewed', handleViewed);
    return () => window.removeEventListener('character-viewed', handleViewed);
  }, [collected]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorage = () => {
      setCollected(getCollectedSlugs());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const totalCharacters = characters.length;
  const collectedCount = collected.length;
  const percentage = totalCharacters > 0 ? Math.round((collectedCount / totalCharacters) * 100) : 0;
  const tier = getCollectionTier(percentage);
  const animatedCount = useCountUp(collectedCount);

  // Stats
  const statsByAlignment = useMemo(() => {
    const alignments = ['hero', 'villain', 'anti-hero', 'neutral'] as const;
    return alignments.map(a => {
      const total = characters.filter(c => c.alignment === a).length;
      const coll = characters.filter(c => c.alignment === a && collected.includes(c.slug)).length;
      return { alignment: a, total, collected: coll };
    });
  }, [collected]);

  const statsByTier = useMemo(() => {
    const tiers = ['cosmic', 'omega', 'alpha', 'beta', 'gamma', 'normal'] as const;
    return tiers.map(t => {
      const total = characters.filter(c => c.powerTier === t).length;
      const coll = characters.filter(c => c.powerTier === t && collected.includes(c.slug)).length;
      return { tier: t, total, collected: coll };
    });
  }, [collected]);

  const statsByTeam = useMemo(() => {
    return teams.filter(t => t.members.length > 0).map(t => {
      const inRoster = t.members.filter(m => characters.some(c => c.slug === m));
      const coll = inRoster.filter(s => collected.includes(s));
      return { name: t.name, haloColor: t.haloColor, total: inRoster.length, collected: coll.length, slugs: inRoster };
    });
  }, [collected]);

  // Achievements
  const achievements = useMemo(() => {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: a.check(collectedCount, collected, characters),
    }));
  }, [collected, collectedCount]);

  // Sorted characters: collected first, then uncollected
  const sortedCharacters = useMemo(() => {
    return [...characters].sort((a, b) => {
      const aCollected = collected.includes(a.slug) ? 0 : 1;
      const bCollected = collected.includes(b.slug) ? 0 : 1;
      return aCollected - bCollected || a.name.localeCompare(b.name);
    });
  }, [collected]);

  const handleCardClick = useCallback((char: MCUCharacter) => {
    if (collected.includes(char.slug)) {
      navigate({ type: 'character', slug: char.slug });
    } else {
      showToast(`View ${char.name}'s profile to collect them!`);
    }
  }, [collected, navigate, showToast]);

  return (
    <div className="pt-20 pb-24 px-4 lg:px-8 max-w-[1440px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="font-[var(--font-oswald)] text-white text-4xl lg:text-5xl font-bold uppercase tracking-wide mb-2 text-center">
          My Collection
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-sm text-center mb-10">
          View character profiles to expand your collection
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        className="flex flex-col items-center mb-12 p-8 bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <ProgressRing percentage={percentage} />
        <div className="mt-4 text-center">
          <span className="text-white text-xl font-bold count-up">{animatedCount}</span>
          <span className="text-[rgba(255,255,255,0.4)] text-sm"> / {totalCharacters} collected</span>
        </div>
        <div className="mt-3">
          <span className="collection-tier-badge" style={{ color: tier.color, borderColor: tier.color + '40', backgroundColor: tier.color + '12' }}>
            <span>{tier.icon}</span>
            {tier.label} Tier
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Collection Grid */}
        <div className="lg:col-span-2">
          <motion.h2
            className="font-[var(--font-oswald)] text-white text-xl font-bold uppercase mb-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Users size={18} className="text-[#ED1D24]" />
            Character Grid
          </motion.h2>
          <ScrollReveal direction="up" delay={0.15}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <AnimatePresence mode="popLayout">
              {sortedCharacters.map((char, i) => {
                const isCollected = collected.includes(char.slug);
                return (
                  <motion.button
                    key={char.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                    onClick={() => handleCardClick(char)}
                    className={`collection-card ${isCollected ? 'collection-card-collected' : 'collection-card-locked'} relative group btn-press`}
                  >
                    <div className="w-full h-full">
                      <Image
                        src={char.images.switcher}
                        alt={char.name}
                        width={100}
                        height={133}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Stamp */}
                    <div className={`collection-stamp ${isCollected ? 'collection-stamp-collected' : 'collection-stamp-locked'}`}>
                      {isCollected ? (
                        <Check size={8} className="inline mr-0.5" />
                      ) : null}
                      {isCollected ? 'COLLECTED' : 'LOCKED'}
                    </div>
                    {/* Checkmark badge */}
                    {isCollected && (
                      <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-[#76FF03] flex items-center justify-center collection-check-anim">
                        <Check size={10} className="text-black" />
                      </div>
                    )}
                    {/* Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-[8px] text-white font-medium truncate text-left leading-tight">{char.name}</p>
                    </div>
                    {/* Locked overlay on hover */}
                    {!isCollected && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[rgba(0,0,0,0.5)]">
                        <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center">
                          <Lock size={16} className="text-[rgba(255,255,255,0.5)]" />
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
          </ScrollReveal>
        </div>
        <div className="space-y-8">
          {/* Collection Stats */}
          <motion.div
            className="bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.06)] p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-[#FFD54F]" />
              Collection Stats
            </h3>

            {/* By Alignment */}
            <div className="space-y-3 mb-6">
              <p className="text-[rgba(255,255,255,0.35)] text-[10px] uppercase tracking-wider font-bold">By Alignment</p>
              {statsByAlignment.map(s => {
                const pct = s.total > 0 ? Math.round((s.collected / s.total) * 100) : 0;
                const colorMap: Record<string, string> = { hero: '#4CAF50', villain: '#F44336', 'anti-hero': '#FF9800', neutral: '#9E9E9E' };
                return (
                  <div key={s.alignment}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[rgba(255,255,255,0.5)] capitalize">{s.alignment}</span>
                      <span className="text-white font-bold count-up">{s.collected}/{s.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ background: colorMap[s.alignment] || '#9E9E9E' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* By Tier */}
            <div className="space-y-3 mb-6">
              <p className="text-[rgba(255,255,255,0.35)] text-[10px] uppercase tracking-wider font-bold">By Power Tier</p>
              {statsByTier.filter(s => s.total > 0).map(s => {
                const pct = s.total > 0 ? Math.round((s.collected / s.total) * 100) : 0;
                const colorMap: Record<string, string> = { cosmic: '#FFD54F', omega: '#7C4DFF', alpha: '#4FC3F7', beta: '#76FF03', gamma: '#FF6D00', normal: '#9E9E9E' };
                return (
                  <div key={s.tier}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[rgba(255,255,255,0.5)] capitalize">{s.tier}</span>
                      <span className="text-white font-bold count-up">{s.collected}/{s.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ background: colorMap[s.tier] || '#9E9E9E' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* By Team */}
            <div className="space-y-3">
              <p className="text-[rgba(255,255,255,0.35)] text-[10px] uppercase tracking-wider font-bold">By Team</p>
              {statsByTeam.map(t => {
                const pct = t.total > 0 ? Math.round((t.collected / t.total) * 100) : 0;
                return (
                  <div key={t.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[rgba(255,255,255,0.5)]">{t.name}</span>
                      <span className="text-white font-bold count-up">{t.collected}/{t.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ background: t.haloColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.06)] p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-[#FFD54F]" />
              Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className={`achievement-card flex items-center gap-3 ${a.unlocked ? 'achievement-unlocked' : 'achievement-locked'}`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: a.unlocked ? 'rgba(255,213,79,0.12)' : 'rgba(255,255,255,0.04)' }}>
                    {a.unlocked ? (
                      <Crown size={18} style={{ color: '#FFD54F' }} />
                    ) : (
                      <Lock size={14} className="text-[rgba(255,255,255,0.2)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-semibold truncate">{a.title}</p>
                    <p className="text-[rgba(255,255,255,0.35)] text-xs truncate">{a.desc}</p>
                  </div>
                  {a.unlocked && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[#FFD54F] text-xs"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
