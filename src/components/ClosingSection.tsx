import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { VeilLink } from "@/components/VeilLink";
import { BRAND, home } from "@/content/copy";
import { images } from "@/content/images";
import { initMotionAttributes, magnetic } from "@/motion/helpers";
import { splitText, type Split } from "@/motion/splitText";
import { EASE, STAGGER } from "@/motion/tokens";
import { useViewMode } from "@/motion/useViewMode";

gsap.registerPlugin(ScrollTrigger);

const img03 = images.find((item) => item.id === "dining-nook")!;

type ClosingSectionProps = {
  title?: string;
  paragraphs?: readonly string[];
  lead?: string;
};

export function ClosingSection({
  title = home.closing.title,
  paragraphs = [home.closing.body],
  lead,
}: ClosingSectionProps = {}) {
  const resolvedLead = lead !== undefined ? lead : (title === home.closing.title ? home.closing.lead : undefined);
  const sectionRef = useRef<HTMLElement>(null);
  const blurWrapRef = useRef<HTMLDivElement>(null);
  const radialVeilRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const mode = useViewMode();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cleanups: Array<() => void> = [];
    cleanups.push(initMotionAttributes(section));

    if (ctaRef.current) {
      cleanups.push(magnetic(ctaRef.current));
    }

    if (mode !== "desktop") {
      ScrollTrigger.refresh();
      return () => {
        cleanups.forEach((c) => c());
      };
    }

    const blurWrap = blurWrapRef.current;
    const radialVeil = radialVeilRef.current;
    const heading = headingRef.current;
    const body = bodyRef.current;
    const lead = leadRef.current;
    const actions = actionsRef.current;

    if (!blurWrap || !radialVeil || !heading || !body || !actions) {
      return () => {
        cleanups.forEach((c) => c());
      };
    }

    const fadeTargets = [body, ...(lead ? [lead] : []), actions];

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      let split: Split | null = null;
      let tl: gsap.core.Timeline | null = null;
      let st: ScrollTrigger | null = null;
      let entered = false;
      let lastWidth = section.clientWidth;
      let resizeTimer = 0;

      // Initial entrance state set inside JS matchMedia only
      gsap.set(blurWrap, { filter: "blur(20px) saturate(0.6)" });
      gsap.set(radialVeil, { opacity: 1 });
      gsap.set([heading, ...fadeTargets], { opacity: 0 });

      const buildTimeline = (preserveProgress: boolean) => {
        st?.kill();
        tl?.kill();
        split?.revert();

        split = splitText(heading, { lines: true });
        gsap.set(heading, { clearProps: "opacity" });

        if (!preserveProgress) {
          gsap.set(split.lines, { yPercent: 110, opacity: 0 });
          gsap.set(fadeTargets, { y: 24, opacity: 0 });
        }

        tl = gsap.timeline({ paused: true });

        if (!preserveProgress) {
          tl.to(
            blurWrap,
            {
              filter: "blur(0px) saturate(1)",
              duration: 1.6,
              ease: "power2.out",
              onComplete: () => {
                gsap.set(blurWrap, { clearProps: "filter" });
              },
            },
            0,
          );
          tl.to(radialVeil, { opacity: 0, duration: 1.4, ease: "power2.out" }, 0);
        }

        tl.to(
          split.lines,
          { yPercent: 0, opacity: 1, duration: 0.9, ease: EASE.reveal, stagger: STAGGER.lines },
          0.2,
        );
        tl.to(body, { y: 0, opacity: 1, duration: 0.85, ease: EASE.reveal }, 0.32);
        if (lead) {
          tl.to(lead, { y: 0, opacity: 1, duration: 0.85, ease: EASE.reveal }, 0.45);
        }
        tl.to(actions, { y: 0, opacity: 1, duration: 0.85, ease: EASE.reveal }, lead ? 0.65 : 0.48);

        st = ScrollTrigger.create({
          trigger: section,
          start: "top 65%",
          once: true,
          onEnter: () => {
            entered = true;
            tl?.play();
          },
        });

        if (preserveProgress && entered) {
          gsap.set(blurWrap, { clearProps: "filter" });
          gsap.set(radialVeil, { opacity: 0 });
          tl.progress(1);
        }
      };

      void document.fonts.ready.then(() => {
        if (cancelled) return;
        buildTimeline(false);
        ScrollTrigger.refresh();
      });

      const onResize = () => {
        if (Math.abs(section.clientWidth - lastWidth) < 8) return;
        lastWidth = section.clientWidth;
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
        gsap.set([blurWrap, radialVeil, heading, ...fadeTargets], {
          clearProps: "transform,opacity,filter",
        });
      };
    });

    cleanups.push(() => mm.revert());

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [mode]);

  const animateMobile = mode === "mobile";
  const showRadialVeil = mode === "desktop";

  return (
    <section
      ref={sectionRef}
      id="closing"
      data-theme="dark"
      className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-clip bg-forest text-linen"
    >
      {/* Full-bleed image 03 with mobile "up" reveal or desktop one-time blur reveal wrapper */}
      <div
        {...(animateMobile ? { "data-reveal-image": "up" } : {})}
        className="pointer-events-none absolute inset-0 z-0 overflow-clip"
      >
        <div
          ref={blurWrapRef}
          className={mode === "desktop" ? "absolute -inset-6" : "absolute inset-0"}
        >
          <img
            src={img03.src["1672"]}
            alt={img03.alt}
            width={1672}
            height={941}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: `${img03.focal.xPct}% ${img03.focal.yPct}%` }}
          />
        </div>
      </div>

      {/* Strong dark-green overlay and bottom scrim for contrast >= 4.5:1 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ backgroundColor: "rgba(35, 45, 34, 0.7)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[75%]"
        style={{ background: "linear-gradient(to top, rgba(35, 45, 34, 0.78) 0%, rgba(35, 45, 34, 0.35) 55%, transparent 100%)" }}
      />

      {/* Soft static CSS-blurred green/taupe radial gradient faded out on desktop arrival */}
      {showRadialVeil && (
        <div
          ref={radialVeilRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 z-[15]"
          style={{
            background:
              "radial-gradient(circle at 55% 45%, rgba(173, 150, 128, 0.58) 0%, rgba(44, 56, 42, 0.9) 58%, rgba(35, 45, 34, 0.96) 100%)",
            filter: "blur(24px)",
          }}
        />
      )}

      {/* Bottom-left closing content */}
      <div className="relative z-20 flex w-full flex-col justify-end px-5 pb-20 pt-32 md:px-10 md:pb-24">
        <div className="max-w-[54rem]">
          <h2
            ref={headingRef}
            {...(animateMobile ? { "data-reveal": "lines" } : {})}
            className="font-serif text-[clamp(2.5rem,5.5vw,5.75rem)] leading-[1.03] text-linen"
          >
            {title}
          </h2>

          <div ref={bodyRef} className="mt-5 max-w-[42rem] space-y-3.5 font-sans text-[1.1667rem] leading-[1.52] text-linen/90">
            {paragraphs.map((paragraph, idx) => (
              <p key={idx} {...(animateMobile ? { "data-reveal": "lines" } : {})}>
                {paragraph}
              </p>
            ))}
          </div>

          {resolvedLead && (
            <p
              ref={leadRef}
              {...(animateMobile ? { "data-reveal": "lines" } : {})}
              className="mt-4 font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.2] text-linen"
            >
              {resolvedLead}
            </p>
          )}

          <div ref={actionsRef} className="mt-7">
            <VeilLink
              ref={ctaRef}
              to={BRAND.cta.href}
              aria-label={BRAND.cta.ariaLabel}
              data-cursor="link"
              className="inline-flex items-center rounded-full bg-linen px-6 py-3.5 font-sans text-[1.1667rem] font-medium text-forest transition-colors hover:bg-taupe hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-linen focus-visible:outline-offset-4"
            >
              {BRAND.cta.label}
              <ArrowUpRight className="ml-2" size={18} />
            </VeilLink>
            <p className="mt-3 font-sans text-[1.1667rem] text-linen/85">
              {BRAND.cta.micro}
            </p>
          </div>
        </div>
      </div>

      <span className="concept-chip pointer-events-none absolute bottom-4 left-5 z-20 md:bottom-6 md:left-10">
        {img03.label}
      </span>
    </section>
  );
}

