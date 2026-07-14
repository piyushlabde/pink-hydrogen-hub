"use client";

import { motion } from "motion/react";
import { SOURCES } from "@/lib/constants";
import { ease } from "@/lib/easing";
import { useLang } from "@/components/i18n/LangProvider";

export function Footer() {
  const { t } = useLang();
  const f = t.footer;

  // Merge translated label/note with the href (kept in constants).
  const sources = f.sourceList.map((s, i) => ({
    ...s,
    href: SOURCES[i]?.href ?? "#",
  }));

  return (
    <footer className="relative border-t border-hairline">
      <div className="mx-auto max-w-shell px-6 py-20 md:px-10 md:py-28">
        {/* Big closing mark */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.outExpo }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 font-mono text-micro uppercase tracking-[0.18em] text-ink-mute">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose" />
            {f.brand}
          </div>
          <p className="mt-6 max-w-2xl font-display text-title font-medium leading-tight text-ink">
            {f.closing}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 border-t border-hairline pt-12 md:grid-cols-3">
          {/* Sources */}
          <div>
            <h3 className="font-mono text-micro uppercase tracking-[0.16em] text-ink-mute">
              {f.sources}
            </h3>
            <ul className="mt-6 space-y-5">
              {sources.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <span className="text-body text-ink transition-colors duration-200 ease-out-quint group-hover:text-rose">
                      {s.label}
                      <span className="ml-1 inline-block transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </span>
                    <span className="mt-1 block font-mono text-micro text-ink-mute">
                      {s.note}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Methodology */}
          <div>
            <h3 className="font-mono text-micro uppercase tracking-[0.16em] text-ink-mute">
              {f.methodology}
            </h3>
            <p className="mt-6 text-body text-ink-dim">{f.methodologyBody}</p>
          </div>

          {/* Credits */}
          <div>
            <h3 className="font-mono text-micro uppercase tracking-[0.16em] text-ink-mute">
              {f.credits}
            </h3>
            <div className="mt-6 space-y-4 font-mono text-body text-ink-dim">
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <span className="text-ink">{f.submission}</span>
                <span className="text-micro uppercase tracking-[0.12em] text-ink-mute">
                  {f.submissionVal}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <span className="text-ink">{f.theme}</span>
                <span className="text-micro uppercase tracking-[0.12em] text-ink-mute">
                  {f.themeVal}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <span className="text-ink">{f.basis}</span>
                <span className="text-micro uppercase tracking-[0.12em] text-ink-mute">
                  {f.basisVal}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-ink">{f.reactor}</span>
                <span className="text-micro uppercase tracking-[0.12em] text-ink-mute">
                  {f.reactorVal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-8 font-mono text-micro uppercase tracking-[0.14em] text-ink-mute md:flex-row md:items-center">
          <span>{f.copyright}</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal animate-pulse-node" />
            {f.builtFor}
          </span>
        </div>
      </div>
    </footer>
  );
}
