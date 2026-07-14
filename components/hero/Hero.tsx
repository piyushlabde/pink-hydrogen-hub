"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { ReactorSchematic } from "./ReactorSchematic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ease } from "@/lib/easing";
import { useLang } from "@/components/i18n/LangProvider";

export function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const svgWrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { t } = useLang();

  useEffect(() => {
    if (reduced) return; // static fallback below
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);
      const svg = svgWrap.current;
      if (!svg) return;

      const q = (sel: string) => svg.querySelectorAll(sel);

      // Initial state — everything disassembled / hidden.
      gsap.set(q('[data-part="reactor"]'), { autoAlpha: 0, x: -60 });
      gsap.set(q('[data-part="feed"]'), { scaleX: 0, transformOrigin: "left center" });
      gsap.set(q('[data-part="electrolyzer"]'), { autoAlpha: 0, scale: 0.9, transformOrigin: "center" });
      gsap.set(q('[data-part="trunk"]'), { scaleX: 0, transformOrigin: "left center" });
      gsap.set(q('[data-part="splitter"]'), { scale: 0, transformOrigin: "center" });
      gsap.set(q('[data-part="branch-fertilizer"], [data-part="branch-grid"], [data-part="branch-fuel"]'), {
        autoAlpha: 0,
      });
      // branch paths draw on
      const branchPaths = q('[data-flow="b1"], [data-flow="b2"], [data-flow="b3"]');
      branchPaths.forEach((p) => {
        const len = (p as SVGPathElement).getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=2200",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(q('[data-part="reactor"]'), { autoAlpha: 1, x: 0, duration: 1, ease: "expo.out" })
        .to(q('[data-part="feed"]'), { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, "-=0.2")
        .to(
          q('[data-part="electrolyzer"]'),
          { autoAlpha: 1, scale: 1, duration: 0.8, ease: "expo.out" },
          "-=0.1",
        )
        .to(q('[data-part="trunk"]'), { scaleX: 1, duration: 0.5, ease: "power3.inOut" })
        .to(q('[data-part="splitter"]'), { scale: 1, duration: 0.4, ease: "back.out(2)" }, "-=0.1")
        .to(
          q('[data-part="branch-fertilizer"], [data-part="branch-grid"], [data-part="branch-fuel"]'),
          { autoAlpha: 1, duration: 0.4, stagger: 0.08 },
        )
        .to(branchPaths, { strokeDashoffset: 0, duration: 1, stagger: 0.12, ease: "power2.inOut" }, "-=0.3")
        // once assembled, pulse the flow overlays continuously
        .to(
          q("[data-flow-overlay]"),
          { opacity: 1, duration: 0.4 },
          "-=0.2",
        );

      // Fade hero copy as the diagram takes focus.
      gsap.to(".hero-copy", {
        opacity: 0.15,
        y: -20,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=900",
          scrub: 0.8,
        },
      });

      // Continuous dash-flow on overlays (independent of scrub).
      gsap.to(q("[data-flow-overlay]"), {
        strokeDashoffset: -40,
        duration: 1.4,
        ease: "none",
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      className="relative min-h-screen w-full overflow-hidden"
      aria-label="Introduction"
    >
      <div className="mx-auto flex min-h-screen max-w-shell flex-col justify-center px-6 pt-28 md:px-10">
        {/* Editorial asymmetric split: copy left, diagram right */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="hero-copy lg:col-span-5 lg:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: ease.outExpo }}
              className="flex items-center gap-3 font-mono text-micro uppercase tracking-[0.18em] text-ink-mute"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose animate-pulse-node" />
              {t.hero.eyebrow}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: ease.outExpo, delay: 0.08 }}
              className="mt-7 font-display text-display font-medium leading-[0.94] text-ink"
            >
              {t.hero.titleLine1}
              <br />
              <span className="text-rose">{t.hero.titleLine2}</span>
              <br />
              {t.hero.titleLine3}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.18 }}
              className="mt-8 max-w-md text-lead text-ink-dim"
            >
              {t.hero.lede}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.3 }}
              className="mt-10 flex items-center gap-8 font-mono text-micro uppercase tracking-[0.14em] text-ink-mute"
            >
              <span>
                <span className="text-rose">01</span> — {t.hero.scrollToAssemble}
              </span>
              <span className="h-px w-16 bg-hairline-bright" aria-hidden />
              <span>{t.hero.capacityRange}</span>
            </motion.div>
          </div>

          {/* Diagram column */}
          <div className="lg:col-span-7 lg:self-center">
            <div
              ref={svgWrap}
              className="aspect-[1000/520] w-full"
            >
              <ReactorSchematic />
            </div>
            {reduced && (
              <p className="mt-4 text-center font-mono text-micro uppercase tracking-[0.14em] text-ink-mute">
                {t.hero.reducedCaption}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-micro uppercase tracking-[0.2em] text-ink-mute">
              {t.hero.scroll}
            </span>
            <div className="h-10 w-px overflow-hidden bg-hairline">
              <motion.div
                className="h-4 w-px bg-rose"
                animate={{ y: [-16, 40] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: ease.inOutCirc,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
