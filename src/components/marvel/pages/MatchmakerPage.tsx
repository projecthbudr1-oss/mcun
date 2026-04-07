'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Heart, ArrowLeft, Sparkles, ChevronRight, Users, Swords, Zap, BookOpen, RotateCcw } from 'lucide-react';
import { characters } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';
import ScrollReveal from '@/components/marvel/ScrollReveal';

/* ──────────────────────── Types ──────────────────────── */

interface MatchResult {
  alignmentHarmony: { score: number; max: number; explanation: string };
  powerBalance: { score: number; max: number; explanation: string };
  teamOverlap: { score: number; max: number; explanation: string };
  storySynergy: { score: number; max: number; explanation: string };
  total: number;
  tier: { label: string; tierClass: string; emoji: string };
  description: string;
  storyMoments: string[];
}

type MatchScreen = 'landing' | 'analyzing' | 'results';

/* ──────────────────────── Quick-pick pairings ──────────────────────── */

const QUICK_PICKS = [
  { a: 'iron-man', b: 'pepper-potts', label: 'Tony & Pepper' },
  { a: 'captain-america', b: 'peggy-carter', label: 'Steve & Peggy' },
  { a: 'spider-man', b: 'mj', label: 'Peter & MJ' },
  { a: 'thor', b: 'loki', label: 'Thor & Loki' },
  { a: 'iron-man', b: 'captain-america', label: 'Tony & Steve' },
  { a: 'black-panther', b: 'killmonger', label: 'T\'Challa & Killmonger' },
  { a: 'gamora', b: 'nebula', label: 'Gamora & Nebula' },
  { a: 'doctor-strange', b: 'wong', label: 'Strange & Wong' },
];

/* ──────────────────────── Compatibility Logic ──────────────────────── */

function getTotalStats(c: typeof characters[0]) {
  const s = c.stats;
  return s.intelligence + s.strength + s.speed + s.durability + s.energyProjection + s.fightingSkills;
}

function calcCompatibility(slugA: string, slugB: string): MatchResult {
  const charA = characters.find(c => c.slug === slugA);
  const charB = characters.find(c => c.slug === slugB);
  if (!charA || !charB) {
    return {
      alignmentHarmony: { score: 0, max: 25, explanation: 'Unknown characters.' },
      powerBalance: { score: 0, max: 25, explanation: 'Unknown characters.' },
      teamOverlap: { score: 0, max: 25, explanation: 'Unknown characters.' },
      storySynergy: { score: 0, max: 25, explanation: 'Unknown characters.' },
      total: 0,
      tier: { label: 'No Data', tierClass: 'tier-oil-water', emoji: '❓' },
      description: 'Unable to analyze this pairing.',
      storyMoments: [],
    };
  }

  // 1. Alignment Harmony (0-25)
  const alignmentMap: Record<string, { opposite: string; friendly: string[] }> = {
    hero: { opposite: 'villain', friendly: ['hero', 'anti-hero', 'neutral'] },
    villain: { opposite: 'hero', friendly: ['villain', 'anti-hero'] },
    'anti-hero': { opposite: '', friendly: ['hero', 'villain', 'anti-hero', 'neutral'] },
    neutral: { opposite: '', friendly: ['hero', 'anti-hero', 'neutral'] },
  };
  const alignA = alignmentMap[charA.alignment];
  const alignB = alignmentMap[charB.alignment];
  let alignScore = 10;
  let alignExplanation = '';
  if (charA.alignment === charB.alignment) {
    alignScore = 25;
    alignExplanation = `Both share the ${charA.alignment} alignment — a natural foundation for any relationship.`;
  } else if (alignA.friendly.includes(charB.alignment) && alignB.friendly.includes(charA.alignment)) {
    alignScore = 15;
    alignExplanation = `${charA.alignment} and ${charB.alignment} can find common ground despite their different moral compasses.`;
  } else if (alignA.opposite === charB.alignment || alignB.opposite === charA.alignment) {
    alignScore = 5;
    alignExplanation = `A ${charA.alignment} and ${charB.alignment} are fundamentally opposed — sparks will fly, but not always the good kind.`;
  } else {
    alignScore = 15;
    alignExplanation = `Their different alignments create an unpredictable dynamic — could go either way.`;
  }

  // 2. Power Balance (0-25)
  const totalA = getTotalStats(charA);
  const totalB = getTotalStats(charB);
  const diff = Math.abs(totalA - totalB);
  let powerScore = 0;
  let powerExplanation = '';
  if (diff <= 30) {
    powerScore = 25;
    powerExplanation = `Nearly equal power levels (${totalA} vs ${totalB}) create a balanced dynamic.`;
  } else if (diff <= 80) {
    powerScore = 18;
    powerExplanation = `Moderate power difference (${totalA} vs ${totalB}) — one may lead, but both contribute.`;
  } else if (diff <= 150) {
    powerScore = 10;
    powerExplanation = `Significant power gap (${totalA} vs ${totalB}) could create tension or dependency.`;
  } else {
    powerScore = 5;
    powerExplanation = `Massive power disparity (${totalA} vs ${totalB}) — one completely overshadows the other.`;
  }

  // 3. Team Overlap (0-25)
  const sharedTeams = charA.teams.filter(t => charB.teams.includes(t));
  const teamScore = sharedTeams.length > 0 ? Math.min(25, sharedTeams.length * 15) : 0;
  const teamExplanation = sharedTeams.length > 0
    ? `They share ${sharedTeams.length > 1 ? sharedTeams.length + ' team memberships' : 'a team'}: ${sharedTeams.join(', ')}. Shared battles forge unbreakable bonds.`
    : 'No shared team affiliations — they come from different worlds.';

  // 4. Story Synergy (0-25)
  const allyAofB = charA.allies.some(a => a.characterSlug === slugB);
  const allyBofA = charB.allies.some(a => a.characterSlug === slugA);
  const enemyAofB = charA.enemies.some(e => e.characterSlug === slugB);
  const enemyBofA = charB.enemies.some(e => e.characterSlug === slugA);
  let storyScore = 0;
  let storyExplanation = '';
  if (allyAofB && allyBofA) {
    storyScore = 25;
    const relA = charA.allies.find(a => a.characterSlug === slugB)?.relationship || '';
    storyExplanation = `Mutual allies! ${charA.name} sees ${charB.name} as "${relA}" — a deep two-way connection.`;
  } else if (allyAofB || allyBofA) {
    storyScore = 15;
    const relA = charA.allies.find(a => a.characterSlug === slugB)?.relationship || '';
    const relB = charB.allies.find(a => a.characterSlug === slugA)?.relationship || '';
    storyExplanation = `One-sided connection: "${relA || relB}". There's potential for more.`;
  } else if (enemyAofB || enemyBofA) {
    storyScore = 3;
    const relA = charA.enemies.find(e => e.characterSlug === slugB)?.relationship || '';
    storyExplanation = `They are listed as enemies: "${relA}". A complex adversarial relationship.`;
  } else {
    storyScore = 10;
    storyExplanation = `No direct ally or enemy relationship in the records. They may not have crossed paths yet.`;
  }

  // Total
  const total = alignScore + powerScore + teamScore + storyScore;

  // Tier
  let tier: { label: string; tierClass: string; emoji: string };
  if (total >= 90) tier = { label: 'Perfect Match', tierClass: 'tier-perfect', emoji: '💍' };
  else if (total >= 75) tier = { label: 'Great Chemistry', tierClass: 'tier-great', emoji: '🔥' };
  else if (total >= 60) tier = { label: 'Good Friends', tierClass: 'tier-good', emoji: '🤝' };
  else if (total >= 40) tier = { label: 'Interesting Dynamic', tierClass: 'tier-interesting', emoji: '⚡' };
  else tier = { label: 'Oil and Water', tierClass: 'tier-oil-water', emoji: '💥' };

  // Description
  const descriptions: Record<string, string> = {
    'tier-perfect': `${charA.name} and ${charB.name} are a match made in the MCU cosmos. Their complementary strengths and deep shared history make them one of the most compelling duos in the Marvel universe.`,
    'tier-great': `${charA.name} and ${charB.name} have undeniable chemistry. Whether fighting side by side or challenging each other, their dynamic is one of the most memorable in the MCU.`,
    'tier-good': `${charA.name} and ${charB.name} share enough common ground to work well together. Their relationship may not always be smooth, but there's genuine mutual respect.`,
    'tier-interesting': `${charA.name} and ${charB.name} create an unpredictable mix. Their differences could spark either brilliance or conflict — and that's what makes them fascinating.`,
    'tier-oil-water': `${charA.name} and ${charB.name} are fundamentally incompatible. Putting them together is like mixing oil and water — but sometimes the most explosive moments come from the most unlikely pairings.`,
  };
  const description = descriptions[tier.tierClass] || '';

  // Story moments
  const storyMoments: string[] = [];
  if (sharedTeams.length > 0) {
    storyMoments.push(`Both served on ${sharedTeams.join(', ')}`);
  }
  if (allyAofB || allyBofA) {
    storyMoments.push(`${allyAofB ? charA.name : charB.name} considers the other an ally`);
  }
  if (enemyAofB || enemyBofA) {
    storyMoments.push(`Their paths have crossed as adversaries`);
  }
  if (charA.alignment === 'hero' && charB.alignment === 'villain') {
    storyMoments.push('The eternal battle between hero and villain defines their dynamic');
  }
  if (Math.abs(totalA - totalB) > 100) {
    const stronger = totalA > totalB ? charA.name : charB.name;
    storyMoments.push(`${stronger} vastly outpowers the other — an asymmetric rivalry`);
  }
  if (storyMoments.length === 0) {
    storyMoments.push(`${charA.name} and ${charB.name} have yet to share significant screen time`);
    storyMoments.push(`Their potential dynamic remains an untold chapter in the MCU`);
  }

  return {
    alignmentHarmony: { score: alignScore, max: 25, explanation: alignExplanation },
    powerBalance: { score: powerScore, max: 25, explanation: powerExplanation },
    teamOverlap: { score: teamScore, max: 25, explanation: teamExplanation },
    storySynergy: { score: storyScore, max: 25, explanation: storyExplanation },
    total,
    tier,
    description,
    storyMoments,
  };
}

/* ──────────────────────── CountUp Hook ──────────────────────── */

function useCountUp(target: number, duration: number = 2000, enabled: boolean = false) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // expo-out easing
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, enabled]);
  return display;
}

/* ──────────────────────── Component ──────────────────────── */

export default function MatchmakerPage() {
  const { navigate } = useAppStore();
  const [screen, setScreen] = useState<MatchScreen>('landing');
  const [charA, setCharA] = useState('');
  const [charB, setCharB] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [countEnabled, setCountEnabled] = useState(false);

  const charDataA = useMemo(() => characters.find(c => c.slug === charA), [charA]);
  const charDataB = useMemo(() => characters.find(c => c.slug === charB), [charB]);
  const countValue = useCountUp(result?.total ?? 0, 2000, countEnabled);

  const canMatch = charA !== '' && charB !== '' && charA !== charB;

  const handleMatch = useCallback(() => {
    if (!canMatch) return;
    setScreen('analyzing');
    setCountEnabled(false);
    setTimeout(() => {
      const r = calcCompatibility(charA, charB);
      setResult(r);
      setScreen('results');
      setTimeout(() => setCountEnabled(true), 100);
    }, 2500);
  }, [canMatch, charA, charB]);

  const handleQuickPick = useCallback((a: string, b: string) => {
    setCharA(a);
    setCharB(b);
    setScreen('analyzing');
    setCountEnabled(false);
    setTimeout(() => {
      const r = calcCompatibility(a, b);
      setResult(r);
      setScreen('results');
      setTimeout(() => setCountEnabled(true), 100);
    }, 2500);
  }, []);

  const handleReset = useCallback(() => {
    setScreen('landing');
    setResult(null);
    setCountEnabled(false);
    setCharA('');
    setCharB('');
  }, []);

  const tierColor = useMemo(() => {
    if (!result) return '#ED1D24';
    if (result.total >= 90) return '#FFD54F';
    if (result.total >= 75) return '#76FF03';
    if (result.total >= 60) return '#4FC3F7';
    if (result.total >= 40) return '#FF9800';
    return '#F44336';
  }, [result]);

  // SVG ring math
  const ringRadius = 80;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashOffset = result ? ringCircumference - (countValue / 100) * ringCircumference : ringCircumference;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <ScrollReveal direction="up" delay={0.05}>
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => navigate({ type: 'home' })}
          className="back-btn btn-press mb-8"
        >
          <ArrowLeft size={16} />
          Back to Home
        </motion.button>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════ */}
          {/* LANDING SCREEN                                    */}
          {/* ═══════════════════════════════════════════════════ */}
          {screen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="mb-2"
              >
                <Heart size={32} className="text-[#ED1D24] mx-auto mb-4" />
              </motion.div>

              <h1 className="font-[var(--font-oswald)] text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-gradient mb-4">
                Character Matchmaker
              </h1>

              <p className="text-[rgba(255,255,255,0.5)] text-sm md:text-base max-w-lg mx-auto mb-12 leading-relaxed">
                Discover which MCU characters are meant for each other. Select two heroes or villains and watch the chemistry unfold.
              </p>

              {/* Character Selectors */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-8">
                {/* Character A */}
                <div className="w-full max-w-[280px]">
                  <label className="block text-xs uppercase tracking-[0.15em] text-[rgba(255,255,255,0.35)] mb-2 font-semibold">
                    First Character
                  </label>
                  <select
                    value={charA}
                    onChange={(e) => setCharA(e.target.value)}
                    className="w-full bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#ED1D24] transition-colors min-h-[44px]"
                  >
                    <option value="">Choose a character...</option>
                    {characters.map((c) => (
                      <option key={c.slug} value={c.slug} disabled={c.slug === charB}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Heart Icon */}
                <div className="flex items-center justify-center w-12 h-12 my-2 md:my-0">
                  <Heart size={24} className="text-[#ED1D24] opacity-40" />
                </div>

                {/* Character B */}
                <div className="w-full max-w-[280px]">
                  <label className="block text-xs uppercase tracking-[0.15em] text-[rgba(255,255,255,0.35)] mb-2 font-semibold">
                    Second Character
                  </label>
                  <select
                    value={charB}
                    onChange={(e) => setCharB(e.target.value)}
                    className="w-full bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#ED1D24] transition-colors min-h-[44px]"
                  >
                    <option value="">Choose a character...</option>
                    {characters.map((c) => (
                      <option key={c.slug} value={c.slug} disabled={c.slug === charA}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Same character warning */}
              {charA && charB && charA === charB && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#FF9800] text-xs mb-6"
                >
                  A character can&apos;t match with themselves! Choose two different characters.
                </motion.p>
              )}

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleMatch}
                disabled={!canMatch}
                className={`cta-button shimmer-sweep btn-press ${!canMatch ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={14} />
                  Find Chemistry
                </span>
              </motion.button>

              {/* Quick Picks */}
              <div className="mt-16">
                <p className="text-xs uppercase tracking-[0.2em] text-[rgba(255,255,255,0.25)] mb-4 font-semibold">
                  Popular Pairings
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                  {QUICK_PICKS.map((qp, i) => {
                    const existsA = characters.some(c => c.slug === qp.a);
                    const existsB = characters.some(c => c.slug === qp.b);
                    if (!existsA || !existsB) return null;
                    return (
                      <motion.button
                        key={qp.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.05, borderColor: 'rgba(237,29,36,0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickPick(qp.a, qp.b)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.5)] text-xs hover:text-white transition-all cursor-pointer btn-press"
                      >
                        <Heart size={10} className="text-[#ED1D24] opacity-60" />
                        {qp.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* ANALYZING SCREEN                                  */}
          {/* ═══════════════════════════════════════════════════ */}
          {screen === 'analyzing' && charDataA && charDataB && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="relative flex items-center justify-center gap-6 md:gap-10 mb-12">
                {/* Character A Portrait */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.1)]"
                  style={{ boxShadow: `0 0 30px ${charDataA.haloColor}30` }}
                >
                  <Image
                    src={charDataA.images.hero}
                    alt={charDataA.name}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </motion.div>

                {/* Connecting Heart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Heart size={32} className="text-[#ED1D24]" fill="currentColor" />
                  </motion.div>
                </motion.div>

                {/* Character B Portrait */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.1)]"
                  style={{ boxShadow: `0 0 30px ${charDataB.haloColor}30` }}
                >
                  <Image
                    src={charDataB.images.hero}
                    alt={charDataB.name}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-white font-[var(--font-oswald)] text-xl md:text-2xl uppercase tracking-wider mb-2">
                  Analyzing Chemistry...
                </p>
                <p className="text-[rgba(255,255,255,0.35)] text-sm">
                  Calculating compatibility between {charDataA.name} and {charDataB.name}
                </p>
              </motion.div>

              {/* Loading dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center gap-2 mt-8"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                    className="w-2 h-2 rounded-full bg-[#ED1D24]"
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/* RESULTS SCREEN                                    */}
          {/* ═══════════════════════════════════════════════════ */}
          {screen === 'results' && result && charDataA && charDataB && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Character Portraits Row */}
              <div className="relative flex items-center justify-center gap-6 md:gap-10 mb-10">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  <div
                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 mx-auto mb-3"
                    style={{
                      borderColor: `${charDataA.haloColor}40`,
                      boxShadow: `0 0 24px ${charDataA.haloColor}25`,
                    }}
                  >
                    <Image
                      src={charDataA.images.hero}
                      alt={charDataA.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <p className="text-white text-sm font-semibold">{charDataA.name}</p>
                  <p className="text-[rgba(255,255,255,0.35)] text-xs capitalize">{charDataA.alignment}</p>
                </motion.div>

                {/* Connector + Heart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative flex flex-col items-center"
                >
                  <div className={result.total >= 75 ? 'heart-pulse-match' : result.total < 40 ? 'shake-low' : ''}>
                    <Heart
                      size={36}
                      className="text-[#ED1D24]"
                      fill={result.total >= 60 ? 'currentColor' : 'none'}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  <div
                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 mx-auto mb-3"
                    style={{
                      borderColor: `${charDataB.haloColor}40`,
                      boxShadow: `0 0 24px ${charDataB.haloColor}25`,
                    }}
                  >
                    <Image
                      src={charDataB.images.hero}
                      alt={charDataB.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <p className="text-white text-sm font-semibold">{charDataB.name}</p>
                  <p className="text-[rgba(255,255,255,0.35)] text-xs capitalize">{charDataB.alignment}</p>
                </motion.div>
              </div>

              {/* Compatibility Gauge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center mb-10"
              >
                <div className="relative w-48 h-48 md:w-56 md:h-56">
                  <svg viewBox="0 0 200 200" className="compatibility-ring w-full h-full">
                    <circle cx="100" cy="100" r={ringRadius} className="compatibility-ring-track" />
                    <circle
                      cx="100"
                      cy="100"
                      r={ringRadius}
                      className="compatibility-ring-fill"
                      stroke={tierColor}
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringDashOffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl md:text-5xl font-black font-[var(--font-oswald)] text-white count-up">
                      {countValue}
                    </span>
                    <span className="text-[rgba(255,255,255,0.35)] text-xs uppercase tracking-widest mt-1">
                      Compatible
                    </span>
                  </div>
                </div>

                {/* Tier Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                >
                  <span className={`compatibility-tier-badge ${result.tier.tierClass}`}>
                    <span>{result.tier.emoji}</span>
                    {result.tier.label}
                  </span>
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="text-center text-[rgba(255,255,255,0.55)] text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed"
              >
                {result.description}
              </motion.p>

              {/* Factor Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
              >
                <FactorCard
                  icon={<Zap size={16} />}
                  title="Alignment Harmony"
                  score={result.alignmentHarmony.score}
                  max={result.alignmentHarmony.max}
                  explanation={result.alignmentHarmony.explanation}
                  color={tierColor}
                />
                <FactorCard
                  icon={<Swords size={16} />}
                  title="Power Balance"
                  score={result.powerBalance.score}
                  max={result.powerBalance.max}
                  explanation={result.powerBalance.explanation}
                  color={tierColor}
                />
                <FactorCard
                  icon={<Users size={16} />}
                  title="Team Overlap"
                  score={result.teamOverlap.score}
                  max={result.teamOverlap.max}
                  explanation={result.teamOverlap.explanation}
                  color={tierColor}
                />
                <FactorCard
                  icon={<BookOpen size={16} />}
                  title="Story Synergy"
                  score={result.storySynergy.score}
                  max={result.storySynergy.max}
                  explanation={result.storySynergy.explanation}
                  color={tierColor}
                />
              </motion.div>

              {/* Their Story */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10"
              >
                <h3 className="text-white font-[var(--font-oswald)] text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#ED1D24]" />
                  Their Story
                </h3>
                <div className="space-y-3">
                  {result.storyMoments.map((moment, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.2 + i * 0.15, duration: 0.4 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]"
                    >
                      <ChevronRight size={14} className="text-[#ED1D24] mt-0.5 flex-shrink-0" />
                      <span className="text-[rgba(255,255,255,0.6)] text-sm">{moment}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Try Another */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="cta-button shimmer-sweep btn-press inline-flex items-center gap-2"
                >
                  <RotateCcw size={14} />
                  Try Another Pair
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ──────────────────────── Factor Card ──────────────────────── */

function FactorCard({
  icon,
  title,
  score,
  max,
  explanation,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  score: number;
  max: number;
  explanation: string;
  color: string;
}) {
  const percent = max > 0 ? (score / max) * 100 : 0;

  return (
    <div className="match-result-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-[rgba(255,255,255,0.7)] text-sm font-semibold">
          <span style={{ color }}>{icon}</span>
          {title}
        </div>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {score}/{max}
        </span>
      </div>
      <div className="stat-bar-fill mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ background: color }}
        />
      </div>
      <p className="text-[rgba(255,255,255,0.4)] text-xs leading-relaxed">{explanation}</p>
    </div>
  );
}
