import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const el = dot.current;
      if (!el) return;
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0, scale: 1 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

      const move = (event: PointerEvent) => {
        xTo(event.clientX);
        yTo(event.clientY);
        const target = (event.target as HTMLElement)?.closest?.(
          "a, button, [role='button'], img, [data-image-frame], [data-frame-slot], [data-cursor]",
        );
        gsap.to(el, {
          scale: target ? 3 : 1,
          opacity: target ? 0.9 : 0.8,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const hide = () => {
        gsap.to(el, { opacity: 0, duration: 0.25, ease: "power3.out", overwrite: "auto" });
      };

      window.addEventListener("pointermove", move);
      document.documentElement.addEventListener("pointerleave", hide);
      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", hide);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9000] hidden h-2 w-2 rounded-full bg-linen ring-1 ring-ink/25 lg:block"
    />
  );
}
