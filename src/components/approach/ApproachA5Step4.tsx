import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { ApproachPhoto } from "./ApproachPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * A5 STEP 4 "Approve changes with understanding." (full-bleed blurred macro to sharp).
 * Full-bleed macro image M3 starts blurred (blur 24px, scale 1.1) resolving to sharp (1.6s).
 * Forest side panel slides in from the right (width 32%, power4.out) with short sentence:
 * "Every change is explained before it is approved."
 * Giant title bottom-left, pale linen at 70% opacity, characters rising,
 * partially overlapping the panel edge with mix-blend-mode: difference.
 */
export function ApproachA5Step4() {
  const panelRef = useRef<HTMLElement>(null);
  const macroImgRef = useRef<HTMLDivElement>(null);
  const sidePanelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sideTextRef = useRef<HTMLParagraphElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const macroImg = macroImgRef.current;
    const sidePanel = sidePanelRef.current;
    const title = titleRef.current;
    const sideText = sideTextRef.current;
    const numeral = numeralRef.current;
    if (!panel || !macroImg || !sidePanel || !title || !sideText || !numeral)
      return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const splitTitle = splitText(title, { chars: true, lines: true });
    const splitSide = splitText(sideText, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(macroImg, { filter: "blur(24px)", scale: 1.1 });
      gsap.set(sidePanel, { xPercent: 100 });
      gsap.set(splitTitle.chars, { yPercent: 110, opacity: 0 });
      gsap.set(splitSide.lines, { yPercent: 110, opacity: 0 });
      gsap.set(numeral, { opacity: 0, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // Macro unblurs to sharp
      tl.to(
        macroImg,
        {
          filter: "blur(0px)",
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
        },
        0
      )
        // Forest side panel slides in from right
        .to(
          sidePanel,
          {
            xPercent: 0,
            duration: 1.2,
            ease: "power4.out",
          },
          0.2
        )
        // Giant numeral fills
        .to(
          numeral,
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            onStart: () => numeral.classList.add("numeral-filled"),
            onReverseComplete: () => numeral.classList.remove("numeral-filled"),
          },
          0.3
        )
        // Title characters rise
        .to(
          splitTitle.chars,
          {
            yPercent: 0,
            opacity: 0.7,
            duration: 0.8,
            stagger: 0.02,
            ease: "power3.out",
          },
          0.4
        )
        // Side panel serif text lines rise
        .to(
          splitSide.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.6
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
      splitTitle.revert();
      splitSide.revert();
    };
  }, []);

  return (
    <Panel
      id="approach-step-4"
      zIndex={5}
      background="#1B211A"
      theme="dark"
      panelRef={panelRef}
      className="panel-a5"
    >
      <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[#1B211A]">
        {/* Step corner counter */}
        <div className="absolute top-6 left-6 z-40 font-sans text-xs tracking-[0.25em] text-[#E8DECE]/70 lg:top-10 lg:left-14">
          04 / 05
        </div>

        {/* Full-bleed macro image M3 */}
        <div
          ref={macroImgRef}
          className="absolute inset-0 z-0 h-full w-full will-change-transform"
        >
          <ApproachPhoto
            id="M3"
            className="h-full w-full"
            imgClassName="object-cover"
          />
          {/* Subtle dimming overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#1B211A]/40"
          />
        </div>

        {/* Giant outlined 04 numeral */}
        <div
          ref={numeralRef}
          aria-hidden="true"
          className="giant-numeral giant-numeral-dark absolute bottom-[10vh] left-[4vw] z-10 pointer-events-none"
        >
          04
        </div>

        {/* Sliding Forest side panel from the right (width 32% on desktop) */}
        <div
          ref={sidePanelRef}
          className="absolute top-0 right-0 z-20 flex h-full w-full flex-col justify-center bg-[#2C382A] p-8 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] lg:w-[32%] lg:p-12 xl:p-16"
        >
          <span className="mb-4 block font-sans text-xs font-medium tracking-[0.2em] text-[#AD9680] uppercase">
            Step 04 &mdash; Transparency
          </span>
          <p
            ref={sideTextRef}
            className="font-serif text-[clamp(1.5rem,2.4vw,2.5rem)] leading-snug text-[#E8DECE]"
          >
            Every change is explained before it is approved.
          </p>
          <p className="mt-6 font-sans text-sm leading-relaxed text-[#E8DECE]/70">
            No unexpected invoices. No unapproved revisions. Full clarity at each turn of the work.
          </p>
        </div>

        {/* Giant title bottom-left overlapping panel edge with mix-blend-mode: difference */}
        <div className="pointer-events-none absolute bottom-8 left-6 z-30 max-w-[80vw] lg:bottom-14 lg:left-14 lg:max-w-[70vw] xl:bottom-18">
          <h2
            ref={titleRef}
            className="font-serif text-[clamp(2.4rem,5.6vw,6.5rem)] leading-[0.98] tracking-[-0.03em] text-[#E8DECE]/70 mix-blend-difference"
          >
            Approve changes with understanding.
          </h2>
        </div>
      </div>
    </Panel>
  );
}

