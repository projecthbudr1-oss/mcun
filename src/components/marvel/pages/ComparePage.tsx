'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ChevronDown, AlertTriangle, Swords, Share2 } from 'lucide-react';
import { characters, getCharacterBySlug, defaultCompareCharacters, type MCUCharacter } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';
import ShareButton from '@/components/marvel/ShareButton';

const STAT_LABELS: { key: keyof MCUCharacter['stats']; label: string }[] = [
  { key: 'intelligence', label: 'INT' },
  { key: 'strength', label: 'STR' },
  { key: 'speed', label: 'SPD' },
  { key: 'durability', label: 'DUR' },
  { key: 'energyProjection', label: 'EP' },
  { key: 'fightingSkills', label: 'FSK' },
];

function CharStatBar({ char, statKey, label, winner, side, isThreeWay }: { char: MCUCharacter; statKey: keyof MCUCharacter['stats']; label: string; winner?: 'a' | 'b' | 'c' | 'tie'; side: 'a' | 'b' | 'c'; isThreeWay?: boolean }) {
  const value = char.stats[statKey];
  const isWinner = winner === side;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1">
        <span className="text-[rgba(255,255,255,0.4)]">{label}</span>
        <span
          className={`font-bold ${isWinner ? 'stat-winner-glow px-2 py-0.5 rounded' : ''}`}
          style={isWinner ? { color: char.haloColor, '--winner-color': char.haloColor + '60' } as React.CSSProperties : winner !== 'tie' ? { color: 'rgba(255,255,255,0.5)' } : {}}
        >
          {value}
        </span>
      </div>
      <div className={`stat-bar-fill stat-bar-shimmer ${isThreeWay ? '' : ''} ${isWinner ? 'stat-winner-glow' : ''}`} style={isWinner ? { '--winner-color': char.haloColor + '40' } as React.CSSProperties : {}}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: char.haloColor }}
        />
      </div>
    </div>
  );
}

function CharSelectPanel({ char, side, allSlugs, onSelect }: { char: MCUCharacter | undefined; side: string; allSlugs: string[]; onSelect: (slug: string) => void }) {
  const [open, setOpen] = useState(false);
  const available = characters.filter(c => !allSlugs.includes(c.slug) || c.slug === char?.slug);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-[rgba(255,255,255,0.5)] hover:text-white transition-colors px-2 py-1 rounded border border-[rgba(255,255,255,0.08)] btn-press"
      >
        Change <ChevronDown size={12} />
      </button>
      <AnimatePresence>
        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] rounded-lg border border-[rgba(255,255,255,0.12)] overflow-hidden z-50 max-h-[300px] overflow-y-auto scrollbar-hide shadow-2xl">
            {available.map(c => (
              <button
                key={c.slug}
                onClick={() => { onSelect(c.slug); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[rgba(255,255,255,0.06)] transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={c.images.switcher} alt={c.name} width={24} height={24} className="w-full h-full object-cover" />
                </div>
                <span className="text-white text-xs truncate">{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CharacterPanel({ char, side, otherSlugs, onSelect, stats, statBarsData, isThreeWay, index }: {
  char: MCUCharacter;
  side: 'a' | 'b' | 'c';
  otherSlugs: string[];
  onSelect: (slug: string) => void;
  stats: typeof STAT_LABELS;
  statBarsData: { winner: 'a' | 'b' | 'c' | 'tie'; values: { a: number; b: number; c: number } }[];
  isThreeWay: boolean;
  index: number;
}) {
  const total = Object.values(char.stats).reduce((s, v) => s + v, 0);
  const othersTotal = stats.map((_, i) => {
    if (i === index) return 0;
    const otherChar = index === 0 ? 1 : 0;
    return 0; // simplified
  }).reduce((s, v) => s + v, 0);

  return (
    <motion.div
      className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-6 glass-card glass-card-elevated"
      initial={{ opacity: 0, x: index === 0 ? -30 : index === 1 ? 0 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider font-bold">{side === 'a' ? 'Fighter 1' : side === 'b' ? 'Fighter 2' : 'Fighter 3'}</span>
        <CharSelectPanel char={char} side={side} allSlugs={otherSlugs} onSelect={onSelect} />
      </div>

      <div className="relative flex justify-center mb-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full" style={{ background: `radial-gradient(circle, ${char.haloColor}20, transparent 70%)` }} />
        </div>
        <div className="relative w-40 h-52">
          <Image src={char.images.hero} alt={char.name} width={160} height={208} className="w-full h-full object-contain" />
        </div>
      </div>

      <h2 className="font-[var(--font-oswald)] text-white text-xl lg:text-2xl font-bold uppercase text-center mb-0.5">{char.name}</h2>
      <p className="text-[rgba(255,255,255,0.35)] text-xs text-center mb-6">{char.actorName}</p>

      {stats.map(({ key, label }, i) => (
        <CharStatBar
          key={key}
          char={char}
          statKey={key}
          label={label}
          winner={statBarsData[i]?.winner}
          side={side}
          isThreeWay={isThreeWay}
        />
      ))}

      <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] text-center">
        <span className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-wider">Total: </span>
        <span className="text-white font-bold text-lg count-up" style={{ color: char.haloColor }}>{total}</span>
      </div>
    </motion.div>
  );
}

export default function ComparePage() {
  const { currentPage, showToast } = useAppStore();
  const [mode, setMode] = useState<'2way' | '3way'>('2way');

  // 2-way state
  const [charASlug, setCharASlug] = useState(currentPage.type === 'compare' ? (currentPage.a || defaultCompareCharacters[0]) : defaultCompareCharacters[0]);
  const [charBSlug, setCharBSlug] = useState(currentPage.type === 'compare' ? (currentPage.b || defaultCompareCharacters[1]) : defaultCompareCharacters[1]);

  // 3-way state
  const [charCSlug, setCharCSlug] = useState('thor');

  // Votes
  const [votes, setVotes] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem('marvel-compare-votes');
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  const charA = useMemo(() => getCharacterBySlug(charASlug), [charASlug]);
  const charB = useMemo(() => getCharacterBySlug(charBSlug), [charBSlug]);
  const charC = useMemo(() => getCharacterBySlug(charCSlug), [charCSlug]);

  const isThreeWay = mode === '3way';
  const usedSlugs = isThreeWay ? [charASlug, charBSlug, charCSlug].filter(Boolean) : [charASlug, charBSlug].filter(Boolean);
  const uniqueSlugs = [...new Set(usedSlugs)];
  const hasDuplicates = usedSlugs.length !== uniqueSlugs.length;

  // Calculate stat bars
  const statBarsData = useMemo(() => {
    return STAT_LABELS.map(({ key }) => {
      const vA = charA?.stats[key] ?? 0;
      const vB = charB?.stats[key] ?? 0;
      const vC = charC?.stats[key] ?? 0;

      if (isThreeWay && charC) {
        const max = Math.max(vA, vB, vC);
        const min = Math.min(vA, vB, vC);
        if (max === min) return { winner: 'tie' as const, values: { a: vA, b: vB, c: vC } };
        if (vA === max) return { winner: 'a' as const, values: { a: vA, b: vB, c: vC } };
        if (vB === max) return { winner: 'b' as const, values: { a: vA, b: vB, c: vC } };
        return { winner: 'c' as const, values: { a: vA, b: vB, c: vC } };
      }
      if (vA > vB) return { winner: 'a' as const, values: { a: vA, b: vB, c: 0 } };
      if (vB > vA) return { winner: 'b' as const, values: { a: vA, b: vB, c: 0 } };
      return { winner: 'tie' as const, values: { a: vA, b: vB, c: 0 } };
    });
  }, [charA, charB, charC, isThreeWay]);

  // Score summary for 3-way
  const scores = useMemo(() => {
    if (!isThreeWay) return null;
    const wins: Record<string, number> = { a: 0, b: 0, c: 0 };
    const ties: Record<string, number> = { a: 0, b: 0, c: 0 };
    statBarsData.forEach(s => {
      if (s.winner === 'tie') { wins.a++; wins.b++; wins.c++; ties.a++; ties.b++; ties.c++; }
      else { wins[s.winner]++; }
    });
    return { wins, ties };
  }, [statBarsData, isThreeWay]);

  // Vote handling
  const handleVote = (winner: string) => {
    const key = isThreeWay
      ? `${charASlug}-vs-${charBSlug}-vs-${charCSlug}`
      : `${charASlug}-vs-${charBSlug}`;
    const newVotes = { ...votes, [key]: winner };
    setVotes(newVotes);
    localStorage.setItem('marvel-compare-votes', JSON.stringify(newVotes));
    let winnerName: string | undefined;
    if (isThreeWay) {
      if (winner === charASlug) winnerName = charA?.name;
      if (winner === charBSlug) winnerName = charB?.name;
      if (winner === charCSlug) winnerName = charC?.name;
    } else {
      winnerName = winner === charASlug ? charA?.name : charB?.name;
    }
    if (winnerName) showToast(`Voted for ${winnerName}! ⚡`);
  };

  if (!charA || !charB || (isThreeWay && !charC)) return null;

  const totalA = Object.values(charA.stats).reduce((s, v) => s + v, 0);
  const totalB = Object.values(charB.stats).reduce((s, v) => s + v, 0);
  const totalC = charC ? Object.values(charC.stats).reduce((s, v) => s + v, 0) : 0;

  const voteKey = isThreeWay
    ? `${charASlug}-vs-${charBSlug}-vs-${charCSlug}`
    : `${charASlug}-vs-${charBSlug}`;
  const currentVote = votes[voteKey];

  return (
    <div className="pt-20 pb-24 px-4 lg:px-8 max-w-[1440px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
          <h1 className="font-[var(--font-oswald)] text-white text-4xl lg:text-5xl font-bold uppercase tracking-wide">
            Compare
          </h1>
        </div>
        <p className="text-[rgba(255,255,255,0.4)] text-sm text-center mb-6">See how heroes and villains stack up</p>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-10">
          <div className="compare-mode-toggle">
            <button
              className={mode === '2way' ? 'active' : ''}
              onClick={() => setMode('2way')}
            >
              <span className="flex items-center gap-1.5">
                <Swords size={11} />
                2-Way
              </span>
            </button>
            <button
              className={mode === '3way' ? 'active' : ''}
              onClick={() => setMode('3way')}
            >
              <span className="flex items-center gap-1.5">
                <Crown size={11} />
                3-Way
              </span>
            </button>
            <motion.div
              className="absolute top-0 bottom-0 w-[50%] rounded-lg pointer-events-none"
              animate={{
                left: mode === '2way' ? '0%' : '50%',
              }}
              transition={{ type: 'tween', duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'rgba(237,29,36,0.2)' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Duplicate Warning */}
      {hasDuplicates && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6 max-w-md mx-auto"
        >
          <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
          <span className="text-amber-400 text-sm font-medium">Select different characters for comparison</span>
        </motion.div>
      )}

      {/* 3-Way Score Summary */}
      {isThreeWay && scores && (
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8 p-4 bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] max-w-xl mx-auto glass-card"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.4)]">
            <span className="font-bold text-white uppercase">Score:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="compare-score-badge" style={{ backgroundColor: charA.haloColor + '20', color: charA.haloColor }}>
              {charA.name.split(' ')[0]}: {scores.wins.a}W
            </span>
            <span className="compare-score-badge" style={{ backgroundColor: charB.haloColor + '20', color: charB.haloColor }}>
              {charB.name.split(' ')[0]}: {scores.wins.b}W
            </span>
            <span className="compare-score-badge" style={{ backgroundColor: charC.haloColor + '20', color: charC.haloColor }}>
              {charC.name.split(' ')[0]}: {scores.wins.c}W
            </span>
          </div>
        </motion.div>
      )}

      {/* 2-Way Mode */}
      {!isThreeWay && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-start">
          <CharacterPanel
            char={charA}
            side="a"
            otherSlugs={[charBSlug]}
            onSelect={setCharASlug}
            stats={STAT_LABELS}
            statBarsData={statBarsData}
            isThreeWay={false}
            index={0}
          />

          {/* VS Divider */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center gap-4 py-20"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="font-[var(--font-oswald)] text-6xl font-black text-[rgba(255,255,255,0.08)] select-none vs-pulse">VS</div>
          </motion.div>

          {/* Mobile VS + Poll */}
          <motion.div
            className="lg:hidden bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-6 glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="font-[var(--font-oswald)] text-3xl font-black text-[rgba(255,255,255,0.08)] text-center select-none vs-pulse mb-4">VS</div>
            <h3 className="text-white text-sm font-semibold text-center mb-3">Who Would Win?</h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleVote(charASlug)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors btn-press"
                style={{
                  borderColor: currentVote === charASlug ? charA.haloColor : 'rgba(255,255,255,0.1)',
                  backgroundColor: currentVote === charASlug ? charA.haloColor + '20' : 'transparent',
                  color: currentVote === charASlug ? charA.haloColor : 'rgba(255,255,255,0.6)',
                }}
              >
                {charA.name}
              </button>
              <button
                onClick={() => handleVote(charBSlug)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors btn-press"
                style={{
                  borderColor: currentVote === charBSlug ? charB.haloColor : 'rgba(255,255,255,0.1)',
                  backgroundColor: currentVote === charBSlug ? charB.haloColor + '20' : 'transparent',
                  color: currentVote === charBSlug ? charB.haloColor : 'rgba(255,255,255,0.6)',
                }}
              >
                {charB.name}
              </button>
            </div>
            {currentVote && (
              <div className="mt-3 flex h-2 rounded-full overflow-hidden bg-[rgba(255,255,255,0.06)]">
                <div className="h-full transition-all duration-500" style={{ width: `${currentVote === charASlug ? 100 : currentVote ? 0 : 50}%`, backgroundColor: charA.haloColor }} />
                <div className="h-full transition-all duration-500" style={{ width: `${currentVote === charBSlug ? 100 : currentVote ? 0 : 50}%`, backgroundColor: charB.haloColor }} />
              </div>
            )}
          </motion.div>

          <CharacterPanel
            char={charB}
            side="b"
            otherSlugs={[charASlug]}
            onSelect={setCharBSlug}
            stats={STAT_LABELS}
            statBarsData={statBarsData}
            isThreeWay={false}
            index={1}
          />
        </div>
      )}

      {/* 3-Way Mode */}
      {isThreeWay && (
        <>
          {/* Mobile VS badges */}
          <div className="flex items-center justify-center gap-2 lg:hidden mb-4">
            <span className="text-white text-xs font-bold px-2 py-1 rounded" style={{ color: charA.haloColor }}>{charA.name.split(' ')[0]}</span>
            <div className="font-[var(--font-oswald)] text-xl font-black text-[rgba(255,255,255,0.08)] vs-pulse">VS</div>
            <span className="text-white text-xs font-bold px-2 py-1 rounded" style={{ color: charB.haloColor }}>{charB.name.split(' ')[0]}</span>
            <div className="font-[var(--font-oswald)] text-xl font-black text-[rgba(255,255,255,0.08)] vs-pulse">VS</div>
            <span className="text-white text-xs font-bold px-2 py-1 rounded" style={{ color: charC.haloColor }}>{charC.name.split(' ')[0]}</span>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-4 mb-6">
            <span className="text-white text-sm font-bold px-3 py-1 rounded-lg" style={{ color: charA.haloColor, border: `1px solid ${charA.haloColor}30` }}>
              {charA.name}
            </span>
            <div className="font-[var(--font-oswald)] text-2xl font-black text-[rgba(255,255,255,0.08)] vs-pulse">VS</div>
            <span className="text-white text-sm font-bold px-3 py-1 rounded-lg" style={{ color: charB.haloColor, border: `1px solid ${charB.haloColor}30` }}>
              {charB.name}
            </span>
            <div className="font-[var(--font-oswald)] text-2xl font-black text-[rgba(255,255,255,0.08)] vs-pulse">VS</div>
            <span className="text-white text-sm font-bold px-3 py-1 rounded-lg" style={{ color: charC.haloColor, border: `1px solid ${charC.haloColor}30` }}>
              {charC.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <CharacterPanel
              char={charA}
              side="a"
              otherSlugs={[charBSlug, charCSlug]}
              onSelect={setCharASlug}
              stats={STAT_LABELS}
              statBarsData={statBarsData}
              isThreeWay={true}
              index={0}
            />
            <CharacterPanel
              char={charB}
              side="b"
              otherSlugs={[charASlug, charCSlug]}
              onSelect={setCharBSlug}
              stats={STAT_LABELS}
              statBarsData={statBarsData}
              isThreeWay={true}
              index={1}
            />
            <CharacterPanel
              char={charC}
              side="c"
              otherSlugs={[charASlug, charBSlug]}
              onSelect={setCharCSlug}
              stats={STAT_LABELS}
              statBarsData={statBarsData}
              isThreeWay={true}
              index={2}
            />
          </div>

          {/* 3-Way Poll */}
          <motion.div
            className="mt-8 p-6 bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] max-w-xl mx-auto glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h3 className="text-white text-sm font-semibold text-center mb-4">Who Would Win?</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleVote(charASlug)}
                className="flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors btn-press"
                style={{
                  borderColor: currentVote === charASlug ? charA.haloColor : 'rgba(255,255,255,0.1)',
                  backgroundColor: currentVote === charASlug ? charA.haloColor + '20' : 'transparent',
                  color: currentVote === charASlug ? charA.haloColor : 'rgba(255,255,255,0.6)',
                }}
              >
                {charA.name}
              </button>
              <button
                onClick={() => handleVote(charBSlug)}
                className="flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors btn-press"
                style={{
                  borderColor: currentVote === charBSlug ? charB.haloColor : 'rgba(255,255,255,0.1)',
                  backgroundColor: currentVote === charBSlug ? charB.haloColor + '20' : 'transparent',
                  color: currentVote === charBSlug ? charB.haloColor : 'rgba(255,255,255,0.6)',
                }}
              >
                {charB.name}
              </button>
              <button
                onClick={() => handleVote(charCSlug)}
                className="flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors btn-press"
                style={{
                  borderColor: currentVote === charCSlug ? charC.haloColor : 'rgba(255,255,255,0.1)',
                  backgroundColor: currentVote === charCSlug ? charC.haloColor + '20' : 'transparent',
                  color: currentVote === charCSlug ? charC.haloColor : 'rgba(255,255,255,0.6)',
                }}
              >
                {charC.name}
              </button>
            </div>
            {currentVote && (
              <div className="mt-3 flex h-2 rounded-full overflow-hidden bg-[rgba(255,255,255,0.06)]">
                <div className="h-full transition-all duration-500" style={{ width: `${currentVote === charASlug ? 100 : currentVote ? 0 : 33.3}%`, backgroundColor: charA.haloColor }} />
                <div className="h-full transition-all duration-500" style={{ width: `${currentVote === charBSlug ? 100 : currentVote ? 0 : 33.3}%`, backgroundColor: charB.haloColor }} />
                <div className="h-full transition-all duration-500" style={{ width: `${currentVote === charCSlug ? 100 : currentVote ? 0 : 33.3}%`, backgroundColor: charC.haloColor }} />
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Share Comparison */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <ShareButton
          title="MCU Character Comparison"
          text={`Compare ${charA.name} vs ${charB.name}${isThreeWay && charC ? ` vs ${charC.name}` : ''} on Marvel Universe Cinematic Guide`}
          url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#compare?a=${charASlug}&b=${charBSlug}${isThreeWay ? `&c=${charCSlug}` : ''}` : ''}
          variant="button"
          haloColor="#ED1D24"
          ariaLabel="Share this comparison"
        />
      </motion.div>
    </div>
  );
}
