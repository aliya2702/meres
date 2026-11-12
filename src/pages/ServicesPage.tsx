import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StackSection, Panel } from "@/components/StackSection";
import { ClosingSection } from "@/components/ClosingSection";
import { ServicesShowcase } from "@/components/services/ServicesShowcase";
import { services } from "@/content/copy";
import { images } from "@/content/images";
import { initMotionAttributes } from "@/motion/helpers";
import { scrollToTarget } from "@/motion/smooth";
import { splitText, type Split } from "@/motion/splitText";
import { EASE } from "@/motion/tokens";
import { useViewMode } from "@/motion/useViewMode";

gsap.registerPlugin(ScrollTrigger);

const img02 = images.find((item) => item.id === "kitchen-wide")!;

function triggerAnchorGlide(id: string) {
  window.history.replaceState(null, "", `/services#${id}`);
  scrollToTarget(`#${id}`, {
    duration: 1.3,
    offset: -96,
    onComplete: () => {
      window.dispatchEvent(new CustomEvent("meres:anchor-replay", { detail: { id } }));
    },
  });
}

function ServicesHeroPanel({ zIndex }: { zIndex: number }) {
  const panelRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const leadWrapRef = useRef<HTMLDivElement>(null);
  const anchorsRef = useRef<HTMLElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);

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

    const clipEl = clipRef.current;
    const imgEl = imgRef.current;
    const h1 = h1Ref.current;
    const leadWrap = leadWrapRef.current;
    const anchors = anchorsRef.current;
    const caption = captionRef.current;

    if (!clipEl || !imgEl || !h1 || !leadWrap || !anchors || !caption) {
      return () => {
        cleanups.forEach((c) => c());
      };
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      let split: Split | null = null;
      let tl: gsap.core.Timeline | null = null;

      gsap.set(clipEl, { clipPath: "inset(8% 8% 8% 8%)" });
      gsap.set(imgEl, { scale: 1.15 });
      gsap.set(h1, { opacity: 0 });
      gsap.set([leadWrap, anchors, caption], { y: 20, opacity: 0 });

      void document.fonts.ready.then(() => {
        if (cancelled) return;
        split = splitText(h1, { lines: true });
        gsap.set(h1, { clearProps: "opacity" });
        gsap.set(split.lines, { yPercent: 110, opacity: 0 });

        tl = gsap.timeline({ delay: 0.3 });
        tl.to(clipEl, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EASE.wipe }, 0);
        tl.to(imgEl, { scale: 1, duration: 1.5, ease: EASE.wipe }, 0);
        tl.to(
          split.lines,
          { yPercent: 0, opacity: 1, duration: 0.9, ease: EASE.reveal, stagger: 0.1 },
          0,
        );
        tl.to(
          [leadWrap, anchors, caption],
          { y: 0, opacity: 1, duration: 0.85, ease: EASE.reveal, stagger: 0.08 },
          0.55,
        );
      });

      return () => {
        cancelled = true;
        tl?.kill();
        split?.revert();
        gsap.set([clipEl, imgEl, h1, leadWrap, anchors, caption], {
          clearProps: "transform,opacity,clipPath",
        });
      };
    });

    cleanups.push(() => mm.revert());

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [mode]);

  const animateMobile = mode === "mobile";

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    triggerAnchorGlide(id);
  };

  return (
    <Panel panelRef={panelRef} zIndex={zIndex} background="var(--forest)" theme="dark">
      <div className="relative flex min-h-[100svh] w-full flex-col justify-end bg-forest text-linen lg:h-full">
        {/* Full-bleed image 02 with desktop inset(8%) reveal or mobile "up" reveal */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-clip">
          <div
            ref={clipRef}
            {...(animateMobile ? { "data-reveal-image": "up" } : {})}
            className="h-full w-full overflow-clip"
          >
            <img
              ref={imgRef}
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

        {/* Dark scrims */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
          style={{ background: "linear-gradient(to bottom, rgba(35, 45, 34, 0.45), transparent)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(35, 45, 34, 0.78) 0%, rgba(35, 45, 34, 0.56) 52%, rgba(35, 45, 34, 0.25) 100%)",
          }}
        />

        {/* Hero copy bottom-left and section anchors */}
        <div className="relative z-20 flex w-full flex-col justify-end px-5 pb-20 pt-28 lg:px-10 lg:pb-24">
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-[68rem]">
              <h1
                ref={h1Ref}
                {...(animateMobile ? { "data-reveal": "lines" } : {})}
                className="font-serif text-[clamp(3rem,7vw,7.5rem)] leading-[1.0] text-linen"
              >
                {services.title}
              </h1>

              <div ref={leadWrapRef} className="mt-5 max-w-[36rem] space-y-3">
                <p
                  {...(animateMobile ? { "data-reveal": "lines" } : {})}
                  className="font-sans text-[1.1667rem] font-medium leading-[1.5] text-linen"
                >
                  {services.lead}
                </p>
                {services.paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    {...(animateMobile ? { "data-reveal": "lines" } : {})}
                    className="font-sans text-[1.1667rem] leading-[1.52] text-linen/90"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <nav
              ref={anchorsRef}
              aria-label="Service sections"
              className="flex flex-wrap gap-x-6 gap-y-2 lg:shrink-0 lg:flex-col lg:items-end lg:gap-2.5"
            >
              {services.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(event) => handleAnchorClick(event, section.id)}
                  data-cursor="link"
                  className="font-sans text-[1.1667rem] text-taupe underline-offset-4 transition-colors hover:text-linen hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-linen focus-visible:outline-offset-4"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <span
          ref={captionRef}
          className="concept-chip pointer-events-none absolute bottom-4 left-5 z-20 lg:bottom-6 lg:left-10"
        >
          {img02.label}
        </span>
      </div>
    </Panel>
  );
}

export default function ServicesPage() {
  return (
    <>
      <StackSection>
        <ServicesHeroPanel zIndex={1} />
      </StackSection>
      <ServicesShowcase variant="page" />
      <ClosingSection
        title={services.closing.title}
        paragraphs={services.closing.paragraphs}
      />
    </>
  );
}
