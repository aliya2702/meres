import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitText } from "./splitText";
import { EASE, DUR, STAGGER } from "./tokens";

gsap.registerPlugin(ScrollTrigger);

type Direction = "left" | "right";

export function revealLines(el: HTMLElement): () => void {
  let split: ReturnType<typeof splitText> | null = null;
  let mm: gsap.MatchMedia | null = null;
  let ctx: gsap.Context | null = null;
  let resizeTimer = 0;

  const setup = () => {
    split?.revert();
    split = splitText(el, { lines: true });
    ctx?.revert();
    ctx = gsap.context(() => {
      gsap.set(split!.lines, { yPercent: 110 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => gsap.to(split!.lines, { yPercent: 0, duration: DUR.text, ease: EASE.reveal, stagger: STAGGER.lines }),
      });
    }, el);
  };

  mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", async () => {
    await document.fonts.ready;
    setup();
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 200);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  return () => {
    window.clearTimeout(resizeTimer);
    mm?.revert();
    ctx?.revert();
    split?.revert();
  };
}

export function wipeIn(el: HTMLElement, dir: Direction = "left", duration = 1.2): () => void {
  const mm = gsap.matchMedia();
  let ctx: gsap.Context | null = null;
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    ctx = gsap.context(() => {
      const image = el.querySelector<HTMLElement>("img, canvas, [data-image-inner]") || el;
      const clip = dir === "right" ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)";
      gsap.set(el, { clipPath: clip });
      gsap.set(image, { scale: 1.15 });
      gsap.to(el, { clipPath: "inset(0 0 0 0)", duration, ease: EASE.wipe });
      gsap.to(image, { scale: 1, duration: DUR.image, ease: EASE.reveal });
    }, el);
  });
  return () => { mm.revert(); ctx?.revert(); };
}

export function drawLines(svg: SVGSVGElement): () => void {
  const mm = gsap.matchMedia();
  let ctx: gsap.Context | null = null;
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    ctx = gsap.context(() => {
      const paths = Array.from(svg.querySelectorAll<SVGGeometryElement>("path, line, polyline, polygon"));
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.to(paths, { strokeDashoffset: 0, duration: 1.2, ease: EASE.iris, stagger: STAGGER.lines });
    }, svg);
  });
  return () => { mm.revert(); ctx?.revert(); };
}

export function magnetic(el: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  let ctx: gsap.Context | null = null;
  mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    ctx = gsap.context(() => {
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
      const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.6)" });
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", reset);
      return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", reset); };
    }, el);
  });
  return () => { mm.revert(); ctx?.revert(); };
}

export function scrubChars(el: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  let split: ReturnType<typeof splitText> | null = null;
  let ctx: gsap.Context | null = null;
  mm.add("(prefers-reduced-motion: no-preference)", async () => {
    await document.fonts.ready;
    split = splitText(el, { chars: true });
    ctx = gsap.context(() => {
      gsap.set(split!.chars, { opacity: 0.18 });
      gsap.to(split!.chars, { opacity: 1, stagger: { each: STAGGER.chars, from: "start" }, scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 45%", scrub: 0.6 } });
    }, el);
  });
  return () => { mm.revert(); ctx?.revert(); split?.revert(); };
}
