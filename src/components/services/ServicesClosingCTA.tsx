import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { magnetic } from "@/motion/helpers";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * V14 CLOSING BLOCK.
 * Full 100svh forest-to-teal gradient panel with drifting blobs.
 * Serif headline centred "Ready when you are." (characters rise).
 * Magnetic CTA "Tell us what matters" to /contact#project-inquiry below it.
 * Small text link "See how we work" to /approach.
 * (No repeated footer copy here).
 */
export function ServicesClosingCTA({ zIndex = 14 }: { zIndex?: number }) {
  const panelRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const approachLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    const headline = headlineRef.current;
    const button = buttonRef.current;
    const approachLink = approachLinkRef.current;

    if (!el || !headline || !button || !approachLink) return;

    const cleanupMagnetic = magnetic(button);

    if (prefersReducedMotion()) return () => cleanupMagnetic();

    let failsafeId: number | undefined;
    const split = splitText(headline, { chars: true });

    const ctx = gsap.context(() => {
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
      gsap.set(button, { scale: 0.9, opacity: 0 });
      gsap.set(approachLink, { y: 20, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        split.chars,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.02,
          ease: "power3.out",
        },
        0
      );

      tl.to(
        button,
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.4)",
        },
        0.3
      );

      tl.to(
        approachLink,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.5
      );

      failsafeId = window.setTimeout(() => {
        gsap.set(split.chars, { yPercent: 0, opacity: 1 });
        gsap.set([button, approachLink], { opacity: 1, y: 0, scale: 1 });
      }, 3000);
    }, el);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      cleanupMagnetic();
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <Panel
      panelRef={panelRef}
      zIndex={zIndex}
      theme="dark"
      className="relative flex h-[100svh] min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center sm:px-10"
      style={{
        background:
          "linear-gradient(135deg, #2C382A 0%, #1D332B 55%, #182B24 100%)",
      }}
    >
      {/* Soft drifting background radial ambient blobs */}
      <div
        className="services-blob pointer-events-none absolute -left-[10vw] -top-[10vh] h-[55vw] w-[55vw] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #AD9680 0%, rgba(173,150,128,0) 70%)",
        }}
      />
      <div
        className="services-blob pointer-events-none absolute -bottom-[10vh] right-[10vw] h-[50vw] w-[50vw] rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #E8DECE 0%, rgba(232,222,206,0) 70%)",
          animationDelay: "-6s",
        }}
      />

      {/* Main Closing Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <span className="mb-5 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
          Start the conversation
        </span>

        {/* Serif headline "Ready when you are." */}
        <h2
          ref={headlineRef}
          className="font-serif text-[clamp(2.8rem,6.5vw,6.5rem)] font-normal leading-[1.05] tracking-[-0.03em] text-[#E8DECE]"
        >
          Ready when you are.
        </h2>

        {/* Magnetic CTA "Tell us what matters" to /contact#project-inquiry */}
        <div className="mt-10 md:mt-14">
          <Link
            ref={buttonRef}
            to="/contact#project-inquiry"
            className="group relative inline-flex items-center justify-center gap-3 rounded-full border border-[rgba(232,222,206,0.35)] bg-[#E8DECE] px-8 py-4 font-sans text-sm font-semibold tracking-wide text-[#2C382A] shadow-xl transition-all duration-300 hover:border-[#E8DECE] hover:bg-[#F2ECE1] hover:scale-105"
          >
            <span>Tell us what matters</span>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>

        {/* Small text link "See how we work" to /approach */}
        <div className="mt-8">
          <Link
            ref={approachLinkRef}
            to="/approach"
            className="font-sans text-sm font-medium tracking-wider text-[#AD9680] transition-colors hover:text-[#E8DECE] hover:underline hover:underline-offset-4"
          >
            See how we work &rarr;
          </Link>
        </div>
      </div>
    </Panel>
  );
}
