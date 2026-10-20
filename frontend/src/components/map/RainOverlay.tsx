/**
 * RainOverlay.tsx
 * Subtle HTML5 Canvas rain streak overlay over the map.
 * Active when a simulation is playing and rain effect is enabled.
 * Respects prefers-reduced-motion and caps particles for performance.
 */
import { useEffect, useRef, type FC } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface RainOverlayProps {
  isPlaying: boolean;
  intensityMmHr: number;
  enabled?: boolean;
}

export const RainOverlay: FC<RainOverlayProps> = ({
  isPlaying,
  intensityMmHr,
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isPlaying || !enabled || prefersReducedMotion || intensityMmHr <= 0) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to parent
    const updateSize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    updateSize();

    // Density tied to rainfall intensity (capped between 25 and 100 drops)
    const count = Math.min(Math.max(Math.round(intensityMmHr * 0.7), 25), 100);
    const drops = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 8 + Math.random() * 12,
      speed: 12 + Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.25,
    }));

    const strokeColor = isDark ? 'rgba(111, 192, 208, ' : 'rgba(58, 127, 143, ';

    let lastTime = performance.now();
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.strokeStyle = `${strokeColor}${d.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
        ctx.stroke();

        d.y += d.speed * dt * 60;
        d.x -= 2 * dt * 60;

        if (d.y > canvas.height) {
          d.y = -d.len;
          d.x = Math.random() * (canvas.width + 100);
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    window.addEventListener('resize', updateSize);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', updateSize);
    };
  }, [isPlaying, intensityMmHr, enabled, isDark]);

  if (!isPlaying || !enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      aria-hidden="true"
    />
  );
};
