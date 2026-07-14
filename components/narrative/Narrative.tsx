"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { YEAR_PROFILES } from "@/lib/constants";
import type { NarrativeYear } from "@/lib/types";
import { StationMap } from "@/components/map/StationMap";
import { SectionHeader } from "@/components/ui/Editorial";
import { CountUp } from "@/components/ui/CountUp";
import { ease } from "@/lib/easing";
import { useLang } from "@/components/i18n/LangProvider";

/**
 * Trust narrative. A single Year 0 / Year 5 switch drives three things at once:
 * the stat readouts, the narrative copy, and which nodes light up on the map
 * below. Not a static before/after image — the whole section re-composes.
 *
 * Numeric values + active-station lists come from constants; all display copy
 * (headline, body, eyebrow, stat labels/units) comes from the translations.
 */
export function Narrative() {
  const [year, setYear] = useState<NarrativeYear>(0);
  const { t } = useLang();
  const n = t.narrative;

  const profile = YEAR_PROFILES[year];
  const copy = year === 0 ? n.year0 : n.year5;
  // Merge numeric values (constants) with translated labels/units.
  const stats = profile.stats.map((s, i) => ({
    value: s.value,
    label: copy.stats[i].label,
    unit: copy.stats[i].unit,
  }));

  return (
    <section
      id="narrative"
      className="relative mx-auto max-w-shell px-6 py-28 md:px-10 md:py-36"
    >
      <SectionHeader
        index="06"
        eyebrow={n.eyebrow}
        title={
          <>
            {n.titleA}
            <span className="text-rose">{n.titleAccent}</span>
            {n.titleB}
          </>
        }
        lede={n.lede}
      />

      {/* The switch */}
      <div className="mt-12 flex flex-wrap items-center gap-4">
        <div
          role="tablist"
          aria-label={n.eyebrow}
          className="relative inline-flex rounded-full border border-hairline bg-surface p-1"
        >
          <motion.span
            aria-hidden
            className="absolute inset-y-1 rounded-full bg-rose"
            initial={false}
            animate={{ left: year === 0 ? 4 : "50%", right: year === 0 ? "50%" : 4 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
          {([0, 5] as NarrativeYear[]).map((y) => (
            <button
              key={y}
              role="tab"
              aria-selected={year === y}
              onClick={() => setYear(y)}
              className={`relative z-10 min-w-[110px] px-6 py-2.5 font-mono text-micro uppercase tracking-[0.14em] transition-colors duration-200 ${
                year === y ? "text-void" : "text-ink-mute hover:text-ink"
              }`}
            >
              {n.yearLabel} {y}
            </button>
          ))}
        </div>
        <span className="font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
          {copy.eyebrow}
        </span>
      </div>

      {/* Narrative + stats */}
      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: ease.outExpo }}
            >
              <h3 className="font-display text-title font-medium leading-tight text-ink">
                {copy.headline}
              </h3>
              <p className="mt-5 max-w-lg text-lead text-ink-dim">{copy.copy}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* stat grid — values animate on toggle */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-6">
          {stats.map((s, i) => {
            const numeric = parseFloat(s.value.replace(/,/g, ""));
            const isNum = !Number.isNaN(numeric);
            const group = s.value.includes(",");
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: ease.outExpo, delay: i * 0.06 }}
                className="border border-hairline bg-surface/40 p-6"
              >
                <div className="font-display text-title font-medium leading-none text-ink tabular">
                  {isNum ? (
                    <CountUp
                      value={numeric}
                      group={group}
                      decimals={s.value.includes(".") ? 1 : 0}
                    />
                  ) : (
                    s.value
                  )}
                </div>
                <div className="mt-2 font-mono text-micro uppercase tracking-[0.12em] text-rose">
                  {s.unit}
                </div>
                <div className="mt-1 font-mono text-micro text-ink-mute">
                  {s.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* The live map, overlay driven by the same toggle */}
      <div className="mt-16 border-t border-hairline pt-12">
        <div className="mb-8 flex items-center gap-3 font-mono text-micro uppercase tracking-[0.16em] text-ink-mute">
          <span className="text-rose">↳</span>
          {n.mapCoverage.replace("{year}", String(year))}
        </div>
        <StationMap activeIds={profile.activeStations} bare />
      </div>
    </section>
  );
}
