import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * H8 ROTATING SECTION: PHOTO + TEXT + DARK MACRO.
 * Full-width landscape photo D3 at top 45% with serif paragraph over it on a scrim (right-aligned, 3 lines):
 * "Light, air and quiet. The ordinary parts of a home deserve the most attention."
 * Below it, dark blurred macro M4 fills lower 55%.
 * Pinned forest card (cols 9-12) with small image B3 and giant word "Eastside" in corner
 * slides in from right over full-bleed dusk exterior E4.
 */
export function HomeH8Rotating() {
  const panelRef = useRef<HTMLElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const sideCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const para = paraRef.current;
    const sideCard = sideCardRef.current;
    if (!panel || !para || !sideCard) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(para, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(sideCard, { xPercent: 100 });

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
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.1
      ).to(
        sideCard,
        {
          xPercent: 0,
          duration: 1.1,
          ease: "power4.out",
        },
        0.3
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
      id="home-h8-rotating"
      zIndex={8}
      background="#182219"
      theme="dark"
      panelRef={panelRef}
      className="panel-h8"
    >
      <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[#182219]">
        {/* Full-bleed base exterior E4 */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <HomePhoto
            id="E4"
            className="h-full w-full"
            imgClassName="object-cover"
          />
        </div>

        {/* Top 45% landscape photo D3 with right-aligned serif paragraph over scrim */}
        <div className="absolute top-0 left-0 right-0 z-10 h-[45%] overflow-hidden border-b border-[rgba(232,222,206,0.15)]">
          <HomePhoto
            id="D3"
            className="h-full w-full"
            imgClassName="object-cover"
          />
          <div
            aria-hidden="true"
            className="home-scrim-35 pointer-events-none absolute inset-0 z-10"
          />
          <div className="absolute inset-x-0 bottom-6 z-20 px-6 text-left lg:px-16 lg:text-right">
            <h2
              ref={paraRef}
              className="ml-auto max-w-xl font-serif text-[clamp(1.4rem,2.4vw,2.6rem)] leading-snug text-[#E8DECE]"
            >
              Light, air and quiet. The ordinary parts of a home deserve the most attention.
            </h2>
          </div>
        </div>

        {/* Lower 55% dark blurred macro M4 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-[55%] overflow-hidden">
          <div className="h-full w-full scale-105 filter blur-md brightness-50">
            <HomePhoto
              id="M4"
              className="h-full w-full"
              imgClassName="object-cover"
            />
          </div>
        </div>

        {/* Pinned side card sliding from right (cols 9-12 or 34% width) */}
        <div
          ref={sideCardRef}
          className="absolute top-0 right-0 z-30 flex h-full w-full flex-col justify-between border-l border-[rgba(232,222,206,0.15)] bg-[#2C382A]/95 p-6 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] backdrop-blur-md lg:w-[34%] lg:p-12"
        >
          <div>
            <span className="mb-4 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
              Regional Craft
            </span>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-sm border border-[rgba(232,222,206,0.2)] bg-[#AD9680]">
              <HomePhoto
                id="B3"
                className="h-full w-full"
                imgClassName="object-cover"
              />
            </div>
            <p className="mt-6 font-sans text-sm leading-relaxed text-[#E8DECE]/80">
              Homes built with longevity across Bellevue, Kirkland, Clyde Hill, and the Pacific Northwest.
            </p>
          </div>

          {/* Giant word "Eastside" in corner */}
          <div className="pt-4 text-right">
            <span
              aria-hidden="true"
              className="font-serif text-[clamp(3.5rem,7vw,7rem)] leading-none text-[#E8DECE]/20 select-none"
            >
              Eastside
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

