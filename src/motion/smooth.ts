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

function resolveScrollY(el: HTMLElement, offset: number): number {
  const panel = el.classList.contains("panel") ? el : el.closest<HTMLElement>(".stack-section > .panel");
  const stack = panel?.closest<HTMLElement>(".stack-section");
  if (panel && stack) {
    const panels = Array.from(stack.children).filter((child): child is HTMLElement => child.classList.contains("panel"));
    const idx = panels.indexOf(panel);
    if (idx !== -1) {
      const stackTop = stack.getBoundingClientRect().top + window.scrollY;
      let sumPrev = 0;
      for (let i = 0; i < idx; i += 1) {
        sumPrev += panels[i].getBoundingClientRect().height;
      }
      return stackTop + sumPrev + offset;
    }
  }
  return el.getBoundingClientRect().top + window.scrollY + offset;
}

export function scrollToTarget(
  target: string | number | HTMLElement,
  opts: { offset?: number; duration?: number; immediate?: boolean; onComplete?: () => void } = {},
) {
  const offset = opts.offset ?? -96;
  const targetEl =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : typeof target === "number"
        ? null
        : target;
  const resolvedY =
    typeof target === "number" ? target : targetEl ? resolveScrollY(targetEl, offset) : null;

  if (lenis) {
    if (resolvedY !== null) {
      lenis.scrollTo(resolvedY, {
        duration: opts.duration ?? 1.4,
        immediate: opts.immediate,
        force: opts.immediate,
        onComplete: opts.onComplete,
      });
    } else {
      lenis.scrollTo(target as string | number | HTMLElement, {
        offset,
        duration: opts.duration ?? 1.4,
        immediate: opts.immediate,
        force: opts.immediate,
        onComplete: opts.onComplete,
      });
    }
  } else {
    if (resolvedY !== null) {
      window.scrollTo({ top: resolvedY, behavior: opts.immediate ? "auto" : "smooth" });
    }
    if (opts.onComplete) {
      window.setTimeout(opts.onComplete, opts.immediate ? 0 : 300);
    }
  }
}
