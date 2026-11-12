import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { home } from "@/content/copy";
import { images } from "@/content/images";
import { initMotionAttributes, panelRise } from "@/motion/helpers";
import { splitText, type Split } from "@/motion/splitText";
import { DUR, EASE, STAGGER } from "@/motion/tokens";
import { useViewMode } from "@/motion/useViewMode";

gsap.registerPlugin(ScrollTrigger);

const img02 = images.find((item) => item.id === "kitchen-wide")!;

export function UnderstandingSection({ zIndex }: { zIndex: number }) {
  const panelRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const parasWrapRef = useRef<HTMLDivElement>(null);

  const mode = useViewMode();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const cleanups: Array<() => void> = [];
    cleanups.push(initMotionAttributes(panel));

    if (mode !== "desktop") {
      ScrollTrigger.refresh();
      return () => {
        cleanups.forEach((c) => c());
      };
    }

    const bgLayer = bgLayerRef.current;
    const heading = headingRef.current;
    const parasWrap = parasWrapRef.current;

    if (!bgLayer || !heading || !parasWrap) {
      return () => {
        cleanups.forEach((c) => c());
      };
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      let split: Split | null = null;
      let tl: gsap.core.Timeline | null = null;
      let st: ScrollTrigger | null = null;
      let hasEntered = false;
      let lastWidth = panel.clientWidth;
      let resizeTimer = 0;

      const cleanupRise = panelRise(panel);

      const bgTween = gsap.fromTo(
        bgLayer,
        { yPercent: 6 },
        {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      gsap.set([heading, parasWrap], { opacity: 0 });

      const buildTextTimeline = (preserveProgress: boolean) => {
        st?.kill();
        tl?.kill();
        split?.revert();

        split = splitText(heading, { lines: true });
        gsap.set(heading, { clearProps: "opacity" });

        tl = gsap.timeline({ paused: true });
        gsap.set(split.lines, { yPercent: 110, opacity: 0 });
        gsap.set(parasWrap, { y: 24, opacity: 0 });

        tl.to(
          split.lines,
          { yPercent: 0, opacity: 1, duration: DUR.text, ease: EASE.reveal, stagger: STAGGER.lines },
          0,
        );
        tl.to(
          parasWrap,
          { y: 0, opacity: 1, duration: 0.9, ease: EASE.reveal },
          0.25,
        );

        st = ScrollTrigger.create({
          trigger: panel,
          start: "top 18%",
          onEnter: () => {
            hasEntered = true;
            tl?.timeScale(1).play();
          },
          onLeaveBack: () => {
            hasEntered = false;
            tl?.timeScale(2).reverse();
          },
        });

        if (preserveProgress && hasEntered) {
          tl.progress(1);
        }
      };

      void document.fonts.ready.then(() => {
        if (cancelled) return;
        buildTextTimeline(false);
        ScrollTrigger.refresh();
      });

      const onResize = () => {
        if (Math.abs(panel.clientWidth - lastWidth) < 8) return;
        lastWidth = panel.clientWidth;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (cancelled) return;
          buildTextTimeline(true);
          ScrollTrigger.refresh();
        }, 160);
      };
      window.addEventListener("resize", onResize);

      return () => {
        cancelled = true;
        window.removeEventListener("resize", onResize);
        window.clearTimeout(resizeTimer);
        cleanupRise();
        bgTween.scrollTrigger?.kill();
        bgTween.kill();
        st?.kill();
        tl?.kill();
        split?.revert();
        gsap.set([bgLayer, heading, parasWrap], { clearProps: "transform,opacity" });
      };
    });

    cleanups.push(() => mm.revert());

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [mode]);

  return (
    <Panel panelRef={panelRef} id="understanding" zIndex={zIndex} background="var(--forest)" theme="dark" panelRise="manual">
      <div className="relative flex min-h-[100svh] w-full flex-col justify-end bg-forest text-linen lg:h-full">
        {/* Full-bleed background layer with vertical parallax bleed on desktop */}
        <div
          {...(mode === "mobile" ? { "data-reveal-image": "up" } : {})}
          className="absolute inset-0 z-0 overflow-clip"
        >
          <div
            ref={bgLayerRef}
            className={mode === "desktop" ? "relative -top-[7%] h-[114%] w-full" : "relative h-full w-full"}
          >
            <img
              src={img02.src["1672"]}
              alt={img02.alt}
              width={1672}
              height={941}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
              style={{ objectPosition: `${img02.focal.xPct}% ${img02.focal.yPct}%` }}
            />
          </div>
        </div>

        {/* Top header contrast scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
          style={{ background: "linear-gradient(to bottom, rgba(35, 45, 34, 0.45), transparent)" }}
        />

        {/* Bottom dark scrim ensuring >= 4.5:1 contrast behind heading and two-column copy */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[84%] lg:h-[75%]"
          style={{
            background:
              "linear-gradient(to top, rgba(35, 45, 34, 0.78) 0%, rgba(35, 45, 34, 0.74) 50%, rgba(35, 45, 34, 0.28) 78%, transparent 100%)",
          }}
        />

        {/* Content layout */}
        <div className="relative z-20 flex w-full flex-col justify-end px-5 pb-20 pt-28 lg:px-10 lg:pb-24 lg:pt-28">
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <h2
              ref={headingRef}
              {...(mode === "mobile" ? { "data-reveal": "lines" } : {})}
              className="font-serif text-[clamp(2.75rem,6vw,6.5rem)] leading-[1.03] text-linen lg:max-w-[44%] lg:shrink-0"
            >
              {home.understanding.title}
            </h2>

            <div
              ref={parasWrapRef}
              className="columns-1 gap-8 font-sans text-[1.1667rem] leading-[1.52] text-linen/95 lg:w-[48%] lg:columns-2 [&>p+p]:mt-4"
            >
              {home.understanding.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  {...(mode === "mobile" ? { "data-reveal": "lines" } : {})}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <span className="concept-chip pointer-events-none absolute bottom-4 left-5 z-20 lg:bottom-6 lg:left-10">
          {img02.label}
        </span>
      </div>
    </Panel>
  );
}

