import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { ServicesPhoto } from "./ServicesPhoto";
import { prefersReducedMotion } from "@/motion/tokens";
import { scrollToTarget } from "@/motion/smooth";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_LINKS = [
  { id: "K2", target: "#kitchens", label: "Kitchens" },
  { id: "B1", target: "#bathrooms", label: "Bathrooms" },
  { id: "D2", target: "#whole-home", label: "Whole-home" },
  { id: "E2", target: "#additions-custom-homes", label: "Additions" },
];

/**
 * V3 DUSK EXTERIOR WITH CARD.
 * Full-bleed E1.
 * Linen card (1-6 / 3-7) slides in from LEFT with:
 * "MERES brings residential design, construction and cabinet-making experience to the same conversation."
 * Linen strip rises from bottom-left (1-7 / 8-9) with label "WHAT WE DO"
 * and 4 circular thumbnails (K2, B1, D2, E2) linking to anchors.
 */
export function ServicesV3DuskCard() {
  const panelRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const card = cardRef.current;
    const strip = stripRef.current;
    if (!panel || !card || !strip) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(card, { xPercent: -120, opacity: 0 });
      gsap.set(strip, { y: 60, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        card,
        {
          xPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
        },
        0
      );

      tl.to(
        strip,
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        0.2
      );

      failsafeId = window.setTimeout(() => {
        gsap.set(card, { xPercent: 0, opacity: 1 });
        gsap.set(strip, { y: 0, opacity: 1 });
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
    };
  }, []);

  const handleScrollTo = (target: string) => {
    ScrollTrigger.refresh();
    scrollToTarget(target, {
      duration: 1.2,
      offset: 0,
    });
  };

  return (
    <Panel
      panelRef={panelRef}
      zIndex={3}
      theme="dark"
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#1B211A]"
    >
      {/* Full-bleed exterior E1 */}
      <div className="absolute inset-0 h-full w-full">
        <ServicesPhoto
          id="E1"
          className="h-full w-full"
          imgClassName="object-cover object-center"
        />
      </div>

      {/* Scrim on left and bottom */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(27, 33, 26, 0.82) 0%, rgba(27, 33, 26, 0.45) 45%, transparent 80%)",
        }}
      />

      {/* 12-col x 9-row Compositional Grid */}
      <div className="relative z-20 flex h-full w-full flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-28 md:p-14 lg:grid lg:grid-cols-12 lg:grid-rows-9 lg:gap-4 lg:p-12 lg:pt-28">
        {/* Linen Card: grid 1-6 / 3-7 from LEFT */}
        <div
          ref={cardRef}
          className="w-full rounded-sm border border-[rgba(27,33,26,0.12)] bg-[#E8DECE] p-6 text-[#2C382A] shadow-2xl sm:p-8 md:p-10 lg:col-start-1 lg:col-end-7 lg:row-start-3 lg:row-end-7 lg:self-center"
        >
          <span className="mb-3 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
            Unified Perspective
          </span>
          <h2
            className="font-serif text-[clamp(1.5rem,2.4vw,2.5rem)] leading-snug tracking-[-0.015em] text-[#2C382A]"
            style={{ textWrap: "balance" }}
          >
            MERES brings residential design, construction and cabinet-making
            experience to the same conversation.
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-[#2C382A]/75">
            Architecture, structural craft and bespoke cabinetry shaped as one
            disciplined response to your home.
          </p>
        </div>

        {/* Linen Strip: grid 1-7 / 8-9 rising from bottom-left */}
        <div
          ref={stripRef}
          className="mt-6 flex flex-col gap-3 rounded-sm border border-[rgba(27,33,26,0.15)] bg-[#E8DECE]/95 px-5 py-3.5 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:gap-6 lg:col-start-1 lg:col-end-8 lg:row-start-8 lg:row-end-10 lg:mt-0 lg:self-end"
        >
          <span className="font-sans text-[11px] font-semibold tracking-[0.22em] text-[#2C382A]/75 uppercase">
            WHAT WE DO
          </span>
          <div className="flex items-center gap-3">
            {SERVICE_LINKS.map((item) => (
              <button
                key={item.target}
                type="button"
                onClick={() => handleScrollTo(item.target)}
                title={`Scroll to ${item.label}`}
                className="group relative flex flex-col items-center focus:outline-none"
              >
                <div className="h-11 w-11 overflow-hidden rounded-full border border-[#2C382A]/25 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-[#2C382A] sm:h-12 sm:w-12">
                  <ServicesPhoto
                    id={item.id}
                    className="h-full w-full"
                    imgClassName="object-cover"
                    showConceptChip={false}
                  />
                </div>
                <span className="mt-1 font-sans text-[10px] tracking-wider text-[#2C382A]/80 transition-colors group-hover:text-[#2C382A]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
