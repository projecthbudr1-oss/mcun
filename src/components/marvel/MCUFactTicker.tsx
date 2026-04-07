'use client';

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MCU_FACTS = [
  "Stan Lee has a cameo appearance in every MCU movie — from Iron Man (2008) through the Multiverse Saga.",
  "Tony Stark's shield in Iron Man 2 is made of the same proto-adamantium vibranium alloy as Captain America's shield.",
  "The total runtime of all Infinity Saga films is over 48 hours — nearly two full days of Marvel content.",
  "Chris Evans was initially offered the role of Loki but turned it down before later being cast as Captain America.",
  "The Avengers' helicarrier in the 2012 film was inspired by S.H.I.E.L.D. designs from the original Marvel comics.",
  "Robert Downey Jr. was considered uninsurable for Iron Man due to his past — Mel Gibson's production company backed him.",
  "Thanos' snap in Infinity War was inspired by a 1991 comic storyline called 'The Infinity Gauntlet.'",
  "Brie Larson trained for 9 hours a day for 5 months to prepare for her role as Captain Marvel.",
  "Tom Holland got the Spider-Man role after doing a screen test with Chris Evans and Robert Downey Jr. in Civil War.",
  "The 'I am Iron Man' line in Endgame was ad-libbed by Robert Downey Jr. — it wasn't in the original script.",
  "Guardians of the Galaxy was considered Marvel's biggest risk — it featured a talking raccoon and a walking tree.",
  "The MCU has earned over $29.5 billion worldwide, making it the highest-grossing film franchise of all time.",
  "Chadwick Boseman kept his Black Panther role a secret from his family until the trailer dropped.",
  "The \"Portal Scene\" in Endgame, where all heroes return, took 6 months to render on VFX computers.",
  "Scarlet Witch and Quicksilver were originally going to appear in an X-Men film before Marvel got the rights back.",
  "Groot's lines only consist of the words 'I am Groot' — Vin Diesel recorded over 1,000 variations of the phrase.",
  "The Marvel Studios logo was updated for Phase 4 to include footage from the original Marvel comics.",
  "Tom Hiddleston originally auditioned for the role of Thor before being cast as Loki — the God of Mischief.",
  "Samuel L. Jackson's Nick Fury cameo in Iron Man's post-credits scene had no script — he improvised.",
  "Doctor Strange viewed exactly 14,000,605 possible outcomes against Thanos — and they won only one.",
  "Sebastian Stan's Winter Soldier arm weighed 26 pounds during filming and was made of fiberglass and metal.",
  "Paul Rudd does not age — Ant-Man has been active in the MCU since 2015 and hasn't changed a bit.",
  "The Quantum Realm from Ant-Man was inspired by real-world concepts from quantum mechanics and subatomic physics.",
  "Black Panther's suit design was inspired by African tribal patterns from multiple real-world cultures across the continent.",
  "The Avengers tower in the MCU is actually the MetLife building in New York City, modified with CGI.",
];

// Detect client-side mounting without triggering lint errors
const emptySubscribe = () => () => {};

function getShuffledFacts(): string[] {
  const shuffled = [...MCU_FACTS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MCUFactTicker() {
  const [factIndex, setFactIndex] = useState(0);
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const shuffledFacts = useMemo(() => (isClient ? getShuffledFacts() : MCU_FACTS), [isClient]);

  const advanceFact = useCallback(() => {
    setFactIndex(prev => (prev + 1) % shuffledFacts.length);
  }, [shuffledFacts.length]);

  useEffect(() => {
    const interval = setInterval(advanceFact, 8000);
    return () => clearInterval(interval);
  }, [advanceFact]);

  const currentFact = shuffledFacts[factIndex];

  if (!isClient) {
    return (
      <div className="w-full py-4 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto bg-[rgba(237,29,36,0.05)] border border-[rgba(237,29,36,0.1)] rounded-lg px-5 py-3 flex items-start gap-3">
          <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ED1D24] block mb-1">Did You Know?</span>
            <p className="text-[rgba(255,255,255,0.4)] text-xs leading-relaxed">Loading MCU trivia...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 px-4 lg:px-8">
      <div
        className="max-w-4xl mx-auto rounded-lg px-5 py-3 flex items-start gap-3 overflow-hidden relative"
        style={{
          background: 'rgba(237, 29, 36, 0.04)',
          border: '1px solid rgba(237, 29, 36, 0.1)',
        }}
      >
        {/* Subtle left accent bar */}
        <div
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, transparent, #ED1D24, transparent)',
            opacity: 0.4,
          }}
        />

        <span className="text-lg flex-shrink-0 mt-0.5" role="img" aria-label="lightbulb">💡</span>
        <div className="flex-1 min-w-0">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-1"
            style={{ color: '#ED1D24' }}
          >
            DID YOU KNOW?
          </span>
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[rgba(255,255,255,0.55)] text-xs sm:text-sm leading-relaxed"
            >
              {currentFact}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Fact counter */}
        <span className="text-[10px] text-[rgba(255,255,255,0.15)] flex-shrink-0 mt-0.5 tabular-nums font-mono">
          {factIndex + 1}/{shuffledFacts.length}
        </span>
      </div>
    </div>
  );
}
