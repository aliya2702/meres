import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { ServicesPhoto } from "./ServicesPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * V7 MATERIALS (fix of the overlap).
 * Linen background.
 * Headline top-left in grid 1-6 / 2-4: "Wood, stone, metal and tile: the materials we think about first."
 * Caption bottom-right in grid 9-13 / 8-9: "What you see and what sits behind it deserve the same care."
 * Five REAL close-up photographs (M1-M5) in non-overlapping slots:
 * M1 from LEFT (1-4 / 5-9), M2 from TOP (7-10 / 1-4), M3 from RIGHT (10-13 / 3-7),
 * M4 from BOTTOM (5-8 / 6-9), M5 small from RIGHT (11-13 / 1-2).
 * Drifting in opposite directions <= 1.2vw so they never touch text.
 */
export function ServicesV7Materials() {
  const panelRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const m1Ref = useRef<HTMLDivElement>(null);
  const m2Ref = useRef<HTMLDivElement>(null);
  const m3Ref = useRef<HTMLDivElement>(null);
  const m4Ref = useRef<HTMLDivElement>(null);
  const m5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const title = titleRef.current;
    const caption = captionRef.current;
    const m1 = m1Ref.current;
    const m2 = m2Ref.current;
    const m3 = m3Ref.current;
    const m4 = m4Ref.current;
    const m5 = m5Ref.current;

    if (!panel || !title || !caption || !m1 || !m2 || !m3 || !m4 || !m5) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(title, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(caption, { y: 25, opacity: 0 });

      // Entrances from outer perimeter edges
      gsap.set(m1, { x: -80, opacity: 0 });
      gsap.set(m2, { y: -80, opacity: 0 });
      gsap.set(m3, { x: 80, opacity: 0 });
      gsap.set(m4, { y: 80, opacity: 0 });
      gsap.set(m5, { x: 60, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        split.lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.08,
        },
        0
      );

      tl.to(
        [m1, m2, m3, m4, m5],
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.08,
        },
        0.2
      );

      tl.to(
        caption,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.6
      );

      // Controlled subtle drift <= 1.2vw in opposite directions
      gsap.to(m1, { y: 12, duration: 5.0, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(m2, { y: -12, duration: 5.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(m3, { y: 14, duration: 4.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(m4, { y: -14, duration: 5.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(m5, { y: 10, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut" });

      failsafeId = window.setTimeout(() => {
        gsap.set(split.lines, { yPercent: 0, opacity: 1 });
        gsap.set([m1, m2, m3, m4, m5], { x: 0, y: 0, opacity: 1 });
        gsap.set(caption, { y: 0, opacity: 1 });
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <Panel
      panelRef={panelRef}
      zIndex={7}
      theme="light"
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#E8DECE]"
    >
      {/* 12-column x 9-row Compositional Grid ensuring mathematical non-overlap */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-28 lg:grid lg:grid-cols-12 lg:grid-rows-9 lg:gap-4 lg:p-10 lg:pt-28">
        {/* Headline top-left: grid 1-6 / 2-4 */}
        <div className="lg:col-start-1 lg:col-end-7 lg:row-start-2 lg:row-end-4 lg:self-start">
          <span className="mb-3 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
            Material Palette
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-[clamp(1.9rem,3.8vw,4.2rem)] leading-[1.08] tracking-[-0.02em] text-[#2C382A]"
            style={{ textWrap: "balance" }}
          >
            Wood, stone, metal and tile: the materials we think about first.
          </h2>
        </div>

        {/* M1: Left (cols 1-4, rows 5-9) */}
        <div
          ref={m1Ref}
          className="hidden overflow-hidden rounded-sm border border-[rgba(44,56,42,0.15)] shadow-xl lg:col-start-1 lg:col-end-5 lg:row-start-5 lg:row-end-9 lg:block"
        >
          <ServicesPhoto id="M1" className="h-full w-full" showConceptChip={false} />
        </div>

        {/* M2: Top (cols 7-10, rows 1-4) */}
        <div
          ref={m2Ref}
          className="hidden overflow-hidden rounded-sm border border-[rgba(44,56,42,0.15)] shadow-xl lg:col-start-7 lg:col-end-10 lg:row-start-1 lg:row-end-4 lg:block"
        >
          <ServicesPhoto id="M2" className="h-full w-full" showConceptChip={false} />
        </div>

        {/* M3: Right (cols 10-13, rows 3-7) */}
        <div
          ref={m3Ref}
          className="hidden overflow-hidden rounded-sm border border-[rgba(44,56,42,0.15)] shadow-xl lg:col-start-10 lg:col-end-13 lg:row-start-3 lg:row-end-7 lg:block"
        >
          <ServicesPhoto id="M3" className="h-full w-full" showConceptChip={false} />
        </div>

        {/* M4: Bottom (cols 5-8, rows 6-9) */}
        <div
          ref={m4Ref}
          className="hidden overflow-hidden rounded-sm border border-[rgba(44,56,42,0.15)] shadow-xl lg:col-start-5 lg:col-end-8 lg:row-start-6 lg:row-end-9 lg:block"
        >
          <ServicesPhoto id="M4" className="h-full w-full" showConceptChip={false} />
        </div>

        {/* M5: Small Right (cols 11-13, rows 1-2) */}
        <div
          ref={m5Ref}
          className="hidden overflow-hidden rounded-sm border border-[rgba(44,56,42,0.15)] shadow-xl lg:col-start-11 lg:col-end-13 lg:row-start-1 lg:row-end-3 lg:block"
        >
          <ServicesPhoto id="M5" className="h-full w-full" showConceptChip={false} />
        </div>

        {/* Mobile Preview Cards */}
        <div className="my-6 grid grid-cols-2 gap-3 lg:hidden">
          <div className="h-36 overflow-hidden rounded-sm border border-[rgba(44,56,42,0.15)]">
            <ServicesPhoto id="M1" className="h-full w-full" showConceptChip={false} />
          </div>
          <div className="h-36 overflow-hidden rounded-sm border border-[rgba(44,56,42,0.15)]">
            <ServicesPhoto id="M3" className="h-full w-full" showConceptChip={false} />
          </div>
        </div>

        {/* Caption bottom-right: grid 9-13 / 8-9 */}
        <div className="lg:col-start-9 lg:col-end-13 lg:row-start-8 lg:row-end-10 lg:self-end">
          <p
            ref={captionRef}
            className="max-w-md font-sans text-[clamp(1.05rem,1.3vw,1.35rem)] leading-relaxed text-[#2C382A]/85"
            style={{ textWrap: "balance" }}
          >
            What you see and what sits behind it deserve the same care.
          </p>
        </div>
      </div>
    </Panel>
  );
}
