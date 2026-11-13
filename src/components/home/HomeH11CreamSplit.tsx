import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { splitText } from "@/motion/splitText";
import { magnetic } from "@/motion/helpers";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * H11 CREAM SPLIT, THEN GIANT TITLE.
 * First: left half linen with serif paragraph rising by lines:
 * "MERES brings design, construction and cabinet-making into the same conversation."
 * Right half: tall exterior L1 wiping in from top.
 * Then forest-to-teal gradient panel wipes up over it with decorative material close-up M7
 * on right edge, giant serif "Services" on left (14vw, characters rising),
 * tiny label "WHAT WE DO", linking to /services with magnetic circle arrow.
 */
export function HomeH11CreamSplit() {
  const panelRef = useRef<HTMLElement>(null);
  const leftParaRef = useRef<HTMLHeadingElement>(null);
  const rightWipeRef = useRef<HTMLDivElement>(null);
  const overlayPanelRef = useRef<HTMLDivElement>(null);
  const servicesTitleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const leftPara = leftParaRef.current;
    const rightWipe = rightWipeRef.current;
    const overlayPanel = overlayPanelRef.current;
    const servicesTitle = servicesTitleRef.current;
    const button = buttonRef.current;
    if (!panel || !leftPara || !rightWipe || !overlayPanel || !servicesTitle || !button)
      return;

    const cleanupMagnetic = magnetic(button);

    if (prefersReducedMotion()) return () => cleanupMagnetic();

    let failsafeId: number | undefined;
    const splitPara = splitText(leftPara, { lines: true });
    const splitTitle = splitText(servicesTitle, { chars: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(splitPara.lines, { yPercent: 110, opacity: 0 });
      gsap.set(rightWipe, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(overlayPanel, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(splitTitle.chars, { yPercent: 110, opacity: 0 });
      gsap.set(button, { scale: 0.85, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Initial split entrance
      tl.to(
        rightWipe,
        {
          clipPath: "inset(0% 0 0% 0)",
          duration: 0.9,
          ease: "power4.out",
        },
        0
      )
        .to(
          splitPara.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.15
        )
        // 2. Then forest overlay wipes up over it
        .to(
          overlayPanel,
          {
            clipPath: "inset(0% 0 0% 0)",
            duration: 1.1,
            ease: "power4.inOut",
          },
          1.2
        )
        // 3. Services characters rise
        .to(
          splitTitle.chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.04,
            ease: "power3.out",
          },
          1.6
        )
        .to(
          button,
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(1.5)",
          },
          1.9
        );

      failsafeId = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      cleanupMagnetic();
      ctx.revert();
      splitPara.revert();
      splitTitle.revert();
    };
  }, []);

  return (
    <Panel
      id="home-h11-cream-split"
      zIndex={11}
      background="#E8DECE"
      theme="light"
      panelRef={panelRef}
      className="panel-h11"
    >
      <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[#E8DECE]">
        {/* State 1: Cream split */}
        <div className="relative flex h-full min-h-[100svh] w-full flex-col lg:flex-row">
          {/* Left half: Linen with rising serif paragraph */}
          <div className="flex h-[50svh] w-full flex-col justify-center p-6 lg:h-full lg:w-1/2 lg:p-16 xl:p-24">
            <span className="mb-4 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
              Integrated Practice
            </span>
            <h2
              ref={leftParaRef}
              className="font-serif text-[clamp(2.1rem,4.2vw,4.4rem)] leading-[1.12] text-[#2C382A]"
            >
              MERES brings design, construction and cabinet-making into the same conversation.
            </h2>
          </div>

          {/* Right half: Tall exterior L1 wiping from top */}
          <div className="relative h-[50svh] w-full overflow-hidden lg:h-full lg:w-1/2">
            <div
              ref={rightWipeRef}
              className="h-full w-full overflow-hidden bg-[#AD9680]"
            >
              <HomePhoto id="L1" className="h-full w-full" imgClassName="object-cover" />
            </div>
          </div>
        </div>

        {/* State 2: Forest overlay with giant "Services" and M7 strip */}
        <div
          ref={overlayPanelRef}
          className="absolute inset-0 z-20 flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2C382A] via-[#223326] to-[#15241b] p-6 lg:flex-row lg:items-center lg:p-16 xl:p-24"
        >
          {/* Left content: "Services" */}
          <div className="relative z-10 max-w-2xl pt-12 lg:pt-0">
            <span className="mb-3 block font-sans text-xs font-semibold tracking-[0.3em] text-[#AD9680] uppercase">
              WHAT WE DO
            </span>
            <h2
              ref={servicesTitleRef}
              className="font-serif text-[clamp(4.5rem,14vw,14rem)] leading-[0.88] text-[#E8DECE] tracking-[-0.04em] select-none"
            >
              Services
            </h2>
            <div className="mt-8">
              <Link
                ref={buttonRef}
                to="/services"
                aria-label="Explore our services"
                className="group inline-flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(232,222,206,0.3)] bg-[#E8DECE] text-[#2C382A] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#F4EFE6] lg:h-20 lg:w-20"
              >
                <svg
                  className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right edge: Decorative material close-up M7 */}
          <div className="relative z-10 hidden h-[68svh] w-[32vw] max-w-[380px] overflow-hidden rounded-sm border border-[rgba(232,222,206,0.18)] bg-[#AD9680] shadow-2xl lg:block">
            <HomePhoto id="M7" className="h-full w-full" imgClassName="object-cover" />
          </div>
        </div>
      </div>
    </Panel>
  );
}

