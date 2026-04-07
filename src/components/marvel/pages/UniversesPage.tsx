'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { universes, getUniverseBySlug } from '@/data/universes';
import { useAppStore } from '@/store/useAppStore';

export default function UniversesPage() {
  const { currentPage, navigate } = useAppStore();
  const isUniverseView = currentPage.type === 'universe';
  const universeSlug = isUniverseView ? currentPage.slug : null;
  const selectedUniverse = useMemo(() => universeSlug ? getUniverseBySlug(universeSlug) : null, [universeSlug]);

  const handleSelect = (slug: string) => {
    navigate({ type: 'universe', slug });
  };

  const handleBack = () => {
    navigate({ type: 'universes' });
  };

  // Position for node layout (desktop)
  const nodePositions = [
    { top: '50%', left: '50%', scale: 1.3 },     // Earth-616 center
    { top: '20%', left: '25%', scale: 0.8 },      // Earth-838
    { top: '75%', left: '20%', scale: 0.7 },      // TVA
    { top: '25%', left: '75%', scale: 0.75 },     // Sony
    { top: '70%', left: '78%', scale: 0.75 },     // Fox
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex flex-col items-center justify-center text-center px-4">
        {/* Swirling gradient halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full animate-halo-pulse pointer-events-none"
          style={{ background: 'conic-gradient(from 0deg, #ED1D2415, #7C4DFF15, #00BCD415, #E91E6315, #FFC10715, #ED1D2415)' }} />

        <motion.h1
          className="font-[var(--font-oswald)] text-white font-black uppercase relative z-10"
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: 0.85 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          The<br />Multiverse
        </motion.h1>
        <motion.p
          className="text-[rgba(255,255,255,0.4)] text-sm mt-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Explore the infinite realities
        </motion.p>
      </section>

      <section className="px-4 lg:px-8 pb-24 max-w-[1440px] mx-auto">
        <AnimatePresence mode="wait">
          {!selectedUniverse ? (
            <motion.div
              key="explorer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Desktop: Portal node layout */}
              <div className="hidden lg:block relative h-[600px] mb-12">
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  {universes.map((u, i) => {
                    if (u.isPrimary) return null;
                    const from = nodePositions[0];
                    const to = nodePositions[i];
                    return (
                      <line
                        key={u.id}
                        x1={from.left} y1={from.top} x2={to.left} y2={to.top}
                        stroke={u.haloColor} strokeOpacity={0.15} strokeWidth={1} strokeDasharray="4 4"
                      />
                    );
                  })}
                </svg>

                {universes.map((universe, i) => {
                  const pos = nodePositions[i];
                  return (
                    <motion.button
                      key={universe.id}
                      onClick={() => handleSelect(universe.slug)}
                      className="absolute z-10 group"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        transform: `translate(-50%, -50%) scale(${pos.scale})`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: pos.scale }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      whileHover={{ scale: pos.scale * 1.1 }}
                    >
                      <div
                        className={`floating-animation w-36 h-36 rounded-full flex flex-col items-center justify-center border-2 cursor-pointer transition-shadow duration-300 ${
                          universe.isPrimary ? 'w-44 h-44' : ''
                        }`}
                        style={{
                          borderColor: universe.haloColor + '40',
                          background: `radial-gradient(circle, ${universe.haloColor}20 0%, ${universe.haloColor}05 60%, transparent 80%)`,
                          boxShadow: `0 0 60px ${universe.haloColor}15, inset 0 0 40px ${universe.haloColor}08`,
                          animationDelay: `${i * 0.4}s`,
                        }}
                      >
                        <p className={`font-[var(--font-oswald)] text-white font-bold uppercase text-center px-3 ${universe.isPrimary ? 'text-sm' : 'text-xs'}`}>
                          {universe.name.length > 20 ? universe.name.split('(')[0].trim() : universe.name}
                        </p>
                        {universe.isPrimary && (
                          <p className="text-[10px] mt-1 text-[rgba(255,255,255,0.35)]">PRIMARY</p>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Mobile: Vertical list */}
              <div className="lg:hidden space-y-4">
                {universes.map((universe, i) => (
                  <motion.button
                    key={universe.id}
                    onClick={() => handleSelect(universe.slug)}
                    className="w-full bg-[#141414] rounded-xl border border-[rgba(255,255,255,0.06)] p-5 text-left hover:border-[rgba(255,255,255,0.12)] transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{
                          background: `radial-gradient(circle, ${universe.haloColor}20, transparent)`,
                          border: `2px solid ${universe.haloColor}30`,
                        }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: universe.haloColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm font-bold truncate">{universe.name}</h3>
                        <p className="text-[rgba(255,255,255,0.35)] text-xs mt-0.5">{universe.characterCount} characters</p>
                      </div>
                      {universe.isPrimary && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-[#ED1D24] bg-[#ED1D24]/10">
                          Primary
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={handleBack}
                className="text-[rgba(255,255,255,0.4)] text-sm hover:text-white transition-colors mb-6 flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Back to Multiverse
              </button>

              <div className="bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.06)] overflow-hidden">
                {/* Header */}
                <div className="relative p-8 lg:p-10" style={{ background: `linear-gradient(135deg, ${selectedUniverse.haloColor}10, transparent)` }}>
                  <h2 className="font-[var(--font-oswald)] text-white text-3xl lg:text-4xl font-bold uppercase mb-2">
                    {selectedUniverse.name}
                  </h2>
                  <div className="flex items-center gap-3 mb-4">
                    {selectedUniverse.isPrimary && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ color: selectedUniverse.haloColor, backgroundColor: selectedUniverse.haloColor + '15' }}>
                        Primary Timeline
                      </span>
                    )}
                    <span className="text-[rgba(255,255,255,0.25)] text-xs">{selectedUniverse.characterCount} known characters</span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-8 border-t border-[rgba(255,255,255,0.06)]">
                  <p className="text-[rgba(255,255,255,0.5)] text-sm leading-[1.8]">{selectedUniverse.description}</p>
                </div>

                {/* Key Events */}
                <div className="p-8 border-t border-[rgba(255,255,255,0.06)]">
                  <h3 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase mb-4">Key Events</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUniverse.keyEvents.map((event, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border"
                        style={{
                          borderColor: selectedUniverse.haloColor + '30',
                          backgroundColor: selectedUniverse.haloColor + '10',
                          color: selectedUniverse.haloColor,
                        }}
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related Universes */}
                {selectedUniverse.relatedUniverses.length > 0 && (
                  <div className="p-8 border-t border-[rgba(255,255,255,0.06)]">
                    <h3 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase mb-4">Connected Realities</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedUniverse.relatedUniverses.map(relatedSlug => {
                        const related = getUniverseBySlug(relatedSlug);
                        if (!related) return null;
                        return (
                          <button
                            key={relatedSlug}
                            onClick={() => handleSelect(relatedSlug)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors"
                          >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: related.haloColor }} />
                            <span className="text-white text-xs font-medium">{related.name.split('(')[0].trim()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
