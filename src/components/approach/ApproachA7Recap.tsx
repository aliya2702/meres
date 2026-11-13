import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { ApproachPhoto } from "./ApproachPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

const STEPS = [
  {
    num: "01",
    label: "First listen",
    id: "P6",
    heightClass: "h-[44svh] lg:h-[48svh]",
    centerOrder: 2, // 3rd to animate
  },
  {
    num: "02",
    label: "Scope defined",
    id: "K5",
    heightClass: "h-[48svh] lg:h-[54svh]",
    centerOrder: 1, // 2nd to animate
  },
  {
    num: "03",
    label: "Single lead",
    id: "B4",
    heightClass: "h-[54svh] lg:h-[62svh]", // Tallest middle
    centerOrder: 0, // 1st to animate
  },
  {
    num: "04",
    label: "Clear approvals",
    id: "D4",
    heightClass: "h-[48svh] lg:h-[54svh]",
    centerOrder: 1, // 2nd to animate
  },
  {
    num: "05",
    label: "Quiet handover",
    id: "E5",
    heightClass: "h-[44svh] lg:h-[48svh]",
    centerOrder: 2, // 3rd to animate
  },
];

/**
 * A7 PROCESS RECAP (cream filmstrip).
 * Linen background. Eyebrow "FIVE STEPS", headline "One conversation, from start to finish."
 * Row of 5 portrait frames (different heights, middle tallest, bottom-aligned).
 * Frames rise from bottom staggered centre-outward (clip-path wipe + 80px translate, 0.1s stagger).
 * Row drifts left slowly on scroll. Hover lifts frame 12px, dims others to 60%.
 */
export function ApproachA7Recap() {
  const panelRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const panel = panelRef.current;
    const title = titleRef.current;
    const eyebrow = eyebrowRef.current;
    const row = rowRef.current;
    if (!panel || !title || !eyebrow || !row) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(title, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(eyebrow, { opacity: 0, y: 15 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });

      // Sort cards by centreOrder: index 2 (order 0) first, indices 1 & 3 (order 1) next, 0 & 4 (order 2) last
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      cards.forEach((card) => {
        gsap.set(card, { clipPath: "inset(100% 0 0 0)", y: 80, opacity: 0 });
      });

      const enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      enterTl
        .to(
          eyebrow,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          0
        )
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.1
        );

      // Staggered centre-outward entrance
      // Order 0 (middle card): delay 0.25s
      const midCard = cards[2];
      if (midCard) {
        enterTl.to(
          midCard,
          {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out",
          },
          0.25
        );
      }

      // Order 1 (cards 1 and 3): delay 0.35s
      const ring1 = [cards[1], cards[3]].filter(Boolean);
      if (ring1.length) {
        enterTl.to(
          ring1,
          {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out",
          },
          0.35
        );
      }

      // Order 2 (cards 0 and 4): delay 0.45s
      const ring2 = [cards[0], cards[4]].filter(Boolean);
      if (ring2.length) {
        enterTl.to(
          ring2,
          {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power4.out",
          },
          0.45
        );
      }

      // Row drift left on scroll
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(row, {
          x: "-6vw",
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      failsafeId = window.setTimeout(() => {
        if (enterTl.progress() < 1) enterTl.progress(1);
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
      id="approach-recap"
      zIndex={7}
      background="#E8DECE"
      theme="light"
      panelRef={panelRef}
      className="panel-a7"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#E8DECE] p-6 pt-10 pb-6 lg:p-14 lg:pb-8 xl:p-18">
        {/* Header Block */}
        <div className="relative z-10 max-w-2xl">
          <p
            ref={eyebrowRef}
            className="mb-2 font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase"
          >
            FIVE STEPS
          </p>
          <h2
            ref={titleRef}
            className="font-serif text-[clamp(2.2rem,4.4vw,4.8rem)] leading-[1.08] text-[#2C382A] tracking-[-0.02em]"
          >
            One conversation, from start to finish.
          </h2>
        </div>

        {/* Row of five portrait frames, different heights, middle tallest, bottom-aligned */}
        <div className="filmstrip-group relative z-20 flex w-full items-end justify-center overflow-x-auto pb-2 scrollbar-none lg:overflow-visible">
          <div
            ref={rowRef}
            className="flex items-end gap-3 sm:gap-4 md:gap-6 lg:gap-8 min-w-max lg:min-w-0"
          >
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={`filmstrip-card group relative flex flex-col justify-end transition-all duration-500 ease-out hover:-translate-y-3 cursor-pointer ${step.heightClass} w-[220px] sm:w-[240px] md:w-[260px] lg:w-[220px] xl:w-[250px]`}
              >
                {/* Image card with subtle border */}
                <div className="relative h-full w-full overflow-hidden rounded-sm border border-[rgba(44,56,42,0.18)] bg-[#AD9680] shadow-[0_12px_30px_rgba(44,56,42,0.08)]">
                  <ApproachPhoto
                    id={step.id}
                    className="h-full w-full"
                    imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle bottom gradient for label contrast */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1B211A]/80 via-[#1B211A]/30 to-transparent" />

                  {/* Corner step number */}
                  <span className="absolute top-3 left-3 z-10 rounded-full bg-[#E8DECE]/90 px-2.5 py-0.5 font-sans text-[11px] font-semibold tracking-wider text-[#2C382A]">
                    {step.num}
                  </span>

                  {/* Two-word label at bottom */}
                  <div className="absolute inset-x-0 bottom-3 z-10 px-4 text-left">
                    <p className="font-sans text-xs font-medium tracking-[0.14em] text-[#E8DECE] uppercase">
                      {step.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

