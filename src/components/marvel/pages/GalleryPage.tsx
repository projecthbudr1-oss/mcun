'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Users, Shield, Swords, Zap, Layers, Filter } from 'lucide-react';
import { characters } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';
import type { MCUCharacter } from '@/data/characters';

const ALIGNMENTS = ['all', 'hero', 'villain', 'anti-hero', 'neutral'] as const;
const TIERS = ['all', 'cosmic', 'omega', 'alpha', 'beta', 'gamma', 'normal'] as const;

const ALIGNMENT_COLORS: Record<string, string> = {
  hero: '#4CAF50',
  villain: '#F44336',
  'anti-hero': '#FF9800',
  neutral: '#9E9E9E',
};

const TIER_COLORS: Record<string, string> = {
  cosmic: '#FFD54F',
  omega: '#7C4DFF',
  alpha: '#4FC3F7',
  beta: '#66BB6A',
  gamma: '#90A4AE',
  normal: '#BDBDBD',
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function GalleryPage() {
  const { navigate } = useAppStore();
  const [alignmentFilter, setAlignmentFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filtered characters
  const filteredCharacters = useMemo(() => {
    return characters.filter((c) => {
      if (alignmentFilter !== 'all' && c.alignment !== alignmentFilter) return false;
      if (tierFilter !== 'all' && c.powerTier !== tierFilter) return false;
      return true;
    });
  }, [alignmentFilter, tierFilter]);

  // Derive a key for animation reset when filters change
  const filterKey = useMemo(() => `${alignmentFilter}-${tierFilter}`, [alignmentFilter, tierFilter]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const navigateLightbox = useCallback((direction: -1 | 1) => {
    if (lightboxIndex === null) return;
    const newIndex = lightboxIndex + direction;
    if (newIndex >= 0 && newIndex < filteredCharacters.length) {
      setLightboxIndex(newIndex);
    }
  }, [lightboxIndex, filteredCharacters.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, navigateLightbox]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const currentLightboxChar = lightboxIndex !== null ? filteredCharacters[lightboxIndex] : null;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 lg:px-8 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 mt-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-shimmer font-[var(--font-oswald)] text-3xl md:text-4xl font-bold uppercase tracking-wide">
            Character Gallery
          </h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED1D24]/10 border border-[#ED1D24]/20 text-[#ED1D24] text-xs font-bold">
            <Users size={12} />
            {characters.length} Characters
          </span>
        </div>
        <p className="text-[rgba(255,255,255,0.45)] text-sm max-w-lg">
          Browse the cinematic portraits of all Marvel characters in the multiverse.
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="mb-6 flex flex-wrap items-center gap-3"
      >
        <Filter size={14} className="text-[rgba(255,255,255,0.3)]" />
        
        {/* Alignment Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {ALIGNMENTS.map((align) => (
            <button
              key={align}
              onClick={() => setAlignmentFilter(align)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border min-h-[36px] btn-press ${
                alignmentFilter === align
                  ? 'text-white'
                  : 'text-[rgba(255,255,255,0.4)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.7)]'
              }`}
              style={
                alignmentFilter === align && align !== 'all'
                  ? { background: `${ALIGNMENT_COLORS[align]}20`, borderColor: `${ALIGNMENT_COLORS[align]}40` }
                  : alignmentFilter === 'all'
                  ? { background: 'rgba(237,29,36,0.15)', borderColor: 'rgba(237,29,36,0.3)' }
                  : {}
              }
            >
              {align === 'all' ? 'All' : align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>

        {/* Tier Filter Dropdown */}
        <div className="relative">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-[#141414] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.6)] text-xs font-medium uppercase tracking-wider rounded-lg px-3 py-2 pr-8 appearance-none cursor-pointer min-h-[36px] focus:outline-none focus:ring-2 focus:ring-[#ED1D24]/50 transition-colors hover:border-[rgba(255,255,255,0.2)]"
          >
            {TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {tier === 'all' ? 'All Tiers' : tier.charAt(0).toUpperCase() + tier.slice(1)}
              </option>
            ))}
          </select>
          <Layers size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[rgba(255,255,255,0.3)]" />
        </div>
      </motion.div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filterKey}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="gallery-grid"
        >
          {filteredCharacters.map((character) => (
            <GalleryTile
              key={character.slug}
              character={character}
              onClick={() => openLightbox(filteredCharacters.indexOf(character))}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && currentLightboxChar && (
          <Lightbox
            character={currentLightboxChar}
            index={lightboxIndex}
            total={filteredCharacters.length}
            onClose={closeLightbox}
            onNavigate={navigateLightbox}
            onViewProfile={() => {
              closeLightbox();
              navigate({ type: 'character', slug: currentLightboxChar.slug });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== Gallery Tile ===== */
function GalleryTile({ character, onClick }: { character: MCUCharacter; onClick: () => void }) {
  return (
    <motion.div
      variants={staggerItem}
      className="gallery-tile"
      onClick={onClick}
      style={{ '--gallery-halo': `${character.haloColor}cc` } as React.CSSProperties}
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={character.images.hero}
          alt={character.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="gallery-tile-image object-cover"
        />
        <div className="gallery-tile-overlay">
          <h3 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase tracking-wide leading-tight drop-shadow-lg">
            {character.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            {/* Alignment Badge */}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
              style={{
                background: `${ALIGNMENT_COLORS[character.alignment]}25`,
                color: ALIGNMENT_COLORS[character.alignment],
                border: `1px solid ${ALIGNMENT_COLORS[character.alignment]}40`,
              }}
            >
              {character.alignment === 'hero' && <Shield size={9} />}
              {character.alignment === 'villain' && <Swords size={9} />}
              {character.alignment === 'anti-hero' && <Zap size={9} />}
              {character.alignment}
            </span>
            {/* Tier Badge */}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
              style={{
                background: `${TIER_COLORS[character.powerTier]}20`,
                color: TIER_COLORS[character.powerTier],
                border: `1px solid ${TIER_COLORS[character.powerTier]}40`,
              }}
            >
              {character.powerTier}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ===== Lightbox ===== */
function Lightbox({
  character,
  index,
  total,
  onClose,
  onNavigate,
  onViewProfile,
}: {
  character: MCUCharacter;
  index: number;
  total: number;
  onClose: () => void;
  onNavigate: (dir: -1 | 1) => void;
  onViewProfile: () => void;
}) {
  const [imgKey, setImgKey] = useState(0);

  const handleNavigate = useCallback((dir: -1 | 1) => {
    setImgKey((k) => k + 1);
    onNavigate(dir);
  }, [onNavigate]);

  return (
    <motion.div
      className="lightbox-backdrop flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[220] w-10 h-10 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-all btn-press"
        aria-label="Close lightbox"
      >
        <X size={18} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 z-[210] text-[rgba(255,255,255,0.4)] text-xs font-medium tracking-widest">
        {index + 1} / {total}
      </div>

      {/* Left Arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); handleNavigate(-1); }}
        className="lightbox-nav-btn lightbox-nav-btn-left"
        aria-label="Previous character"
        style={{ opacity: index > 0 ? 1 : 0.2, pointerEvents: index > 0 ? 'auto' : 'none' }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); handleNavigate(1); }}
        className="lightbox-nav-btn lightbox-nav-btn-right"
        aria-label="Next character"
        style={{ opacity: index < total - 1 ? 1 : 0.2, pointerEvents: index < total - 1 ? 'auto' : 'none' }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Image */}
      <div
        className="lightbox-image-container"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${character.slug}-${imgKey}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl"
            style={{ maxHeight: '80vh', aspectRatio: '3/4' }}
          >
            <Image
              src={character.images.hero}
              alt={character.name}
              fill
              sizes="100vw"
              className="object-contain rounded-lg"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Character Info */}
      <div
        className="lightbox-info"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-[var(--font-oswald)] text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
          {character.name}
        </h2>
        {character.realName && (
          <p className="text-[rgba(255,255,255,0.45)] text-sm mt-1">
            {character.realName}
          </p>
        )}
        {character.tagline && (
          <p className="text-[rgba(255,255,255,0.6)] text-sm mt-2 italic">
            &ldquo;{character.tagline}&rdquo;
          </p>
        )}
        <div className="flex items-center justify-center gap-3 mt-3">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: `${TIER_COLORS[character.powerTier]}20`,
              color: TIER_COLORS[character.powerTier],
              border: `1px solid ${TIER_COLORS[character.powerTier]}40`,
            }}
          >
            {character.powerTier}
          </span>
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: `${ALIGNMENT_COLORS[character.alignment]}20`,
              color: ALIGNMENT_COLORS[character.alignment],
              border: `1px solid ${ALIGNMENT_COLORS[character.alignment]}40`,
            }}
          >
            {character.alignment}
          </span>
        </div>
        <button
          onClick={onViewProfile}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#ED1D24] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#C4181F] transition-colors btn-press"
        >
          View Profile
        </button>
      </div>
    </motion.div>
  );
}
