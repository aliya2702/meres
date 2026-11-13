import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { ServicesPhoto } from "./ServicesPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * V4 FULL-BLEED MACRO.
 * Full-bleed dark macro M1 filling the whole screen (not framed), wiping up from bottom, slow zoom 1.1 to 1.
 * Sentence centred on 45% scrim: "Understand the home, then build around it."
 * Small caption bottom-left: "Cabinetry, stone, lighting and layout considered together."
 * Nothing else; no cream background visible.
 */
export function ServicesV4Macro() {
  const panelRef = useRef<HTMLElement>(null);
  const wipeContainerRef = useRef<HTMLDivElement>(null);
  const innerImgRef = useRef<HTMLDivElement>(null);
  const sentenceRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const wipeContainer = wipeContainerRef.current;
    const innerImg = innerImgRef.current;
    const sentence = sentenceRef.current;
    const caption = captionRef.current;
    if (!panel || !wipeContainer || !innerImg || !sentence || !caption) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(sentence, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(wipeContainer, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(innerImg, { scale: 1.1 });
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
        wipeContainer,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power4.out",
        },
        0
      );

      tl.to(
        innerImg,
        {
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
        },
        0
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
        0.5
      );

      failsafeId = window.setTimeout(() => {
        gsap.set(wipeContainer, { clipPath: "inset(0% 0 0 0)" });
        gsap.set(innerImg, { scale: 1 });
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
      zIndex={4}
      theme="dark"
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#1B211A]"
    >
      {/* Full-bleed dark macro M1 wiping up from bottom */}
      <div ref={wipeContainerRef} className="absolute inset-0 h-full w-full overflow-hidden">
        <div ref={innerImgRef} className="h-full w-full">
          <ServicesPhoto
            id="M1"
            className="h-full w-full"
            imgClassName="object-cover object-center"
            showConceptChip={false}
          />
        </div>
      </div>

      {/* 45% dark scrim overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "rgba(27, 33, 26, 0.45)",
        }}
      />

      {/* Centered sentence and bottom-left caption with header clearance */}
      <div className="relative z-20 flex h-full w-full flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-28 md:p-16 lg:p-20 lg:pt-28">
        <div className="h-6" aria-hidden="true" />

        {/* Center serif sentence */}
        <div className="mx-auto max-w-4xl text-center">
          <h2
            ref={sentenceRef}
            className="font-serif text-[clamp(2.4rem,5vw,5rem)] leading-[1.08] tracking-[-0.025em] text-[#E8DECE]"
            style={{ textWrap: "balance" }}
          >
            Understand the home, then build around it.
          </h2>
        </div>

        {/* Caption bottom-left in DM Sans */}
        <div>
          <p
            ref={captionRef}
            className="max-w-md font-sans text-[clamp(1.05rem,1.3vw,1.35rem)] leading-relaxed text-[#E8DECE]/85"
          >
            Cabinetry, stone, lighting and layout considered together.
          </p>
        </div>
      </div>
    </Panel>
  );
}
