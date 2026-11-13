import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { prefersReducedMotion } from "@/motion/tokens";

const SHOWCASE_ITEMS = [
  {
    id: "K4",
    title: "Kitchens",
    subtitle: "Made for mornings",
    href: "/services#kitchens",
  },
  {
    id: "B4",
    title: "Bathrooms",
    subtitle: "Spaces that restore",
    href: "/services#bathrooms",
  },
  {
    id: "D3",
    title: "Whole-home renovations",
    subtitle: "Unified throughout",
    href: "/services#whole-home",
  },
  {
    id: "E1",
    title: "Additions & custom homes",
    subtitle: "Designed to belong",
    href: "/services#additions-custom-homes",
  },
];

/**
 * H13 CARD OVER FULL-BLEED.
 * Full-bleed image under 25% ink scrim.
 * Forest card bottom-right (cols 9-12) shows title, subtitle, 1px divider, pill button "See more".
 * Every 3.2s while visible: image crossfades and card text swaps by masked lines:
 * Kitchens / Bathrooms / Whole-home / Additions and custom homes (K4, B4, D3, E1).
 * Giant serif "Services" begins at left edge behind forest strip and slides out of view as you scroll.
 */
export function HomeH13CardFullBleed() {
  const panelRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textSwapRef = useRef<HTMLDivElement>(null);
  const giantTitleRef = useRef<HTMLHeadingElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    const card = cardRef.current;
    const giantTitle = giantTitleRef.current;
    if (!panel || !card || !giantTitle) return;

    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(card, { y: 60, opacity: 0 });
      gsap.set(giantTitle, { xPercent: 0, opacity: 0 });

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
        card,
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        0
      ).to(
        giantTitle,
        {
          opacity: 0.25,
          duration: 1.0,
          ease: "power3.out",
        },
        0.2
      );

      // Scroll effect: giant title slides out of view to the left as you scroll
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(giantTitle, {
          xPercent: -60,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

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

  // 3.2s auto cycle
  useEffect(() => {
    if (!isVisible || prefersReducedMotion()) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Masked text swap
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = textSwapRef.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll("[data-swap]"),
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power3.out" }
    );
  }, [activeIndex]);

  const current = SHOWCASE_ITEMS[activeIndex];

  return (
    <Panel
      id="home-h13-card-bleed"
      zIndex={13}
      background="#1B211A"
      theme="dark"
      panelRef={panelRef}
      className="panel-h13"
    >
      <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[#1B211A]">
        {/* Full-bleed crossfading images under 25% scrim */}
        {SHOWCASE_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
              idx === activeIndex ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
          >
            <HomePhoto
              id={item.id}
              className="h-full w-full"
              imgClassName="object-cover"
            />
          </div>
        ))}

        {/* 25% ink scrim */}
        <div
          aria-hidden="true"
          className="home-scrim-25 pointer-events-none absolute inset-0 z-10"
        />

        {/* Forest vertical strip at left edge */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-0 z-15 hidden w-16 bg-[#2C382A]/80 backdrop-blur-sm lg:block"
        />

        {/* Giant serif "Services" at left edge sliding out on scroll */}
        <h2
          ref={giantTitleRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-12 left-6 z-20 font-serif text-[clamp(5rem,14vw,14rem)] leading-none text-[#E8DECE]/20 select-none will-change-transform lg:left-24"
        >
          Services
        </h2>

        {/* Forest card bottom-right (cols 9-12) */}
        <div
          ref={cardRef}
          className="absolute bottom-8 right-6 z-30 w-full max-w-sm rounded-sm border border-[rgba(232,222,206,0.22)] bg-[#2C382A]/95 p-8 shadow-2xl backdrop-blur-md lg:bottom-14 lg:right-14 lg:max-w-md xl:p-10"
        >
          <div ref={textSwapRef} className="overflow-hidden">
            <h3
              data-swap
              className="font-serif text-[clamp(1.8rem,2.8vw,3rem)] leading-snug text-[#E8DECE]"
            >
              {current.title}
            </h3>
            <p
              data-swap
              className="mt-2 font-sans text-sm tracking-wide text-[#AD9680]"
            >
              {current.subtitle}
            </p>
          </div>

          <div className="my-5 h-[1px] w-full bg-[rgba(232,222,206,0.18)]" />

          <div className="flex items-center justify-between">
            <Link
              to={current.href}
              className="inline-flex items-center rounded-full border border-[rgba(232,222,206,0.4)] bg-[#E8DECE] px-5 py-2 font-sans text-xs font-medium tracking-wider text-[#2C382A] uppercase transition-all duration-300 hover:bg-[#F5EFE6]"
            >
              See more &rarr;
            </Link>

            <span className="font-sans text-xs tracking-widest text-[#E8DECE]/60">
              0{activeIndex + 1} / 0{SHOWCASE_ITEMS.length}
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

