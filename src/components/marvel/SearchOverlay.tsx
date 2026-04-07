'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clock, TrendingUp, SearchX, Zap } from 'lucide-react';
import Fuse from 'fuse.js';
import { characters, type MCUCharacter, getCharacterBySlug } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';

const fuse = new Fuse(characters, {
  keys: [
    { name: 'name', weight: 0.5 },
    { name: 'realName', weight: 0.3 },
    { name: 'actorName', weight: 0.2 },
  ],
  threshold: 0.3,
});

const alignmentDotConfig: Record<string, string> = {
  hero: 'bg-green-500',
  villain: 'bg-red-500',
  'anti-hero': 'bg-amber-500',
  neutral: 'bg-gray-400',
};

const alignmentBadgeConfig: Record<string, { bg: string; text: string }> = {
  hero: { bg: 'bg-green-500/20', text: 'text-green-400' },
  villain: { bg: 'bg-red-500/20', text: 'text-red-400' },
  'anti-hero': { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  neutral: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

const powerTierLabels: Record<string, string> = {
  cosmic: 'Cosmic',
  omega: 'Omega',
  alpha: 'Alpha',
  beta: 'Beta',
  gamma: 'Gamma',
  normal: 'Normal',
};

const powerTierColors: Record<string, string> = {
  cosmic: 'text-purple-400',
  omega: 'text-orange-400',
  alpha: 'text-blue-400',
  beta: 'text-cyan-400',
  gamma: 'text-gray-400',
  normal: 'text-gray-500',
};

const TRENDING_SLUGS = ['spider-man', 'iron-man', 'thor', 'black-panther', 'doctor-strange', 'deadpool'];

const RECENT_KEY = 'marvel-recent-searches';
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) as string[] : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(searches: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(searches));
  } catch {
    // localStorage unavailable
  }
}

function addRecentSearch(term: string) {
  const trimmed = term.trim();
  if (!trimmed) return;
  const current = getRecentSearches();
  const filtered = current.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
  const updated = [trimmed, ...filtered].slice(0, MAX_RECENT);
  saveRecentSearches(updated);
}

function removeRecentSearch(term: string) {
  const current = getRecentSearches();
  const updated = current.filter(s => s !== term);
  saveRecentSearches(updated);
}

// Animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.1 } },
};

const sectionVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

export default function SearchOverlay() {
  const { searchOpen, closeSearch, navigate } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // Trending characters data (resolved once)
  const trendingCharacters = useMemo(() => {
    return TRENDING_SLUGS
      .map(slug => getCharacterBySlug(slug))
      .filter((c): c is MCUCharacter => c !== undefined);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setIsInputFocused(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Reset state when search opens/closes
  useEffect(() => {
    if (searchOpen) {
      const id = requestAnimationFrame(() => {
        setQuery('');
        setSelectedIndex(0);
        setRecentSearches(getRecentSearches());
      });
      return () => cancelAnimationFrame(id);
    }
  }, [searchOpen]);

  // Compute total navigable items count
  const hasQuery = query.trim().length > 0;
  const hasRecent = recentSearches.length > 0;

  // Compute results from query using useMemo
  const results = useMemo(() => {
    if (!hasQuery) return [];
    return fuse.search(query.trim()).slice(0, 8);
  }, [query, hasQuery]);

  // Compute the total number of navigable items
  const totalItems = useMemo(() => {
    if (hasQuery) return results.length;
    // When empty, items = recent searches + trending characters
    let count = 0;
    if (hasRecent) count += recentSearches.length;
    count += trendingCharacters.length;
    return count;
  }, [hasQuery, results.length, hasRecent, recentSearches.length, trendingCharacters.length]);

  // Compute the safe selected index
  const safeSelectedIndex = Math.min(selectedIndex, Math.max(totalItems - 1, 0));

  // Helper: get the offset for each section
  const recentStartIndex = 0;
  const trendingStartIndex = hasRecent ? recentSearches.length : 0;

  const handleSelect = useCallback((character: MCUCharacter) => {
    addRecentSearch(character.name);
    closeSearch();
    navigate({ type: 'character', slug: character.slug });
  }, [closeSearch, navigate]);

  const handleRecentClick = useCallback((term: string) => {
    setQuery(term);
    setSelectedIndex(0);
    // Focus back on input
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleRecentRemove = useCallback((term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(term);
    setRecentSearches(prev => prev.filter(s => s !== term));
    setSelectedIndex(prev => Math.min(prev, Math.max(totalItems - 2, 0)));
  }, [totalItems]);

  // Scroll highlighted item into view
  const scrollIntoView = useCallback((index: number) => {
    const el = itemRefs.current.get(index);
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSearch();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = Math.min(prev + 1, Math.max(totalItems - 1, 0));
        // Scroll after state update
        requestAnimationFrame(() => scrollIntoView(next));
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = Math.max(prev - 1, 0);
        requestAnimationFrame(() => scrollIntoView(next));
        return next;
      });
    } else if (e.key === 'Enter') {
      if (hasQuery && results[safeSelectedIndex]) {
        handleSelect(results[safeSelectedIndex].item);
      } else if (!hasQuery) {
        // Check if a recent search is selected
        if (hasRecent && safeSelectedIndex < recentSearches.length) {
          handleRecentClick(recentSearches[safeSelectedIndex]);
        }
        // Check if a trending character is selected
        else {
          const trendingIdx = safeSelectedIndex - trendingStartIndex;
          if (trendingIdx >= 0 && trendingIdx < trendingCharacters.length) {
            handleSelect(trendingCharacters[trendingIdx]);
          }
        }
      }
    }
  }, [closeSearch, results, safeSelectedIndex, handleSelect, hasQuery, hasRecent, recentSearches, trendingCharacters, trendingStartIndex, totalItems, handleRecentClick, scrollIntoView]);

  // Register item ref
  const registerItemRef = useCallback((index: number, el: HTMLButtonElement | null) => {
    if (el) {
      itemRefs.current.set(index, el);
    } else {
      itemRefs.current.delete(index);
    }
  }, []);

  // Determine if an item is highlighted
  const isHighlighted = useCallback((index: number) => {
    return index === safeSelectedIndex;
  }, [safeSelectedIndex]);

  // Reset selected index when switching between modes (via prev ref to avoid setState in effect)
  const prevHasQuery = useRef(hasQuery);
  useEffect(() => {
    if (prevHasQuery.current !== hasQuery) {
      const id = requestAnimationFrame(() => {
        setSelectedIndex(0);
      });
      itemRefs.current.clear();
      prevHasQuery.current = hasQuery;
      return () => cancelAnimationFrame(id);
    }
  }, [hasQuery]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] sm:pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px]" />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[640px] mx-4 bg-[#1A1A1A] rounded-2xl border border-[rgba(255,255,255,0.12)] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Search input with focus ring animation */}
            <div className={`flex items-center gap-3 px-5 py-4 border-b border-[rgba(255,255,255,0.06)] transition-all duration-300 ${
              isInputFocused ? 'ring-1 ring-red-500/30 ring-inset bg-[rgba(255,255,255,0.02)]' : ''
            }`}>
              <Search size={18} className={`flex-shrink-0 transition-colors duration-200 ${
                isInputFocused ? 'text-red-400' : 'text-[rgba(255,255,255,0.35)]'
              }`} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Search characters..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[rgba(255,255,255,0.3)] transition-shadow duration-200"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-md text-[rgba(255,255,255,0.3)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button
                onClick={closeSearch}
                className="p-1 rounded-md text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results / Recent / Trending */}
            <div ref={resultsContainerRef} className="max-h-[400px] overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {/* === SEARCH RESULTS === */}
                {hasQuery && (
                  <motion.div
                    key="results"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {results.length === 0 && (
                      <motion.div
                        className="px-5 py-12 text-center"
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <SearchX size={40} className="mx-auto mb-3 text-[rgba(255,255,255,0.15)]" />
                        <p className="text-[rgba(255,255,255,0.4)] text-sm font-medium">No results found</p>
                        <p className="text-[rgba(255,255,255,0.2)] text-xs mt-1">Try a different character name, actor, or alias</p>
                      </motion.div>
                    )}

                    {results.map((result, idx) => {
                      const char = result.item;
                      const align = alignmentBadgeConfig[char.alignment] || alignmentBadgeConfig.neutral;
                      const dot = alignmentDotConfig[char.alignment] || alignmentDotConfig.neutral;
                      const tierColor = powerTierColors[char.powerTier] || 'text-gray-400';
                      const highlighted = isHighlighted(idx);
                      return (
                        <motion.button
                          key={char.slug}
                          ref={(el) => registerItemRef(idx, el)}
                          variants={itemVariants}
                          onClick={() => handleSelect(char)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-150 border-l-2 ${
                            highlighted
                              ? 'bg-[rgba(255,255,255,0.06)] border-l-red-500'
                              : 'border-l-transparent hover:bg-[rgba(255,255,255,0.03)]'
                          }`}
                        >
                          <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-[rgba(255,255,255,0.08)]">
                            <Image
                              src={char.images.switcher}
                              alt={char.name}
                              fill
                              className="object-cover"
                              sizes="36px"
                            />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                              <p className="text-white text-sm font-medium truncate">{char.name}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[rgba(255,255,255,0.35)] text-xs truncate">{char.actorName}</p>
                              <span className={`text-[10px] font-medium ${tierColor} uppercase tracking-wide flex-shrink-0`}>
                                {powerTierLabels[char.powerTier]}
                              </span>
                            </div>
                          </div>
                          <span className={`${align.bg} ${align.text} text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0`}>
                            {char.alignment}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}

                {/* === RECENT + TRENDING (when input is empty) === */}
                {!hasQuery && (
                  <motion.div
                    key="recent-trending"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Recent Searches */}
                    {hasRecent && (
                      <div className="mb-1">
                        <div className="px-5 pt-3 pb-1.5 flex items-center gap-2">
                          <Clock size={12} className="text-[rgba(255,255,255,0.3)]" />
                          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[rgba(255,255,255,0.3)]">
                            Recent
                          </span>
                        </div>
                        {recentSearches.map((term, idx) => {
                          const globalIdx = recentStartIndex + idx;
                          const highlighted = isHighlighted(globalIdx);
                          return (
                            <motion.button
                              key={`recent-${term}-${idx}`}
                              ref={(el) => registerItemRef(globalIdx, el)}
                              variants={itemVariants}
                              onClick={() => handleRecentClick(term)}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleRecentClick(term);
                                }
                              }}
                              className={`w-full flex items-center gap-3 px-5 py-2.5 transition-all duration-150 border-l-2 group ${
                                highlighted
                                  ? 'bg-[rgba(255,255,255,0.06)] border-l-red-500'
                                  : 'border-l-transparent hover:bg-[rgba(255,255,255,0.03)]'
                              }`}
                            >
                              <Clock size={14} className="text-[rgba(255,255,255,0.25)] flex-shrink-0" />
                              <span className="flex-1 text-left text-sm text-[rgba(255,255,255,0.6)] truncate">
                                {term}
                              </span>
                              <span
                                onClick={(e) => handleRecentRemove(term, e)}
                                className="p-0.5 rounded text-[rgba(255,255,255,0.2)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-colors opacity-0 group-hover:opacity-100"
                                role="button"
                                aria-label={`Remove ${term} from recent searches`}
                                tabIndex={-1}
                              >
                                <X size={12} />
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    {/* Trending Characters */}
                    <div className={hasRecent ? 'mt-1' : ''}>
                      <div className="px-5 pt-3 pb-1.5 flex items-center gap-2">
                        <TrendingUp size={12} className="text-[rgba(255,255,255,0.3)]" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[rgba(255,255,255,0.3)]">
                          Trending
                        </span>
                      </div>
                      {trendingCharacters.map((char, idx) => {
                        const globalIdx = trendingStartIndex + idx;
                        const dot = alignmentDotConfig[char.alignment] || alignmentDotConfig.neutral;
                        const tierColor = powerTierColors[char.powerTier] || 'text-gray-400';
                        const highlighted = isHighlighted(globalIdx);
                        return (
                          <motion.button
                            key={char.slug}
                            ref={(el) => registerItemRef(globalIdx, el)}
                            variants={itemVariants}
                            onClick={() => handleSelect(char)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-150 border-l-2 ${
                              highlighted
                                ? 'bg-[rgba(255,255,255,0.06)] border-l-red-500'
                                : 'border-l-transparent hover:bg-[rgba(255,255,255,0.03)]'
                            }`}
                          >
                            <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-[rgba(255,255,255,0.08)]">
                              <Image
                                src={char.images.switcher}
                                alt={char.name}
                                fill
                                className="object-cover"
                                sizes="24px"
                              />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
                                <p className="text-white text-sm font-medium truncate">{char.name}</p>
                              </div>
                              <p className="text-[rgba(255,255,255,0.35)] text-xs truncate mt-0.5">
                                {char.realName || char.tagline}
                              </p>
                            </div>
                            <span className={`text-[10px] font-medium ${tierColor} uppercase tracking-wide flex-shrink-0 flex items-center gap-1`}>
                              <Zap size={9} />
                              {powerTierLabels[char.powerTier]}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer hint */}
            <div className="px-5 py-2.5 border-t border-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.25)] text-[11px] flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.06)] rounded text-[10px] border border-[rgba(255,255,255,0.1)] font-mono">↑↓</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.06)] rounded text-[10px] border border-[rgba(255,255,255,0.1)] font-mono">↵</kbd>
                <span>select</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.06)] rounded text-[10px] border border-[rgba(255,255,255,0.1)] font-mono">Esc</kbd>
                <span>close</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
