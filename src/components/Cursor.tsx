import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Cursor({ color = "#AD9680" }: { color?: string }) {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const el = ring.current;
      const text = label.current;
      if (!el || !text) return;
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        xTo(event.clientX);
        yTo(event.clientY);
        const target = (event.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
        const mode = target?.dataset.cursor;
        const scale = mode === "view" ? 2.6 : mode ? 1.6 : 1;
        text.textContent = mode === "view" ? "View" : "";
        gsap.to(el, { scale, opacity: target ? 0.9 : 0.55, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={ring} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[9000] hidden h-9 w-9 items-center justify-center rounded-full border md:flex" style={{ borderColor: color }}>
      <span ref={label} className="text-[9px] uppercase tracking-[0.14em]" />
    </div>
  );
}
