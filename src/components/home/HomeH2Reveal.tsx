import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * H2 FULL-BLEED REVEAL.
 * A full-bleed exterior E1 wipes up over the hero from the bottom (1.1s power4.out, inner image 1.2 to 1).
 * A narrow forest strip (8% wide) stays at the left edge.
 * Short sentence in upper right in serif lines on a scrim:
 * "Understanding those moments gives the work its direction."
 * Then the image slides 18% to the right (parallax) as the next scene covers it.
 */
export function HomeH2Reveal() {
  const panelRef = useRef<HTMLElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const innerImgRef = useRef<HTMLDivElement>(null);
  const sentenceRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const wipe = wipeRef.current;
    const innerImg = innerImgRef.current;
    const sentence = sentenceRef.current;
    if (!panel || !wipe || !innerImg || !sentence) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(sentence, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(wipe, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(innerImg, { scale: 1.2 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // Wipe up from bottom, inner image settles from 1.2 to 1
      tl.to(
        wipe,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power4.out",
        },
        0
      )
        .to(
          innerImg,
          {
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
          },
          0
        )
        // Upper-right serif sentence lines rise
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.35
        );

      // Parallax: image slides 18% right as user scrolls past
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(innerImg, {
          xPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
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
      id="home-h2-reveal"
      zIndex={2}
      background="#2C382A"
      theme="dark"
      panelRef={panelRef}
      className="panel-h2"
    >
      <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[#2C382A]">
        {/* Narrow forest strip (8% wide) staying at the left edge */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-0 z-20 hidden w-[8%] bg-[#2C382A] border-r border-[rgba(232,222,206,0.1)] lg:block"
        />

        {/* Full-bleed exterior E1 wipe container */}
        <div
          ref={wipeRef}
          className="absolute inset-0 z-10 overflow-hidden lg:left-[8%]"
        >
          <div ref={innerImgRef} className="h-full w-full will-change-transform">
            <HomePhoto
              id="E1"
              className="h-full w-full"
              imgClassName="object-cover"
              showChip
            />
          </div>

          {/* Upper-right ink scrim */}
          <div
            aria-hidden="true"
            className="home-scrim-tr pointer-events-none absolute inset-0 z-20"
          />

          {/* Upper-right serif sentence */}
          <div className="absolute top-8 right-6 z-30 max-w-xl text-right lg:top-16 lg:right-16 xl:top-20 xl:right-24">
            <h2
              ref={sentenceRef}
              className="font-serif text-[clamp(2.1rem,4.4vw,4.6rem)] leading-[1.08] text-[#E8DECE] tracking-[-0.02em]"
            >
              Understanding those moments gives the work its direction.
            </h2>
          </div>
        </div>
      </div>
    </Panel>
  );
}

