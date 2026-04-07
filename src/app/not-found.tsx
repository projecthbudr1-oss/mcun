'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Home, Sparkles } from 'lucide-react';

/* ── Deterministic particle positions (avoids hydration mismatch) ── */
function seededFloat(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const PARTICLE_COUNT = 40;

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function NotFound() {
  useEffect(() => {
    document.title = '404 — Lost in the Multiverse | Marvel Cinematic Character Guide';
  }, []);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: `${seededFloat(i * 3 + 1) * 100}%`,
      top: `${seededFloat(i * 5 + 2) * 100}%`,
      size: seededFloat(i * 7 + 3) * 3 + 1,
      duration: seededFloat(i * 11 + 4) * 6 + 5,
      delay: seededFloat(i * 13 + 5) * 5,
      opacity: seededFloat(i * 17 + 6) * 0.4 + 0.1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
      {/* Cosmic void gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(237,29,36,0.06) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(124,77,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(255,109,0,0.03) 0%, transparent 50%)',
        }}
      />

      {/* Floating cosmic dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="cosmic-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--particle-opacity': p.opacity,
              '--particle-color':
                p.id % 3 === 0
                  ? '#ED1D24'
                  : p.id % 3 === 1
                    ? '#7C4DFF'
                    : '#FF6D00',
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
      }} />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Giant 404 with glitch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <h1
            className="glitch-text relative inline-block"
            data-text="404"
            style={{
              fontFamily: 'var(--font-oswald), Impact, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(8rem, 25vw, 16rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.03em',
              color: '#ED1D24',
              textShadow: '0 0 60px rgba(237,29,36,0.3), 0 0 120px rgba(237,29,36,0.1)',
            }}
            aria-label="404"
          >
            404
          </h1>
        </motion.div>

        {/* Subtitle with shimmer */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-shimmer text-2xl md:text-3xl font-bold uppercase tracking-[0.2em] mb-6"
          style={{
            fontFamily: 'var(--font-oswald), sans-serif',
          }}
        >
          Page Not Found
        </motion.h2>

        {/* Humorous Marvel message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-shimmer text-base md:text-lg leading-relaxed mb-3 font-[var(--font-oswald)] uppercase tracking-[0.15em]"
        >
          Looks like this page got snapped by Thanos
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-[rgba(255,255,255,0.35)] text-sm md:text-base leading-relaxed mb-10"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Half of all web pages disappeared, and unfortunately this was one of them.
          <br />
          Maybe Doctor Strange saw this in one of his 14,000,605 visions.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="/"
            className="red-glow-pulse inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-[0.15em] transition-all duration-300 btn-press"
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              background: '#ED1D24',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Home size={18} />
            Return to Home
          </a>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 mb-8 mx-auto w-48 h-px bg-gradient-to-r from-transparent via-[rgba(237,29,36,0.3)] to-transparent"
        />

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <Sparkles
            size={14}
            className="inline text-[#ED1D24] mr-2 opacity-60"
          />
          <span
            className="text-[rgba(255,255,255,0.25)] text-xs md:text-sm italic tracking-wide"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            &quot;Even the multiverse has its dead ends.&quot;
          </span>
          <Sparkles
            size={14}
            className="inline text-[#ED1D24] ml-2 opacity-60"
          />
        </motion.blockquote>
      </div>

      {/* Scanline overlay for cinema effect */}
      <div className="scanline-overlay absolute inset-0 pointer-events-none" />
    </div>
  );
}
