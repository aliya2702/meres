import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "../StackSection";
import { AboutPhoto } from "./AboutPhoto";
import { splitText } from "../../motion/splitText";
import { moodGradient } from "../../motion/advanced";
import { prefersReducedMotion } from "../../motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * AB2 — Split Story panel.
 * Left 40%: E1 peek strip along top-left while K1 wipes up from the bottom.
 * Right 60%: Forest panel with drifting radial blobs wiping top-to-bottom,
 * serif statement top-right, and small portrait stone close-up (M2) with caption bottom-right.
 */
export function AboutSplitStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const forestRef = useRef<HTMLDivElement>(null);
  const k1Ref = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const insetRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const forest = forestRef.current;
    const k1 = k1Ref.current;
    const headline = headlineRef.current;
    const inset = insetRef.current;
    const caption = captionRef.current;
    if (!section || !forest || !k1 || !headline || !inset || !caption) return;

    const cleanupMood = moodGradient(forest);
    if (prefersReducedMotion()) {
      return () => cleanupMood();
    }

    const mm = gsap.matchMedia();
    let split: ReturnType<typeof splitText> | null = null;
    let failsafeTimer: number | undefined;
    let observer: IntersectionObserver | undefined;

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      split = splitText(headline, { lines: true });

      gsap.set(forest, { clipPath: "inset(0 0 100% 0)" });
      gsap.set(k1, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(inset, { x: 64, opacity: 0 });
      gsap.set(caption, { y: 16, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(
        forest,
        { clipPath: "inset(0 0 0% 0)", duration: 1.0, ease: "power4.out" },
        0
      )
        .to(
          k1,
          { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "power4.out" },
          0.12
        )
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.09,
            ease: "power3.out",
          },
          0.32
        )
        .to(
          inset,
          { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          0.52
        )
        .to(
          caption,
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          0.7
        );

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
      });

      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            failsafeTimer = window.setTimeout(() => {
              if (tl.progress() < 1) tl.progress(1);
            }, 3000);
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(section);

      return () => {
        if (failsafeTimer) window.clearTimeout(failsafeTimer);
        observer?.disconnect();
        st.kill();
        tl.kill();
        split?.revert();
      };
    });

    return () => {
      mm.revert();
      cleanupMood();
    };
  }, []);

  return (
    <Panel
      id="about-story"
      zIndex={2}
      background="var(--ink)"
      theme="dark"
      panelRef={sectionRef}
    >
      <div
        data-panel-content
        className="relative flex h-full min-h-[100svh] w-full flex-col lg:flex-row"
      >
        {/* Left 40%: hero E1 thin architectural strip peeking above K1 wipe */}
        <div className="relative h-[54svh] w-full overflow-hidden bg-[var(--ink)] lg:h-full lg:w-[40%]">
          <div className="absolute inset-x-0 top-0 h-[15%] overflow-hidden">
            <AboutPhoto id="E1" className="h-full w-full" imgClassName="object-top" />
          </div>
          <div
            ref={k1Ref}
            className="absolute inset-x-0 bottom-0 top-[9%] overflow-hidden"
          >
            <AboutPhoto id="K1" className="h-full w-full" />
          </div>
        </div>

        {/* Right 60%: Forest panel with slow drifting radial blobs */}
        <div
          ref={forestRef}
          className="relative flex min-h-[54svh] w-full flex-col justify-between overflow-hidden bg-[var(--forest)] px-6 py-12 text-[var(--linen)] sm:px-10 sm:py-14 lg:h-full lg:w-[60%] lg:px-14 lg:py-16"
        >
          {/* Drifting radial mood blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div
              data-mood-blob
              className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full opacity-55 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #1E352F 0%, rgba(30,53,47,0) 70%)",
              }}
            />
            <div
              data-mood-blob
              className="absolute -bottom-24 -right-16 h-[26rem] w-[26rem] rounded-full opacity-35 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(173,150,128,0.65) 0%, rgba(173,150,128,0) 72%)",
              }}
            />
          </div>

          <div className="relative z-10 flex w-full justify-end">
            <h2
              ref={headlineRef}
              className="max-w-[21ch] text-left font-serif font-normal leading-[1.12] tracking-[-0.015em] text-[var(--linen)] lg:text-right"
              style={{ fontSize: "clamp(1.7rem, 2.75vw, 2.85rem)" }}
            >
              Design, construction and cabinet-making experience in the same
              conversation.
            </h2>
          </div>

          <div className="relative z-10 mt-10 flex w-full flex-col items-start gap-4 sm:items-end lg:mt-0">
            <div
              ref={insetRef}
              className="w-[52vw] max-w-[16rem] overflow-hidden shadow-2xl sm:w-[32vw] lg:w-[18vw] lg:max-w-[17rem]"
              style={{ aspectRatio: "4 / 5" }}
            >
              <AboutPhoto id="M2" className="h-full w-full" />
            </div>
            <p
              ref={captionRef}
              className="font-sans text-xs tracking-[0.06em] text-[var(--taupe)] sm:text-sm"
            >
              Materials chosen to be lived with.
            </p>
          </div>
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

