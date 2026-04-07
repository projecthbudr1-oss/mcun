'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

/* ─── Count-up hook (cubic ease-out, one-shot) ─── */
function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!active || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number;
    let animFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.round(eased * target));
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [active, target, duration]);

  return count;
}

/* ─── IntersectionObserver wrapper ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ─── Stat definition ─── */
interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon: string; // emoji/icon character for accent dot
}

const STATS: StatItem[] = [
  { value: 36, label: 'Characters Profiled', icon: '⭐' },
  { value: 4, label: 'Major Teams', icon: '🛡️' },
  { value: 10, label: 'MCU Phases', icon: '🎬' },
  { value: 100, prefix: '', suffix: '+', label: 'Years of Comics History', icon: '📚' },
  { value: 30, prefix: '$', suffix: 'B+', label: 'Box Office Revenue', icon: '💰' },
  { value: 6, label: 'Infinity Stones', icon: '💎' },
  { value: 1, label: 'Multiverse', icon: '🌀' },
];

/* ─── Framer-motion stagger variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─── Individual stat card ─── */
function StatCard({ stat, inView }: { stat: StatItem; inView: boolean }) {
  const count = useCountUp(stat.value, inView);

  const displayValue = useCallback(() => {
    if (stat.prefix) return `${stat.prefix}${count}${stat.suffix || ''}`;
    if (stat.suffix) return `${count}${stat.suffix}`;
    return String(count);
  }, [count, stat.prefix, stat.suffix]);

  return (
    <motion.div
      className="stat-number-card group"
      variants={cardVariants}
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Red accent dot */}
      <div className="stat-accent-dot" />

      {/* Number */}
      <div className="stat-number count-up">
        {displayValue()}
      </div>

      {/* Label */}
      <div className="stat-label">
        {stat.label.toUpperCase()}
      </div>

      {/* Hover glow overlay */}
      <div className="stat-hover-glow" />
    </motion.div>
  );
}

/* ─── Main section ─── */
export default function MCUByTheNumbers() {
  const { ref, inView } = useInView(0.15);

  return (
    <section
      ref={ref}
      className="py-20 px-4 lg:px-8 max-w-[1440px] mx-auto"
      aria-label="MCU statistics"
    >
      {/* Section header */}
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-[var(--font-oswald)] text-gradient text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-2">
          MCU By The Numbers
        </h2>
        <p className="text-[rgba(255,255,255,0.4)] text-sm">
          The Marvel Cinematic Universe in key figures
        </p>
        {/* Decorative line */}
        <div className="mt-4 mx-auto w-24 h-[2px] bg-gradient-to-r from-transparent via-[#ED1D24] to-transparent opacity-60" />
      </motion.div>

      {/* Stats grid */}
      <motion.div
        className="stat-grid"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {STATS.map((stat, i) => (
          <StatCard key={i} stat={stat} inView={inView} />
        ))}
      </motion.div>
    </section>
  );
}
