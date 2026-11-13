import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { splitText } from "@/motion/splitText";
import { magnetic } from "@/motion/helpers";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * H15 CLOSING.
 * Forest-to-teal gradient with drifting blobs.
 * Left: tall framed image M8 wiping up.
 * Right: giant serif "What should feel different when you come home?" in four short lines,
 * then "Start with that." and magnetic circular-arrow CTA "Tell us what matters"
 * linking to /contact#project-inquiry.
 */
export function HomeH15Closing() {
  const panelRef = useRef<HTMLElement>(null);
  const leftImgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const leftImg = leftImgRef.current;
    const title = titleRef.current;
    const sub = subRef.current;
    const button = buttonRef.current;
    if (!panel || !leftImg || !title || !sub || !button) return;

    const cleanupMagnetic = magnetic(button);

    if (prefersReducedMotion()) return () => cleanupMagnetic();

    let failsafeId: number | undefined;
    const split = splitText(title, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(leftImg, { clipPath: "inset(100% 0 0 0)", y: 50 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(sub, { opacity: 0, y: 15 });
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
          sub,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0.45
        )
        .to(
          button,
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.5)",
          },
          0.6
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
      id="home-h15-closing"
      zIndex={15}
      background="#142017"
      theme="dark"
      panelRef={panelRef}
      className="panel-h15"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#243527] via-[#1a291e] to-[#121e16] p-6 lg:flex-row lg:items-center lg:p-16 xl:p-24">
        {/* Soft drifting ambient glow blobs */}
        <div
          aria-hidden="true"
          className="home-blob-anim pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[#3f5742]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="home-blob-anim pointer-events-none absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#1e4438]/25 blur-3xl"
        />

        {/* Left: tall framed image M8 wiping up */}
        <div className="relative z-10 hidden h-[68svh] w-[32vw] max-w-[400px] lg:block">
          <div
            ref={leftImgRef}
            className="h-full w-full overflow-hidden rounded-sm border border-[rgba(232,222,206,0.18)] bg-[#AD9680] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          >
            <HomePhoto
              id="M8"
              className="h-full w-full"
              imgClassName="object-cover"
            />
            <span className="concept-chip absolute bottom-3 left-3 z-10">
              Handcrafted Terracotta Zellige
            </span>
          </div>
        </div>

        {/* Right: Giant serif four lines + "Start with that." + magnetic CTA button */}
        <div className="relative z-20 flex flex-1 flex-col items-start pt-12 text-left lg:items-end lg:pt-0 lg:text-right">
          <span className="mb-4 inline-block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
            The First Step
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-[clamp(2.5rem,5.8vw,6.4rem)] leading-[1.02] text-[#E8DECE] tracking-[-0.03em]"
          >
            What should <br />
            feel different <br />
            when you come <br />
            home?
          </h2>

          <p
            ref={subRef}
            className="mt-6 font-serif text-2xl text-[#AD9680] italic lg:text-3xl"
          >
            Start with that.
          </p>

          {/* Magnetic CTA button: "Tell us what matters" */}
          <div className="mt-8 lg:mt-12">
            <Link
              ref={buttonRef}
              to="/contact#project-inquiry"
              className="group inline-flex items-center gap-4 rounded-full border border-[rgba(232,222,206,0.4)] bg-[#E8DECE] px-7 py-4 text-[#2C382A] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#F2ECE1]"
            >
              <span className="font-sans text-xs font-semibold tracking-wider uppercase">
                Tell us what matters
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2C382A] text-[#E8DECE] transition-transform duration-300 group-hover:translate-x-1">
                <svg
                  className="h-4 w-4"
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
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Panel>
  );
}

