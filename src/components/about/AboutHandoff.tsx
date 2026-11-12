import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "../StackSection";
import { AboutPhoto } from "./AboutPhoto";
import { prefersReducedMotion } from "../../motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * AB3 — Two-Image Handoff panel.
 * Calm pure-image beat (zero visible text): K1 scales to full screen as
 * the forest panel glides off right, then wide architectural D1 rises from
 * the bottom as a landscape band and expands to full-bleed.
 */
export function AboutHandoff() {
  const sectionRef = useRef<HTMLElement>(null);
  const k1WrapRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const d1WrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const k1Wrap = k1WrapRef.current;
    const curtain = curtainRef.current;
    const d1Wrap = d1WrapRef.current;
    if (!section || !k1Wrap || !curtain || !d1Wrap) return;

    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    let failsafeTimer: number | undefined;
    let observer: IntersectionObserver | undefined;

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(curtain, { xPercent: 0 });
      gsap.set(k1Wrap, { scale: 0.96, transformOrigin: "30% 50%" });
      gsap.set(d1Wrap, { clipPath: "inset(100% 6% 0% 6%)" });

      const tl = gsap.timeline({ paused: true });
      tl.to(
        curtain,
        { xPercent: 100, duration: 0.95, ease: "power3.inOut" },
        0
      )
        .to(
          k1Wrap,
          { scale: 1.04, duration: 1.35, ease: "power2.out" },
          0
        )
        .to(
          d1Wrap,
          { clipPath: "inset(12% 6% 8% 6%)", duration: 0.75, ease: "power4.out" },
          0.55
        )
        .to(
          d1Wrap,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "power3.inOut" },
          1.15
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
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <Panel
      id="about-handoff"
      zIndex={3}
      background="var(--ink)"
      theme="dark"
      panelRef={sectionRef}
    >
      <div
        data-panel-content
        className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[var(--ink)]"
      >
        <h2 className="sr-only">Calm spatial progression from kitchen millwork to dining light</h2>

        {/* Mobile layout: crisp two-frame vertical stack */}
        <div className="flex min-h-[100svh] flex-col lg:hidden">
          <div className="h-[50svh] w-full">
            <AboutPhoto id="K1" className="h-full w-full" />
          </div>
          <div className="h-[50svh] w-full">
            <AboutPhoto id="D1" className="h-full w-full" />
          </div>
        </div>

        {/* Desktop sticky cinematic handoff */}
        <div className="hidden lg:block lg:h-full lg:w-full">
          <div ref={k1WrapRef} className="absolute inset-0">
            <AboutPhoto id="K1" className="h-full w-full" />
          </div>

          <div
            ref={curtainRef}
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full w-[60%] bg-[var(--forest)]"
          />

          <div ref={d1WrapRef} className="absolute inset-0 z-10">
            <AboutPhoto id="D1" className="h-full w-full" />
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

