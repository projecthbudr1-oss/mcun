'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ChevronDown, Zap, ArrowLeftRight } from 'lucide-react';
import { characters } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';
import ShareButton from '@/components/marvel/ShareButton';
import Image from 'next/image';

type SortField = 'total' | 'intelligence' | 'strength' | 'speed' | 'durability' | 'energyProjection' | 'fightingSkills';
type TierFilter = 'all' | 'cosmic' | 'omega' | 'alpha' | 'beta' | 'gamma' | 'normal';

const statLabels: Record<keyof SortField, string> = {
  total: 'TOTAL',
  intelligence: 'INT',
  strength: 'STR',
  speed: 'SPD',
  durability: 'DUR',
  energyProjection: 'EP',
  fightingSkills: 'FSK',
};

const tierColors: Record<string, string> = {
  cosmic: '#7C4DFF',
  omega: '#26A69A',
  alpha: '#ED1D24',
  beta: '#FFB300',
  gamma: '#78909C',
  normal: '#616161',
};

const tierStripClasses: Record<string, string> = {
  cosmic: 'tier-cosmic',
  omega: 'tier-omega',
  alpha: 'tier-alpha',
  beta: 'tier-beta',
  gamma: 'tier-gamma',
  normal: 'tier-normal',
};

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

function getTotalStats(stats: { intelligence: number; strength: number; speed: number; durability: number; energyProjection: number; fightingSkills: number }): number {
  return Object.values(stats).reduce((s, v) => s + v, 0);
}

function getTopStat(stats: { intelligence: number; strength: number; speed: number; durability: number; energyProjection: number; fightingSkills: number }): { label: string; value: number } {
  const entries: [string, number][] = [
    ['INT', stats.intelligence],
    ['STR', stats.strength],
    ['SPD', stats.speed],
    ['DUR', stats.durability],
    ['EP', stats.energyProjection],
    ['FSK', stats.fightingSkills],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return { label: entries[0][0], value: entries[0][1] };
}

const statKeyMap: Record<string, keyof import('@/data/characters').MCUCharacter['stats']> = {
  int: 'intelligence',
  str: 'strength',
  spd: 'speed',
  dur: 'durability',
  ep: 'energyProjection',
  fsk: 'fightingSkills',
};

export default function PowerRankingsPage() {
  const { navigate } = useAppStore();
  const [sortBy, setSortBy] = useState<SortField>('total');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [highlightStat, setHighlightStat] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const ranked = useMemo(() => {
    let list = [...characters];
    if (tierFilter !== 'all') {
      list = list.filter(c => c.powerTier === tierFilter);
    }
    if (sortBy === 'total') {
      list.sort((a, b) => getTotalStats(b.stats) - getTotalStats(a.stats));
    } else {
      list.sort((a, b) => b.stats[sortBy] - a.stats[sortBy]);
    }
    return list;
  }, [sortBy, tierFilter]);

  const top3 = ranked.slice(0, 3);
  const remaining = ranked.slice(3);
  const top10 = ranked.slice(0, 10);
  const maxTotal = top10.length > 0 ? (sortBy === 'total' ? getTotalStats(top10[0].stats) : top10[0].stats[sortBy]) : 600;

  // Comparison logic
  const selectedChar = selectedSlug ? ranked.find(c => c.slug === selectedSlug) : null;
  const selectedScore = selectedChar
    ? (sortBy === 'total' ? getTotalStats(selectedChar.stats) : selectedChar.stats[sortBy])
    : 0;

  const handleSelect = (slug: string) => {
    if (selectedSlug === slug) {
      setSelectedSlug(null);
    } else {
      setSelectedSlug(slug);
    }
  };

  return (
    <div className="pt-20 pb-24 px-4 lg:px-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="font-[var(--font-oswald)] text-shimmer text-4xl lg:text-5xl font-bold uppercase tracking-wide">
            POWER RANKINGS
          </h1>
          <Zap size={28} className="text-[#FFD54F]" />
          <ShareButton
            title="MCU Power Rankings"
            text="Check out the MCU Power Rankings on Marvel Universe Cinematic Guide"
            url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#power-rankings` : ''}
            variant="icon"
            haloColor="#FFD700"
            ariaLabel="Share Power Rankings"
          />
        </div>
        <p className="text-[rgba(255,255,255,0.4)] text-sm">
          All {characters.length} characters ranked by {statLabels[sortBy]} power stats
        </p>
      </motion.div>

      {/* ===== TOP 3 PODIUM ===== */}
      {top3.length >= 3 && tierFilter === 'all' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-10">
          <div className="rankings-podium">
            {/* 2nd Place (Silver) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="podium-slot silver cursor-pointer"
              onClick={() => navigate({ type: 'character', slug: top3[1].slug })}
            >
              <span className="podium-rank" style={{ color: medalColors[1] }}>2</span>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 mb-3" style={{ borderColor: top3[1].haloColor + '80' }}>
                <Image src={top3[1].images.hero} alt={top3[1].name} fill className="object-cover" sizes="64px" />
              </div>
              <h3 className="text-white text-sm font-bold mb-1">{top3[1].name}</h3>
              <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: medalColors[1] }}>
                {getTotalStats(top3[1].stats)} pts
              </span>
              <span className="text-[rgba(255,255,255,0.25)] text-[9px] block mt-1">{top3[1].powerTier.toUpperCase()}</span>
            </motion.div>

            {/* 1st Place (Gold) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="podium-slot gold cursor-pointer"
              onClick={() => navigate({ type: 'character', slug: top3[0].slug })}
            >
              <span className="podium-rank" style={{ color: medalColors[0] }}>1</span>
              <div className="crown-float mb-2">
                <Crown size={28} className="text-[#FFD54F] mx-auto" />
              </div>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 mb-3" style={{ borderColor: '#FFD54F' }}>
                <Image src={top3[0].images.hero} alt={top3[0].name} fill className="object-cover" sizes="80px" />
              </div>
              <h3 className="text-white text-base font-bold mb-1">{top3[0].name}</h3>
              <span className="text-[11px] uppercase tracking-wider font-black text-[#FFD54F]">
                {getTotalStats(top3[0].stats)} pts
              </span>
              <span className="text-[rgba(255,255,255,0.25)] text-[9px] block mt-1">{top3[0].powerTier.toUpperCase()}</span>
            </motion.div>

            {/* 3rd Place (Bronze) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="podium-slot bronze cursor-pointer"
              onClick={() => navigate({ type: 'character', slug: top3[2].slug })}
            >
              <span className="podium-rank" style={{ color: medalColors[2] }}>3</span>
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 mb-3" style={{ borderColor: top3[2].haloColor + '80' }}>
                <Image src={top3[2].images.hero} alt={top3[2].name} fill className="object-cover" sizes="56px" />
              </div>
              <h3 className="text-white text-sm font-bold mb-1">{top3[2].name}</h3>
              <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: medalColors[2] }}>
                {getTotalStats(top3[2].stats)} pts
              </span>
              <span className="text-[rgba(255,255,255,0.25)] text-[9px] block mt-1">{top3[2].powerTier.toUpperCase()}</span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Power Distribution Chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-6 mb-8 glass-card glass-card-hover">
        <h2 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase tracking-wide mb-4">
          POWER DISTRIBUTION — TOP 10
        </h2>
        <div className="space-y-3">
          {top10.map((char, i) => {
            const total = sortBy === 'total' ? getTotalStats(char.stats) : char.stats[sortBy];
            const width = (total / maxTotal) * 100;
            return (
              <motion.div
                key={char.slug}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate({ type: 'character', slug: char.slug })}
              >
                <span className="text-[rgba(255,255,255,0.35)] text-xs font-mono w-5 text-right">{i + 1}</span>
                <div className="flex-1 h-6 bg-[rgba(255,255,255,0.04)] rounded-md overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.9, delay: i * 0.06 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-md relative"
                    style={{
                      background: `linear-gradient(90deg, ${char.haloColor}40, ${char.haloColor}90)`,
                      borderLeft: `3px solid ${char.haloColor}`,
                    }}
                  >
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/70 font-mono">{total}</span>
                  </motion.div>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white truncate max-w-[200px] pointer-events-none z-10">{char.name}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-4 mb-8 glass-card glass-card-hover">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-wider font-semibold">Sort by</span>
          {(Object.keys(statLabels) as SortField[]).map(field => (
            <button
              key={field}
              onClick={() => { setSortBy(field); setSelectedSlug(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all duration-200 btn-press ${
                sortBy === field
                  ? 'bg-[#ED1D24]/10 border-[#ED1D24]/40 text-[#ED1D24]'
                  : 'bg-[#1A1A1A] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(255,255,255,0.15)]'
              }`}
            >
              {statLabels[field]}
            </button>
          ))}
          <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-2 hidden sm:block" />
          <span className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-wider font-semibold">Tier</span>
          <div className="relative">
            <select
              value={tierFilter}
              onChange={(e) => { setTierFilter(e.target.value as TierFilter); setSelectedSlug(null); }}
              className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#ED1D24]/50 appearance-none cursor-pointer pr-7"
            >
              <option value="all">All Tiers</option>
              <option value="cosmic">Cosmic</option>
              <option value="omega">Omega</option>
              <option value="alpha">Alpha</option>
              <option value="beta">Beta</option>
              <option value="gamma">Gamma</option>
              <option value="normal">Normal</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Stats Explorer */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-4 mb-8 glass-card glass-card-hover">
        <h3 className="font-[var(--font-oswald)] text-white text-sm font-bold uppercase tracking-wide mb-3">STATS EXPLORER</h3>
        <p className="text-[rgba(255,255,255,0.3)] text-xs mb-3">Click a stat to highlight it across all characters</p>
        <div className="flex flex-wrap gap-2">
          {['INT', 'STR', 'SPD', 'DUR', 'EP', 'FSK'].map(stat => (
            <button
              key={stat}
              onClick={() => setHighlightStat(highlightStat === stat ? null : stat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 btn-press ${
                highlightStat === stat
                  ? 'bg-[#ED1D24]/15 border-[#ED1D24]/50 text-[#ED1D24] border'
                  : 'bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(255,255,255,0.15)]'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Comparison Bar */}
      <AnimatePresence>
        {selectedChar && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rankings-comparison-bar mb-6"
          >
            <ArrowLeftRight size={12} className="text-[#ED1D24] flex-shrink-0" />
            <span className="text-[rgba(255,255,255,0.6)]">Comparing:</span>
            <span className="text-white font-bold">{selectedChar.name}</span>
            <span className="text-[rgba(255,255,255,0.3)]">({selectedScore})</span>
            <span className="text-[rgba(255,255,255,0.2)]">—</span>
            <span className="text-[rgba(255,255,255,0.4)]">Click another to compare</span>
            <button
              onClick={() => setSelectedSlug(null)}
              className="ml-auto text-[rgba(255,255,255,0.3)] hover:text-white text-xs transition-colors btn-press"
            >
              ✕ Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rankings List (remaining after top 3, or all if filtered) */}
      <div className="space-y-2">
        {(tierFilter !== 'all' || top3.length < 3 ? ranked : remaining).map((char, i) => {
          const actualIndex = tierFilter !== 'all' || top3.length < 3 ? i : i + 3;
          const total = sortBy === 'total' ? getTotalStats(char.stats) : char.stats[sortBy];
          const topStat = getTopStat(char.stats);
          const rank = actualIndex + 1;
          const isSelected = selectedSlug === char.slug;
          const scoreDiff = selectedSlug && selectedSlug !== char.slug ? total - selectedScore : 0;

          return (
            <motion.div
              key={char.slug}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: Math.min(actualIndex * 0.03, 0.8), ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleSelect(char.slug)}
              className={`
                flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl cursor-pointer
                bg-[#141414] border transition-all duration-200
                rankings-tier-strip ${tierStripClasses[char.powerTier] || ''}
                rankings-entry-glow glass-card glass-card-hover
                hover:bg-[#1A1A1A] hover:border-[rgba(255,255,255,0.12)]
                ${isSelected ? 'rankings-selected' : ''}
                ${highlightStat ? 'hover:border-[rgba(255,255,255,0.2)]' : ''}
              `}
              style={{
                borderLeft: `3px solid ${tierColors[char.powerTier] || '#616161'}`,
                '--glow-color': char.haloColor,
              } as React.CSSProperties}
              // Dynamic hover glow via inline style
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = `0 0 20px ${char.haloColor}15, inset 0 0 20px ${char.haloColor}08`;
                if (!isSelected) el.style.borderColor = `${char.haloColor}30`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = '';
                if (!isSelected) el.style.borderColor = '';
              }}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 lg:w-10 text-center">
                <span className="text-[rgba(255,255,255,0.35)] text-sm font-bold font-mono">{rank}</span>
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 relative"
                style={{ borderColor: char.haloColor + '60' }}
              >
                <Image src={char.images.hero} alt={char.name} fill className="object-cover" sizes="48px" />
              </div>

              {/* Name & Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white text-sm lg:text-base font-bold truncate">{char.name}</h3>
                  <span
                    className="power-tier-badge text-[9px] px-2 py-0.5"
                    style={{
                      color: tierColors[char.powerTier],
                      borderColor: tierColors[char.powerTier] + '40',
                      backgroundColor: tierColors[char.powerTier] + '15',
                    }}
                  >
                    {char.powerTier.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[rgba(255,255,255,0.3)] text-xs">{char.realName}</span>
                </div>
              </div>

              {/* Individual stats when explorer is active */}
              {highlightStat && (
                <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                  {['INT', 'STR', 'SPD', 'DUR', 'EP', 'FSK'].map(stat => {
                    const sk = statKeyMap[stat.toLowerCase()];
                    const val = sk ? char.stats[sk] : 0;
                    const isActive = stat === highlightStat;
                    return (
                      <div key={stat} className="flex flex-col items-center">
                        <span className={`text-[8px] font-bold ${isActive ? 'text-[#ED1D24]' : 'text-[rgba(255,255,255,0.2)]'}`}>{stat}</span>
                        <span className={`text-[10px] font-mono ${isActive ? 'text-white' : 'text-[rgba(255,255,255,0.35)]'}`}>{val}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Comparison diff */}
              {selectedSlug && selectedSlug !== char.slug && (
                <div className="flex-shrink-0 text-right min-w-[50px]">
                  <span className={`text-sm font-black font-mono ${scoreDiff > 0 ? 'text-[#76FF03]' : scoreDiff < 0 ? 'text-[#FF1744]' : 'text-[rgba(255,255,255,0.3)]'}`}>
                    {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
                  </span>
                </div>
              )}

              {/* Score */}
              <div className="flex-shrink-0 text-right">
                <div className="text-xl lg:text-2xl font-black font-mono text-[rgba(255,255,255,0.7)]">
                  {total}
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-[rgba(255,255,255,0.25)] text-[9px] font-mono uppercase">
                    {sortBy === 'total' ? topStat.label : statLabels[sortBy]}
                  </span>
                  <span className="text-[rgba(255,255,255,0.4)] text-[9px] font-mono">
                    {sortBy === 'total' ? topStat.value : ''}
                  </span>
                </div>
              </div>

              {/* Animated score bar */}
              <div className="hidden lg:flex flex-shrink-0 flex-col gap-0.5 w-24">
                <div className="rankings-score-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${total}%` }}
                    transition={{ duration: 0.9, delay: actualIndex * 0.03 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="rankings-score-bar-fill"
                    style={{ backgroundColor: char.haloColor }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
