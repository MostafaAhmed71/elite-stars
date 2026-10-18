'use client';

import React, { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    interface Star {
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      twinkleSpeed: number;
      color: string;
      isGolden: boolean;
    }

    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 3200);
      for (let i = 0; i < count; i++) {
        const isGolden = Math.random() > 0.82;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.6,
          baseAlpha: Math.random() * 0.7 + 0.3,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.006,
          color: isGolden ? '#FFD884' : '#E8F4FF',
          isGolden,
        });
      }
    };

    initStars();

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Render Stars with soft glow
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha =
          star.baseAlpha + Math.sin(frame * star.twinkleSpeed + i) * 0.25;
        const currentAlpha = Math.max(0.1, Math.min(1, star.alpha));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra twinkle aura for golden stars
        if (star.isGolden && currentAlpha > 0.65) {
          ctx.strokeStyle = '#FFD884';
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = currentAlpha * 0.4;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 2.5, star.y);
          ctx.lineTo(star.x + star.size * 2.5, star.y);
          ctx.moveTo(star.x, star.y - star.size * 2.5);
          ctx.lineTo(star.x, star.y + star.size * 2.5);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
