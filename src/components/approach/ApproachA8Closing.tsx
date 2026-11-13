import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { ApproachPhoto } from "./ApproachPhoto";
import { splitText } from "@/motion/splitText";
import { magnetic } from "@/motion/helpers";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * A8 CLOSING.
 * Full-bleed forest-to-teal gradient with soft drifting blobs and tall framed image (M4)
 * at left wiping up from the bottom. Giant right-aligned serif "Begin where you are." (two lines)
 * and magnetic circular-arrow button linking to /contact#project-inquiry.
 */
export function ApproachA8Closing() {
  const panelRef = useRef<HTMLElement>(null);
  const leftImgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const leftImg = leftImgRef.current;
    const title = titleRef.current;
    const button = buttonRef.current;
    if (!panel || !leftImg || !title || !button) return;

    // Attach magnetic effect to CTA button
    const cleanupMagnetic = magnetic(button);

    if (prefersReducedMotion()) return () => cleanupMagnetic();

    let failsafeId: number | undefined;
    const split = splitText(title, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(leftImg, { clipPath: "inset(100% 0 0 0)", y: 60 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(button, { scale: 0.85, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        leftImg,
        {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          duration: 1.1,
          ease: "power4.out",
        },
        0
      )
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.2
        )
        .to(
          button,
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.5)",
          },
          0.45
        );

      failsafeId = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      cleanupMagnetic();
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <Panel
      id="approach-closing"
      zIndex={8}
      background="#1B241C"
      theme="dark"
      panelRef={panelRef}
      className="panel-a8"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2C382A] via-[#1f3026] to-[#14231b] p-6 lg:flex-row lg:items-center lg:p-16 xl:p-24">
        {/* Soft drifting ambient glow blobs */}
        <div
          aria-hidden="true"
          className="approach-blob-anim pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[#3f5742]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="approach-blob-anim pointer-events-none absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#1e4438]/25 blur-3xl"
        />

        {/* Tall framed image (M4) at left wiping up from bottom */}
        <div className="relative z-10 hidden h-[68svh] w-[32vw] max-w-[420px] lg:block">
          <div
            ref={leftImgRef}
            className="h-full w-full overflow-hidden rounded-sm border border-[rgba(232,222,206,0.18)] bg-[#AD9680] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          >
            <ApproachPhoto
              id="M4"
              className="h-full w-full"
              imgClassName="object-cover"
            />
            <span className="concept-chip absolute bottom-3 left-3 z-10">
              Travertine Stone Reference
            </span>
          </div>
        </div>

        {/* Right-aligned giant title + magnetic circular-arrow button */}
        <div className="relative z-20 flex flex-1 flex-col items-start pt-16 text-left lg:items-end lg:pt-0 lg:text-right">
          <span className="mb-4 inline-block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
            Start the conversation
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-[clamp(3rem,6.8vw,7.2rem)] leading-[0.98] text-[#E8DECE] tracking-[-0.03em]"
          >
            Begin where{" "}
            <br className="hidden sm:inline" />
            you are.
          </h2>

          <p className="mt-6 max-w-md font-sans text-[clamp(1rem,1.2vw,1.2rem)] leading-relaxed text-[#E8DECE]/80 lg:text-right">
            Every home begins with an honest discussion about how you want to live.
          </p>

          {/* Magnetic circular button */}
          <div className="mt-8 lg:mt-12">
            <Link
              ref={buttonRef}
              to="/contact#project-inquiry"
              aria-label="Begin your project inquiry"
              className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(232,222,206,0.4)] bg-[#E8DECE] text-[#2C382A] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#F2ECE1] lg:h-24 lg:w-24"
            >
              {/* Arrow SVG */}
              <svg
                className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </Panel>
  );
}
