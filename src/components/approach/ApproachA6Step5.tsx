import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { ApproachPhoto } from "./ApproachPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

interface HotspotData {
  id: string;
  xPct: number;
  yPct: number;
  label: string;
  detail: string;
  thumbId: string;
}

const HOTSPOTS: HotspotData[] = [
  {
    id: "h1",
    xPct: 32,
    yPct: 48,
    label: "Walk-through",
    detail: "Joint room-by-room review before final sign-off.",
    thumbId: "B1",
  },
  {
    id: "h2",
    xPct: 56,
    yPct: 65,
    label: "Punch list",
    detail: "Every minor trim or fitting perfected to the millimeter.",
    thumbId: "K2",
  },
  {
    id: "h3",
    xPct: 76,
    yPct: 52,
    label: "Care guide",
    detail: "Documented maintenance manuals for all stones and timbers.",
    thumbId: "M7",
  },
];

/**
 * A6 STEP 5 "Finish with a shared understanding." (panoramic corner title).
 * Full-bleed image D3 under a 35% scrim; giant serif title top-right in two lines;
 * short sentence bottom-left; three pulsing circular hotspot rings with hover tooltips;
 * image drifts upward 3vh on scroll (parallax).
 */
export function ApproachA6Step5() {
  const panelRef = useRef<HTMLElement>(null);
  const imgLayerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const imgLayer = imgLayerRef.current;
    const title = titleRef.current;
    const sentence = sentenceRef.current;
    const numeral = numeralRef.current;
    if (!panel || !imgLayer || !title || !sentence || !numeral) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(title, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(sentence, { opacity: 0, y: 15 });
      gsap.set(numeral, { opacity: 0, scale: 0.95 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        numeral,
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          onStart: () => numeral.classList.add("numeral-filled"),
          onReverseComplete: () => numeral.classList.remove("numeral-filled"),
        },
        0
      )
        .to(
          split.lines,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.2
        )
        .to(
          sentence,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0.4
        );

      // Parallax upward 3vh on scroll
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(imgLayer, {
          y: "-3vh",
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      failsafeId = window.setTimeout(() => {
        if (tl.progress() < 1) {
          tl.progress(1);
          numeral.classList.add("numeral-filled");
        }
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <Panel
      id="approach-step-5"
      zIndex={6}
      background="#1B211A"
      theme="dark"
      panelRef={panelRef}
      className="panel-a6"
    >
      <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[#1B211A]">
        {/* Step corner counter */}
        <div className="absolute top-6 left-6 z-40 font-sans text-xs tracking-[0.25em] text-[#E8DECE]/70 lg:top-10 lg:left-14">
          05 / 05
        </div>

        {/* Full-bleed image D3 with parallax drift */}
        <div
          ref={imgLayerRef}
          className="absolute inset-0 z-0 h-[105%] w-full will-change-transform"
        >
          <ApproachPhoto
            id="D3"
            className="h-full w-full"
            imgClassName="object-cover"
          />
          {/* 35% dark scrim */}
          <div
            aria-hidden="true"
            className="approach-scrim-35 pointer-events-none absolute inset-0 z-10"
          />
        </div>

        {/* Giant outlined 05 numeral */}
        <div
          ref={numeralRef}
          aria-hidden="true"
          className="giant-numeral giant-numeral-dark absolute top-[10vh] right-[5vw] z-10 pointer-events-none text-right"
        >
          05
        </div>

        {/* Giant serif title top-right in two lines */}
        <div className="absolute top-8 right-6 z-30 max-w-xl text-right lg:top-16 lg:right-16 xl:top-20 xl:right-24">
          <span className="mb-2 block font-sans text-xs font-medium tracking-[0.2em] text-[#AD9680] uppercase">
            Step 05 &mdash; Handover
          </span>
          <h2
            ref={titleRef}
            className="font-serif text-[clamp(2.4rem,5.2vw,5.6rem)] leading-[1.04] text-[#E8DECE] tracking-[-0.02em]"
          >
            Finish with a{" "}
            <br className="hidden sm:inline" />
            shared understanding.
          </h2>
        </div>

        {/* Three pulsing circular hotspots */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {HOTSPOTS.map((hs) => {
            const isHovered = activeHotspot === hs.id;
            return (
              <div
                key={hs.id}
                className="approach-hotspot"
                style={{ left: `${hs.xPct}%`, top: `${hs.yPct}%` }}
                onMouseEnter={() => setActiveHotspot(hs.id)}
                onMouseLeave={() => setActiveHotspot(null)}
                onClick={() =>
                  setActiveHotspot(activeHotspot === hs.id ? null : hs.id)
                }
              >
                <div className="relative">
                  <div className="hotspot-dot" />
                  <div className="hotspot-ring" />
                </div>

                {/* Hotspot tooltip */}
                <div
                  className={`pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 transition-all duration-300 ${
                    isHovered
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  }`}
                >
                  <div className="flex w-64 items-center gap-3 rounded-lg border border-[rgba(232,222,206,0.2)] bg-[#2C382A]/95 p-3 shadow-2xl backdrop-blur-md">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded">
                      <ApproachPhoto
                        id={hs.thumbId}
                        className="h-full w-full"
                        imgClassName="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-semibold tracking-wider text-[#E8DECE] uppercase">
                        {hs.label}
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#E8DECE]/80">
                        {hs.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Short sentence bottom-left */}
        <div className="absolute bottom-8 left-6 z-30 max-w-md lg:bottom-16 lg:left-16 xl:bottom-20 xl:left-24">
          <p
            ref={sentenceRef}
            className="font-sans text-[clamp(1rem,1.2vw,1.25rem)] leading-relaxed text-[#E8DECE]/90"
          >
            A complete home, handed over with thorough documentation, care protocols, and peace of mind.
          </p>
        </div>
      </div>
    </Panel>
  );
}
