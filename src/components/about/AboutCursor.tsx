import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../../motion/tokens";

type CursorMode = "idle" | "view" | "cta";

/**
 * Scoped floating cursor badge rendered only on /about for desktop fine pointers.
 * Shows "View" over AB5 full-bleed sequence frames and an expanded arrow halo over AB7 CTA.
 */
export function AboutCursor() {
  const pillRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("idle");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

    const pill = pillRef.current;
    if (!pill) return;

    const xTo = gsap.quickTo(pill, "x", { duration: 0.24, ease: "power3.out" });
    const yTo = gsap.quickTo(pill, "y", { duration: 0.24, ease: "power3.out" });

    let current: CursorMode = "idle";

    const updateMode = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      const viewEl = el?.closest("[data-about-cursor='view']");
      const ctaEl = el?.closest("[data-about-cursor='cta']");
      const next: CursorMode = ctaEl ? "cta" : viewEl ? "view" : "idle";
      if (next !== current) {
        current = next;
        setMode(next);
      }
    };

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      updateMode(e.target);
    };

    const onLeave = () => {
      current = "idle";
      setMode("idle");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={pillRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-50 hidden -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 lg:block ${
        mode === "idle" ? "opacity-0" : "opacity-100"
      }`}
    >
      {mode === "view" && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(232,222,206,0.45)] bg-[rgba(35,45,34,0.82)] text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--linen)] backdrop-blur-sm">
          View
        </div>
      )}
      {mode === "cta" && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(232,222,206,0.65)] bg-[rgba(44,56,42,0.55)] text-[var(--linen)] backdrop-blur-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.3}
            className="h-5 w-5"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </div>
      )}
    </div>
  );
}

