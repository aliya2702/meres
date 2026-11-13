import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * H10 CREAM MULTI-FRAME SCENE.
 * Linen background.
 * In the centre a serif sentence (cols 4-9):
 * "You do not need to know construction terminology to explain what matters to you."
 * FOUR frames enter from different edges and drift in opposite directions:
 * 1. P1 (portrait) from LEFT
 * 2. K3 (landscape) from TOP
 * 3. D2 (landscape) from RIGHT
 * 4. M2 (small) from BOTTOM
 */
export function HomeH10CreamMultiFrame() {
  const panelRef = useRef<HTMLElement>(null);
  const sentenceRef = useRef<HTMLHeadingElement>(null);
  const frameLeftRef = useRef<HTMLDivElement>(null);
  const frameTopRef = useRef<HTMLDivElement>(null);
  const frameRightRef = useRef<HTMLDivElement>(null);
  const frameBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const sentence = sentenceRef.current;
    const fLeft = frameLeftRef.current;
    const fTop = frameTopRef.current;
    const fRight = frameRightRef.current;
    const fBottom = frameBottomRef.current;
    if (!panel || !sentence || !fLeft || !fTop || !fRight || !fBottom) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(sentence, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(fLeft, { x: -80, opacity: 0 });
      gsap.set(fTop, { y: -80, opacity: 0 });
      gsap.set(fRight, { x: 80, opacity: 0 });
      gsap.set(fBottom, { y: 80, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // Sentence rises
      tl.to(
        split.lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.1
      )
        // 4 frames enter from their edges
        .to(
          fLeft,
          {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out",
          },
          0.2
        )
        .to(
          fTop,
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out",
          },
          0.3
        )
        .to(
          fRight,
          {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out",
          },
          0.4
        )
        .to(
          fBottom,
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out",
          },
          0.5
        );

      // Parallax drifting in opposite directions
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(fLeft, {
          y: -15,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 },
        });
        gsap.to(fTop, {
          y: 20,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 },
        });
        gsap.to(fRight, {
          y: -25,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 },
        });
        gsap.to(fBottom, {
          y: 15,
          ease: "none",
          scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });

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
      id="home-h10-multi-frame"
      zIndex={10}
      background="#E8DECE"
      theme="light"
      panelRef={panelRef}
      className="panel-h10"
    >
      <div className="relative flex h-full min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#E8DECE] p-6 lg:p-14">
        {/* Frame 1: LEFT portrait (P1) */}
        <div
          ref={frameLeftRef}
          className="absolute top-1/4 left-4 z-10 hidden w-[22vw] max-w-[260px] aspect-[3/4] overflow-hidden rounded-sm border border-[rgba(44,56,42,0.18)] bg-[#AD9680] shadow-xl lg:block"
        >
          <HomePhoto id="P1" className="h-full w-full" imgClassName="object-cover" />
        </div>

        {/* Frame 2: TOP landscape (K3) */}
        <div
          ref={frameTopRef}
          className="absolute top-8 right-12 z-10 hidden w-[26vw] max-w-[320px] aspect-[16/10] overflow-hidden rounded-sm border border-[rgba(44,56,42,0.18)] bg-[#AD9680] shadow-xl lg:block"
        >
          <HomePhoto id="K3" className="h-full w-full" imgClassName="object-cover" />
        </div>

        {/* Frame 3: RIGHT landscape (D2) */}
        <div
          ref={frameRightRef}
          className="absolute bottom-16 right-8 z-10 hidden w-[24vw] max-w-[300px] aspect-[4/3] overflow-hidden rounded-sm border border-[rgba(44,56,42,0.18)] bg-[#AD9680] shadow-xl lg:block"
        >
          <HomePhoto id="D2" className="h-full w-full" imgClassName="object-cover" />
        </div>

        {/* Frame 4: BOTTOM small (M2) */}
        <div
          ref={frameBottomRef}
          className="absolute bottom-8 left-1/4 z-10 hidden w-[18vw] max-w-[200px] aspect-square overflow-hidden rounded-sm border border-[rgba(44,56,42,0.18)] bg-[#AD9680] shadow-xl lg:block"
        >
          <HomePhoto id="M2" className="h-full w-full" imgClassName="object-cover" />
        </div>

        {/* Center serif statement */}
        <div className="relative z-20 max-w-2xl text-center">
          <span className="mb-4 inline-block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
            Communication First
          </span>
          <h2
            ref={sentenceRef}
            className="font-serif text-[clamp(2.1rem,4.2vw,4.5rem)] leading-[1.12] text-[#2C382A] tracking-[-0.02em]"
          >
            You do not need to know construction terminology to explain what matters to you.
          </h2>
        </div>
      </div>
    </Panel>
  );
}

