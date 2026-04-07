'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Quote, ArrowUp, Eye, Zap, Clock, Film, Users, Globe } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCharacterBySlug, characters, type MCUCharacter } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';
import { trackAchievement } from '@/lib/achievements';
import QuotePlayer from '@/components/marvel/QuotePlayer';
import AllyEnemyQuickPeek from '@/components/marvel/AllyEnemyQuickPeek';
import ConnectionWeb, { getPhase } from '@/components/marvel/ConnectionWeb';
import ShareButton from '@/components/marvel/ShareButton';

gsap.registerPlugin(ScrollTrigger);

const STAT_LABELS: { key: keyof MCUCharacter['stats']; label: string }[] = [
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'strength', label: 'Strength' },
  { key: 'speed', label: 'Speed' },
  { key: 'durability', label: 'Durability' },
  { key: 'energyProjection', label: 'Energy Projection' },
  { key: 'fightingSkills', label: 'Fighting Skills' },
];

const TABS = ['Overview', 'Powers & Stats', 'History', 'Appearances', 'Allies & Enemies', 'Connections'] as const;

const TAB_ICONS = [Eye, Zap, Clock, Film, Users, Globe];

const tierConfig: Record<string, { label: string; color: string; icon: string }> = {
  cosmic: { label: 'Cosmic', color: '#FFD54F', icon: '🌟' },
  omega: { label: 'Omega', color: '#7C4DFF', icon: '💎' },
  alpha: { label: 'Alpha', color: '#4FC3F7', icon: '⚡' },
  beta: { label: 'Beta', color: '#76FF03', icon: '🔰' },
  gamma: { label: 'Gamma', color: '#FF6D00', icon: '✦' },
  normal: { label: 'Normal', color: '#9E9E9E', icon: '○' },
};

const PHASE_COLORS: Record<number, string> = {
  1: '#4FC3F7',
  2: '#FF6D00',
  3: '#76FF03',
  4: '#7C4DFF',
  5: '#ED1D24',
  6: '#FFD54F',
};

// Number counting animation hook
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!active || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number;
    let animFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [active, target, duration]);

  return count;
}

// SVG Radar Chart Component
function RadarChart({ stats, haloColor }: { stats: MCUCharacter['stats']; haloColor: string }) {
  const statKeys = Object.keys(stats) as (keyof MCUCharacter['stats'])[];
  const statValues = statKeys.map(k => stats[k]);
  const labels = ['INT', 'STR', 'SPD', 'DUR', 'EP', 'FSK'];
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const levels = 5;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLevelPoint = (index: number, level: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const r = (level / levels) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = statValues.map((v, i) => getPoint(i, v));
  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <linearGradient id={`radar-grad-${haloColor.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={haloColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={haloColor} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid levels */}
        {Array.from({ length: levels }, (_, l) => {
          const pts = Array.from({ length: 6 }, (_, i) => getLevelPoint(i, l + 1));
          return (
            <polygon
              key={l}
              points={pts.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis lines */}
        {statKeys.map((_, i) => {
          const pt = getLevelPoint(i, levels);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={pt.x}
              y2={pt.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <motion.polygon
          points={polygonPoints}
          fill={`url(#radar-grad-${haloColor.replace('#', '')})`}
          stroke={haloColor}
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Data points */}
        {dataPoints.map((pt, i) => (
          <motion.circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="4"
            fill={haloColor}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.3 }}
            style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
          />
        ))}

        {/* Labels */}
        {labels.map((label, i) => {
          const pt = getLevelPoint(i, levels + 0.7);
          return (
            <text
              key={i}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.05em"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// Relationship strength calculation from keywords
function getRelationshipStrength(relationship: string): number {
  const r = relationship.toLowerCase();
  if (/best|ultimate|soulmate/.test(r)) return 100;
  if (/father|mother|brother|sister|love/.test(r)) return 85;
  if (/mentor|prot[eé]g[eé]|partner|fellow/.test(r)) return 65;
  if (/ally|friend|teammate/.test(r)) return 45;
  if (/rival|frenemy/.test(r)) return 30;
  return 50;
}

// Relationship strength bar component
function RelationshipBar({ strength, isEnemy, haloColor }: { strength: number; isEnemy: boolean; haloColor: string }) {
  return (
    <div className="w-16 flex-shrink-0 flex flex-col items-center gap-0.5">
      <div className="w-full h-[3px] rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: isEnemy
              ? `linear-gradient(90deg, #B71C1C, #F44336)`
              : `linear-gradient(90deg, ${haloColor}60, ${haloColor})`,
          }}
        />
      </div>
      <span className="text-[8px] text-[rgba(255,255,255,0.2)] tabular-nums">{strength}%</span>
    </div>
  );
}

// Animated stat display with count-up
function AnimatedStat({ value, label, haloColor, animated }: {
  value: number; label: string; haloColor: string; animated: boolean;
}) {
  const count = useCountUp(value, animated);
  return (
    <div className="text-center p-3">
      <div className="text-2xl font-bold count-up" style={{ color: haloColor }}>{count}</div>
      <div className="text-[rgba(255,255,255,0.35)] text-[10px] uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}

// History tab with GSAP ScrollTrigger parallax effects
function HistoryTabContent({ character }: { character: MCUCharacter }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    // Small delay to let DOM settle after AnimatePresence
    const ctx = gsap.context(() => {
      // 1. History timeline line draws progressively as user scrolls
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 40%',
            end: 'bottom 80%',
            scrub: 0.6,
          },
        }
      );

      // 2. Each history event entry fades in and slides up on scroll
      entryRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 0.5,
            },
          }
        );
      });

      // 3. Year labels have parallax effect (move slower than content)
      yearRefs.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, [character.slug]);

  return (
    <>
      <h3 className="font-[var(--font-oswald)] text-white text-xl font-bold uppercase mb-8">Character History</h3>
      <div className="relative ml-4" ref={containerRef}>
        {/* Timeline line that draws on scroll */}
        <div
          ref={lineRef}
          className="absolute left-[11px] top-2 bottom-2 w-px timeline-draw-line"
          style={{
            background: `linear-gradient(180deg, ${character.haloColor} 0%, rgba(255,255,255,0.08) 15%, rgba(255,255,255,0.08) 85%, ${character.haloColor}40 100%)`,
            transformOrigin: 'top center',
          }}
        />

        <div className="space-y-6">
          {character.history.map((event, i) => (
            <div
              key={`${character.slug}-history-${i}`}
              ref={(el) => { entryRefs.current[i] = el; }}
              className="relative pl-10"
            >
              {/* Dot */}
              <div
                className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center ${event.isKeyMoment ? 'pulse-ring' : ''}`}
                style={{
                  borderColor: event.isKeyMoment ? character.haloColor : 'rgba(255,255,255,0.15)',
                  backgroundColor: event.isKeyMoment ? character.haloColor + '20' : 'transparent',
                  boxShadow: event.isKeyMoment ? `0 0 12px ${character.haloColor}30` : 'none',
                  color: character.haloColor,
                }}
              >
                {event.isKeyMoment && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: character.haloColor }} />}
              </div>

              <div className="bg-[#141414] rounded-lg border border-[rgba(255,255,255,0.06)] p-4"
                style={event.isKeyMoment ? { borderColor: character.haloColor + '20' } : {}}>
                <div className="flex items-center gap-2 mb-2">
                  {/* Year with parallax effect */}
                  <span
                    ref={(el) => { yearRefs.current[i] = el; }}
                    className="parallax-layer text-white text-sm font-semibold"
                  >
                    {event.movie}
                  </span>
                  <span className="text-[rgba(255,255,255,0.25)] text-xs">({event.year})</span>
                  {event.isKeyMoment && (
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                      style={{ color: character.haloColor, backgroundColor: character.haloColor + '15' }}>
                      Key Moment
                    </span>
                  )}
                </div>
                <p className="text-[rgba(255,255,255,0.5)] text-sm leading-relaxed">{event.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function CharacterPage() {
  const { currentPage, navigate } = useAppStore();

  const slug = currentPage.type === 'character' ? currentPage.slug : null;
  const character = useMemo(() => (slug ? getCharacterBySlug(slug) : undefined), [slug]);

  // Track character view for achievements (sessionStorage + event handled by store navigate)
  useEffect(() => {
    if (slug) {
      trackAchievement('characters_viewed');
    }
  }, [slug]);

  const [activeTab, setActiveTab] = useState(0);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [prevSlug, setPrevSlug] = useState(slug);

  // Ally/Enemy quick peek state
  const [quickPeekSlug, setQuickPeekSlug] = useState<string | null>(null);
  const [quickPeekAnchor, setQuickPeekAnchor] = useState<HTMLElement | null>(null);
  const quickPeekHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showQuickPeek = useCallback((charSlug: string, el: HTMLElement | null) => {
    if (quickPeekHoverTimer.current) clearTimeout(quickPeekHoverTimer.current);
    setQuickPeekAnchor(el);
    setQuickPeekSlug(charSlug);
  }, []);

  const hideQuickPeek = useCallback(() => {
    if (quickPeekHoverTimer.current) clearTimeout(quickPeekHoverTimer.current);
    quickPeekHoverTimer.current = setTimeout(() => {
      setQuickPeekSlug(null);
      setQuickPeekAnchor(null);
    }, 150);
  }, []);

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (quickPeekHoverTimer.current) clearTimeout(quickPeekHoverTimer.current);
    };
  }, []);

  const quickPeekCharacter = quickPeekSlug ? getCharacterBySlug(quickPeekSlug) : null;

  // Reset tab and stats when character changes (React recommended pattern)
  if (prevSlug !== slug) {
    setPrevSlug(slug);
    setActiveTab(0);
    setStatsAnimated(false);
  }

  if (!character) {
    return (
      <div className="pt-24 text-center">
        <p className="text-[rgba(255,255,255,0.5)]">Character not found.</p>
        <button onClick={() => navigate({ type: 'home' })} className="cta-button mt-4 text-xs">Go Home</button>
      </div>
    );
  }

  const tier = tierConfig[character.powerTier] || tierConfig.normal;

  const navigateToChar = (charSlug: string) => {
    navigate({ type: 'character', slug: charSlug });
    setActiveTab(0);
    setStatsAnimated(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const splitName = (name: string) => name.split(' ').map((part, i, arr) =>
    i < arr.length - 1 ? <span key={i}>{part}<br /></span> : <span key={i}>{part}</span>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Back to Roster Button */}
      <div className="fixed top-20 left-4 lg:left-8 z-40">
        <button
          onClick={() => navigate({ type: 'roster' })}
          className="back-btn btn-press"
        >
          <ArrowLeft size={16} />
          Back to Roster
        </button>
      </div>

      {/* Hero */}
      <section className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        {/* Halo — Enhanced with stronger glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full animate-halo-pulse pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${character.haloColor}30 0%, ${character.haloColor}12 40%, transparent 70%)`,
          }}
        />
        {/* Secondary halo ring for depth */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(circle, transparent 30%, ${character.haloColor}08 50%, transparent 70%)`,
          }}
        />

        {/* Giant Name */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none">
          <h1 className="font-[var(--font-oswald)] font-black uppercase tracking-[-0.02em] text-white text-center opacity-[0.08]"
            style={{ fontSize: 'clamp(4rem, 14vw, 16rem)', lineHeight: 0.85 }}>
            {splitName(character.name)}
          </h1>
        </div>

        {/* Character Image with Animated Border Glow */}
        <motion.div
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-[2] h-[60vh] lg:h-[80vh] pointer-events-none"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Animated glow behind image */}
          <div
            className="absolute inset-0 hero-image-glow rounded-full"
            style={{
              background: `radial-gradient(ellipse at center, ${character.haloColor}25 0%, transparent 70%)`,
              transform: 'scale(1.3)',
            }}
          />
          <Image
            src={character.images.hero}
            alt={character.name}
            width={600}
            height={900}
            className="h-full w-auto object-contain drop-shadow-2xl relative z-[1]"
            loading="eager"
            priority
          />
        </motion.div>

        {/* Name & Tagline Overlay */}
        <motion.div
          className="absolute bottom-[6vh] left-0 right-0 z-[3] text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="font-[var(--font-oswald)] text-white text-3xl lg:text-5xl font-bold uppercase tracking-wide mb-2">
            {character.name}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-3">
            <p className="text-[rgba(255,255,255,0.5)] text-sm lg:text-base">{character.tagline}</p>
            {/* Power Tier Badge */}
            <span
              className="power-tier-badge"
              style={{
                color: tier.color,
                borderColor: tier.color + '40',
                backgroundColor: tier.color + '12',
              }}
            >
              <span>{tier.icon}</span>
              {tier.label} Tier
            </span>
          </div>
          {/* Quote Player */}
          {character.quote && (
            <div className="flex justify-center mb-4">
              <QuotePlayer
                quote={character.quote}
                quoteSource={character.quoteSource}
                haloColor={character.haloColor}
              />
            </div>
          )}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                document.getElementById('character-content')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="cta-button text-xs mx-auto btn-press"
              style={{ borderColor: character.haloColor + '60' }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = character.haloColor;
                (e.target as HTMLElement).style.borderColor = character.haloColor;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'transparent';
                (e.target as HTMLElement).style.borderColor = character.haloColor + '60';
              }}
            >
              FULL BIOGRAPHY ↓
            </button>
            <ShareButton
              title={`${character.name} – Marvel Character Guide`}
              text={`Check out ${character.name} (${character.realName}) on the Marvel Universe Cinematic Guide! 🦸‍♂️`}
              url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#character/${character.slug}` : ''}
              haloColor={character.haloColor}
              ariaLabel={`Share ${character.name} profile`}
            />
          </div>
        </motion.div>

        {/* Dramatic Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 z-[4] pointer-events-none"
          style={{
            background: `linear-gradient(to top, #0A0A0A 0%, ${character.haloColor}05 40%, transparent 100%)`,
          }}
        />

        {/* Scanline overlay for retro-cinema effect */}
        <div className="scanline-overlay" />
      </section>

      {/* Quick Navigation Pills - Desktop only */}
      <div className="hidden md:block max-w-[1440px] mx-auto px-4 lg:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map((tab, i) => {
            const Icon = TAB_ICONS[i];
            const isActive = activeTab === i;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(i);
                  if (i === 1) setStatsAnimated(true);
                }}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-200 btn-press ${
                  isActive
                    ? 'text-white border-transparent shadow-lg'
                    : 'text-[rgba(255,255,255,0.4)] border-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.7)] hover:border-[rgba(255,255,255,0.15)]'
                }`}
                style={isActive ? {
                  backgroundColor: character.haloColor + '20',
                  borderColor: character.haloColor + '50',
                  color: character.haloColor,
                  boxShadow: `0 0 14px ${character.haloColor}25`,
                } : {}}
              >
                <Icon size={12} />
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation - Mobile only (desktop uses Quick Navigation Pills above) */}
      <div className="md:hidden sticky top-16 z-30 bg-[#0A0A0A] border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex overflow-x-auto scrollbar-hide">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(i);
                if (i === 1) setStatsAnimated(true);
              }}
              className={`flex-shrink-0 px-5 py-4 text-xs uppercase tracking-[0.1em] font-semibold transition-all duration-300 relative btn-press ${
                activeTab === i
                  ? 'text-white'
                  : 'text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.7)]'
              }`}
            >
              {tab}
              {activeTab === i && (
                <motion.span
                  layoutId="char-tab-indicator"
                  className="tab-indicator-gradient absolute bottom-0 left-2 right-2"
                  style={{
                    '--tab-color-start': character.haloColor,
                    '--tab-color-end': '#FF6D00',
                    '--tab-glow-color': character.haloColor + '60',
                  } as React.CSSProperties}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div id="character-content" className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Biography */}
                <div className="lg:col-span-2">
                  <h3 className="font-[var(--font-oswald)] text-white text-xl font-bold uppercase mb-4">Biography</h3>
                  <div className="text-[rgba(255,255,255,0.6)] text-sm leading-[1.8] whitespace-pre-line">
                    {character.biography}
                  </div>

                  {/* Cinematic Quote Block */}
                  {character.quote && (
                    <motion.blockquote
                      className="mt-10 relative p-6 rounded-xl overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      style={{
                        background: `linear-gradient(135deg, ${character.haloColor}08 0%, transparent 60%)`,
                        borderLeft: `3px solid ${character.haloColor}`,
                      }}
                    >
                      {/* Decorative quote icon */}
                      <div className="absolute top-4 right-4 opacity-[0.06]">
                        <Quote size={64} style={{ color: character.haloColor }} />
                      </div>

                      <p className="text-white text-xl lg:text-2xl italic font-light leading-relaxed mb-3 relative z-10">
                        &ldquo;{character.quote}&rdquo;
                      </p>
                      {character.quoteSource && (
                        <footer className="relative z-10 flex items-center gap-2">
                          <div className="w-8 h-px" style={{ backgroundColor: character.haloColor + '60' }} />
                          <cite className="text-[rgba(255,255,255,0.4)] text-xs not-italic font-medium uppercase tracking-wider">
                            {character.quoteSource}
                          </cite>
                        </footer>
                      )}
                    </motion.blockquote>
                  )}
                </div>

                {/* Quick Facts */}
                <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-6 h-fit">
                  <h3 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Real Name', value: character.realName || 'Unknown' },
                      { label: 'Species', value: character.species },
                      { label: 'First Appearance', value: character.appearances[0]?.movie + ` (${character.appearances[0]?.year})` || 'Unknown' },
                      { label: 'Status', value: character.status.charAt(0).toUpperCase() + character.status.slice(1) },
                      { label: 'Portrayed by', value: character.actorName },
                    ].map(item => (
                      <div key={item.label}>
                        <dt className="text-[rgba(255,255,255,0.35)] text-xs uppercase tracking-wider">{item.label}</dt>
                        <dd className="text-white text-sm font-medium">{item.value}</dd>
                      </div>
                    ))}

                    {/* Secondary Actors */}
                    {character.secondaryActors && character.secondaryActors.length > 0 && (
                      <div>
                        <dt className="text-[rgba(255,255,255,0.35)] text-xs uppercase tracking-wider">Also Portrayed by</dt>
                        <dd className="text-white text-sm font-medium">{character.secondaryActors.join(', ')}</dd>
                      </div>
                    )}

                    {/* Power Tier with badge */}
                    <div>
                      <dt className="text-[rgba(255,255,255,0.35)] text-xs uppercase tracking-wider">Power Tier</dt>
                      <dd className="mt-1">
                        <span
                          className="power-tier-badge"
                          style={{
                            color: tier.color,
                            borderColor: tier.color + '40',
                            backgroundColor: tier.color + '12',
                          }}
                        >
                          <span>{tier.icon}</span>
                          {tier.label}
                        </span>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {/* Animated stat summary cards */}
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                {STAT_LABELS.map(({ key, label }) => (
                  <AnimatedStat
                    key={key}
                    value={character.stats[key]}
                    label={label}
                    haloColor={character.haloColor}
                    animated={statsAnimated}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Stat Bars */}
                <div>
                  <h3 className="font-[var(--font-oswald)] text-white text-xl font-bold uppercase mb-6">Power Stats</h3>
                  <div className="space-y-5">
                    {STAT_LABELS.map(({ key, label }) => {
                      const value = character.stats[key];
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-[rgba(255,255,255,0.5)] uppercase tracking-wider">{label}</span>
                            <span className="text-white font-bold count-up">{value}</span>
                          </div>
                          <div className="stat-bar-fill stat-bar-animated">
                            <div
                              style={{
                                width: statsAnimated ? `${value}%` : '0%',
                                background: character.haloColor,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Total Power */}
                  <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex justify-between items-center">
                    <span className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-wider">Total Power</span>
                    <span className="text-white font-bold text-lg count-up" style={{ color: character.haloColor }}>
                      {Object.values(character.stats).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="flex flex-col items-center">
                  <h3 className="font-[var(--font-oswald)] text-white text-xl font-bold uppercase mb-6">Power Radar</h3>
                  <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-6">
                    <RadarChart stats={character.stats} haloColor={character.haloColor} />
                  </div>
                </div>

                {/* Powers & Weaknesses */}
                <div>
                  <h3 className="font-[var(--font-oswald)] text-white text-xl font-bold uppercase mb-4">Powers</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {character.powers.map(p => (
                      <span key={p} className="px-3 py-1.5 rounded-full text-xs font-medium text-white border"
                        style={{ borderColor: character.haloColor + '40', backgroundColor: character.haloColor + '15' }}>
                        {p}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-[var(--font-oswald)] text-white text-xl font-bold uppercase mb-4">Weaknesses</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.weaknesses.map(w => (
                      <span key={w} className="px-3 py-1.5 rounded-full text-xs font-medium text-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)]">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <HistoryTabContent character={character} />
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div key="appearances" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <h3 className="font-[var(--font-oswald)] text-white text-xl font-bold uppercase mb-6">Appearances</h3>

              {/* Cinematic Movie Cards - Horizontal Scroll */}
              <div className="movie-card-container flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {character.appearances.map((app, i) => {
                  const phase = getPhase(app.year);
                  const phaseColor = PHASE_COLORS[phase] || '#666';

                  return (
                    <motion.div
                      key={`${app.movie}-${app.year}`}
                      className="flex-shrink-0 w-[220px] lg:w-[260px] group cursor-pointer rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#141414] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[rgba(255,255,255,0.12)] btn-press"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      style={{
                        '--movie-glow': character.haloColor,
                      } as React.CSSProperties}
                    >
                      {/* Poster area with gradient overlay */}
                      <div className="relative aspect-[2/3] overflow-hidden">
                        {/* Gradient background with character halo */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${character.haloColor}15 0%, #0D0D0D 50%, ${character.haloColor}08 100%)`,
                          }}
                        />

                        {/* Year prominently */}
                        <div className="absolute top-3 left-3 z-10">
                          <span
                            className="text-3xl lg:text-4xl font-[var(--font-oswald)] font-black opacity-30"
                            style={{ color: character.haloColor }}
                          >
                            {app.year}
                          </span>
                        </div>

                        {/* Phase indicator */}
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)]">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phaseColor }} />
                          <span className="text-[10px] font-bold text-white/70">Phase {phase}</span>
                        </div>

                        {/* Character initial */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-7xl font-[var(--font-oswald)] font-black opacity-[0.04]"
                            style={{ color: character.haloColor }}
                          >
                            {character.name.charAt(0)}
                          </span>
                        </div>

                        {/* Bottom gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#141414] to-transparent z-[2]" />
                      </div>

                      {/* Card content */}
                      <div className="p-4 -mt-4 relative z-10">
                        <h4 className="text-white text-sm font-bold leading-tight mb-1 group-hover:text-white transition-colors">
                          {app.movie}
                        </h4>
                        <p className="text-[rgba(255,255,255,0.35)] text-xs leading-relaxed line-clamp-2 mt-1">
                          {app.notes}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Appearances summary */}
              <div className="mt-6 flex items-center gap-4 p-4 rounded-xl bg-[#141414] border border-[rgba(255,255,255,0.06)]">
                <span className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-wider">Total Appearances</span>
                <span className="text-white font-bold text-lg count-up" style={{ color: character.haloColor }}>
                  {character.appearances.length}
                </span>
                <span className="text-[rgba(255,255,255,0.25)] text-xs">movies</span>
              </div>
            </motion.div>
          )}

          {activeTab === 4 && (
            <motion.div key="allies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Allies */}
                <div>
                  <h3 className="font-[var(--font-oswald)] text-green-400 text-xl font-bold uppercase mb-4">Allies</h3>
                  <div className="space-y-3">
                    {character.allies.map((ally, i) => {
                      const allyChar = getCharacterBySlug(ally.characterSlug);
                      return (
                        <motion.button
                          key={i}
                          onClick={() => { hideQuickPeek(); if (allyChar) navigateToChar(ally.characterSlug); }}
                          onMouseEnter={(e) => { if (allyChar) showQuickPeek(ally.characterSlug, e.currentTarget); }}
                          onMouseLeave={hideQuickPeek}
                          className="w-full flex items-center gap-3 p-3 bg-[#141414] rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-green-500/20 hover:bg-[rgba(76,175,80,0.04)] transition-all duration-300 text-left btn-press connection-node-styled"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {allyChar ? (
                              <Image src={allyChar.images.switcher} alt={allyChar.name} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[rgba(255,255,255,0.2)] text-xs">{ally.characterSlug}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-sm font-medium truncate">{allyChar?.name || ally.characterSlug}</p>
                            <p className="text-[rgba(255,255,255,0.35)] text-xs truncate">{ally.relationship}</p>
                          </div>
                          <RelationshipBar strength={getRelationshipStrength(ally.relationship)} isEnemy={false} haloColor={character.haloColor} />
                        </motion.button>
                      );
                    })}
                    {character.allies.length === 0 && (
                      <p className="text-[rgba(255,255,255,0.3)] text-sm">No known allies</p>
                    )}
                  </div>
                </div>

                {/* Enemies */}
                <div>
                  <h3 className="font-[var(--font-oswald)] text-red-400 text-xl font-bold uppercase mb-4">Enemies</h3>
                  <div className="space-y-3">
                    {character.enemies.map((enemy, i) => {
                      const enemyChar = getCharacterBySlug(enemy.characterSlug);
                      return (
                        <motion.button
                          key={i}
                          onClick={() => { hideQuickPeek(); if (enemyChar) navigateToChar(enemy.characterSlug); }}
                          onMouseEnter={(e) => { if (enemyChar) showQuickPeek(enemy.characterSlug, e.currentTarget); }}
                          onMouseLeave={hideQuickPeek}
                          className="w-full flex items-center gap-3 p-3 bg-[#141414] rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-red-500/20 hover:bg-[rgba(244,67,54,0.04)] transition-all duration-300 text-left btn-press connection-node-styled"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {enemyChar ? (
                              <Image src={enemyChar.images.switcher} alt={enemyChar.name} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[rgba(255,255,255,0.2)] text-xs">{enemy.characterSlug}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-sm font-medium truncate">{enemyChar?.name || enemy.characterSlug}</p>
                            <p className="text-[rgba(255,255,255,0.35)] text-xs truncate">{enemy.relationship}</p>
                          </div>
                          <RelationshipBar strength={getRelationshipStrength(enemy.relationship)} isEnemy={true} haloColor={character.haloColor} />
                        </motion.button>
                      );
                    })}
                    {character.enemies.length === 0 && (
                      <p className="text-[rgba(255,255,255,0.3)] text-sm">No known enemies</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ally/Enemy Quick Peek Popup */}
              {quickPeekCharacter && (
                <AllyEnemyQuickPeek
                  character={quickPeekCharacter}
                  visible={!!quickPeekSlug}
                  anchorEl={quickPeekAnchor}
                  onClose={() => { setQuickPeekSlug(null); setQuickPeekAnchor(null); }}
                  onNavigate={navigateToChar}
                />
              )}

              {/* Quick Compare */}
              {(() => {
                const comparableAllies = character.allies
                  .map(a => ({ ...a, char: getCharacterBySlug(a.characterSlug) }))
                  .filter(a => a.char)
                  .slice(0, 3);
                if (comparableAllies.length < 1) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-8 p-5 rounded-xl bg-[#141414] border border-[rgba(255,255,255,0.06)]"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] uppercase tracking-[0.15em] font-bold px-2.5 py-1 rounded-full bg-[rgba(237,29,36,0.12)] text-[#ED1D24] border border-[rgba(237,29,36,0.2)]">
                        VS
                      </span>
                      <span className="text-white text-sm font-semibold">Quick Compare</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {comparableAllies.map((ally, i) => (
                        <button
                          key={i}
                          onClick={() => navigate({ type: 'compare', a: character.slug, b: ally.characterSlug })}
                          className="flex flex-col items-center gap-2 group btn-press flex-shrink-0"
                        >
                          <div
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.08)] group-hover:border-[rgba(255,255,255,0.3)] transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(255,255,255,0.1)]"
                          >
                            <Image
                              src={ally.char!.images.switcher}
                              alt={ally.char!.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[rgba(255,255,255,0.5)] group-hover:text-white text-[11px] font-medium transition-colors duration-300 max-w-[80px] truncate">
                            {ally.char!.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              })()}
            </motion.div>
          )}

          {activeTab === 5 && (
            <motion.div key="connections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <div className="mb-8">
                <h3 className="font-[var(--font-oswald)] text-white text-xl font-bold uppercase mb-2 flex items-center gap-3">
                  Connections
                  <span className="text-glow-subtle text-gradient text-sm font-semibold">Web</span>
                </h3>
                <p className="text-[rgba(255,255,255,0.35)] text-sm">
                  Interactive map of {character.name}&apos;s allies and enemies. Click a node to navigate.
                </p>
              </div>

              {character.allies.length === 0 && character.enemies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[rgba(255,255,255,0.3)] text-sm">No known connections for this character.</p>
                </div>
              ) : (
                <ConnectionWeb character={character} onNavigate={navigateToChar} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Top */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col items-center gap-3 pb-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:text-white hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300 btn-press"
            style={{ '--hover-glow': character.haloColor } as React.CSSProperties}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${character.haloColor}20`;
              (e.currentTarget as HTMLElement).style.borderColor = character.haloColor + '40';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <ArrowUp size={14} />
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}
