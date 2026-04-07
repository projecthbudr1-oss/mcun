'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

// CSS-only floating particles for the void
function VoidParticles() {
  const particles = [
    { top: '15%', left: '20%', size: 3, duration: 12, delay: 0 },
    { top: '30%', left: '70%', size: 2, duration: 15, delay: 1.5 },
    { top: '55%', left: '15%', size: 4, duration: 10, delay: 3 },
    { top: '70%', left: '80%', size: 2, duration: 14, delay: 2 },
    { top: '25%', left: '50%', size: 3, duration: 11, delay: 4 },
    { top: '80%', left: '35%', size: 2, duration: 16, delay: 1 },
    { top: '45%', left: '90%', size: 3, duration: 13, delay: 2.5 },
    { top: '10%', left: '40%', size: 2, duration: 17, delay: 0.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          suppressHydrationWarning
          className="not-found-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            '--nf-drift-x': `${(Math.sin(i * 1.7) * 40).toFixed(0)}px`,
            '--nf-drift-y': `${(Math.cos(i * 2.3) * -50).toFixed(0)}px`,
            '--nf-duration': `${p.duration}s`,
            '--nf-delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function NotFoundPage() {
  const goHome = useAppStore((s) => s.goHome);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Dark void background with subtle red glow */}
      <div className="absolute inset-0 bg-[#050505]">
        {/* Red radial glow at center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(237,29,36,0.08) 0%, rgba(237,29,36,0.02) 40%, transparent 70%)',
          }}
        />
        {/* Secondary glow offset */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none animate-halo-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(237,29,36,0.05) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Floating particles */}
      <VoidParticles />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Cosmic portal ring */}
        <div className="relative inline-block mb-8">
          <motion.div
            className="w-40 h-40 lg:w-56 lg:h-56 rounded-full flex items-center justify-center"
            style={{
              border: '1px solid rgba(237,29,36,0.2)',
              background: 'radial-gradient(circle, rgba(237,29,36,0.04) 0%, transparent 70%)',
            }}
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Inner ring */}
            <motion.div
              className="absolute inset-4 rounded-full"
              style={{
                border: '1px solid rgba(237,29,36,0.15)',
                background: 'radial-gradient(circle, rgba(237,29,36,0.06) 0%, transparent 70%)',
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Pulsing center dot */}
            <motion.div
              className="w-3 h-3 rounded-full bg-[#ED1D24]"
              animate={{
                boxShadow: [
                  '0 0 10px rgba(237,29,36,0.3)',
                  '0 0 30px rgba(237,29,36,0.6)',
                  '0 0 10px rgba(237,29,36,0.3)',
                ],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Orbiting ring dots */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-[#ED1D24]/40"
            style={{ top: 0, left: '50%', marginLeft: -4 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full bg-[#ED1D24]/25"
            style={{ bottom: '10%', right: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* 404 Text */}
        <motion.h1
          className="font-[var(--font-oswald)] text-white font-black uppercase tracking-[-0.02em] mb-4"
          style={{ fontSize: 'clamp(6rem, 20vw, 14rem)', lineHeight: 0.85 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.08, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          404
        </motion.h1>

        {/* Foreground 404 text with glow */}
        <motion.div
          className="relative -mt-20 lg:-mt-28 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="font-[var(--font-oswald)] text-[#ED1D24] font-black uppercase"
            style={{
              fontSize: 'clamp(4rem, 15vw, 10rem)',
              lineHeight: 0.85,
              textShadow: '0 0 60px rgba(237,29,36,0.4), 0 0 120px rgba(237,29,36,0.2)',
            }}
          >
            404
          </h2>
        </motion.div>

        {/* Message */}
        <motion.p
          className="text-[rgba(255,255,255,0.5)] text-base lg:text-lg font-medium mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          This universe doesn&apos;t exist... yet.
        </motion.p>

        <motion.p
          className="text-[rgba(255,255,255,0.25)] text-sm mb-10 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          The reality you&apos;re looking for has collapsed into the quantum void.
          Perhaps try another path through the multiverse?
        </motion.p>

        {/* Return button */}
        <motion.button
          onClick={goHome}
          className="cta-button btn-press mx-auto"
          style={{
            borderColor: 'rgba(237,29,36,0.4)',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = '#ED1D24';
            (e.target as HTMLElement).style.borderColor = '#ED1D24';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = 'transparent';
            (e.target as HTMLElement).style.borderColor = 'rgba(237,29,36,0.4)';
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          RETURN TO THE MULTIVERSE
        </motion.button>
      </div>
    </div>
  );
}
