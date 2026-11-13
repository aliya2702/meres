import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { ApproachPhoto } from "./ApproachPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * A1 INTRO (cream split).
 * Left 62%: full-height exterior image E2 (wipes from bottom, 1.1s).
 * Right 38%: linen with rising lines "Trust is built in the details."
 * Caption: "How a MERES project moves from first conversation to finished home."
 * Second image strip (M1) slides behind first, staying 8% visible at bottom edge.
 */
export function ApproachA1Intro() {
  const panelRef = useRef<HTMLElement>(null);
  const leftImgRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const sentenceRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const leftImg = leftImgRef.current;
    const strip = stripRef.current;
    const sentence = sentenceRef.current;
    const caption = captionRef.current;
    if (!panel || !leftImg || !strip || !sentence || !caption) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(sentence, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(leftImg, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(strip, { yPercent: 100, opacity: 0 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(caption, { opacity: 0, y: 15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // M1 strip slides up first
      tl.to(
        strip,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
        },
        0
      )
        // E2 wipes in from bottom
        .to(
          leftImg,
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.1,
            ease: "power4.inOut",
          },
          0.15
        )
        // Serif lines rise
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.4
        )
        // Tiny caption fades in
        .to(
          caption,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0.65
        );

      failsafeId = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
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
      id="approach-intro"
      zIndex={1}
      background="#E8DECE"
      theme="light"
      panelRef={panelRef}
      className="panel-a1"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col lg:flex-row">
        {/* Left 62% image composition */}
        <div className="relative h-[55svh] w-full lg:h-full lg:w-[62%]">
          {/* Second strip (M1) staying 8% visible at the bottom edge behind E2 */}
          <div
            ref={stripRef}
            className="absolute bottom-0 left-0 right-0 z-0 h-[8%] w-full overflow-hidden"
          >
            <ApproachPhoto id="M1" className="h-full w-full object-cover" />
          </div>

          {/* Main E2 image taking 92% of height, leaving 8% strip visible */}
          <div
            ref={leftImgRef}
            className="relative z-10 h-[92%] w-full overflow-hidden"
          >
            <ApproachPhoto
              id="E2"
              priority
              className="h-full w-full"
              imgClassName="object-cover"
            />
            <span className="concept-chip absolute bottom-3 right-3 z-20">
              Illustrative image
            </span>
          </div>
        </div>

        {/* Right 38% Linen Story Block */}
        <div className="relative flex flex-1 flex-col justify-end bg-[#E8DECE] p-6 lg:w-[38%] lg:p-12 xl:p-16">
          <div className="mb-4">
            <span className="mb-6 inline-block text-[11px] font-medium tracking-[0.22em] text-[#2C382A]/70 uppercase">
              The MERES Approach
            </span>
            <h1
              ref={sentenceRef}
              className="font-serif text-[clamp(2.2rem,4.2vw,4.8rem)] leading-[1.08] text-[#2C382A] tracking-[-0.02em]"
            >
              Trust is built in the details.
            </h1>
            <p
              ref={captionRef}
              className="mt-4 max-w-md font-sans text-[clamp(0.95rem,1.15vw,1.125rem)] leading-relaxed text-[#2C382A]/80"
            >
              How a MERES project moves from first conversation to finished home.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

