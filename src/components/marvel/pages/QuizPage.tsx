'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, calculateQuizResult } from '@/data/quiz';
import { characters, getCharacterBySlug } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';
import { trackAchievement } from '@/lib/achievements';
import ShareButton from '@/components/marvel/ShareButton';

type QuizState = 'landing' | 'questions' | 'result';

const QUIZ_STORAGE_KEY = 'marvel-quiz-progress';

interface QuizProgressData {
  answers: Record<number, number>;
  result: string | null;
}

function saveQuizProgress(data: QuizProgressData) {
  try {
    sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable
  }
}

function loadQuizProgress(): QuizProgressData | null {
  try {
    const stored = sessionStorage.getItem(QUIZ_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as QuizProgressData;
  } catch {
    return null;
  }
}

function clearQuizProgress() {
  try {
    sessionStorage.removeItem(QUIZ_STORAGE_KEY);
  } catch {
    // sessionStorage unavailable
  }
}

export default function QuizPage() {
  const { quizAnswers, setQuizAnswer, quizResult, setQuizResult, resetQuiz, navigate } = useAppStore();
  const [state, setState] = useState<QuizState>('landing');
  const [animDirection, setAnimDirection] = useState(1);
  const [rotatingName, setRotatingName] = useState(0);

  // Restore quiz progress from sessionStorage on mount
  /* eslint-disable react-hooks/set-state-in-effect -- restoring persisted quiz progress from sessionStorage */
  useEffect(() => {
    const saved = loadQuizProgress();
    if (saved) {
      if (saved.result) {
        // Restore result state
        if (!quizResult) setQuizResult(saved.result);
        setState('result');
      } else if (saved.answers && Object.keys(saved.answers).length > 0) {
        // Restore in-progress quiz
        Object.entries(saved.answers).forEach(([qIdx, aIdx]) => {
          setQuizAnswer(parseInt(qIdx), aIdx);
        });
        setState('questions');
      }
    } else {
      // No saved progress, set initial state based on Zustand store
      setState(quizResult ? 'result' : quizAnswers && Object.keys(quizAnswers).length > 0 ? 'questions' : 'landing');
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist quiz answers to sessionStorage whenever they change
  useEffect(() => {
    const answerCount = Object.keys(quizAnswers).length;
    if (answerCount > 0) {
      saveQuizProgress({ answers: quizAnswers, result: null });
    }
  }, [quizAnswers]);

  // Persist result to sessionStorage
  useEffect(() => {
    if (quizResult) {
      saveQuizProgress({ answers: quizAnswers, result: quizResult });
    }
  }, [quizResult, quizAnswers]);

  const possibleResults = ['spider-man', 'iron-man', 'captain-america', 'thor', 'black-panther', 'doctor-strange', 'loki', 'scarlet-witch', 'black-widow', 'hulk', 'deadpool', 'wolverine'];

  // Rotating names on landing
  useEffect(() => {
    if (state !== 'landing') return;
    const interval = setInterval(() => {
      setRotatingName(prev => (prev + 1) % possibleResults.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [state]);

  const currentQuestion = useMemo(() => {
    const idx = Object.keys(quizAnswers).length;
    return idx < quizQuestions.length ? quizQuestions[idx] : null;
  }, [quizAnswers]);

  const progress = Object.keys(quizAnswers).length / quizQuestions.length * 100;

  const resultCharacter = useMemo(() => {
    if (!quizResult) return null;
    return getCharacterBySlug(quizResult);
  }, [quizResult]);

  const handleStart = useCallback(() => {
    resetQuiz();
    clearQuizProgress();
    setState('questions');
  }, [resetQuiz]);

  const handleAnswer = (answerIndex: number) => {
    const qIndex = Object.keys(quizAnswers).length;
    setQuizAnswer(qIndex, answerIndex);

    // Check if last question
    if (qIndex === quizQuestions.length - 1) {
      const allAnswers = { ...quizAnswers, [qIndex]: answerIndex };
      const result = calculateQuizResult(allAnswers);
      setQuizResult(result);
      trackAchievement('quiz_completed');
      // Save final result to sessionStorage
      saveQuizProgress({ answers: allAnswers, result });
      setTimeout(() => {
        setAnimDirection(1);
        setState('result');
      }, 400);
    }
  };

  const handleRetake = useCallback(() => {
    resetQuiz();
    clearQuizProgress();
    setState('landing');
  }, [resetQuiz]);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AnimatePresence mode="wait">
        {/* Landing */}
        {state === 'landing' && (
          <motion.section
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="relative h-[60vh] min-h-[400px] flex flex-col items-center justify-center text-center px-4"
          >
            {/* Red halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full animate-halo-pulse pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(237,29,36,0.15) 0%, transparent 60%)' }} />

            <motion.p
              className="text-[rgba(255,255,255,0.3)] text-sm uppercase tracking-[0.3em] mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Discover Your Marvel Identity
            </motion.p>

            <motion.h1
              className="font-[var(--font-oswald)] text-white font-black uppercase leading-[0.9] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Which Marvel<br />Character Are You?
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={rotatingName}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-semibold mb-8 h-7"
                style={{ color: possibleResults[rotatingName] ? (getCharacterBySlug(possibleResults[rotatingName])?.haloColor || '#ED1D24') : '#ED1D24' }}
              >
                {getCharacterBySlug(possibleResults[rotatingName])?.name || ''}
              </motion.p>
            </AnimatePresence>

            <motion.button
              onClick={handleStart}
              className="cta-button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Quiz
            </motion.button>
          </motion.section>
        )}

        {/* Questions */}
        {state === 'questions' && currentQuestion && (
          <motion.section
            key={`question-${Object.keys(quizAnswers).length}`}
            initial={{ opacity: 0, x: 50 * animDirection }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-20 pb-10"
          >
            {/* Progress bar */}
            <div className="w-full max-w-xl mb-10">
              <div className="flex justify-between text-[rgba(255,255,255,0.3)] text-xs uppercase tracking-wider mb-2">
                <span>Question {Object.keys(quizAnswers).length + 1} of {quizQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <motion.div
                  className="h-full bg-[#ED1D24] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="w-full max-w-xl bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.06)] p-6 lg:p-10">
              <h2 className="text-white text-lg lg:text-2xl font-semibold text-center leading-tight mb-8">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setAnimDirection(1);
                      handleAnswer(i);
                    }}
                    className="w-full text-left px-5 py-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] text-[rgba(255,255,255,0.7)] text-sm hover:text-white hover:border-[#ED1D24]/40 hover:bg-[#ED1D24]/5 transition-all duration-200 quiz-option"
                    whileHover={{ x: 4, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Result */}
        {state === 'result' && resultCharacter && (
          <motion.section
            key="result"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20"
          >
            {/* Halo */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full animate-halo-pulse pointer-events-none"
              style={{ background: `radial-gradient(circle, ${resultCharacter.haloColor}20 0%, ${resultCharacter.haloColor}08 40%, transparent 70%)` }}
            />

            <motion.p
              className="text-[rgba(255,255,255,0.4)] text-sm uppercase tracking-[0.3em] mb-4 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              You Are...
            </motion.p>

            <motion.div
              className="relative z-10 mb-6 h-[45vh] lg:h-[55vh] pointer-events-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Image
                src={resultCharacter.images.hero}
                alt={resultCharacter.name}
                width={400}
                height={600}
                className="h-full w-auto object-contain drop-shadow-2xl mx-auto"
              />
            </motion.div>

            <motion.h1
              className="font-[var(--font-oswald)] text-white font-black uppercase relative z-10 mb-3"
              style={{ fontSize: 'clamp(2rem, 8vw, 5rem)', color: resultCharacter.haloColor }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {resultCharacter.name}
            </motion.h1>

            <motion.p
              className="text-[rgba(255,255,255,0.5)] text-sm max-w-md relative z-10 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {resultCharacter.tagline} — {resultCharacter.synopsis.slice(0, 120)}...
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 justify-center items-center relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <button onClick={handleRetake} className="cta-button text-xs">
                Retake Quiz
              </button>
              <button
                onClick={() => navigate({ type: 'character', slug: resultCharacter.slug })}
                className="cta-button text-xs"
                style={{ borderColor: resultCharacter.haloColor + '60', backgroundColor: resultCharacter.haloColor + '15', color: resultCharacter.haloColor }}
              >
                Explore Character →
              </button>
              <ShareButton
                title="My MCU Personality Result"
                text={`I got ${resultCharacter.name} in the MCU Personality Quiz! Which Marvel character are you?`}
                url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#quiz` : ''}
                variant="button"
                haloColor={resultCharacter.haloColor}
                ariaLabel={`Share quiz result: ${resultCharacter.name}`}
              />
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
