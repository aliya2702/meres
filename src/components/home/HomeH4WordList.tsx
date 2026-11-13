import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { prefersReducedMotion } from "@/motion/tokens";

const WORD_ITEMS = [
  { word: "Kitchens", id: "K1", href: "/services#kitchens" },
  { word: "Bathrooms", id: "B1", href: "/services#bathrooms" },
  { word: "Additions", id: "E3", href: "/services#additions-custom-homes" },
  { word: "Custom homes", id: "E1", href: "/services#additions-custom-homes" },
];

/**
 * H4 STACKED WORD LIST OVER IMAGE.
 * Left half: full-height image wipes up from bottom; across lower edge giant ghost word "Home"
 * in linen at 12% opacity overlaps image edge.
 * Right half: gradient panel with vertical list of 4 words top-right in serif.
 * Active word is 100%, others 35%. Cycles every 2.4s while visible.
 * Left image crossfades between 4 matching images (K1, B1, E3, E1).
 * Sentence bottom-right: "Every space begins with a conversation." Clicking word links to Services anchor.
 */
export function HomeH4WordList() {
  const panelRef = useRef<HTMLElement>(null);
  const leftWipeRef = useRef<HTMLDivElement>(null);
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    const leftWipe = leftWipeRef.current;
    const sentence = sentenceRef.current;
    if (!panel || !leftWipe || !sentence) return;

    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(leftWipe, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(sentence, { opacity: 0, y: 15 });

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
        leftWipe,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.0,
          ease: "power4.out",
        },
        0
      ).to(
        sentence,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.3
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

  // Cycle active word & image every 2.4s
  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % WORD_ITEMS.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <Panel
      id="home-h4-word-list"
      zIndex={4}
      background="#1B211A"
      theme="dark"
      panelRef={panelRef}
      className="panel-h4"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col lg:flex-row">
        {/* Left half: Full-height crossfading image + Ghost "Home" word */}
        <div className="relative h-[50svh] w-full overflow-hidden bg-[#1B211A] lg:h-full lg:w-1/2">
          <div
            ref={leftWipeRef}
            className="relative h-full w-full overflow-hidden"
          >
            {/* 4 Crossfading images */}
            {WORD_ITEMS.map((item, idx) => (
              <div
                key={item.word}
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

            {/* Giant ghost word "Home" in linen at 12% opacity across lower edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 left-6 z-20 font-serif text-[clamp(6rem,18vw,16rem)] leading-none text-[#E8DECE]/12 select-none"
              style={{ mixBlendMode: "soft-light" }}
            >
              Home
            </div>
          </div>
        </div>

        {/* Right half: Gradient panel with vertical list of 4 words top-right */}
        <div className="relative flex h-[50svh] w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#273527] via-[#1f2d22] to-[#152219] p-6 lg:h-full lg:w-1/2 lg:p-14 xl:p-20">
          {/* Vertical word list top-right */}
          <div className="flex flex-col items-start pt-4 text-left lg:items-end lg:pt-8 lg:text-right">
            <span className="mb-4 block font-sans text-xs font-medium tracking-[0.22em] text-[#AD9680] uppercase">
              Our Disciplines
            </span>
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
              {WORD_ITEMS.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <Link
                    key={item.word}
                    to={item.href}
                    onClick={() => setActiveIndex(idx)}
                    className={`font-serif text-[clamp(2.2rem,4.6vw,4.8rem)] leading-none transition-all duration-500 hover:text-[#E8DECE] ${
                      isActive
                        ? "text-[#E8DECE] opacity-100 translate-x-0"
                        : "text-[#E8DECE]/40 opacity-40 hover:opacity-80"
                    }`}
                  >
                    {item.word}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Short sentence bottom-right */}
          <div className="pt-6 pb-2 text-left lg:pb-6 lg:text-right">
            <h2
              ref={sentenceRef}
              className="font-sans text-[clamp(1rem,1.2vw,1.25rem)] text-[#E8DECE]/85"
            >
              Every space begins with a conversation.
            </h2>
          </div>
        </div>
      </div>
    </Panel>
  );
}

