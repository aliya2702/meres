import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { ApproachPhoto } from "./ApproachPhoto";
import { prefersReducedMotion } from "@/motion/tokens";

const CYCLES = [
  {
    id: "P2",
    tag: "Planning",
    line: "Your project manager is your first call.",
    sub: "Direct communication with one dedicated director who oversees every trade.",
  },
  {
    id: "P3",
    tag: "Decisions",
    line: "A clear plan for each decision.",
    sub: "Material selections and finish approvals presented ahead of schedule.",
  },
  {
    id: "P4",
    tag: "Support",
    line: "One person who knows the whole picture.",
    sub: "From architectural drawings to structural millwork, completely aligned.",
  },
];

/**
 * A4 STEP 3 "Know who to turn to." (layered frame cycle on cream).
 * Linen background. Upper-centre stack of 3 overlapping frames offset diagonally 24px up-right.
 * 3 images cycle every 2.6s (dissolve + translate crossfade 0.9s).
 * Title below-left masked line swap:
 * 1) "Your project manager is your first call."
 * 2) "A clear plan for each decision."
 * 3) "One person who knows the whole picture."
 * Tiny caption at frame corner: "Planning", "Decisions", "Support".
 */
export function ApproachA4Step3() {
  const panelRef = useRef<HTMLElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    const numeral = numeralRef.current;
    if (!panel || !numeral) return;

    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      gsap.set(numeral, { opacity: 0, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          onEnter: () => {
            setIsVisible(true);
            numeral.classList.add("numeral-filled");
          },
          onLeaveBack: () => {
            setIsVisible(false);
            numeral.classList.remove("numeral-filled");
          },
        },
      });

      tl.to(numeral, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      });

      failsafeId = window.setTimeout(() => {
        setIsVisible(true);
        numeral.classList.add("numeral-filled");
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
    };
  }, []);

  // 2.6s cycle timer when visible
  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CYCLES.length);
    }, 2600);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Masked line swap animation on activeIndex change
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = titleWrapperRef.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll("[data-swap-line]"),
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.05 }
    );
  }, [activeIndex]);

  const current = CYCLES[activeIndex];

  return (
    <Panel
      id="approach-step-3"
      zIndex={4}
      background="#E8DECE"
      theme="light"
      panelRef={panelRef}
      className="panel-a4"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[#E8DECE] p-6 lg:p-14 xl:p-20">
        {/* Step corner counter */}
        <div className="absolute top-6 right-6 z-30 font-sans text-xs tracking-[0.25em] text-[#2C382A]/70 lg:top-10 lg:right-12">
          03 / 05
        </div>

        {/* Giant outlined 03 numeral */}
        <div
          ref={numeralRef}
          aria-hidden="true"
          className="giant-numeral giant-numeral-light absolute top-[8vh] left-[4vw] z-0 pointer-events-none"
        >
          03
        </div>

        {/* Upper centre: Stack of 3 overlapping frames offset diagonally 24px */}
        <div className="relative z-10 flex flex-1 items-center justify-center pt-8 pb-4">
          <div className="relative h-[42svh] w-[88vw] max-w-[560px] lg:h-[48svh]">
            {CYCLES.map((item, idx) => {
              // Position relative to activeIndex (0 = front, 1 = middle, 2 = back)
              const offset = (idx - activeIndex + CYCLES.length) % CYCLES.length;
              let styleObj: React.CSSProperties = {};

              if (offset === 0) {
                // Front card: sharp, fully opaque, on top
                styleObj = {
                  transform: "translate3d(0, 0, 0) scale(1)",
                  opacity: 1,
                  zIndex: 30,
                  transition: "all 0.9s cubic-bezier(0.25, 1, 0.5, 1)",
                };
              } else if (offset === 1) {
                // Middle card: 60% opacity, shifted +24px x, -24px y
                styleObj = {
                  transform: "translate3d(24px, -24px, 0) scale(0.96)",
                  opacity: 0.6,
                  zIndex: 20,
                  transition: "all 0.9s cubic-bezier(0.25, 1, 0.5, 1)",
                };
              } else {
                // Back card: 35% opacity, shifted +48px x, -48px y
                styleObj = {
                  transform: "translate3d(48px, -48px, 0) scale(0.92)",
                  opacity: 0.35,
                  zIndex: 10,
                  transition: "all 0.9s cubic-bezier(0.25, 1, 0.5, 1)",
                };
              }

              return (
                <div
                  key={item.id}
                  style={styleObj}
                  className="absolute inset-0 rounded-sm border border-[rgba(44,56,42,0.15)] bg-[#E8DECE] shadow-[0_20px_50px_rgba(44,56,42,0.14)] overflow-hidden"
                >
                  <ApproachPhoto
                    id={item.id}
                    className="h-full w-full"
                    imgClassName="object-cover"
                  />
                  {/* Corner caption */}
                  <span className="absolute top-4 left-4 z-20 rounded-full bg-[#E8DECE]/90 px-3 py-1 font-sans text-[11px] font-medium tracking-wider text-[#2C382A] uppercase backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Below-left: Masked line swap title */}
        <div className="relative z-20 max-w-2xl pt-4">
          <span className="mb-2 block font-sans text-xs font-medium tracking-[0.2em] text-[#AD9680] uppercase">
            Step 03 &mdash; Accountability
          </span>
          <div ref={titleWrapperRef} className="overflow-hidden">
            <h2
              data-swap-line
              className="font-serif text-[clamp(2.1rem,4.4vw,4.5rem)] leading-[1.08] text-[#2C382A] tracking-[-0.02em]"
            >
              {current.line}
            </h2>
            <p
              data-swap-line
              className="mt-3 font-sans text-[clamp(1rem,1.2vw,1.2rem)] text-[#2C382A]/80"
            >
              {current.sub}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

