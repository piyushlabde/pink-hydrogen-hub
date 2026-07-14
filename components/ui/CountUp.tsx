"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ease } from "@/lib/easing";

interface CountUpProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  /** thousands separator */
  group?: boolean;
  prefix?: string;
  suffix?: string;
}

function format(n: number, decimals: number, group: boolean) {
  const fixed = n.toFixed(decimals);
  if (!group) return fixed;
  const [int, frac] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${grouped}.${frac}` : grouped;
}

/**
 * Smoothly animates from the previous value to the next using Motion's
 * animate(). No instant snapping — every value change eases with a
 * deliberate curve. Respects reduced-motion by writing the value directly.
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 0.9,
  className,
  group = false,
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduced) {
      node.textContent = `${prefix}${format(value, decimals, group)}${suffix}`;
      prev.current = value;
      return;
    }

    const from = prev.current;
    const controls = animate(from, value, {
      duration,
      ease: ease.outQuint,
      onUpdate: (latest: number) => {
        node.textContent = `${prefix}${format(latest, decimals, group)}${suffix}`;
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, decimals, duration, group, prefix, suffix, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(value, decimals, group)}
      {suffix}
    </span>
  );
}
