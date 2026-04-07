'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Swords, Compass, Brain, Heart, Flame, Crown, Globe, Map, Star, Lightbulb } from 'lucide-react';
import { type AchievementDefinition, RARITY_CONFIG } from '@/data/achievements';

const ICON_MAP: Record<string, React.ElementType> = {
  Swords,
  Compass,
  Brain,
  Heart,
  Flame,
  Crown,
  Globe,
  Map,
  Star,
  Lightbulb,
  Trophy,
};

interface AchievementToastItem {
  id: string;
  achievement: AchievementDefinition;
  timestamp: number;
}

const TOAST_DURATION = 4000;

function AchievementToastCard({ item, onDismiss }: { item: AchievementToastItem; onDismiss: () => void }) {
  const IconComponent = ICON_MAP[item.achievement.icon] || Trophy;
  const rarity = RARITY_CONFIG[item.achievement.rarity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onDismiss}
      className="relative cursor-pointer overflow-hidden rounded-xl border p-4 shadow-2xl min-w-[300px] max-w-[380px]"
      style={{
        background: 'linear-gradient(135deg, #1A1A1A 0%, #141414 100%)',
        borderColor: rarity.color + '40',
        boxShadow: `0 0 30px ${rarity.glow}, 0 10px 40px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Shimmer sweep effect */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          background: `linear-gradient(120deg, transparent 30%, ${rarity.color}15 45%, ${rarity.color}20 50%, ${rarity.color}15 55%, transparent 70%)`,
          animation: 'shimmer-sweep 3s ease-in-out infinite',
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${rarity.color}, transparent)`,
        }}
      />

      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: rarity.color + '15',
            border: `1px solid ${rarity.color}30`,
          }}
        >
          <IconComponent size={20} style={{ color: rarity.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                color: rarity.color,
                backgroundColor: rarity.color + '15',
                border: `1px solid ${rarity.color}25`,
              }}
            >
              {rarity.label}
            </span>
            <span className="text-[rgba(255,255,255,0.2)] text-[9px] uppercase tracking-wider">Achievement Unlocked!</span>
          </div>
          <h4 className="text-white text-sm font-bold leading-tight truncate">{item.achievement.title}</h4>
          <p className="text-[rgba(255,255,255,0.4)] text-xs mt-0.5 line-clamp-1">{item.achievement.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AchievementToastContainer() {
  const [toasts, setToasts] = useState<AchievementToastItem[]>([]);

  const handleAchievementUnlocked = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail as { achievements: AchievementDefinition[] };
    if (!detail?.achievements?.length) return;

    const newToasts: AchievementToastItem[] = detail.achievements.map((a) => ({
      id: `${a.id}-${Date.now()}`,
      achievement: a,
      timestamp: Date.now(),
    }));

    setToasts((prev) => [...prev, ...newToasts].slice(-3)); // Keep max 3 toasts

    // Auto-dismiss
    newToasts.forEach((t) => {
      setTimeout(() => {
        setToasts((prev) => prev.filter((p) => p.id !== t.id));
      }, TOAST_DURATION);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('achievement-unlocked', handleAchievementUnlocked);
    return () => window.removeEventListener('achievement-unlocked', handleAchievementUnlocked);
  }, [handleAchievementUnlocked]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="fixed bottom-20 right-6 z-[200] flex flex-col-reverse gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <AchievementToastCard item={toast} onDismiss={() => dismissToast(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
