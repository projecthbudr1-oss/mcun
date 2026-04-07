'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Users, Heart, Clock } from 'lucide-react';
import CharacterCard from '@/components/marvel/CharacterCard';
import { CharacterCardSkeleton } from '@/components/marvel/CharacterCardSkeleton';
import { characters, getCharacterBySlug } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';

const alignments = ['all', 'hero', 'villain', 'anti-hero', 'neutral'];
const tiers = ['all', 'cosmic', 'omega', 'alpha', 'beta', 'gamma', 'normal'];
const sortOptions = [
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' },
  { label: 'Most Powerful', value: 'power-desc' },
  { label: 'Least Powerful', value: 'power-asc' },
  { label: 'Most Appearances', value: 'appearances-desc' },
];

const alignmentColors: Record<string, string> = {
  hero: '#76FF03',
  villain: '#FF1744',
  'anti-hero': '#FFC107',
  neutral: '#9E9E9E',
};

function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('marvel-favorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = sessionStorage.getItem('marvel-recently-viewed');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentlyViewed(slug: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentlyViewed().filter(s => s !== slug);
    current.unshift(slug);
    sessionStorage.setItem('marvel-recently-viewed', JSON.stringify(current.slice(0, 6)));
  } catch {
    // Silently fail
  }
}

export default function RosterPage() {
  const { navigate, currentPage } = useAppStore();
  const [search, setSearch] = useState('');
  const [alignment, setAlignment] = useState('all');
  const [tier, setTier] = useState('all');
  const [sort, setSort] = useState('name-asc');
  const [showFilters, setShowFilters] = useState(false);
  // Check if we navigated with favorites filter
  const favoritesFilterActive = currentPage.type === 'roster' && currentPage.filters?.favorites === 'true';
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Skeleton loading state
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);
  const skeletonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Effective favorites state: either user toggled it, or navigated with filter
  const effectiveShowFavorites = showFavoritesOnly || favoritesFilterActive;

  // Track favorites for filtering
  const [favorites, setFavorites] = useState<string[]>([]);
  // Track recently viewed characters
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: syncing from localStorage and sessionStorage after mount
    setFavorites(getFavorites());
    setRecentlyViewed(getRecentlyViewed());
    const updateFavs = () => setFavorites(getFavorites());
    window.addEventListener('favorites-changed', updateFavs);
    window.addEventListener('storage', updateFavs);

    // Listen for character-viewed events and store in sessionStorage
    const handleCharacterViewed = (e: Event) => {
      const detail = (e as CustomEvent<{ slug: string }>).detail;
      if (detail?.slug) {
        addRecentlyViewed(detail.slug);
        setRecentlyViewed(getRecentlyViewed());
      }
    };
    window.addEventListener('character-viewed', handleCharacterViewed);

    return () => {
      window.removeEventListener('favorites-changed', updateFavs);
      window.removeEventListener('storage', updateFavs);
      window.removeEventListener('character-viewed', handleCharacterViewed);
    };
  }, []);

  // Global '/' key shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        searchInputRef.current?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const gridKey = useMemo(() => `${search}-${alignment}-${tier}-${sort}-${effectiveShowFavorites}`, [search, alignment, tier, sort, effectiveShowFavorites]);

  // Show skeletons when filters change using event handlers instead of render-time effects
  const triggerFilterChange = useCallback((action: () => void) => {
    action();
    setIsLoadingSkeleton(true);
    if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
    skeletonTimerRef.current = setTimeout(() => {
      setIsLoadingSkeleton(false);
    }, 600);
  }, []);

  // Create wrapper functions that trigger skeleton loading
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    triggerFilterChange(() => setSearch(e.target.value));
  }, [triggerFilterChange]);

  const handleAlignmentChange = useCallback((val: string) => {
    triggerFilterChange(() => setAlignment(val));
  }, [triggerFilterChange]);

  const handleTierChange = useCallback((val: string) => {
    triggerFilterChange(() => setTier(val));
  }, [triggerFilterChange]);

  const handleSortChange = useCallback((val: string) => {
    triggerFilterChange(() => setSort(val));
  }, [triggerFilterChange]);

  const handleFavoritesToggle = useCallback(() => {
    triggerFilterChange(() => setShowFavoritesOnly(prev => !prev));
  }, [triggerFilterChange, effectiveShowFavorites]);

  const handleClearFilters = useCallback(() => {
    triggerFilterChange(() => {
      setSearch('');
      setAlignment('all');
      setTier('all');
      setSort('name-asc');
      setShowFavoritesOnly(false);
    });
  }, [triggerFilterChange]);

  const filtered = useMemo(() => {
    let result = [...characters];

    // Favorites filter
    if (effectiveShowFavorites) {
      result = result.filter(c => favorites.includes(c.slug));
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.realName?.toLowerCase().includes(q) ||
        c.actorName.toLowerCase().includes(q)
      );
    }

    // Alignment
    if (alignment !== 'all') result = result.filter(c => c.alignment === alignment);
    // Tier
    if (tier !== 'all') result = result.filter(c => c.powerTier === tier);

    // Sort
    switch (sort) {
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'power-desc': result.sort((a, b) => {
        const totalA = Object.values(a.stats).reduce((s, v) => s + v, 0);
        const totalB = Object.values(b.stats).reduce((s, v) => s + v, 0);
        return totalB - totalA;
      }); break;
      case 'power-asc': result.sort((a, b) => {
        const totalA = Object.values(a.stats).reduce((s, v) => s + v, 0);
        const totalB = Object.values(b.stats).reduce((s, v) => s + v, 0);
        return totalA - totalB;
      }); break;
      case 'appearances-desc': result.sort((a, b) => b.appearances.length - a.appearances.length); break;
    }

    return result;
  }, [search, alignment, tier, sort, effectiveShowFavorites, favorites]);

  const hasActiveFilters = search || alignment !== 'all' || tier !== 'all' || effectiveShowFavorites;

  return (
    <div className="pt-20 pb-24 px-4 lg:px-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-2">
          <h1 className="font-[var(--font-oswald)] text-white text-4xl lg:text-5xl font-bold uppercase tracking-wide">
            Character Roster
          </h1>
          {/* Character count badge */}
          <span
            className="power-tier-badge"
            style={{
              color: effectiveShowFavorites ? '#FF1744' : '#ED1D24',
              borderColor: effectiveShowFavorites ? 'rgba(255,23,68,0.3)' : 'rgba(237,29,36,0.3)',
              backgroundColor: effectiveShowFavorites ? 'rgba(255,23,68,0.1)' : 'rgba(237,29,36,0.1)',
              fontSize: '0.7rem',
              padding: '6px 14px',
            }}
          >
            <Users size={12} />
            {characters.length} Characters
          </span>
        </div>
        <p className="text-[rgba(255,255,255,0.4)] text-sm">
          {effectiveShowFavorites
            ? `Showing ${filtered.length} of ${favorites.length} favorites`
            : `Showing ${filtered.length} of ${characters.length} characters`}
        </p>
        <p className="text-[rgba(255,255,255,0.25)] text-xs mt-1">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)] text-[10px] font-mono mx-0.5">/</kbd> to search
        </p>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.3)]" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search characters..."
              className="w-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none focus:border-[#ED1D24]/50 transition-colors"
            />
          </div>

          {/* Favorites toggle button */}
          <button
            onClick={handleFavoritesToggle}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
              effectiveShowFavorites
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-[#1A1A1A] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)] hover:text-white'
            }`}
            aria-label="My Favorites"
          >
            <Heart size={14} className={effectiveShowFavorites ? 'fill-red-400' : ''} />
            <span className="hidden sm:inline">Favorites</span>
            {favorites.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${effectiveShowFavorites ? 'bg-red-500/20' : 'bg-[rgba(255,255,255,0.06)]'}`}>
                {favorites.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`lg:hidden flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all duration-200 min-h-[44px] ${
              showFilters || hasActiveFilters
                ? 'bg-[#ED1D24]/10 border-[#ED1D24]/30 text-[#ED1D24]'
                : 'bg-[#1A1A1A] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)]'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Alignment filter pills (desktop) */}
        <div className="hidden lg:flex mt-3 gap-2 flex-wrap">
          {alignments.map(a => {
            const isActive = alignment === a;
            const color = alignmentColors[a] || '#9E9E9E';
            return (
              <button
                key={a}
                onClick={() => handleAlignmentChange(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-200 min-h-[44px] ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-[rgba(255,255,255,0.4)] border-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.7)] hover:border-[rgba(255,255,255,0.15)]'
                }`}
                style={isActive ? {
                  backgroundColor: color + '20',
                  borderColor: color + '50',
                  color: color,
                  boxShadow: `0 0 16px ${color}20`,
                } : {}}
              >
                {a === 'all' ? 'All Alignments' : a}
              </button>
            );
          })}
        </div>

        {/* Filter dropdowns - toggle on mobile, show tier/sort on desktop */}
        <div className={`mt-3 flex flex-wrap gap-3 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
          {/* Alignment - mobile only */}
          <select
            value={alignment}
            onChange={(e) => handleAlignmentChange(e.target.value)}
            className="lg:hidden bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ED1D24]/50 appearance-none cursor-pointer min-w-[130px] min-h-[44px]"
          >
            {alignments.map(a => (
              <option key={a} value={a} className="bg-[#1A1A1A]">{a === 'all' ? 'All Alignments' : a.charAt(0).toUpperCase() + a.slice(1)}</option>
            ))}
          </select>

          {/* Power Tier */}
          <select
            value={tier}
            onChange={(e) => handleTierChange(e.target.value)}
            className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ED1D24]/50 appearance-none cursor-pointer min-w-[130px] min-h-[44px]"
          >
            {tiers.map(t => (
              <option key={t} value={t} className="bg-[#1A1A1A]">{t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ED1D24]/50 appearance-none cursor-pointer min-w-[160px] min-h-[44px]"
          >
            {sortOptions.map(s => (
              <option key={s.value} value={s.value} className="bg-[#1A1A1A]">{s.label}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#ED1D24] hover:bg-[#ED1D24]/10 transition-colors min-h-[44px]"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Recently Viewed Section */}
      {recentlyViewed.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-[rgba(255,255,255,0.4)]" />
            <h2 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase tracking-wide">
              Recently Viewed
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
            {recentlyViewed.map((slug) => {
              const char = getCharacterBySlug(slug);
              if (!char) return null;
              return (
                <motion.div
                  key={slug}
                  className="flex-shrink-0 w-[160px]"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CharacterCard
                    character={char}
                    onClick={() => navigate({ type: 'character', slug: char.slug })}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Empty favorites state */}
      {effectiveShowFavorites && filtered.length === 0 && !isLoadingSkeleton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Heart size={48} className="text-[rgba(255,255,255,0.1)] mx-auto mb-4" />
          <p className="text-[rgba(255,255,255,0.5)] text-lg mb-2">No favorites yet</p>
          <p className="text-[rgba(255,255,255,0.3)] text-sm mb-6">
            Click the heart icon on character cards to add favorites
          </p>
          <button
            onClick={handleClearFilters}
            className="cta-button text-xs"
          >
            Browse All Characters
          </button>
        </motion.div>
      )}

      {/* Grid with skeleton loading */}
      {(!effectiveShowFavorites || filtered.length > 0) && (
        <AnimatePresence mode="wait">
          {isLoadingSkeleton ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {Array.from({ length: Math.min(8, filtered.length || 8) }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <CharacterCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : filtered.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {filtered.map((char, i) => (
                <motion.div
                  key={char.slug}
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CharacterCard
                    character={char}
                    onClick={() => navigate({ type: 'character', slug: char.slug })}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[rgba(255,255,255,0.35)] text-lg mb-4">No characters found</p>
              <button
                onClick={handleClearFilters}
                className="cta-button text-xs"
              >
                Clear Filters
              </button>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
