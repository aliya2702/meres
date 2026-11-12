import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClosingSection } from "@/components/ClosingSection";
import { ServicesShowcase } from "@/components/services/ServicesShowcase";
import { services } from "@/content/copy";
import { images } from "@/content/images";
import { scrollToTarget } from "@/motion/smooth";
import { splitText, type Split } from "@/motion/splitText";
import { EASE, MQ } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

const img05 = images.find((item) => item.id === "wine-bar")!;

function triggerAnchorGlide(id: string) {
  window.history.replaceState(null, "", `/services#${id}`);
  scrollToTarget(`#${id}`, {
    duration: 1.4,
    offset: -96,
    onComplete: () => {
      window.dispatchEvent(new CustomEvent("meres:anchor-replay", { detail: { id } }));
    },
  });
}

function RollingAnchorLink({
  id,
  label,
  linkRef,
}: {
  id: string;
  label: string;
  linkRef: (el: HTMLAnchorElement | null) => void;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    triggerAnchorGlide(id);
  };

  return (
    <a
      ref={linkRef}
      href={`#${id}`}
      onClick={handleClick}
      data-cursor="link"
      className="group inline-flex flex-col font-sans text-[1.1667rem] font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest lg:text-linen lg:focus-visible:outline-linen"
    >
      <span className="relative inline-flex overflow-hidden leading-[1.3]">
        <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-visible:translate-y-0">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 inline-block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:hidden"
        >
          {label}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="mt-1 block h-px w-full overflow-hidden bg-ink/25 lg:bg-linen/30"
      >
        <span className="block h-full w-full origin-left scale-x-0 bg-ink transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 lg:bg-linen motion-reduce:transition-none" />
      </span>
    </a>
  );
}

function ServicesOpeningSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const leadLinksWrapRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const parasWrapRef = useRef<HTMLDivElement>(null);
  const paraRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const captionRef = useRef<HTMLSpanElement>(null);

  const [isLg, setIsLg] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : true,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLg(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const clipEl = clipRef.current;
    const imgEl = imgRef.current;
    const titleWrap = titleWrapRef.current;
    const h1 = h1Ref.current;
    const leadLinksWrap = leadLinksWrapRef.current;
    const leadEl = leadRef.current;
    const parasWrap = parasWrapRef.current;
    const captionEl = captionRef.current;
    const paraEls = paraRefs.current.filter((el): el is HTMLParagraphElement => Boolean(el));
    const linkEls = linkRefs.current.filter((el): el is HTMLAnchorElement => Boolean(el));

    if (
      !section ||
      !clipEl ||
      !imgEl ||
      !titleWrap ||
      !h1 ||
      !leadLinksWrap ||
      !leadEl ||
      !parasWrap ||
      !captionEl
    ) {
      return;
    }

    const mm = gsap.matchMedia();

    // Entrance animation: runs on both desktop and mobile when motion is preferred
    mm.add(MQ.motion, () => {
      let cancelled = false;
      let tl: gsap.core.Timeline | null = null;
      const splits: Split[] = [];

      gsap.set(clipEl, { clipPath: "inset(8% 8% 8% 8%)" });
      gsap.set(imgEl, { scale: 1.15 });
      gsap.set([h1, ...paraEls], { opacity: 0 });
      gsap.set(leadEl, { y: 16, opacity: 0 });
      gsap.set(linkEls, { y: 14, opacity: 0 });
      gsap.set(captionEl, { y: 10, opacity: 0 });

      void document.fonts.ready.then(() => {
        if (cancelled) return;

        const h1Split = splitText(h1, { lines: true });
        splits.push(h1Split);
        gsap.set(h1, { clearProps: "opacity" });
        gsap.set(h1Split.lines, { yPercent: 105, opacity: 0 });

        const paraLineTargets: HTMLElement[] = [];
        paraEls.forEach((pEl) => {
          const pSplit = splitText(pEl, { lines: true });
          splits.push(pSplit);
          gsap.set(pEl, { clearProps: "opacity" });
          gsap.set(pSplit.lines, { yPercent: 105, opacity: 0 });
          paraLineTargets.push(...pSplit.lines);
        });

        tl = gsap.timeline();

        // t=0: clip-path inset(8%) -> inset(0) over 1.5s power3.inOut; inner image 1.15 -> 1.0 over 1.9s power3.out
        tl.to(clipEl, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EASE.wipe }, 0);
        tl.to(imgEl, { scale: 1, duration: 1.9, ease: EASE.reveal }, 0);

        // t=0.5s: h1 masked lines rise (0.9s, stagger 0.1, power3.out)
        tl.to(
          h1Split.lines,
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: EASE.reveal },
          0.5,
        );

        // t=1.2s: lead fades up (y 16 -> 0, 0.7s)
        tl.to(leadEl, { y: 0, opacity: 1, duration: 0.7, ease: EASE.reveal }, 1.2);

        // t=1.4s: two paragraphs rise by lines (stagger 0.08)
        tl.to(
          paraLineTargets,
          { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: EASE.reveal },
          1.4,
        );

        // t=1.8s: four links fade up in sequence (stagger 0.08)
        tl.to(linkEls, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: EASE.reveal }, 1.8);

        // Caption fades in last
        tl.to(captionEl, { y: 0, opacity: 1, duration: 0.65, ease: EASE.reveal }, 2.15);
      });

      return () => {
        cancelled = true;
        tl?.kill();
        splits.forEach((s) => s.revert());
        gsap.set([clipEl, imgEl, h1, leadEl, ...paraEls, ...linkEls, captionEl], {
          clearProps: "transform,opacity,clipPath",
        });
      };
    });

    // Desktop scroll: image yPercent 0 -> 8 (scrub 1), text block y 0 -> -40 and opacity -> 0.3 over first 60%
    mm.add(`${MQ.desktopFine} and ${MQ.motion}`, () => {
      const textBlocks = [titleWrap, leadLinksWrap, parasWrap];
      gsap.set(imgEl, { yPercent: 0 });
      gsap.set(textBlocks, { y: 0, opacity: 1 });

      const imgTween = gsap.to(imgEl, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const textTween = gsap.to(textBlocks, {
        y: -40,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "60% top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();

      return () => {
        imgTween.scrollTrigger?.kill();
        imgTween.kill();
        textTween.scrollTrigger?.kill();
        textTween.kill();
        gsap.set([imgEl, ...textBlocks], { clearProps: "yPercent,y,opacity" });
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative grid grid-cols-1 overflow-x-clip bg-linen text-ink lg:min-h-[100svh] lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto] lg:bg-forest lg:text-linen"
    >
      {/* Visual layer: 70svh top stage on mobile, full-bleed 100svh background on desktop */}
      <div className="relative col-start-1 row-start-1 h-[70svh] w-full overflow-clip bg-forest lg:absolute lg:inset-0 lg:col-span-12 lg:row-span-3 lg:h-full">
        <div ref={clipRef} className="h-full w-full overflow-clip">
          <img
            ref={imgRef}
            src={img05.src["1672"]}
            alt={img05.alt}
            width={img05.width}
            height={img05.height}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="absolute inset-x-0 -top-[9%] h-[110%] w-full object-cover"
            style={{ objectPosition: `${img05.focal.xPct}% ${img05.focal.yPct}%` }}
          />
        </div>

        {/* Top clearance gradient for floating header */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32"
          style={{ background: "linear-gradient(to bottom, rgba(35, 45, 34, 0.45), transparent)" }}
        />

        {/* Bottom-left & bottom scrim for high text contrast */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(35, 45, 34, 0.84) 0%, rgba(35, 45, 34, 0.56) 46%, rgba(35, 45, 34, 0.18) 100%), linear-gradient(to right, rgba(35, 45, 34, 0.48) 0%, rgba(35, 45, 34, 0.18) 55%, transparent 100%)",
          }}
        />
      </div>

      {/* Title overlaid on the scrim (mobile inside 70svh, desktop bottom-left) + bottom-right Concept chip */}
      <div className="static col-start-1 row-start-1 z-20 flex flex-col self-end px-[clamp(1.5rem,5vw,5rem)] pb-[clamp(2rem,7svh,5rem)] pt-28 text-linen lg:col-span-6 lg:row-start-2 lg:pb-0 lg:pr-8 lg:pt-32">
        <div ref={titleWrapRef}>
          <h1
            ref={h1Ref}
            className="max-w-[54rem] font-serif text-[clamp(3rem,8vw,8rem)] leading-[1.02] text-linen"
          >
            {services.title}
          </h1>
        </div>
        <span
          ref={captionRef}
          className="concept-chip pointer-events-none order-first mb-4 self-start lg:order-none lg:mb-0 lg:absolute lg:bottom-5 lg:right-5"
        >
          {img05.label}
        </span>
      </div>

      {/* Lead + 4 rolling links: on linen on mobile, over scrim bottom-left on desktop */}
      <div
        ref={leadLinksWrapRef}
        data-theme={isLg ? undefined : "light"}
        className="col-start-1 row-start-2 z-20 bg-linen px-[clamp(1.5rem,5vw,5rem)] pb-6 pt-8 text-ink lg:col-span-6 lg:row-start-3 lg:bg-transparent lg:pb-[clamp(2rem,7svh,5rem)] lg:pr-8 lg:pt-6 lg:text-linen"
      >
        <p
          ref={leadRef}
          className="max-w-[36rem] font-sans text-[1.1667rem] font-medium leading-[1.52] text-ink lg:text-linen"
        >
          {services.lead}
        </p>

        <nav
          aria-label="Service sections"
          className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3"
        >
          {services.sections.map((section, idx) => (
            <RollingAnchorLink
              key={section.id}
              id={section.id}
              label={section.title}
              linkRef={(el) => {
                linkRefs.current[idx] = el;
              }}
            />
          ))}
        </nav>
      </div>

      {/* Two intro paragraphs: stacked on linen on mobile, two columns right-bottom on desktop */}
      <div
        ref={parasWrapRef}
        data-theme={isLg ? undefined : "light"}
        className="col-start-1 row-start-3 z-20 bg-linen px-[clamp(1.5rem,5vw,5rem)] pb-12 pt-4 text-ink lg:col-start-7 lg:col-span-6 lg:row-start-2 lg:row-span-2 lg:self-end lg:bg-transparent lg:pb-[clamp(4.25rem,7.5svh,5.5rem)] lg:pl-4 lg:pr-[clamp(1.5rem,5vw,5rem)] lg:pt-0 lg:text-linen"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7">
          {services.paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              ref={(el) => {
                paraRefs.current[idx] = el;
              }}
              className="max-w-[28rem] font-sans text-[1.1667rem] leading-[1.58] text-ink/90 lg:text-linen/90"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <ServicesOpeningSection />
      <ServicesShowcase variant="page" />
      <ClosingSection
        title={services.closing.title}
        paragraphs={services.closing.paragraphs}
      />
    </>
  );
}
