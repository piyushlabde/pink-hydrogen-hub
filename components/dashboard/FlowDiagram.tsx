"use client";

import { motion } from "motion/react";
import type { LiveTelemetry } from "@/lib/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLang } from "@/components/i18n/LangProvider";

/**
 * A live sankey-style flow: surplus power → electrolyzer → three offtakes.
 * Stream widths respond to telemetry; nodes pulse. This reuses the visual
 * language of the hero schematic so the diagram reads as one continuous system.
 */
export function FlowDiagram({ frame }: { frame: LiveTelemetry | null }) {
  const reduced = useReducedMotion();
  const { t } = useLang();
  const fl = t.flow;
  const mw = frame?.electrolysisMw ?? 3.2;
  const h2 = frame?.h2RateKgH ?? 42;

  // Map power to trunk width (2–14px). Split by fixed distribution shares.
  const trunkW = 2 + (mw / 10) * 12;
  const shares = { fertilizer: 0.42, grid: 0.33, fuel: 0.25 };

  const branch = (share: number) => Math.max(1.5, trunkW * share);

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 640 360" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B01050" />
            <stop offset="100%" stopColor="#FF2D78" />
          </linearGradient>
        </defs>

        {/* Source node */}
        <g>
          <rect x="24" y="150" width="14" height="60" rx="3" fill="#33333B" />
          <text x="31" y="230" textAnchor="middle" className="fill-ink-mute font-mono" fontSize="9">
            {fl.surplus}
          </text>
        </g>

        {/* Trunk: source → electrolyzer */}
        <path
          d="M 38 180 L 168 180"
          stroke="url(#streamGrad)"
          strokeWidth={trunkW}
          strokeLinecap="round"
          opacity="0.85"
          style={{ transition: "stroke-width 800ms cubic-bezier(0.22,1,0.36,1)" }}
        />
        {/* animated flow dashes */}
        {!reduced && (
          <path
            d="M 38 180 L 168 180"
            stroke="#FFFFFF"
            strokeWidth={Math.max(1, trunkW * 0.3)}
            strokeDasharray="2 22"
            strokeLinecap="round"
            opacity="0.5"
            className="animate-dash-flow"
          />
        )}

        {/* Electrolyzer node */}
        <g>
          <rect x="168" y="150" width="16" height="60" rx="3" fill="#FF2D78" />
          <motion.circle
            cx="176"
            cy="180"
            r="4"
            fill="#FF2D78"
            animate={reduced ? {} : { opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
          />
          <text x="176" y="230" textAnchor="middle" className="fill-ink-dim font-mono" fontSize="9">
            {fl.electrolyzer}
          </text>
        </g>

        {/* Three branches with responsive widths */}
        {[
          { d: "M 184 180 C 320 180 340 70 470 70", w: branch(shares.fertilizer), y: 70, label: fl.fertilizer, val: (h2 * shares.fertilizer).toFixed(0) },
          { d: "M 184 180 L 470 180", w: branch(shares.grid), y: 180, label: fl.gridStorage, val: (h2 * shares.grid).toFixed(0) },
          { d: "M 184 180 C 320 180 340 290 470 290", w: branch(shares.fuel), y: 290, label: fl.vehicleFuel, val: (h2 * shares.fuel).toFixed(0) },
        ].map((b, i) => (
          <g key={i}>
            <path
              d={b.d}
              stroke="url(#streamGrad)"
              strokeWidth={b.w}
              strokeLinecap="round"
              opacity="0.7"
              style={{ transition: "stroke-width 800ms cubic-bezier(0.22,1,0.36,1)" }}
            />
            {!reduced && (
              <path
                d={b.d}
                stroke="#FFFFFF"
                strokeWidth={Math.max(0.8, b.w * 0.28)}
                strokeDasharray="2 20"
                strokeLinecap="round"
                opacity="0.45"
                className="animate-dash-flow"
              />
            )}
            {/* terminal pulsing node */}
            <motion.circle
              cx="470"
              cy={b.y}
              r="5"
              fill="#0A0A0C"
              stroke="#FF2D78"
              strokeWidth="1.5"
              animate={reduced ? {} : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
            />
            <text x="486" y={b.y - 4} className="fill-ink font-mono" fontSize="10" letterSpacing="0.5">
              {b.label}
            </text>
            <text x="486" y={b.y + 10} className="fill-rose font-mono tabular" fontSize="9">
              {b.val} kg/h
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
