import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Panel } from "@/components/StackSection";
import { VeilLink } from "@/components/VeilLink";
import { MeresMark } from "@/components/MeresMark";
import { BRAND, home } from "@/content/copy";
import { images } from "@/content/images";
import { initMotionAttributes } from "@/motion/helpers";
import { splitText, type Split } from "@/motion/splitText";
import { EASE } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

const img01 = images.find((item) => item.id === "kitchen-hero")!;
const img05 = images.find((item) => item.id === "wine-bar")!;

type ServiceId = (typeof home.change.services)[number]["id"];

type MediaConfig =
  | { kind: "image"; image: typeof img01 | typeof img05 }
  | { kind: "tonal"; variant: "taupe" | "green-taupe" };

const MEDIA_BY_ID: Record<ServiceId, MediaConfig> = {
  kitchens: { kind: "image", image: img01 },
  bathrooms: { kind: "tonal", variant: "taupe" },
  "whole-home": { kind: "image", image: img05 },
  "additions-custom-homes": { kind: "tonal", variant: "green-taupe" },
};

const SERVICE_ROWS = home.change.services.map((service) => {
  const brandMeta = BRAND.services.find((item) => item.id === service.id)!;
  return {
    ...service,
    href: brandMeta.href,
    linkLabel: brandMeta.link,
    media: MEDIA_BY_ID[service.id],
  };
});

function useResponsiveFlags() {
  const [flags, setFlags] = useState(() => {
    if (typeof window === "undefined") return { isWide: false, isFine: false, reduced: false };
    return {
      isWide: window.matchMedia("(min-width: 1024px)").matches,
      isFine: window.matchMedia("(pointer: fine)").matches,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  });

  useEffect(() => {
    const mqWide = window.matchMedia("(min-width: 1024px)");
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const nextWide = mqWide.matches;
      const nextFine = mqFine.matches;
      const nextReduced = mqReduce.matches;
      setFlags((prev) =>
        prev.isWide === nextWide && prev.isFine === nextFine && prev.reduced === nextReduced
          ? prev
          : { isWide: nextWide, isFine: nextFine, reduced: nextReduced },
      );
    };
    mqWide.addEventListener("change", update);
    mqFine.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mqWide.removeEventListener("change", update);
      mqFine.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);

  return flags;
}

function MediaSurface({ media }: { media: MediaConfig }) {
  if (media.kind === "image") {
    const { image } = media;
    return (
      <img
        src={image.src["1672"]}
        alt={image.alt}
        width={1672}
        height={941}
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover"
        style={{ objectPosition: `${image.focal.xPct}% ${image.focal.yPct}%` }}
      />
    );
  }

  if (media.variant === "taupe") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-taupe">
        <MeresMark className="w-20 text-forest/80 sm:w-24 lg:w-28" title="MERES" />
      </div>
    );
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        background: "linear-gradient(155deg, #746654 0%, #4C5344 55%, #384234 100%)",
      }}
    >
      <MeresMark className="w-20 text-linen/85 sm:w-24 lg:w-28" title="MERES" />
    </div>
  );
}

function MediaCaption({ media }: { media: MediaConfig }) {
  if (media.kind !== "image") return null;
  return (
    <span className="concept-chip pointer-events-none absolute bottom-4 left-4 z-10 lg:bottom-6 lg:left-6">
      {media.image.label}
    </span>
  );
}

export function ChangeSection({ zIndex }: { zIndex: number }) {
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rowEnterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hairlineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const rightStageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const slideInnerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const { isWide, isFine, reduced } = useResponsiveFlags();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const displayedSlideRef = useRef(0);
  const zCounterRef = useRef(1);

  const animateMobile = !isWide && !reduced;
  const animateDesktop = isWide && isFine && !reduced;
  const allowHover = isWide && isFine;

  // Bind mobile attribute reveals & handle responsive switches cleanly
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const cleanupMotion = initMotionAttributes(panel);
    ScrollTrigger.refresh();
    return cleanupMotion;
  }, [isWide, isFine, reduced]);

  // Desktop entrance choreography: widening photo strip, rising heading lines, staggered rows & hairlines
  useEffect(() => {
    if (!isWide) return;
    const panel = panelRef.current;
    const heading = headingRef.current;
    const rightStage = rightStageRef.current;
    const rowEnters = rowEnterRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const hairlines = hairlineRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
    const slides = slideRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const slideInners = slideInnerRefs.current.filter((el): el is HTMLDivElement => Boolean(el));

    if (!panel || !heading || !rightStage) return;

    // Reset slide stack coherently whenever layout / reduced mode stabilizes
    const current = activeIndexRef.current;
    displayedSlideRef.current = current;
    zCounterRef.current = 1;
    slides.forEach((slide, idx) => {
      gsap.set(slide, {
        visibility: idx === current ? "visible" : "hidden",
        zIndex: idx === current ? 1 : 0,
        clearProps: "clipPath",
      });
    });
    gsap.set(slideInners, { scale: 1 });

    if (!animateDesktop) {
      gsap.set([rightStage, heading, ...rowEnters, ...hairlines], { clearProps: "all" });
      return;
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      let split: Split | null = null;
      let tl: gsap.core.Timeline | null = null;
      let st: ScrollTrigger | null = null;
      let entered = false;
      let lastWidth = panel.clientWidth;
      let resizeTimer = 0;

      gsap.set(rightStage, { clipPath: "inset(0 0 0 85%)" });
      const initialInner = slideInners[current];
      if (initialInner) gsap.set(initialInner, { scale: 1.15 });
      gsap.set(heading, { opacity: 0 });
      gsap.set(rowEnters, { y: 28, opacity: 0 });
      gsap.set(hairlines, { scaleX: 0 });

      const buildTimeline = (preserveProgress: boolean) => {
        st?.kill();
        tl?.kill();
        split?.revert();

        split = splitText(heading, { lines: true });
        gsap.set(heading, { clearProps: "opacity" });

        if (!preserveProgress) {
          gsap.set(split.lines, { yPercent: 110, opacity: 0 });
        }

        tl = gsap.timeline({ paused: true });
        tl.to(rightStage, { clipPath: "inset(0 0 0 0)", duration: 1.4, ease: EASE.wipe }, 0);
        if (!preserveProgress && activeIndexRef.current === current && initialInner) {
          tl.to(initialInner, { scale: 1, duration: 1.4, ease: EASE.wipe }, 0);
        }
        tl.to(split.lines, { yPercent: 0, opacity: 1, duration: 0.9, ease: EASE.reveal, stagger: 0.1 }, 0.15);
        tl.to(rowEnters, { y: 0, opacity: 1, duration: 0.7, ease: EASE.reveal, stagger: 0.1 }, 0.45);
        tl.to(hairlines, { scaleX: 1, duration: 0.6, ease: EASE.reveal, stagger: 0.1 }, 0.45);

        st = ScrollTrigger.create({
          trigger: panel,
          start: "top 65%",
          once: true,
          onEnter: () => {
            entered = true;
            tl?.play();
          },
        });

        if (preserveProgress && entered) {
          tl.progress(1);
        }
      };

      void document.fonts.ready.then(() => {
        if (cancelled) return;
        buildTimeline(false);
        ScrollTrigger.refresh();
      });

      const onResize = () => {
        if (Math.abs(panel.clientWidth - lastWidth) < 8) return;
        lastWidth = panel.clientWidth;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (cancelled) return;
          buildTimeline(true);
          ScrollTrigger.refresh();
        }, 160);
      };
      window.addEventListener("resize", onResize);

      return () => {
        cancelled = true;
        window.removeEventListener("resize", onResize);
        window.clearTimeout(resizeTimer);
        st?.kill();
        tl?.kill();
        split?.revert();
        gsap.set([rightStage, heading, ...rowEnters, ...hairlines, ...slides, ...slideInners], {
          clearProps: "transform,opacity,clipPath",
        });
      };
    });

    return () => {
      mm.revert();
    };
  }, [animateDesktop, isWide, reduced]);

  // Desktop hover/focus panel swap
  useEffect(() => {
    if (!isWide) return;
    if (displayedSlideRef.current === activeIndex) return;
    displayedSlideRef.current = activeIndex;

    const nextSlide = slideRefs.current[activeIndex];
    const nextInner = slideInnerRefs.current[activeIndex];
    if (!nextSlide || !nextInner) return;

    const nextZ = ++zCounterRef.current;
    gsap.killTweensOf([nextSlide, nextInner]);

    if (reduced || !isFine) {
      slideRefs.current.forEach((slide, idx) => {
        if (!slide) return;
        gsap.set(slide, {
          visibility: idx === activeIndex ? "visible" : "hidden",
          zIndex: idx === activeIndex ? nextZ : 0,
          clearProps: "clipPath",
        });
      });
      gsap.set(nextInner, { scale: 1 });
      return;
    }

    gsap.set(nextSlide, { visibility: "visible", zIndex: nextZ });
    gsap.fromTo(
      nextSlide,
      { clipPath: "inset(0 0 0 100%)" },
      {
        clipPath: "inset(0 0 0 0)",
        duration: 0.45,
        ease: EASE.reveal,
        overwrite: "auto",
        onComplete: () => {
          if (activeIndexRef.current !== activeIndex) return;
          slideRefs.current.forEach((slide, idx) => {
            if (!slide || idx === activeIndex) return;
            gsap.set(slide, { visibility: "hidden", zIndex: 0 });
          });
        },
      },
    );
    gsap.fromTo(
      nextInner,
      { scale: 1.08 },
      { scale: 1, duration: 0.45, ease: EASE.reveal, overwrite: "auto" },
    );
  }, [activeIndex, isWide, isFine, reduced]);

  const activateRow = (idx: number, dim = true) => {
    if (dim) setHoveredIndex(idx);
    setActiveIndex(idx);
  };

  const handleListMouseLeave = () => {
    const activeEl = document.activeElement;
    if (activeEl && listRef.current?.contains(activeEl)) {
      const activeItem = activeEl.closest<HTMLElement>("[data-row-index]");
      if (activeItem) {
        const idx = Number(activeItem.dataset.rowIndex);
        if (Number.isFinite(idx)) {
          setHoveredIndex(idx);
          return;
        }
      }
    }
    setHoveredIndex(null);
  };

  const handleListBlur = (event: React.FocusEvent<HTMLUListElement>) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      setHoveredIndex(null);
    }
  };

  if (!isWide) {
    return (
      <Panel panelRef={panelRef} id="change" zIndex={zIndex} background="var(--forest)" theme="dark">
        <div className="relative flex min-h-[100svh] w-full flex-col bg-forest px-5 pb-20 pt-28 text-linen md:px-10">
          <h2
            {...(animateMobile ? { "data-reveal": "lines" } : {})}
            className="font-serif text-[clamp(2.75rem,6vw,6.5rem)] leading-[1.02] text-linen"
          >
            {home.change.title}
          </h2>

          <ul className="mt-10 flex flex-col gap-12">
            {SERVICE_ROWS.map((service) => (
              <li key={service.id} className="border-t border-taupe/40 pt-8 first:border-t-0 first:pt-0">
                <div
                  {...(animateMobile ? { "data-reveal-image": "up" } : {})}
                  className="relative aspect-[4/3] w-full overflow-clip bg-taupe/20"
                >
                  <MediaSurface media={service.media} />
                  <MediaCaption media={service.media} />
                </div>

                <h3
                  {...(animateMobile ? { "data-reveal": "lines" } : {})}
                  className="mt-5 font-serif text-[clamp(1.75rem,3vw,3rem)] leading-[1.08] text-linen"
                >
                  {service.title}
                </h3>

                <p
                  {...(animateMobile ? { "data-reveal": "lines" } : {})}
                  className="mt-2.5 font-sans text-[1.0625rem] leading-[1.55] text-linen/85"
                >
                  {service.body}
                </p>

                <div className="mt-4">
                  <VeilLink
                    to={service.href}
                    className="inline-flex items-center gap-1.5 font-sans text-[1.0625rem] font-medium text-taupe transition-colors hover:text-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-linen focus-visible:outline-offset-4"
                  >
                    {service.linkLabel}
                    <ArrowUpRight size={17} />
                  </VeilLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    );
  }

  return (
    <Panel panelRef={panelRef} id="change" zIndex={zIndex} background="var(--forest)" theme="dark">
      <div className="grid h-full w-full grid-cols-2 bg-forest text-linen">
        {/* Left column (50%): heading at top, 4-row stacked list separated by 1px taupe hairlines */}
        <div className="flex h-full flex-col justify-between px-8 pb-6 pt-20 xl:px-12 xl:pb-8 xl:pt-20">
          <h2
            ref={headingRef}
            className="font-serif text-[clamp(2.75rem,6vw,6.5rem)] leading-[0.98] text-linen"
          >
            {home.change.title}
          </h2>

          <ul
            ref={listRef}
            onMouseLeave={handleListMouseLeave}
            onBlurCapture={handleListBlur}
            className="mt-4 flex flex-col"
          >
            {SERVICE_ROWS.map((service, idx) => {
              const isDimmed = allowHover && hoveredIndex !== null && hoveredIndex !== idx;
              return (
                <li
                  key={service.id}
                  data-row-index={idx}
                  onMouseEnter={allowHover ? () => activateRow(idx, true) : undefined}
                  onFocusCapture={() => activateRow(idx, allowHover)}
                  onClick={!allowHover ? () => activateRow(idx, false) : undefined}
                  className="relative"
                >
                  <span
                    ref={(el) => { hairlineRefs.current[idx] = el; }}
                    aria-hidden="true"
                    className="block h-px w-full origin-left bg-taupe/45"
                  />
                  <div ref={(el) => { rowEnterRefs.current[idx] = el; }}>
                    <div
                      className={`py-2 transition-opacity duration-[250ms] ease-out xl:py-2.5 ${
                        isDimmed ? "opacity-30" : "opacity-100"
                      }`}
                    >
                      <h3 className="font-serif text-[clamp(1.75rem,3vw,3rem)] leading-[1.06] text-linen">
                        {service.title}
                      </h3>
                      <p className="mt-1 font-sans text-[0.875rem] leading-[1.38] text-linen/80 xl:text-[0.95rem] xl:leading-[1.42]">
                        {service.body}
                      </p>
                      <div className="mt-1.5">
                        <VeilLink
                          to={service.href}
                          data-cursor="link"
                          className="inline-flex items-center gap-1.5 font-sans text-[0.875rem] font-medium tracking-[0.02em] text-taupe transition-colors hover:text-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-linen focus-visible:outline-offset-4 xl:text-[0.95rem]"
                        >
                          {service.linkLabel}
                          <ArrowUpRight size={15} />
                        </VeilLink>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right column (50%): full-height image / tonal panel */}
        <div className="relative h-full w-full overflow-clip">
          <div ref={rightStageRef} className="relative h-full w-full overflow-clip bg-taupe/20">
            {SERVICE_ROWS.map((service, idx) => (
              <div
                key={service.id}
                ref={(el) => { slideRefs.current[idx] = el; }}
                aria-hidden={activeIndex !== idx}
                className="absolute inset-0 overflow-clip"
              >
                <div
                  ref={(el) => { slideInnerRefs.current[idx] = el; }}
                  className="relative h-full w-full"
                >
                  <MediaSurface media={service.media} />
                </div>
                <MediaCaption media={service.media} />
              </div>
            ))}

            {/* Subtle top header scrim for right-aligned navigation links */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28"
              style={{ background: "linear-gradient(to bottom, rgba(35, 45, 34, 0.42), transparent)" }}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
