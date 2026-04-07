'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Clock, Flame, Trophy, RotateCcw, ChevronRight, Star, Timer, Target, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { trackAchievement } from '@/lib/achievements';

// ===== TRIVIA DATA =====
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type GameMode = 'classic' | 'speed';

interface TriviaQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
  category: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 1,
    question: "What is the name of Tony Stark's AI assistant before he becomes Vision?",
    options: ["FRIDAY", "J.A.R.V.I.S.", "ULTRON", "E.D.I.T.H."],
    correctIndex: 1,
    difficulty: "Easy",
    category: "Iron Man"
  },
  {
    id: 2,
    question: "Which Infinity Stone was hidden in the Tesseract?",
    options: ["Power Stone", "Mind Stone", "Space Stone", "Reality Stone"],
    correctIndex: 2,
    difficulty: "Easy",
    category: "Infinity Saga"
  },
  {
    id: 3,
    question: "What is the real name of Black Widow?",
    options: ["Wanda Maximoff", "Natasha Romanoff", "Carol Danvers", "Peggy Carter"],
    correctIndex: 1,
    difficulty: "Easy",
    category: "Characters"
  },
  {
    id: 4,
    question: "Which movie was the first film in the Marvel Cinematic Universe?",
    options: ["The Incredible Hulk", "Captain America: The First Avenger", "Iron Man", "Thor"],
    correctIndex: 2,
    difficulty: "Easy",
    category: "MCU History"
  },
  {
    id: 5,
    question: "What color is the Mind Stone?",
    options: ["Blue", "Purple", "Red", "Yellow"],
    correctIndex: 3,
    difficulty: "Easy",
    category: "Infinity Saga"
  },
  {
    id: 6,
    question: "Who directed the first two Avengers films?",
    options: ["James Gunn", "Jon Favreau", "Joss Whedon", "Taika Waititi"],
    correctIndex: 2,
    difficulty: "Medium",
    category: "Behind the Camera"
  },
  {
    id: 7,
    question: "In which movie does Spider-Man make his MCU debut?",
    options: ["Spider-Man: Homecoming", "Captain America: Civil War", "Avengers: Age of Ultron", "Spider-Man: Far From Home"],
    correctIndex: 1,
    difficulty: "Medium",
    category: "Characters"
  },
  {
    id: 8,
    question: "What is the name of Thor's hammer?",
    options: ["Stormbreaker", "Gungnir", "Mjolnir", "Ragnarok"],
    correctIndex: 2,
    difficulty: "Medium",
    category: "Characters"
  },
  {
    id: 9,
    question: "Which planet does Thanos sacrifice Gamora to obtain the Soul Stone?",
    options: ["Titan", "Vormir", "Knowhere", "Xandar"],
    correctIndex: 1,
    difficulty: "Medium",
    category: "Infinity Saga"
  },
  {
    id: 10,
    question: "What phrase does Doctor Strange use before using the Time Stone?",
    options: ["By the power of Odin", "Dormammu, I've come to bargain", "By the hoary hosts of Hoggoth", "Avengers, Assemble"],
    correctIndex: 1,
    difficulty: "Medium",
    category: "Doctor Strange"
  },
  {
    id: 11,
    question: "Which MCU movie became the first superhero film to be nominated for Best Picture at the Oscars?",
    options: ["Avengers: Endgame", "Black Panther", "Spider-Man: No Way Home", "Guardians of the Galaxy"],
    correctIndex: 1,
    difficulty: "Medium",
    category: "Awards"
  },
  {
    id: 12,
    question: "What is the name of the fictional country where Black Panther is set?",
    options: ["Genovia", "Wakanda", "Latveria", "Zamunda"],
    correctIndex: 1,
    difficulty: "Medium",
    category: "Black Panther"
  },
  {
    id: 13,
    question: "Which actor plays Nebula in the MCU?",
    options: ["Cate Blanchett", "Tilda Swinton", "Karen Gillan", "Natalie Portman"],
    correctIndex: 2,
    difficulty: "Hard",
    category: "Actor Trivia"
  },
  {
    id: 14,
    question: "In the post-credits scene of The Avengers (2012), who are the characters eating shawarma?",
    options: ["Just the original six Avengers", "The Avengers plus Nick Fury", "The Avengers in complete silence", "Tony Stark and Captain America only"],
    correctIndex: 2,
    difficulty: "Hard",
    category: "Post-Credit Scenes"
  },
  {
    id: 15,
    question: "What is the total worldwide box office gross of Avengers: Endgame (approximately)?",
    options: ["$1.9 billion", "$2.1 billion", "$2.8 billion", "$3.2 billion"],
    correctIndex: 2,
    difficulty: "Hard",
    category: "Box Office"
  },
  {
    id: 16,
    question: "How many times did Doctor Strange view the possible outcomes of the battle against Thanos?",
    options: ["1,400,005", "14,000,605", "14,006,005", "140,000,005"],
    correctIndex: 1,
    difficulty: "Hard",
    category: "Infinity Saga"
  },
  {
    id: 17,
    question: "Which real-life event in the MCU was referenced as 'The Blip'?",
    options: ["The Battle of New York", "Thanos snapping away half of all life", "The destruction of Asgard", "The Sokovia Accords signing"],
    correctIndex: 1,
    difficulty: "Medium",
    category: "MCU Events"
  },
  {
    id: 18,
    question: "What is the name of the alien race that Ronan the Accuser belongs to?",
    options: ["Kree", "Skrull", "Chitauri", "Sakaaran"],
    correctIndex: 0,
    difficulty: "Hard",
    category: "Cosmic MCU"
  },
  {
    id: 19,
    question: "Which MCU film features a character saying 'I am inevitable'?",
    options: ["Avengers: Infinity War", "Avengers: Age of Ultron", "Avengers: Endgame", "Guardians of the Galaxy"],
    correctIndex: 2,
    difficulty: "Hard",
    category: "Infinity Saga"
  },
  {
    id: 20,
    question: "In which film does Captain America lift Mjolnir?",
    options: ["Thor: Ragnarok", "Avengers: Age of Ultron", "Avengers: Infinity War", "Avengers: Endgame"],
    correctIndex: 3,
    difficulty: "Medium",
    category: "Characters"
  }
];

const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  Easy: 100,
  Medium: 200,
  Hard: 300,
};

const GAME_MODES = {
  classic: { label: 'Classic', questionCount: 15, timePerQuestion: 20, icon: Brain, description: '15 questions • 20s per question' },
  speed: { label: 'Speed Run', questionCount: 20, timePerQuestion: 10, icon: Zap, description: 'All 20 questions • 10s per question' },
};

type TriviaState = 'landing' | 'playing' | 'results';
type AnswerFeedback = 'correct' | 'wrong' | null;

interface GameStats {
  score: number;
  correct: number;
  wrong: number;
  totalQuestions: number;
  bestStreak: number;
  currentStreak: number;
  totalTimeUsed: number;
  timeBonuses: number;
}

function getHighScores(): Record<GameMode, number> {
  if (typeof window === 'undefined') return { classic: 0, speed: 0 };
  try {
    const stored = localStorage.getItem('marvel-trivia-highscores');
    return stored ? JSON.parse(stored) : { classic: 0, speed: 0 };
  } catch {
    return { classic: 0, speed: 0 };
  }
}

function saveHighScore(mode: GameMode, score: number) {
  const scores = getHighScores();
  if (score > scores[mode]) {
    scores[mode] = score;
    localStorage.setItem('marvel-trivia-highscores', JSON.stringify(scores));
    return true;
  }
  return false;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function TriviaPage() {
  const { navigate } = useAppStore();
  const [state, setState] = useState<TriviaState>('landing');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [maxTime, setMaxTime] = useState(20);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [stats, setStats] = useState<GameStats>({
    score: 0, correct: 0, wrong: 0, totalQuestions: 0,
    bestStreak: 0, currentStreak: 0, totalTimeUsed: 0, timeBonuses: 0,
  });
  const [highScores, setHighScores] = useState<Record<GameMode, number>>(() => getHighScores());
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const startGame = useCallback((mode: GameMode) => {
    const modeConfig = GAME_MODES[mode];
    setGameMode(mode);
    setMaxTime(modeConfig.timePerQuestion);
    setTimeLeft(modeConfig.timePerQuestion);
    setSelectedAnswer(null);
    setFeedback(null);
    setIsNewHighScore(false);
    setCurrentIndex(0);
    setStats({
      score: 0, correct: 0, wrong: 0, totalQuestions: modeConfig.questionCount,
      bestStreak: 0, currentStreak: 0, totalTimeUsed: 0, timeBonuses: 0,
    });

    // Shuffle and pick questions, ensure difficulty spread
    const easy = shuffleArray(TRIVIA_QUESTIONS.filter(q => q.difficulty === 'Easy'));
    const medium = shuffleArray(TRIVIA_QUESTIONS.filter(q => q.difficulty === 'Medium'));
    const hard = shuffleArray(TRIVIA_QUESTIONS.filter(q => q.difficulty === 'Hard'));

    let selected: TriviaQuestion[];
    if (mode === 'classic') {
      // 5 easy, 6 medium, 4 hard = 15
      selected = [...easy.slice(0, 5), ...medium.slice(0, 6), ...hard.slice(0, 4)];
    } else {
      // 5 easy, 8 medium, 7 hard = 20
      selected = [...easy.slice(0, 5), ...medium.slice(0, 8), ...hard.slice(0, 7)];
    }
    setQuestions(shuffleArray(selected));
    setState('playing');
    startTimeRef.current = Date.now();
  }, []);

  // Use refs for cross-callback references to avoid circular dependency
  const advanceToNextRef = useRef<() => void>(() => {});

  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= GAME_MODES[gameMode].questionCount) {
      // Game over — calculate final stats
      setStats(prev => {
        const finalStats = { ...prev, totalQuestions: GAME_MODES[gameMode].questionCount };
        const newHS = saveHighScore(gameMode, finalStats.score);
        if (newHS) setIsNewHighScore(true);
        setHighScores(getHighScores());
        return finalStats;
      });
      setState('results');
    } else {
      setSelectedAnswer(null);
      setFeedback(null);
      setCurrentIndex(nextIndex);
      setTimeLeft(maxTime);
    }
  }, [currentIndex, gameMode, maxTime]);

  useEffect(() => {
    advanceToNextRef.current = advanceToNext;
  }, [advanceToNext]);

  const handleTimeout = useCallback(() => {
    setFeedback('wrong');
    setSelectedAnswer(-1);
    setStats(prev => ({
      ...prev,
      wrong: prev.wrong + 1,
      currentStreak: 0,
    }));
    setTimeout(() => advanceToNextRef.current(), 1500);
  }, []);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const question = questions[currentIndex];
    if (!question) return;
    const isCorrect = answerIndex === question.correctIndex;

    setSelectedAnswer(answerIndex);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    const timeUsed = maxTime - timeLeft;

    if (isCorrect) {
      trackAchievement('trivia_correct');
      const timeBonus = Math.max(0, Math.round((timeLeft / maxTime) * 100));
      setStats(prev => {
        const streakMul = Math.min((prev.currentStreak + 1), 5);
        const points = (DIFFICULTY_POINTS[question.difficulty] + timeBonus) * streakMul;
        return {
          ...prev,
          score: prev.score + points,
          correct: prev.correct + 1,
          currentStreak: prev.currentStreak + 1,
          bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
          totalTimeUsed: prev.totalTimeUsed + timeUsed,
          timeBonuses: prev.timeBonuses + timeBonus,
        };
      });
    } else {
      setStats(prev => ({
        ...prev,
        wrong: prev.wrong + 1,
        currentStreak: 0,
        totalTimeUsed: prev.totalTimeUsed + timeUsed,
      }));
    }

    setTimeout(() => advanceToNextRef.current(), 1500);
  }, [questions, currentIndex, timeLeft, maxTime]);

  // Timer logic
  useEffect(() => {
    if (state !== 'playing' || feedback !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, currentIndex, feedback, handleTimeout]);

  const currentQuestion = questions[currentIndex];

  const timerPercent = maxTime > 0 ? (timeLeft / maxTime) * 100 : 0;
  const timerColor = timerPercent > 60 ? 'green' : timerPercent > 30 ? 'yellow' : 'red';
  const streakMultiplier = Math.min(stats.currentStreak, 5);

  const totalGameTime = stats.totalTimeUsed + (state === 'playing' ? (maxTime - timeLeft) : 0);
  const accuracy = stats.correct + stats.wrong > 0
    ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
    : 0;

  // ===== LANDING =====
  if (state === 'landing') {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[60vh] min-h-[400px] flex flex-col items-center justify-center text-center px-4"
        >
          {/* Red halo */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full animate-halo-pulse pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(237,29,36,0.15) 0%, transparent 60%)' }}
          />

          <motion.div
            className="flex items-center gap-2 text-[rgba(255,255,255,0.3)] text-sm uppercase tracking-[0.3em] mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Brain size={16} />
            Test Your MCU Knowledge
          </motion.div>

          <motion.h1
            className="font-[var(--font-oswald)] font-black uppercase leading-[0.9] mb-6 text-gradient"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            MCU TRIVIA<br />CHALLENGE
          </motion.h1>

          <motion.p
            className="text-[rgba(255,255,255,0.4)] text-sm max-w-md mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            20 questions across the Marvel Cinematic Universe. Score points based on difficulty and speed. How well do you know the MCU?
          </motion.p>

          {/* Game Mode Cards */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {(Object.entries(GAME_MODES) as [GameMode, typeof GAME_MODES.classic][]).map(([mode, config]) => {
              const Icon = config.icon;
              const hs = highScores[mode];
              return (
                <motion.button
                  key={mode}
                  onClick={() => startGame(mode)}
                  className="trivia-card glass-card glass-card-hover flex-1 group"
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="flex flex-col items-center gap-3 p-6">
                    <div className="w-12 h-12 rounded-full bg-[#ED1D24]/10 border border-[#ED1D24]/20 flex items-center justify-center group-hover:bg-[#ED1D24]/20 transition-colors">
                      <Icon size={22} className="text-[#ED1D24]" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg uppercase tracking-wider">{config.label}</h3>
                      <p className="text-[rgba(255,255,255,0.35)] text-xs mt-1">{config.description}</p>
                    </div>
                    {hs > 0 && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Trophy size={12} className="text-[#FFD54F]" />
                        <span className="text-[#FFD54F] text-xs font-bold">{hs.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Stats bar */}
        <motion.div
          className="max-w-2xl mx-auto px-4 pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-xl font-[var(--font-oswald)]">20</span>
              <span className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-wider">Questions</span>
            </div>
            <div className="w-px h-10 bg-[rgba(255,255,255,0.08)]" />
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-xl font-[var(--font-oswald)]">3</span>
              <span className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-wider">Difficulties</span>
            </div>
            <div className="w-px h-10 bg-[rgba(255,255,255,0.08)]" />
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-xl font-[var(--font-oswald)]">10+</span>
              <span className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-wider">Categories</span>
            </div>
            <div className="w-px h-10 bg-[rgba(255,255,255,0.08)]" />
            <div className="flex flex-col items-center">
              <span className="text-white font-bold text-xl font-[var(--font-oswald)]">5x</span>
              <span className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-wider">Max Streak</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== PLAYING =====
  if (state === 'playing' && currentQuestion) {
    const difficultyColors: Record<Difficulty, string> = {
      Easy: '#4CAF50',
      Medium: '#FF9800',
      Hard: '#F44336',
    };

    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        {/* Top bar: question counter + score + streak */}
        <div className="sticky top-16 z-30 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              {/* Question counter */}
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm font-[var(--font-oswald)]">
                  {currentIndex + 1}/{stats.totalQuestions}
                </span>
                <span className="text-[rgba(255,255,255,0.25)] text-xs">
                  {GAME_MODES[gameMode].label}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-4">
                {/* Streak */}
                <AnimatePresence>
                  {stats.currentStreak > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <span className="trivia-streak-fire">
                        <Flame size={14} />
                      </span>
                      <span className="text-[#FF6D00] text-xs font-bold">
                        {stats.currentStreak}
                        {streakMultiplier > 1 && (
                          <span className="ml-0.5 text-[#FFD54F]">{streakMultiplier}x</span>
                        )}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Score */}
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-[#FFD54F]" />
                  <span className="text-white font-bold text-sm count-up">{stats.score.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Timer bar */}
            <div className="relative h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
              <motion.div
                className={`absolute top-0 left-0 h-full rounded-full trivia-timer-bar ${
                  timerColor === 'green' ? 'bg-[#4CAF50]' :
                  timerColor === 'yellow' ? 'bg-[#FF9800]' :
                  'bg-[#F44336]'
                }`}
                style={{ width: `${timerPercent}%` }}
                transition={{ duration: 0.1 }}
              />
              {/* Pulse effect when low */}
              {timerPercent <= 30 && timerPercent > 0 && (
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full bg-[#F44336]/30"
                  initial={{ width: '0%' }}
                  animate={{ width: `${timerPercent}%` }}
                  transition={{ duration: 0.1 }}
                  style={{ animation: 'timer-pulse 0.5s ease-in-out infinite' }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              {/* Category + difficulty badge */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-[0.15em]">
                  {currentQuestion.category}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color: difficultyColors[currentQuestion.difficulty],
                    backgroundColor: difficultyColors[currentQuestion.difficulty] + '15',
                    border: `1px solid ${difficultyColors[currentQuestion.difficulty]}30`,
                  }}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* Question */}
              <h2 className="text-white text-lg lg:text-2xl font-semibold text-center leading-tight mb-8 px-2">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => {
                  const isCorrectOption = i === currentQuestion.correctIndex;
                  const isSelected = selectedAnswer === i;
                  const isTimeout = selectedAnswer === -1;
                  const showFeedback = feedback !== null;

                  let optionClasses = 'trivia-card glass-card glass-card-hover';
                  if (showFeedback) {
                    if (isCorrectOption) {
                      optionClasses += ' border-[#4CAF50] bg-[#4CAF50]/10';
                    } else if (isSelected && !isCorrectOption) {
                      optionClasses += ' trivia-wrong-shake';
                    } else {
                      optionClasses += ' opacity-40';
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={feedback !== null}
                      className={`w-full text-left px-5 py-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#141414] text-[rgba(255,255,255,0.7)] text-sm transition-all duration-200 btn-press ${optionClasses}`}
                      whileHover={feedback === null ? { x: 4, scale: 1.01 } : undefined}
                      whileTap={feedback === null ? { scale: 0.98 } : undefined}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-xs font-bold text-[rgba(255,255,255,0.4)] shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showFeedback && isCorrectOption && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                            className="text-[#4CAF50]"
                          >
                            ✓
                          </motion.span>
                        )}
                        {showFeedback && isSelected && !isCorrectOption && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                            className="text-[#F44336]"
                          >
                            ✗
                        </motion.span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Timeout message */}
              <AnimatePresence>
                {selectedAnswer === -1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-center"
                  >
                    <span className="text-[#F44336] text-sm font-medium">Time&apos;s up!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Correct/wrong flash overlay */}
              <AnimatePresence>
                {feedback === 'correct' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.15, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, times: [0, 0.3, 1] }}
                    className="fixed inset-0 z-40 bg-[#4CAF50] pointer-events-none trivia-correct-flash"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {feedback === 'wrong' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, times: [0, 0.3, 1] }}
                    className="fixed inset-0 z-40 bg-[#F44336] pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ===== RESULTS =====
  if (state === 'results') {
    const avgTime = stats.correct > 0 ? (stats.totalTimeUsed / stats.correct).toFixed(1) : '—';
    const modeConfig = GAME_MODES[gameMode];

    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative flex flex-col items-center text-center px-4 pt-24 pb-12"
        >
          {/* Halo */}
          <div
            className="absolute top-32 left-1/2 -translate-x-1/2 w-[40vw] h-[40vw] rounded-full animate-halo-pulse pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(237,29,36,0.12) 0%, transparent 60%)' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Trophy size={48} className="text-[#FFD54F] mx-auto mb-4" />
          </motion.div>

          <motion.h1
            className="font-[var(--font-oswald)] text-white font-black uppercase text-3xl lg:text-5xl mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Challenge Complete
          </motion.h1>

          <motion.p
            className="text-[rgba(255,255,255,0.4)] text-sm uppercase tracking-[0.2em] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {modeConfig.label} Mode
          </motion.p>

          {/* New high score banner */}
          <AnimatePresence>
            {isNewHighScore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                className="mb-8 px-6 py-2 rounded-full bg-[#FFD54F]/10 border border-[#FFD54F]/30"
              >
                <span className="text-[#FFD54F] text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Star size={14} /> New High Score! <Star size={14} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Score */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-6xl lg:text-7xl font-black font-[var(--font-oswald)] text-gradient mb-2">
              {stats.score.toLocaleString()}
            </div>
            <div className="text-[rgba(255,255,255,0.35)] text-sm uppercase tracking-wider">Total Points</div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-4">
              <Target size={18} className="text-[#4CAF50] mx-auto mb-2" />
              <div className="text-white font-bold text-xl font-[var(--font-oswald)]">{accuracy}%</div>
              <div className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-wider">Accuracy</div>
            </div>
            <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-4">
              <Flame size={18} className="text-[#FF6D00] mx-auto mb-2" />
              <div className="text-white font-bold text-xl font-[var(--font-oswald)]">{stats.bestStreak}</div>
              <div className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-wider">Best Streak</div>
            </div>
            <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-4">
              <Timer size={18} className="text-[#4FC3F7] mx-auto mb-2" />
              <div className="text-white font-bold text-xl font-[var(--font-oswald)]">{avgTime}s</div>
              <div className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-wider">Avg Time</div>
            </div>
            <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-4">
              <TrendingUp size={18} className="text-[#FFD54F] mx-auto mb-2" />
              <div className="text-white font-bold text-xl font-[var(--font-oswald)]">+{stats.timeBonuses}</div>
              <div className="text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-wider">Time Bonus</div>
            </div>
          </motion.div>

          {/* Correct vs Wrong */}
          <motion.div
            className="flex items-center justify-center gap-8 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
              <span className="text-[rgba(255,255,255,0.5)] text-sm">{stats.correct} Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F44336]" />
              <span className="text-[rgba(255,255,255,0.5)] text-sm">{stats.wrong} Wrong</span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <button
              onClick={() => startGame(gameMode)}
              className="cta-button flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Play Again
            </button>
            <button
              onClick={() => startGame(gameMode === 'classic' ? 'speed' : 'classic')}
              className="cta-button flex items-center gap-2"
              style={{ borderColor: 'rgba(255,255,255,0.15)' }}
            >
              <Zap size={14} />
              Try {gameMode === 'classic' ? 'Speed Run' : 'Classic'}
            </button>
            <button
              onClick={() => setState('landing')}
              className="cta-button flex items-center gap-2"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <Brain size={14} />
              Main Menu
            </button>
          </motion.div>
        </motion.section>
      </div>
    );
  }

  return null;
}
