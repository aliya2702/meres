import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { ServicesPhoto } from "./ServicesPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * V1 HERO.
 * Full-bleed K1 (client's hero kitchen), scale 1.15 to 1 over 1.6s.
 * Title bottom-left "What changes begins with what matters." (characters rise, scrim).
 * Forest card (grid 8-13 / 3-9) rises from the bottom right with
 * "Some things you want to change. Others are the reason you love your home." (serif, clamp up to 1.6rem).
 * Parallax on scroll: card slides up 12vh and image shifts left 8%.
 */
export function ServicesV1Hero() {
  const panelRef = useRef<HTMLElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const imgWrapper = imgWrapperRef.current;
    const title = titleRef.current;
    const card = cardRef.current;
    if (!panel || !imgWrapper || !title || !card) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(title, { chars: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(imgWrapper, { scale: 1.15, xPercent: 0 });
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
      gsap.set(card, { y: 80, opacity: 0 });

      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(
        imgWrapper,
        {
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
        },
        0
      );

      tl.to(
        split.chars,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.018,
        },
        0.2
      );

      tl.to(
        card,
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
        },
        0.9
      );

      // Scroll parallax
      gsap.to(card, {
        y: "-12vh",
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(imgWrapper, {
        xPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 3s failsafe
      failsafeId = window.setTimeout(() => {
        gsap.set(split.chars, { yPercent: 0, opacity: 1 });
        gsap.set(card, { y: 0, opacity: 1 });
        gsap.set(imgWrapper, { scale: 1, xPercent: 0 });
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
      zIndex={1}
      theme="dark"
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#2C382A]"
    >
      {/* Background image container with parallax capability */}
      <div
        ref={imgWrapperRef}
        className="absolute inset-0 h-full w-[110%] -left-[5%] will-change-transform"
      >
        <ServicesPhoto
          id="K1"
          className="h-full w-full"
          imgClassName="object-cover object-center"
          showConceptChip={true}
        />
      </div>

      {/* Ink Scrim: Bottom-left and overall protection */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to top right, rgba(27, 33, 26, 0.90) 0%, rgba(27, 33, 26, 0.5) 45%, transparent 75%)",
        }}
      />

      {/* Content wrapper with 12-col grid for precise placement */}
      <div className="relative z-20 flex h-full w-full flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-28 md:p-14 md:pt-32 lg:grid lg:grid-cols-12 lg:grid-rows-9 lg:gap-4 lg:p-12 lg:pt-28">
        {/* Bottom-left giant serif title */}
        <div className="self-end lg:col-start-1 lg:col-end-8 lg:row-start-5 lg:row-end-10 lg:self-end">
          <span className="mb-3 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
            Meres Residential Architecture & Interiors
          </span>
          <h1
            ref={titleRef}
            className="font-serif text-[clamp(2.6rem,6.8vw,6.5rem)] leading-[0.98] tracking-[-0.03em] text-[#E8DECE]"
            style={{ textWrap: "balance" }}
          >
            What changes begins with what matters.
          </h1>
        </div>

        {/* Forest Card: grid 8-13 / 3-9 rising from bottom right */}
        <div
          ref={cardRef}
          className="mt-6 w-full rounded-sm border border-[rgba(232,222,206,0.18)] bg-[#2C382A]/94 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:col-start-8 lg:col-end-13 lg:row-start-4 lg:row-end-9 lg:mt-0 lg:self-end lg:p-9"
        >
          <span className="mb-3 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
            Perspective
          </span>
          <p className="font-serif text-[clamp(1.2rem,1.55vw,1.6rem)] leading-snug text-[#E8DECE]">
            Some things you want to change. Others are the reason you love your
            home.
          </p>
          <p className="mt-4 font-sans text-sm leading-relaxed text-[#E8DECE]/75">
            Every renovation begins by recognizing what gives a house its
            character, so modern refinement enhances rather than erases it.
          </p>
        </div>
      </div>
    </Panel>
  );
}
