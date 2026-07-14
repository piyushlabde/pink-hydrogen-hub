"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { STATIONS, STATUS_META } from "@/lib/constants";
import type { Station } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Editorial";
import { ease } from "@/lib/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLang } from "@/components/i18n/LangProvider";

/**
 * Interactive corridor map. Pins mark refueling / distribution nodes across the
 * Kola Peninsula, from the plant toward Murmansk port. Click a pin for its
 * live-style availability and queue. A drawn coastline + route lines stand in
 * for a tile map — intentional, on-brand, and fully offline.
 *
 * `activeIds` lets the narrative toggle light up the Year-0 vs Year-5 network.
 */
export function StationMap({
  activeIds,
  bare = false,
}: {
  activeIds?: string[];
  /** when true, render just the map grid (no section wrapper/header) */
  bare?: boolean;
}) {
  const [selected, setSelected] = useState<Station | null>(null);
  const reduced = useReducedMotion();
  const { t } = useLang();
  const m = t.map;
  const statusLabel = (st: Station["status"]) => m.status[st];
  const active = activeIds ?? STATIONS.map((s) => s.id);

  const grid = (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Map viewport */}
        <div className="relative overflow-hidden border border-hairline bg-surface/40 lg:col-span-8">
          <svg viewBox="0 0 800 480" className="h-full w-full">
            {/* subtle graticule */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={(i / 8) * 800}
                y1="0"
                x2={(i / 8) * 800}
                y2="480"
                stroke="#1A1A1F"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={(i / 5) * 480}
                x2="800"
                y2={(i / 5) * 480}
                stroke="#1A1A1F"
                strokeWidth="1"
              />
            ))}

            {/* stylized coastline / landmass */}
            <path
              d="M 40 380 C 140 340 180 300 260 320 C 340 340 380 260 470 250 C 560 240 620 200 720 170 L 760 150 L 760 40 L 40 40 Z"
              fill="#0E0E12"
              stroke="#26262C"
              strokeWidth="1"
            />
            <path
              d="M 40 380 C 140 340 180 300 260 320 C 340 340 380 260 470 250 C 560 240 620 200 720 170 L 760 150"
              fill="none"
              stroke="#33333B"
              strokeWidth="1.25"
            />

            {/* plant source marker */}
            <g>
              <circle cx="90" cy="300" r="18" fill="url(#plantGlow)" />
              <rect x="80" y="290" width="20" height="20" rx="3" stroke="#FF2D78" strokeWidth="1.5" fill="#0A0A0C" />
              <text x="90" y="336" textAnchor="middle" className="fill-ink-dim font-mono" fontSize="9" letterSpacing="0.5">
                {m.kolaNpp}
              </text>
            </g>
            <defs>
              <radialGradient id="plantGlow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#FF2D78" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FF2D78" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* route lines from plant to each active station */}
            {STATIONS.filter((s) => active.includes(s.id)).map((s) => {
              const sx = s.x * 720 + 40;
              const sy = s.y * 400 + 40;
              return (
                <path
                  key={`route-${s.id}`}
                  d={`M 90 300 C ${(90 + sx) / 2} 300, ${(90 + sx) / 2} ${sy}, ${sx} ${sy}`}
                  fill="none"
                  stroke="#FF2D78"
                  strokeWidth="1"
                  strokeOpacity="0.25"
                  strokeDasharray="3 6"
                  className={reduced ? "" : "animate-dash-flow"}
                />
              );
            })}

            {/* station pins */}
            {STATIONS.map((s) => {
              const sx = s.x * 720 + 40;
              const sy = s.y * 400 + 40;
              const isActive = active.includes(s.id);
              const isSel = selected?.id === s.id;
              const tone = STATUS_META[s.status].tone;
              return (
                <g
                  key={s.id}
                  transform={`translate(${sx} ${sy})`}
                  className="cursor-pointer"
                  onClick={() => isActive && setSelected(isSel ? null : s)}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`${s.name}, ${statusLabel(s.status)}`}
                  onKeyDown={(e: React.KeyboardEvent<SVGGElement>) => {
                    if (isActive && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setSelected(isSel ? null : s);
                    }
                  }}
                  opacity={isActive ? 1 : 0.28}
                  style={{ transition: "opacity 600ms cubic-bezier(0.22,1,0.36,1)" }}
                >
                  {/* pulsing halo for active */}
                  {isActive && !reduced && s.status !== "maintenance" && (
                    <circle r="14" fill={tone} fillOpacity="0.12">
                      <animate
                        attributeName="r"
                        values="8;18;8"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="fill-opacity"
                        values="0.18;0;0.18"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  {isSel && (
                    <circle r="16" fill="none" stroke="#FF2D78" strokeWidth="1.5" />
                  )}
                  <circle r="5.5" fill="#0A0A0C" stroke={tone} strokeWidth="2" />
                  <circle r="2" fill={tone} />
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-micro uppercase tracking-[0.12em] text-ink-mute">
            {Object.entries(STATUS_META).map(([k, v]) => (
              <span key={k} className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: v.tone }}
                />
                {statusLabel(k as Station["status"])}
              </span>
            ))}
          </div>
        </div>

        {/* Detail rail */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 border border-hairline bg-surface/40 p-6">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: ease.outExpo }}
                >
                  <div className="flex items-center gap-2 font-mono text-micro uppercase tracking-[0.14em]">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: STATUS_META[selected.status].tone }}
                    />
                    <span style={{ color: STATUS_META[selected.status].tone }}>
                      {statusLabel(selected.status)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lead font-medium text-ink">
                    {selected.name}
                  </h3>

                  <dl className="mt-6 space-y-4">
                    <Row label={m.vehiclesInQueue}>
                      <span className="text-rose">{selected.queue}</span>
                      {selected.queue === 0 ? m.noneWaiting : selected.queue === 1 ? m.vehicleOne : m.vehicleMany}
                    </Row>
                    <Row label={m.dispenserPressure}>
                      {selected.pressureBar > 0 ? `${selected.pressureBar} bar` : m.offline}
                    </Row>
                    <Row label={m.localBuffer}>
                      {selected.bufferKg} kg
                    </Row>
                  </dl>

                  {/* queue visual */}
                  <div className="mt-6">
                    <div className="mb-2 font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
                      {m.queueCapacity}
                    </div>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-8 flex-1 border border-hairline"
                          style={{
                            background: i < selected.queue ? "#FF2D78" : "transparent",
                            opacity: i < selected.queue ? 0.8 : 1,
                            transition: `background 300ms ${i * 40}ms cubic-bezier(0.22,1,0.36,1)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    className="mt-6 font-mono text-micro uppercase tracking-[0.14em] text-ink-mute transition-colors duration-200 ease-out-quint hover:text-rose"
                  >
                    {m.clearSelection}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
                    {m.noSelection}
                  </div>
                  <p className="mt-3 text-body text-ink-dim">{m.selectPrompt}</p>
                  <div className="mt-6 space-y-2 font-mono text-micro text-ink-mute">
                    <div className="flex justify-between border-b border-hairline pb-2">
                      <span>{m.activeNodes}</span>
                      <span className="text-ink tabular">
                        {STATIONS.filter((s) => active.includes(s.id)).length}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-hairline pb-2">
                      <span>{m.totalQueue}</span>
                      <span className="text-rose tabular">
                        {STATIONS.filter((s) => active.includes(s.id)).reduce(
                          (a, s) => a + s.queue,
                          0,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{m.corridorBuffer}</span>
                      <span className="text-ink tabular">
                        {STATIONS.filter((s) => active.includes(s.id)).reduce(
                          (a, s) => a + s.bufferKg,
                          0,
                        )}{" "}
                        kg
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  );

  if (bare) return grid;

  return (
    <section
      id="map"
      className="relative mx-auto max-w-shell px-6 py-28 md:px-10 md:py-36"
    >
      <SectionHeader
        index="03"
        eyebrow={m.eyebrow}
        title={
          <>
            {m.titleA}
            <span className="text-rose">{m.titleAccent}</span>
            {m.titleB}
          </>
        }
        lede={m.lede}
        align="left"
      />
      <div className="mt-12">{grid}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-hairline pb-3">
      <dt className="font-mono text-micro uppercase tracking-[0.12em] text-ink-mute">
        {label}
      </dt>
      <dd className="font-mono text-body text-ink tabular">{children}</dd>
    </div>
  );
}
