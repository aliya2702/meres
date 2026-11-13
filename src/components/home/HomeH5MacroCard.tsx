import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * H5 MACRO WITH CARD AND INSET.
 * Full-bleed macro M1 with soft zoom (1.15 to 1, 1.6s).
 * Forest card (cols 1-6, rows 3-7) rises from bottom with serif paragraph (3-4 lines):
 * "Care in how things are made is care in how they are lived with."
 * Small framed inset image (M2, landscape, cols 8-12 rows 3-6) wipes in from right.
 * The macro image drifts slowly upward on scroll.
 */
export function HomeH5MacroCard() {
  const panelRef = useRef<HTMLElement>(null);
  const macroImgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const insetRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const macroImg = macroImgRef.current;
    const card = cardRef.current;
    const inset = insetRef.current;
    const para = paraRef.current;
    if (!panel || !macroImg || !card || !inset || !para) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(para, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(macroImg, { scale: 1.15 });
      gsap.set(card, { y: 80, opacity: 0 });
      gsap.set(inset, { clipPath: "inset(0 0 0 100%)", x: 40 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // Macro zoom settling
      tl.to(
        macroImg,
        {
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
        },
        0
      )
        // Forest card rises from bottom
        .to(
          card,
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
          },
          0.2
        )
        // Serif lines rise
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.35
        )
        // Small framed inset wipes in from right
        .to(
          inset,
          {
            clipPath: "inset(0 0 0 0%)",
            x: 0,
            duration: 1.0,
            ease: "power4.out",
          },
          0.4
        );

      // Upward drift of macro image on scroll
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(macroImg, {
          y: "-4vh",
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "bottom top",
            scrub: 1.4,
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
      id="home-h5-macro-card"
      zIndex={5}
      background="#1B211A"
      theme="dark"
      panelRef={panelRef}
      className="panel-h5"
    >
      <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[#1B211A]">
        {/* Full-bleed macro M1 with soft zoom and drift */}
        <div
          ref={macroImgRef}
          className="absolute inset-0 z-0 h-[108%] w-full will-change-transform"
        >
          <HomePhoto
            id="M1"
            className="h-full w-full"
            imgClassName="object-cover"
          />
          <div
            aria-hidden="true"
            className="home-scrim-35 pointer-events-none absolute inset-0 z-10"
          />
        </div>

        {/* Content layout grid */}
        <div className="relative z-20 flex h-full w-full flex-col justify-between p-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-16 xl:p-24">
          {/* Forest card on left side (cols 1-6) */}
          <div
            ref={cardRef}
            className="mt-auto mb-4 rounded-sm border border-[rgba(232,222,206,0.18)] bg-[#2C382A]/95 p-8 shadow-2xl backdrop-blur-md lg:col-span-6 lg:my-auto lg:p-12 xl:p-16"
          >
            <span className="mb-4 block font-sans text-xs font-medium tracking-[0.22em] text-[#AD9680] uppercase">
              Material Philosophy
            </span>
            <h2
              ref={paraRef}
              className="font-serif text-[clamp(1.6rem,2.8vw,3.2rem)] leading-[1.14] text-[#E8DECE]"
            >
              Care in how things are made is care in how they are lived with.
            </h2>
          </div>

          {/* Small framed inset image (M2, landscape) wiping in from right (cols 8-12) */}
          <div
            ref={insetRef}
            className="hidden lg:col-span-5 lg:col-start-8 lg:block"
          >
            <div className="aspect-[16/10] w-full overflow-hidden rounded-sm border border-[rgba(232,222,206,0.22)] bg-[#AD9680] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <HomePhoto
                id="M2"
                className="h-full w-full"
                imgClassName="object-cover"
              />
            </div>
            <p className="mt-3 text-right font-sans text-[11px] tracking-wider text-[#E8DECE]/70 uppercase">
              Tactile surfaces &bull; Belgian Linen
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

