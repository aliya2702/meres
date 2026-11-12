import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "@/motion/tokens";
import { images } from "@/content/images";
import { splitText, type Split } from "@/motion/splitText";

gsap.registerPlugin(ScrollTrigger);

/**
 * StackSection: a parent containing <section class="panel"> children.
 * CSS sticky stacking creates the hard-edge panel wipe — no GSAP pin.
 * Each panel builds its own paused GSAP timeline played on enter, reversed on leave-back.
 * The only scrubbed effect is the previous panel scaling 1→0.96 and dimming via an opacity overlay.
 */
export function StackSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const debug = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>(".panel"));
    if (!panels.length) return;

    const params = new URLSearchParams(window.location.search);
    debug.current = params.has("debug") && params.get("debug") === "1";

    if (debug.current) {
      panels.forEach((p) => p.setAttribute("data-debug", ""));
      el.setAttribute("data-debug", "");
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      panels.forEach((p) => p.classList.add("panel-active"));
      return () => {
        panels.forEach((p) => p.classList.remove("panel-active"));
      };
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      const cleanups: Array<() => void> = [];

      const setup = () => {
        if (cancelled) return;
        panels.forEach((panel) => {
          const tlEl = panel.querySelector<HTMLElement>("[data-panel-timeline]");
          if (!tlEl) return;

          const tl = gsap.timeline({ paused: true });
          const froms = Array.from(tlEl.querySelectorAll<HTMLElement>("[data-anim-from]"));

          froms.forEach((child) => {
            const type = child.dataset.animFrom!;
            const clipMap: Record<string, string> = {
              top: "inset(0 0 100% 0)", bottom: "inset(100% 0 0 0)",
              left: "inset(0 100% 0 0)", right: "inset(0 0 0 100%)",
            };
            const inner = child.querySelector<HTMLElement>("[data-anim-inner]");
            if (type === "iris") {
              gsap.set(child, { clipPath: "circle(0% at 50% 50%)" });
              tl.to(child, { clipPath: "circle(150% at 50% 50%)", duration: 1.2, ease: EASE.iris }, 0);
              if (inner) { gsap.set(inner, { scale: 1.12 }); tl.to(inner, { scale: 1, duration: 1.4, ease: EASE.wipe }, 0); }
            } else if (type === "slats") {
              const slats = Array.from(child.querySelectorAll<HTMLElement>("[data-slat]"));
              slats.forEach((slat, si) => {
                const fromTop = si % 2 === 0;
                gsap.set(slat, { clipPath: fromTop ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)" });
              });
              tl.to(slats, { clipPath: "inset(0 0 0 0)", duration: 1.0, ease: EASE.wipe, stagger: 0.06 }, 0);
              if (inner) { gsap.set(inner, { scale: 1.12 }); tl.to(inner, { scale: 1, duration: 1.4, ease: EASE.wipe }, 0); }
            } else if (type === "text-rise") {
              const lines = Array.from(child.querySelectorAll<HTMLElement>("[data-text-line]"));
              gsap.set(lines, { yPercent: 110, opacity: 0 });
              tl.to(lines, { yPercent: 0, opacity: 1, duration: 1.0, ease: EASE.reveal, stagger: 0.09 }, 0);
            } else {
              const clip = clipMap[type] || clipMap.bottom;
              gsap.set(child, { clipPath: clip });
              tl.to(child, { clipPath: "inset(0 0 0 0)", duration: 1.0, ease: EASE.wipe }, 0);
              if (inner) { gsap.set(inner, { scale: 1.12 }); tl.to(inner, { scale: 1, duration: 1.4, ease: EASE.wipe }, 0.05); }
            }
          });

          const st = ScrollTrigger.create({
            trigger: panel,
            start: "top 55%",
            onEnter: () => { tl.timeScale(1).play(); panel.classList.add("panel-active"); },
            onLeaveBack: () => { tl.timeScale(2).reverse(); panel.classList.remove("panel-active"); },
          });
          cleanups.push(() => { st.kill(); tl.kill(); });
        });

        // Scrubbed scale + dark opacity overlay on previous panel while next covers it (desktop only)
        const desktopMm = gsap.matchMedia();
        desktopMm.add("(min-width: 1024px) and (pointer: fine)", () => {
          const scrubTriggers: ScrollTrigger[] = [];
          panels.forEach((panel, i) => {
            if (i === 0) return;
            const prev = panels[i - 1];
            const prevInner = prev.querySelector<HTMLElement>("[data-panel-content]");
            const prevDim = prev.querySelector<HTMLElement>("[data-panel-dim]");
            if (!prevInner) return;
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
            scrubTriggers.push(st);
          });
          return () => {
            scrubTriggers.forEach((st) => st.kill());
            panels.forEach((p) => {
              const inner = p.querySelector<HTMLElement>("[data-panel-content]");
              const dim = p.querySelector<HTMLElement>("[data-panel-dim]");
              if (inner) gsap.set(inner, { clearProps: "transform" });
              if (dim) gsap.set(dim, { opacity: 0 });
            });
          };
        });
        cleanups.push(() => desktopMm.revert());

        ScrollTrigger.refresh();
      };

      void document.fonts.ready.then(setup);

      if (debug.current) {
        const check = () => {
          panels.forEach((p, i) => {
            const imgs = p.querySelectorAll<HTMLImageElement>("img");
            imgs.forEach((img) => { if (img.naturalWidth === 0) console.warn(`Panel ${i}: img naturalWidth 0 —`, img.src); });
            const h = p.querySelector("h1, h2, h3, [data-headline]");
            if (!h) console.warn(`Panel ${i}: no visible headline`);
          });
        };
        const id = window.setTimeout(check, 1500);
        cleanups.push(() => window.clearTimeout(id));
      }

      return () => {
        cancelled = true;
        cleanups.forEach((c) => c());
      };
    });

    return () => { mm.revert(); };
  }, []);

  return <div ref={root} className={`stack-section ${className}`}>{children}</div>;
}

/**
 * Frame: a real <img> with width/height, object-fit cover, taupe fallback bg.
 * Decodes before entrance plays. Shows a concept-visualization caption chip.
 */
export type FrameSlot = {
  imageId: string;
  crop?: "left" | "center" | "right";
  gridArea: string;
  from?: "top" | "bottom" | "left" | "right" | "iris" | "slats";
  drift?: "up" | "down" | "left" | "right";
  driftAmp?: string;
  driftDur?: string;
  label?: boolean;
};

export function Frame({ slot, eager }: { slot: FrameSlot; eager?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const from = slot.from || "bottom";

  useEffect(() => {
    const img = ref.current;
    const container = containerRef.current;
    if (!img || !container) return;
    const parent = container.closest(".panel");
    if (!parent) return;

    if (prefersReducedMotion()) return;

    const decodeAndReady = async () => {
      try { await img.decode(); } catch { /* ignore */ }
      const tlEl = parent.querySelector<HTMLElement>("[data-panel-timeline]");
      if (tlEl) tlEl.dispatchEvent(new CustomEvent("frame-ready", { detail: { id: slot.imageId } }));
    };
    void decodeAndReady();
  }, [slot.imageId]);

  const img = images.find((i) => i.id === slot.imageId);
  if (!img) return null;

  const cropPos = (() => {
    const fx = img.focal.xPct, fy = img.focal.yPct;
    if (slot.crop === "left") return `${Math.max(0, fx - 25)}% ${fy}%`;
    if (slot.crop === "right") return `${Math.min(100, fx + 25)}% ${fy}%`;
    return `${fx}% ${fy}%`;
  })();

  const isSlat = from === "slats";

  return (
    <div
      ref={containerRef}
      data-frame-slot
      data-anim-from={from}
      style={{ gridArea: slot.gridArea, overflow: "clip", background: "#AD9680" }}
    >
      {isSlat && (
        <div data-anim-inner style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              data-slat
              style={{
                position: "absolute", top: 0, bottom: 0,
                left: `${i * 10}%`, width: "10%",
                overflow: "hidden",
              }}
            >
              <img
                ref={i === 0 ? ref : undefined}
                src={img.src["1672"]}
                alt={img.alt}
                width={1672} height={941}
                loading={eager ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
                style={{ objectPosition: cropPos, width: `${10 * 10}%`, maxWidth: "none", marginLeft: `-${i * 10}%` }}
              />
            </div>
          ))}
        </div>
      )}
      {!isSlat && (
        <div data-anim-inner style={{ position: "absolute", inset: 0 }}>
          <img
            ref={ref}
            src={img.src["1672"]}
            alt={img.alt}
            width={1672} height={941}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: cropPos }}
          />
        </div>
      )}
      {slot.label !== false && (
        <span className="concept-chip absolute bottom-3 left-3 z-10">Concept visualization</span>
      )}
      {slot.drift && (
        <div
          className="frame-drift"
          data-drift={slot.drift}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", "--drift-amp": slot.driftAmp || "1.5vw", "--drift-dur": slot.driftDur || "12s" } as CSSProperties}
        />
      )}
    </div>
  );
}

/**
 * TextRise: line-by-line text rise entrance (1.0s power3.out).
 * Uses splitText for accessible splitting.
 */
export function TextRise({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      let split: Split | null = null;
      void document.fonts.ready.then(() => {
        if (cancelled) return;
        split = splitText(el, { lines: true });
        split.lines.forEach((l) => l.setAttribute("data-text-line", ""));
      });
      return () => {
        cancelled = true;
        split?.revert();
      };
    });
    return () => { mm.revert(); };
  }, []);
  return (
    <div ref={ref} data-anim-from="text-rise" className={className} style={{ overflow: "hidden" }}>
      {children}
    </div>
  );
}

/**
 * Panel: a sticky panel child of StackSection. Must contain a [data-panel-content]
 * wrapper (for the scrubbed scale/dimming) and a [data-panel-timeline] element
 * (where StackSection looks for [data-anim-from] children to animate).
 */
export function Panel({
  children, className = "", zIndex = 0, background, theme,
}: { children: ReactNode; className?: string; zIndex?: number; background?: string; theme?: "dark" | "light" }) {
  return (
    <section
      className={`panel ${className}`}
      data-theme={theme}
      style={{ zIndex, background: background || "var(--linen)" }}
    >
      <div data-panel-content className="relative min-h-[100svh] w-full lg:absolute lg:inset-0 lg:min-h-0">
        <div data-panel-timeline className="relative min-h-[100svh] w-full lg:absolute lg:inset-0 lg:min-h-0">
          {children}
        </div>
        <div data-panel-dim aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 bg-[#1B211A] opacity-0" />
      </div>
    </section>
  );
}
