import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { ServicesPhoto } from "./ServicesPhoto";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * V8 INTERIOR SPLIT (fix of the empty grey box).
 * Linen left 42%, right 58% full-height image D2 (opaque, wiping up from bottom; fallback taupe block, never grey).
 * Title right-aligned on left half, on two balanced lines:
 * "Cabinetry" / "made with care" with 1px vertical hairline at its right.
 * Caption bottom-left: "A cabinet should feel right when you reach into it."
 * The right image changes to K3 every 3s (upward wipe, 0.9s) while visible.
 */
export function ServicesV8InteriorSplit() {
  const panelRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);
  const wipeLayerRef = useRef<HTMLDivElement>(null);

  const [activeRightId, setActiveRightId] = useState<"D2" | "K3">("D2");
  const [isVisible, setIsVisible] = useState(false);

  // Monitor visibility for interval cycling
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const st = ScrollTrigger.create({
      trigger: panel,
      start: "top 90%",
      end: "bottom 10%",
      onEnter: () => setIsVisible(true),
      onEnterBack: () => setIsVisible(true),
      onLeave: () => setIsVisible(false),
      onLeaveBack: () => setIsVisible(false),
    });

    return () => st.kill();
  }, []);

  // Interval image swap every 3s while visible with upward wipe (0.9s)
  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;

    const interval = setInterval(() => {
      const wipeLayer = wipeLayerRef.current;
      const nextId = activeRightId === "D2" ? "K3" : "D2";

      if (wipeLayer) {
        gsap.fromTo(
          wipeLayer,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.9,
            ease: "power3.inOut",
            onComplete: () => {
              setActiveRightId(nextId);
              gsap.set(wipeLayer, { clipPath: "inset(100% 0 0 0)" });
            },
          }
        );
      } else {
        setActiveRightId(nextId);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, activeRightId]);

  useEffect(() => {
    const panel = panelRef.current;
    const title = titleRef.current;
    const caption = captionRef.current;
    const rightContainer = rightContainerRef.current;

    if (!panel || !title || !caption || !rightContainer) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(rightContainer, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(title, { y: 30, opacity: 0 });
      gsap.set(caption, { y: 20, opacity: 0 });

      // Entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        rightContainer,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power4.out",
        },
        0
      );

      tl.to(
        title,
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        0.2
      );

      tl.to(
        caption,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.4
      );

      failsafeId = window.setTimeout(() => {
        gsap.set(rightContainer, { clipPath: "inset(0% 0 0 0)" });
        gsap.set(title, { y: 0, opacity: 1 });
        gsap.set(caption, { y: 0, opacity: 1 });
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
    };
  }, []);

  const nextSwapId = activeRightId === "D2" ? "K3" : "D2";

  return (
    <Panel
      panelRef={panelRef}
      zIndex={8}
      theme="light"
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#E8DECE]"
    >
      <div className="flex h-full w-full flex-col lg:flex-row">
        {/* Left 42%: Linen panel with 96px header clearance */}
        <div className="relative flex h-1/2 w-full flex-col justify-between p-6 pt-24 sm:p-10 sm:pt-28 md:p-14 lg:h-full lg:w-[42%] lg:p-16 lg:pt-32">
          {/* Title right-aligned on two balanced lines with 1px vertical hairline */}
          <div className="flex items-start justify-end gap-5">
            <h2
              ref={titleRef}
              className="font-serif text-[clamp(2.2rem,4vw,4.2rem)] leading-[1.04] tracking-[-0.02em] text-[#2C382A] text-right"
            >
              <span>Cabinetry</span>
              <br />
              <span>made with care</span>
            </h2>
            <div
              className="mt-1 h-16 w-[1px] bg-[#2C382A]/35 shrink-0"
              aria-hidden="true"
            />
          </div>

          {/* Caption bottom-left */}
          <div className="mt-6">
            <p
              ref={captionRef}
              className="max-w-sm font-sans text-[clamp(1.05rem,1.3vw,1.35rem)] leading-relaxed text-[#2C382A]/85"
            >
              A cabinet should feel right when you reach into it.
            </p>
          </div>
        </div>

        {/* Right 58%: Full-height image wiping up from bottom, never grey (taupe fallback #AD9680) */}
        <div
          ref={rightContainerRef}
          className="relative h-1/2 w-full overflow-hidden bg-[#AD9680] lg:h-full lg:w-[58%]"
        >
          {/* Base active image */}
          <div className="absolute inset-0 h-full w-full">
            <ServicesPhoto
              id={activeRightId}
              className="h-full w-full"
              imgClassName="object-cover object-center"
              showConceptChip={activeRightId === "K3"}
            />
          </div>

          {/* Upward wipe overlay layer for 3s interval swap */}
          <div
            ref={wipeLayerRef}
            className="absolute inset-0 z-20 h-full w-full overflow-hidden"
            style={{ clipPath: "inset(100% 0 0 0)" }}
          >
            <ServicesPhoto
              id={nextSwapId}
              className="h-full w-full"
              imgClassName="object-cover object-center"
              showConceptChip={nextSwapId === "K3"}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
