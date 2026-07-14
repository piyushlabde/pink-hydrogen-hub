// Central easing registry so every transition uses a deliberate curve.
// Never the browser/library default ease-in-out.

// For Motion (Framer Motion) — cubic-bezier arrays.
export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  inOutCirc: [0.85, 0, 0.15, 1],
  lift: [0.34, 1.56, 0.64, 1], // slight overshoot for hover-lift
  softSpring: [0.5, 1.25, 0.5, 1],
} as const;

// For GSAP — string names / custom.
export const gsapEase = {
  outExpo: "expo.out",
  outQuint: "power4.out",
  inOutCirc: "circ.inOut",
} as const;

// Duration scale (seconds).
export const dur = {
  micro: 0.18,
  fast: 0.28,
  base: 0.5,
  slow: 0.9,
  reveal: 1.2,
} as const;

// Shared spring for slider/drag feedback.
export const dragSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};
