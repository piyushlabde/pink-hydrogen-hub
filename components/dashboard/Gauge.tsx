"use client";

import { CountUp } from "@/components/ui/CountUp";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Compact radial gauge for a percentage KPI. The arc sweeps to the value with
 * a custom-eased stroke transition; the number counts up rather than snapping.
 */
export function Gauge({
  value,
  label,
  unit = "%",
  decimals = 0,
  max = 100,
}: {
  value: number;
  label: string;
  unit?: string;
  decimals?: number;
  max?: number;
}) {
  const reduced = useReducedMotion();
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const offset = c * (1 - pct);

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[84px] w-[84px] shrink-0">
        <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
          <circle cx="42" cy="42" r={r} stroke="#26262C" strokeWidth="3" fill="none" />
          <circle
            cx="42"
            cy="42"
            r={r}
            stroke="#FF2D78"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{
              transition: reduced
                ? undefined
                : "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-body font-medium text-ink tabular">
            <CountUp value={value} decimals={decimals} suffix={unit} />
          </span>
        </div>
      </div>
      <div>
        <div className="font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
          {label}
        </div>
      </div>
    </div>
  );
}
