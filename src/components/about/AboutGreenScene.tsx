import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "../StackSection";
import { AboutPhoto } from "./AboutPhoto";
import { splitText } from "../../motion/splitText";
import { moodGradient } from "../../motion/advanced";
import { prefersReducedMotion } from "../../motion/tokens";
import type { AboutImageId } from "../../data/images";

gsap.registerPlugin(ScrollTrigger);

interface PerimeterFrame {
  id: AboutImageId;
  gridClass: string;
  driftClass: string;
}

const PERIMETER_FRAMES: PerimeterFrame[] = [
  // Left perimeter frame
  {
    id: "M1",
    gridClass: "lg:col-start-1 lg:col-end-4 lg:row-start-2 lg:row-end-5 lg:pr-6",
    driftClass: "about-drift-a",
  },
  // Top perimeter frame (craftsman hands finishing solid timber)
  {
    id: "M3",
    gridClass: "lg:col-start-5 lg:col-end-8 lg:row-start-1 lg:row-end-3 lg:pb-4",
    driftClass: "about-drift-b",
  },
  // Right larger perimeter frame
  {
    id: "E2",
    gridClass: "lg:col-start-10 lg:col-end-13 lg:row-start-2 lg:row-end-6 lg:pl-4",
    driftClass: "about-drift-c",
  },
  // Bottom-right perimeter frame
  {
    id: "M2",
    gridClass: "lg:col-start-9 lg:col-end-11 lg:row-start-7 lg:row-end-9 lg:pt-3",
    driftClass: "about-drift-d",
  },
  // Bottom-left perimeter frame
  {
    id: "B1",
    gridClass: "lg:col-start-2 lg:col-end-4 lg:row-start-6 lg:row-end-9 lg:pr-3",
    driftClass: "about-drift-b",
  },
  // Bottom center perimeter frame
  {
    id: "K3",
    gridClass: "lg:col-start-5 lg:col-end-8 lg:row-start-7 lg:row-end-10 lg:pt-4",
    driftClass: "about-drift-a",
  },
];

/**
 * AB4 — Green Scene panel.
 * Calm drifting forest-to-taupe gradient, centred 4-5 line serif reflection,
 * and six small perimeter frames wiping staggered 0.15s and drifting organically
 * without covering text.
 */
export function AboutGreenScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const headline = headlineRef.current;
    if (!section || !bg || !headline) return;

    const cleanupMood = moodGradient(bg);
    if (prefersReducedMotion()) {
      return () => cleanupMood();
    }

    const mm = gsap.matchMedia();
    let split: ReturnType<typeof splitText> | null = null;
    let failsafeTimer: number | undefined;
    let observer: IntersectionObserver | undefined;

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      split = splitText(headline, { lines: true });
      const frames = Array.from(
        section.querySelectorAll<HTMLElement>("[data-green-frame]")
      );

      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(frames, { clipPath: "inset(100% 0 0 0)", opacity: 0.9 });

      const tl = gsap.timeline({ paused: true });
      tl.to(
        split.lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        },
        0.08
      ).to(
        frames,
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          duration: 0.95,
          stagger: 0.15,
          ease: "power4.out",
        },
        0.18
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
      id="about-philosophy"
      zIndex={4}
      background="var(--forest)"
      theme="dark"
      panelRef={sectionRef}
    >
      <div
        ref={bgRef}
        data-panel-content
        className="relative flex h-full min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-[var(--forest)] px-6 py-20 text-[var(--linen)] sm:px-10 lg:block lg:p-10"
      >
        {/* Drifting forest-to-taupe ambient gradient blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            data-mood-blob
            className="absolute left-[10%] top-[12%] h-[34rem] w-[34rem] rounded-full opacity-45 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(173,150,128,0.42) 0%, rgba(173,150,128,0) 72%)",
            }}
          />
          <div
            data-mood-blob
            className="absolute bottom-[8%] right-[12%] h-[32rem] w-[32rem] rounded-full opacity-55 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, #1E352F 0%, rgba(30,53,47,0) 70%)",
            }}
          />
        </div>

        {/* Desktop 12x9 compositional grid keeping perimeter frames around centred sentence */}
        <div className="relative z-10 flex flex-col gap-10 lg:grid lg:h-full lg:w-full lg:grid-cols-12 lg:grid-rows-9 lg:gap-4">
          {/* Centred serif statement */}
          <div className="relative z-20 flex items-center justify-center lg:col-start-4 lg:col-end-10 lg:row-start-4 lg:row-end-7 lg:px-6">
            <h2
              ref={headlineRef}
              className="max-w-[20ch] text-center font-serif font-normal leading-[1.15] tracking-[-0.015em] text-[var(--linen)]"
              style={{ fontSize: "clamp(1.6rem, 2.75vw, 2.85rem)" }}
            >
              A home that feels distinctly yours, with care you experience long
              after the work is finished.
            </h2>
          </div>

          {/* Mobile 2-frame curated calm preview + full 6 frames on desktop perimeter */}
          <div className="grid grid-cols-2 gap-4 lg:contents">
            {PERIMETER_FRAMES.map((item, idx) => (
              <div
                key={item.id}
                className={`${idx >= 2 ? "hidden lg:block" : ""} ${item.gridClass}`}
              >
                <div
                  data-green-frame
                  className={`${item.driftClass} h-44 w-full overflow-hidden shadow-lg lg:h-full`}
                >
                  <AboutPhoto id={item.id} className="h-full w-full" />
                </div>
              </div>
            ))}
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

