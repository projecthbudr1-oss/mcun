'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { characters, type MCUCharacter } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';

// Deterministic daily character selection
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getSpotlightCharacters(): MCUCharacter[] {
  // Pick 5 characters for rotation starting from today's day
  const dayOfYear = getDayOfYear();
  const count = Math.min(5, characters.length);
  const chars: MCUCharacter[] = [];
  for (let i = 0; i < count; i++) {
    const idx = (dayOfYear + i) % characters.length;
    chars.push(characters[idx]);
  }
  return chars;
}

const AUTO_ROTATE_INTERVAL = 15000;

export default function CharacterSpotlight() {
  const { navigate } = useAppStore();
  const spotlightChars = useMemo(() => getSpotlightCharacters(), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const activeChar = spotlightChars[activeIndex];

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setActiveIndex(index);
  }, []);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % spotlightChars.length, 1);
  }, [activeIndex, goTo, spotlightChars.length]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + spotlightChars.length) % spotlightChars.length, -1);
  }, [activeIndex, goTo, spotlightChars.length]);

  // Auto-rotate every 15 seconds
  useEffect(() => {
    const timer = setInterval(goNext, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [goNext]);

  if (!activeChar) return null;

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 80 : -80,
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -80 : 80,
      scale: 0.98,
    }),
  };

  return (
    <section className="relative py-20 px-4 lg:px-8 max-w-[1440px] mx-auto overflow-hidden">
      {/* Section Label */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={16} className="text-[#ED1D24]" />
        <h2 className="font-[var(--font-oswald)] text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-[0.2em] font-bold">
          Character Spotlight
        </h2>
      </div>

      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#0D0D0D] min-h-[320px] lg:min-h-[400px]">
        {/* Background gradient halo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${activeChar.slug}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 70% 50%, ${activeChar.haloColor}12 0%, transparent 60%)`,
            }}
          />
        </AnimatePresence>

        {/* Character content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
          {/* Image */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`img-${activeChar.slug}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-48 h-64 lg:w-56 lg:h-72 flex-shrink-0 rounded-xl overflow-hidden"
            >
              <Image
                src={activeChar.images.hero}
                alt={activeChar.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 192px, 224px"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${activeChar.haloColor}08, transparent 50%, ${activeChar.haloColor}10)`,
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Text content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`text-${activeChar.slug}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="flex-1 text-center lg:text-left"
            >
              {/* Power tier */}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
                style={{
                  color: activeChar.haloColor,
                  backgroundColor: activeChar.haloColor + '12',
                  border: `1px solid ${activeChar.haloColor}30`,
                }}
              >
                {activeChar.alignment === 'hero' ? '★' : activeChar.alignment === 'villain' ? '✦' : '◆'}
                {activeChar.alignment}
              </span>

              <h3 className="font-[var(--font-oswald)] text-white text-3xl lg:text-5xl font-bold uppercase tracking-wide mb-2">
                {activeChar.name}
              </h3>

              <p className="text-[rgba(255,255,255,0.5)] text-sm lg:text-base mb-4 max-w-lg">
                {activeChar.tagline}
              </p>

              {/* Quote */}
              {activeChar.quote && (
                <p className="text-[rgba(255,255,255,0.6)] text-sm lg:text-base italic mb-6 max-w-xl leading-relaxed">
                  &ldquo;{activeChar.quote}&rdquo;
                  {activeChar.quoteSource && (
                    <span className="block mt-1 text-[10px] uppercase tracking-wider text-[rgba(255,255,255,0.3)] not-italic">
                      — {activeChar.quoteSource}
                    </span>
                  )}
                </p>
              )}

              {/* CTA */}
              <button
                onClick={() => navigate({ type: 'character', slug: activeChar.slug })}
                className="cta-button text-xs btn-press inline-flex items-center gap-2"
                style={{ borderColor: activeChar.haloColor + '60' }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = activeChar.haloColor;
                  (e.target as HTMLElement).style.borderColor = activeChar.haloColor;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'transparent';
                  (e.target as HTMLElement).style.borderColor = activeChar.haloColor + '60';
                }}
              >
                Discover
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[rgba(0,0,0,0.4)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(0,0,0,0.6)] transition-all btn-press"
          aria-label="Previous character"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[rgba(0,0,0,0.4)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(0,0,0,0.6)] transition-all btn-press"
          aria-label="Next character"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {spotlightChars.map((char, i) => (
          <button
            key={char.slug}
            onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
            className={`transition-all duration-300 btn-press rounded-full ${
              i === activeIndex
                ? 'w-8 h-2.5'
                : 'w-2.5 h-2.5 opacity-40 hover:opacity-70'
            }`}
            style={{
              backgroundColor: i === activeIndex ? char.haloColor : 'rgba(255,255,255,0.5)',
            }}
            aria-label={`Show ${char.name}`}
          />
        ))}
      </div>
    </section>
  );
}
