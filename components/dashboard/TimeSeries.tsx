"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TelemetryFeed } from "@/lib/telemetry";
import type { HistoryPoint, LiveTelemetry } from "@/lib/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLang } from "@/components/i18n/LangProvider";

/**
 * Historical time-series: H2 production rate over the last window. Seeds a
 * plausible history, then appends each live frame — the trailing edge advances
 * smoothly. Rendered as layered area + line in the accent.
 */
export function TimeSeries({ frame }: { frame: LiveTelemetry | null }) {
  const reduced = useReducedMotion();
  const { t } = useLang();
  const ts = t.timeseries;
  // Start empty so server and first client render match; seed on mount (client).
  const [points, setPoints] = useState<HistoryPoint[]>([]);
  const lastT = useRef(0);
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    setPoints(TelemetryFeed.seedHistory(48));
  }, []);

  useEffect(() => {
    if (!frame) return;
    if (frame.t === lastT.current) return;
    lastT.current = frame.t;
    setPoints((prev) => {
      if (prev.length === 0) return prev; // wait for seed
      const next = [
        ...prev.slice(1),
        { t: frame.t, h2RateKgH: frame.h2RateKgH, gridLoadPct: frame.gridLoadPct },
      ];
      return next;
    });
  }, [frame]);

  const W = 640;
  const H = 220;
  const pad = { t: 16, r: 8, b: 24, l: 8 };

  const { linePath, areaPath, gridLine } = useMemo(() => {
    if (points.length === 0) {
      return { linePath: "", areaPath: "", gridLine: "" };
    }
    const xs = points.map((_, i) => i);
    const maxX = Math.max(1, xs.length - 1);
    const values = points.map((p) => p.h2RateKgH);
    const min = 0;
    const max = Math.max(220, ...values) * 1.05;

    const px = (i: number) =>
      pad.l + (i / maxX) * (W - pad.l - pad.r);
    const py = (v: number) =>
      pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);

    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(p.h2RateKgH).toFixed(1)}`)
      .join(" ");
    const area = `${line} L ${px(maxX).toFixed(1)} ${H - pad.b} L ${px(0).toFixed(1)} ${H - pad.b} Z`;

    // grid load reference line (secondary series, faint)
    const grid = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py((p.gridLoadPct / 100) * max).toFixed(1)}`)
      .join(" ");

    return { linePath: line, areaPath: area, gridLine: grid };
  }, [points]);

  const latest = points[points.length - 1];

  return (
    <div className="relative h-full w-full">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-mono text-micro uppercase tracking-[0.16em] text-ink-mute">
          {ts.title}
        </span>
        <span className="font-mono text-micro text-ink-mute">
          <span className="text-rose">━</span> {ts.legendRate}&nbsp;&nbsp;
          <span className="text-ink-dim">┈</span> {ts.legendGrid}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[calc(100%-2rem)] w-full" fill="none">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF2D78" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FF2D78" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* baseline grid */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={pad.l}
            x2={W - pad.r}
            y1={pad.t + f * (H - pad.t - pad.b)}
            y2={pad.t + f * (H - pad.t - pad.b)}
            stroke="#26262C"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        ))}

        <path d={areaPath} fill="url(#areaFill)" />
        <path
          d={gridLine}
          stroke="#6B6B76"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.6"
        />
        <path
          d={linePath}
          stroke="#FF2D78"
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            transition: reduced ? undefined : "d 400ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        {/* leading dot */}
        {latest && (
          <circle
            cx={W - pad.r}
            cy={
              pad.t +
              (1 - latest.h2RateKgH / (Math.max(220, latest.h2RateKgH) * 1.05)) *
                (H - pad.t - pad.b)
            }
            r="3"
            fill="#FF2D78"
          />
        )}
      </svg>
    </div>
  );
}
