import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

const SLIDES = [
  { id: "D2", label: "Dining room & morning light" },
  { id: "K2", label: "Walnut cabinetry & quiet balance" },
  { id: "B2", label: "Stone bathing suite & oak accents" },
];

/**
 * H6 INSET SLIDER ON GRADIENT.
 * Deep forest-to-green gradient.
 * Top-left: two serif lines "Rooms that feel like they were always yours."
 * Large framed landscape image slider (cols 1-6) with prev/next circular arrows underneath
 * and caption right of it ("Light, warmth, proportion.").
 * Three slides (D2, K2, B2): new slide wipes from right while old slides left 20% (0.9s power4.inOut).
 * Auto-advances every 3.5s while visible.
 * Second image strip (M3) peeks 12% from below.
 * Mouse parallax: slider moves 8px opposite pointer.
 */
export function HomeH6Slider() {
  const panelRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sliderBoxRef = useRef<HTMLDivElement>(null);
  const bottomStripRef = useRef<HTMLDivElement>(null);
  const slideLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const goToSlide = useCallback((nextIdx: number) => {
    setCurrentIdx((prev) => {
      const target = (nextIdx + SLIDES.length) % SLIDES.length;
      if (target === prev) return prev;

      if (!prefersReducedMotion()) {
        const currentEl = slideLayersRef.current[prev];
        const nextEl = slideLayersRef.current[target];

        if (currentEl && nextEl) {
          gsap.killTweensOf([currentEl, nextEl]);
          gsap.set(nextEl, { clipPath: "inset(0 0 0 100%)", xPercent: 0, zIndex: 10 });
          gsap.set(currentEl, { zIndex: 5 });

          gsap.to(nextEl, {
            clipPath: "inset(0 0 0 0%)",
            duration: 0.9,
            ease: "power4.inOut",
          });
          gsap.to(currentEl, {
            xPercent: -20,
            duration: 0.9,
            ease: "power4.inOut",
            onComplete: () => {
              gsap.set(currentEl, { xPercent: 0, clipPath: "inset(0 0 0 100%)" });
            },
          });
        }
      }

      return target;
    });
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    const title = titleRef.current;
    const sliderBox = sliderBoxRef.current;
    const bottomStrip = bottomStripRef.current;
    if (!panel || !title || !sliderBox || !bottomStrip) return;

    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    let failsafeId: number | undefined;
    const split = splitText(title, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(sliderBox, { opacity: 0, y: 50 });
      gsap.set(bottomStrip, { yPercent: 100 });

      // Init slides
      slideLayersRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          clipPath: i === 0 ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)",
          zIndex: i === 0 ? 10 : 0,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          onEnter: () => {
            setIsVisible(true);
            tl.play();
          },
          onLeaveBack: () => {
            setIsVisible(false);
          },
        },
      });

      tl.to(
        split.lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
        },
        0
      )
        .to(
          sliderBox,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power4.out",
          },
          0.2
        )
        .to(
          bottomStrip,
          {
            yPercent: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          0.35
        );

      // Mouse parallax: slider moves 8px opposite pointer
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const xTo = gsap.quickTo(sliderBox, "x", { duration: 0.5, ease: "power2.out" });
        const yTo = gsap.quickTo(sliderBox, "y", { duration: 0.5, ease: "power2.out" });

        const handlePointer = (e: PointerEvent) => {
          const rect = panel.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);
          xTo(-dx * 8);
          yTo(-dy * 8);
        };

        window.addEventListener("pointermove", handlePointer);
        return () => window.removeEventListener("pointermove", handlePointer);
      });

      failsafeId = window.setTimeout(() => {
        setIsVisible(true);
        if (tl.progress() < 1) tl.progress(1);
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
      split.revert();
    };
  }, []);

  // Auto-advance every 3.5s while visible
  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;

    const timer = setInterval(() => {
      goToSlide(currentIdx + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, [isVisible, currentIdx, goToSlide]);

  return (
    <Panel
      id="home-h6-slider"
      zIndex={6}
      background="#1e2e22"
      theme="dark"
      panelRef={panelRef}
      className="panel-h6"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#243526] via-[#1c2b20] to-[#142017] p-6 lg:p-14 xl:p-20">
        {/* Top-left: two serif lines */}
        <div className="relative z-20 max-w-2xl pt-2 lg:pt-4">
          <span className="mb-3 block font-sans text-xs font-medium tracking-[0.22em] text-[#AD9680] uppercase">
            Living Architecture
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-[clamp(2.2rem,4.5vw,4.8rem)] leading-[1.08] text-[#E8DECE] tracking-[-0.02em]"
          >
            Rooms that feel like they were always yours.
          </h2>
        </div>

        {/* Slider & Caption Area */}
        <div className="relative z-20 my-auto flex flex-col items-start gap-8 lg:flex-row lg:items-center">
          {/* Framed slider box */}
          <div ref={sliderBoxRef} className="w-full max-w-[620px] lg:w-[48vw]">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-[rgba(232,222,206,0.18)] bg-[#AD9680] shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
              {SLIDES.map((slide, i) => (
                <div
                  key={slide.id}
                  ref={(el) => {
                    slideLayersRef.current[i] = el;
                  }}
                  className="absolute inset-0 h-full w-full will-change-transform"
                >
                  <HomePhoto
                    id={slide.id}
                    className="h-full w-full"
                    imgClassName="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Prev/Next Controls + Indicator */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goToSlide(currentIdx - 1)}
                  aria-label="Previous slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(232,222,206,0.3)] bg-[#2C382A]/70 text-[#E8DECE] transition-all hover:bg-[#E8DECE] hover:text-[#2C382A]"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={() => goToSlide(currentIdx + 1)}
                  aria-label="Next slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(232,222,206,0.3)] bg-[#2C382A]/70 text-[#E8DECE] transition-all hover:bg-[#E8DECE] hover:text-[#2C382A]"
                >
                  &rarr;
                </button>
              </div>

              <span className="font-sans text-xs tracking-widest text-[#E8DECE]/70">
                0{currentIdx + 1} / 0{SLIDES.length}
              </span>
            </div>
          </div>

          {/* Caption to the right of slider */}
          <div className="max-w-xs">
            <p className="font-serif text-2xl text-[#E8DECE] italic">
              Light, warmth, proportion.
            </p>
            <p className="mt-2 font-sans text-xs tracking-wider text-[#AD9680] uppercase">
              {SLIDES[currentIdx].label}
            </p>
          </div>
        </div>

        {/* Second image strip M3 peeking 12% at the bottom edge */}
        <div
          ref={bottomStripRef}
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 z-10 h-[12%] w-full overflow-hidden border-t border-[rgba(232,222,206,0.12)]"
        >
          <HomePhoto
            id="M3"
            className="h-full w-full opacity-60"
            imgClassName="object-cover"
          />
        </div>
      </div>
    </Panel>
  );
}

