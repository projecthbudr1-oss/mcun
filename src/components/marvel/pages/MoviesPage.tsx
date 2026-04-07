'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clapperboard,
  Search,
  Film,
  Clock,
  DollarSign,
  Star,
  ChevronDown,
  X,
  Users,
  Calendar,
  Award,
  ArrowRight,
} from 'lucide-react';
import { movies, MCU_PHASES, getMoviesByPhase } from '@/data/movies';
import type { MCUMovie } from '@/data/movies';
import { useAppStore } from '@/store/useAppStore';

// ─── Constants ───
const PHASE_COLORS: Record<number, string> = {
  1: '#4FC3F7',
  2: '#FF6D00',
  3: '#76FF03',
  4: '#7C4DFF',
  5: '#ED1D24',
  6: '#E040FB',
};

const SORT_OPTIONS = [
  { label: 'Year (Newest)', value: 'year-desc' },
  { label: 'Year (Oldest)', value: 'year-asc' },
  { label: 'Rating (High)', value: 'rating-desc' },
  { label: 'Rating (Low)', value: 'rating-asc' },
  { label: 'Box Office (High)', value: 'boxoffice-desc' },
  { label: 'Box Office (Low)', value: 'boxoffice-asc' },
  { label: 'Runtime (Long)', value: 'runtime-desc' },
  { label: 'Runtime (Short)', value: 'runtime-asc' },
];

// ─── Helpers ───
function getRtColor(score: number): string {
  if (score >= 80) return '#4CAF50';
  if (score >= 60) return '#FF9800';
  return '#F44336';
}

function getRtLabel(score: number): string {
  if (score >= 80) return 'Fresh';
  if (score >= 60) return 'Rotten';
  return 'Rotten';
}

function formatBoxOffice(millions: number): string {
  if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`;
  return `$${millions}M`;
}

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// ─── Movie Detail Modal ───
function MovieDetailModal({ movie, onClose }: { movie: MCUMovie; onClose: () => void }) {
  const { navigate } = useAppStore();
  const phaseColor = PHASE_COLORS[movie.phase] || '#ED1D24';
  const phaseLabel = MCU_PHASES.find(p => p.phase === movie.phase);

  const handleCharacterClick = useCallback(
    (charSlug: string) => {
      onClose();
      navigate({ type: 'character', slug: charSlug });
    },
    [onClose, navigate],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.85)] backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-hide bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-2xl"
        style={{ boxShadow: `0 0 60px ${phaseColor}15, 0 20px 60px rgba(0,0,0,0.6)` }}
      >
        {/* Phase gradient header */}
        <div
          className="relative h-48 md:h-56 overflow-hidden rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${phaseColor}40 0%, ${phaseColor}15 50%, #141414 100%)`,
          }}
        >
          {/* Large year watermark */}
          <span
            className="absolute -bottom-4 -right-4 text-[10rem] md:text-[14rem] font-[var(--font-oswald)] font-black leading-none opacity-[0.08]"
            style={{ color: phaseColor }}
          >
            {movie.year}
          </span>
          {/* Scanlines */}
          <div className="scanline-overlay" />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(0,0,0,0.7)] transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 -mt-12 relative z-10">
          {/* Phase badge */}
          {phaseLabel && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
              style={{
                backgroundColor: phaseColor + '20',
                color: phaseColor,
                border: `1px solid ${phaseColor}40`,
              }}
            >
              {phaseLabel.label} · {phaseLabel.years}
            </span>
          )}

          {/* Title */}
          <h2 className="font-[var(--font-oswald)] text-white text-2xl md:text-3xl font-bold uppercase tracking-wide mb-3">
            {movie.title}
          </h2>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[rgba(255,255,255,0.5)] mb-5">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {movie.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {formatRuntime(movie.runtime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Award size={13} />
              {movie.director}
            </span>
          </div>

          {/* Description */}
          <p className="text-[rgba(255,255,255,0.65)] text-sm leading-relaxed mb-6">
            {movie.description}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Box Office */}
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
              <div className="flex items-center gap-2 text-[rgba(255,255,255,0.4)] text-xs mb-1">
                <DollarSign size={12} />
                Box Office
              </div>
              <span className="text-white text-xl font-bold count-up">{formatBoxOffice(movie.boxOffice)}</span>
            </div>
            {/* Rotten Tomatoes */}
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
              <div className="flex items-center gap-2 text-[rgba(255,255,255,0.4)] text-xs mb-1">
                <Star size={12} />
                Rotten Tomatoes
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xl font-bold count-up"
                  style={{ color: getRtColor(movie.rottenTomatoes) }}
                >
                  {movie.rottenTomatoes}%
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color: getRtColor(movie.rottenTomatoes),
                    backgroundColor: getRtColor(movie.rottenTomatoes) + '15',
                    border: `1px solid ${getRtColor(movie.rottenTomatoes)}30`,
                  }}
                >
                  {getRtLabel(movie.rottenTomatoes)}
                </span>
              </div>
            </div>
          </div>

          {/* Characters */}
          {movie.characters.length > 0 && (
            <div>
              <h3 className="text-[rgba(255,255,255,0.4)] text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users size={12} />
                {movie.characters.length} {movie.characters.length === 1 ? 'Character' : 'Characters'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.characters.map((charSlug) => (
                  <button
                    key={charSlug}
                    onClick={() => handleCharacterClick(charSlug)}
                    className="btn-press px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)] text-xs hover:text-white hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.08)] transition-all flex items-center gap-1.5"
                  >
                    {charSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    <ArrowRight size={10} className="opacity-40" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ───
export default function MoviesPage() {
  const [search, setSearch] = useState('');
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [sort, setSort] = useState('year-desc');
  const [selectedMovie, setSelectedMovie] = useState<MCUMovie | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const phaseScrollRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!showSortDropdown) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sort-dropdown-area')) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showSortDropdown]);

  // ─── Computed data ───
  const totalBoxOffice = useMemo(() => movies.reduce((s, m) => s + m.boxOffice, 0), []);
  const avgRuntime = useMemo(
    () => Math.round(movies.reduce((s, m) => s + m.runtime, 0) / movies.length),
    [],
  );
  const avgRating = useMemo(
    () => Math.round(movies.reduce((s, m) => s + m.rottenTomatoes, 0) / movies.length),
    [],
  );

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    // Phase filter
    if (activePhase !== null) {
      result = result.filter(m => m.phase === activePhase);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.year.toString().includes(q),
      );
    }

    // Sort
    switch (sort) {
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rottenTomatoes - a.rottenTomatoes);
        break;
      case 'rating-asc':
        result.sort((a, b) => a.rottenTomatoes - b.rottenTomatoes);
        break;
      case 'boxoffice-desc':
        result.sort((a, b) => b.boxOffice - a.boxOffice);
        break;
      case 'boxoffice-asc':
        result.sort((a, b) => a.boxOffice - b.boxOffice);
        break;
      case 'runtime-desc':
        result.sort((a, b) => b.runtime - a.runtime);
        break;
      case 'runtime-asc':
        result.sort((a, b) => a.runtime - b.runtime);
        break;
    }

    return result;
  }, [search, activePhase, sort]);

  // ─── Stagger animation variants ───
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const selectedSortLabel = SORT_OPTIONS.find(s => s.value === sort)?.label || 'Sort';

  return (
    <div className="pt-20 pb-24 px-4 lg:px-8 max-w-[1440px] mx-auto">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Clapperboard size={28} className="text-[#ED1D24]" />
          <h1 className="text-shimmer font-[var(--font-oswald)] text-4xl lg:text-5xl font-bold uppercase tracking-wide text-gradient">
            MCU Movies
          </h1>
        </div>
        <p className="text-[rgba(255,255,255,0.4)] text-sm ml-10">
          The complete Marvel Cinematic Universe filmography from Phase 1 to Phase 5
        </p>
      </motion.div>

      {/* ── Summary Stats Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {[
          {
            icon: <Film size={16} />,
            label: 'Total Movies',
            value: movies.length.toString(),
            accent: '#ED1D24',
          },
          {
            icon: <DollarSign size={16} />,
            label: 'Total Box Office',
            value: formatBoxOffice(totalBoxOffice),
            accent: '#FF6D00',
          },
          {
            icon: <Clock size={16} />,
            label: 'Avg Runtime',
            value: formatRuntime(avgRuntime),
            accent: '#4FC3F7',
          },
          {
            icon: <Star size={16} />,
            label: 'Avg Rating',
            value: `${avgRating}%`,
            accent: getRtColor(avgRating),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-[rgba(255,255,255,0.35)] text-xs font-medium">
              {stat.icon}
              {stat.label}
            </div>
            <span className="text-white text-xl md:text-2xl font-bold count-up" style={{ color: stat.accent }}>
              {stat.value}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── Controls Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-4 mb-6"
      >
        {/* Search + Sort row */}
        <div className="flex items-center gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies, directors..."
              className="w-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none focus:border-[#ED1D24]/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)] hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative sort-dropdown-area" ref={sortRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] text-sm text-[rgba(255,255,255,0.6)] hover:text-white hover:border-[rgba(255,255,255,0.15)] transition-all min-h-[44px] min-w-[160px] justify-between"
            >
              <span className="truncate">{selectedSortLabel}</span>
              <motion.span animate={{ rotate: showSortDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} />
              </motion.span>
            </button>

            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-[#1A1A1A] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                        sort === option.value
                          ? 'bg-[#ED1D24]/10 text-[#ED1D24]'
                          : 'text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Phase filter pills */}
        <div ref={phaseScrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          <button
            onClick={() => setActivePhase(null)}
            className={`btn-press flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 min-h-[44px] ${
              activePhase === null
                ? 'bg-white/10 border-[rgba(255,255,255,0.25)] text-white'
                : 'text-[rgba(255,255,255,0.4)] border-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.7)] hover:border-[rgba(255,255,255,0.15)]'
            }`}
          >
            All Phases
          </button>
          {MCU_PHASES.map((phase) => {
            const isActive = activePhase === phase.phase;
            const movieCount = getMoviesByPhase(phase.phase).length;
            return (
              <button
                key={phase.phase}
                onClick={() => setActivePhase(isActive ? null : phase.phase)}
                className={`btn-press flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 min-h-[44px] ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-[rgba(255,255,255,0.4)] border-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.7)] hover:border-[rgba(255,255,255,0.15)]'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: phase.color + '20',
                        borderColor: phase.color + '50',
                        color: phase.color,
                        boxShadow: `0 0 16px ${phase.color}20`,
                      }
                    : {}
                }
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: phase.color }}
                />
                {phase.label}
                <span className="text-[10px] opacity-60">({movieCount})</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Results count ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between mb-5"
      >
        <p className="text-[rgba(255,255,255,0.35)] text-sm">
          Showing{' '}
          <span className="text-white font-semibold">{filteredMovies.length}</span> of{' '}
          <span className="text-white font-semibold">{movies.length}</span> movies
          {activePhase !== null && (
            <span>
              {' '}
              in{' '}
              <span
                className="font-semibold"
                style={{ color: MCU_PHASES.find(p => p.phase === activePhase)?.color }}
              >
                {MCU_PHASES.find(p => p.phase === activePhase)?.label}
              </span>
            </span>
          )}
        </p>
        {(search || activePhase !== null) && (
          <button
            onClick={() => {
              setSearch('');
              setActivePhase(null);
            }}
            className="text-[rgba(255,255,255,0.4)] text-xs hover:text-[#ED1D24] transition-colors flex items-center gap-1"
          >
            <X size={12} /> Clear Filters
          </button>
        )}
      </motion.div>

      {/* ── Movie Grid ── */}
      {filteredMovies.length > 0 ? (
        <motion.div
          key={`${activePhase}-${sort}-${search}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filteredMovies.map((movie) => {
            const phaseColor = PHASE_COLORS[movie.phase] || '#ED1D24';
            const phaseLabel = MCU_PHASES.find(p => p.phase === movie.phase);

            return (
              <motion.div
                key={movie.slug}
                variants={cardVariants}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedMovie(movie)}
                  className="movie-card card-glass-hover glass-card-hover w-full text-left group rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[#141414] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    '--hover-color': phaseColor,
                  } as React.CSSProperties}
                >
                  {/* Poster area with phase gradient overlay */}
                  <div
                    className="relative h-44 overflow-hidden"
                    style={{
                      background: `linear-gradient(145deg, ${phaseColor}25 0%, ${phaseColor}08 40%, #141414 100%)`,
                    }}
                  >
                    {/* Large year watermark */}
                    <span
                      className="absolute -bottom-3 -right-2 text-[7rem] font-[var(--font-oswald)] font-black leading-none opacity-[0.08] select-none"
                      style={{ color: phaseColor }}
                    >
                      {movie.year}
                    </span>

                    {/* Scanlines */}
                    <div className="scanline-overlay" />

                    {/* Phase badge */}
                    {phaseLabel && (
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
                          style={{
                            backgroundColor: phaseColor + '25',
                            color: phaseColor,
                            border: `1px solid ${phaseColor}40`,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: phaseColor }}
                          />
                          {phaseLabel.label}
                        </span>
                      </div>
                    )}

                    {/* RT score badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: getRtColor(movie.rottenTomatoes),
                          border: `1px solid ${getRtColor(movie.rottenTomatoes)}40`,
                        }}
                      >
                        <Star size={10} fill={getRtColor(movie.rottenTomatoes)} />
                        {movie.rottenTomatoes}%
                      </div>
                    </div>

                    {/* Clapperboard icon watermark */}
                    <div className="absolute bottom-3 right-3 z-10 opacity-10">
                      <Clapperboard size={40} style={{ color: phaseColor }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    {/* Subtle gradient overlay at bottom of poster area */}
                    <div
                      className="absolute inset-x-0 top-0 h-8 pointer-events-none"
                      style={{
                        background: `linear-gradient(to bottom, ${phaseColor}10, transparent)`,
                      }}
                    />
                    <div className="p-4">
                      {/* Title */}
                      <h3 className="font-[var(--font-oswald)] text-white text-base font-bold uppercase tracking-wide mb-2 leading-tight group-hover:text-gradient transition-all duration-300">
                        {movie.title}
                      </h3>

                      {/* Director & Runtime */}
                      <div className="flex items-center gap-3 text-[rgba(255,255,255,0.4)] text-xs mb-3">
                        <span className="truncate">{movie.director}</span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Clock size={10} />
                          {formatRuntime(movie.runtime)}
                        </span>
                      </div>

                      {/* Bottom stats row */}
                      <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
                        {/* Box Office */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <DollarSign size={11} className="text-[rgba(255,255,255,0.3)]" />
                          <span className="text-[rgba(255,255,255,0.6)] font-medium">
                            {formatBoxOffice(movie.boxOffice)}
                          </span>
                        </div>

                        {/* Characters count */}
                        {movie.characters.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Users size={11} className="text-[rgba(255,255,255,0.3)]" />
                            <span className="text-[rgba(255,255,255,0.6)] font-medium">
                              {movie.characters.length} {movie.characters.length === 1 ? 'character' : 'characters'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Phase color accent line on hover */}
                      <div
                        className="h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full mt-3"
                        style={{ backgroundColor: phaseColor }}
                      />
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Film size={48} className="text-[rgba(255,255,255,0.1)] mx-auto mb-4" />
          <p className="text-[rgba(255,255,255,0.5)] text-lg mb-2">No movies found</p>
          <p className="text-[rgba(255,255,255,0.3)] text-sm mb-6">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearch('');
              setActivePhase(null);
            }}
            className="cta-button text-xs"
          >
            Clear Filters
          </button>
        </motion.div>
      )}

      {/* ── Phase Breakdown Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 mb-8"
      >
        <div className="section-separator mb-10" />
        <h2 className="font-[var(--font-oswald)] text-white text-2xl md:text-3xl font-bold uppercase tracking-wide mb-6 flex items-center gap-3">
          <Film size={22} className="text-[#ED1D24]" />
          Phase Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MCU_PHASES.filter(p => getMoviesByPhase(p.phase).length > 0).map((phase) => {
            const phaseMovies = getMoviesByPhase(phase.phase);
            const phaseBoxOffice = phaseMovies.reduce((s, m) => s + m.boxOffice, 0);
            const phaseAvgRating = Math.round(
              phaseMovies.reduce((s, m) => s + m.rottenTomatoes, 0) / phaseMovies.length,
            );

            return (
              <motion.div
                key={phase.phase}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 15 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 hover:border-[rgba(255,255,255,0.12)] transition-all group"
                style={{
                  boxShadow: `inset 0 1px 0 0 ${phase.color}15`,
                }}
              >
                {/* Phase header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: phase.color, boxShadow: `0 0 8px ${phase.color}60` }}
                    />
                    <h3
                      className="font-[var(--font-oswald)] text-base font-bold uppercase tracking-wide"
                      style={{ color: phase.color }}
                    >
                      {phase.label}
                    </h3>
                  </div>
                  <span className="text-[rgba(255,255,255,0.3)] text-xs">{phase.years}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-[rgba(255,255,255,0.3)] text-[10px] uppercase tracking-wider mb-0.5">
                      Movies
                    </p>
                    <p className="text-white text-lg font-bold count-up">{phaseMovies.length}</p>
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.3)] text-[10px] uppercase tracking-wider mb-0.5">
                      Box Office
                    </p>
                    <p className="text-white text-lg font-bold count-up">{formatBoxOffice(phaseBoxOffice)}</p>
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.3)] text-[10px] uppercase tracking-wider mb-0.5">
                      Avg Rating
                    </p>
                    <p
                      className="text-lg font-bold count-up"
                      style={{ color: getRtColor(phaseAvgRating) }}
                    >
                      {phaseAvgRating}%
                    </p>
                  </div>
                </div>

                {/* Movie list mini */}
                <div className="flex flex-wrap gap-1.5">
                  {phaseMovies.map((m) => (
                    <span
                      key={m.slug}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.45)] border border-[rgba(255,255,255,0.06)]"
                    >
                      {m.year}
                    </span>
                  ))}
                </div>

                {/* Hover accent line */}
                <div
                  className="h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full mt-4"
                  style={{ backgroundColor: phase.color }}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Movie Detail Modal ── */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
