import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { ApproachPhoto } from "./ApproachPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * A2 STEP 1 "First, understand what matters." (macro with framed inset).
 * Forest background. Full-bleed macro image M2 inside a frame with 5vw margin.
 * On entrance, frame grows from centre window (clip-path inset(35% 30%)) to inset(5vw) (1.3s power4.inOut)
 * and inner image scales 1.2 to 1.
 * Title sits bottom-left over a scrim, giant outlined "01" that fills on entrance.
 * Small line: "We start by listening to how you live." Corner step badge "01 / 05".
 */
export function ApproachA2Step1() {
  const panelRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const innerImgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const frame = frameRef.current;
    const innerImg = innerImgRef.current;
    const title = titleRef.current;
    const line = lineRef.current;
    const numeral = numeralRef.current;
    if (!panel || !frame || !innerImg || !title || !line || !numeral) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(title, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(frame, { clipPath: "inset(35% 30%)" });
      gsap.set(innerImg, { scale: 1.2 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(line, { opacity: 0, y: 15 });
      gsap.set(numeral, { opacity: 0, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // Frame expands and inner image settles
      tl.to(
        frame,
        {
          clipPath: "inset(5vw)",
          duration: 1.3,
          ease: "power4.inOut",
        },
        0
      )
        .to(
          innerImg,
          {
            scale: 1,
            duration: 1.3,
            ease: "power4.inOut",
          },
          0
        )
        // Giant numeral fades and fills
        .to(
          numeral,
          {
            opacity: 1,
            scale: 1,
            duration: 1.0,
            ease: "power3.out",
            onStart: () => {
              numeral.classList.add("numeral-filled");
            },
            onReverseComplete: () => {
              numeral.classList.remove("numeral-filled");
            },
          },
          0.3
        )
        // Title lines rise
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.45
        )
        // Small sentence appears
        .to(
          line,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0.7
        );

      failsafeId = window.setTimeout(() => {
        if (tl.progress() < 1) {
          tl.progress(1);
          numeral.classList.add("numeral-filled");
        }
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
      id="approach-step-1"
      zIndex={2}
      background="#2C382A"
      theme="dark"
      panelRef={panelRef}
      className="panel-a2"
    >
      <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[#2C382A]">
        {/* Step corner counter */}
        <div className="absolute top-6 right-6 z-30 font-sans text-xs tracking-[0.25em] text-[#E8DECE]/70 lg:top-10 lg:right-12">
          01 / 05
        </div>

        {/* Framed inset macro image M2 */}
        <div
          ref={frameRef}
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ clipPath: "inset(5vw)" }}
        >
          <div ref={innerImgRef} className="h-full w-full">
            <ApproachPhoto
              id="M2"
              className="h-full w-full"
              imgClassName="object-cover"
            />
          </div>
          {/* Subtle ink scrim over image */}
          <div
            aria-hidden="true"
            className="approach-scrim-bl pointer-events-none absolute inset-0 z-20"
          />
        </div>

        {/* Giant outlined numeral background behind bottom-left title */}
        <div
          ref={numeralRef}
          aria-hidden="true"
          className="giant-numeral giant-numeral-dark absolute bottom-[8vh] left-[4vw] z-20 pointer-events-none"
        >
          01
        </div>

        {/* Title block over scrim */}
        <div className="absolute bottom-12 left-6 z-30 max-w-2xl lg:bottom-20 lg:left-16 xl:bottom-24 xl:left-24">
          <span className="mb-2 block font-sans text-xs font-medium tracking-[0.2em] text-[#AD9680] uppercase">
            Step 01 &mdash; Discovery
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-[clamp(2.2rem,5vw,5.5rem)] leading-[1.05] text-[#E8DECE] tracking-[-0.02em]"
          >
            First, understand what matters.
          </h2>
          <p
            ref={lineRef}
            className="mt-4 font-sans text-[clamp(1rem,1.25vw,1.25rem)] text-[#E8DECE]/85"
          >
            We start by listening to how you live.
          </p>
        </div>
      </div>
    </Panel>
  );
}
