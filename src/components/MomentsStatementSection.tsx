import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { home } from "@/content/copy";
import { images } from "@/content/images";
import { initMotionAttributes } from "@/motion/helpers";
import { splitText, type Split } from "@/motion/splitText";
import { EASE } from "@/motion/tokens";
import { useViewMode } from "@/motion/useViewMode";

gsap.registerPlugin(ScrollTrigger);

type BoxConfig = {
  id: string;
  parallax: string;
  clipFrom: string;
  desktopClass: string;
  aspectClass: string;
  captionClass: string;
};

const BOXES: readonly BoxConfig[] = [
  {
    id: "kitchen-detail",
    parallax: "0.04",
    clipFrom: "inset(0 100% 0 0)",
    desktopClass: "lg:absolute lg:left-[2.5vw] lg:bottom-[5vh] lg:z-10 lg:w-[22vw]",
    aspectClass: "aspect-[4/5]",
    captionClass: "bottom-3 left-3",
  },
  {
    id: "kitchen-wide",
    parallax: "0.08",
    clipFrom: "inset(0 0 0 100%)",
    desktopClass: "lg:absolute lg:right-[2.5vw] lg:top-[6.5vh] lg:z-10 lg:w-[30vw]",
    aspectClass: "aspect-[16/9]",
    captionClass: "bottom-3 left-3",
  },
  {
    id: "second-kitchen",
    parallax: "0.06",
    clipFrom: "inset(100% 0 0 0)",
    desktopClass: "lg:absolute lg:right-[6vw] lg:bottom-[5vh] lg:z-10 lg:w-[14vw]",
    aspectClass: "aspect-square",
    captionClass: "bottom-2.5 left-2.5 max-w-[calc(100%-1.25rem)] leading-[1.15]",
  },
] as const;

const byId = (id: string) => images.find((item) => item.id === id)!;

export function MomentsStatementSection({ zIndex }: { zIndex: number }) {
  const panelRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imgRefs = useRef<Array<HTMLImageElement | null>>([]);

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

    const textBlock = textBlockRef.current;
    const statement = statementRef.current;
    const frames = frameRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const imgs = imgRefs.current.filter((el): el is HTMLImageElement => Boolean(el));

    if (!textBlock || !statement || frames.length !== BOXES.length || imgs.length !== BOXES.length) {
      return () => {
        cleanups.forEach((c) => c());
      };
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      let split: Split | null = null;
      let ctx: gsap.Context | null = null;

      frames.forEach((frame, idx) => {
        gsap.set(frame, { clipPath: BOXES[idx].clipFrom });
      });
      gsap.set(imgs, { scale: 1.2 });

      const clipTrigger = ScrollTrigger.create({
        trigger: panel,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(frames, {
            clipPath: "inset(0 0 0 0)",
            duration: 1.4,
            ease: EASE.wipe,
            stagger: 0.15,
          });
          gsap.to(imgs, {
            scale: 1,
            duration: 1.6,
            ease: EASE.reveal,
            stagger: 0.15,
          });
        },
      });

      void document.fonts.ready.then(() => {
        if (cancelled) return;
        split = splitText(statement, { chars: false });
        ctx = gsap.context(() => {
          gsap.set(split!.words, { opacity: 0.25 });
          gsap.to(split!.words, {
            opacity: 1,
            duration: 0.3,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: textBlock,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          });
        }, textBlock);
        ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        clipTrigger.kill();
        ctx?.revert();
        split?.revert();
        gsap.set(frames, { clearProps: "clipPath" });
        gsap.set(imgs, { clearProps: "transform" });
      };
    });

    cleanups.push(() => mm.revert());

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [mode]);

  return (
    <Panel panelRef={panelRef} id="direction" zIndex={zIndex} background="var(--linen)" theme="light">
      <div className="relative flex min-h-[100svh] w-full flex-col justify-center bg-linen px-5 pb-16 pt-28 text-ink lg:h-full lg:px-10 lg:pb-0 lg:pt-0">
        <div ref={textBlockRef} className="relative z-20 mx-auto w-full text-center lg:pt-[8vh]">
          <h2
            ref={statementRef}
            {...(mode === "mobile" ? { "data-reveal": "lines" } : {})}
            className="mx-auto max-w-[22ch] font-serif text-[clamp(2rem,4.2vw,4.5rem)] leading-[1.08] text-ink lg:max-w-[min(22ch,46vw)]"
          >
            {home.details.statement}
          </h2>
          <p
            {...(mode === "mobile" ? { "data-reveal": "lines" } : {})}
            className="mx-auto mt-6 max-w-[40rem] font-sans text-[1.1667rem] leading-[1.6] text-ink/85 lg:max-w-[min(40rem,46vw)]"
          >
            {home.details.body}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-6 lg:contents">
          {BOXES.map((box, idx) => {
            const item = byId(box.id);
            const isDesktop = mode === "desktop";
            const isMobile = mode === "mobile";

            return (
              <figure key={box.id} className={`w-full ${box.desktopClass}`}>
                <div
                  ref={(el) => { frameRefs.current[idx] = el; }}
                  {...(isMobile ? { "data-reveal-image": "up" } : {})}
                  className={`relative w-full overflow-clip bg-taupe/20 ${box.aspectClass}`}
                >
                  <div
                    {...(isDesktop ? { "data-parallax": box.parallax } : {})}
                    className="h-full w-full"
                  >
                    <div
                      {...(isDesktop ? { "data-parallax-inner": "" } : {})}
                      className={isDesktop ? "relative -top-[7%] h-[114%] w-full" : "h-full w-full"}
                    >
                      <img
                        ref={(el) => { imgRefs.current[idx] = el; }}
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
                  </div>
                  <figcaption className={`concept-chip pointer-events-none absolute z-10 ${box.captionClass}`}>
                    {item.label}
                  </figcaption>
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

