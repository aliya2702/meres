import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { MeresMark } from "@/components/MeresMark";
import { VeilLink } from "@/components/VeilLink";
import { BRAND } from "@/content/copy";
import { servicesShowcase, type ServiceShowcaseItem } from "@/data/servicesShowcase";
import { lenis, scrollToTarget } from "@/motion/smooth";
import { splitText, type Split } from "@/motion/splitText";
import { EASE } from "@/motion/tokens";
import { useViewMode } from "@/motion/useViewMode";

gsap.registerPlugin(ScrollTrigger);

const MQ_PINNED =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MQ_MOTION = "(prefers-reduced-motion: no-preference)";
const UNIT_PER_SERVICE = 8;
const STAGE_B_OFFSET = 3.5;
const STAGE_B_ANCHOR_OFFSET = 5.5;
const END_HOLD = 1.5;
const TOTAL_UNITS = servicesShowcase.length * UNIT_PER_SERVICE + END_HOLD;

type ServicesShowcaseProps = {
  variant: "home" | "page";
};

type ServiceRefs = {
  section: HTMLElement | null;
  layer: HTMLDivElement | null;
  img: HTMLImageElement | null;
  title: HTMLHeadingElement | null;
  caption: HTMLParagraphElement | null;
  panel: HTMLDivElement | null;
  paragraph: HTMLParagraphElement | null;
  hairlines: Array<HTMLSpanElement | null>;
  lineTexts: Array<HTMLDivElement | null>;
  closing: HTMLParagraphElement | null;
  cta: HTMLDivElement | null;
};

function createEmptyRefs(): ServiceRefs {
  return {
    section: null,
    layer: null,
    img: null,
    title: null,
    caption: null,
    panel: null,
    paragraph: null,
    hairlines: [],
    lineTexts: [],
    closing: null,
    cta: null,
  };
}

function getThemeForTime(time: number): "light" | "dark" {
  const index = Math.min(
    servicesShowcase.length - 1,
    Math.max(0, Math.floor(time / UNIT_PER_SERVICE)),
  );
  const localTime = time - index * UNIT_PER_SERVICE;
  if (localTime < STAGE_B_OFFSET) {
    return "dark";
  }
  return servicesShowcase[index].theme === "linen" ? "light" : "dark";
}

function getStageBPosition(st: ScrollTrigger, idx: number): number {
  const labelTime = idx * UNIT_PER_SERVICE + STAGE_B_ANCHOR_OFFSET;
  return st.start + (labelTime / TOTAL_UNITS) * (st.end - st.start);
}

function ServiceLayer({
  item,
  isPinned,
  refs,
}: {
  item: ServiceShowcaseItem;
  isPinned: boolean;
  refs: ServiceRefs;
}) {
  return (
    <div
      ref={(el) => {
        refs.layer = el;
      }}
      data-theme={isPinned ? undefined : "dark"}
      className={
        isPinned
          ? "absolute inset-0 z-0 flex h-full w-full flex-col justify-end overflow-clip bg-forest text-linen"
          : "relative flex min-h-[78svh] w-full flex-col justify-end overflow-clip bg-forest text-linen"
      }
    >
      {/* Full-bleed media or green-to-taupe tonal fallback */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-clip">
        {item.image ? (
          <img
            ref={(el) => {
              refs.img = el;
            }}
            src={item.image.src}
            alt={item.image.alt}
            width={1672}
            height={941}
            loading="eager"
            decoding="async"
            className={
              isPinned
                ? "absolute -inset-[5%] h-[110%] w-[110%] max-w-none object-cover"
                : "h-full w-full object-cover"
            }
            style={
              item.image.focal
                ? { objectPosition: `${item.image.focal.xPct}% ${item.image.focal.yPct}%` }
                : undefined
            }
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(155deg, var(--green) 0%, #3E4739 54%, rgba(173, 150, 128, 0.42) 100%)",
            }}
          >
            <span aria-hidden="true" className="opacity-10">
              <MeresMark className="w-[min(32rem,64vw)] text-linen" title="" />
            </span>
          </div>
        )}
      </div>

      {/* Bottom dark scrim over lower 55% ensuring >= 4.5:1 text contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%]"
        style={{
          background:
            "linear-gradient(to top, rgba(35, 45, 34, 0.78) 0%, rgba(35, 45, 34, 0.7) 35%, transparent 100%)",
        }}
      />

      {/* Bottom-left display title and caption sentence */}
      <div
        className={
          isPinned
            ? "relative z-20 px-5 pb-14 pt-28 md:px-10 md:pb-16"
            : "relative z-20 px-5 pb-20 pt-28 md:px-10 md:pb-16"
        }
      >
        <h2
          id={`${item.id}-title`}
          ref={(el) => {
            refs.title = el;
          }}
          className="max-w-[90vw] font-serif text-[clamp(3.25rem,15vw,5rem)] leading-[0.95] text-linen lg:text-[clamp(4rem,12vw,13rem)]"
        >
          {item.title}
        </h2>
        <p
          ref={(el) => {
            refs.caption = el;
          }}
          className={
            isPinned
              ? "mt-4 max-w-[min(44rem,calc(100vw-clamp(30rem,44vw,46rem)-5rem))] font-sans text-[1.1667rem] uppercase leading-[1.45] tracking-[0.06em] text-linen/95"
              : "mt-4 max-w-[44rem] font-sans text-[1.1667rem] uppercase leading-[1.45] tracking-[0.06em] text-linen/95"
          }
        >
          {item.caption}
        </p>
      </div>

      {/* Concept visualization caption on image layers only */}
      {item.image && (
        <span className="concept-chip pointer-events-none absolute bottom-4 right-5 z-20 md:bottom-6 md:right-10">
          {BRAND.imageLabel}
        </span>
      )}
    </div>
  );
}

function ServicePanel({
  item,
  variant,
  isPinned,
  refs,
  onPanelFocus,
}: {
  item: ServiceShowcaseItem;
  variant: "home" | "page";
  isPinned: boolean;
  refs: ServiceRefs;
  onPanelFocus: () => void;
}) {
  const isGreen = item.theme === "green";
  const hairlineCount = item.lines.length + 1;

  return (
    <div
      ref={(el) => {
        refs.panel = el;
      }}
      data-theme={isPinned ? undefined : isGreen ? "dark" : "light"}
      onFocusCapture={isPinned ? onPanelFocus : undefined}
      style={
        isPinned
          ? {
              padding:
                "clamp(4.5rem, 8.5vh, 5.5rem) clamp(1.5rem, 3.6vw, 3.5rem) clamp(1.25rem, 3.5vh, 2.75rem)",
            }
          : { padding: "clamp(1.5rem, 5vw, 4rem)" }
      }
      className={
        isPinned
          ? `absolute right-0 top-0 z-10 flex h-[100svh] w-[clamp(30rem,44vw,46rem)] flex-col justify-center ${
              isGreen ? "bg-forest text-linen" : "bg-linen text-ink"
            }`
          : `w-full ${isGreen ? "bg-forest text-linen" : "bg-linen text-ink"}`
      }
    >
      <div className="mx-auto w-full max-w-5xl">
        <p
          ref={(el) => {
            refs.paragraph = el;
          }}
          className={`max-w-[46rem] font-sans text-[1.1667rem] leading-[1.58] ${
            isGreen ? "text-linen/90" : "text-ink/90"
          }`}
        >
          {item.paragraph}
        </p>

        <ul className={isPinned ? "mt-[clamp(1rem,2.4vh,1.75rem)]" : "mt-8"}>
          {item.lines.map((line, idx) => (
            <li key={idx}>
              <span
                ref={(el) => {
                  refs.hairlines[idx] = el;
                }}
                aria-hidden="true"
                className="block h-px w-full origin-left bg-taupe/40"
              />
              <div
                ref={(el) => {
                  refs.lineTexts[idx] = el;
                }}
                className={
                  isPinned
                    ? "py-[clamp(0.55rem,1.4vh,1.05rem)] font-serif text-[clamp(1.1rem,min(1.65vw,2.55vh),1.75rem)] leading-[1.32]"
                    : "py-5 font-serif text-[clamp(1.35rem,1.9vw,2rem)] leading-[1.35]"
                }
              >
                {line}
              </div>
            </li>
          ))}
          <li aria-hidden="true">
            <span
              ref={(el) => {
                refs.hairlines[hairlineCount - 1] = el;
              }}
              className="block h-px w-full origin-left bg-taupe/40"
            />
          </li>
        </ul>

        {item.closing && (
          <p
            ref={(el) => {
              refs.closing = el;
            }}
            className={`${
              isPinned ? "mt-[clamp(0.85rem,2vh,1.5rem)]" : "mt-8"
            } max-w-[46rem] font-sans text-[1.1667rem] leading-[1.58] ${
              isGreen ? "text-linen/90" : "text-ink/85"
            }`}
          >
            {item.closing}
          </p>
        )}

        <div
          ref={(el) => {
            refs.cta = el;
          }}
          className={isPinned ? "mt-[clamp(1rem,2.3vh,1.75rem)]" : "mt-9"}
        >
          {variant === "home" ? (
            <VeilLink
              to={`/services#${item.id}`}
              data-cursor="link"
              className={`inline-flex items-center gap-2 font-sans text-[1.1667rem] font-medium transition-colors ${
                isGreen
                  ? "text-taupe hover:text-linen focus-visible:outline-linen"
                  : "text-forest hover:text-ink focus-visible:outline-forest"
              }`}
            >
              <span>{`Explore ${item.title.toLowerCase()}`}</span>
              <ArrowUpRight size={18} />
            </VeilLink>
          ) : (
            <div>
              <VeilLink
                to={BRAND.cta.href}
                aria-label={BRAND.cta.ariaLabel}
                data-cursor="link"
                className={`inline-flex items-center rounded-full px-6 py-3.5 font-sans text-[1.1667rem] font-medium transition-colors ${
                  isGreen
                    ? "bg-linen text-forest hover:bg-taupe hover:text-ink focus-visible:outline-linen"
                    : "bg-forest text-linen hover:bg-ink focus-visible:outline-forest"
                }`}
              >
                {BRAND.cta.label}
                <ArrowUpRight className="ml-2" size={18} />
              </VeilLink>
              <p
                className={`mt-3 font-sans text-[1.1667rem] leading-[1.5] ${
                  isGreen ? "text-linen/80" : "text-ink/75"
                }`}
              >
                {BRAND.cta.micro}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ServicesShowcase({ variant }: ServicesShowcaseProps) {
  const mode = useViewMode();
  const isPinned = mode === "desktop";
  const stId = `services-showcase-${variant}`;
  const { hash } = useLocation();

  const rootRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<ServiceRefs[]>(servicesShowcase.map(() => createEmptyRefs()));
  const [activeIndex, setActiveIndex] = useState(0);
  const lastScrolledHashRef = useRef<string>("");

  const scrollToService = useCallback(
    (idx: number) => {
      const st = ScrollTrigger.getById(stId);
      if (!st) return;
      const pos = getStageBPosition(st, idx);
      if (lenis) {
        lenis.scrollTo(pos, { duration: 1.4, immediate: false });
      } else {
        scrollToTarget(pos, { offset: 0, duration: 1.4, immediate: false });
      }
    },
    [stId],
  );

  // Desktop pinned choreography
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isPinned) return;

    const mm = gsap.matchMedia();
    mm.add(MQ_PINNED, () => {
      let cancelled = false;
      let resizeTimer = 0;
      let lastWidth = window.innerWidth;
      let tl: gsap.core.Timeline | null = null;
      let splits: Split[] = [];
      let activeIdxCache = -1;
      let themeCache: "light" | "dark" | null = null;

      const applyInteractiveAndTheme = (time: number) => {
        const idx = Math.min(
          servicesShowcase.length - 1,
          Math.max(0, Math.floor(time / UNIT_PER_SERVICE)),
        );
        if (idx !== activeIdxCache) {
          activeIdxCache = idx;
          setActiveIndex(idx);
          serviceRefs.current.forEach((refs, sIdx) => {
            if (refs.section) {
              refs.section.style.pointerEvents = sIdx === idx ? "auto" : "none";
            }
          });
        }

        const nextTheme = getThemeForTime(time);
        if (nextTheme !== themeCache) {
          themeCache = nextTheme;
          root.dataset.theme = nextTheme;
          window.dispatchEvent(new CustomEvent("meres:theme-sync"));
        }
      };

      const isFirstInView =
        root.getBoundingClientRect().top < window.innerHeight * 0.25 && window.scrollY < 4;

      const setInitialStates = () => {
        serviceRefs.current.forEach((refs, i) => {
          const skipEntryWipe = i === 0 && isFirstInView;
          if (refs.layer) {
            gsap.set(refs.layer, {
              clipPath: skipEntryWipe ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
            });
          }
          if (refs.img) {
            gsap.set(refs.img, {
              scale: skipEntryWipe ? 1 : 1.12,
              yPercent: skipEntryWipe ? -3 : 5,
              xPercent: 0,
            });
          }
          if (refs.title) {
            gsap.set(refs.title, { scale: 1, transformOrigin: "left bottom" });
          }
          if (refs.caption) {
            gsap.set(refs.caption, { y: 12, opacity: 0 });
          }
          if (refs.panel) {
            gsap.set(refs.panel, { xPercent: 100 });
          }
          refs.hairlines.forEach((lineEl) => {
            if (lineEl) gsap.set(lineEl, { scaleX: 0, transformOrigin: "left center" });
          });
          if (refs.cta) {
            gsap.set(refs.cta, { y: 20, opacity: 0 });
          }
        });
      };

      const cleanupTimeline = () => {
        tl?.scrollTrigger?.kill();
        tl?.kill();
        tl = null;
        splits.forEach((s) => s.revert());
        splits = [];
      };

      const resetAllProps = () => {
        serviceRefs.current.forEach((refs) => {
          const targets = [
            refs.layer,
            refs.img,
            refs.title,
            refs.caption,
            refs.panel,
            refs.paragraph,
            refs.closing,
            refs.cta,
            ...refs.hairlines,
            ...refs.lineTexts,
          ].filter((el): el is NonNullable<typeof el> => Boolean(el));
          if (targets.length) {
            gsap.set(targets, { clearProps: "all" });
          }
          if (refs.section) {
            refs.section.style.pointerEvents = "";
          }
        });
      };

      const buildTimeline = () => {
        cleanupTimeline();
        resetAllProps();
        setInitialStates();

        tl = gsap.timeline({
          scrollTrigger: {
            id: stId,
            trigger: root,
            start: "top top",
            end: () => `+=${TOTAL_UNITS * 0.28 * window.innerHeight}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: (self) => applyInteractiveAndTheme(self.progress * TOTAL_UNITS),
            onEnterBack: (self) => applyInteractiveAndTheme(self.progress * TOTAL_UNITS),
            onUpdate: (self) => applyInteractiveAndTheme(self.progress * TOTAL_UNITS),
          },
        });

        servicesShowcase.forEach((item, i) => {
          const refs = serviceRefs.current[i];
          const t = i * UNIT_PER_SERVICE;
          const skipEntryWipe = i === 0 && isFirstInView;

          // Stage A: layer clip reveal and image scale/yPercent drift
          if (!skipEntryWipe && refs.layer) {
            tl!.to(
              refs.layer,
              { clipPath: "inset(0% 0% 0% 0%)", duration: 2.0, ease: EASE.wipe },
              t,
            );
          }
          if (!skipEntryWipe && refs.img) {
            tl!.to(
              refs.img,
              { scale: 1, yPercent: -3, duration: 2.0, ease: EASE.wipe },
              t,
            );
          }

          // Stage A: title line split rise (t+1.4 -> t+2.4)
          if (refs.title) {
            const titleSplit = splitText(refs.title, { lines: true });
            splits.push(titleSplit);
            gsap.set(titleSplit.lines, { yPercent: 105, opacity: 0 });
            const titleStagger = 0.1;
            const titleDur = Math.max(
              0.5,
              1.0 - Math.max(0, titleSplit.lines.length - 1) * titleStagger,
            );
            tl!.to(
              titleSplit.lines,
              {
                yPercent: 0,
                opacity: 1,
                duration: titleDur,
                stagger: titleStagger,
                ease: EASE.reveal,
              },
              t + 1.4,
            );
          }

          // Stage A: caption fade up (t+2.0 -> t+2.7)
          if (refs.caption) {
            tl!.to(refs.caption, { y: 0, opacity: 1, duration: 0.7, ease: EASE.reveal }, t + 2.0);
          }

          // Stage B: panel slides in while title shrinks and image reframes (t+3.5 -> t+5.5)
          if (refs.panel) {
            tl!.to(refs.panel, { xPercent: 0, duration: 2.0, ease: EASE.reveal }, t + 3.5);
          }
          if (refs.title) {
            tl!.to(
              refs.title,
              { scale: 0.44, transformOrigin: "left bottom", duration: 2.0, ease: EASE.wipe },
              t + 3.5,
            );
          }
          if (refs.img) {
            tl!.to(refs.img, { xPercent: -4, duration: 2.0, ease: EASE.wipe }, t + 3.5);
          }

          // Stage B: paragraph masked lines rise (t+4.2 -> t+5.2)
          if (refs.paragraph) {
            const paraSplit = splitText(refs.paragraph, { lines: true });
            splits.push(paraSplit);
            gsap.set(paraSplit.lines, { yPercent: 105, opacity: 0 });
            const pStagger = 0.08;
            const pDur = Math.max(0.45, 1.0 - Math.max(0, paraSplit.lines.length - 1) * pStagger);
            tl!.to(
              paraSplit.lines,
              { yPercent: 0, opacity: 1, duration: pDur, stagger: pStagger, ease: EASE.reveal },
              t + 4.2,
            );
          }

          // Stage B: hairlines draw + list line masked rises, then closing + CTA (t+4.7 -> t+6.0)
          const listCount = item.lines.length;
          for (let j = 0; j < listCount; j += 1) {
            const hairlineEl = refs.hairlines[j];
            const lineEl = refs.lineTexts[j];
            const itemStart = t + 4.7 + j * 0.12;
            if (hairlineEl) {
              tl!.to(hairlineEl, { scaleX: 1, duration: 0.6, ease: EASE.reveal }, itemStart);
            }
            if (lineEl) {
              const lineSplit = splitText(lineEl, { lines: true });
              splits.push(lineSplit);
              gsap.set(lineSplit.lines, { yPercent: 105, opacity: 0 });
              tl!.to(
                lineSplit.lines,
                { yPercent: 0, opacity: 1, duration: 0.72, stagger: 0.03, ease: EASE.reveal },
                itemStart + 0.04,
              );
            }
          }

          const endHairlineEl = refs.hairlines[listCount];
          if (endHairlineEl) {
            tl!.to(
              endHairlineEl,
              { scaleX: 1, duration: 0.6, ease: EASE.reveal },
              t + 4.7 + Math.max(0, listCount - 1) * 0.12,
            );
          }

          const afterListTime = t + 4.7 + listCount * 0.12;
          if (item.closing && refs.closing) {
            const closingSplit = splitText(refs.closing, { lines: true });
            splits.push(closingSplit);
            gsap.set(closingSplit.lines, { yPercent: 105, opacity: 0 });
            tl!.to(
              closingSplit.lines,
              { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.04, ease: EASE.reveal },
              afterListTime,
            );
            if (refs.cta) {
              tl!.to(
                refs.cta,
                { y: 0, opacity: 1, duration: 0.65, ease: EASE.reveal },
                afterListTime + 0.12,
              );
            }
          } else if (refs.cta) {
            tl!.to(refs.cta, { y: 0, opacity: 1, duration: 0.65, ease: EASE.reveal }, afterListTime);
          }
        });

        // Hold B + 1.5 end hold after service 4 completes
        tl.to({}, { duration: 1 }, TOTAL_UNITS - 1);

        applyInteractiveAndTheme(0);
        ScrollTrigger.refresh();
      };

      const waitForImages = async () => {
        const imgs = serviceRefs.current
          .map((r) => r.img)
          .filter((el): el is HTMLImageElement => Boolean(el));
        await Promise.all(
          imgs.map(
            (img) =>
              new Promise<void>((resolve) => {
                if (img.complete) {
                  resolve();
                  return;
                }
                const done = () => {
                  img.removeEventListener("load", done);
                  img.removeEventListener("error", done);
                  resolve();
                };
                img.addEventListener("load", done);
                img.addEventListener("error", done);
              }),
          ),
        );
      };

      setInitialStates();

      void document.fonts.ready.then(async () => {
        if (cancelled) return;
        buildTimeline();
        await waitForImages();
        if (cancelled) return;
        ScrollTrigger.refresh();

        const currentHash = window.location.hash;
        if (currentHash && currentHash !== lastScrolledHashRef.current) {
          const hashIdx = servicesShowcase.findIndex((s) => `#${s.id}` === currentHash);
          if (hashIdx !== -1) {
            lastScrolledHashRef.current = currentHash;
            const st = ScrollTrigger.getById(stId);
            if (st) {
              const targetPos = getStageBPosition(st, hashIdx);
              if (Math.abs(window.scrollY - targetPos) > 8) {
                scrollToService(hashIdx);
              }
            }
          }
        }
      });

      const onResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (!cancelled) buildTimeline();
        }, 200);
      };
      window.addEventListener("resize", onResize);

      return () => {
        cancelled = true;
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        cleanupTimeline();
        resetAllProps();
        delete root.dataset.theme;
        window.dispatchEvent(new CustomEvent("meres:theme-sync"));
      };
    });

    return () => {
      mm.revert();
    };
  }, [isPinned, scrollToService, stId]);

  // Mobile & tablet (<1024px or coarse pointer) light reveals; reduced motion gets zero motion
  useEffect(() => {
    if (mode !== "mobile") return;

    const mm = gsap.matchMedia();
    mm.add(MQ_MOTION, () => {
      let cancelled = false;
      const triggers: ScrollTrigger[] = [];
      const timelines: gsap.core.Timeline[] = [];
      const splits: Split[] = [];

      const setInitialMobileStates = () => {
        serviceRefs.current.forEach((refs) => {
          if (refs.layer) gsap.set(refs.layer, { clipPath: "inset(100% 0% 0% 0%)" });
          if (refs.img) gsap.set(refs.img, { scale: 1.15 });
          if (refs.caption) gsap.set(refs.caption, { y: 12, opacity: 0 });
          refs.hairlines.forEach((lineEl) => {
            if (lineEl) gsap.set(lineEl, { scaleX: 0, transformOrigin: "left center" });
          });
          if (refs.cta) gsap.set(refs.cta, { y: 16, opacity: 0 });
        });
      };

      const resetMobileProps = () => {
        serviceRefs.current.forEach((refs) => {
          const targets = [
            refs.layer,
            refs.img,
            refs.title,
            refs.caption,
            refs.paragraph,
            refs.closing,
            refs.cta,
            ...refs.hairlines,
            ...refs.lineTexts,
          ].filter((el): el is NonNullable<typeof el> => Boolean(el));
          if (targets.length) {
            gsap.set(targets, { clearProps: "all" });
          }
        });
      };

      setInitialMobileStates();

      void document.fonts.ready.then(() => {
        if (cancelled) return;

        serviceRefs.current.forEach((refs, i) => {
          const item = servicesShowcase[i];

          // Layer clip-reveal from bottom + inner image scale + title lines + caption
          if (refs.layer) {
            const titleSplit = refs.title ? splitText(refs.title, { lines: true }) : null;
            if (titleSplit) {
              splits.push(titleSplit);
              gsap.set(titleSplit.lines, { yPercent: 105, opacity: 0 });
            }

            triggers.push(
              ScrollTrigger.create({
                trigger: refs.layer,
                start: "top 85%",
                once: true,
                onEnter: () => {
                  const ltl = gsap.timeline();
                  timelines.push(ltl);
                  ltl.to(
                    refs.layer,
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE.wipe },
                    0,
                  );
                  if (refs.img) {
                    ltl.to(refs.img, { scale: 1, duration: 1.2, ease: EASE.wipe }, 0);
                  }
                  if (titleSplit) {
                    ltl.to(
                      titleSplit.lines,
                      {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.9,
                        stagger: 0.1,
                        ease: EASE.reveal,
                      },
                      0.3,
                    );
                  }
                  if (refs.caption) {
                    ltl.to(
                      refs.caption,
                      { y: 0, opacity: 1, duration: 0.75, ease: EASE.reveal },
                      0.55,
                    );
                  }
                },
              }),
            );
          }

          // Panel text rises 0.25s after trigger + hairlines draw
          if (refs.panel) {
            const paraSplit = refs.paragraph ? splitText(refs.paragraph, { lines: true }) : null;
            if (paraSplit) {
              splits.push(paraSplit);
              gsap.set(paraSplit.lines, { yPercent: 105, opacity: 0 });
            }

            const lineSplits: Split[] = [];
            refs.lineTexts.slice(0, item.lines.length).forEach((el) => {
              if (!el) return;
              const ls = splitText(el, { lines: true });
              splits.push(ls);
              lineSplits.push(ls);
              gsap.set(ls.lines, { yPercent: 105, opacity: 0 });
            });

            const closingSplit =
              item.closing && refs.closing ? splitText(refs.closing, { lines: true }) : null;
            if (closingSplit) {
              splits.push(closingSplit);
              gsap.set(closingSplit.lines, { yPercent: 105, opacity: 0 });
            }

            triggers.push(
              ScrollTrigger.create({
                trigger: refs.panel,
                start: "top 85%",
                once: true,
                onEnter: () => {
                  const ptl = gsap.timeline({ delay: 0.25 });
                  timelines.push(ptl);

                  if (paraSplit) {
                    ptl.to(
                      paraSplit.lines,
                      {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.85,
                        stagger: 0.08,
                        ease: EASE.reveal,
                      },
                      0,
                    );
                  }

                  refs.hairlines.forEach((hairlineEl, j) => {
                    if (hairlineEl) {
                      ptl.to(
                        hairlineEl,
                        { scaleX: 1, duration: 0.6, ease: EASE.reveal },
                        0.15 + j * 0.1,
                      );
                    }
                  });

                  lineSplits.forEach((ls, j) => {
                    ptl.to(
                      ls.lines,
                      {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.04,
                        ease: EASE.reveal,
                      },
                      0.2 + j * 0.1,
                    );
                  });

                  const tailTime = 0.25 + item.lines.length * 0.1;
                  if (closingSplit) {
                    ptl.to(
                      closingSplit.lines,
                      {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.7,
                        stagger: 0.04,
                        ease: EASE.reveal,
                      },
                      tailTime,
                    );
                  }
                  if (refs.cta) {
                    ptl.to(
                      refs.cta,
                      { y: 0, opacity: 1, duration: 0.7, ease: EASE.reveal },
                      closingSplit ? tailTime + 0.12 : tailTime,
                    );
                  }
                },
              }),
            );
          }
        });

        ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        triggers.forEach((t) => t.kill());
        timelines.forEach((t) => t.kill());
        splits.forEach((s) => s.revert());
        resetMobileProps();
      };
    });

    return () => {
      mm.revert();
    };
  }, [mode]);

  // Handle in-page hash changes while already mounted in pinned mode
  useEffect(() => {
    if (!isPinned || !hash) return;
    if (hash === lastScrolledHashRef.current) return;
    const hashIdx = servicesShowcase.findIndex((s) => `#${s.id}` === hash);
    if (hashIdx === -1) return;
    const st = ScrollTrigger.getById(stId);
    if (!st) return;
    lastScrolledHashRef.current = hash;
    scrollToService(hashIdx);
  }, [hash, isPinned, scrollToService, stId]);

  const handlePanelFocus = useCallback(
    (idx: number) => {
      const st = ScrollTrigger.getById(stId);
      if (!st) return;
      const currentTime = st.progress * TOTAL_UNITS;
      const minVisibleTime = idx * UNIT_PER_SERVICE + STAGE_B_OFFSET + 0.5;
      const maxVisibleTime =
        idx === servicesShowcase.length - 1
          ? TOTAL_UNITS + 0.5
          : (idx + 1) * UNIT_PER_SERVICE + 0.2;
      if (currentTime < minVisibleTime || currentTime > maxVisibleTime) {
        scrollToService(idx);
      }
    },
    [scrollToService, stId],
  );

  return (
    <div
      ref={rootRef}
      data-theme={isPinned ? "dark" : undefined}
      className={isPinned ? "relative h-[100svh] w-full overflow-x-clip bg-forest" : undefined}
    >
      {servicesShowcase.map((item, idx) => {
        const refs = serviceRefs.current[idx];
        const ratio = (idx * UNIT_PER_SERVICE + STAGE_B_ANCHOR_OFFSET) / TOTAL_UNITS;

        return (
          <section
            key={item.id}
            id={item.id}
            aria-labelledby={`${item.id}-title`}
            ref={(el) => {
              refs.section = el;
            }}
            data-theme={isPinned ? undefined : item.theme === "green" ? "dark" : "light"}
            data-pin-st={isPinned ? stId : undefined}
            data-pin-ratio={isPinned ? String(ratio) : undefined}
            style={isPinned ? { zIndex: idx + 1 } : undefined}
            className={isPinned ? "absolute inset-0" : "relative scroll-mt-[96px]"}
          >
            <ServiceLayer item={item} isPinned={isPinned} refs={refs} />
            <ServicePanel
              item={item}
              variant={variant}
              isPinned={isPinned}
              refs={refs}
              onPanelFocus={() => handlePanelFocus(idx)}
            />
          </section>
        );
      })}

      {isPinned && (
        <nav
          aria-label="Services index"
          className="pointer-events-auto absolute left-5 top-[42%] z-20 flex -translate-y-1/2 flex-col md:left-10"
        >
          {servicesShowcase.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to ${item.title}`}
                aria-current={isActive ? "step" : undefined}
                onClick={() => scrollToService(idx)}
                className="group flex h-6 w-12 items-center rounded-sm text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-linen"
              >
                <span
                  aria-hidden="true"
                  className={`block h-px w-[40px] origin-left transition-[transform,background-color] duration-300 ease-out ${
                    isActive
                      ? "scale-x-100 bg-linen"
                      : "scale-x-[0.4] bg-taupe/70 group-hover:bg-taupe"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
