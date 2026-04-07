'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { MCUCharacter } from '@/data/characters';
import TypewriterText from '@/components/marvel/TypewriterText';

interface HeroSectionProps {
  characters: MCUCharacter[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onExplore?: (slug: string) => void;
}

// Deterministic seeded PRNG to avoid hydration mismatch
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Generate CSS-only particle positions (deterministic)
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${seededRandom(i * 3 + 1) * 100}%`,
    top: `${seededRandom(i * 3 + 2) * 100}%`,
    delay: `${seededRandom(i * 3 + 3) * 8}s`,
    duration: `${6 + seededRandom(i * 3 + 4) * 8}s`,
    driftX: `${(seededRandom(i * 3 + 5) - 0.5) * 60}px`,
    driftY: `${(seededRandom(i * 3 + 6) - 0.5) * 60}px`,
    size: seededRandom(i * 3 + 7) > 0.7 ? 3 : 2,
    opacity: 0.1 + seededRandom(i * 3 + 8) * 0.3,
  }));
}

export default function HeroSection({ characters, activeIndex, onIndexChange, onExplore }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const character = characters[activeIndex];

  const particles = useMemo(() => generateParticles(30), []);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const splitName = (name: string) => name.split(' ').map((part, i, arr) =>
    i < arr.length - 1 ? <span key={i}>{part}<br /></span> : <span key={i}>{part}</span>
  );

  const stagger = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  });

  const handleSelect = useCallback((idx: number) => {
    onIndexChange(idx);
  }, [onIndexChange]);

  if (!character) return null;

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#0A0A0A] vignette">
      {/* Animated Hero Gradient Mesh Background — slowly shifting radial gradients */}
      <div className="hero-gradient-mesh" />
      {/* Character-adaptive Gradient Mesh */}
      <div
        className="gradient-mesh"
        style={{
          '--mesh-primary': `${character.haloColor}18`,
          '--mesh-secondary': `${character.haloColor}08`,
          '--mesh-tertiary': '#4527A008',
        } as React.CSSProperties}
      />

      {/* Morphing blob backgrounds — ambient atmosphere */}
      <div
        className="morphing-blob"
        style={{
          width: '45vw',
          height: '45vw',
          top: '10%',
          left: '-10%',
          background: `${character.haloColor}`,
          animationDelay: '0s',
        }}
      />
      <div
        className="morphing-blob"
        style={{
          width: '35vw',
          height: '35vw',
          bottom: '5%',
          right: '-5%',
          background: `${character.haloColor}60`,
          animationDelay: '-7s',
        }}
      />
      <div
        className="morphing-blob"
        style={{
          width: '25vw',
          height: '25vw',
          top: '40%',
          right: '20%',
          background: `${character.haloColor}40`,
          animationDelay: '-14s',
        }}
      />

      {/* Particle Field - CSS-only animated dots */}
      <div className="particle-field z-[0]">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle-dot"
            suppressHydrationWarning
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--delay': p.delay,
              '--duration': p.duration,
              '--drift-x': p.driftX,
              '--drift-y': p.driftY,
              opacity: p.opacity,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Halo */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full animate-halo-pulse pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${character.haloColor}22 0%, ${character.haloColor}08 40%, transparent 70%)`,
          transition: 'background 0.8s ease',
        }}
        {...stagger(0.2)}
      />

      {/* Giant Text */}
      <motion.div
        className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none"
        {...stagger(0.1)}
      >
        <h1 className="giant-hero-name text-white text-center">
          {splitName(character.name)}
        </h1>
      </motion.div>

      {/* Cast Bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-[4] pt-20 lg:pt-24 text-center"
        {...stagger(0)}
      >
        <p className="uppercase tracking-[0.2em] text-[rgba(255,255,255,0.5)] text-[clamp(0.6rem,1.2vw,0.85rem)] font-medium px-4">
          {character.castBar.join(' · ')}
        </p>
      </motion.div>

      {/* Character Image - with floating animation */}
      <motion.div
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 z-[2] h-[55vh] lg:h-[75vh] pointer-events-none float-animation"
        style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        {...stagger(0.3)}
      >
        <Image
          src={character.images.hero}
          alt={character.name}
          width={600}
          height={900}
          className="h-full w-auto object-contain drop-shadow-2xl"
          loading="eager"
          priority
        />
      </motion.div>

      {/* Synopsis Panel - Desktop */}
      <motion.div
        className="hidden md:block absolute bottom-[12vh] left-[5vw] z-[3] max-w-[420px]"
        initial={{ opacity: 0, x: -60 }}
        animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="synopsis-panel synopsis-panel-breathing"
          style={{ '--synopsis-accent': character.haloColor } as React.CSSProperties}
        >
          <h2
            className="font-bold text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.1] text-white mb-4"
            style={{ transition: 'color 0.5s' }}
          >
            <TypewriterText text={character.tagline} cursorColor={character.haloColor} />
          </h2>
          <p className="text-[rgba(255,255,255,0.6)] text-[clamp(0.85rem,1vw,1rem)] leading-[1.6] mb-6">
            {character.synopsis}
          </p>
          <button
            className="cta-button shimmer-sweep red-glow-pulse"
            style={{
              borderColor: character.haloColor + '80',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = character.haloColor;
              (e.currentTarget as HTMLElement).style.borderColor = character.haloColor;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = character.haloColor + '80';
            }}
            onClick={() => onExplore?.(character.slug)}
          >
            EXPLORE NOW →
          </button>
        </div>
      </motion.div>

      {/* Synopsis Panel - Mobile */}
      <motion.div
        className="md:hidden absolute bottom-[18vh] left-0 right-0 z-[3] px-6 text-center"
        {...stagger(0.5)}
      >
        <h2 className="font-bold text-[clamp(1.25rem,5vw,1.75rem)] leading-[1.1] text-white mb-2">
          <TypewriterText text={character.tagline} cursorColor={character.haloColor} />
        </h2>
        <p className="text-[rgba(255,255,255,0.5)] text-sm leading-[1.5] mb-4 line-clamp-2">
          {character.synopsis}
        </p>
        <button
          className="cta-button shimmer-sweep text-xs"
          onClick={() => onExplore?.(character.slug)}
        >
          EXPLORE →
        </button>
      </motion.div>

      {/* Character Switcher with connecting lines */}
      <motion.div
        className="absolute bottom-[3vh] md:bottom-[5vh] left-1/2 -translate-x-1/2 z-[3] flex flex-row gap-3 md:gap-3 overflow-x-auto px-4 scrollbar-hide max-w-[90vw] relative"
        {...stagger(0.7)}
      >
        {/* Connecting lines between active and neighbors */}
        {characters.map((char, idx) => {
          if (idx === activeIndex) {
            return (
              <span key={`conn-${char.slug}`}>
                {idx > 0 && (
                  <div
                    className="switcher-connector"
                    style={{
                      right: '100%',
                      width: '12px',
                      background: `linear-gradient(90deg, transparent, ${char.haloColor}40)`,
                    }}
                  />
                )}
                {idx < characters.length - 1 && (
                  <div
                    className="switcher-connector"
                    style={{
                      left: '100%',
                      width: '12px',
                      background: `linear-gradient(90deg, ${char.haloColor}40, transparent)`,
                    }}
                  />
                )}
              </span>
            );
          }
          return null;
        })}

        {characters.map((char, idx) => (
          <button
            key={char.slug}
            onClick={() => handleSelect(idx)}
            className="character-switcher-btn relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 transition-all duration-300 cursor-pointer z-[1]"
            aria-label={`View ${char.name}`}
            style={{
              borderColor: idx === activeIndex ? char.haloColor : 'transparent',
              opacity: idx === activeIndex ? 1 : 0.35,
              boxShadow: idx === activeIndex ? `0 0 20px ${char.haloColor}60, 0 0 40px ${char.haloColor}20` : 'none',
            }}
            onMouseEnter={(e) => {
              if (idx !== activeIndex) {
                (e.currentTarget as HTMLElement).style.opacity = '0.7';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (idx !== activeIndex) {
                (e.currentTarget as HTMLElement).style.opacity = '0.35';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }
            }}
          >
            <Image
              src={char.images.switcher}
              alt={char.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </button>
        ))}
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent z-[1] pointer-events-none" />
    </section>
  );
}
