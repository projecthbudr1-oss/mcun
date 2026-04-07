'use client';

import { useEffect, useRef } from 'react';
import { useSpring } from 'framer-motion';

interface MagneticOptions {
  strength?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

/**
 * Hook that adds a magnetic pull effect to interactive elements.
 * When the mouse moves within the element's bounds, the element subtly
 * follows the cursor. On mouse leave, it springs back to its original position.
 * Only activates on devices with hover capability (desktop).
 *
 * @param ref - React ref to the target element
 * @param options - Configuration options
 * @returns Object with mouse handlers to spread onto the element
 */
export function useMagneticEffect<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options: MagneticOptions = {}
) {
  const {
    strength = 0.3,
    stiffness = 150,
    damping = 15,
    mass = 0.1,
  } = options;

  const isHovering = useRef(false);
  const rafId = useRef<number>(0);

  const springX = useSpring(0, { stiffness, damping, mass, restDelta: 0.001 });
  const springY = useSpring(0, { stiffness, damping, mass, restDelta: 0.001 });

  // Apply transform whenever spring values change
  useEffect(() => {
    const unsubX = springX.on('change', (x) => {
      const el = ref.current;
      if (!el || !isHovering.current) return;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        el.style.transform = `translate(${x}px, ${springY.get()}px)`;
      });
    });

    const unsubY = springY.on('change', () => {
      // x change already handles the transform update
    });

    return () => {
      unsubX();
      unsubY();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    springX.set(offsetX * strength);
    springY.set(offsetY * strength);

    if (!isHovering.current) {
      isHovering.current = true;
      el.classList.add('magnetic-active');
    }
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;

    isHovering.current = false;
    springX.set(0);
    springY.set(0);

    const timeout = setTimeout(() => {
      el.classList.remove('magnetic-active');
    }, 300);

    (el as HTMLElement & { _magTimeout?: number })._magTimeout = timeout;
  }

  // Cleanup on unmount
  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) {
        el.classList.remove('magnetic-active');
        el.style.transform = '';
        const timeout = (el as HTMLElement & { _magTimeout?: number })._magTimeout;
        if (timeout) clearTimeout(timeout);
        if (rafId.current) cancelAnimationFrame(rafId.current);
      }
    };
  
  }, []);

  return {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
}
