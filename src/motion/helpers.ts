import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitText } from "./splitText";
import { EASE, DUR, STAGGER } from "./tokens";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "left" | "right";

const CLIP_FROM: Record<Direction, string> = {
  up: "inset(100% 0 0 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
};

export function revealLines(el: HTMLElement): () => void {
  let split: ReturnType<typeof splitText> | null = null;
  let ctx: gsap.Context | null = null;
  let resizeTimer = 0;

  const setup = () => {
    ctx?.revert();
    split?.revert();
    split = splitText(el, { lines: true });
    ctx = gsap.context(() => {
      gsap.set(split!.lines, { yPercent: 110, opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(split!.lines, { yPercent: 0, opacity: 1, duration: DUR.text, ease: EASE.reveal, stagger: STAGGER.lines });
        },
      });
    }, el);
  };

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) setup();
    });
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!cancelled) setup();
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
      split?.revert();
    };
  });

  return () => {
    window.clearTimeout(resizeTimer);
    mm.revert();
    ctx?.revert();
    split?.revert();
  };
}

const activeLineReveals = new WeakSet<HTMLElement>();
const activeImageReveals = new WeakSet<HTMLElement>();
const activeParallax = new WeakSet<HTMLElement>();

export function initRevealLines(scope: ParentNode = document): () => void {
  const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal="lines"]')).filter((el) => {
    if (activeLineReveals.has(el)) return false;
    activeLineReveals.add(el);
    return true;
  });
  const cleanups = targets.map((el) => {
    const cleanup = revealLines(el);
    return () => {
      activeLineReveals.delete(el);
      cleanup();
    };
  });
  return () => { cleanups.forEach((c) => c()); };
}

export function wipeIn(el: HTMLElement, dir: Direction = "left", duration = 1.4): () => void {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const image = el.querySelector<HTMLElement>("img, canvas, [data-image-inner]") || el;
    const clip = CLIP_FROM[dir] || CLIP_FROM.left;
    gsap.set(el, { clipPath: clip });
    gsap.set(image, { scale: 1.2 });
    gsap.to(el, { clipPath: "inset(0 0 0 0)", duration, ease: EASE.wipe });
    gsap.to(image, { scale: 1, duration: 1.6, ease: EASE.reveal });
  });
  return () => { mm.revert(); };
}

export function revealImages(scope: ParentNode = document): () => void {
  const targets = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal-image]")).filter((el) => {
    if (activeImageReveals.has(el)) return false;
    activeImageReveals.add(el);
    return true;
  });
  if (!targets.length) return () => {};
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    targets.forEach((el) => {
      const dir = (el.dataset.revealImage as Direction) || "up";
      const clip = CLIP_FROM[dir] || CLIP_FROM.up;
      const inner = el.querySelector<HTMLElement>("img, canvas, [data-image-inner]");
      gsap.set(el, { clipPath: clip });
      if (inner) gsap.set(inner, { scale: 1.2 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(el, { clipPath: "inset(0 0 0 0)", duration: 1.4, ease: EASE.wipe });
          if (inner) gsap.to(inner, { scale: 1, duration: 1.6, ease: EASE.reveal });
        },
      });
    });
  });
  return () => {
    targets.forEach((el) => activeImageReveals.delete(el));
    mm.revert();
  };
}

export function initParallax(scope: ParentNode = document): () => void {
  const targets = Array.from(scope.querySelectorAll<HTMLElement>("[data-parallax]")).filter((el) => {
    if (activeParallax.has(el)) return false;
    activeParallax.add(el);
    return true;
  });
  if (!targets.length) return () => {};
  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    targets.forEach((el) => {
      const inner = el.querySelector<HTMLElement>("img, canvas, [data-parallax-inner]") || el;
      const raw = parseFloat(el.dataset.parallax || "0.06");
      const pct = Number.isFinite(raw) ? raw * 100 : 6;
      el.style.overflow = "clip";
      gsap.fromTo(
        inner,
        { yPercent: -pct, scale: 1.1 },
        {
          yPercent: pct,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    });
  });
  return () => {
    targets.forEach((el) => activeParallax.delete(el));
    mm.revert();
  };
}

export function initMotionAttributes(scope: ParentNode = document): () => void {
  const cleanups = [
    initRevealLines(scope),
    revealImages(scope),
    initParallax(scope),
  ];
  return () => { cleanups.forEach((c) => c()); };
}

const activePanelRises = new WeakSet<HTMLElement>();

/**
 * Yields the preceding panel (scale 1→0.96 + dark overlay 0→0.65) while `panel` rises into place.
 */
export function panelRise(panel: HTMLElement, prevPanel?: HTMLElement | null): () => void {
  if (activePanelRises.has(panel)) return () => {};
  const prev =
    prevPanel ??
    (panel.previousElementSibling instanceof HTMLElement ? panel.previousElementSibling : null);
  if (!prev) return () => {};
  activePanelRises.add(panel);

  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const prevInner = prev.querySelector<HTMLElement>("[data-panel-content]") || prev;
    const prevDim = prev.querySelector<HTMLElement>("[data-panel-dim]");
    const st = ScrollTrigger.create({
      trigger: panel,
      start: "top bottom",
      end: "top top",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(prevInner, { scale: 1 - p * 0.04 });
        if (prevDim) gsap.set(prevDim, { opacity: p * 0.65 });
      },
      onLeaveBack: () => {
        gsap.set(prevInner, { scale: 1 });
        if (prevDim) gsap.set(prevDim, { opacity: 0 });
      },
    });
    return () => {
      st.kill();
      gsap.set(prevInner, { clearProps: "transform" });
      if (prevDim) gsap.set(prevDim, { opacity: 0 });
    };
  });

  return () => {
    activePanelRises.delete(panel);
    mm.revert();
  };
}

export function drawLines(svg: SVGSVGElement): () => void {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const paths = Array.from(svg.querySelectorAll<SVGGeometryElement>("path, line, polyline, polygon"));
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap.to(paths, { strokeDashoffset: 0, duration: 1.2, ease: EASE.iris, stagger: STAGGER.lines });
  });
  return () => { mm.revert(); };
}

export function magnetic(el: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: EASE.soft });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: EASE.soft });
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      if (Math.hypot(dx, dy) <= 90) {
        xTo(dx * 0.35);
        yTo(dy * 0.35);
      }
    };
    const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: EASE.soft });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", reset); };
  });
  return () => { mm.revert(); };
}

export function scrubChars(el: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  let split: ReturnType<typeof splitText> | null = null;
  let ctx: gsap.Context | null = null;
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      split = splitText(el, { chars: true });
      ctx = gsap.context(() => {
        gsap.set(split!.chars, { opacity: 0.18 });
        gsap.to(split!.chars, { opacity: 1, stagger: { each: STAGGER.chars, from: "start" }, scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 45%", scrub: 0.6 } });
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
      split?.revert();
    };
  });
  return () => { mm.revert(); ctx?.revert(); split?.revert(); };
}
