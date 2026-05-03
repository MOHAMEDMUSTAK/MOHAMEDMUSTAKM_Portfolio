import { useEffect, useRef, useState } from 'react';

interface SkillData {
  name: string;
  value: number;
  color?: string;
}

export default function SkillRadar({ skills }: { skills: SkillData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animProgress, setAnimProgress] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Animate progress
  useEffect(() => {
    if (!hasAnimated) return;
    const start = Date.now();
    const duration = 1500;
    const animate = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimProgress(eased);
      if (p < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [hasAnimated]);

  // Draw radar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || skills.length < 3) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxR = size * 0.38;
    const n = skills.length;
    const angleStep = (Math.PI * 2) / n;

    ctx.clearRect(0, 0, size, size);

    // Draw grid rings
    for (let ring = 1; ring <= 4; ring++) {
      const r = (maxR / 4) * ring;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,255,255,${ring === 4 ? 0.08 : 0.04})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < n; i++) {
      const angle = angleStep * i - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw data polygon
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const angle = angleStep * idx - Math.PI / 2;
      const r = (skills[idx].value / 100) * maxR * animProgress;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Gradient fill
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    gradient.addColorStop(0, 'hsla(185, 100%, 50%, 0.25)');
    gradient.addColorStop(1, 'hsla(280, 100%, 60%, 0.08)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = 'hsla(185, 100%, 50%, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw dots and labels
    for (let i = 0; i < n; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const r = (skills[i].value / 100) * maxR * animProgress;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(185, 100%, 50%)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label
      const labelR = maxR + 20;
      const lx = cx + Math.cos(angle) * labelR;
      const ly = cy + Math.sin(angle) * labelR;
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.textAlign = Math.abs(angle + Math.PI / 2) < 0.1 ? 'center' : Math.cos(angle) > 0 ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(skills[i].name, lx, ly);
    }
  }, [skills, animProgress]);

  if (skills.length < 3) return null;

  return (
    <div ref={containerRef} className="flex justify-center">
      <canvas ref={canvasRef} className="opacity-90" />
    </div>
  );
}
