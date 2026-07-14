"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { simulate } from "@/lib/constants";
import { CountUp } from "@/components/ui/CountUp";
import { SectionHeader } from "@/components/ui/Editorial";
import { ease } from "@/lib/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLang } from "@/components/i18n/LangProvider";

const MIN = 1;
const MAX = 10;

/**
 * What-if simulator. Drag the capacity slider from 1 MW (pilot) to 10 MW
 * (build-out); connected stat cards recompute live. The track fills in the
 * accent, the handle offers spring feedback on drag, and every figure counts
 * up rather than snapping. Keyboard operable via the underlying range input.
 */
export function Simulator() {
  const [mw, setMw] = useState(1);
  const reduced = useReducedMotion();
  const { t } = useLang();
  const sim = t.simulator;
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const out = useMemo(() => simulate(mw), [mw]);
  const pct = (mw - MIN) / (MAX - MIN);

  // Pointer-drag on the custom track for a tactile feel.
  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const val = MIN + ratio * (MAX - MIN);
    setMw(Math.round(val * 2) / 2); // 0.5 MW steps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => setDragging(false);

  const cards = [
    { label: sim.farmsFed, value: out.farmsFed, unit: sim.farmsUnit, hint: sim.farmsHint },
    { label: sim.busesFueled, value: out.busesFueled, unit: sim.busesUnit, hint: sim.busesHint },
    { label: sim.mwhReturned, value: out.mwhReturned, unit: sim.mwhUnit, hint: sim.mwhHint, group: true },
  ];

  return (
    <section
      id="simulator"
      className="relative mx-auto max-w-shell px-6 py-28 md:px-10 md:py-36"
    >
      <SectionHeader
        index="04"
        eyebrow={sim.eyebrow}
        title={
          <>
            {sim.titleA}
            <span className="text-rose">{sim.titleAccent}</span>
          </>
        }
        lede={sim.lede}
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Slider column */}
        <div className="lg:col-span-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
                {sim.installed}
              </div>
              <div className="mt-2 font-display text-display font-medium leading-none text-ink tabular">
                <CountUp value={mw} decimals={mw % 1 === 0 ? 0 : 1} />
                <span className="ml-2 text-title text-rose">MW</span>
              </div>
            </div>
          </div>

          {/* Custom track */}
          <div
            className="relative mt-10 select-none py-4"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              ref={trackRef}
              className="relative h-1 w-full rounded-full bg-hairline"
            >
              {/* fill */}
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-rose"
                style={{
                  width: `${pct * 100}%`,
                  transition: dragging || reduced ? "none" : "width 300ms cubic-bezier(0.22,1,0.36,1)",
                }}
              />
              {/* tick marks at integer MW */}
              {Array.from({ length: MAX - MIN + 1 }).map((_, i) => {
                const p = i / (MAX - MIN);
                return (
                  <span
                    key={i}
                    className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-hairline-bright"
                    style={{ left: `${p * 100}%` }}
                  />
                );
              })}
              {/* handle */}
              <motion.div
                className="absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-rose bg-void"
                style={{ left: `${pct * 100}%` }}
                animate={{ scale: dragging ? 1.25 : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              >
                <span className="h-2 w-2 rounded-full bg-rose" />
              </motion.div>
            </div>

            {/* endpoints */}
            <div className="mt-4 flex justify-between font-mono text-micro uppercase tracking-[0.12em] text-ink-mute">
              <span>{sim.pilotEnd}</span>
              <span>{sim.buildoutEnd}</span>
            </div>

            {/* accessible native input, visually collapsed but operable */}
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={0.5}
              value={mw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMw(parseFloat(e.target.value))
              }
              aria-label="Electrolysis capacity in megawatts"
              className="absolute inset-x-0 top-4 h-8 w-full cursor-grab opacity-0"
            />
          </div>

          <p className="mt-8 max-w-sm text-body text-ink-dim">
            {sim.summaryA}{" "}
            <span className="font-mono text-rose tabular">
              <CountUp value={out.h2TonnesYr} group /> t
            </span>{" "}
            {sim.summaryB}{" "}
            <span className="font-mono text-ink tabular">
              <CountUp value={out.co2AvoidedTyr} group /> t
            </span>{" "}
            {sim.summaryC}
          </p>
        </div>

        {/* Connected stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: ease.outExpo, delay: i * 0.08 }}
              className="flex flex-col justify-between border border-hairline bg-surface/40 p-6"
            >
              <div className="font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
                {c.label}
              </div>
              <div className="mt-8">
                <div className="font-display text-title font-medium leading-none text-ink tabular">
                  <CountUp value={c.value} group={c.group} duration={0.7} />
                </div>
                <div className="mt-2 font-mono text-micro uppercase tracking-[0.12em] text-rose">
                  {c.unit}
                </div>
                <div className="mt-1 font-mono text-micro text-ink-mute">
                  {c.hint}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
