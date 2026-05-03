import { useEffect, useRef } from 'react';

export default function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const trail = useRef<{ x: number; y: number; alpha: number }[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      trail.current.push({ x: e.clientX, y: e.clientY, alpha: 1 });
      if (trail.current.length > 20) trail.current.shift();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      for (let i = 0; i < trail.current.length; i++) {
        const point = trail.current[i];
        point.alpha -= 0.04;
        if (point.alpha <= 0) continue;

        const size = 3 + (i / trail.current.length) * 4;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(185, 100%, 50%, ${point.alpha * 0.15})`;
        ctx.fill();
      }

      // Clean dead points
      trail.current = trail.current.filter(p => p.alpha > 0);

      // Soft glow at cursor
      const grd = ctx.createRadialGradient(
        mouse.current.x, mouse.current.y, 0,
        mouse.current.x, mouse.current.y, 60
      );
      grd.addColorStop(0, 'hsla(185, 100%, 50%, 0.06)');
      grd.addColorStop(1, 'hsla(185, 100%, 50%, 0)');
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 60, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ opacity: 0.8 }}
    />
  );
}
