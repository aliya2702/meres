import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "../StackSection";
import { AboutPhoto } from "./AboutPhoto";
import { scrollToTarget } from "../../motion/smooth";
import { prefersReducedMotion } from "../../motion/tokens";
import type { AboutImageId } from "../../data/images";

gsap.registerPlugin(ScrollTrigger);

interface SequenceStep {
  id: AboutImageId;
  line1: string;
  line2: string;
}

const SEQUENCE_STEPS: SequenceStep[] = [
  { id: "D2", line1: "Design that", line2: "listens" },
  { id: "K2", line1: "Kitchens made", line2: "for mornings" },
  { id: "B2", line1: "Bathrooms", line2: "that restore" },
  { id: "E3", line1: "Additions", line2: "that belong" },
];

/**
 * AB5 — Corner Card Sequence panel.
 * Desktop: 400svh sticky stage cycling through four full-bleed architectural photographs.
 * Each incoming photograph wipes in from the right edge (1.0s power4.out) while the
 * previous photograph pushes 20% left. Pinned bottom-right forest corner card swaps
 * its two-line serif title, rotates its `+` mark 45deg, and fills a 1px progress rule.
 */
export function AboutSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const plusRef = useRef<SVGSVGElement>(null);
  const titleMaskRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const layers = layerRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
      const plus = plusRef.current;
      const progressFill = progressFillRef.current;
      if (layers.length !== SEQUENCE_STEPS.length) return;

      // Initial state: layer 0 visible, layers 1..3 clipped off-right
      layers.forEach((layer, idx) => {
        gsap.set(layer, {
          clipPath: idx === 0 ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)",
          xPercent: 0,
          zIndex: idx + 1,
        });
      });
      if (progressFill) {
        gsap.set(progressFill, { scaleX: 0, transformOrigin: "0% 50%" });
      }

      let currentIdx = 0;
      let plusAngle = 0;

      const transitionTo = (nextIdx: number) => {
        if (nextIdx === currentIdx) return;
        const forward = nextIdx > currentIdx;
        currentIdx = nextIdx;
        setActiveIndex(nextIdx);

        layers.forEach((layer, i) => {
          if (i < nextIdx) {
            gsap.to(layer, {
              clipPath: "inset(0 0 0 0%)",
              xPercent: -20,
              duration: 1.0,
              ease: "power3.out",
              overwrite: "auto",
            });
          } else if (i === nextIdx) {
            gsap.to(layer, {
              clipPath: "inset(0 0 0 0%)",
              xPercent: 0,
              duration: 1.0,
              ease: "power4.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(layer, {
              clipPath: "inset(0 0 0 100%)",
              xPercent: 0,
              duration: 0.9,
              ease: "power4.out",
              overwrite: "auto",
            });
          }
        });

        if (plus) {
          plusAngle += forward ? 45 : -45;
          gsap.to(plus, {
            rotation: plusAngle,
            duration: 0.55,
            ease: "power3.out",
          });
        }

        if (titleMaskRef.current) {
          gsap.fromTo(
            titleMaskRef.current,
            { yPercent: forward ? 65 : -65, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto",
            }
          );
        }
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = gsap.utils.clamp(0, 1, self.progress);
          const idx = Math.min(SEQUENCE_STEPS.length - 1, Math.floor(p * 3.999));
          transitionTo(idx);

          const stepLocal = gsap.utils.clamp(0, 1, (p - idx * 0.25) / 0.25);
          if (progressFill) {
            gsap.set(progressFill, { scaleX: stepLocal });
          }
        },
      });
      stRef.current = st;

      return () => {
        stRef.current = null;
        st.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const handleAdvanceStep = () => {
    const st = stRef.current;
    if (!st) return;
    const next = (activeIndex + 1) % SEQUENCE_STEPS.length;
    const targetProgress = (next + 0.08) / SEQUENCE_STEPS.length;
    const y = st.start + (st.end - st.start) * targetProgress;
    scrollToTarget(y, { duration: 1.05 });
  };

  const currentStep = SEQUENCE_STEPS[activeIndex] ?? SEQUENCE_STEPS[0];

  return (
    <Panel
      id="about-sequence"
      zIndex={5}
      background="var(--ink)"
      theme="dark"
      className="about-sequence-panel"
      panelRef={sectionRef}
    >
      {/* Mobile + reduced-motion crisp stacked cards */}
      <div className="flex flex-col bg-[var(--ink)] lg:hidden">
        {SEQUENCE_STEPS.map((step) => (
          <article
            key={step.id}
            className="relative flex min-h-[78svh] w-full flex-col justify-end overflow-hidden border-t border-[rgba(232,222,206,0.1)] first:border-t-0"
          >
            <div className="absolute inset-0">
              <AboutPhoto id={step.id} className="h-full w-full" />
            </div>
            <div
              aria-hidden="true"
              className="about-scrim-bl pointer-events-none absolute inset-0 z-10"
            />
            <div className="relative z-20 m-5 ml-auto w-[min(18rem,78vw)] bg-[var(--forest)] p-6 text-[var(--linen)] shadow-2xl">
              <div className="mb-8 flex justify-end text-[var(--taupe)]">
                <span aria-hidden="true" className="text-lg leading-none">
                  +
                </span>
              </div>
              <h3 className="font-serif text-2xl leading-[1.08] text-[var(--linen)]">
                <span className="block">{step.line1}</span>
                <span className="block">{step.line2}</span>
              </h3>
              <div className="mt-4 h-px w-full bg-[rgba(232,222,206,0.2)]" />
            </div>
          </article>
        ))}
      </div>

      {/* Desktop 100svh sticky viewport inside 400svh travel panel */}
      <div
        data-panel-content
        className="about-sequence-stage hidden bg-[var(--ink)] lg:block"
      >
        <div
          onClick={handleAdvanceStep}
          role="presentation"
          className="relative h-full w-full"
        >
          {SEQUENCE_STEPS.map((step, i) => (
            <div
              key={step.id}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full overflow-hidden"
            >
              <AboutPhoto
                id={step.id}
                cursorView
                className="h-full w-full"
              />
            </div>
          ))}

          {/* Pinned bottom-right compact forest card */}
          <div
            className="pointer-events-auto absolute bottom-8 right-8 z-20 flex flex-col justify-between bg-[var(--forest)] p-6 text-[var(--linen)] shadow-2xl xl:bottom-10 xl:right-10 xl:p-7"
            style={{
              width: "clamp(16.5rem, 22vw, 22rem)",
              minHeight: "clamp(9.75rem, 18vh, 13.5rem)",
            }}
          >
            <div className="flex items-start justify-between">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[var(--taupe)]">
                0{activeIndex + 1} / 0{SEQUENCE_STEPS.length}
              </span>
              <svg
                ref={plusRef}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.35}
                aria-hidden="true"
                className="h-5 w-5 text-[var(--linen)]"
              >
                <path d="M12 4v16M4 12h16" />
              </svg>
            </div>

            <div className="overflow-hidden pt-5">
              <div ref={titleMaskRef}>
                <h2
                  className="font-serif font-normal leading-[1.08] text-[var(--linen)]"
                  style={{ fontSize: "clamp(1.35rem, 1.85vw, 1.85rem)" }}
                >
                  <span className="block">{currentStep.line1}</span>
                  <span className="block">{currentStep.line2}</span>
                </h2>
              </div>
            </div>

            <div className="mt-4 h-px w-full overflow-hidden bg-[rgba(232,222,206,0.22)]">
              <div
                ref={progressFillRef}
                className="h-full w-full bg-[var(--linen)]"
              />
            </div>
          </div>
        </div>

        <div
          data-panel-dim
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 bg-[var(--ink)] opacity-0"
        />
      </div>
    </Panel>
  );
}

