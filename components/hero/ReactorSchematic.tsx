"use client";

import { forwardRef } from "react";
import { useLang } from "@/components/i18n/LangProvider";

/**
 * The signature diagram. Precise engineering linework — reactor core on the
 * left, feeding an electrolyzer stack, splitting into three offtake branches:
 * fertilizer, grid storage, vehicle fuel. Every group carries a data-part
 * attribute so GSAP can assemble it in sequence on scroll, and the same paths
 * later host pulsing data flow in the live dashboard.
 *
 * viewBox is 1000x520; parent scales it responsively.
 */
export const ReactorSchematic = forwardRef<SVGSVGElement, Record<string, never>>(
  function ReactorSchematic(_props, ref) {
    const { t } = useLang();
    const s = t.schematic;
    return (
      <svg
        ref={ref}
        viewBox="0 0 1000 520"
        fill="none"
        className="h-full w-full overflow-visible"
        aria-label="Schematic: reactor surplus feeding an electrolyzer, splitting into fertilizer, grid storage, and vehicle fuel"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF2D78" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF2D78" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF2D78" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FF2D78" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#FF2D78" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FF2D78" stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* ───────────── REACTOR (source) ───────────── */}
        <g data-part="reactor">
          <circle
            cx="130"
            cy="260"
            r="96"
            fill="url(#coreGlow)"
            data-part="reactor-glow"
          />
          {/* containment */}
          <rect
            x="60"
            y="176"
            width="140"
            height="168"
            rx="10"
            stroke="#33333B"
            strokeWidth="1.5"
          />
          {/* core ring */}
          <circle cx="130" cy="260" r="54" stroke="#FF2D78" strokeWidth="1.5" />
          <circle cx="130" cy="260" r="34" stroke="#FF2D78" strokeWidth="1" strokeOpacity="0.5" />
          {/* fuel lattice hint */}
          {Array.from({ length: 4 }).map((_, i) =>
            Array.from({ length: 4 }).map((_, j) => (
              <circle
                key={`${i}-${j}`}
                cx={112 + i * 12}
                cy={242 + j * 12}
                r="1.6"
                fill="#FF2D78"
                fillOpacity="0.6"
              />
            )),
          )}
          <text
            x="130"
            y="368"
            textAnchor="middle"
            className="fill-ink-mute font-mono"
            fontSize="11"
            letterSpacing="1.5"
          >
            {s.vverUnit}
          </text>
          <text
            x="130"
            y="160"
            textAnchor="middle"
            className="fill-ink-dim font-mono"
            fontSize="10"
            letterSpacing="1"
          >
            {s.offpeakSurplus}
          </text>
        </g>

        {/* ───────────── FEED LINE reactor → electrolyzer ───────────── */}
        <path
          data-part="feed"
          data-flow="feed"
          d="M 200 260 L 372 260"
          stroke="#33333B"
          strokeWidth="1.5"
        />
        <path
          data-flow-overlay="feed"
          d="M 200 260 L 372 260"
          stroke="url(#flowGrad)"
          strokeWidth="2"
          strokeDasharray="6 14"
          opacity="0"
        />

        {/* ───────────── ELECTROLYZER (transform) ───────────── */}
        <g data-part="electrolyzer">
          <rect
            x="372"
            y="196"
            width="128"
            height="128"
            rx="8"
            stroke="#33333B"
            strokeWidth="1.5"
            fill="#0A0A0C"
          />
          {/* stack cells */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1={392 + i * 18}
              y1="212"
              x2={392 + i * 18}
              y2="308"
              stroke="#FF2D78"
              strokeWidth="1.5"
              strokeOpacity={0.35 + i * 0.12}
            />
          ))}
          <text
            x="436"
            y="348"
            textAnchor="middle"
            className="fill-ink-mute font-mono"
            fontSize="11"
            letterSpacing="1.5"
          >
            {s.pemElectrolyzer}
          </text>
          {/* H2 / O2 split hint */}
          <text x="436" y="188" textAnchor="middle" className="fill-rose font-mono" fontSize="10">
            H₂
          </text>
        </g>

        {/* ───────────── SPLITTER NODE ───────────── */}
        <path
          data-part="trunk"
          data-flow="trunk"
          d="M 500 260 L 596 260"
          stroke="#33333B"
          strokeWidth="1.5"
        />
        <circle data-part="splitter" cx="596" cy="260" r="5" fill="#FF2D78" />

        {/* ───────────── THREE BRANCHES ───────────── */}
        {/* Branch A — Fertilizer (up) */}
        <g data-part="branch-fertilizer">
          <path
            data-flow="b1"
            d="M 596 260 C 700 260 700 130 820 130"
            stroke="#33333B"
            strokeWidth="1.5"
          />
          <path
            data-flow-overlay="b1"
            d="M 596 260 C 700 260 700 130 820 130"
            stroke="url(#flowGrad)"
            strokeWidth="2"
            strokeDasharray="6 14"
            opacity="0"
          />
          <circle cx="828" cy="130" r="6" stroke="#FF2D78" strokeWidth="1.5" />
          <text x="852" y="126" className="fill-ink font-mono" fontSize="12" letterSpacing="0.5">
            {s.fertilizer}
          </text>
          <text x="852" y="144" className="fill-ink-mute font-mono" fontSize="10">
            {s.fertilizerSub}
          </text>
        </g>

        {/* Branch B — Grid storage (mid) */}
        <g data-part="branch-grid">
          <path
            data-flow="b2"
            d="M 596 260 L 820 260"
            stroke="#33333B"
            strokeWidth="1.5"
          />
          <path
            data-flow-overlay="b2"
            d="M 596 260 L 820 260"
            stroke="url(#flowGrad)"
            strokeWidth="2"
            strokeDasharray="6 14"
            opacity="0"
          />
          <circle cx="828" cy="260" r="6" stroke="#FF2D78" strokeWidth="1.5" />
          <text x="852" y="256" className="fill-ink font-mono" fontSize="12" letterSpacing="0.5">
            {s.gridStorage}
          </text>
          <text x="852" y="274" className="fill-ink-mute font-mono" fontSize="10">
            {s.gridStorageSub}
          </text>
        </g>

        {/* Branch C — Vehicle fuel (down) */}
        <g data-part="branch-fuel">
          <path
            data-flow="b3"
            d="M 596 260 C 700 260 700 390 820 390"
            stroke="#33333B"
            strokeWidth="1.5"
          />
          <path
            data-flow-overlay="b3"
            d="M 596 260 C 700 260 700 390 820 390"
            stroke="url(#flowGrad)"
            strokeWidth="2"
            strokeDasharray="6 14"
            opacity="0"
          />
          <circle cx="828" cy="390" r="6" stroke="#FF2D78" strokeWidth="1.5" />
          <text x="852" y="386" className="fill-ink font-mono" fontSize="12" letterSpacing="0.5">
            {s.vehicleFuel}
          </text>
          <text x="852" y="404" className="fill-ink-mute font-mono" fontSize="10">
            {s.vehicleFuelSub}
          </text>
        </g>
      </svg>
    );
  },
);
