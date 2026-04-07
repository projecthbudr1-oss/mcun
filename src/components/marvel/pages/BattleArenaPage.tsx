'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Zap, RotateCcw, Flame, History, BarChart3, Award } from 'lucide-react';
import { characters, type MCUCharacter } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';
import { trackAchievement } from '@/lib/achievements';

const STAT_LABELS: { key: keyof MCUCharacter['stats']; label: string }[] = [
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'strength', label: 'Strength' },
  { key: 'speed', label: 'Speed' },
  { key: 'durability', label: 'Durability' },
  { key: 'energyProjection', label: 'Energy Proj.' },
  { key: 'fightingSkills', label: 'Fighting' },
];

// ===== localStorage types =====
interface BattleHistoryEntry {
  winnerSlug: string;
  winnerName: string;
  loserSlug: string;
  loserName: string;
  winnerScore: number;
  loserScore: number;
  timestamp: number;
  statBreakdown: { label: string; a: number; b: number; winner: 'a' | 'b' | 'tie' }[];
}

function getBattleHistory(): BattleHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('mcu-battle-history');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveBattleHistory(entries: BattleHistoryEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mcu-battle-history', JSON.stringify(entries.slice(0, 20)));
}

function getWinStreaks(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('mcu-win-streaks');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveWinStreaks(streaks: Record<string, number>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mcu-win-streaks', JSON.stringify(streaks));
}

function getTotalWins(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('mcu-total-wins');
    return raw ? JSON.parse(raw) : {};
  } catch { return []; }
}

function saveTotalWins(wins: Record<string, number>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mcu-total-wins', JSON.stringify(wins));
}

function getCharacterUsage(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('mcu-character-usage');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveCharacterUsage(usage: Record<string, number>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mcu-character-usage', JSON.stringify(usage));
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function CharacterSelector({ label, selected, onSelect, excludeSlug, winStreaks, totalWins }: {
  label: string;
  selected: MCUCharacter | null;
  onSelect: (c: MCUCharacter) => void;
  excludeSlug?: string;
  winStreaks: Record<string, number>;
  totalWins: Record<string, number>;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const available = characters.filter(c => c.slug !== excludeSlug);
  const filtered = search.trim()
    ? available.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.actorName.toLowerCase().includes(search.toLowerCase())
      )
    : available;

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-wider mb-2 font-semibold">{label}</p>
      {selected ? (
        <motion.div
          key={selected.slug}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden cursor-pointer hover:border-[rgba(255,255,255,0.15)] transition-colors"
          onClick={() => setOpen(!open)}
        >
          <div className="relative h-48">
            <Image src={selected.images.hero} alt={selected.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 300px" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
          </div>
          <div className="p-4 -mt-8 relative z-10">
            <h3 className="text-white font-bold text-lg mb-0.5">{selected.name}</h3>
            <p className="text-[rgba(255,255,255,0.4)] text-xs">{selected.actorName} · {selected.powerTier.toUpperCase()} Tier</p>
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {[selected.haloColor, '#ED1D24', '#4FC3F7'].map((color, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{
                  color,
                  backgroundColor: color + '15',
                  border: `1px solid ${color}30`,
                }}>
                  {i === 0 ? selected.alignment.toUpperCase() : i === 1 ? 'TOTAL: ' + Object.values(selected.stats).reduce((a, b) => a + b, 0) : 'TOP: ' + Math.max(...Object.values(selected.stats))}
                </span>
              ))}
              {/* Win count badge */}
              {totalWins[selected.slug] ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{
                  color: '#FFD54F',
                  backgroundColor: '#FFD54F15',
                  border: '1px solid #FFD54F30',
                }}>
                  {totalWins[selected.slug]}W
                </span>
              ) : null}
            </div>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-full h-48 bg-[#141414] rounded-xl border border-dashed border-[rgba(255,255,255,0.12)] flex flex-col items-center justify-center gap-3 hover:border-[rgba(255,255,255,0.25)] hover:bg-[#1A1A1A] transition-all btn-press"
        >
          <Swords size={28} className="text-[rgba(255,255,255,0.15)]" />
          <span className="text-[rgba(255,255,255,0.3)] text-sm">Select Character</span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-2xl z-20 relative"
          >
            <div className="p-3 border-b border-[rgba(255,255,255,0.06)]">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search characters..."
                className="w-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none focus:border-[#ED1D24]/50"
              />
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-hide">
              {filtered.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => { onSelect(c); setOpen(false); setSearch(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.04)] transition-colors text-left btn-press"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1A1A1A] flex-shrink-0 border border-[rgba(255,255,255,0.08)]">
                    <Image src={c.images.switcher} alt={c.name} width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{c.name}{totalWins[c.slug] ? ` (${totalWins[c.slug]}W)` : ''}</p>
                    <p className="text-[rgba(255,255,255,0.35)] text-xs">{c.actorName}</p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase" style={{ color: c.haloColor }}>
                    {Object.values(c.stats).reduce((a, b) => a + b, 0)}
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-[rgba(255,255,255,0.3)] text-sm text-center py-6">No characters found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatComparisonRow({ label, a, b, colorA, colorB, revealed }: {
  label: string;
  a: number;
  b: number;
  colorA: string;
  colorB: string;
  revealed: boolean;
}) {
  const winner = a > b ? 'a' : b > a ? 'b' : 'tie';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
    >
      <div className="flex justify-between text-xs">
        <span className="text-[rgba(255,255,255,0.4)] uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className={`text-xs font-bold ${winner === 'a' ? 'text-white' : 'text-[rgba(255,255,255,0.4)]'}`}>{a}</span>
          </div>
          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: revealed ? `${a}%` : '0%' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{
                backgroundColor: colorA,
                opacity: winner === 'a' ? 1 : 0.4,
              }}
            />
          </div>
        </div>
        <div className="flex-shrink-0 w-6 flex justify-center">
          {winner === 'a' && <Zap size={12} style={{ color: colorA }} />}
          {winner === 'b' && <Zap size={12} style={{ color: colorB }} />}
          {winner === 'tie' && <span className="text-[rgba(255,255,255,0.2)] text-[10px]">=</span>}
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className={`text-xs font-bold ${winner === 'b' ? 'text-white' : 'text-[rgba(255,255,255,0.4)]'}`}>{b}</span>
          </div>
          <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: revealed ? `${b}%` : '0%' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{
                backgroundColor: colorB,
                opacity: winner === 'b' ? 1 : 0.4,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CrossedSwordsIllustration() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <svg viewBox="0 0 100 100" className="absolute left-1 top-0 w-16 h-16" style={{ animation: 'sword-clash 3s ease-in-out infinite', transformOrigin: 'bottom center' }}>
        <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="40" x2="70" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="80" x2="40" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="80" x2="60" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="40" r="3" fill="rgba(237,29,36,0.3)" />
      </svg>
      <svg viewBox="0 0 100 100" className="absolute right-1 top-0 w-16 h-16" style={{ animation: 'sword-clash-reverse 3s ease-in-out infinite', transformOrigin: 'bottom center' }}>
        <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="40" x2="70" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="80" x2="40" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="80" x2="60" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="40" r="3" fill="rgba(237,29,36,0.3)" />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: 'radial-gradient(circle, rgba(237,29,36,0.5), transparent)', animation: 'vs-pulse 1.5s ease-in-out infinite' }} />
    </div>
  );
}

function ConfettiBurst({ color }: { color: string }) {
  const confettiColors = [color, '#FFD54F', '#4FC3F7', '#76FF03', '#FF6D00', '#7C4DFF'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * 360;
        const radians = (angle * Math.PI) / 180;
        const distance = 60 + Math.random() * 100;
        const x = 50 + Math.cos(radians) * distance;
        const y = 50 + Math.sin(radians) * distance;
        const confettiColor = confettiColors[i % confettiColors.length];
        const size = 4 + Math.random() * 6;
        const duration = 1 + Math.random() * 1;
        const delay = Math.random() * 0.3;
        return (
          <div key={i} className="confetti-dot absolute rounded-sm" style={{
            left: `${x}%`, top: `${y}%`, width: size, height: size,
            backgroundColor: confettiColor,
            '--confetti-duration': `${duration}s`,
            '--confetti-delay': `${delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          } as React.CSSProperties} />
        );
      })}
    </div>
  );
}

export default function BattleArenaPage() {
  const { navigate } = useAppStore();
  const [fighterA, setFighterA] = useState<MCUCharacter | null>(null);
  const [fighterB, setFighterB] = useState<MCUCharacter | null>(null);
  const [battling, setBattling] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [winner, setWinner] = useState<'a' | 'b' | 'tie' | null>(null);
  const [vsFlashing, setVsFlashing] = useState(false);

  // History & stats state (lazy init from localStorage)
  const [battleHistory, setBattleHistory] = useState<BattleHistoryEntry[]>(() => getBattleHistory());
  const [winStreaks, setWinStreaks] = useState<Record<string, number>>(() => getWinStreaks());
  const [totalWins, setTotalWins] = useState<Record<string, number>>(() => getTotalWins());
  const [charUsage, setCharUsage] = useState<Record<string, number>>(() => getCharacterUsage());

  // Current active streak info
  const activeStreak = useMemo(() => {
    let maxStreak = 0;
    let streakChar = '';
    for (const [slug, count] of Object.entries(winStreaks)) {
      if (count > maxStreak) {
        maxStreak = count;
        streakChar = slug;
      }
    }
    if (!streakChar) return null;
    const char = characters.find(c => c.slug === streakChar);
    return char ? { character: char, streak: maxStreak } : null;
  }, [winStreaks]);

  // Battle Legends: top 3 by total wins
  const battleLegends = useMemo(() => {
    return Object.entries(totalWins)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([slug, wins]) => {
        const char = characters.find(c => c.slug === slug);
        return char ? { character: char, wins } : null;
      })
      .filter(Boolean) as { character: MCUCharacter; wins: number }[];
  }, [totalWins]);

  // Total stats
  const totalStats = useMemo(() => {
    const totalBattles = battleHistory.length;
    const uniqueChars = Object.keys(charUsage).length;
    const mostUsedSlug = Object.entries(charUsage).sort(([, a], [, b]) => b - a)[0];
    const mostUsedChar = mostUsedSlug ? characters.find(c => c.slug === mostUsedSlug[0]) : null;
    const avgScore = totalBattles > 0
      ? Math.round(battleHistory.reduce((s, b) => s + (b.winnerScore + b.loserScore), 0) / (totalBattles * 2))
      : 0;
    return { totalBattles, uniqueChars, mostUsedChar, avgScore };
  }, [battleHistory, charUsage]);

  const statComparisons = useMemo(() => {
    if (!fighterA || !fighterB) return [];
    return STAT_LABELS.map(({ key, label }) => ({
      label,
      a: fighterA.stats[key],
      b: fighterB.stats[key],
      winner: fighterA.stats[key] > fighterB.stats[key] ? 'a' : fighterB.stats[key] > fighterA.stats[key] ? 'b' : 'tie',
    }));
  }, [fighterA, fighterB]);

  const totalA = fighterA ? Object.values(fighterA.stats).reduce((s, v) => s + v, 0) : 0;
  const totalB = fighterB ? Object.values(fighterB.stats).reduce((s, v) => s + v, 0) : 0;
  const winsA = statComparisons.filter(s => s.winner === 'a').length;
  const winsB = statComparisons.filter(s => s.winner === 'b').length;
  const ties = statComparisons.filter(s => s.winner === 'tie').length;

  const recordBattle = useCallback((winnerResult: 'a' | 'b' | 'tie') => {
    if (!fighterA || !fighterB) return;

    const wChar = winnerResult === 'a' ? fighterA : winnerResult === 'b' ? fighterB : null;
    const lChar = winnerResult === 'a' ? fighterB : winnerResult === 'b' ? fighterA : null;

    const entry: BattleHistoryEntry = {
      winnerSlug: wChar?.slug || '',
      winnerName: wChar?.name || '',
      loserSlug: lChar?.slug || '',
      loserName: lChar?.name || '',
      winnerScore: winnerResult === 'a' ? totalA : totalB,
      loserScore: winnerResult === 'a' ? totalB : totalA,
      timestamp: Date.now(),
      statBreakdown: statComparisons,
    };

    // Save battle history
    const newHistory = [entry, ...getBattleHistory()].slice(0, 20);
    saveBattleHistory(newHistory);
    setBattleHistory(newHistory);

    // Update total wins
    const newWins = { ...getTotalWins() };
    if (wChar) newWins[wChar.slug] = (newWins[wChar.slug] || 0) + 1;
    saveTotalWins(newWins);
    setTotalWins(newWins);

    // Update win streaks
    const newStreaks = { ...getWinStreaks() };
    if (wChar) {
      newStreaks[wChar.slug] = (newStreaks[wChar.slug] || 0) + 1;
    }
    // Reset loser streak
    if (lChar) {
      newStreaks[lChar.slug] = 0;
    }
    saveWinStreaks(newStreaks);
    setWinStreaks(newStreaks);

    // Update character usage
    const newUsage = { ...getCharacterUsage() };
    newUsage[fighterA.slug] = (newUsage[fighterA.slug] || 0) + 1;
    newUsage[fighterB.slug] = (newUsage[fighterB.slug] || 0) + 1;
    saveCharacterUsage(newUsage);
    setCharUsage(newUsage);
  }, [fighterA, fighterB, totalA, totalB, statComparisons]);

  const startBattle = () => {
    if (!fighterA || !fighterB) return;
    setBattling(true);
    setRevealed(false);
    setWinner(null);

    setVsFlashing(true);
    setTimeout(() => setVsFlashing(false), 600);

    setTimeout(() => {
      setRevealed(true);
      setTimeout(() => {
        const battleWinner = totalA > totalB ? 'a' : totalB > totalA ? 'b' : 'tie';
        setWinner(battleWinner);
        setBattling(false);
        recordBattle(battleWinner);
        if (battleWinner !== 'tie') trackAchievement('battles_won');
      }, 1500);
    }, 800);
  };

  const reset = () => {
    setFighterA(null);
    setFighterB(null);
    setBattling(false);
    setRevealed(false);
    setWinner(null);
  };

  const rematch = () => {
    if (!fighterA || !fighterB) return;
    setWinner(null);
    setRevealed(false);
    setBattling(false);
    // Reuse the same characters - just reset battle state
    setTimeout(() => {
      setBattling(true);
      setVsFlashing(true);
      setTimeout(() => setVsFlashing(false), 600);
      setTimeout(() => {
        setRevealed(true);
        setTimeout(() => {
          const battleWinner = totalA > totalB ? 'a' : totalB > totalA ? 'b' : 'tie';
          setWinner(battleWinner);
          setBattling(false);
          recordBattle(battleWinner);
          if (battleWinner !== 'tie') trackAchievement('battles_won');
        }, 1500);
      }, 800);
    }, 300);
  };

  const winnerCharacter = winner === 'a' ? fighterA : winner === 'b' ? fighterB : null;

  return (
    <div className="pt-20 pb-24 px-4 lg:px-8 max-w-[1440px] mx-auto arena-bg">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Swords size={28} className="text-[#ED1D24]" />
          <h1 className="font-[var(--font-oswald)] text-shimmer text-4xl lg:text-5xl font-bold uppercase tracking-wide">
            Battle Arena
          </h1>
          <Swords size={28} className="text-[#ED1D24]" />
        </div>
        <p className="text-[rgba(255,255,255,0.4)] text-sm max-w-md mx-auto">
          Choose two characters and watch them battle stat-by-stat. The higher total power wins!
        </p>
      </motion.div>

      {/* Win Streak Banner */}
      <AnimatePresence>
        {activeStreak && activeStreak.streak >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 max-w-lg mx-auto"
          >
            <div className="bg-[#141414] rounded-xl border border-[rgba(255,87,34,0.2)] p-3 flex items-center gap-3 justify-center" style={{ boxShadow: '0 0 20px rgba(255,87,34,0.1)' }}>
              <Flame size={20} className="text-orange-500 fire-glow" />
              <span className="text-[rgba(255,255,255,0.6)] text-xs uppercase tracking-wider font-semibold">Win Streak</span>
              <div className="w-7 h-7 rounded-full overflow-hidden border border-orange-500/50">
                <Image src={activeStreak.character.images.switcher} alt={activeStreak.character.name} width={28} height={28} className="w-full h-full object-cover" />
              </div>
              <span className="text-white text-sm font-bold">{activeStreak.character.name}</span>
              <span className="text-orange-400 text-sm font-black font-mono">{activeStreak.streak}W 🔥</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Selection */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative">
        <CharacterSelector label="Fighter 1" selected={fighterA} onSelect={setFighterA} excludeSlug={fighterB?.slug} winStreaks={winStreaks} totalWins={totalWins} />

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 mt-24 z-30">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#0A0A0A] border-2 border-[#ED1D24] flex items-center justify-center shadow-lg shadow-red-900/20">
              <span className="font-[var(--font-oswald)] text-[#ED1D24] font-bold text-lg vs-pulse vs-lightning">VS</span>
            </div>
            <AnimatePresence>
              {vsFlashing && (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 0], scale: [0.5, 1.8, 2.5] }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 rounded-full bg-[#ED1D24] pointer-events-none" style={{ zIndex: -1 }} />
              )}
            </AnimatePresence>
          </div>
        </div>

        <CharacterSelector label="Fighter 2" selected={fighterB} onSelect={setFighterB} excludeSlug={fighterA?.slug} winStreaks={winStreaks} totalWins={totalWins} />
      </motion.div>

      {/* Battle Controls */}
      {fighterA && fighterB && !winner && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
          <button onClick={startBattle} disabled={battling} className="cta-button text-sm px-10 py-4 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed btn-press">
            {battling ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Swords size={16} /></motion.div>
            ) : <Zap size={16} />}
            {battling ? 'Battle In Progress...' : 'Start Battle!'}
          </button>
        </motion.div>
      )}

      {/* Stat Comparison */}
      <AnimatePresence>
        {(revealed || winner) && fighterA && fighterB && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.06)] p-6 lg:p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: fighterA.haloColor }}>
                  <Image src={fighterA.images.switcher} alt={fighterA.name} width={48} height={48} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{fighterA.name}</p>
                  <p className="text-xs" style={{ color: fighterA.haloColor }}>{totalA} total</p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-[var(--font-oswald)] text-[rgba(255,255,255,0.2)] font-bold text-2xl">VS</p>
                <p className="text-[10px] text-[rgba(255,255,255,0.3)]">{winsA}W - {ties}T - {winsB}W</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white font-bold text-sm">{fighterB.name}</p>
                  <p className="text-xs" style={{ color: fighterB.haloColor }}>{totalB} total</p>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: fighterB.haloColor }}>
                  <Image src={fighterB.images.switcher} alt={fighterB.name} width={48} height={48} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="space-y-5">
              {statComparisons.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.4 }}>
                  <StatComparisonRow label={stat.label} a={stat.a} b={stat.b} colorA={fighterA.haloColor} colorB={fighterB.haloColor} revealed={revealed} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winner Reveal */}
      <AnimatePresence>
        {winner && winnerCharacter && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative bg-[#141414] rounded-2xl border-2 overflow-hidden p-8 text-center battle-winner-glow mb-8" style={{ '--winner-color': winnerCharacter.haloColor } as React.CSSProperties}>
            <ConfettiBurst color={winnerCharacter.haloColor} />
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <Trophy size={48} className="mx-auto mb-4" style={{ color: winnerCharacter.haloColor }} />
            </motion.div>
            <motion.h2 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="font-[var(--font-oswald)] text-white text-3xl lg:text-4xl font-bold uppercase mb-2">
              {winnerCharacter.name} Wins!
            </motion.h2>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-3 mb-4">
              <span className="text-[rgba(255,255,255,0.4)] text-sm">{fighterA!.name} {totalA}</span>
              <span className="font-[var(--font-oswald)] text-[#ED1D24] font-bold text-lg">{totalA} - {totalB}</span>
              <span className="text-[rgba(255,255,255,0.4)] text-sm">{totalB} {fighterB!.name}</span>
            </motion.div>
            <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }} className="text-[rgba(255,255,255,0.4)] text-sm mb-6">
              {winner === 'tie' ? 'A perfect tie!' : `${winnerCharacter.name} wins ${winsA > winsB ? winsA : winsB} to ${winsA > winsB ? winsB : winsA} with ${Math.abs(totalA - totalB)} point margin!`}
            </motion.p>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={rematch} className="cta-button text-xs inline-flex items-center gap-2 btn-press">
                <RotateCcw size={14} />
                Rematch
              </button>
              <button onClick={reset} className="px-5 py-3 rounded-lg text-sm font-semibold text-white border border-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)] transition-all btn-press">
                New Battle
              </button>
              <button onClick={() => navigate({ type: 'character', slug: winnerCharacter.slug })} className="px-5 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 btn-press" style={{ backgroundColor: winnerCharacter.haloColor }}>
                View Character
              </button>
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${winnerCharacter.haloColor}10 0%, transparent 70%)` }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tie */}
      <AnimatePresence>
        {winner === 'tie' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.12)] p-8 text-center mb-8">
            <Trophy size={48} className="mx-auto mb-4 text-[rgba(255,255,255,0.3)]" />
            <h2 className="font-[var(--font-oswald)] text-white text-3xl font-bold uppercase mb-2">It&apos;s a Tie!</h2>
            <p className="text-[rgba(255,255,255,0.4)] text-sm mb-2">Both fighters are equally matched with {totalA} total power points.</p>
            <p className="text-[rgba(255,255,255,0.3)] text-xs mb-6">{winsA}W - {ties}T - {winsB}W in categories</p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={rematch} className="cta-button text-xs inline-flex items-center gap-2 btn-press"><RotateCcw size={14} />Rematch</button>
              <button onClick={reset} className="cta-button text-xs inline-flex items-center gap-2 btn-press"><RotateCcw size={14} />New Battle</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== BOTTOM PANELS: Stats, Battle Legends, History ===== */}
      {(totalStats.totalBattles > 0 || battleHistory.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          {/* Total Stats Panel */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-[#ED1D24]" />
                <h3 className="font-[var(--font-oswald)] text-white text-sm font-bold uppercase tracking-wider">Arena Stats</h3>
              </div>
              <div className="arena-stats-panel">
                <div className="stat-item">
                  <p className="text-[#ED1D24] text-2xl font-black font-mono">{totalStats.totalBattles}</p>
                  <p className="text-[rgba(255,255,255,0.35)] text-[10px] uppercase tracking-wider mt-1">Battles</p>
                </div>
                <div className="stat-item">
                  <p className="text-[#FFD54F] text-2xl font-black font-mono">{totalStats.uniqueChars}</p>
                  <p className="text-[rgba(255,255,255,0.35)] text-[10px] uppercase tracking-wider mt-1">Characters</p>
                </div>
                <div className="stat-item">
                  <p className="text-white text-lg font-black">{totalStats.mostUsedChar?.name || '—'}</p>
                  <p className="text-[rgba(255,255,255,0.35)] text-[10px] uppercase tracking-wider mt-1">Most Used</p>
                </div>
                <div className="stat-item">
                  <p className="text-[#76FF03] text-2xl font-black font-mono">{totalStats.avgScore}</p>
                  <p className="text-[rgba(255,255,255,0.35)] text-[10px] uppercase tracking-wider mt-1">Avg Score</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Battle Legends */}
          {battleLegends.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={16} className="text-[#FFD54F]" />
                  <h3 className="font-[var(--font-oswald)] text-white text-sm font-bold uppercase tracking-wider">Battle Legends</h3>
                </div>
                <div className="space-y-3">
                  {battleLegends.map((legend, i) => (
                    <div key={legend.character.slug} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                      <span className="text-sm font-black font-mono w-5 text-center" style={{ color: ['#FFD700', '#C0C0C0', '#CD7F32'][i] }}>#{i + 1}</span>
                      <div className="w-8 h-8 rounded-full overflow-hidden border" style={{ borderColor: legend.character.haloColor + '60' }}>
                        <Image src={legend.character.images.switcher} alt={legend.character.name} width={32} height={32} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold truncate">{legend.character.name}</p>
                      </div>
                      <span className="text-[#FFD54F] text-xs font-black font-mono">{legend.wins}W</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Battle History */}
          {battleHistory.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <History size={16} className="text-[#4FC3F7]" />
                  <h3 className="font-[var(--font-oswald)] text-white text-sm font-bold uppercase tracking-wider">Recent Battles</h3>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide pr-1">
                  {battleHistory.map((entry, i) => {
                    const wChar = characters.find(c => c.slug === entry.winnerSlug);
                    const lChar = characters.find(c => c.slug === entry.loserSlug);
                    return (
                      <div key={`${entry.timestamp}-${i}`} className="arena-history-entry">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-[rgba(255,255,255,0.1)] flex-shrink-0">
                          <Image src={wChar?.images.switcher || '/images/placeholder.png'} alt={entry.winnerName} width={28} height={28} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-[11px] font-semibold truncate">
                            <span>{entry.winnerName}</span>
                            <span className="text-[rgba(255,255,255,0.3)] mx-1.5">defeated</span>
                            <span className="text-[rgba(255,255,255,0.6)]">{entry.loserName}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[rgba(255,255,255,0.3)] text-[9px] font-mono">{entry.winnerScore}-{entry.loserScore}</span>
                            <span className="text-[rgba(255,255,255,0.15)] text-[9px]">·</span>
                            <span className="text-[rgba(255,255,255,0.25)] text-[9px]">{formatRelativeTime(entry.timestamp)}</span>
                          </div>
                        </div>
                        <Trophy size={12} className="text-[#FFD54F] flex-shrink-0 opacity-60" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!fighterA && !fighterB && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-8">
          <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-8">
            <CrossedSwordsIllustration />
            <h3 className="text-white text-lg font-semibold mb-2">Ready to Fight?</h3>
            <p className="text-[rgba(255,255,255,0.35)] text-sm mb-6 max-w-sm mx-auto">
              Select two Marvel characters from the roster above and watch them battle it out in a stat showdown.
            </p>
            <p className="text-[rgba(255,255,255,0.25)] text-xs mb-4">Quick picks:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['thor', 'hulk', 'thanos', 'scarlet-witch', 'iron-man', 'captain-america'].map(slug => {
                const c = characters.find(ch => ch.slug === slug);
                if (!c) return null;
                return (
                  <button key={slug} onClick={() => { if (!fighterA) setFighterA(c); else if (!fighterB && c.slug !== fighterA.slug) setFighterB(c); }} className="w-10 h-10 rounded-full overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.25)] transition-all hover:scale-110 btn-press" aria-label={`Select ${c.name}`}>
                    <Image src={c.images.switcher} alt={c.name} width={40} height={40} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
