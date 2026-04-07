export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exploration' | 'combat' | 'knowledge' | 'social';
  requirement: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  haloColor: string;
}

export interface Achievement extends AchievementDefinition {
  current: number;
  unlocked: boolean;
  unlockedAt: number | null;
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Exploration
  {
    id: 'first-step',
    title: 'First Step',
    description: 'View your first character profile',
    icon: 'Footprints',
    category: 'exploration',
    requirement: 1,
    rarity: 'common',
    haloColor: '#76FF03',
  },
  {
    id: 'rookie-explorer',
    title: 'Rookie Explorer',
    description: 'View 5 different characters',
    icon: 'Compass',
    category: 'exploration',
    requirement: 5,
    rarity: 'common',
    haloColor: '#76FF03',
  },
  {
    id: 'pathfinder',
    title: 'Pathfinder',
    description: 'View 10 different characters',
    icon: 'Map',
    category: 'exploration',
    requirement: 10,
    rarity: 'rare',
    haloColor: '#00E5FF',
  },
  {
    id: 'veteran-explorer',
    title: 'Veteran Explorer',
    description: 'View 20 different characters',
    icon: 'MapPin',
    category: 'exploration',
    requirement: 20,
    rarity: 'rare',
    haloColor: '#00E5FF',
  },
  {
    id: 'master-explorer',
    title: 'Master Explorer',
    description: 'View all characters',
    icon: 'Globe',
    category: 'exploration',
    requirement: 36,
    rarity: 'epic',
    haloColor: '#E040FB',
  },

  // Combat
  {
    id: 'first-blood',
    title: 'First Blood',
    description: 'Win your first battle',
    icon: 'Swords',
    category: 'combat',
    requirement: 1,
    rarity: 'common',
    haloColor: '#FF1744',
  },
  {
    id: 'gladiator',
    title: 'Gladiator',
    description: 'Win 5 battles',
    icon: 'Flame',
    category: 'combat',
    requirement: 5,
    rarity: 'rare',
    haloColor: '#FF6D00',
  },
  {
    id: 'arena-champion',
    title: 'Arena Champion',
    description: 'Win 10 battles',
    icon: 'Trophy',
    category: 'combat',
    requirement: 10,
    rarity: 'epic',
    haloColor: '#FFD600',
  },
  {
    id: 'warlord',
    title: 'Warlord',
    description: 'Win 25 battles',
    icon: 'Crown',
    category: 'combat',
    requirement: 25,
    rarity: 'legendary',
    haloColor: '#FFD600',
  },

  // Knowledge
  {
    id: 'quiz-taker',
    title: 'Quiz Taker',
    description: 'Complete the personality quiz',
    icon: 'Brain',
    category: 'knowledge',
    requirement: 1,
    rarity: 'common',
    haloColor: '#7C4DFF',
  },
  {
    id: 'trivia-rookie',
    title: 'Trivia Rookie',
    description: 'Answer 5 trivia questions correctly',
    icon: 'HelpCircle',
    category: 'knowledge',
    requirement: 5,
    rarity: 'common',
    haloColor: '#7C4DFF',
  },
  {
    id: 'trivia-king',
    title: 'Trivia King',
    description: 'Answer 15 trivia questions correctly',
    icon: 'GraduationCap',
    category: 'knowledge',
    requirement: 15,
    rarity: 'rare',
    haloColor: '#00E5FF',
  },
  {
    id: 'trivia-master',
    title: 'Trivia Master',
    description: 'Answer 30 trivia questions correctly',
    icon: 'Sparkles',
    category: 'knowledge',
    requirement: 30,
    rarity: 'epic',
    haloColor: '#E040FB',
  },

  // Social
  {
    id: 'first-favorite',
    title: 'First Favorite',
    description: 'Add a character to favorites',
    icon: 'Heart',
    category: 'social',
    requirement: 1,
    rarity: 'common',
    haloColor: '#FF1744',
  },
  {
    id: 'collector',
    title: 'Collector',
    description: 'Add 5 characters to favorites',
    icon: 'Star',
    category: 'social',
    requirement: 5,
    rarity: 'common',
    haloColor: '#FF1744',
  },
  {
    id: 'enthusiast',
    title: 'Enthusiast',
    description: 'Add 15 characters to favorites',
    icon: 'HeartHandshake',
    category: 'social',
    requirement: 15,
    rarity: 'rare',
    haloColor: '#FF6D00',
  },
  {
    id: 'ultimate-fan',
    title: 'Ultimate Fan',
    description: 'Favorite 30 characters',
    icon: 'Stars',
    category: 'social',
    requirement: 30,
    rarity: 'epic',
    haloColor: '#E040FB',
  },
];

export const RARITY_CONFIG = {
  common: { label: 'Common', color: '#9E9E9E', glow: 'rgba(158,158,158,0.3)' },
  rare: { label: 'Rare', color: '#00E5FF', glow: 'rgba(0,229,255,0.3)' },
  epic: { label: 'Epic', color: '#E040FB', glow: 'rgba(224,64,251,0.3)' },
  legendary: { label: 'Legendary', color: '#FFD600', glow: 'rgba(255,214,0,0.4)' },
};

export const CATEGORY_CONFIG = {
  exploration: { label: 'Exploration', color: '#76FF03' },
  combat: { label: 'Combat', color: '#FF1744' },
  knowledge: { label: 'Knowledge', color: '#7C4DFF' },
  social: { label: 'Social', color: '#FF6D00' },
};
