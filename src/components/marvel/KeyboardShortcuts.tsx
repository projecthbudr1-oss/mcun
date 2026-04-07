'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, Keyboard, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Command, CornerDownLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const SHORTCUTS = [
  { keys: ['⌘K', '/ Ctrl+K'], description: 'Search characters', icon: Search, category: 'Navigation' },
  { keys: ['⌘+/'], description: 'Show shortcuts', icon: HelpCircle, category: 'Navigation' },
  { keys: ['↑', '↓'], description: 'Navigate hero switcher', icon: ArrowUp, category: 'Navigation' },
  { keys: ['←', '→'], description: 'Browser back / forward', icon: ArrowLeft, category: 'Navigation' },
  { keys: ['1-6'], description: 'Switch character tabs', icon: Keyboard, category: 'Tabs' },
  { keys: ['Esc'], description: 'Close modals / Go home', icon: CornerDownLeft, category: 'General' },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const { openSearch, goHome, searchOpen, closeSearch } = useAppStore();

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard shortcut: ⌘+/ to toggle panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        togglePanel();
      }
      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
      // ⌘K handled by existing search overlay
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, togglePanel, closePanel]);

  return (
    <>
      {/* Floating ? button */}
      <motion.button
        onClick={togglePanel}
        className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full bg-[#1A1A1A] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[rgba(255,255,255,0.35)] hover:text-white hover:border-[rgba(255,255,255,0.2)] hover:bg-[#222] transition-all duration-200 shadow-xl btn-press"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Show keyboard shortcuts"
      >
        <HelpCircle size={18} />
      </motion.button>

      {/* Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={closePanel}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-[90vw] max-w-[420px] rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(20, 20, 20, 0.85)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 0 80px rgba(237,29,36,0.08), 0 25px 50px rgba(0,0,0,0.5)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                  <Keyboard size={18} className="text-[#ED1D24]" />
                  <h3 className="font-[var(--font-oswald)] text-white text-base font-bold uppercase tracking-wide">
                    Keyboard Shortcuts
                  </h3>
                </div>
                <button
                  onClick={closePanel}
                  className="text-[rgba(255,255,255,0.3)] hover:text-white transition-colors p-1 btn-press"
                  aria-label="Close"
                >
                  <CornerDownLeft size={16} />
                </button>
              </div>

              {/* Shortcuts list */}
              <div className="px-6 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
                {SHORTCUTS.map((shortcut, i) => {
                  const Icon = shortcut.icon;
                  return (
                    <motion.div
                      key={shortcut.description}
                      className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-150"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <div className="w-8 h-8 rounded-md bg-[rgba(237,29,36,0.08)] flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-[#ED1D24]" />
                      </div>
                      <span className="text-[rgba(255,255,255,0.6)] text-sm flex-1">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, j) => (
                          <kbd
                            key={`${key}-${j}`}
                            className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[10px] font-mono font-medium text-[rgba(255,255,255,0.5)] min-w-[24px]"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-[rgba(255,255,255,0.06)] text-center">
                <p className="text-[rgba(255,255,255,0.2)] text-[10px] uppercase tracking-wider">
                  Press ⌘+/ or Esc to close
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
