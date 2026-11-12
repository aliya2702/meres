import { forwardRef, useEffect, useImperativeHandle, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MeresMark } from "@/components/MeresMark";
import { BRAND, home, services } from "@/content/copy";
import { images } from "@/content/images";
import { scrollToTarget } from "@/motion/smooth";
import { splitText, type Split } from "@/motion/splitText";
import { EASE, MQ } from "@/motion/tokens";
import { useViewMode } from "@/motion/useViewMode";

gsap.registerPlugin(ScrollTrigger);

export const INTRO_UNITS = 12;
export const INTRO_ANCHOR_TIME = 9;

const img05 = images.find((item) => item.id === "wine-bar")!;

export type ServicesIntroRefs = {
  titleScreen: HTMLDivElement | null;
  glowWrap: HTMLDivElement | null;
  glowTaupe: HTMLDivElement | null;
  glowLinen: HTMLDivElement | null;
  heroWord: HTMLDivElement | null;
  heroCaption: HTMLParagraphElement | null;
  stripLayer: HTMLDivElement | null;
  stripImg: HTMLImageElement | null;
  panel: HTMLDivElement | null;
  panelH1: HTMLHeadingElement | null;
  panelLead: HTMLParagraphElement | null;
  panelParas: Array<HTMLParagraphElement | null>;
  panelHairlines: Array<HTMLSpanElement | null>;
  panelLinkRows: Array<HTMLAnchorElement | null>;
};

export type ServicesIntroHandle = {
  setInitialPinnedStates: () => void;
  resetPinnedProps: () => void;
  buildIntroTimeline: (tl: gsap.core.Timeline, startUnit?: number) => () => void;
};

type ServicesIntroProps = {
  standalone?: boolean;
  isPinnedMode?: boolean;
  onSelectService?: (index: number, id: string) => void;
  onPanelFocus?: () => void;
};

function IntroRollingLink({
  label,
  href,
  isInkOnLinen,
  linkRef,
  onSelect,
}: {
  label: string;
  href: string;
  isInkOnLinen: boolean;
  linkRef: (el: HTMLAnchorElement | null) => void;
  onSelect?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      ref={linkRef}
      href={href}
      onClick={onSelect}
      data-cursor="link"
      className={`group flex w-full items-center justify-between py-[clamp(0.45rem,1.1vh,0.85rem)] font-serif text-[clamp(1.125rem,min(1.65vw,2.35vh),1.85rem)] leading-[1.3] transition-colors ${
        isInkOnLinen
          ? "text-ink hover:text-forest focus-visible:outline-forest"
          : "text-linen hover:text-taupe focus-visible:outline-linen"
      }`}
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
    </a>
  );
}

/**
 * Adds the 12-unit Services Intro sequence (title hold, strip peek/widen, panel reveal)
 * to a given GSAP master timeline and returns a cleanup callback for text splits.
 */
export function buildIntroTimeline(
  refs: ServicesIntroRefs,
  tl: gsap.core.Timeline,
  startUnit = 0,
): () => void {
  const splits: Split[] = [];

  // Screen 1 -> 2 Strip: peek (t+3.0 -> t+4.5), widen to full-bleed (t+4.5 -> t+7.0), hold (t+7.0 -> t+7.5)
  if (refs.stripLayer) {
    tl.to(
      refs.stripLayer,
      { clipPath: "inset(0% 0% 0% 80%)", duration: 1.5, ease: EASE.wipe },
      startUnit + 3.0,
    );
    tl.to(
      refs.stripLayer,
      { clipPath: "inset(0% 0% 0% 0%)", duration: 2.5, ease: EASE.wipe },
      startUnit + 4.5,
    );
  }
  if (refs.stripImg) {
    tl.to(
      refs.stripImg,
      { scale: 1.0, duration: 4.0, ease: EASE.wipe },
      startUnit + 3.0,
    );
  }

  // Screen 2 Intro Panel: slides in from right (t+7.5 -> t+9.5) + image xPercent reframe (0 -> -4)
  if (refs.panel) {
    tl.to(refs.panel, { xPercent: 0, duration: 2.0, ease: EASE.reveal }, startUnit + 7.5);
  }
  if (refs.stripImg) {
    tl.to(refs.stripImg, { xPercent: -4, duration: 2.0, ease: EASE.wipe }, startUnit + 7.5);
  }

  // Panel text choreography starting ~60% into slide (t+8.3 -> t+10.5), then hold to t+12
  if (refs.panelH1) {
    const h1Split = splitText(refs.panelH1, { lines: true });
    splits.push(h1Split);
    gsap.set(h1Split.lines, { yPercent: 105, opacity: 0 });
    const h1Stagger = 0.1;
    const h1Dur = Math.max(0.5, 0.9 - Math.max(0, h1Split.lines.length - 1) * h1Stagger);
    tl.to(
      h1Split.lines,
      { yPercent: 0, opacity: 1, duration: h1Dur, stagger: h1Stagger, ease: EASE.reveal },
      startUnit + 8.3,
    );
  }

  if (refs.panelLead) {
    tl.to(
      refs.panelLead,
      { y: 0, opacity: 1, duration: 0.65, ease: EASE.reveal },
      startUnit + 8.55,
    );
  }

  const paraLineTargets: HTMLElement[] = [];
  refs.panelParas.forEach((pEl) => {
    if (!pEl) return;
    const pSplit = splitText(pEl, { lines: true });
    splits.push(pSplit);
    gsap.set(pSplit.lines, { yPercent: 105, opacity: 0 });
    paraLineTargets.push(...pSplit.lines);
  });
  if (paraLineTargets.length) {
    tl.to(
      paraLineTargets,
      { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: EASE.reveal },
      startUnit + 8.85,
    );
  }

  const linkCount = services.sections.length;
  for (let i = 0; i < linkCount; i += 1) {
    const hairlineEl = refs.panelHairlines[i];
    const linkEl = refs.panelLinkRows[i];
    const rowStart = startUnit + 9.3 + i * 0.1;
    if (hairlineEl) {
      tl.to(hairlineEl, { scaleX: 1, duration: 0.6, ease: EASE.reveal }, rowStart);
    }
    if (linkEl) {
      tl.to(linkEl, { y: 0, opacity: 1, duration: 0.6, ease: EASE.reveal }, rowStart + 0.05);
    }
  }
  const endHairline = refs.panelHairlines[linkCount];
  if (endHairline) {
    tl.to(
      endHairline,
      { scaleX: 1, duration: 0.6, ease: EASE.reveal },
      startUnit + 9.3 + Math.max(0, linkCount - 1) * 0.1,
    );
  }

  return () => {
    splits.forEach((s) => s.revert());
  };
}

export const ServicesIntro = forwardRef<ServicesIntroHandle, ServicesIntroProps>(
  function ServicesIntro(
    { standalone = false, isPinnedMode, onSelectService, onPanelFocus },
    ref,
  ) {
    const mode = useViewMode();
    const isPinned = isPinnedMode ?? mode === "desktop";

    const standaloneRootRef = useRef<HTMLDivElement>(null);
    const refs = useRef<ServicesIntroRefs>({
      titleScreen: null,
      glowWrap: null,
      glowTaupe: null,
      glowLinen: null,
      heroWord: null,
      heroCaption: null,
      stripLayer: null,
      stripImg: null,
      panel: null,
      panelH1: null,
      panelLead: null,
      panelParas: [],
      panelHairlines: [],
      panelLinkRows: [],
    });

    const setInitialPinnedStates = () => {
      const r = refs.current;
      if (r.stripLayer) {
        gsap.set(r.stripLayer, { clipPath: "inset(0% 0% 0% 100%)" });
      }
      if (r.stripImg) {
        gsap.set(r.stripImg, { scale: 1.15, xPercent: 0 });
      }
      if (r.panel) {
        gsap.set(r.panel, { xPercent: 100 });
      }
      if (r.panelLead) {
        gsap.set(r.panelLead, { y: 14, opacity: 0 });
      }
      r.panelHairlines.forEach((el) => {
        if (el) gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      });
      r.panelLinkRows.forEach((el) => {
        if (el) gsap.set(el, { y: 12, opacity: 0 });
      });
    };

    const resetPinnedProps = () => {
      const r = refs.current;
      const targets = [
        r.stripLayer,
        r.stripImg,
        r.panel,
        r.panelH1,
        r.panelLead,
        ...r.panelParas,
        ...r.panelHairlines,
        ...r.panelLinkRows,
      ].filter((el): el is NonNullable<typeof el> => Boolean(el));
      if (targets.length) {
        gsap.set(targets, { clearProps: "all" });
      }
    };

    useImperativeHandle(ref, () => ({
      setInitialPinnedStates,
      resetPinnedProps,
      buildIntroTimeline: (tl: gsap.core.Timeline, startUnit = 0) =>
        buildIntroTimeline(refs.current, tl, startUnit),
    }));

    // Time-based page load entrance for Screen 1 ("Services" + caption + radial glows) & desktop ambient glow drift
    useEffect(() => {
      const r = refs.current;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        let cancelled = false;
        let loadTl: gsap.core.Timeline | null = null;
        let heroSplit: Split | null = null;

        if (r.glowWrap) gsap.set(r.glowWrap, { opacity: 0 });
        if (r.heroWord) gsap.set(r.heroWord, { opacity: 0 });
        if (r.heroCaption) gsap.set(r.heroCaption, { y: 12, opacity: 0 });

        void document.fonts.ready.then(() => {
          if (cancelled) return;

          if (r.heroWord) {
            heroSplit = splitText(r.heroWord, { lines: true });
            gsap.set(r.heroWord, { clearProps: "opacity" });
            gsap.set(heroSplit.lines, { yPercent: 105, opacity: 0 });
          }

          loadTl = gsap.timeline();
          if (r.glowWrap) {
            loadTl.to(r.glowWrap, { opacity: 1, duration: 1.2, ease: EASE.reveal }, 0);
          }
          if (heroSplit && heroSplit.lines.length) {
            loadTl.to(
              heroSplit.lines,
              { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: EASE.reveal },
              0.3,
            );
          }
          if (r.heroCaption) {
            loadTl.to(
              r.heroCaption,
              { y: 0, opacity: 1, duration: 0.7, ease: EASE.reveal },
              1.0,
            );
          }
        });

        return () => {
          cancelled = true;
          loadTl?.kill();
          heroSplit?.revert();
          const targets = [r.glowWrap, r.heroWord, r.heroCaption].filter(
            (el): el is NonNullable<typeof el> => Boolean(el),
          );
          if (targets.length) gsap.set(targets, { clearProps: "all" });
        };
      });

      // Slow ambient horizontal glow drift on desktop only (transform only)
      mm.add(`${MQ.desktopFine} and ${MQ.motion}`, () => {
        const tweens: gsap.core.Tween[] = [];
        if (r.glowTaupe) {
          tweens.push(
            gsap.fromTo(
              r.glowTaupe,
              { x: "-4vw" },
              { x: "4vw", duration: 8.5, ease: "sine.inOut", repeat: -1, yoyo: true },
            ),
          );
        }
        if (r.glowLinen) {
          tweens.push(
            gsap.fromTo(
              r.glowLinen,
              { x: "4vw" },
              { x: "-4vw", duration: 10, ease: "sine.inOut", repeat: -1, yoyo: true },
            ),
          );
        }
        return () => {
          tweens.forEach((tw) => tw.kill());
          if (r.glowTaupe) gsap.set(r.glowTaupe, { clearProps: "transform" });
          if (r.glowLinen) gsap.set(r.glowLinen, { clearProps: "transform" });
        };
      });

      return () => {
        mm.revert();
      };
    }, []);

    // Temporary standalone test ScrollTrigger (removed when merged into single showcase sequence)
    useEffect(() => {
      if (!standalone || !isPinned) return;
      const stage = standaloneRootRef.current;
      if (!stage) return;

      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktopFine} and ${MQ.motion}`, () => {
        let cancelled = false;
        let tl: gsap.core.Timeline | null = null;
        let cleanupIntro: (() => void) | null = null;
        let themeCache: "light" | "dark" | null = null;

        setInitialPinnedStates();

        void document.fonts.ready.then(() => {
          if (cancelled) return;
          tl = gsap.timeline({
            scrollTrigger: {
              id: "services-intro-standalone",
              trigger: stage,
              start: "top top",
              end: () => `+=${3.5 * window.innerHeight}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const u = self.progress * INTRO_UNITS;
                const nextTheme: "light" | "dark" = u >= 7.5 ? "light" : "dark";
                if (nextTheme !== themeCache) {
                  themeCache = nextTheme;
                  stage.dataset.theme = nextTheme;
                  window.dispatchEvent(new CustomEvent("meres:theme-sync"));
                }
              },
            },
          });

          cleanupIntro = buildIntroTimeline(refs.current, tl, 0);
          tl.to({}, { duration: 1 }, INTRO_UNITS - 1);
          ScrollTrigger.refresh();
        });

        return () => {
          cancelled = true;
          tl?.scrollTrigger?.kill();
          tl?.kill();
          cleanupIntro?.();
          resetPinnedProps();
          delete stage.dataset.theme;
          window.dispatchEvent(new CustomEvent("meres:theme-sync"));
        };
      });

      return () => {
        mm.revert();
      };
    }, [isPinned, standalone]);

    // Mobile & tablet (<1024px or coarse pointer) scroll-triggered reveals; reduced motion stays static
    useEffect(() => {
      if (mode !== "mobile") return;
      const r = refs.current;

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        let cancelled = false;
        const triggers: ScrollTrigger[] = [];
        const timelines: gsap.core.Timeline[] = [];
        const splits: Split[] = [];

        if (r.stripLayer) gsap.set(r.stripLayer, { clipPath: "inset(100% 0% 0% 0%)" });
        if (r.stripImg) gsap.set(r.stripImg, { scale: 1.15 });
        if (r.panelLead) gsap.set(r.panelLead, { y: 14, opacity: 0 });
        r.panelHairlines.forEach((el) => {
          if (el) gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
        });
        r.panelLinkRows.forEach((el) => {
          if (el) gsap.set(el, { y: 12, opacity: 0 });
        });

        void document.fonts.ready.then(() => {
          if (cancelled) return;

          if (r.stripLayer) {
            const stripEl = r.stripLayer;
            triggers.push(
              ScrollTrigger.create({
                trigger: stripEl,
                start: "top 85%",
                once: true,
                onEnter: () => {
                  const itl = gsap.timeline();
                  timelines.push(itl);
                  itl.to(
                    stripEl,
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE.wipe },
                    0,
                  );
                  if (r.stripImg) {
                    itl.to(r.stripImg, { scale: 1, duration: 1.2, ease: EASE.wipe }, 0);
                  }
                },
              }),
            );
          }

          if (r.panel) {
            const h1Split = r.panelH1 ? splitText(r.panelH1, { lines: true }) : null;
            if (h1Split) {
              splits.push(h1Split);
              gsap.set(h1Split.lines, { yPercent: 105, opacity: 0 });
            }

            const paraLineTargets: HTMLElement[] = [];
            r.panelParas.forEach((pEl) => {
              if (!pEl) return;
              const pSplit = splitText(pEl, { lines: true });
              splits.push(pSplit);
              gsap.set(pSplit.lines, { yPercent: 105, opacity: 0 });
              paraLineTargets.push(...pSplit.lines);
            });

            triggers.push(
              ScrollTrigger.create({
                trigger: r.panel,
                start: "top 85%",
                once: true,
                onEnter: () => {
                  const ptl = gsap.timeline();
                  timelines.push(ptl);
                  if (h1Split) {
                    ptl.to(
                      h1Split.lines,
                      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: EASE.reveal },
                      0,
                    );
                  }
                  if (r.panelLead) {
                    ptl.to(
                      r.panelLead,
                      { y: 0, opacity: 1, duration: 0.7, ease: EASE.reveal },
                      0.25,
                    );
                  }
                  if (paraLineTargets.length) {
                    ptl.to(
                      paraLineTargets,
                      {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.75,
                        stagger: 0.08,
                        ease: EASE.reveal,
                      },
                      0.45,
                    );
                  }
                  r.panelHairlines.forEach((el, j) => {
                    if (el) {
                      ptl.to(el, { scaleX: 1, duration: 0.6, ease: EASE.reveal }, 0.65 + j * 0.1);
                    }
                  });
                  r.panelLinkRows.forEach((el, j) => {
                    if (el) {
                      ptl.to(
                        el,
                        { y: 0, opacity: 1, duration: 0.6, ease: EASE.reveal },
                        0.7 + j * 0.1,
                      );
                    }
                  });
                },
              }),
            );
          }

          ScrollTrigger.refresh();
        });

        return () => {
          cancelled = true;
          triggers.forEach((t) => t.kill());
          timelines.forEach((t) => t.kill());
          splits.forEach((s) => s.revert());
          resetPinnedProps();
        };
      });

      return () => {
        mm.revert();
      };
    }, [mode]);

    const handleServiceLinkClick = (
      event: MouseEvent<HTMLAnchorElement>,
      idx: number,
      id: string,
    ) => {
      event.preventDefault();
      window.history.replaceState(null, "", `/services#${id}`);
      if (onSelectService) {
        onSelectService(idx, id);
      } else {
        scrollToTarget(`#${id}`, { duration: 1.4, offset: -96 });
      }
    };

    const hairlineCount = services.sections.length + 1;

    const layersContent = (
      <>
        {/* Screen 1: Gradient + MERES Mark + Decorative "Services" title & eyebrow caption */}
        <div
          ref={(el) => {
            refs.current.titleScreen = el;
          }}
          aria-hidden="true"
          data-theme={isPinned ? undefined : "dark"}
          className={
            isPinned
              ? "absolute inset-0 z-0 flex h-full w-full flex-col justify-end overflow-clip bg-green text-linen"
              : "relative flex min-h-[100svh] w-full flex-col justify-end overflow-clip bg-green text-linen"
          }
        >
          {/* Ambient radial taupe and linen glows */}
          <div
            ref={(el) => {
              refs.current.glowWrap = el;
            }}
            className="pointer-events-none absolute inset-0 overflow-clip"
          >
            <div
              ref={(el) => {
                refs.current.glowTaupe = el;
              }}
              className="absolute -right-[8%] top-[12%] h-[62svh] w-[62vw] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(173, 150, 128, 0.28) 0%, rgba(173, 150, 128, 0) 70%)",
              }}
            />
            <div
              ref={(el) => {
                refs.current.glowLinen = el;
              }}
              className="absolute -left-[6%] bottom-[8%] h-[52svh] w-[52vw] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(232, 222, 206, 0.14) 0%, rgba(232, 222, 206, 0) 70%)",
              }}
            />
          </div>

          {/* Decorative large MERES mark at ~8% opacity */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="opacity-[0.08]">
              <MeresMark className="w-[min(46rem,78vw)] text-linen" title="" />
            </span>
          </div>

          {/* Bottom-left huge "Services" + caption (aria-hidden; real h1 is inside Screen 2 intro panel) */}
          <div
            style={{ padding: "7rem clamp(1.5rem, 5vw, 5rem) clamp(2rem, 7svh, 5rem)" }}
            className="relative z-10"
          >
            <div
              ref={(el) => {
                refs.current.heroWord = el;
              }}
              className="font-serif text-[clamp(4.5rem,13vw,14rem)] leading-[0.95] text-linen"
            >
              Services
            </div>
            <p
              ref={(el) => {
                refs.current.heroCaption = el;
              }}
              className="mt-4 max-w-[36rem] font-sans text-[1.1667rem] uppercase leading-[1.45] tracking-[0.08em] text-linen/90"
            >
              {home.eyebrow}
            </p>
          </div>
        </div>

        {/* Screen 1 -> 2 Strip layer: image 05 peeking from right and widening leftward */}
        <div
          ref={(el) => {
            refs.current.stripLayer = el;
          }}
          data-theme={isPinned ? undefined : "dark"}
          className={
            isPinned
              ? "pointer-events-none absolute inset-0 z-[1] overflow-clip bg-forest"
              : "relative h-[70svh] w-full overflow-clip bg-forest"
          }
        >
          <img
            ref={(el) => {
              refs.current.stripImg = el;
            }}
            src={img05.src["1672"]}
            alt={img05.alt}
            width={img05.width}
            height={img05.height}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className={
              isPinned
                ? "absolute -inset-[5%] h-[110%] w-[110%] max-w-none object-cover"
                : "h-full w-full object-cover"
            }
            style={{ objectPosition: `${img05.focal.xPct}% ${img05.focal.yPct}%` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%]"
            style={{
              background:
                "linear-gradient(to top, rgba(35, 45, 34, 0.78) 0%, rgba(35, 45, 34, 0.48) 55%, transparent 100%)",
            }}
          />
          <span className="concept-chip pointer-events-none absolute bottom-5 right-5 z-20">
            {BRAND.imageLabel}
          </span>
        </div>

        {/* Screen 2 Intro Panel: slides in from right on desktop, full width on mobile/reduced */}
        <div
          ref={(el) => {
            refs.current.panel = el;
          }}
          data-theme={isPinned ? undefined : "light"}
          onFocusCapture={isPinned ? onPanelFocus : undefined}
          style={{
            padding: isPinned
              ? "clamp(1.5rem, 3.6vh, 3.5rem) clamp(2rem, 3.5vw, 4rem)"
              : "clamp(2rem, 5vw, 4rem)",
          }}
          className={
            isPinned
              ? "absolute right-0 top-0 z-[2] flex h-[100svh] w-[clamp(30rem,44vw,46rem)] flex-col justify-center bg-linen text-ink"
              : "w-full bg-linen text-ink"
          }
        >
          <div className="mx-auto w-full max-w-4xl">
            <h1
              ref={(el) => {
                refs.current.panelH1 = el;
              }}
              className="font-serif text-[clamp(1.85rem,min(3vw,4.2vh),3.6rem)] leading-[1.05] text-ink lg:text-[clamp(1.85rem,min(3.1vw,4.3vh),3.75rem)]"
            >
              {services.title}
            </h1>

            <p
              ref={(el) => {
                refs.current.panelLead = el;
              }}
              className="mt-[clamp(0.7rem,1.4vh,1.1rem)] max-w-[36rem] font-sans text-[1.1667rem] font-medium leading-[1.45] text-ink"
            >
              {services.lead}
            </p>

            <div className="mt-[clamp(0.65rem,1.3vh,1rem)] space-y-[clamp(0.6rem,1.2vh,0.9rem)]">
              {services.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  ref={(el) => {
                    refs.current.panelParas[idx] = el;
                  }}
                  className="max-w-[36rem] font-sans text-[1.1667rem] leading-[1.55] text-ink/90"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <nav aria-label="Service sections" className="mt-[clamp(0.9rem,1.9vh,1.4rem)]">
              <ul>
                {services.sections.map((section, idx) => (
                  <li key={section.id}>
                    <span
                      ref={(el) => {
                        refs.current.panelHairlines[idx] = el;
                      }}
                      aria-hidden="true"
                      className="block h-px w-full origin-left bg-taupe/40"
                    />
                    <IntroRollingLink
                      label={section.title}
                      href={`/services#${section.id}`}
                      isInkOnLinen
                      linkRef={(el) => {
                        refs.current.panelLinkRows[idx] = el;
                      }}
                      onSelect={(e) => handleServiceLinkClick(e, idx, section.id)}
                    />
                  </li>
                ))}
                <li aria-hidden="true">
                  <span
                    ref={(el) => {
                      refs.current.panelHairlines[hairlineCount - 1] = el;
                    }}
                    className="block h-px w-full origin-left bg-taupe/40"
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </>
    );

    if (standalone) {
      return (
        <div
          ref={standaloneRootRef}
          data-theme={isPinned ? "dark" : undefined}
          className={isPinned ? "relative h-[100svh] w-full overflow-x-clip bg-green" : "w-full"}
        >
          {layersContent}
        </div>
      );
    }

    return layersContent;
  },
);
