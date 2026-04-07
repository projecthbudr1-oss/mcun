'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, SkipForward, Users, Shield, Swords, Zap, Play } from 'lucide-react';
import Image from 'next/image';
import { characters } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'avengers', label: 'Avengers' },
  { key: 'guardians', label: 'Guardians' },
  { key: 'villains', label: 'Villains' },
  { key: 'anti-heroes', label: 'Anti-Heroes' },
] as const;

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <Users size={14} />,
  avengers: <Shield size={14} />,
  guardians: <Zap size={14} />,
  villains: <Swords size={14} />,
  'anti-heroes': <Zap size={14} />,
};

function getTeamCategory(char: typeof characters[0]): string {
  const teams = char.teams || [];
  if (teams.includes('avengers')) return 'avengers';
  if (teams.includes('guardians-of-the-galaxy')) return 'guardians';
  if (char.alignment === 'villain') return 'villains';
  if (char.alignment === 'anti-hero') return 'anti-heroes';
  return 'all';
}

export default function SoundboardPage() {
  const { navigate } = useAppStore();
  const [category, setCategory] = useState<string>('all');
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [totalPlayed, setTotalPlayed] = useState(0);
  const [mostPlayed, setMostPlayed] = useState<string>('');
  const [playCounts, setPlayCounts] = useState<Record<string, number>>({});
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const filteredCharacters = useMemo(() => {
    if (category === 'all') return characters;
    return characters.filter(c => getTeamCategory(c) === category);
  }, [category]);

  // Featured quote rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex(i => (i + 1) % filteredCharacters.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [filteredCharacters.length]);

  // Reset featured index when category changes
  const [prevCategory, setPrevCategory] = useState(category);
  if (category !== prevCategory) {
    setPrevCategory(category);
    setFeaturedIndex(0);
  }

  const playQuote = useCallback((char: typeof characters[0]) => {
    // Stop if already playing same
    if (playingSlug === char.slug) {
      window.speechSynthesis.cancel();
      setPlayingSlug(null);
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(char.quote.text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utteranceRef.current = utterance;

    utterance.onend = () => {
      setPlayingSlug(null);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setPlayingSlug(null);
      utteranceRef.current = null;
    };

    setPlayingSlug(char.slug);
    window.speechSynthesis.speak(utterance);

    // Track stats
    setTotalPlayed(t => t + 1);
    setPlayCounts(prev => {
      const updated = { ...prev, [char.slug]: (prev[char.slug] || 0) + 1 };
      const maxSlug = Object.entries(updated).sort(([, a], [, b]) => b - a)[0]?.[0];
      if (maxSlug) {
        const maxChar = characters.find(c => c.slug === maxSlug);
        if (maxChar) setMostPlayed(maxChar.name);
      }
      return updated;
    });
  }, [playingSlug]);

  const stopAll = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlayingSlug(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const featuredChar = filteredCharacters[featuredIndex] || characters[0];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 lg:px-8 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 mt-4"
      >
        <div className="flex items-center gap-3 mb-2">
          {/* Animated waveform bars next to title */}
          <div className="flex items-end gap-[3px] h-6">
            <span className="speaking-bar text-[#ED1D24]" style={{ animationDelay: '0s', height: '8px' }} />
            <span className="speaking-bar text-[#ED1D24]" style={{ animationDelay: '0.15s', height: '16px' }} />
            <span className="speaking-bar text-[#ED1D24]" style={{ animationDelay: '0.3s', height: '10px' }} />
          </div>
          <h1 className="font-[var(--font-oswald)] text-3xl md:text-4xl font-bold text-white uppercase tracking-wide">
            MCU Soundboard
          </h1>
        </div>
        <p className="text-[rgba(255,255,255,0.45)] text-sm max-w-lg">
          Hear iconic quotes from your favorite Marvel characters. Click any character to hear their words.
        </p>
      </motion.div>

      {/* Featured Quote */}
      <motion.div
        key={featuredChar.slug}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 p-5 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md relative overflow-hidden"
      >
        {/* Scanline overlay for cinema feel */}
        <div className="scanline-overlay" />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 80% 20%, ${featuredChar.haloColor}30 0%, transparent 60%)`,
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Play size={12} className="text-[#ED1D24]" />
            <span className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest font-medium">Featured Quote</span>
          </div>
          <blockquote className="text-white text-lg md:text-xl italic leading-relaxed mb-3 font-light">
            &ldquo;{featuredChar.quote.text}&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full overflow-hidden border border-[rgba(255,255,255,0.2)]"
              style={{ borderColor: `${featuredChar.haloColor}60` }}
            >
              <Image
                src={featuredChar.images.switcher}
                alt={featuredChar.name}
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
            <span className="text-white text-sm font-medium">{featuredChar.name}</span>
            <span className="text-[rgba(255,255,255,0.3)] text-xs">— {featuredChar.quote.source}</span>
          </div>
        </div>
      </motion.div>

      {/* Category Filters + Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border min-h-[36px] btn-press ${
                category === cat.key
                  ? 'text-white border-[#ED1D24]/40 bg-[#ED1D24]/15'
                  : 'text-[rgba(255,255,255,0.4)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.7)]'
              }`}
            >
              {CATEGORY_ICONS[cat.key]}
              {cat.label}
            </button>
          ))}
        </div>
        {playingSlug && (
          <button
            onClick={stopAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.08)] hover:border-red-500/50 hover:text-red-400 transition-all btn-press"
          >
            <VolumeX size={11} />
            Stop
          </button>
        )}
      </motion.div>

      {/* Session Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex flex-wrap gap-4 text-xs text-[rgba(255,255,255,0.35)]"
      >
        <span className="inline-flex items-center gap-1.5">
          <Volume2 size={11} />
          Quotes played: <span className="text-white font-medium">{totalPlayed}</span>
        </span>
        {mostPlayed && (
          <span className="inline-flex items-center gap-1.5">
            <SkipForward size={11} />
            Most played: <span className="text-white font-medium">{mostPlayed}</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Users size={11} />
          Showing: <span className="text-white font-medium">{filteredCharacters.length}</span>
        </span>
      </motion.div>

      {/* Soundboard Grid */}
      <motion.div
        key={category}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
      >
        {filteredCharacters.map((char, i) => {
          const isPlaying = playingSlug === char.slug;
          const count = playCounts[char.slug] || 0;
          return (
            <motion.button
              key={char.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => playQuote(char)}
              className={`relative group rounded-xl border p-3 text-left transition-all duration-300 min-h-[120px] btn-press card-glass-hover ${
                isPlaying
                  ? 'border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)] shadow-lg'
                  : 'border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]'
              }`}
              style={isPlaying ? {
                boxShadow: `0 0 30px ${char.haloColor}25, 0 0 60px ${char.haloColor}10`,
                borderColor: `${char.haloColor}40`,
              } : {}}
            >
              {/* Halo glow on playing */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${char.haloColor}15 0%, transparent 70%)`,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full overflow-hidden border mb-2 relative"
                style={{ borderColor: `${char.haloColor}40` }}
              >
                <Image
                  src={char.images.switcher}
                  alt={char.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="flex items-end gap-[2px] h-3">
                      <span className="w-[3px] rounded-full bg-[#ED1D24] animate-[speaking-wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
                      <span className="w-[3px] rounded-full bg-[#ED1D24] animate-[speaking-wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.15s' }} />
                      <span className="w-[3px] rounded-full bg-[#ED1D24] animate-[speaking-wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.3s' }} />
                      <span className="w-[3px] rounded-full bg-[#ED1D24] animate-[speaking-wave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.45s' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-white text-xs font-bold uppercase tracking-wide leading-tight mb-1 truncate group-hover:text-[#ED1D24] transition-colors">
                {char.name}
              </h3>

              {/* Quote preview */}
              <p className="text-[rgba(255,255,255,0.35)] text-[10px] leading-snug line-clamp-2 italic">
                &ldquo;{char.quote.text}&rdquo;
              </p>

              {/* Play count badge */}
              {count > 0 && (
                <span className="absolute top-1.5 right-1.5 text-[8px] font-bold text-[rgba(255,255,255,0.3)]">
                  {count}x
                </span>
              )}

              {/* Alignment badge */}
              <span
                className="absolute bottom-1.5 left-1.5 text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  background: `${char.alignment === 'hero' ? '#4CAF5020' : char.alignment === 'villain' ? '#F4433620' : char.alignment === 'anti-hero' ? '#FF980020' : '#9E9E9E20'}`,
                  color: `${char.alignment === 'hero' ? '#4CAF50' : char.alignment === 'villain' ? '#F44336' : char.alignment === 'anti-hero' ? '#FF9800' : '#9E9E9E'}`,
                }}
              >
                {char.alignment}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
