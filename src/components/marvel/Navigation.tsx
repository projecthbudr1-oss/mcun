'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Search, Menu, X, Heart, Sun, Moon, Swords, Trophy, Brain, Images, BookmarkCheck, BarChart3, HeartHandshake, Volume2, Home, Users, Globe2, Award, ChevronDown, Clock, Gamepad2, Clapperboard } from 'lucide-react';
import { useAppStore, type Page } from '@/store/useAppStore';
import { getAchievements, getAchievementProgress } from '@/lib/achievements';
import { type Achievement, RARITY_CONFIG } from '@/data/achievements';

/* ─── Nav Link Config ─── */
interface NavLink {
  label: string;
  page: Page;
  icon: React.ReactNode;
}

// Primary links visible directly in the navbar
const PRIMARY_LINKS: NavLink[] = [
  { label: 'HOME', page: { type: 'home' }, icon: <Home size={11} /> },
  { label: 'ROSTER', page: { type: 'roster' }, icon: <Users size={11} /> },
  { label: 'COMPARE', page: { type: 'compare' }, icon: <Swords size={11} /> },
  { label: 'ARENA', page: { type: 'battleArena' }, icon: <Swords size={11} /> },
  { label: 'QUIZ', page: { type: 'quiz' }, icon: <Brain size={11} /> },
  { label: 'TEAMS', page: { type: 'teams' }, icon: <Gamepad2 size={11} /> },
  { label: 'UNIVERSES', page: { type: 'universes' }, icon: <Globe2 size={11} /> },
];

// Overflow links shown in "MORE" dropdown
const MORE_LINKS: NavLink[] = [
  { label: 'RANKINGS', page: { type: 'powerRankings' }, icon: <Trophy size={14} /> },
  { label: 'STATS', page: { type: 'statsDashboard' }, icon: <BarChart3 size={14} /> },
  { label: 'COLLECTION', page: { type: 'collection' }, icon: <BookmarkCheck size={14} /> },
  { label: 'MATCHMAKER', page: { type: 'matchmaker' }, icon: <HeartHandshake size={14} /> },
  { label: 'TRIVIA', page: { type: 'trivia' }, icon: <Brain size={14} /> },
  { label: 'TIMELINE', page: { type: 'timeline' }, icon: <Clock size={14} /> },
  { label: 'GALLERY', page: { type: 'gallery' }, icon: <Images size={14} /> },
  { label: 'SOUNDBOARD', page: { type: 'soundboard' }, icon: <Volume2 size={14} /> },
  { label: 'MOVIES', page: { type: 'movies' }, icon: <Clapperboard size={14} /> },
];

// All links combined for mobile menu
const ALL_LINKS: NavLink[] = [...PRIMARY_LINKS, ...MORE_LINKS];

/* ─── Helpers ─── */
function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('marvel-favorites');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/* ─── Component ─── */
export default function Navigation() {
  const { currentPage, navigate, openSearch, closeSearch, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [achievementOpen, setAchievementOpen] = useState(false);
  const [achievementData, setAchievementData] = useState<Achievement[]>([]);
  const [achieveCount, setAchieveCount] = useState({ unlocked: 0, total: 0 });
  const [moreOpen, setMoreOpen] = useState(false);
  const { theme, setTheme: setNextTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard for next-themes
  useEffect(() => setMounted(true), []);

  // Refresh achievement data
  const refreshAchievements = useCallback(() => {
    try {
      setAchievementData(getAchievements());
      setAchieveCount(getAchievementProgress());
    } catch {
      // ignore
    }
  }, []);

  // Load achievement data after mount
  useEffect(() => {
    const t = setTimeout(() => refreshAchievements(), 0);
    const handleUnlock = () => setTimeout(refreshAchievements, 100);
    window.addEventListener('achievement-unlocked', handleUnlock);
    window.addEventListener('favorites-changed', handleUnlock);
    return () => {
      clearTimeout(t);
      window.removeEventListener('achievement-unlocked', handleUnlock);
      window.removeEventListener('favorites-changed', handleUnlock);
    };
  }, [refreshAchievements]);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!achievementOpen && !moreOpen) return;
    const handleClick = (e: MouseEvent) => {
      // Check if click is inside any dropdown
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-dropdown-area')) {
        setAchievementOpen(false);
        setMoreOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [achievementOpen, moreOpen]);

  // Track favorites count
  useEffect(() => {
    const updateCount = () => setFavoritesCount(getFavorites().length);
    updateCount();
    window.addEventListener('storage', updateCount);
    const handleFavUpdate = () => updateCount();
    window.addEventListener('favorites-changed', handleFavUpdate);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('favorites-changed', handleFavUpdate);
    };
  }, []);

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 50), []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (useAppStore.getState().searchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch, closeSearch]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setNextTheme(newTheme);
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 350);
  }, [theme, setNextTheme]);

  const isActive = (type: string) => currentPage.type === type;

  // Calculate active nav index for sliding indicator (primary links only)
  const activeIndex = useMemo(() => {
    const idx = PRIMARY_LINKS.findIndex(l => isActive(l.page.type));
    // Check if active is in "MORE" dropdown
    if (idx < 0 && MORE_LINKS.some(l => isActive(l.page.type))) {
      return PRIMARY_LINKS.length; // Position at "MORE" button
    }
    return idx >= 0 ? idx : -1;
  }, [isActive]);

  // Check if any "MORE" link is active
  const isMoreActive = MORE_LINKS.some(l => isActive(l.page.type));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 glass-nav nav-inner-glow transition-all duration-500 ${scrolled ? 'glass-nav-scrolled' : ''}`}
      >
        {/* Pulsing red gradient border-bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="h-full"
            initial={false}
            animate={{
              background: [
                'linear-gradient(90deg, transparent 0%, rgba(237,29,36,0.6) 20%, transparent 40%, rgba(237,29,36,0.8) 60%, transparent 80%, transparent 100%)',
                'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(237,29,36,0.8) 40%, transparent 60%, rgba(237,29,36,0.6) 80%, transparent 100%)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        </div>
        <div className="nav-gradient-line" />

        <div className="max-w-[1440px] mx-auto h-full px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate({ type: 'home' })}
            className="font-[var(--font-oswald)] text-white text-xl tracking-wide font-bold hover:opacity-80 transition-opacity logo-underline flex-shrink-0"
          >
            MARVEL
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5 relative flex-1 justify-center">
            {PRIMARY_LINKS.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => navigate(link.page)}
                className={`nav-link-hover relative uppercase text-[11px] tracking-[0.1em] transition-all duration-300 px-3 py-2 flex items-center gap-1.5 rounded-md ${
                  isActive(link.page.type)
                    ? 'text-white scale-105'
                    : 'text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.85)]'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {isActive(link.page.type) && (
                  <motion.div
                    layoutId="nav-active-indicator"
                    className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-[#ED1D24]"
                    style={{ boxShadow: '0 0 8px rgba(237, 29, 36, 0.6), 0 0 16px rgba(237, 29, 36, 0.2)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}

            {/* "MORE" Dropdown Trigger */}
            <div className="relative nav-dropdown-area" ref={moreRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreOpen(!moreOpen);
                  setAchievementOpen(false);
                }}
                className={`nav-link-hover nav-underline-link relative uppercase text-[11px] tracking-[0.1em] transition-colors duration-300 px-3 py-2 flex items-center gap-1.5 rounded-md ${
                  isMoreActive || moreOpen
                    ? 'text-white'
                    : 'text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.85)]'
                }`}
              >
                <span>MORE</span>
                <motion.span
                  animate={{ rotate: moreOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={12} />
                </motion.span>
              </button>

              {/* MORE Dropdown */}
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 bg-[#141414]/95 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-xl shadow-2xl overflow-hidden z-50"
                    style={{ boxShadow: '0 0 40px rgba(237,29,36,0.06), 0 12px 48px rgba(0,0,0,0.6)' }}
                  >
                    <div className="p-1.5">
                      {MORE_LINKS.map((link, i) => (
                        <motion.button
                          key={link.label}
                          type="button"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15, delay: i * 0.03 }}
                          onClick={() => {
                            navigate(link.page);
                            setMoreOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                            isActive(link.page.type)
                              ? 'bg-[#ED1D24]/10 text-[#ED1D24]'
                              : 'text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
                          }`}
                        >
                          <span className="flex-shrink-0 opacity-60">{link.icon}</span>
                          <span className="text-xs font-semibold uppercase tracking-wider">{link.label}</span>
                          {isActive(link.page.type) && (
                            <motion.div
                              layoutId="more-active-dot"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ED1D24]"
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sliding active indicator */}
            <AnimatePresence>
              {activeIndex >= 0 && (
                <motion.div
                  className="absolute bottom-0 h-[2px] rounded-full"
                  initial={false}
                  animate={{
                    left: `${activeIndex * (100 / (PRIMARY_LINKS.length + 1))}%`,
                    width: `${100 / (PRIMARY_LINKS.length + 1)}%`,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ background: 'linear-gradient(90deg, #ED1D24, #FF6D00)' }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1.5">
            {/* Favorites button */}
            <button
              type="button"
              onClick={() => navigate({ type: 'roster', filters: { favorites: 'true' } })}
              className="relative flex items-center gap-2 p-2 rounded-lg text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
              aria-label="My Favorites"
            >
              <Heart size={17} className={favoritesCount > 0 ? 'text-red-500 fill-red-500' : ''} />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-[fadeIn_0.2s_ease]">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Achievements button */}
            <div className="relative nav-dropdown-area">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setAchievementOpen(!achievementOpen); setMoreOpen(false); }}
                className="relative flex items-center gap-2 p-2 rounded-lg text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
                aria-label="Achievements"
              >
                <Award size={17} className={achieveCount.unlocked > 0 ? 'text-[#FFD54F]' : ''} />
                {achieveCount.unlocked > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FFD54F] text-black text-[9px] font-bold flex items-center justify-center">
                    {achieveCount.unlocked}
                  </span>
                )}
              </button>

              {/* Achievement Dropdown */}
              <AnimatePresence>
                {achievementOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-2 w-72 bg-[#141414]/95 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-xl shadow-2xl overflow-hidden z-50"
                    style={{ boxShadow: '0 0 30px rgba(255,213,79,0.08), 0 10px 40px rgba(0,0,0,0.5)' }}
                  >
                    {/* Header */}
                    <div className="p-3 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-[#FFD54F]" />
                        <span className="text-white text-xs font-bold uppercase tracking-wider">Achievements</span>
                      </div>
                      <span className="text-[rgba(255,255,255,0.35)] text-[10px] font-bold">{achieveCount.unlocked}/{achieveCount.total}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="px-3 pt-2">
                      <div className="h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: achieveCount.total > 0 ? `${(achieveCount.unlocked / achieveCount.total) * 100}%` : '0%',
                            background: 'linear-gradient(90deg, #FFD54F, #FF6D00)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Achievement list */}
                    <div className="max-h-64 overflow-y-auto scrollbar-hide p-2">
                      {achievementData.map((ach) => {
                        const rarity = RARITY_CONFIG[ach.rarity];
                        return (
                          <div
                            key={ach.id}
                            className="flex items-center gap-2.5 p-2 rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.03)]"
                          >
                            <div
                              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-xs"
                              style={{
                                backgroundColor: ach.unlocked ? rarity.color + '15' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${ach.unlocked ? rarity.color + '30' : 'rgba(255,255,255,0.06)'}`,
                                opacity: ach.unlocked ? 1 : 0.4,
                              }}
                            >
                              <Trophy size={12} style={{ color: ach.unlocked ? rarity.color : 'rgba(255,255,255,0.2)' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[11px] font-semibold truncate ${ach.unlocked ? 'text-white' : 'text-[rgba(255,255,255,0.3)]'}`}>{ach.title}</p>
                              {!ach.unlocked && (
                                <div className="mt-0.5 flex items-center gap-1.5">
                                  <div className="flex-1 h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${Math.min((ach.current / ach.requirement) * 100, 100)}%`, backgroundColor: rarity.color + '60' }} />
                                  </div>
                                  <span className="text-[9px] text-[rgba(255,255,255,0.2)] font-mono">{ach.current}/{ach.requirement}</span>
                                </div>
                              )}
                            </div>
                            {ach.unlocked && (
                              <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: rarity.color, backgroundColor: rarity.color + '15', border: `1px solid ${rarity.color}20` }}>{rarity.label}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 p-2 rounded-lg text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
              aria-label="Toggle theme"
            >
              {mounted && (theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />)}
            </button>

            {/* Search */}
            <button
              type="button"
              onClick={openSearch}
              className="flex items-center gap-2 p-2 rounded-lg text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
              aria-label="Search (⌘K)"
            >
              <Search size={17} />
              <kbd className="hidden xl:inline-flex items-center gap-0.5 text-[10px] font-medium text-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded px-1.5 py-0.5 leading-none">
                <span>⌘</span>K
              </kbd>
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay with Glass Morphism */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-start pt-20 gap-1 overflow-y-auto"
            style={{
              background: 'rgba(10, 10, 10, 0.85)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {ALL_LINKS.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                onClick={() => {
                  navigate(link.page);
                  closeMobileMenu();
                }}
                className={`w-full max-w-xs text-left font-[var(--font-oswald)] text-lg font-bold uppercase tracking-wide transition-all duration-200 flex items-center gap-3 px-6 py-3 rounded-lg min-h-[44px] relative ${
                  isActive(link.page.type)
                    ? 'text-[#ED1D24]'
                    : 'text-[rgba(255,255,255,0.5)] hover:text-white'
                }`}
              >
                {link.icon && <span className="opacity-50 text-lg">{link.icon}</span>}
                {link.label}
                {isActive(link.page.type) && (
                  <motion.div
                    layoutId="mobile-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                    style={{ background: '#ED1D24' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
