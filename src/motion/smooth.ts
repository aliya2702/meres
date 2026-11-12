import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./tokens";

gsap.registerPlugin(ScrollTrigger);

export let lenis: Lenis | null = null;
/** Smoothed scroll velocity, roughly -1..1. Read it anywhere (shaders, skew effects). */
export const velocity = { v: 0 };

export function initSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => {
    if (!lenis) return;
    lenis.raf(time * 1000);
    const target = gsap.utils.clamp(-1, 1, lenis.velocity / 30);
    velocity.v += (target - velocity.v) * 0.12;
    if (Math.abs(velocity.v) < 0.0005) velocity.v = 0;
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target: string | number | HTMLElement, opts: { offset?: number; duration?: number; immediate?: boolean } = {}) {
  const offset = opts.offset ?? -96;
  if (lenis) lenis.scrollTo(target as string | number | HTMLElement, { offset, duration: opts.duration ?? 1.4, immediate: opts.immediate, force: opts.immediate });
  else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : typeof target === "number" ? null : target;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: opts.immediate ? "auto" : "smooth" });
    else if (typeof target === "number") window.scrollTo({ top: target });
  }
}
