'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link2, Check, X, Facebook, MessageCircle, Twitter } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  haloColor?: string;
  variant?: 'icon' | 'button';
}

export default function ShareButton({
  title,
  text,
  url,
  className = '',
  size = 'md',
  ariaLabel,
  haloColor = '#ED1D24',
  variant = 'icon',
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useAppStore();

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const btnSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';

  const handleCopy = useCallback(async () => {
    try {
      const shareContent = `${text}\n${url}`;
      await navigator.clipboard.writeText(shareContent);
      setCopied(true);
      showToast('🔗 Link copied to clipboard!');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: use execCommand for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = `${text}\n${url}`;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        showToast('🔗 Link copied to clipboard!');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      } catch {
        showToast('Could not copy link');
      }
    }
    setShowMenu(false);
  }, [text, url, showToast]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // User cancelled — do nothing
        if ((err as DOMException).name === 'AbortError') return;
      }
    }
    // Fallback to clipboard
    handleCopy();
  }, [title, text, url, handleCopy]);

  const handleSocialShare = useCallback((platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
    setShowMenu(false);
  }, [text, url]);

  const handleToggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  // Close menu on outside click
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  }, []);

  // Setup outside click listener with useEffect
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, [handleClickOutside]);

  const defaultAriaLabel = ariaLabel || `Share`;

  if (variant === 'button') {
    return (
      <div className="relative" ref={menuRef}>
        <motion.button
          onClick={handleNativeShare}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`share-btn-glass inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.06)] btn-press ${className}`}
          style={{ '--share-accent': haloColor } as React.CSSProperties}
          aria-label={defaultAriaLabel}
        >
          <Share2 size={iconSize} style={{ color: haloColor }} />
          <span>Share</span>
        </motion.button>
      </div>
    );
  }

  // Icon variant (default)
  return (
    <div className="relative" ref={menuRef}>
      {/* Main share button */}
      <motion.button
        onClick={handleToggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`${btnSize} share-btn-icon rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] backdrop-blur-sm flex items-center justify-center text-[rgba(255,255,255,0.5)] hover:text-white transition-all duration-200 btn-press group ${className}`}
        style={{ '--share-accent': haloColor } as React.CSSProperties}
        aria-label={defaultAriaLabel}
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="copied"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={iconSize} style={{ color: '#4CAF50' }} />
            </motion.span>
          ) : (
            <motion.span
              key="share"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
              className="group-hover:hidden"
            >
              <Share2 size={iconSize} />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Hover overlay - shows share icon with accent color */}
        {!copied && (
          <Share2
            size={iconSize}
            className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ color: haloColor }}
          />
        )}
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 z-50 w-52 share-menu-glass rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#1A1A1A] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu header */}
            <div className="px-3 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
              <p className="text-[rgba(255,255,255,0.3)] text-[10px] uppercase tracking-wider font-bold">Share to</p>
            </div>

            {/* Social share options */}
            <div className="p-1.5">
              <button
                onClick={() => handleSocialShare('twitter')}
                className="share-menu-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 hover:bg-[rgba(255,255,255,0.06)]"
              >
                <div className="w-7 h-7 rounded-md bg-[rgba(29,161,242,0.12)] flex items-center justify-center flex-shrink-0">
                  <Twitter size={13} className="text-[#1DA1F2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium">Twitter / X</p>
                  <p className="text-[rgba(255,255,255,0.3)] text-[10px] truncate">Post a tweet</p>
                </div>
              </button>

              <button
                onClick={() => handleSocialShare('facebook')}
                className="share-menu-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 hover:bg-[rgba(255,255,255,0.06)]"
              >
                <div className="w-7 h-7 rounded-md bg-[rgba(24,119,242,0.12)] flex items-center justify-center flex-shrink-0">
                  <Facebook size={13} className="text-[#1877F2]" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium">Facebook</p>
                  <p className="text-[rgba(255,255,255,0.3)] text-[10px] truncate">Share to timeline</p>
                </div>
              </button>

              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="share-menu-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 hover:bg-[rgba(255,255,255,0.06)]"
              >
                <div className="w-7 h-7 rounded-md bg-[rgba(37,211,102,0.12)] flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={13} className="text-[#25D366]" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium">WhatsApp</p>
                  <p className="text-[rgba(255,255,255,0.3)] text-[10px] truncate">Send a message</p>
                </div>
              </button>
            </div>

            {/* Copy link option */}
            <div className="border-t border-[rgba(255,255,255,0.06)] p-1.5">
              <button
                onClick={handleCopy}
                className="share-menu-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 hover:bg-[rgba(255,255,255,0.06)]"
              >
                <div className="w-7 h-7 rounded-md bg-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0">
                  {copied ? (
                    <Check size={13} className="text-[#4CAF50]" />
                  ) : (
                    <Link2 size={13} className="text-[rgba(255,255,255,0.5)]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </p>
                  <p className="text-[rgba(255,255,255,0.3)] text-[10px] truncate">
                    {copied ? 'Link ready to paste' : url.length > 35 ? url.slice(0, 35) + '...' : url}
                  </p>
                </div>
              </button>
            </div>

            {/* Native share (if available) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <div className="border-t border-[rgba(255,255,255,0.06)] p-1.5">
                <button
                  onClick={handleNativeShare}
                  className="share-menu-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: haloColor + '15' }}
                  >
                    <Share2 size={13} style={{ color: haloColor }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium" style={{ color: haloColor }}>More...</p>
                    <p className="text-[rgba(255,255,255,0.3)] text-[10px]">Use native share sheet</p>
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
