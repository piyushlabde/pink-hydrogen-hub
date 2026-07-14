"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Ambient background layer: a low-opacity field of paired dots (H–H molecules)
 * drifting upward like electrolysis bubbles. Deliberately non-distracting.
 * Fully paused (static, near-invisible) under prefers-reduced-motion.
 */

interface Molecule {
  x: number;
  y: number;
  vy: number;
  vx: number;
  r: number;
  bond: number; // bond length between the two H atoms
  angle: number;
  spin: number;
  alpha: number;
}

export function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let molecules: Molecule[] = [];
    let running = true;

    const ROSE = "255, 45, 120";

    function resize() {
      if (!canvas) return;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      // Density scales gently with viewport area, capped for performance.
      const count = Math.min(46, Math.round((w * h) / 32000));
      molecules = Array.from({ length: count }, () => spawn(true));
    }

    function spawn(anywhere: boolean): Molecule {
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 20,
        vy: -(0.12 + Math.random() * 0.34),
        vx: (Math.random() - 0.5) * 0.12,
        r: 1.1 + Math.random() * 1.6,
        bond: 5 + Math.random() * 5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.01,
        alpha: 0.15 + Math.random() * 0.4,
      };
    }

    function drawStatic() {
      // Reduced-motion: render a single faint static frame, no animation loop.
      ctx!.clearRect(0, 0, w, h);
      molecules.forEach((m) => paint(m, 0.5));
    }

    function paint(m: Molecule, alphaScale = 1) {
      const dx = (Math.cos(m.angle) * m.bond) / 2;
      const dy = (Math.sin(m.angle) * m.bond) / 2;
      const a = m.alpha * alphaScale;

      // bond
      ctx!.beginPath();
      ctx!.moveTo(m.x - dx, m.y - dy);
      ctx!.lineTo(m.x + dx, m.y + dy);
      ctx!.strokeStyle = `rgba(${ROSE}, ${a * 0.4})`;
      ctx!.lineWidth = 0.6;
      ctx!.stroke();

      // two atoms
      ctx!.beginPath();
      ctx!.arc(m.x - dx, m.y - dy, m.r, 0, Math.PI * 2);
      ctx!.arc(m.x + dx, m.y + dy, m.r, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(${ROSE}, ${a})`;
      ctx!.fill();
    }

    function tick() {
      if (!running) return;
      ctx!.clearRect(0, 0, w, h);
      molecules.forEach((m, i) => {
        m.y += m.vy;
        m.x += m.vx;
        m.angle += m.spin;
        // gentle horizontal sway
        m.x += Math.sin(m.y * 0.01) * 0.06;
        if (m.y < -20 || m.x < -20 || m.x > w + 20) {
          molecules[i] = spawn(false);
        }
        paint(m);
      });
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      drawStatic();
    } else {
      // Pause when tab hidden — saves cycles, respects the "ambient" brief.
      const onVis = () => {
        running = !document.hidden;
        if (running) {
          raf = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(raf);
        }
      };
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVis);
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full opacity-60"
    />
  );
}
