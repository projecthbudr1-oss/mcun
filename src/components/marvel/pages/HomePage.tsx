'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Shield, Layers, Globe, Clock, X } from 'lucide-react';
import HeroSection from '@/components/marvel/HeroSection';
import CharacterCard from '@/components/marvel/CharacterCard';
import CharacterSpotlight from '@/components/marvel/CharacterSpotlight';
import MCUByTheNumbers from '@/components/marvel/MCUByTheNumbers';
import MCUFactTicker from '@/components/marvel/MCUFactTicker';
import ScrollReveal from '@/components/marvel/ScrollReveal';
import { characters, homeHeroCharacters, getCharacterBySlug } from '@/data/characters';
import { teams } from '@/data/teams';
import { universes } from '@/data/universes';
import { useAppStore } from '@/store/useAppStore';

// Stagger animation variants for card grids
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomePage() {
  const { navigate, heroCharacterIndex, setHeroCharacterIndex } = useAppStore();
  const [heroChars, setHeroChars] = useState(() =>
    homeHeroCharacters.map(slug => getCharacterBySlug(slug)).filter(Boolean) as NonNullable<ReturnType<typeof getCharacterBySlug>>[]
  );

  const exploreCharacter = (slug: string) => navigate({ type: 'character', slug });

  // Trending = first 10 characters
  const trending = characters.slice(0, 10);

  return (
    <div>
      {/* Hero */}
      <HeroSection
        characters={heroChars}
        activeIndex={heroCharacterIndex}
        onIndexChange={setHeroCharacterIndex}
        onExplore={exploreCharacter}
      />

      {/* "MOVING TO MARVEL STUDIOS" Style Marquee Ticker */}
      <MarvelStudiosMarquee />

      {/* Scroll to Explore Indicator */}
      <ScrollExploreIndicator />

      {/* Character Spotlight */}
      <ScrollReveal direction="up">
        <div className="breathe-glow rounded-2xl">
          <CharacterSpotlight />
        </div>
      </ScrollReveal>

      {/* Recently Viewed Characters */}
      <RecentlyViewedSection />

      {/* Section Separator */}
      <SectionSeparator />

      {/* MCU By The Numbers */}
      <div id="mcu-by-the-numbers">
        <MCUByTheNumbers />
      </div>

      {/* Universe at a Glance — Stats Overview Bar */}
      <section className="py-16 px-4 lg:px-8 max-w-[1440px] mx-auto">
        <ScrollReveal direction="up">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, number: `${characters.length}`, label: 'Characters' },
              { icon: Shield, number: `${teams.length}`, label: 'Teams' },
              { icon: Layers, number: '6', label: 'Phases' },
              { icon: Globe, number: '∞', label: 'Multiverse' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card-enhanced p-5 flex items-center gap-4 cursor-default group"
              >
                <div className="w-11 h-11 rounded-lg bg-[rgba(237,29,36,0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(237,29,36,0.15)] transition-colors duration-300">
                  <stat.icon size={20} className="text-[#ED1D24]" />
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text-hero">{stat.number}</div>
                  <div className="text-[rgba(255,255,255,0.35)] text-xs uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Section Separator */}
      <SectionSeparator />

      {/* Trending Characters */}
      <section className="py-24 px-4 lg:px-8 max-w-[1440px] mx-auto">
        <ScrollReveal direction="up">
          <div className="section-title-accent">
            <h2 className="font-[var(--font-oswald)] text-white text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-2 shimmer-text">Trending Characters</h2>
          </div>
            <p className="text-[rgba(255,255,255,0.4)] text-sm mb-8 ml-4">Explore the most iconic heroes and villains of the MCU</p>

          {/* Mobile: horizontal scroll, Desktop: 5-column grid with stagger */}
          <motion.div
            className="flex lg:grid lg:grid-cols-5 gap-5 overflow-x-auto scrollbar-hide pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {trending.map((char) => (
              <motion.div
                key={char.slug}
                className="flex-shrink-0 w-[200px] lg:w-auto"
                variants={staggerItem}
              >
                <CharacterCard character={char} onClick={() => exploreCharacter(char.slug)} />
              </motion.div>
            ))}
          </motion.div>
        </ScrollReveal>
      </section>

      {/* Section Separator */}
      <SectionSeparator />

      {/* Explore by Team */}
      <section className="py-24 px-4 lg:px-8 max-w-[1440px] mx-auto">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="section-title-accent">
            <h2 className="font-[var(--font-oswald)] text-white text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-2 shimmer-text">Explore by Team</h2>
          </div>
          <p className="text-[rgba(255,255,255,0.4)] text-sm mb-8 ml-4">Discover the alliances that shaped the MCU</p>

          <TeamsParallaxGrid navigate={navigate} />
        </ScrollReveal>
      </section>

      {/* Section Separator */}
      <SectionSeparator />

      {/* The Multiverse */}
      <section className="py-24 px-4 lg:px-8 max-w-[1440px] mx-auto">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="section-title-accent">
            <h2 className="font-[var(--font-oswald)] text-white text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-2 shimmer-text">The Multiverse</h2>
          </div>
          <p className="text-[rgba(255,255,255,0.4)] text-sm mb-10 ml-4">Explore the infinite realities of the Marvel Cinematic Multiverse</p>

          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            {universes.map((universe, i) => (
              <motion.button
                key={universe.id}
                onClick={() => navigate({ type: 'universe', slug: universe.slug })}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Glowing circle */}
                <div
                  className={`w-24 h-24 lg:w-36 lg:h-36 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${
                    universe.isPrimary ? 'w-32 h-32 lg:w-44 lg:h-44' : ''
                  }`}
                  style={{
                    borderColor: `${universe.haloColor}40`,
                    background: `radial-gradient(circle, ${universe.haloColor}15 0%, transparent 70%)`,
                    boxShadow: `0 0 40px ${universe.haloColor}15, inset 0 0 30px ${universe.haloColor}08`,
                  }}
                >
                  <div className="text-center px-2">
                    <p className={`font-[var(--font-oswald)] text-white font-bold uppercase ${universe.isPrimary ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'}`}>
                      {universe.name.split(' ')[0]}
                    </p>
                    {!universe.isPrimary && (
                      <p className="text-[rgba(255,255,255,0.35)] text-[10px] mt-0.5">
                        {universe.characterCount} chars
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Section Separator */}
      <SectionSeparator />

      {/* Did You Know? MCU Facts Ticker */}
      <MCUFactTicker />
    </div>
  );
}

// Recently Viewed Characters Section
function RecentlyViewedSection() {
  const { navigate } = useAppStore();
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Read from sessionStorage on mount and when a character is viewed
  useEffect(() => {
    const readRecent = () => {
      try {
        const stored = sessionStorage.getItem('marvel-recently-viewed');
        if (stored) {
          const parsed: string[] = JSON.parse(stored);
          setRecentSlugs(parsed);
        }
      } catch { /* ignore */ }
    };

    readRecent();

    // Listen for character-viewed events (dispatched by store navigate)
    const handler = () => readRecent();
    window.addEventListener('character-viewed', handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('character-viewed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const recentCharacters = recentSlugs
    .map((slug) => getCharacterBySlug(slug))
    .filter(Boolean);

  const handleClear = useCallback(() => {
    sessionStorage.removeItem('marvel-recently-viewed');
    setRecentSlugs([]);
    setForceUpdate((v) => v + 1);
  }, []);

  if (recentCharacters.length < 2) return null;

  return (
    <section className="py-16 px-4 lg:px-8 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[rgba(255,255,255,0.4)]" />
          <h2 className="font-[var(--font-oswald)] text-white text-lg lg:text-xl font-bold uppercase tracking-wide">
            Recently Viewed
          </h2>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold text-[rgba(255,255,255,0.3)] border border-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.6)] hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 btn-press"
        >
          <X size={10} />
          Clear History
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
        {recentCharacters.map((char, i) => (
          <motion.button
            key={`${char.slug}-${forceUpdate}`}
            onClick={() => navigate({ type: 'character', slug: char.slug })}
            className="flex-shrink-0 flex items-center gap-3 p-3 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#141414] hover:border-[rgba(255,255,255,0.12)] hover:bg-[#1A1A1A] transition-all duration-300 min-w-[200px] max-w-[260px] group btn-press text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ y: -2 }}
          >
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src={char.images.switcher}
                alt={char.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate group-hover:text-white transition-colors">{char.name}</p>
              <p className="text-[rgba(255,255,255,0.3)] text-[11px] truncate">{char.tagline}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

// Scroll-to-explore bouncing indicator below hero
function ScrollExploreIndicator() {
  return (
    <div className="flex justify-center py-8">
      <button
        onClick={() => {
          document.getElementById('mcu-by-the-numbers')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="flex flex-col items-center gap-2 group cursor-pointer"
        aria-label="Scroll to explore"
      >
        <span className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-[0.2em] font-medium group-hover:text-[rgba(255,255,255,0.5)] transition-colors duration-300">
          Scroll to Explore
        </span>
        <div className="scroll-explore-indicator">
          <ChevronDown size={20} className="text-[rgba(255,255,255,0.25)] group-hover:text-[#ED1D24] transition-colors duration-300" />
        </div>
      </button>
    </div>
  );
}

// Section separator with fade-in on scroll
function SectionSeparator() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="section-divider-cinematic transition-opacity duration-1000 px-4 lg:px-8"
      style={{ opacity: visible ? 1 : 0 }}
    />
  );
}

// "MOVING TO MARVEL STUDIOS" style marquee ticker
const MARQUEE_TEXTS = [
  'IRON MAN', 'CAPTAIN AMERICA', 'THOR', 'BLACK PANTHER', 'SPIDER-MAN',
  'DOCTOR STRANGE', 'SCARLET WITCH', 'BLACK WIDOW', 'HULK', 'LOKI',
  'DEADPOOL', 'WOLVERINE', 'THANOS', 'GAMORA', 'STAR-LORD',
  'ANT-MAN', 'WASP', 'VISION', 'FALCON', 'SHANG-CHI',
];

function MarvelStudiosMarquee() {
  return (
    <div className="w-full overflow-hidden py-4 border-y border-[rgba(255,255,255,0.04)]">
      <div className="marquee-track whitespace-nowrap">
        {[...MARQUEE_TEXTS, ...MARQUEE_TEXTS].map((text, i) => (
          <span key={i} className="mx-8 text-[11px] font-[var(--font-oswald)] uppercase tracking-[0.25em] text-[rgba(255,255,255,0.12)] font-bold flex-shrink-0">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// Teams parallax grid with scroll-based vertical movement
function TeamsParallaxGrid({ navigate }: { navigate: (page: { type: string; slug: string }) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewH = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (rect.height + viewH)));
    setOffset((progress - 0.5) * -20); // -10px to +10px parallax
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div ref={sectionRef} style={{ transform: `translateY(${offset}px)` }} className="will-change-transform">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {teams.map((team) => (
          <motion.button
            key={team.id}
            onClick={() => navigate({ type: 'team', slug: team.slug })}
            className="relative group overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] text-left transition-all duration-300 hover:translate-y-[-6px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] btn-press"
            variants={staggerItem}
          >
            {/* Gradient bg */}
            <div
              className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500"
              style={{ background: `linear-gradient(135deg, ${team.haloColor}30 0%, ${team.haloColor}10 50%, transparent 60%)` }}
            />
            {/* Hover glow line at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${team.haloColor}60, transparent)` }}
            />
            <div className="relative p-6 lg:p-8">
              <h3 className="font-[var(--font-oswald)] text-white text-xl lg:text-2xl font-bold uppercase mb-1">
                {team.name}
              </h3>
              <p className="text-[rgba(255,255,255,0.4)] text-sm mb-3">{team.tagline}</p>
              <p className="text-[rgba(255,255,255,0.25)] text-xs">{team.members.length} members · Founded {team.foundedIn}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
