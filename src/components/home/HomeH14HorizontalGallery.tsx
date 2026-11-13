import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_FRAMES = [
  { id: "K1", title: "Craft", subtitle: "Cabinetry & Stone" },
  { id: "D1", title: "Care", subtitle: "Living Spaces" },
  { id: "E2", title: "Clarity", subtitle: "Architecture & Light" },
  { id: "B1", title: "Home", subtitle: "Sanctuary Suites" },
];

/**
 * H14 HORIZONTAL TITLE GALLERY.
 * Forest background.
 * A horizontal row of large framed images (each ~38vw wide, 64vh tall, 3vw gap)
 * slides left as you scroll (translateX tied to scroll via ScrollTrigger on 300svh wrapper).
 * Each frame has a giant serif title overlapping its lower-left corner (mix-blend-mode: difference):
 * "Craft" (K1), "Care" (D1), "Clarity" (E2), "Home" (B1).
 * 1px progress line at bottom fills as row moves.
 * Hover lifts frame 8px and shows "View" cursor.
 */
export function HomeH14HorizontalGallery() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const progressBar = progressBarRef.current;
    if (!wrapper || !track) return;

    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      // Calculate travel distance so the last frame aligns cleanly at the end of scroll
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        return -(trackWidth - window.innerWidth + window.innerWidth * 0.12);
      };

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBar) {
              progressBar.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      return () => {
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <Panel
      id="home-h14-gallery"
      zIndex={14}
      background="#1B221A"
      theme="dark"
      panelRef={wrapperRef}
      panelRise="manual"
      className="home-gallery-panel panel-h14"
    >
      <div className="home-gallery-stage relative flex flex-col justify-between overflow-hidden bg-[#1B221A] p-6 lg:p-14">
        {/* Gallery Header */}
        <div className="relative z-20 flex items-center justify-between pt-2">
          <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
            Curated Spaces
          </span>
          <span className="font-sans text-xs tracking-widest text-[#E8DECE]/60">
            Scroll to explore &rarr;
          </span>
        </div>

        {/* Sliding horizontal row of framed images */}
        <div className="relative z-10 my-auto w-full overflow-x-auto overflow-y-hidden py-4 scrollbar-none lg:overflow-visible">
          <div
            ref={trackRef}
            className="flex items-center gap-[3vw] min-w-max pl-[4vw] will-change-transform"
          >
            {GALLERY_FRAMES.map((frame) => (
              <div
                key={frame.title}
                data-cursor="view"
                className="group relative h-[56svh] w-[82vw] sm:w-[55vw] lg:h-[64vh] lg:w-[38vw] shrink-0 cursor-pointer overflow-hidden rounded-sm border border-[rgba(232,222,206,0.18)] bg-[#2C382A] shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out hover:-translate-y-2"
              >
                {/* Image */}
                <HomePhoto
                  id={frame.id}
                  className="h-full w-full"
                  imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Scrim for contrast */}
                <div
                  aria-hidden="true"
                  className="home-scrim-bl pointer-events-none absolute inset-0 z-10"
                />

                {/* Subtitle tag top-right */}
                <span className="absolute top-4 right-4 z-20 rounded-full bg-[#1B221A]/80 px-3 py-1 font-sans text-[11px] font-medium tracking-wider text-[#E8DECE] backdrop-blur-md">
                  {frame.subtitle}
                </span>

                {/* Giant serif title overlapping lower-left with mix-blend-mode: difference */}
                <div className="pointer-events-none absolute bottom-4 left-4 z-20 lg:bottom-6 lg:left-6">
                  <h3
                    className="font-serif text-[clamp(3.5rem,6vw,6rem)] leading-none text-[#E8DECE] mix-blend-difference select-none tracking-[-0.03em]"
                  >
                    {frame.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1px bottom progress line */}
        <div className="relative z-20 pt-2">
          <div className="h-[1px] w-full overflow-hidden bg-[rgba(232,222,206,0.18)]">
            <div
              ref={progressBarRef}
              className="h-full w-full origin-left bg-[#E8DECE] transition-transform duration-75"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}

