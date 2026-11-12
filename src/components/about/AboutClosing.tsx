import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "../StackSection";
import { AboutPhoto } from "./AboutPhoto";
import { VeilLink } from "../VeilLink";
import { splitText } from "../../motion/splitText";
import { magnetic } from "../../motion/helpers";
import { moodGradient } from "../../motion/advanced";
import { prefersReducedMotion } from "../../motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * AB7 — Closing CTA panel.
 * Forest-to-teal gradient with soft drifting radial blobs, left tall stone frame
 * (M4) wiping up from bottom and drifting slowly downward, right-aligned giant serif
 * "Tell us what matters" and a magnetic circular arrow VeilLink to /contact#project-inquiry.
 */
export function AboutClosing() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const frameWrapRef = useRef<HTMLDivElement>(null);
  const frameDriftRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const frameWrap = frameWrapRef.current;
    const frameDrift = frameDriftRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const cta = ctaRef.current;
    if (!section || !bg || !frameWrap || !frameDrift || !line1 || !line2 || !cta) return;

    const cleanupMood = moodGradient(bg);
    const cleanupMagnetic = magnetic(cta);

    if (prefersReducedMotion()) {
      return () => {
        cleanupMagnetic();
        cleanupMood();
      };
    }

    const mm = gsap.matchMedia();
    let failsafeTimer: number | undefined;
    let observer: IntersectionObserver | undefined;

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const split1 = splitText(line1, { lines: true });
      const split2 = splitText(line2, { lines: true });
      const lines = [...split1.lines, ...split2.lines];

      gsap.set(frameWrap, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      gsap.set(cta, { scale: 0.85, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(
        frameWrap,
        { clipPath: "inset(0% 0 0 0)", duration: 1.05, ease: "power4.out" },
        0
      )
        .to(
          lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.16
        )
        .to(
          cta,
          { scale: 1, opacity: 1, duration: 0.75, ease: "power3.out" },
          0.4
        );

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
      });

      const driftTween = gsap.fromTo(
        frameDrift,
        { y: -18 },
        {
          y: 26,
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
        split1.revert();
        split2.revert();
      };
    });

    return () => {
      mm.revert();
      cleanupMagnetic();
      cleanupMood();
    };
  }, []);

  return (
    <Panel
      id="about-closing"
      zIndex={7}
      background="var(--forest)"
      theme="dark"
      panelRef={sectionRef}
    >
      <div
        ref={bgRef}
        data-panel-content
        className="relative flex h-full min-h-[100svh] w-full flex-col justify-center overflow-hidden px-6 py-24 text-[var(--linen)] sm:px-10 lg:block lg:px-16 lg:py-0"
        style={{
          background:
            "linear-gradient(135deg, var(--forest) 0%, #243831 55%, #1E352F 100%)",
        }}
      >
        {/* Drifting radial mood blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            data-mood-blob
            className="absolute -left-24 bottom-[10%] h-[30rem] w-[30rem] rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(173,150,128,0.34) 0%, rgba(173,150,128,0) 70%)",
            }}
          />
          <div
            data-mood-blob
            className="absolute right-[-6rem] top-[10%] h-[34rem] w-[34rem] rounded-full opacity-55 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, #172B26 0%, rgba(23,43,38,0) 72%)",
            }}
          />
        </div>

        <div className="relative z-10 grid h-full w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left tall framed image (cols 2-5 on 12-col grid), slow downward drift */}
          <div className="mx-auto w-[72vw] max-w-[20rem] lg:col-start-2 lg:col-end-6 lg:mx-0 lg:w-full lg:max-w-none">
            <div ref={frameDriftRef} data-drift="down" className="will-change-transform">
              <div
                ref={frameWrapRef}
                className="h-[52svh] w-full overflow-hidden shadow-2xl lg:h-[72svh]"
              >
                <AboutPhoto id="M4" className="h-full w-full" />
              </div>
            </div>
          </div>

          {/* Right-aligned closing headline & magnetic circular link */}
          <div className="flex flex-col items-end text-right lg:col-start-6 lg:col-end-12">
            <h2
              className="font-serif font-normal leading-[0.98] tracking-[-0.025em] text-[var(--linen)]"
              style={{ fontSize: "clamp(2.75rem, 6.8vw, 6.75rem)" }}
            >
              <span ref={line1Ref} className="block">
                Tell us
              </span>
              <span ref={line2Ref} className="block">
                what matters
              </span>
            </h2>

            <VeilLink
              ref={ctaRef}
              to="/contact#project-inquiry"
              data-about-cursor="cta"
              aria-label="Tell us what matters — begin your project inquiry"
              className="mt-10 flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(232,222,206,0.45)] bg-[rgba(35,45,34,0.28)] text-[var(--linen)] transition-colors duration-300 hover:border-[var(--linen)] hover:bg-[var(--linen)] hover:text-[var(--forest)] sm:h-24 sm:w-24"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.3}
                className="h-6 w-6 sm:h-7 sm:w-7"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </VeilLink>
          </div>
        </div>
      </div>
    </Panel>
  );
}
