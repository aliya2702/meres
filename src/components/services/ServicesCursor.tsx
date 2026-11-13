import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/motion/tokens";

type CursorMode = "idle" | "view";

/**
 * Scoped floating cursor badge rendered for the Services page on desktop fine pointers.
 * Displays "View" when hovering over any element with data-services-cursor="view".
 */
export function ServicesCursor() {
  const pillRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("idle");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches)
      return;

    const pill = pillRef.current;
    if (!pill) return;

    const xTo = gsap.quickTo(pill, "x", {
      duration: 0.22,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(pill, "y", {
      duration: 0.22,
      ease: "power3.out",
    });

    let current: CursorMode = "idle";

    const updateMode = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      const viewEl = el?.closest("[data-services-cursor='view']");
      const next: CursorMode = viewEl ? "view" : "idle";
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
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(232,222,206,0.55)] bg-[rgba(35,45,34,0.85)] text-[11px] font-medium uppercase tracking-[0.18em] text-[#E8DECE] shadow-2xl backdrop-blur-md">
          View
        </div>
      )}
    </div>
  );
}

