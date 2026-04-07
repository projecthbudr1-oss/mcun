'use client';

import { ACHIEVEMENT_DEFINITIONS, type Achievement, type AchievementDefinition } from '@/data/achievements';

const STORAGE_KEY = 'marvel-achievements';
const UNLOCKED_KEY = 'marvel-achievements-unlocked';

export type AchievementStat = 'characters_viewed' | 'battles_won' | 'trivia_correct' | 'favorites_count' | 'quiz_completed' | 'trivia_completed';

interface AchievementStorage {
  stats: Record<AchievementStat, number>;
  viewedCharacters: string[];
}

function getStorage(): AchievementStorage {
  if (typeof window === 'undefined') {
    return { stats: { characters_viewed: 0, battles_won: 0, trivia_correct: 0, favorites_count: 0, quiz_completed: 0, trivia_completed: 0 }, viewedCharacters: [] };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        stats: {
          characters_viewed: 0,
          battles_won: 0,
          trivia_correct: 0,
          favorites_count: 0,
          quiz_completed: 0,
          trivia_completed: 0,
          ...parsed.stats,
        },
        viewedCharacters: parsed.viewedCharacters || [],
      };
    }
  } catch { /* ignore */ }
  return { stats: { characters_viewed: 0, battles_won: 0, trivia_correct: 0, favorites_count: 0, quiz_completed: 0, trivia_completed: 0 }, viewedCharacters: [] };
}

function saveStorage(data: AchievementStorage) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function getUnlocked(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(UNLOCKED_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function saveUnlocked(unlocked: Record<string, number>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
  } catch { /* ignore */ }
}

function statToCategory(stat: AchievementStat): AchievementDefinition['category'] | null {
  switch (stat) {
    case 'characters_viewed': return 'exploration';
    case 'battles_won': return 'combat';
    case 'trivia_correct': return 'knowledge';
    case 'favorites_count': return 'social';
    case 'quiz_completed': return 'knowledge';
    case 'trivia_completed': return 'knowledge';
    default: return null;
  }
}

/**
 * Track a stat increment and return any newly unlocked achievements
 */
export function trackAchievement(stat: AchievementStat, extraData?: string): Achievement[] {
  const data = getStorage();
  const unlocked = getUnlocked();
  const newlyUnlocked: Achievement[] = [];

  if (stat === 'characters_viewed' && extraData) {
    if (!data.viewedCharacters.includes(extraData)) {
      data.viewedCharacters.push(extraData);
    }
    data.stats.characters_viewed = data.viewedCharacters.length;
  } else if (stat === 'favorites_count') {
    // Read current favorites from localStorage
    try {
      const favs = localStorage.getItem('marvel-favorites');
      data.stats.favorites_count = favs ? JSON.parse(favs).length : 0;
    } catch { data.stats.favorites_count = 0; }
  } else {
    data.stats[stat] = (data.stats[stat] || 0) + 1;
  }

  saveStorage(data);

  const category = statToCategory(stat);

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    // Skip if already unlocked
    if (unlocked[def.id]) continue;
    // Only check achievements matching this category
    if (category && def.category !== category) continue;

    let currentValue = 0;
    if (def.category === 'exploration') {
      currentValue = data.stats.characters_viewed;
    } else if (def.category === 'combat') {
      currentValue = data.stats.battles_won;
    } else if (def.category === 'knowledge') {
      if (def.id === 'quiz-taker') {
        currentValue = data.stats.quiz_completed;
      } else {
        currentValue = data.stats.trivia_correct;
      }
    } else if (def.category === 'social') {
      currentValue = data.stats.favorites_count;
    }

    if (currentValue >= def.requirement) {
      unlocked[def.id] = Date.now();
      newlyUnlocked.push({
        ...def,
        current: currentValue,
        unlocked: true,
        unlockedAt: unlocked[def.id],
      });
    }
  }

  if (newlyUnlocked.length > 0) {
    saveUnlocked(unlocked);
    // Dispatch event for AchievementToastContainer
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('achievement-unlocked', {
        detail: { achievements: newlyUnlocked },
      }));
    }
  }

  return newlyUnlocked;
}

/**
 * Get all achievements with current progress
 */
export function getAchievements(): Achievement[] {
  const data = getStorage();
  const unlocked = getUnlocked();

  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    let currentValue = 0;
    if (def.category === 'exploration') {
      currentValue = data.stats.characters_viewed;
    } else if (def.category === 'combat') {
      currentValue = data.stats.battles_won;
    } else if (def.category === 'knowledge') {
      if (def.id === 'quiz-taker') {
        currentValue = data.stats.quiz_completed;
      } else {
        currentValue = data.stats.trivia_correct;
      }
    } else if (def.category === 'social') {
      currentValue = data.stats.favorites_count;
    }

    const isUnlocked = !!unlocked[def.id];

    return {
      ...def,
      current: currentValue,
      unlocked: isUnlocked,
      unlockedAt: isUnlocked ? unlocked[def.id] : null,
    };
  });
}

/**
 * Get overall achievement progress (percentage)
 */
export function getAchievementProgress(): { unlocked: number; total: number; percentage: number } {
  const unlocked = getUnlocked();
  const total = ACHIEVEMENT_DEFINITIONS.length;
  const count = ACHIEVEMENT_DEFINITIONS.filter((d) => unlocked[d.id]).length;
  return {
    unlocked: count,
    total,
    percentage: Math.round((count / total) * 100),
  };
}

/**
 * Get a summary of recently unlocked achievements (last 5)
 */
export function getRecentAchievements(): Achievement[] {
  const achievements = getAchievements().filter((a) => a.unlocked);
  return achievements
    .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
    .slice(0, 5);
}
