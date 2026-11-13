import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * H7 GIANT SINGLE WORD (calm beat).
 * Forest-to-lime gradient with a drifting radial blob and faint flowing hairline ribbon
 * drawn in SVG (stroke-dashoffset, slow loop).
 * Giant right-aligned serif word "Place" (14vw, linen at 90%) with tiny uppercase
 * sub-label under it: "SEATTLE'S EASTSIDE".
 * Text only; no image.
 */
export function HomeH7SingleWord() {
  const panelRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const sublabelRef = useRef<HTMLParagraphElement>(null);
  const svgRibbonRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const word = wordRef.current;
    const sublabel = sublabelRef.current;
    const svgRibbon = svgRibbonRef.current;
    if (!panel || !word || !sublabel || !svgRibbon) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(word, { chars: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
      gsap.set(sublabel, { opacity: 0, y: 15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        split.chars,
        {
          yPercent: 0,
          opacity: 0.9,
          duration: 1.0,
          stagger: 0.05,
          ease: "power3.out",
        },
        0
      ).to(
        sublabel,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.4
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
      id="home-h7-single-word"
      zIndex={7}
      background="#213324"
      theme="dark"
      panelRef={panelRef}
      className="panel-h7"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-[#253828] via-[#1f3022] to-[#17271b] p-6 lg:p-20">
        {/* Drifting radial ambient blob */}
        <div
          aria-hidden="true"
          className="home-blob-anim pointer-events-none absolute -left-32 top-1/4 h-[550px] w-[550px] rounded-full bg-[#466348]/25 blur-3xl"
        />

        {/* Faint flowing hairline ribbon SVG */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            ref={svgRibbonRef}
            className="home-hairline-loop"
            d="M-50,600 C300,550 500,750 800,450 C1100,150 1200,300 1500,200"
            stroke="#AD9680"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            className="home-hairline-loop"
            d="M-50,680 C320,620 520,820 830,520 C1120,220 1220,380 1500,280"
            stroke="#E8DECE"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Giant right-aligned serif word "Place" */}
        <div className="relative z-10 flex flex-col items-end text-right">
          <h2
            ref={wordRef}
            className="font-serif text-[clamp(6.5rem,14vw,16rem)] leading-[0.88] tracking-[-0.04em] text-[#E8DECE]/90 select-none"
          >
            Place
          </h2>
          <p
            ref={sublabelRef}
            className="mt-6 font-sans text-xs font-semibold tracking-[0.35em] text-[#AD9680] uppercase"
          >
            SEATTLE&apos;S EASTSIDE
          </p>
        </div>
      </div>
    </Panel>
  );
}

