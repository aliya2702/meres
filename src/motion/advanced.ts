import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, STAGGER } from "./tokens";

gsap.registerPlugin(ScrollTrigger);

export type PanelDef = {
  container: HTMLElement;
  panels: HTMLElement[];
  onComplete?: () => void;
};

/** ONE pinned ScrollTrigger timeline moving through full-viewport panels.
 *  Desktop >= 1024px, pointer fine, motion allowed. Mobile: no pin, each panel 100svh, wipes once on enter. */
export function panelStage(root: HTMLElement, panels: HTMLElement[]): () => void {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    mm.add("(min-width: 1024px) and (pointer: fine)", () => {
      panels.forEach((panel, i) => {
        if (i === 0) return;
        gsap.set(panel, { clipPath: "inset(100% 0 0 0)" });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${panels.length * 100}%`,
          scrub: 0.8,
          pin: true,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.4, max: 0.9 },
            ease: "power2.inOut",
            delay: 0.05,
          },
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        const incomingLines = panel.querySelectorAll<HTMLElement>("[data-panel-line]");
        const outgoingImage = panels[i - 1].querySelector<HTMLElement>("[data-panel-image]");
        const outgoingLines = panels[i - 1].querySelectorAll<HTMLElement>("[data-panel-line]");

        tl.to(panel, { clipPath: "inset(0 0 0 0)", duration: 0.9, ease: EASE.wipe });
        if (outgoingImage) tl.to(outgoingImage, { scale: 1.06, duration: 0.9, ease: EASE.wipe }, "<");
        if (outgoingLines.length) tl.to(outgoingLines, { yPercent: -60, opacity: 0, duration: 0.5, ease: "power3.in", stagger: 0.04 }, "<");
        if (incomingLines.length) tl.fromTo(incomingLines, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.0, ease: EASE.reveal, stagger: STAGGER.lines }, "<0.15");
      });

      return () => { tl.kill(); };
    });

    // Mobile / non-fine: no pin, each panel 100svh, wipe in once on enter
    mm.add("(max-width: 1023px), (pointer: coarse)", () => {
      const triggers: ScrollTrigger[] = [];
      panels.forEach((panel, i) => {
        if (i === 0) return;
        gsap.set(panel, { clipPath: "inset(100% 0 0 0)" });
        const st = ScrollTrigger.create({
          trigger: panel,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(panel, { clipPath: "inset(0 0 0 0)", duration: 0.9, ease: EASE.wipe });
            const lines = panel.querySelectorAll<HTMLElement>("[data-panel-line]");
            if (lines.length) gsap.fromTo(lines, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: EASE.reveal, stagger: STAGGER.lines, delay: 0.3 });
          },
        });
        triggers.push(st);
      });
      return () => triggers.forEach((t) => t.kill());
    });
  });

  return () => mm.revert();
}

/** Image appears through 10 vertical "window blind" slats. Pure CSS clip-path on stacked layers sharing the same image. */
export function slatReveal(el: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  let ctx: gsap.Context | null = null;

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    ctx = gsap.context(() => {
      const slats = Array.from(el.querySelectorAll<HTMLElement>("[data-slat]"));
      if (!slats.length) return;
      slats.forEach((slat, i) => {
        const fromTop = i % 2 === 0;
        gsap.set(slat, { clipPath: fromTop ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)" });
      });
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(slats, {
            clipPath: "inset(0 0 0 0)",
            duration: 1.1,
            ease: EASE.wipe,
            stagger: 0.06,
          });
        },
      });
    }, el);
  });

  return () => { mm.revert(); ctx?.revert(); };
}

/** Circular clip-path circle(0% at origin) -> circle(150% at origin), 1.2 s power3.inOut. */
export function irisReveal(el: HTMLElement, origin: string = "50% 50%"): () => void {
  const mm = gsap.matchMedia();
  let ctx: gsap.Context | null = null;

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    ctx = gsap.context(() => {
      gsap.set(el, { clipPath: `circle(0% at ${origin})` });
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(el, { clipPath: `circle(150% at ${origin})`, duration: 1.2, ease: EASE.iris });
        },
      });
    }, el);
  });

  return () => { mm.revert(); ctx?.revert(); };
}

/** 3 large blurred radial-gradient blobs drifting behind colour-only panels. Only animate while in view. */
export function moodGradient(el: HTMLElement, getPaused?: () => boolean): () => void {
  const mm = gsap.matchMedia();
  let ctx: gsap.Context | null = null;

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    ctx = gsap.context(() => {
      const blobs = Array.from(el.querySelectorAll<HTMLElement>("[data-mood-blob]"));
      if (!blobs.length) return;

      let inView = false;
      const animationStates: Array<{ xTo: gsap.QuickToFunc; yTo: gsap.QuickToFunc; phase: number; amp: number }> = [];

      blobs.forEach((blob, i) => {
        const amp = 12 + i * 2;
        const xTo = gsap.quickTo(blob, "x", { duration: 18 + i * 4, ease: "sine.inOut" });
        const yTo = gsap.quickTo(blob, "y", { duration: 22 + i * 2, ease: "sine.inOut" });
        animationStates.push({ xTo, yTo, phase: i * 1.2, amp });
      });

      let startTime = 0;
      let raf = 0;
      const tick = () => {
        if (!inView) { raf = 0; return; }
        if (!getPaused?.()) {
          const t = (performance.now() - startTime) / 1000;
          animationStates.forEach(({ xTo, yTo, phase, amp }) => {
            xTo(Math.sin(t * 0.4 + phase) * amp);
            yTo(Math.cos(t * 0.35 + phase * 1.3) * amp * 0.7);
          });
        }
        raf = requestAnimationFrame(tick);
      };

      const start = () => { if (!inView) { inView = true; startTime = performance.now(); raf = requestAnimationFrame(tick); } };
      const stop = () => { inView = false; if (raf) cancelAnimationFrame(raf); raf = 0; };

      const observer = new IntersectionObserver(([entry]) => entry.isIntersecting ? start() : stop(), { threshold: 0.1 });
      observer.observe(el);

      return () => { stop(); observer.disconnect(); };
    }, el);
  });

  return () => { mm.revert(); ctx?.revert(); };
}

/** Desktop pointer-fine only; image drifts opposite the cursor by up to 14 px (quickTo 0.8 s power3.out). */
export function cursorParallax(el: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  let ctx: gsap.Context | null = null;

  mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    ctx = gsap.context(() => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: EASE.soft });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: EASE.soft });
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (cx - e.clientX) / rect.width;
        const dy = (cy - e.clientY) / rect.height;
        xTo(gsap.utils.clamp(-14, 14, dx * 14));
        yTo(gsap.utils.clamp(-14, 14, dy * 14));
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }, el);
  });

  return () => { mm.revert(); ctx?.revert(); };
}
