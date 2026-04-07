'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { characters, type MCUCharacter } from '@/data/characters';
import { getPhase } from '@/components/marvel/ConnectionWeb';
import { useAppStore } from '@/store/useAppStore';
import ScrollReveal from '@/components/marvel/ScrollReveal';
import ShareButton from '@/components/marvel/ShareButton';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEntry {
  movie: string;
  year: number;
  characters: string[];
  synopsis: string;
}

interface Phase {
  name: string;
  range: string;
  entries: TimelineEntry[];
}

const TIMELINE_PHASE_COLORS: Record<number, string> = {
  1: '#B71C1C',
  2: '#1565C0',
  3: '#2E7D32',
  4: '#E65100',
  5: '#6A1B9A',
  6: '#00838F',
};

function buildTimeline(): Phase[] {
  const movieMap = new Map<string, TimelineEntry>();

  characters.forEach(char => {
    char.appearances.forEach(app => {
      const key = `${app.movie}`;
      if (!movieMap.has(key)) {
        movieMap.set(key, {
          movie: app.movie,
          year: app.year,
          characters: [],
          synopsis: app.notes,
        });
      }
      movieMap.get(key)!.characters.push(char.slug);
    });
  });

  const entries = Array.from(movieMap.values()).sort((a, b) => a.year - b.year || a.movie.localeCompare(b.movie));

  const phases: Phase[] = [
    { name: 'Phase 1: Assembly', range: '2008–2012', entries: [] },
    { name: 'Phase 2: Expansion', range: '2013–2015', entries: [] },
    { name: 'Phase 3: Infinity War', range: '2016–2019', entries: [] },
    { name: 'Phase 4: Rebuilding', range: '2021–2022', entries: [] },
    { name: 'Phase 5: Multiverse Saga', range: '2023–2025', entries: [] },
    { name: 'Phase 6: Secret Wars', range: '2025+', entries: [] },
  ];

  entries.forEach(entry => {
    if (entry.year <= 2012) phases[0].entries.push(entry);
    else if (entry.year <= 2015) phases[1].entries.push(entry);
    else if (entry.year <= 2019) phases[2].entries.push(entry);
    else if (entry.year <= 2022) phases[3].entries.push(entry);
    else if (entry.year <= 2025) phases[4].entries.push(entry);
    else phases[5].entries.push(entry);
  });

  return phases.filter(p => p.entries.length > 0);
}

const phases = buildTimeline();

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function TimelineEntryCard({ entry, isLeft, entryIndex }: { entry: TimelineEntry; isLeft: boolean; entryIndex: number }) {
  const { navigate } = useAppStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const chars = entry.characters.slice(0, 5).map(slug => characters.find(c => c.slug === slug)).filter(Boolean).slice(0, 4) as MCUCharacter[];

  // GSAP parallax depth: card moves at 0.9x, inner content at 1x
  useEffect(() => {
    const card = cardRef.current;
    const inner = innerRef.current;
    if (!card || !inner) return;

    // Card parallax depth — card moves at 0.9x scroll speed
    const cardParallax = gsap.to(card, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Inner content counteracts at 1x relative to card (moves at ~1.0x absolute)
    const innerParallax = gsap.to(inner, {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    return () => {
      cardParallax.scrollTrigger?.kill();
      innerParallax.scrollTrigger?.kill();
    };
  }, []);

  return (
    <ScrollReveal direction={isLeft ? 'left' : 'right'} delay={0.05 * (entryIndex % 4)}>
      <div
        className={`relative md:w-[calc(50%-40px)] ${isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'}`}
      >
        {/* Connecting line from entry to timeline */}
        <div className="absolute left-[-28px] md:left-[-20px] top-4 timeline-connector-line"
          style={{ '--connector-index': entryIndex } as React.CSSProperties}
        />

        {/* Dot on the timeline - colored by phase */}
        <div
          className="absolute left-[-28px] md:left-[-20px] top-4 w-2.5 h-2.5 rounded-full border-2 border-[#0A0A0A] z-10"
          style={{ backgroundColor: TIMELINE_PHASE_COLORS[getPhase(entry.year)] || 'rgba(255,255,255,0.2)' }}
        />

        {/* Parallax card wrapper (0.9x) */}
        <div ref={cardRef} className="parallax-layer">
          {/* Inner content wrapper (1x) */}
          <div ref={innerRef}>
            <div className="bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-4 hover:border-[rgba(255,255,255,0.12)] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-12 h-16 rounded-md bg-[#1A1A1A] flex-shrink-0 flex items-center justify-center border border-[rgba(255,255,255,0.04)]">
                  <span className="text-[rgba(255,255,255,0.1)] text-[10px] font-bold">{entry.year}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white text-sm font-semibold truncate">{entry.movie}</h3>
                    <span
                      className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{
                        color: TIMELINE_PHASE_COLORS[getPhase(entry.year)] || '#666',
                        backgroundColor: (TIMELINE_PHASE_COLORS[getPhase(entry.year)] || '#666') + '18',
                        border: `1px solid ${(TIMELINE_PHASE_COLORS[getPhase(entry.year)] || '#666')}30`,
                      }}
                    >
                      Phase {getPhase(entry.year)}
                    </span>
                  </div>
                  <p className="text-[rgba(255,255,255,0.3)] text-xs mb-2">{entry.year}</p>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs line-clamp-2">{entry.synopsis}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {chars.map(c => (
                      <button
                        key={c.slug}
                        onClick={() => navigate({ type: 'character', slug: c.slug })}
                        className="w-5 h-5 rounded-full overflow-hidden border border-[rgba(255,255,255,0.1)] hover:scale-125 transition-transform flex-shrink-0"
                        title={c.name}
                        aria-label={`View ${c.name}`}
                      >
                        <img src={c.images.switcher} alt={c.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {entry.characters.length > 4 && (
                      <span className="text-[rgba(255,255,255,0.25)] text-[10px]">+{entry.characters.length - 4}</span>
                    )}
                    <div className="ml-auto">
                      <ShareButton
                        title={`${entry.movie} – MCU Timeline`}
                        text={`Check out "${entry.movie}" (${entry.year}) in the Marvel Cinematic Universe timeline.`}
                        url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#timeline` : ''}
                        size="sm"
                        ariaLabel={`Share ${entry.movie} event`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function PhaseSection({ phase, phaseIndex }: { phase: Phase; phaseIndex: number }) {
  const phaseLabelRef = useRef<HTMLDivElement>(null);
  const { ref, visible } = useReveal();

  // GSAP parallax on phase marker labels: move at 0.5x scroll speed
  useEffect(() => {
    const el = phaseLabelRef.current;
    if (!el) return;

    const parallax = gsap.to(el, {
      yPercent: -25,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    });

    return () => {
      parallax.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div ref={ref}>
      {/* Phase marker with parallax */}
      <div ref={phaseLabelRef} className="parallax-layer relative flex items-center mb-8 ml-10 md:ml-0">
        <motion.div
          className="relative flex items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Pulsing phase dot - colored by phase */}
          <div
            className="absolute left-[-24px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full border-4 border-[#0A0A0A] z-10 timeline-phase-dot"
            style={{ backgroundColor: TIMELINE_PHASE_COLORS[phaseIndex + 1] || '#ED1D24' }}
          />

          <div className="bg-[#141414] rounded-lg border border-[rgba(255,255,255,0.06)] px-4 py-2 md:ml-[40px]">
            <h2 className="font-[var(--font-oswald)] text-sm lg:text-base font-bold uppercase tracking-wide" style={{ color: TIMELINE_PHASE_COLORS[phaseIndex + 1] || '#ED1D24' }}>
              {phase.name}
            </h2>
            <p className="text-[rgba(255,255,255,0.3)] text-xs">{phase.range}</p>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6 mb-12 ml-10 md:ml-0">
        {phase.entries.map((entry, eIdx) => (
          <TimelineEntryCard
            key={entry.movie}
            entry={entry}
            isLeft={(phaseIndex * 10 + eIdx) % 2 === 0}
            entryIndex={phaseIndex * 10 + eIdx}
          />
        ))}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger: timeline center line draws on scroll, entries slide in from alternating sides
  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    // Timeline center line draws progressively as user scrolls
    const lineDraw = gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 30%',
          end: 'bottom 70%',
          scrub: 0.8,
        },
      }
    );

    return () => {
      lineDraw.scrollTrigger?.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div className="pt-20 pb-24 px-4 lg:px-8 max-w-[1440px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
        <h1 className="font-[var(--font-oswald)] text-white text-4xl lg:text-5xl font-bold uppercase tracking-wide mb-2">
          MCU Timeline
        </h1>
        <p className="text-[rgba(255,255,255,0.4)] text-sm">The complete chronological journey through the Marvel Cinematic Universe</p>
      </motion.div>

      <div className="relative" ref={containerRef}>
        {/* GSAP-driven timeline center line: draws on scroll */}
        <div
          ref={lineRef}
          className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 timeline-draw-line"
          style={{
            background: 'linear-gradient(180deg, #ED1D24 0%, rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.08) 90%, rgba(237,29,36,0.3) 100%)',
            transformOrigin: 'top center',
          }}
        />

        {phases.map((phase, pIdx) => (
          <PhaseSection key={phase.name} phase={phase} phaseIndex={pIdx} />
        ))}
      </div>
    </div>
  );
}
