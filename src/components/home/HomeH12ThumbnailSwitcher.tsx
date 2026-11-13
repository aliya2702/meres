import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { prefersReducedMotion } from "@/motion/tokens";

const THUMBNAILS = [
  { id: "D5", thumbId: "K6", caption: "Kitchen Millwork", desc: "Honed stone and custom fluted oak cabinetry." },
  { id: "B5", thumbId: "B5", caption: "Bathing Suite", desc: "Minimalist travertine vanity and warm cove light." },
  { id: "W1", thumbId: "W1", caption: "Craft Workshop", desc: "Fine timber shavings and precision joinery." },
  { id: "W2", thumbId: "W2", caption: "Hand Joinery", desc: "Bespoke dovetails and Japanese hand tools." },
  { id: "P2", thumbId: "P2", caption: "Material Samples", desc: "Curated wood veneer decks and stone samples." },
];

/**
 * H12 THUMBNAIL SWITCHER.
 * Linen background.
 * Left 60%: big full-height image with thin vertical strip of five square thumbnails on right edge.
 * Clicking or auto-cycling (every 3s) crossfades big image (0.8s) and highlights active thumbnail.
 * Right 40%: linen with short paragraph bottom-right (4 lines) and caption of active image above it.
 */
export function HomeH12ThumbnailSwitcher() {
  const panelRef = useRef<HTMLElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    const leftBlock = leftBlockRef.current;
    const caption = captionRef.current;
    const para = paraRef.current;
    if (!panel || !leftBlock || !caption || !para) return;

    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(leftBlock, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(caption, { opacity: 0, y: 15 });
      gsap.set(para, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          onEnter: () => {
            setIsVisible(true);
            tl.play();
          },
          onLeaveBack: () => {
            setIsVisible(false);
          },
        },
      });

      tl.to(
        leftBlock,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.0,
          ease: "power4.out",
        },
        0
      )
        .to(
          caption,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          0.3
        )
        .to(
          para,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          0.45
        );

      failsafeId = window.setTimeout(() => {
        setIsVisible(true);
        if (tl.progress() < 1) tl.progress(1);
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
    };
  }, []);

  // Auto-cycle every 3s while visible
  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;

    const line = progressLineRef.current;
    if (line) {
      gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 3.0, ease: "none" });
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % THUMBNAILS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isVisible, activeIndex]);

  // Masked caption swap
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = captionRef.current;
    if (!el) return;

    gsap.fromTo(el, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
  }, [activeIndex]);

  const active = THUMBNAILS[activeIndex];

  return (
    <Panel
      id="home-h12-thumbnails"
      zIndex={12}
      background="#E8DECE"
      theme="light"
      panelRef={panelRef}
      className="panel-h12"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col lg:flex-row">
        {/* Left 60%: Big full-height image + vertical thumbnail strip on right edge */}
        <div
          ref={leftBlockRef}
          className="relative h-[55svh] w-full overflow-hidden bg-[#1B211A] lg:h-full lg:w-[60%]"
        >
          {/* Main crossfading image */}
          {THUMBNAILS.map((item, idx) => (
            <div
              key={item.id}
              className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
                idx === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <HomePhoto
                id={item.id}
                className="h-full w-full"
                imgClassName="object-cover"
              />
            </div>
          ))}

          {/* Vertical thumbnail strip pinned to right edge */}
          <div className="absolute top-0 bottom-0 right-0 z-20 flex w-20 flex-col items-center justify-center gap-3 bg-[#1B211A]/80 p-2 backdrop-blur-md lg:w-24">
            {THUMBNAILS.map((item, idx) => (
              <button
                key={item.thumbId}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View ${item.caption}`}
                className={`relative aspect-square w-14 overflow-hidden rounded transition-all duration-300 lg:w-16 ${
                  idx === activeIndex
                    ? "ring-2 ring-[#E8DECE] scale-105"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                <HomePhoto
                  id={item.thumbId}
                  className="h-full w-full"
                  imgClassName="object-cover"
                />
              </button>
            ))}

            {/* Hairline progress rule under strip */}
            <div className="relative mt-2 h-0.5 w-14 overflow-hidden bg-[#E8DECE]/20 lg:w-16">
              <div
                ref={progressLineRef}
                className="h-full w-full origin-left bg-[#E8DECE]"
              />
            </div>
          </div>
        </div>

        {/* Right 40%: Linen story panel with active caption + short paragraph */}
        <div className="relative flex flex-1 flex-col justify-end bg-[#E8DECE] p-6 lg:w-[40%] lg:p-14 xl:p-18">
          <div className="max-w-md pb-2 lg:pb-6">
            <span className="mb-2 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
              Spaces in Focus
            </span>

            {/* Active caption */}
            <div ref={captionRef} className="mb-4">
              <h2 className="font-serif text-[clamp(2rem,3.8vw,3.8rem)] leading-none text-[#2C382A]">
                {active.caption}
              </h2>
              <p className="mt-1 font-sans text-xs tracking-wider text-[#AD9680]">
                {active.desc}
              </p>
            </div>

            {/* Short paragraph bottom-right */}
            <p
              ref={paraRef}
              className="mt-4 font-sans text-[clamp(0.95rem,1.15vw,1.125rem)] leading-relaxed text-[#2C382A]/80"
            >
              Every room begins with how your days unfold. We align architectural drawings, structural craftsmanship, and bespoke millwork so the result feels unified and effortless.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

