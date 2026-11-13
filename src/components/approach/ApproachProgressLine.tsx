import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * 1px taupe line running down the left edge of the page, drawing smoothly on scroll.
 */
export function ApproachProgressLine() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const el = lineRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".approach-page",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (el) {
            el.style.height = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="approach-progress-rail hidden lg:block"
    >
      <div
        ref={lineRef}
        className="approach-progress-bar"
      />
    </div>
  );
}

