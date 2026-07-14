"use client";

import { motion } from "motion/react";
import { useTelemetry } from "@/hooks/useTelemetry";
import { CountUp } from "@/components/ui/CountUp";
import { Gauge } from "./Gauge";
import { FlowDiagram } from "./FlowDiagram";
import { TimeSeries } from "./TimeSeries";
import { SectionHeader } from "@/components/ui/Editorial";
import { ease } from "@/lib/easing";
import { useLang } from "@/components/i18n/LangProvider";

/** A framed panel with a hairline border and mono label. */
function Panel({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: ease.outExpo }}
      className={`relative border border-hairline bg-surface/40 p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-micro uppercase tracking-[0.16em] text-ink-mute">
          {label}
        </span>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose animate-pulse-node" />
      </div>
      {children}
    </motion.div>
  );
}

export function Dashboard() {
  const frame = useTelemetry();
  const { t } = useLang();
  const d = t.dashboard;

  return (
    <section
      id="dashboard"
      className="relative mx-auto max-w-shell px-6 py-28 md:px-10 md:py-36"
    >
      <SectionHeader
        index="02"
        eyebrow={d.eyebrow}
        title={
          <>
            {d.titleA}
            <span className="text-rose">{d.titleAccent}</span>
            {d.titleB}
          </>
        }
        lede={d.lede}
      />

      {/* Live status ribbon */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: ease.outExpo, delay: 0.1 }}
        className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 border-y border-hairline py-4 font-mono text-micro uppercase tracking-[0.14em] text-ink-mute"
      >
        <span className="flex items-center gap-2 text-signal">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
          {d.feedLive}
        </span>
        <span>{d.gateway}</span>
        <span>
          {d.draw}&nbsp;
          <span className="text-rose">
            <CountUp value={frame?.electrolysisMw ?? 0} decimals={1} suffix=" MW" />
          </span>
        </span>
        <span className="ml-auto hidden md:inline">{d.refresh}</span>
      </motion.div>

      {/* F-PATTERN GRID */}
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* PRIMARY KPI */}
        <Panel label={d.primaryLabel} className="lg:col-span-5 lg:row-span-1">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-medium leading-none text-ink tabular">
                <CountUp value={frame?.conversionRate ?? 0} decimals={1} suffix="%" />
              </div>
              <p className="mt-3 max-w-xs text-body text-ink-dim">{d.primaryDesc}</p>
            </div>
            <div className="mt-6 flex items-center gap-6 border-t border-hairline pt-4">
              <div>
                <div className="font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
                  {d.outputRate}
                </div>
                <div className="mt-1 font-mono text-lead text-rose tabular">
                  <CountUp value={frame?.h2RateKgH ?? 0} decimals={0} suffix=" kg/h" />
                </div>
              </div>
              <div className="h-10 w-px bg-hairline" />
              <div>
                <div className="font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
                  {d.sinceMidnight}
                </div>
                <div className="mt-1 font-mono text-lead text-ink tabular">
                  <CountUp value={(frame?.h2RateKgH ?? 0) * 6.4} decimals={0} group suffix=" kg" />
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* SECONDARY KPIs */}
        <Panel label={d.gridLoad} className="lg:col-span-4">
          <Gauge value={frame?.gridLoadPct ?? 0} label={d.gridLoadUnit} />
          <p className="mt-4 text-body text-ink-dim">{d.gridLoadDesc}</p>
        </Panel>

        <Panel label={d.storageTank} className="lg:col-span-3">
          <Gauge value={frame?.storagePct ?? 0} label={d.bufferFill} />
        </Panel>

        {/* FLOW DIAGRAM */}
        <Panel label={d.flowLive} className="lg:col-span-7 lg:row-span-2">
          <div className="h-[280px] md:h-[340px]">
            <FlowDiagram frame={frame} />
          </div>
        </Panel>

        {/* RADIATION */}
        <Panel label={d.boundaryDose} className="lg:col-span-5">
          <div className="flex items-end justify-between">
            <div className="font-display text-[clamp(2.5rem,4vw,3.25rem)] font-medium leading-none text-ink tabular">
              <CountUp value={frame?.radiationUSvH ?? 0} decimals={3} suffix=" µSv/h" />
            </div>
            <span className="mb-1 font-mono text-micro uppercase tracking-[0.14em] text-signal">
              {d.nominal}
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
            <div
              className="h-full rounded-full bg-signal"
              style={{
                width: `${Math.min(100, ((frame?.radiationUSvH ?? 0.1) / 0.3) * 100)}%`,
                transition: "width 900ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>
          <p className="mt-3 font-mono text-micro text-ink-mute">{d.doseNote}</p>
        </Panel>

        {/* TIME-SERIES */}
        <Panel label={d.historical} className="lg:col-span-5">
          <div className="h-[220px]">
            <TimeSeries frame={frame} />
          </div>
        </Panel>
      </div>
    </section>
  );
}
