import { create } from 'zustand';

// Page index for navigation direction tracking
const PAGE_ORDER: string[] = ['home', 'roster', 'character', 'compare', 'battleArena', 'powerRankings', 'statsDashboard', 'collection', 'matchmaker', 'quiz', 'trivia', 'timeline', 'gallery', 'teams', 'soundboard', 'universes', 'movies', 'search', 'notFound'];

function getPageIndex(page: Page): number {
  return PAGE_ORDER.indexOf(page.type);
}

export type Page = 
  | { type: 'home' }
  | { type: 'roster'; filters?: Record<string, string> }
  | { type: 'character'; slug: string }
  | { type: 'compare'; a?: string; b?: string }
  | { type: 'battleArena' }
  | { type: 'powerRankings' }
  | { type: 'statsDashboard' }
  | { type: 'collection' }
  | { type: 'matchmaker' }
  | { type: 'quiz' }
  | { type: 'trivia' }
  | { type: 'timeline' }
  | { type: 'gallery' }
  | { type: 'teams' }
  | { type: 'team'; slug: string }
  | { type: 'universes' }
  | { type: 'universe'; slug: string }
  | { type: 'soundboard' }
  | { type: 'movies' }
  | { type: 'search'; query?: string }
  | { type: 'notFound' };

export type NavDirection = 'forward' | 'backward' | 'none';

function pageToHash(page: Page): string {
  switch (page.type) {
    case 'home': return '';
    case 'roster': return '#roster';
    case 'character': return `#character/${page.slug}`;
    case 'compare': return '#compare';
    case 'battleArena': return '#battle-arena';
    case 'powerRankings': return '#power-rankings';
    case 'statsDashboard': return '#stats';
    case 'collection': return '#collection';
    case 'matchmaker': return '#matchmaker';
    case 'quiz': return '#quiz';
    case 'trivia': return '#trivia';
    case 'timeline': return '#timeline';
    case 'gallery': return '#gallery';
    case 'teams': return '#teams';
    case 'team': return `#team/${page.slug}`;
    case 'universes': return '#universes';
    case 'soundboard': return '#soundboard';
    case 'movies': return '#movies';
    case 'universe': return `#universe/${page.slug}`;
    case 'search': return `#search?q=${encodeURIComponent(page.query || '')}`;
    case 'notFound': return '#not-found';
    default: return '';
  }
}

function hashToPage(hash: string): Page {
  const h = hash.replace(/^#\/?/, '');
  if (!h) return { type: 'home' };
  
  if (h === 'roster') return { type: 'roster' };
  if (h === 'compare') return { type: 'compare' };
  if (h === 'battle-arena') return { type: 'battleArena' };
  if (h === 'power-rankings') return { type: 'powerRankings' };
  if (h === 'stats') return { type: 'statsDashboard' };
  if (h === 'collection') return { type: 'collection' };
  if (h === 'matchmaker') return { type: 'matchmaker' };
  if (h === 'quiz') return { type: 'quiz' };
  if (h === 'trivia') return { type: 'trivia' };
  if (h === 'timeline') return { type: 'timeline' };
  if (h === 'gallery') return { type: 'gallery' };
  if (h === 'teams') return { type: 'teams' };
  if (h === 'universes') return { type: 'universes' };
  if (h === 'soundboard') return { type: 'soundboard' };
  if (h === 'movies') return { type: 'movies' };
  if (h === 'not-found') return { type: 'notFound' };
  
  const characterMatch = h.match(/^character\/(.+)$/);
  if (characterMatch) return { type: 'character', slug: decodeURIComponent(characterMatch[1]) };
  
  const teamMatch = h.match(/^team\/(.+)$/);
  if (teamMatch) return { type: 'team', slug: decodeURIComponent(teamMatch[1]) };
  
  const universeMatch = h.match(/^universe\/(.+)$/);
  if (universeMatch) return { type: 'universe', slug: decodeURIComponent(universeMatch[1]) };
  
  const searchMatch = h.match(/^search\?q=(.+)$/);
  if (searchMatch) return { type: 'search', query: decodeURIComponent(searchMatch[1]) };
  
  // Any unrecognized hash routes to 404
  return { type: 'notFound' };
}

interface AppState {
  currentPage: Page;
  previousPage: Page | null;
  navDirection: NavDirection;
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  heroCharacterIndex: number;
  isLoading: boolean;
  showIntroAnimation: boolean;
  quizAnswers: Record<number, number>;
  quizResult: string | null;
  toastMessage: string | null;
  konamiActivated: boolean;
  
  navigate: (page: Page) => void;
  goHome: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setHeroCharacterIndex: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setShowIntroAnimation: (show: boolean) => void;
  setQuizAnswer: (questionIndex: number, answerIndex: number) => void;
  resetQuiz: () => void;
  setQuizResult: (slug: string | null) => void;
  showToast: (message: string) => void;
  hideToast: () => void;
  setKonamiActivated: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: (() => {
    if (typeof window === 'undefined') return { type: 'home' };
    const page = hashToPage(window.location.hash);
    return page;
  })(),
  // Listen for hash changes (browser back/forward, direct URL entry)
  _initHashRouter: (() => {
    if (typeof window === 'undefined') return;
    const handleHashChange = () => {
      const page = hashToPage(window.location.hash);
      const prev = get().currentPage;
      const prevIdx = getPageIndex(prev);
      const nextIdx = getPageIndex(page);
      const direction: NavDirection = nextIdx > prevIdx ? 'forward' : nextIdx < prevIdx ? 'backward' : 'none';
      set({ currentPage: page, previousPage: prev, navDirection: direction, mobileMenuOpen: false });
      updateTitle(page);
    };
    window.addEventListener('hashchange', handleHashChange);
  })(),
  previousPage: null,
  navDirection: 'none',
  searchOpen: false,
  mobileMenuOpen: false,
  heroCharacterIndex: 0,
  isLoading: false,
  showIntroAnimation: true,
  quizAnswers: {},
  quizResult: null,
  toastMessage: null,
  konamiActivated: false,

  navigate: (page) => {
    const prev = get().currentPage;
    const prevIdx = getPageIndex(prev);
    const nextIdx = getPageIndex(page);
    const direction: NavDirection = nextIdx > prevIdx ? 'forward' : nextIdx < prevIdx ? 'backward' : 'none';
    
    set({ 
      currentPage: page, 
      previousPage: prev,
      navDirection: direction,
      mobileMenuOpen: false 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update URL hash for bookmarkability
    const hash = pageToHash(page);
    if (window.history.replaceState) {
      window.history.replaceState(null, '', hash || window.location.pathname);
    } else {
      window.location.hash = hash;
    }
    // Update document title
    updateTitle(page);
    // Track recently viewed characters in sessionStorage
    if (page.type === 'character' && page.slug) {
      try {
        const stored = sessionStorage.getItem('marvel-recently-viewed');
        const current: string[] = stored ? JSON.parse(stored) : [];
        const updated = current.filter(s => s !== page.slug);
        updated.unshift(page.slug);
        sessionStorage.setItem('marvel-recently-viewed', JSON.stringify(updated.slice(0, 6)));
      } catch { /* ignore */ }
      window.dispatchEvent(new CustomEvent('character-viewed', { detail: { slug: page.slug } }));
    }
  },

  goHome: () => {
    const prev = get().currentPage;
    set({ 
      currentPage: { type: 'home' }, 
      previousPage: prev,
      navDirection: getPageIndex(prev) > 0 ? 'backward' : 'none',
      mobileMenuOpen: false 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    document.title = 'Marvel Universe: Cinematic Character Guide';
  },
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  setHeroCharacterIndex: (index) => set({ heroCharacterIndex: index }),
  setLoading: (loading) => set({ isLoading: loading }),
  setShowIntroAnimation: (show) => set({ showIntroAnimation: show }),
  setQuizAnswer: (questionIndex, answerIndex) =>
    set((s) => ({
      quizAnswers: { ...s.quizAnswers, [questionIndex]: answerIndex },
    })),
  resetQuiz: () => set({ quizAnswers: {}, quizResult: null }),
  setQuizResult: (slug) => set({ quizResult: slug }),
  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },
  hideToast: () => set({ toastMessage: null }),
  setKonamiActivated: (v) => set({ konamiActivated: v }),
}));

function updateTitle(page: Page) {
  switch (page.type) {
    case 'home':
      document.title = 'Marvel Universe: Cinematic Character Guide';
      break;
    case 'character': {
      const name = page.slug ? page.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Character';
      document.title = `${name} | Marvel Cinematic Character Guide`;
      break;
    }
    case 'compare':
      document.title = 'Compare Characters | Marvel Cinematic Character Guide';
      break;
    case 'battleArena':
      document.title = 'Battle Arena | Marvel Cinematic Character Guide';
      break;
    case 'powerRankings':
      document.title = 'Power Rankings | Marvel Cinematic Character Guide';
      break;
    case 'statsDashboard':
      document.title = 'MCU Statistics | Marvel Cinematic Character Guide';
      break;
    case 'collection':
      document.title = 'My Collection | Marvel Cinematic Character Guide';
      break;
    case 'matchmaker':
      document.title = 'Character Matchmaker | Marvel Cinematic Character Guide';
      break;
    case 'quiz':
      document.title = 'Which Marvel Character Are You? | Marvel Cinematic Character Guide';
      break;
    case 'trivia':
      document.title = 'MCU Trivia Challenge | Marvel Cinematic Character Guide';
      break;
    case 'timeline':
      document.title = 'MCU Timeline | Marvel Cinematic Character Guide';
      break;
    case 'gallery':
      document.title = 'Character Gallery | Marvel Cinematic Character Guide';
      break;
    case 'teams':
      document.title = 'Teams & Alliances | Marvel Cinematic Character Guide';
      break;
    case 'universes':
      document.title = 'The Multiverse | Marvel Cinematic Character Guide';
      break;
    case 'soundboard':
      document.title = 'MCU Soundboard | Marvel Cinematic Character Guide';
      break;
    case 'movies':
      document.title = 'MCU Movies | Marvel Cinematic Character Guide';
      break;
    case 'notFound':
      document.title = '404 - Universe Not Found | Marvel Cinematic Character Guide';
      break;
    default:
      document.title = 'Marvel Universe: Cinematic Character Guide';
  }
}
