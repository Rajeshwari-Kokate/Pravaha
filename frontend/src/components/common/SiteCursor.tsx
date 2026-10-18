import { useEffect, useState, useRef, type FC } from 'react';

export const SiteCursor: FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Position state with easing
  const posRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch device or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || isReduced) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      if (!visible) setVisible(true);
    };

    const onMouseEnter = () => setVisible(true);
    const onMouseLeave = () => setVisible(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest(
        'a, button, input, select, textarea, [role="button"], [role="slider"], [role="tab"], .interactive-cursor'
      );
      setHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    // Animation loop with light easing
    const render = () => {
      const p = posRef.current;
      // Linear interpolation with 0.2 factor for subtle easing
      p.x += (p.targetX - p.x) * 0.22;
      p.y += (p.targetY - p.y) * 0.22;

      if (cursorRef.current && dotRef.current) {
        cursorRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        dotRef.current.style.transform = `translate3d(${p.targetX}px, ${p.targetY}px, 0)`;
      }
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseover', onMouseOver);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [visible]);

  if (!enabled || !visible) return null;

  return (
    <div id="site-cursor" className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden" aria-hidden="true">
      {/* Outer subtle easing ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 -ml-3 -mt-3 rounded-full border border-teal-500/80 dark:border-teal-400/80 pointer-events-none transition-[width,height,opacity,background-color] duration-150 ease-out ${
          hovering
            ? 'w-10 h-10 -ml-5 -mt-5 bg-teal-500/10 dark:bg-teal-400/15 border-teal-600 dark:border-teal-300'
            : 'w-6 h-6 bg-transparent'
        }`}
      />
      {/* Inner tiny dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 pointer-events-none"
      />
    </div>
  );
};
