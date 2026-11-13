import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { ServicesPhoto } from "./ServicesPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * V5 CREAM TITLE REVEAL.
 * Bottom layer full-bleed D1.
 * Linen panel wipes up from bottom covering whole screen except 28% image band at top.
 * Giant serif title top-right inside linen: "Four ways to begin" (clamp up to 9vw).
 * Caption bottom-left (3 lines): "Kitchens, bathrooms, whole-home renovations, additions and custom homes."
 */
export function ServicesV5CreamReveal() {
  const panelRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);
  const linenPanelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const bgImg = bgImgRef.current;
    const linenPanel = linenPanelRef.current;
    const title = titleRef.current;
    const caption = captionRef.current;
    if (!panel || !bgImg || !linenPanel || !title || !caption) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(title, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(bgImg, { opacity: 0, scale: 1.08 });
      gsap.set(linenPanel, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(caption, { y: 30, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        bgImg,
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        linenPanel,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power4.inOut",
        },
        0.25
      );

      tl.to(
        split.lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.08,
        },
        0.75
      );

      tl.to(
        caption,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        1.0
      );

      failsafeId = window.setTimeout(() => {
        gsap.set(bgImg, { opacity: 1, scale: 1 });
        gsap.set(linenPanel, { clipPath: "inset(0% 0 0 0)" });
        gsap.set(split.lines, { yPercent: 0, opacity: 1 });
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
      zIndex={5}
      theme="light"
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#E8DECE]"
    >
      {/* Bottom layer: Full-bleed image D1 */}
      <div ref={bgImgRef} className="absolute inset-0 h-full w-full">
        <ServicesPhoto
          id="D1"
          className="h-full w-full"
          imgClassName="object-cover object-center"
          showConceptChip={true}
        />
      </div>

      {/* Linen panel covering bottom 72% (leaving top 28% image band visible) */}
      <div
        ref={linenPanelRef}
        className="absolute inset-x-0 bottom-0 top-[28%] z-10 flex flex-col justify-between border-t border-[rgba(44,56,42,0.12)] bg-[#E8DECE] p-6 sm:p-10 md:p-14 lg:p-16 shadow-[0_-20px_50px_rgba(0,0,0,0.12)]"
      >
        {/* Giant Serif Title top-right */}
        <div className="flex justify-end text-right">
          <div className="max-w-4xl">
            <span className="mb-3 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
              Disciplines & Scope
            </span>
            <h2
              ref={titleRef}
              className="font-serif text-[clamp(2.8rem,8.5vw,9vw)] leading-[0.92] tracking-[-0.03em] text-[#2C382A]"
              style={{ textWrap: "balance" }}
            >
              Four ways to begin
            </h2>
          </div>
        </div>

        {/* Short caption bottom-left (3 lines) */}
        <div className="max-w-xl text-left">
          <p
            ref={captionRef}
            className="font-sans text-[clamp(1.1rem,1.45vw,1.55rem)] leading-relaxed text-[#2C382A]/85"
            style={{ textWrap: "balance" }}
          >
            Kitchens, bathrooms, whole-home renovations, additions and custom
            homes.
          </p>
        </div>
      </div>
    </Panel>
  );
}
