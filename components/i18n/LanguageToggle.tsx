"use client";

import { motion } from "motion/react";
import { useLang } from "@/components/i18n/LangProvider";
import { LANGS, type Lang } from "@/lib/i18n";

/**
 * Compact segmented EN/RU switch. A sliding accent pill marks the active
 * language; matches the Year 0/5 toggle's visual language for consistency.
 */
export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language / Язык"
      className="relative inline-flex rounded-full border border-hairline bg-surface p-0.5"
    >
      {/* sliding pill */}
      <motion.span
        aria-hidden
        className="absolute inset-y-0.5 rounded-full bg-rose"
        initial={false}
        animate={{
          left: lang === "en" ? 2 : "50%",
          right: lang === "en" ? "50%" : 2,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      />
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code as Lang)}
          aria-pressed={lang === l.code}
          aria-label={l.label}
          className={`relative z-10 min-w-[34px] px-2.5 py-1 font-mono text-micro uppercase tracking-[0.1em] transition-colors duration-200 ${
            lang === l.code ? "text-void" : "text-ink-mute hover:text-ink"
          }`}
        >
          {l.native}
        </button>
      ))}
    </div>
  );
}
