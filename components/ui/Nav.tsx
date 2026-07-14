"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/easing";
import { useLang } from "@/components/i18n/LangProvider";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLang();

  const links = [
    { id: "dashboard", label: t.nav.live },
    { id: "map", label: t.nav.network },
    { id: "simulator", label: t.nav.simulate },
    { id: "distribution", label: t.nav.offtakes },
    { id: "narrative", label: t.nav.horizon },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: ease.outExpo, delay: 0.3 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex max-w-shell items-center justify-between px-6 py-4 transition-all duration-300 ease-out-quint md:px-10 ${
          scrolled ? "border-b border-hairline bg-void/80 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <a
          href="#top"
          className="flex items-center gap-2.5 font-mono text-micro uppercase tracking-[0.16em] text-ink"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-rose animate-pulse-node" />
          {t.nav.brand}
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="font-mono text-micro uppercase tracking-[0.14em] text-ink-mute transition-colors duration-200 ease-out-quint hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <a
            href="#narrative"
            className="group hidden items-center gap-2 border border-hairline px-4 py-2 font-mono text-micro uppercase tracking-[0.14em] text-ink transition-colors duration-200 ease-out-quint hover:border-rose hover:text-rose sm:flex"
          >
            {t.nav.cta}
            <span className="transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}
