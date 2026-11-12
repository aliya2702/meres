import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "../StackSection";
import { AboutPhoto } from "./AboutPhoto";
import { splitText } from "../../motion/splitText";
import { prefersReducedMotion } from "../../motion/tokens";
import type { AboutImageId } from "../../data/images";

gsap.registerPlugin(ScrollTrigger);

interface FilmstripItem {
  id: AboutImageId;
  widthClass: string;
  heightClass: string;
  orderPriority: number;
}

// Centre-out reveal order: indices 3 (E2) & 4 (B3) first, expanding outward.
const FILMSTRIP_ITEMS: FilmstripItem[] = [
  { id: "M1", widthClass: "lg:w-[10.5vw]", heightClass: "h-48 lg:h-[28vh]", orderPriority: 6 },
  { id: "K3", widthClass: "lg:w-[12.5vw]", heightClass: "h-56 lg:h-[36vh]", orderPriority: 4 },
  { id: "D3", widthClass: "lg:w-[11vw]", heightClass: "h-52 lg:h-[32vh]", orderPriority: 2 },
  { id: "E2", widthClass: "lg:w-[15vw]", heightClass: "h-64 lg:h-[47vh]", orderPriority: 0 },
  { id: "B3", widthClass: "lg:w-[12.5vw]", heightClass: "h-56 lg:h-[40vh]", orderPriority: 1 },
  { id: "M4", widthClass: "lg:w-[10.5vw]", heightClass: "h-48 lg:h-[30vh]", orderPriority: 3 },
  { id: "W1", widthClass: "lg:w-[12vw]", heightClass: "h-56 lg:h-[37vh]", orderPriority: 5 },
  { id: "E3", widthClass: "lg:w-[13vw]", heightClass: "h-52 lg:h-[33vh]", orderPriority: 7 },
];

/**
 * AB6 — Cream Filmstrip panel.
 * Warm linen panel introducing "ALL SHADES OF CRAFT" / "Eddie Johnson's practice,
 * one detail at a time." above a bottom-aligned 8-frame portrait filmstrip (M1, K3,
 * D3, E2, B3, M4, W1, E3) that rises staggered from center outward, tracks laterally
 * with scroll (~ -8vw), and lifts hovered frames while dimming siblings to 0.6.
 */
export function AboutFilmstrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const headline = headlineRef.current;
    const track = trackRef.current;
    if (!section || !eyebrow || !headline || !track) return;

    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    let split: ReturnType<typeof splitText> | null = null;
    let failsafeTimer: number | undefined;
    let observer: IntersectionObserver | undefined;

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      split = splitText(headline, { lines: true });
      const orderedFrames = [...FILMSTRIP_ITEMS]
        .map((item, idx) => ({ item, el: frameRefs.current[idx] }))
        .filter((pair): pair is { item: FilmstripItem; el: HTMLDivElement } =>
          Boolean(pair.el)
        )
        .sort((a, b) => a.item.orderPriority - b.item.orderPriority)
        .map((pair) => pair.el);

      gsap.set(eyebrow, { opacity: 0, y: 14 });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(orderedFrames, {
        clipPath: "inset(100% 0 0 0)",
        y: 80,
      });

      const tl = gsap.timeline({ paused: true });
      tl.to(
        eyebrow,
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        0
      )
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.1
        )
        .to(
          orderedFrames,
          {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: "power4.out",
          },
          0.22
        );

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
      });

      // Horizontal translateX tied to scroll (~ -8vw total)
      const driftTween = gsap.fromTo(
        track,
        { x: "0vw" },
        {
          x: "-8vw",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

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
        driftTween.scrollTrigger?.kill();
        driftTween.kill();
        st.kill();
        tl.kill();
        split?.revert();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <Panel
      id="about-craft"
      zIndex={6}
      background="var(--linen)"
      theme="light"
      panelRef={sectionRef}
    >
      <div
        data-panel-content
        className="relative flex h-full min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-[var(--linen)] pb-8 pt-28 text-[var(--ink)] sm:pb-12 lg:pb-10 lg:pt-28"
      >
        {/* Editorial header */}
        <div className="px-6 sm:px-10 lg:px-16">
          <p
            ref={eyebrowRef}
            className="mb-3 font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--green)] sm:text-xs"
          >
            ALL SHADES OF CRAFT
          </p>
          <h2
            ref={headlineRef}
            className="max-w-[22ch] font-serif font-normal leading-[1.08] tracking-[-0.02em] text-[var(--ink)]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 4rem)" }}
          >
            Eddie Johnson&apos;s practice, one detail at a time.
          </h2>
        </div>

        {/* Responsive portrait frames: 2/4-col editorial grid on mobile, lateral scrubbing filmstrip on desktop */}
        <div className="mt-10 w-full overflow-hidden pt-4 lg:mt-0 lg:pt-6">
          <div
            ref={trackRef}
            className="about-filmstrip-row grid grid-cols-2 items-end gap-3 px-6 sm:grid-cols-4 sm:gap-4 sm:px-10 lg:flex lg:w-max lg:gap-4 lg:px-12 lg:will-change-transform xl:gap-5 xl:px-16"
          >
            {FILMSTRIP_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => {
                  frameRefs.current[idx] = el;
                }}
                className={`about-filmstrip-item w-full cursor-pointer overflow-hidden lg:shrink-0 ${item.widthClass} ${item.heightClass}`}
              >
                <AboutPhoto id={item.id} className="h-full w-full" />
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

