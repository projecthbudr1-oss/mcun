'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  cursorColor?: string;
}

// Deterministic random for character timing (avoids hydration mismatch)
function seededCharDelay(index: number, seed: number): number {
  const x = Math.sin(seed * 127.1 + index * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface CharEntry {
  key: string;
  char: string;
  globalIdx: number;
  isSpace: boolean;
  isWordStart: boolean;
}

// Precompute character entries with word grouping info (pure function)
function buildCharEntries(text: string): CharEntry[] {
  const words = text.split(' ');
  const entries: CharEntry[] = [];
  let globalIdx = 0;

  for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
    const wordChars = words[wordIdx].split('');
    for (let charIdx = 0; charIdx < wordChars.length; charIdx++) {
      entries.push({
        key: `${wordIdx}-${charIdx}`,
        char: wordChars[charIdx],
        globalIdx,
        isSpace: false,
        isWordStart: charIdx === 0,
      });
      globalIdx++;
    }
    // Add space between words (not after last word)
    if (wordIdx < words.length - 1) {
      entries.push({
        key: `space-${wordIdx}`,
        char: ' ',
        globalIdx,
        isSpace: true,
        isWordStart: false,
      });
      globalIdx++;
    }
  }
  return entries;
}

export default function TypewriterText({ text, speed = 50, className = '', cursorColor = '#ED1D24' }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const charEntries = useMemo(() => buildCharEntries(text), [text]);
  const seed = useMemo(() => text.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0), [text]);

  // Typing effect
  useEffect(() => {
    if (!text) return;

    setIsTyping(true);
    setDisplayText('');
    let currentIndex = 0;

    const typeNext = () => {
      if (currentIndex < text.length) {
        const charRandom = seededCharDelay(currentIndex, seed);
        const charDelay = 30 + charRandom * 40;
        const timeout = setTimeout(() => {
          currentIndex++;
          setDisplayText(text.slice(0, currentIndex));
          typeNext();
        }, charDelay);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
      }
    };

    const cleanup = typeNext();
    return cleanup;
  }, [text, seed]);

  // Show cursor while typing
  useEffect(() => {
    if (isTyping) {
      setShowCursor(true);
    } else {
      const hideTimer = setTimeout(() => {}, 2000);
      return () => clearTimeout(hideTimer);
    }
  }, [isTyping]);

  // Group entries by word (for nowrap wrapping)
  const wordGroups = useMemo(() => {
    const groups: CharEntry[][] = [];
    let currentGroup: CharEntry[] = [];

    for (const entry of charEntries) {
      if (entry.isWordStart && currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
      }
      currentGroup.push(entry);
      if (entry.isSpace) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    }
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    return groups;
  }, [charEntries]);

  return (
    <span className={`inline ${className}`} aria-label={text}>
      {wordGroups.map((group, groupIdx) => (
        <span key={`wg-${groupIdx}`} style={{ whiteSpace: 'nowrap' }}>
          {group.map((entry) => (
            <motion.span
              key={entry.key}
              className="typewriter-char"
              initial={{ opacity: 0 }}
              animate={entry.globalIdx < displayText.length ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.01 }}
            >
              {entry.char}
            </motion.span>
          ))}
        </span>
      ))}
      {showCursor && (
        <span
          className="typewriter-cursor"
          style={{ '--typewriter-color': cursorColor } as React.CSSProperties}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
