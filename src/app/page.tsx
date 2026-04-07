'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/marvel/Navigation';
import SearchOverlay from '@/components/marvel/SearchOverlay';
import Footer from '@/components/marvel/Footer';
import AchievementToastContainer from '@/components/marvel/AchievementToast';
import HomePage from '@/components/marvel/pages/HomePage';
import RosterPage from '@/components/marvel/pages/RosterPage';
import CharacterPage from '@/components/marvel/pages/CharacterPage';
import ComparePage from '@/components/marvel/pages/ComparePage';
import BattleArenaPage from '@/components/marvel/pages/BattleArenaPage';
import PowerRankingsPage from '@/components/marvel/pages/PowerRankingsPage';
import CollectionPage from '@/components/marvel/pages/CollectionPage';
import StatsDashboardPage from '@/components/marvel/pages/StatsDashboardPage';
import QuizPage from '@/components/marvel/pages/QuizPage';
import TriviaPage from '@/components/marvel/pages/TriviaPage';
import TimelinePage from '@/components/marvel/pages/TimelinePage';
import GalleryPage from '@/components/marvel/pages/GalleryPage';
import MatchmakerPage from '@/components/marvel/pages/MatchmakerPage';
import TeamsPage from '@/components/marvel/pages/TeamsPage';
import UniversesPage from '@/components/marvel/pages/UniversesPage';
import SoundboardPage from '@/components/marvel/pages/SoundboardPage';
import MoviesPage from '@/components/marvel/pages/MoviesPage';
import NotFoundPage from '@/components/marvel/pages/NotFoundPage';
import KeyboardShortcuts from '@/components/marvel/KeyboardShortcuts';

function Toast() {
  const { toastMessage, hideToast } = useAppStore();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#1A1A1A] border border-[rgba(255,255,255,0.12)] rounded-xl px-5 py-3 flex items-center gap-3 shadow-2xl"
          onClick={hideToast}
        >
          <Sparkles size={16} className="text-[#ED1D24] flex-shrink-0" />
          <span className="text-white text-sm font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(Math.round((scrollY / docHeight) * 100), 100) : 0;
      setVisible(scrollY > 400);
      setScrollPercent(percent);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-[90] w-11 h-11 rounded-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:text-white hover:border-[rgba(255,255,255,0.25)] hover:bg-[#222] transition-all shadow-xl"
          aria-label="Scroll to top"
        >
          <ArrowUp size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#ED1D24] text-white text-[8px] font-bold flex items-center justify-center">
            {scrollPercent}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Konami Code Easter Egg
function KonamiEasterEgg() {
  useEffect(() => {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === sequence[index]) {
        index++;
        if (index === sequence.length) {
          index = 0;
          const store = useAppStore.getState();
          if (!store.konamiActivated) {
            store.setKonamiActivated(true);
            store.showToast('I Love You 3000 💛');
            setTimeout(() => store.setKonamiActivated(false), 4000);
          }
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return null;
}

// Stan Lee Tribute Easter Egg - hover 8+ seconds on a character card
function StanLeeTribute() {
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== 'function') return;
      const card = target.closest('.character-card') as HTMLElement;
      if (!card) return;

      // Clear any existing timer
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

      hoverTimerRef.current = setTimeout(() => {
        const rect = card.getBoundingClientRect();
        setTooltip({
          visible: true,
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });

        // Auto-hide after 3 seconds
        if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
        tooltipTimeoutRef.current = setTimeout(() => {
          setTooltip(prev => ({ ...prev, visible: false }));
        }, 3000);
      }, 8000);
    };

    const handleMouseLeave = () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
      setTooltip(prev => ({ ...prev, visible: false }));
    };

    // Use event delegation to catch all character cards
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {tooltip.visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-[200] pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-[#1A1A1A] border border-[#FFD54F40] rounded-lg px-4 py-2 shadow-2xl flex items-center gap-2"
            style={{ boxShadow: '0 0 30px rgba(255,213,79,0.15)' }}
          >
            <span className="text-[#FFD54F] text-sm font-bold italic">Excelsior!</span>
            <span className="text-lg">✨</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Thanos Snap Easter Egg - 6 rapid clicks within 2s on switcher circles
function ThanosSnapEasterEgg() {
  const [isSnapping, setIsSnapping] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const clickTimestamps = useRef<number[]>([]);
  const snapTriggered = useRef(false);

  const triggerSnap = useCallback(() => {
    const store = useAppStore.getState();

    // Phase 1: Flash white
    setIsSnapping(true);

    // Phase 2: Show toast after flash
    setTimeout(() => {
      store.showToast('Thanos snapped... 🫰');
    }, 500);

    // Phase 3: Restore everything after 3 seconds
    setTimeout(() => {
      setIsRestoring(true);
      setTimeout(() => {
        setIsSnapping(false);
        setIsRestoring(false);
        snapTriggered.current = false;
      }, 1200);
    }, 3000);
  }, []);

  useEffect(() => {
    const handleSwitcherClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== 'function') return;

      // Only target character switcher buttons (in hero section)
      if (!target.closest('.character-switcher-btn')) return;

      const now = Date.now();
      clickTimestamps.current.push(now);

      // Keep only timestamps within the last 2 seconds
      clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 2000);

      // Check for 6+ clicks in 2 seconds
      if (clickTimestamps.current.length >= 6 && !snapTriggered.current) {
        snapTriggered.current = true;
        clickTimestamps.current = [];

        // Trigger snap!
        triggerSnap();
      }
    };

    document.addEventListener('click', handleSwitcherClick, true);

    return () => {
      document.removeEventListener('click', handleSwitcherClick, true);
    };
  }, [triggerSnap]);

  return (
    <>
      {/* White flash overlay */}
      <AnimatePresence>
        {isSnapping && !isRestoring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, times: [0, 0.2, 1] }}
            className="fixed inset-0 z-[300] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Dust disolve overlay - fades content */}
      <AnimatePresence>
        {isSnapping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="fixed inset-0 z-[250] bg-[#0A0A0A] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(10,10,10,0.95) 0%, rgba(10,10,10,1) 100%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Dust particle text */}
      <AnimatePresence>
        {isSnapping && !isRestoring && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="fixed inset-0 z-[260] flex items-center justify-center pointer-events-none"
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1, 0.98] }}
              transition={{ duration: 2, times: [0, 0.2, 1] }}
              className="text-white text-lg font-[var(--font-oswald)] uppercase tracking-[0.3em] font-bold"
              style={{ textShadow: '0 0 30px rgba(237,29,36,0.5)' }}
            >
              *snap*
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Scroll Progress Indicator
function ScrollProgressIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
      setProgress(percent);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="scroll-progress-bar"
      style={{ width: `${progress}%` }}
    />
  );
}

// Page transition direction variants
const pageVariants = {
  forward: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
  },
  backward: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
  },
  none: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

function PageRouter() {
  const { currentPage, navDirection } = useAppStore();
  const lineRef = useRef<HTMLDivElement>(null);

  const pageKey = (() => {
    switch (currentPage.type) {
      case 'home': return 'home';
      case 'roster': return 'roster';
      case 'character': return `character-${currentPage.slug}`;
      case 'compare': return 'compare';
      case 'battleArena': return 'battleArena';
      case 'powerRankings': return 'powerRankings';
      case 'collection': return 'collection';
      case 'statsDashboard': return 'statsDashboard';
      case 'quiz': return 'quiz';
      case 'trivia': return 'trivia';
      case 'timeline': return 'timeline';
      case 'gallery': return 'gallery';
      case 'matchmaker': return 'matchmaker';
      case 'teams': return 'teams';
      case 'team': return `team-${currentPage.slug}`;
      case 'universes': return 'universes';
      case 'universe': return `universe-${currentPage.slug}`;
      case 'soundboard': return 'soundboard';
      case 'movies': return 'movies';
      case 'search': return 'search';
      case 'notFound': return 'notFound';
      default: return 'home';
    }
  })();

  const renderPage = () => {
    switch (currentPage.type) {
      case 'home': return <HomePage />;
      case 'roster': return <RosterPage />;
      case 'character': return <CharacterPage />;
      case 'compare': return <ComparePage />;
      case 'battleArena': return <BattleArenaPage />;
      case 'powerRankings': return <PowerRankingsPage />;
      case 'collection': return <CollectionPage />;
      case 'statsDashboard': return <StatsDashboardPage />;
      case 'quiz': return <QuizPage />;
      case 'trivia': return <TriviaPage />;
      case 'timeline': return <TimelinePage />;
      case 'gallery': return <GalleryPage />;
      case 'matchmaker': return <MatchmakerPage />;
      case 'teams':
      case 'team': return <TeamsPage />;
      case 'universes':
      case 'universe': return <UniversesPage />;
      case 'soundboard': return <SoundboardPage />;
      case 'movies': return <MoviesPage />;
      default: return <NotFoundPage />;
    }
  };

  const direction = navDirection === 'none' ? 'none' : navDirection;
  const variants = pageVariants[direction];

  return (
    <>
      {/* Page transition progress line */}
      <div ref={lineRef} className="page-transition-line" style={{ width: '0%' }} />
      <AnimatePresence mode="wait">
        <motion.div
          key={pageKey}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]" id="app-root">
      {/* Noise texture overlay - very subtle */}
      <div className="noise-overlay" />
      {/* Page-level vignette */}
      <div className="page-vignette" />
      <ScrollProgressIndicator />
      <Navigation />
      <SearchOverlay />
      <main id="main-content" className="flex-1">
        <PageRouter />
      </main>
      <Footer />
      <Toast />
      <AchievementToastContainer />
      <ScrollToTop />
      <KonamiEasterEgg />
      <StanLeeTribute />
      <ThanosSnapEasterEgg />
      <KeyboardShortcuts />
    </div>
  );
}
