import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { VeilLink } from "@/components/VeilLink";
import { home } from "@/content/copy";
import { images } from "@/content/images";
import { initMotionAttributes } from "@/motion/helpers";
import { useViewMode } from "@/motion/useViewMode";

gsap.registerPlugin(ScrollTrigger);

const FRAME_CONFIGS = [
  {
    id: "second-kitchen",
    paragraphs: [home.yes.paragraphs[0]],
    includeLink: false,
  },
  {
    id: "kitchen-wide",
    paragraphs: [home.yes.paragraphs[1]],
    includeLink: false,
  },
  {
    id: "wine-bar",
    paragraphs: [home.yes.paragraphs[2], home.yes.paragraphs[3]],
    includeLink: true,
  },
] as const;

const byId = (id: string) => images.find((item) => item.id === id)!;

export function YesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const innerImgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const paraGroupRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressFillRef = useRef<HTMLSpanElement>(null);

  const mode = useViewMode();

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
    const track = trackRef.current;
    const frames = frameRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const imgs = innerImgRefs.current.filter((el): el is HTMLImageElement => Boolean(el));
    const paraGroups = paraGroupRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const progressFill = progressFillRef.current;

    if (!stage || !track || frames.length < 3 || imgs.length < 3 || paraGroups.length < 3) {
      return () => {
        cleanups.forEach((c) => c());
      };
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(track, { x: 0 });
      gsap.set(frames[0], { opacity: 1 });
      gsap.set([frames[1], frames[2]], { opacity: 0.45 });
      gsap.set(imgs, { xPercent: -3 });
      gsap.set(paraGroups[0], { y: 0, opacity: 1, pointerEvents: "auto" });
      gsap.set([paraGroups[1], paraGroups[2]], { y: 24, opacity: 0, pointerEvents: "none" });
      if (progressFill) gsap.set(progressFill, { scaleX: 0 });

      const getDistance = () => {
        const stride = frames[1].offsetLeft - frames[0].offsetLeft;
        return -stride * (frames.length - 1);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const p1 = Number(gsap.getProperty(paraGroups[1], "opacity"));
            const p2 = Number(gsap.getProperty(paraGroups[2], "opacity"));
            paraGroups[0].style.pointerEvents = p1 < 0.5 && p2 < 0.5 ? "auto" : "none";
            paraGroups[1].style.pointerEvents = p1 >= 0.5 && p2 < 0.5 ? "auto" : "none";
            paraGroups[2].style.pointerEvents = p2 >= 0.5 ? "auto" : "none";
          },
        },
      });

      // Full-span horizontal track scrub, 6% opposite inner image drift, and bottom progress fill
      tl.to(track, { x: getDistance, ease: "none", duration: 100 }, 0);
      tl.to(imgs, { xPercent: 3, ease: "none", duration: 100 }, 0);
      if (progressFill) {
        tl.to(progressFill, { scaleX: 1, ease: "none", duration: 100 }, 0);
      }

      // Transition 0 -> 1
      tl.to(frames[0], { opacity: 0.45, duration: 24, ease: "none" }, 14);
      tl.to(frames[1], { opacity: 1, duration: 24, ease: "none" }, 14);
      tl.to(paraGroups[0], { y: -24, opacity: 0, duration: 10, ease: "power3.out" }, 18);
      tl.to(paraGroups[1], { y: 0, opacity: 1, duration: 12, ease: "power3.out" }, 28);

      // Transition 1 -> 2
      tl.to(frames[1], { opacity: 0.45, duration: 24, ease: "none" }, 62);
      tl.to(frames[2], { opacity: 1, duration: 24, ease: "none" }, 62);
      tl.to(paraGroups[1], { y: -24, opacity: 0, duration: 10, ease: "power3.out" }, 64);
      tl.to(paraGroups[2], { y: 0, opacity: 1, duration: 12, ease: "power3.out" }, 74);

      ScrollTrigger.refresh();

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([track, ...frames, ...imgs, ...paraGroups], { clearProps: "all" });
        if (progressFill) gsap.set(progressFill, { clearProps: "all" });
      };
    });

    cleanups.push(() => mm.revert());

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [mode]);

  if (mode !== "desktop") {
    const animateMobile = mode === "mobile";

    return (
      <section ref={sectionRef} id="yes" data-theme="dark" className="relative bg-forest px-5 pb-20 pt-28 text-linen md:px-10">
        <div className="mx-auto max-w-4xl">
          <h2
            {...(animateMobile ? { "data-reveal": "lines" } : {})}
            className="font-serif text-[clamp(2.5rem,5.5vw,6rem)] leading-[1.03] text-linen"
          >
            {home.yes.title}
          </h2>

          <div className="mt-10 flex flex-col gap-14">
            {FRAME_CONFIGS.map((frame) => {
              const item = byId(frame.id);
              return (
                <article key={frame.id} className="relative">
                  <div className="relative pb-3 pr-3">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 border border-taupe/65"
                    />
                    <div
                      {...(animateMobile ? { "data-reveal-image": "up" } : {})}
                      className="relative z-10 aspect-[16/10] w-full overflow-clip bg-taupe/20"
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
                      <span className="concept-chip pointer-events-none absolute bottom-3 left-3 z-20">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {frame.paragraphs.map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        {...(animateMobile ? { "data-reveal": "lines" } : {})}
                        className="font-sans text-[1.1667rem] leading-[1.6] text-linen/90"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {frame.includeLink && (
                    <div className="mt-6">
                      <VeilLink
                        to="/approach"
                        className="inline-flex items-center gap-1.5 font-sans text-[1.1667rem] font-medium text-taupe transition-colors hover:text-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-linen focus-visible:outline-offset-4"
                      >
                        {home.yes.linkLabel}
                        <ArrowUpRight size={18} />
                      </VeilLink>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="yes" data-theme="dark" className="relative bg-forest text-linen">
      <div ref={stageRef} className="relative h-[100svh] min-h-[100svh] w-full overflow-clip bg-forest">
        {/* Horizontal track of three 62vw x 62svh framed photos spaced so the next frame peeks ~8vw at right */}
        <div
          ref={trackRef}
          className="absolute inset-y-0 left-0 flex items-start gap-[22vw] pl-[8vw] pt-[10svh]"
        >
          {FRAME_CONFIGS.map((frame, idx) => {
            const item = byId(frame.id);
            return (
              <div
                key={frame.id}
                ref={(el) => { frameRefs.current[idx] = el; }}
                className="relative h-[62svh] w-[62vw] shrink-0"
              >
                {/* 1px taupe border offset by 12px */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border border-taupe/70"
                  style={{ transform: "translate(12px, 12px)" }}
                />

                {/* Photo container */}
                <div className="relative z-10 h-full w-full overflow-clip bg-taupe/20">
                  <img
                    ref={(el) => { innerImgRefs.current[idx] = el; }}
                    src={item.src["1672"]}
                    alt={item.alt}
                    width={1672}
                    height={941}
                    loading="eager"
                    decoding="async"
                    className="relative -left-[5%] h-full w-[110%] max-w-none object-cover"
                    style={{ objectPosition: `${item.focal.xPct}% ${item.focal.yPct}%` }}
                  />

                  {/* Scrim behind overlapping lower-left heading and caption */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(35, 45, 34, 0.78) 0%, rgba(35, 45, 34, 0.42) 48%, transparent 82%), linear-gradient(to right, rgba(35, 45, 34, 0.72) 0%, rgba(35, 45, 34, 0.3) 38%, transparent 65%)",
                    }}
                  />

                  <span className="concept-chip pointer-events-none absolute bottom-3 left-4 z-20">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed overlapping lower-left heading */}
        <div className="pointer-events-none absolute bottom-[34svh] left-[3vw] z-30 max-w-[16ch]">
          <h2 className="font-serif text-[clamp(2.5rem,5.5vw,6rem)] leading-[1.01] text-linen">
            {home.yes.title}
          </h2>
        </div>

        {/* Right-hand paragraph cross-fade stage anchored at bottom-right below the peeking frame */}
        <div className="absolute bottom-[9svh] right-[3vw] z-30 w-[26vw] min-w-[260px]">
          {FRAME_CONFIGS.map((frame, idx) => (
            <div
              key={frame.id}
              ref={(el) => { paraGroupRefs.current[idx] = el; }}
              className="absolute inset-x-0 bottom-0"
            >
              <div className="space-y-3">
                {frame.paragraphs.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="font-sans text-[1rem] leading-[1.52] text-linen/90 xl:text-[1.0625rem]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {frame.includeLink && (
                <div className="mt-4">
                  <VeilLink
                    to="/approach"
                    data-cursor="link"
                    className="inline-flex items-center gap-1.5 font-sans text-[1.0625rem] font-medium text-taupe transition-colors hover:text-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-linen focus-visible:outline-offset-4"
                  >
                    {home.yes.linkLabel}
                    <ArrowUpRight size={17} />
                  </VeilLink>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Subtle 1px scroll progress bar near bottom-centre */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 z-30 h-px w-[min(16rem,28vw)] -translate-x-1/2 overflow-hidden bg-taupe/30"
        >
          <span
            ref={progressFillRef}
            className="block h-full w-full origin-left bg-linen"
          />
        </div>
      </div>
    </section>
  );
}
