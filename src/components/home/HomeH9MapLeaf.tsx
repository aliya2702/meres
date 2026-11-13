import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * H9 MAP AND LEAF.
 * Full-bleed dusk-sky exterior E5 on top.
 * Green macro M5 wipes up covering lower 60%.
 * Linen map card (cols 4-13) rises from bottom with stylized hairline map of the Eastside.
 * SVG: drawn streets, Lake Washington shoreline, pin with MERES monogram.
 * Map lines draw in (stroke-dashoffset 1.5s), pin drops in with bounce.
 */
export function HomeH9MapLeaf() {
  const panelRef = useRef<HTMLElement>(null);
  const leafWipeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mapPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const pinRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const leafWipe = leafWipeRef.current;
    const card = cardRef.current;
    const pin = pinRef.current;
    if (!panel || !leafWipe || !card || !pin) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(leafWipe, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(card, { y: 100, opacity: 0 });
      gsap.set(pin, { y: -40, opacity: 0 });

      mapPathRefs.current.forEach((path) => {
        if (!path) return;
        const len = path.getTotalLength ? path.getTotalLength() : 400;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        leafWipe,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power4.out",
        },
        0
      )
        .to(
          card,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          0.2
        );

      // Map lines draw in over 1.5s
      mapPathRefs.current.forEach((path, i) => {
        if (!path) return;
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut",
          },
          0.4 + i * 0.1
        );
      });

      // Pin drops in with bounce
      tl.to(
        pin,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(2)",
        },
        1.1
      );

      failsafeId = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
    };
  }, []);

  return (
    <Panel
      id="home-h9-map-leaf"
      zIndex={9}
      background="#18231a"
      theme="dark"
      panelRef={panelRef}
      className="panel-h9"
    >
      <div className="relative h-full min-h-[100svh] w-full overflow-hidden bg-[#18231a]">
        {/* Full-bleed dusk-sky exterior E5 on top */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <HomePhoto
            id="E5"
            className="h-full w-full"
            imgClassName="object-cover"
          />
        </div>

        {/* Green macro M5 wipes up covering lower 60% */}
        <div
          ref={leafWipeRef}
          className="absolute bottom-0 left-0 right-0 z-10 h-[60%] overflow-hidden border-t border-[rgba(232,222,206,0.12)]"
        >
          <HomePhoto
            id="M5"
            className="h-full w-full opacity-80"
            imgClassName="object-cover"
          />
          <div
            aria-hidden="true"
            className="home-scrim-35 pointer-events-none absolute inset-0 z-10"
          />
        </div>

        {/* Linen map card rising from bottom (centered, cols 4-13) */}
        <div
          ref={cardRef}
          className="absolute bottom-6 left-6 right-6 z-20 mx-auto max-w-4xl rounded-sm border border-[rgba(44,56,42,0.18)] bg-[#E8DECE] p-6 shadow-2xl lg:bottom-12 lg:p-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-sm">
              <span className="mb-2 block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
                Location & Context
              </span>
              <h2 className="font-serif text-[clamp(1.8rem,3vw,2.8rem)] leading-snug text-[#2C382A]">
                Rooted in the Eastside.
              </h2>
              <p className="mt-2 font-sans text-xs leading-relaxed text-[#2C382A]/75">
                Every neighborhood holds its own daylight patterns, shoreline breezes, and architectural heritage.
              </p>
            </div>

            {/* Stylized hairline Eastside map (SVG placeholder: Lake Washington, shoreline, arterial hairlines, pin) */}
            <div className="relative h-44 w-full overflow-hidden rounded border border-[rgba(44,56,42,0.15)] bg-[#E2D6C3] p-2 lg:w-[380px]">
              <svg
                viewBox="0 0 380 180"
                className="h-full w-full"
                fill="none"
              >
                {/* Lake Washington shoreline placeholder */}
                <path
                  ref={(el) => {
                    mapPathRefs.current[0] = el;
                  }}
                  d="M40,10 C70,40 50,110 80,170"
                  stroke="#AD9680"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Mercer Island shape placeholder */}
                <path
                  ref={(el) => {
                    mapPathRefs.current[1] = el;
                  }}
                  d="M70,80 C85,65 95,90 90,120 C85,135 75,120 70,80 Z"
                  stroke="#AD9680"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                {/* Eastside arterials: 405 / 520 hairlines placeholder */}
                <path
                  ref={(el) => {
                    mapPathRefs.current[2] = el;
                  }}
                  d="M10,60 C120,60 220,50 370,50"
                  stroke="#2C382A"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
                <path
                  ref={(el) => {
                    mapPathRefs.current[3] = el;
                  }}
                  d="M180,10 C185,80 190,140 195,170"
                  stroke="#2C382A"
                  strokeWidth="1.2"
                  strokeOpacity="0.5"
                />
                <path
                  ref={(el) => {
                    mapPathRefs.current[4] = el;
                  }}
                  d="M110,30 C200,90 280,110 360,130"
                  stroke="#2C382A"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                />

                {/* Pin with MERES monogram dropping in */}
                <g ref={pinRef} transform="translate(190, 75)">
                  <circle cx="0" cy="0" r="14" fill="#2C382A" />
                  <circle cx="0" cy="0" r="18" stroke="#AD9680" strokeWidth="1" strokeDasharray="3 2" />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#E8DECE"
                    fontSize="10"
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    M
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

