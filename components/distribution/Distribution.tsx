"use client";

import { motion } from "motion/react";
import { FertilizerIcon, GridStorageIcon, VehicleFuelIcon } from "./icons";
import { SectionHeader } from "@/components/ui/Editorial";
import { ease } from "@/lib/easing";
import { useLang } from "@/components/i18n/LangProvider";

export function Distribution() {
  const { t } = useLang();
  const dist = t.distribution;

  const branches = [
    {
      id: "fertilizer",
      index: "A",
      Icon: FertilizerIcon,
      title: dist.fertilizerTitle,
      share: "42%",
      body: dist.fertilizerBody,
      metric: dist.fertilizerMetric,
    },
    {
      id: "grid",
      index: "B",
      Icon: GridStorageIcon,
      title: dist.gridTitle,
      share: "33%",
      body: dist.gridBody,
      metric: dist.gridMetric,
    },
    {
      id: "fuel",
      index: "C",
      Icon: VehicleFuelIcon,
      title: dist.fuelTitle,
      share: "25%",
      body: dist.fuelBody,
      metric: dist.fuelMetric,
    },
  ];

  return (
    <section
      id="distribution"
      className="relative mx-auto max-w-shell px-6 py-28 md:px-10 md:py-36"
    >
      <SectionHeader
        index="05"
        eyebrow={dist.eyebrow}
        title={
          <>
            {dist.titleA}
            <span className="text-rose">{dist.titleAccent}</span>
            {dist.titleB}
          </>
        }
        lede={dist.lede}
        align="right"
      />

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {branches.map((b, i) => (
          <motion.article
            key={b.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: ease.outExpo, delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col border border-hairline bg-surface/40 p-8 transition-[border-color,box-shadow] duration-200 ease-lift hover:border-hairline-bright"
            style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-micro uppercase tracking-[0.18em] text-ink-mute">
                {dist.branch} <span className="text-rose">{b.index}</span>
              </span>
              <span className="font-mono text-lead text-ink tabular">{b.share}</span>
            </div>

            <div className="mt-8 transition-transform duration-300 ease-out-expo group-hover:scale-105">
              <b.Icon />
            </div>

            <h3 className="mt-8 font-display text-lead font-medium text-ink">
              {b.title}
            </h3>
            <p className="mt-3 flex-1 text-body text-ink-dim">{b.body}</p>

            <div className="mt-8 flex items-center gap-2 border-t border-hairline pt-4 font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose" />
              {b.metric}
            </div>

            <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-rose transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
          </motion.article>
        ))}
      </div>
    </section>
  );
}
