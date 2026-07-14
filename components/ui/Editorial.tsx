"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/easing";
import type { ReactNode } from "react";

/** Monospace index + label eyebrow. The index encodes true sequence position. */
export function Eyebrow({
  index,
  children,
  className = "",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-micro uppercase text-ink-mute ${className}`}
    >
      {index && (
        <>
          <span className="text-rose">{index}</span>
          <span className="h-px w-6 bg-hairline-bright" aria-hidden />
        </>
      )}
      <span className="tracking-[0.18em]">{children}</span>
    </div>
  );
}

/** Reveal-on-scroll section title block, editorial and asymmetric. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: ease.outExpo }}
      className={`max-w-2xl ${align === "right" ? "ml-auto text-right" : ""}`}
    >
      <Eyebrow
        index={index}
        className={align === "right" ? "justify-end" : ""}
      >
        {eyebrow}
      </Eyebrow>
      <h2 className="mt-5 font-display text-title font-medium text-ink">
        {title}
      </h2>
      {lede && (
        <p className="mt-5 max-w-xl text-lead text-ink-dim">{lede}</p>
      )}
    </motion.header>
  );
}

export function Hairline({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-hairline ${className}`} aria-hidden />;
}
