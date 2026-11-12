import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { home } from "@/content/copy";
import { images } from "@/content/images";
import { initMotionAttributes } from "@/motion/helpers";
import { splitText, type Split } from "@/motion/splitText";
import { EASE } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

type ViewMode = "desktop" | "mobile" | "reduced";

const SCENE_IDS = ["kitchen-detail", "dining-nook", "wine-bar"] as const;

const getViewMode = (): ViewMode => {
  if (typeof window === "undefined") return "mobile";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  if (window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return "desktop";
  return "mobile";
};

const byId = (id: string) => images.find((item) => item.id === id)!;

export function DetailsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrap03Ref = useRef<HTMLDivElement>(null);
  const wrap05Ref = useRef<HTMLDivElement>(null);
  const img04Ref = useRef<HTMLImageElement>(null);
  const img03Ref = useRef<HTMLImageElement>(null);
  const img05Ref = useRef<HTMLImageElement>(null);
  const momentRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const [mode, setMode] = useState<ViewMode>(getViewMode);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const next = getViewMode();
      setMode((prev) => (prev === next ? prev : next));
    };
    mqDesktop.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mqDesktop.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cleanups: Array<() => void> = [];
    cleanups.push(initMotionAttributes(section));

    if (mode !== "desktop") {
      ScrollTrigger.refresh();
      return () => {
        cleanups.forEach((c) => c());
      };
    }

    const stage = stageRef.current;
    const wrap03 = wrap03Ref.current;
    const wrap05 = wrap05Ref.current;
    const img04 = img04Ref.current;
    const img03 = img03Ref.current;
    const img05 = img05Ref.current;
    const m1El = momentRefs.current[0];
    const m2El = momentRefs.current[1];
    const m3El = momentRefs.current[2];
    const progressFill = progressFillRef.current;
    const [dot1, dot2, dot3] = dotRefs.current;

    if (!stage || !wrap03 || !wrap05 || !img04 || !img03 || !img05 || !m1El || !m2El || !m3El) {
      return () => {
        cleanups.forEach((c) => c());
      };
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      const splits: Split[] = [];
      let tl: gsap.core.Timeline | null = null;

      gsap.set([m2El, m3El], { opacity: 0 });
      gsap.set(wrap03, { clipPath: "inset(0 0 0 100%)" });
      gsap.set(wrap05, { clipPath: "inset(0 0 0 100%)" });

      void document.fonts.ready.then(() => {
        if (cancelled) return;

        const s1 = splitText(m1El, { lines: true });
        const s2 = splitText(m2El, { lines: true });
        const s3 = splitText(m3El, { lines: true });
        splits.push(s1, s2, s3);

        gsap.set([m2El, m3El], { clearProps: "opacity" });
        gsap.set(img04, { scale: 1.08 });
        gsap.set(wrap03, { clipPath: "inset(0 0 0 100%)" });
        gsap.set(img03, { scale: 1.12, yPercent: 0 });
        gsap.set(wrap05, { clipPath: "inset(0 0 0 100%)" });
        gsap.set(img05, { scale: 1.12, yPercent: 0 });

        gsap.set(s1.lines, { yPercent: 0, opacity: 1 });
        gsap.set(s2.lines, { yPercent: 105, opacity: 0 });
        gsap.set(s3.lines, { yPercent: 105, opacity: 0 });

        if (progressFill) gsap.set(progressFill, { scaleX: 0 });
        if (dot1) gsap.set(dot1, { scale: 1.4, opacity: 1 });
        if (dot2) gsap.set(dot2, { scale: 1, opacity: 0.45 });
        if (dot3) gsap.set(dot3, { scale: 1, opacity: 0.45 });

        tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${window.innerHeight * 3}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Anchor full 0..100 span with scrubbed progress bar
        if (progressFill) {
          tl.to(progressFill, { scaleX: 1, duration: 100, ease: "none" }, 0);
        } else {
          tl.to({}, { duration: 100 }, 0);
        }

        // 30–37%: reveal image 03 from right + swap moment 1 -> moment 2 + dot 1 -> dot 2
        tl.to(wrap03, { clipPath: "inset(0 0 0 0%)", duration: 7, ease: EASE.wipe }, 30);
        tl.to(img03, { scale: 1, duration: 7, ease: EASE.wipe }, 30);
        tl.to(s1.lines, { yPercent: -105, opacity: 0, duration: 3.5, stagger: 0.4, ease: EASE.soft }, 30);
        tl.to(s2.lines, { yPercent: 0, opacity: 1, duration: 4, stagger: 0.4, ease: EASE.soft }, 33);
        if (dot1) tl.to(dot1, { scale: 1, opacity: 0.45, duration: 4, ease: EASE.soft }, 30);
        if (dot2) tl.to(dot2, { scale: 1.4, opacity: 1, duration: 4, ease: EASE.soft }, 33);

        // 37–63%: hold while image 03 drifts gently upward
        tl.to(img03, { yPercent: -3, duration: 26, ease: "none" }, 37);

        // 63–70%: reveal image 05 from right + swap moment 2 -> moment 3 + dot 2 -> dot 3
        tl.to(wrap05, { clipPath: "inset(0 0 0 0%)", duration: 7, ease: EASE.wipe }, 63);
        tl.to(img05, { scale: 1, duration: 7, ease: EASE.wipe }, 63);
        tl.to(s2.lines, { yPercent: -105, opacity: 0, duration: 3.5, stagger: 0.4, ease: EASE.soft }, 63);
        tl.to(s3.lines, { yPercent: 0, opacity: 1, duration: 4, stagger: 0.4, ease: EASE.soft }, 66);
        if (dot2) tl.to(dot2, { scale: 1, opacity: 0.45, duration: 4, ease: EASE.soft }, 63);
        if (dot3) tl.to(dot3, { scale: 1.4, opacity: 1, duration: 4, ease: EASE.soft }, 66);

        ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        tl?.scrollTrigger?.kill();
        tl?.kill();
        splits.forEach((s) => s.revert());
      };
    });

    return () => {
      cleanups.forEach((c) => c());
      mm.revert();
    };
  }, [mode]);

  const img04 = byId("kitchen-detail");
  const img03 = byId("dining-nook");
  const img05 = byId("wine-bar");

  if (mode !== "desktop") {
    const animateMobile = mode === "mobile";
    return (
      <section ref={sectionRef} id="details" data-theme="dark" className="relative bg-forest text-linen">
        {SCENE_IDS.map((id, idx) => {
          const item = byId(id);
          const moment = home.details.moments[idx];
          return (
            <div key={id} className="relative min-h-[100svh] w-full overflow-clip bg-forest">
              <div
                {...(animateMobile ? { "data-reveal-image": "up" } : {})}
                className="absolute inset-0 overflow-clip"
              >
                <img
                  src={item.src["1672"]}
                  alt={item.alt}
                  width={1672}
                  height={941}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: `${item.focal.xPct}% ${item.focal.yPct}%` }}
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(35, 45, 34, 0.78) 0%, rgba(35, 45, 34, 0.42) 48%, transparent 100%)",
                }}
              />
              <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-5 pb-20 pt-28 md:px-10 md:pb-24">
                <div className="max-w-[38rem]">
                  {idx === 0 && (
                    <h2
                      {...(animateMobile ? { "data-reveal": "lines" } : {})}
                      className="font-serif text-[clamp(2.75rem,6vw,6.5rem)] leading-[1.04] text-linen"
                    >
                      {home.details.title}
                    </h2>
                  )}
                  <p
                    {...(animateMobile ? { "data-reveal": "lines" } : {})}
                    className={`${idx === 0 ? "mt-5" : ""} font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.25] text-linen`}
                  >
                    {moment}
                  </p>
                </div>
              </div>
              <span className="concept-chip absolute bottom-4 left-5 z-20 md:bottom-6 md:left-10">
                {item.label}
              </span>
            </div>
          );
        })}
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="details" data-theme="dark" className="relative bg-forest text-linen">
      <div ref={stageRef} className="relative h-[100svh] min-h-[100svh] w-full overflow-clip bg-forest">
        {/* Image 04: base full-bleed scene */}
        <div className="absolute inset-0 z-0 overflow-clip">
          <img
            ref={img04Ref}
            src={img04.src["1672"]}
            alt={img04.alt}
            width={1672}
            height={941}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: `${img04.focal.xPct}% ${img04.focal.yPct}%` }}
          />
        </div>

        {/* Image 03: wipes in from right at 30-37%, drifts yPercent 0 -> -3 over 37-63% */}
        <div ref={wrap03Ref} className="absolute inset-0 z-[1] overflow-clip">
          <img
            ref={img03Ref}
            src={img03.src["1672"]}
            alt={img03.alt}
            width={1672}
            height={941}
            loading="eager"
            decoding="async"
            className="absolute left-0 -top-[3%] h-[106%] w-full object-cover"
            style={{ objectPosition: `${img03.focal.xPct}% ${img03.focal.yPct}%` }}
          />
        </div>

        {/* Image 05: wipes in from right at 63-70% */}
        <div ref={wrap05Ref} className="absolute inset-0 z-[2] overflow-clip">
          <img
            ref={img05Ref}
            src={img05.src["1672"]}
            alt={img05.alt}
            width={1672}
            height={941}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ objectPosition: `${img05.focal.xPct}% ${img05.focal.yPct}%` }}
          />
        </div>

        {/* Bottom-up dark scrim */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to top, rgba(35, 45, 34, 0.78) 0%, rgba(35, 45, 34, 0.42) 48%, transparent 100%)",
          }}
        />

        {/* Bottom-left heading + rotating moment line */}
        <div className="relative z-20 flex h-full flex-col justify-end px-10 pb-24">
          <div className="max-w-[38rem]">
            <h2
              data-reveal="lines"
              className="font-serif text-[clamp(2.75rem,6vw,6.5rem)] leading-[1.04] text-linen"
            >
              {home.details.title}
            </h2>
            <div className="mt-5 grid">
              {home.details.moments.map((moment, idx) => (
                <p
                  key={moment}
                  ref={(el) => {
                    momentRefs.current[idx] = el;
                  }}
                  className="col-start-1 row-start-1 font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.25] text-linen"
                >
                  {moment}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-left Concept visualization caption */}
        <span className="concept-chip absolute bottom-6 left-10 z-20">
          {img04.label}
        </span>

        {/* Thin 1px taupe progress line with three dots near bottom-centre */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center"
        >
          <div className="relative h-px w-48 bg-taupe/35">
            <span
              ref={progressFillRef}
              className="absolute inset-0 block origin-left bg-taupe"
            />
            {[0, 1, 2].map((dotIdx) => (
              <span
                key={dotIdx}
                ref={(el) => {
                  dotRefs.current[dotIdx] = el;
                }}
                className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-taupe"
                style={{ left: `${dotIdx * 50}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
