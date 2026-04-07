'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Quote } from 'lucide-react';

interface QuotePlayerProps {
  quote: string;
  quoteSource?: string | null;
  haloColor: string;
}

export default function QuotePlayer({ quote, quoteSource, haloColor }: QuotePlayerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
    }
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const handlePlay = useCallback(() => {
    if (!isSupported) {
      setShowFallback(prev => !prev);
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(quote);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setShowFallback(true);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [quote, isSpeaking, isSupported]);

  return (
    <div className="relative">
      {/* Play Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePlay}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border"
        style={{
          color: isSpeaking ? haloColor : 'rgba(255,255,255,0.5)',
          backgroundColor: isSpeaking ? haloColor + '15' : 'rgba(255,255,255,0.04)',
          borderColor: isSpeaking ? haloColor + '40' : 'rgba(255,255,255,0.08)',
        }}
        aria-label={isSpeaking ? 'Stop quote' : 'Play quote'}
      >
        {isSpeaking ? (
          <>
            {/* Speaking wave animation */}
            <div className="flex items-center gap-0.5 h-4">
              {[0, 1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full"
                  style={{ backgroundColor: haloColor }}
                  animate={{ height: ['4px', `${12 + Math.random() * 8}px`, '4px'] }}
                  transition={{
                    duration: 0.6 + i * 0.1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: i * 0.08,
                  }}
                />
              ))}
            </div>
            <span>Speaking...</span>
          </>
        ) : (
          <>
            {isSupported ? (
              <Volume2 size={14} />
            ) : (
              <Quote size={14} />
            )}
            <span>{isSupported ? 'Famous Quote' : 'Show Quote'}</span>
          </>
        )}
      </motion.button>

      {/* Fallback tooltip for unsupported browsers */}
      <AnimatePresence>
        {showFallback && !isSupported && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 mt-2 z-50 max-w-xs"
          >
            <div
              className="bg-[#1A1A1A] border rounded-lg p-3 shadow-xl text-sm"
              style={{
                borderColor: haloColor + '30',
              }}
            >
              <p className="text-white italic mb-1">&ldquo;{quote}&rdquo;</p>
              {quoteSource && (
                <p className="text-[rgba(255,255,255,0.35)] text-xs">— {quoteSource}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
