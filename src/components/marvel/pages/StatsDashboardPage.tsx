'use client';

import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, Shield, Zap, Trophy, Brain, Dumbbell, Gauge, ShieldCheck, Flame, Swords } from 'lucide-react';
import { characters, type MCUCharacter } from '@/data/characters';
import { teams } from '@/data/teams';
import { useAppStore } from '@/store/useAppStore';
import ScrollReveal from '@/components/marvel/ScrollReveal';

/* ─── helpers ─── */
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const raf = () => {
      start += step;
      if (start >= target) { setVal(target); return; }
      setVal(Math.floor(start));
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function totalStats(c: MCUCharacter) {
  return c.stats.intelligence + c.stats.strength + c.stats.speed + c.stats.durability + c.stats.energyProjection + c.stats.fightingSkills;
}

const STAT_KEYS = ['intelligence', 'strength', 'speed', 'durability', 'energyProjection', 'fightingSkills'] as const;
type StatKey = typeof STAT_KEYS[number];

const STAT_LABELS: Record<StatKey, string> = {
  intelligence: 'INT',
  strength: 'STR',
  speed: 'SPD',
  durability: 'DUR',
  energyProjection: 'EP',
  fightingSkills: 'FSK',
};

const STAT_ICONS: Record<StatKey, React.ReactNode> = {
  intelligence: <Brain size={18} />,
  strength: <Dumbbell size={18} />,
  speed: <Gauge size={18} />,
  durability: <ShieldCheck size={18} />,
  energyProjection: <Flame size={18} />,
  fightingSkills: <Swords size={18} />,
};

const ALIGNMENT_COLORS: Record<string, string> = {
  hero: '#4CAF50',
  villain: '#F44336',
  'anti-hero': '#FF9800',
  neutral: '#9E9E9E',
};

const TIER_COLORS: Record<string, string> = {
  cosmic: '#FFD54F',
  omega: '#7C4DFF',
  alpha: '#4FC3F7',
  beta: '#66BB6A',
  gamma: '#90A4AE',
  normal: '#BDBDBD',
};

const PHASES = [
  { label: 'Phase 1', range: [2008, 2012] as const, color: '#4FC3F7' },
  { label: 'Phase 2', range: [2013, 2015] as const, color: '#FF6D00' },
  { label: 'Phase 3', range: [2016, 2019] as const, color: '#76FF03' },
  { label: 'Phase 4', range: [2021, 2022] as const, color: '#7C4DFF' },
  { label: 'Phase 5+', range: [2023, 2030] as const, color: '#ED1D24' },
];

const ease = [0.16, 1, 0.3, 1] as const;

/* ─── component ─── */
export default function StatsDashboardPage() {
  const navigate = useAppStore((s) => s.navigate);

  /* ── computed data ── */
  const totalChars = characters.length;
  const totalTeams = teams.length;

  const avgPower = useMemo(() => {
    const sum = characters.reduce((a, c) => a + totalStats(c), 0);
    return Math.round(sum / characters.length);
  }, []);

  const strongest = useMemo(() => {
    return characters.reduce((best, c) => (totalStats(c) > totalStats(best) ? c : best), characters[0]);
  }, []);

  /* alignment distribution */
  const alignmentData = useMemo(() => {
    const counts: Record<string, number> = { hero: 0, villain: 0, 'anti-hero': 0, neutral: 0 };
    characters.forEach((c) => { counts[c.alignment] = (counts[c.alignment] || 0) + 1; });
    return counts;
  }, []);

  /* power tier distribution */
  const tierData = useMemo(() => {
    const counts: Record<string, number> = { cosmic: 0, omega: 0, alpha: 0, beta: 0, gamma: 0, normal: 0 };
    characters.forEach((c) => { counts[c.powerTier] = (counts[c.powerTier] || 0) + 1; });
    return counts;
  }, []);

  /* stat leaders */
  const statLeaders = useMemo(() => {
    const leaders: Record<StatKey, { char: MCUCharacter; val: number }> = {} as any;
    STAT_KEYS.forEach((key) => {
      let best = characters[0];
      characters.forEach((c) => { if (c.stats[key] > best.stats[key]) best = c; });
      leaders[key] = { char: best, val: best.stats[key] };
    });
    return leaders;
  }, []);

  /* top 10 by appearances */
  const appearanceData = useMemo(() => {
    return characters
      .map((c) => ({ char: c, count: c.appearances.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, []);

  /* phase breakdown */
  const phaseData = useMemo(() => {
    return PHASES.map((phase) => {
      const count = characters.filter((c) => {
        const firstYear = c.appearances[0]?.year;
        if (!firstYear) return false;
        return firstYear >= phase.range[0] && firstYear <= phase.range[1];
      }).length;
      return { ...phase, count };
    });
  }, []);

  /* donut gradient */
  const donutGradient = useMemo(() => {
    const total = Object.values(alignmentData).reduce((a, b) => a + b, 0);
    if (total === 0) return '';
    const entries = Object.entries(alignmentData).filter(([, v]) => v > 0);
    let cumulative = 0;
    const stops = entries.map(([key, val]) => {
      const start = cumulative;
      cumulative += (val / total) * 360;
      return `${ALIGNMENT_COLORS[key]} ${start}deg ${cumulative}deg`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [alignmentData]);

  /* count-up hooks */
  const animTotal = useCountUp(totalChars);
  const animTeams = useCountUp(totalTeams);
  const animAvg = useCountUp(avgPower);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 lg:px-8 max-w-[1440px] mx-auto">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mb-10"
      >
        <h1 className="font-[var(--font-oswald)] text-4xl md:text-5xl font-black uppercase tracking-tight text-gradient">
          MCU Statistics
        </h1>
        <p className="mt-2 text-[rgba(255,255,255,0.45)] text-sm max-w-xl">
          Deep-dive analytics across all {totalChars} characters, {totalTeams} teams, and the entire Marvel Cinematic Universe timeline.
        </p>
      </motion.div>

      {/* ════════════════════════════════════════════════
          1. Overview Cards Row
          ════════════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={0.1}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <Users size={20} />, label: 'Total Characters', value: animTotal, color: '#ED1D24' },
          { icon: <Shield size={20} />, label: 'Total Teams', value: animTeams, color: '#4FC3F7' },
          { icon: <Zap size={20} />, label: 'Avg Power Score', value: animAvg, color: '#FFD54F' },
          { icon: <Trophy size={20} />, label: 'Strongest', value: null, name: strongest.name, color: '#FF6D00' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease }}
            className="stat-card glass-card glass-card-hover"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${card.color}18`, color: card.color }}
            >
              {card.icon}
            </div>
            <p className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest mb-1">{card.label}</p>
            {card.value !== null ? (
              <p className="text-2xl font-bold text-white count-up">{card.value}</p>
            ) : (
              <p className="text-lg font-bold text-white">{card.name}</p>
            )}
          </motion.div>
        ))}
      </div>
      </ScrollReveal>

      {/* ════════════════════════════════════════════════
          2. Alignment Distribution (Donut) + 3. Power Tier Distribution
          ════════════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={0.2}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Alignment Donut */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="stat-card glass-card glass-card-hover"
        >
          <h2 className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wide mb-6 text-white">
            Alignment Distribution
          </h2>
          <div className="flex items-center gap-8 flex-col sm:flex-row">
            {/* Donut */}
            <div className="relative w-44 h-44 flex-shrink-0">
              <motion.div
                className="donut-chart w-full h-full rounded-full"
                style={{
                  background: donutGradient,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15, ease }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#141414] flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{totalChars}</span>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-3">
              {Object.entries(alignmentData).map(([key, count], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease }}
                  className="flex items-center gap-3"
                >
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: ALIGNMENT_COLORS[key] }} />
                  <span className="text-[rgba(255,255,255,0.6)] text-sm capitalize min-w-[70px]">{key.replace('-', ' ')}</span>
                  <span className="text-white font-bold text-sm ml-auto">{count}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Power Tier Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className="stat-card glass-card glass-card-hover"
        >
          <h2 className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wide mb-6 text-white">
            Power Tier Distribution
          </h2>
          <div className="flex flex-col gap-4">
            {(Object.entries(tierData) as [string, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([tier, count], i) => {
                const maxCount = Math.max(...Object.values(tierData));
                const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={tier} className="flex items-center gap-3">
                    <span className="text-[rgba(255,255,255,0.45)] text-xs uppercase tracking-wider min-w-[60px] text-right">{tier}</span>
                    <div className="flex-1 h-7 bg-[#1A1A1A] rounded-md overflow-hidden">
                      <motion.div
                        className="stat-bar-animated-h h-full rounded-md flex items-center pl-3"
                        style={{ background: TIER_COLORS[tier] }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease }}
                      >
                        <span className="text-xs font-bold text-white drop-shadow-sm">{count}</span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      </div>
      </ScrollReveal>

      {/* ════════════════════════════════════════════════
          4. Top Stat Leaders
          ════════════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={0.1}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="mb-10"
      >
        <h2 className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wide mb-6 text-white">
          Top Stat Leaders
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAT_KEYS.map((key, i) => {
            const leader = statLeaders[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease }}
                className="stat-leader-card glass-card glass-card-hover"
                style={{
                  boxShadow: `0 0 20px ${leader.char.haloColor}15, inset 0 0 30px ${leader.char.haloColor}08`,
                }}
                onClick={() => navigate({ type: 'character', slug: leader.char.slug })}
              >
                <div className="flex items-center justify-center mb-3" style={{ color: leader.char.haloColor }}>
                  {STAT_ICONS[key]}
                </div>
                <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border-2 mb-3"
                  style={{ borderColor: `${leader.char.haloColor}60` }}
                >
                  <Image
                    src={leader.char.images.hero}
                    alt={leader.char.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-bold text-white text-center truncate">{leader.char.name}</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.35)] uppercase tracking-widest text-center mt-0.5">
                  {STAT_LABELS[key]}
                </p>
                <p className="text-lg font-black text-center mt-1" style={{ color: leader.char.haloColor }}>
                  {leader.val}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      </ScrollReveal>

      {/* ════════════════════════════════════════════════
          5. Appearance Frequency
          ════════════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={0.1}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="stat-card glass-card mb-10"
      >
        <h2 className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wide mb-6 text-white">
          Appearance Frequency
        </h2>
        <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
          {appearanceData.map(({ char, count }, i) => {
            const maxCount = appearanceData[0]?.count || 1;
            const pct = (count / maxCount) * 100;
            return (
              <motion.div
                key={char.slug}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04, ease }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate({ type: 'character', slug: char.slug })}
              >
                <span className="text-[rgba(255,255,255,0.3)] text-xs w-5 text-right font-mono">{i + 1}</span>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[rgba(255,255,255,0.08)] flex-shrink-0">
                  <Image src={char.images.hero} alt={char.name} width={32} height={32} className="w-full h-full object-cover" />
                </div>
                <span className="text-[rgba(255,255,255,0.7)] text-sm min-w-[110px] truncate group-hover:text-white transition-colors">{char.name}</span>
                <div className="flex-1 h-6 bg-[#1A1A1A] rounded overflow-hidden">
                  <motion.div
                    className="stat-bar-animated-h h-full rounded"
                    style={{ background: `linear-gradient(90deg, ${char.haloColor}, ${char.haloColor}AA)` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.04, ease }}
                  />
                </div>
                <span className="text-white text-sm font-bold min-w-[24px] text-right">{count}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      </ScrollReveal>

      {/* ════════════════════════════════════════════════
          6. MCU Phase Breakdown
          ════════════════════════════════════════════════ */}
      <ScrollReveal direction="up" delay={0.1}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="stat-card glass-card"
      >
        <h2 className="font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wide mb-6 text-white">
          MCU Phase Breakdown
        </h2>
        <div className="flex flex-col gap-4">
          {phaseData.map((phase, i) => {
            const maxCount = Math.max(...phaseData.map((p) => p.count), 1);
            const pct = (phase.count / maxCount) * 100;
            return (
              <div key={phase.label} className="flex items-center gap-4">
                <span className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-wider min-w-[70px] text-right">{phase.label}</span>
                <span className="text-[rgba(255,255,255,0.25)] text-[10px] min-w-[80px]">
                  {phase.range[0]}{phase.range[1] < 2030 ? `–${phase.range[1]}` : '+'}
                </span>
                <div className="flex-1 h-8 bg-[#1A1A1A] rounded-md overflow-hidden">
                  <motion.div
                    className="stat-phase-bar h-full rounded-md flex items-center px-3 gap-2"
                    style={{ background: phase.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.max(pct, 4)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease }}
                  >
                    <span className="text-xs font-bold text-white drop-shadow-sm">{phase.count}</span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      </ScrollReveal>
    </div>
  );
}
