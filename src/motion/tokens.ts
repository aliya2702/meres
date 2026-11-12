export const EASE = {
  reveal: "expo.out",
  wipe: "power4.inOut",
  soft: "power3.out",
  iris: "power3.inOut",
} as const;
export const DUR = { text: 1.1, image: 1.5, veil: 0.9, hover: 0.45 } as const;
export const STAGGER = { lines: 0.09, words: 0.05, chars: 0.018 } as const;
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktopFine: "(min-width: 1024px) and (pointer: fine)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
