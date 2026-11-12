import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "../StackSection";
import { AboutPhoto } from "./AboutPhoto";
import { splitText } from "../../motion/splitText";
import { scrollToTarget } from "../../motion/smooth";
import { prefersReducedMotion } from "../../motion/tokens";

/**
 * AB1 — Hero panel.
 * Full-bleed twilight residence (E1) scaling softly 1.15 -> 1 on load,
 * monumental serif title "About" rising letter-by-letter bottom-left,
 * eyebrow above, and bobbing down-arrow cue bottom-right.
 */
export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const eyebrow = eyebrowRef.current;
    const title = titleRef.current;
    const cue = cueRef.current;
    if (!section || !bg || !eyebrow || !title || !cue) return;

    if (prefersReducedMotion()) return;

    const split = splitText(title, { chars: true, lines: true });
    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      gsap.set(bg, { scale: 1.15, transformOrigin: "50% 50%" });
      gsap.set(eyebrow, { opacity: 0, y: 18 });
      gsap.set(cue, { opacity: 0, y: 14 });
      gsap.set(split.chars, { y: "110%", opacity: 0 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(bg, { scale: 1, duration: 1.6, ease: "expo.out" }, 0)
        .to(
          split.chars,
          {
            y: "0%",
            opacity: 1,
            duration: 0.9,
            stagger: 0.045,
            ease: "power3.out",
          },
          0.18
        )
        .to(
          eyebrow,
          { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
          0.42
        )
        .to(
          cue,
          { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
          0.56
        );

      failsafeId = window.setTimeout(() => {
        if (tl.progress() < 1) {
          tl.progress(1);
        }
      }, 3000);
    }, section);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <Panel
      id="about-hero"
      zIndex={1}
      background="var(--forest)"
      theme="dark"
      panelRef={sectionRef}
    >
      <div
        data-panel-content
        className="relative flex h-full min-h-[100svh] w-full flex-col justify-end overflow-hidden"
      >
        <div ref={bgRef} className="absolute inset-0">
          <AboutPhoto id="E1" className="h-full w-full" />
        </div>

        {/* 45%+ bottom-left ink scrim keeping display typography effortlessly legible */}
        <div
          aria-hidden="true"
          className="about-scrim-bl pointer-events-none absolute inset-0 z-10"
        />

        <div className="relative z-20 flex w-full items-end justify-between px-6 pb-10 pt-28 sm:px-10 sm:pb-12 lg:px-16 lg:pb-14">
          <div className="max-w-full">
            <p
              ref={eyebrowRef}
              className="mb-3 font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--taupe)] sm:text-xs"
            >
              CRAFT AND CARE, INTERTWINED
            </p>
            <h1
              ref={titleRef}
              className="font-serif font-normal leading-[0.94] tracking-[-0.025em] text-[var(--linen)]"
              style={{ fontSize: "clamp(4rem, 11.5vw, 9.5rem)" }}
            >
              About
            </h1>
          </div>

          <button
            ref={cueRef}
            type="button"
            onClick={() => scrollToTarget("#about-story", { offset: 0, duration: 1.3 })}
            aria-label="Scroll to next section"
            className="about-arrow-bob group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(232,222,206,0.4)] bg-[rgba(35,45,34,0.35)] text-[var(--linen)] backdrop-blur-sm transition-colors hover:border-[var(--linen)] hover:bg-[rgba(35,45,34,0.65)] sm:h-14 sm:w-14"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.35}
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5"
            >
              <path d="M12 5v14m0 0-5-5m5 5 5-5" />
            </svg>
          </button>
        </div>

        <div
          data-panel-dim
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 bg-[var(--ink)] opacity-0"
        />
      </div>
    </Panel>
  );
}

