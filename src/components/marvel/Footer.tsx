'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Heart, ArrowUp, Send, Zap, Shuffle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { characters } from '@/data/characters';

const quickLinks = [
  { label: 'Home', page: { type: 'home' as const } },
  { label: 'Roster', page: { type: 'roster' as const } },
  { label: 'Compare', page: { type: 'compare' as const } },
  { label: 'Quiz', page: { type: 'quiz' as const } },
  { label: 'Timeline', page: { type: 'timeline' as const } },
  { label: 'Teams', page: { type: 'teams' as const } },
  { label: 'Universes', page: { type: 'universes' as const } },
];

// Pick 4 featured characters that rotate based on the day
function getFeaturedChars() {
  const day = new Date().getDate();
  const start = (day - 1) * 4;
  return characters.slice(start, start + 4);
}

const socialLinks = [
  { label: '𝕏', ariaLabel: 'X (Twitter)' },
  { label: 'IG', ariaLabel: 'Instagram' },
  { label: 'YT', ariaLabel: 'YouTube' },
  { label: 'GH', ariaLabel: 'GitHub' },
];

function useFooterReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export default function Footer() {
  const { navigate } = useAppStore();
  const { ref, visible } = useFooterReveal();
  const featuredChars = getFeaturedChars();

  const handleRandomCharacter = useCallback(() => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    navigate({ type: 'character', slug: randomChar.slug });
  }, [navigate]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="glass-footer footer-depth-gradient animated-grid-bg" ref={ref}>
      {/* Gradient separator at top */}
      <div className="footer-gradient-separator" />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand + Social Icons */}
          <div className={`footer-fade-in ${visible ? 'visible' : ''}`} style={{ transitionDelay: '0ms' }}>
            <button
              onClick={() => navigate({ type: 'home' })}
              className="font-[var(--font-oswald)] text-white text-2xl tracking-wide font-bold block mb-3 hover:opacity-80 transition-all duration-300 logo-underline hover-lift-sm btn-press"
            >
              MARVEL
            </button>
            <p className="text-[rgba(255,255,255,0.4)] text-sm leading-relaxed max-w-xs mb-5">
              The definitive digital experience for exploring every character in the Marvel Cinematic Universe.
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  className="social-icon-btn"
                  aria-label={social.ariaLabel}
                >
                  {social.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={`footer-fade-in ${visible ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            <h4 className="text-white text-xs uppercase tracking-[0.15em] font-bold mb-4 flex items-center gap-2">
              <Zap size={12} className="text-[#ED1D24]" />
              Explore
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.page)}
                    className={`footer-link-animated text-[rgba(255,255,255,0.45)] text-sm flex items-center gap-2 transition-all duration-200 btn-press ${
                      useAppStore.getState().currentPage.type === link.page.type ? '!text-[#ED1D24] font-semibold' : ''
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Featured Characters */}
          <div className={`footer-fade-in ${visible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            <h4 className="text-white text-xs uppercase tracking-[0.15em] font-bold mb-4 flex items-center gap-2">
              <Heart size={12} className="text-[#ED1D24]" />
              Featured Heroes
            </h4>
            <div className="space-y-2.5">
              {featuredChars.map((char) => (
                <button
                  key={char.slug}
                  onClick={() => navigate({ type: 'character', slug: char.slug })}
                  className="flex items-center gap-2.5 group transition-all duration-200 btn-press"
                >
                  <Image
                    src={char.images.switcher}
                    alt={char.name}
                    width={28}
                    height={28}
                    className="featured-char-avatar group-hover:border-[#ED1D24] group-hover:shadow-[0_0_8px_rgba(237,29,36,0.3)]"
                  />
                  <span className="footer-link-animated text-[rgba(255,255,255,0.45)] text-sm">
                    {char.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className={`footer-fade-in ${visible ? 'visible' : ''}`} style={{ transitionDelay: '300ms' }}>
            <h4 className="text-white text-xs uppercase tracking-[0.15em] font-bold mb-4 flex items-center gap-2">
              <Send size={12} className="text-[#ED1D24]" />
              Stay Updated
            </h4>
            <p className="text-[rgba(255,255,255,0.35)] text-xs leading-relaxed mb-4">
              Get Marvel character updates and exclusive content delivered weekly.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="newsletter-input"
                readOnly
              />
              <button
                className="newsletter-send-btn btn-press flex items-center gap-1.5"
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`footer-fade-in mt-12 pt-6 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center ${visible ? 'visible' : ''}`} style={{ transitionDelay: '400ms' }}>
          <p className="text-[rgba(255,255,255,0.25)] text-xs">
            &copy; {new Date().getFullYear()} Marvel Universe Cinematic Guide. Not affiliated with Marvel Entertainment.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRandomCharacter}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#ED1D24]/30 bg-[#ED1D24]/10 text-[#ED1D24] hover:bg-[#ED1D24]/20 hover:border-[#ED1D24]/50 hover:shadow-[0_0_16px_rgba(237,29,36,0.35)] transition-all duration-300 btn-press"
            >
              <Shuffle size={14} />
              Random Character
            </button>
            <span className="text-[rgba(255,255,255,0.25)] text-xs">Made with ❤️ for Marvel Fans</span>
            <button
              onClick={scrollToTop}
              className="back-to-top-btn btn-press hover-lift-sm"
            >
              <ArrowUp size={12} />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
