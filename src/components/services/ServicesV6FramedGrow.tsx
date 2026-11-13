import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { ServicesPhoto } from "./ServicesPhoto";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * V6 FRAMED GROW.
 * Full-height linen.
 * Framed K2 (client image) starts at grid 4-10 / 3-7 and grows to full-bleed
 * (clip-path inset(32% 30%) to inset(0), 1.4s power4.inOut).
 * The image fills the whole frame at all times (object-fit: cover, no grey strip).
 * A short line appears at bottom-left on a scrim: "Concept visualization".
 */
export function ServicesV6FramedGrow() {
  const panelRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const frame = frameRef.current;
    const caption = captionRef.current;
    if (!panel || !frame) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      // Hidden start state: centered window (grid 4-10 / 3-7)
      gsap.set(frame, { clipPath: "inset(32% 30%)" });
      if (caption) gsap.set(caption, { opacity: 0, y: 15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        frame,
        {
          clipPath: "inset(0% 0%)",
          duration: 1.4,
          ease: "power4.inOut",
        },
        0
      );

      if (caption) {
        tl.to(
          caption,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          0.9
        );
      }

      failsafeId = window.setTimeout(() => {
        gsap.set(frame, { clipPath: "inset(0% 0%)" });
        if (caption) gsap.set(caption, { opacity: 1, y: 0 });
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
    };
  }, []);

  return (
    <Panel
      panelRef={panelRef}
      zIndex={6}
      theme="light"
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#E8DECE]"
    >
      {/* Full-panel grow container starting at inset(32% 30%) and growing to inset(0%) */}
      <div
        ref={frameRef}
        className="absolute inset-0 h-full w-full overflow-hidden bg-[#AD9680]"
      >
        <ServicesPhoto
          id="K2"
          className="h-full w-full"
          imgClassName="object-cover object-center"
          showConceptChip={false}
        />

        {/* Bottom-left scrim */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              "linear-gradient(to top, rgba(27, 33, 26, 0.75) 0%, rgba(27, 33, 26, 0.3) 50%, transparent 100%)",
          }}
        />

        {/* Short line at bottom-left on scrim */}
        <div
          ref={captionRef}
          className="pointer-events-none absolute bottom-8 left-8 z-20 sm:bottom-12 sm:left-12"
        >
          <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[#E8DECE] uppercase">
            Concept visualization
          </span>
        </div>
      </div>
    </Panel>
  );
}
