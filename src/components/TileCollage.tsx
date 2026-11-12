import { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images, type ImageId } from "@/content/images";

gsap.registerPlugin(ScrollTrigger);

type CropFocal = "left" | "right" | "center";

const focalToObjectPosition = (focal: CropFocal): string => {
  switch (focal) {
    case "left": return "0% 50%";
    case "right": return "100% 50%";
    default: return "50% 50%";
  }
};

type Tile = { imageId: ImageId; focal: CropFocal; col: number; row: number };

// Build 12 tiles: each of 6 images in 2 crops (left + right), arranged in 3 columns x 4 rows
const tiles: Tile[] = (() => {
  const result: Tile[] = [];
  const crops: CropFocal[] = ["left", "right"];
  let idx = 0;
  for (const image of images) {
    for (const crop of crops) {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      result.push({ imageId: image.id, focal: crop, col, row });
      idx++;
    }
  }
  // Shuffle deterministically for visual variety
  const order = [0, 5, 2, 7, 4, 9, 1, 6, 3, 8, 10, 11];
  return order.map((i) => result[i]);
})();

export type TileCollageHandle = {
  converge: () => void;
  diverge: () => void;
};

type Props = {
  className?: string;
  rotation?: number;
  idleDrift?: boolean;
  scrollParallax?: boolean;
  staggerEntrance?: boolean;
  labelChip?: boolean;
};

export const TileCollage = forwardRef<TileCollageHandle, Props>(function TileCollage(
  { className = "", rotation = -16, idleDrift = true, scrollParallax = true, staggerEntrance = true, labelChip = true },
  ref,
) {
  const root = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement[]>([]);
  const tilesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const cleanups: Array<() => void> = [];

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (staggerEntrance && root.current) {
        const ctx = gsap.context(() => {
          gsap.set(tilesRef.current, { clipPath: "inset(100% 0 0 0)" });
          ScrollTrigger.create({
            trigger: root.current,
            start: "top 90%",
            once: true,
            onEnter: () => {
              gsap.to(tilesRef.current, {
                clipPath: "inset(0 0 0 0)",
                duration: 0.9,
                ease: "power3.inOut",
                stagger: { each: 0.05, from: "random" },
              });
            },
          });
        }, root.current);
        cleanups.push(() => ctx.revert());
      }

      if (idleDrift && root.current) {
        const cols = columnsRef.current.filter(Boolean);
        let raf = 0;
        let startTime = 0;
        let inView = false;
        const tick = () => {
          if (!inView) { raf = 0; return; }
          const t = (performance.now() - startTime) / 1000;
          cols.forEach((col, i) => {
            const dir = i === 1 ? 1 : -1;
            const speed = 40 + i * 10;
            gsap.set(col, { y: Math.sin(t * 0.4 + i * 1.5) * dir * speed });
          });
          raf = requestAnimationFrame(tick);
        };
        const start = () => { if (!inView) { inView = true; startTime = performance.now(); raf = requestAnimationFrame(tick); } };
        const stop = () => { inView = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
        const obs = new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop(), { threshold: 0.05 });
        obs.observe(root.current);
        cleanups.push(() => { stop(); obs.disconnect(); });
      }

      if (scrollParallax && root.current) {
        const ctx = gsap.context(() => {
          const trigger = ScrollTrigger.create({
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
            onUpdate: (self) => {
              gsap.set(root.current, { y: self.progress * 80 });
            },
          });
          return () => trigger.kill();
        }, root.current);
        cleanups.push(() => ctx.revert());
      }
    });

    return () => { cleanups.forEach((c) => c()); mm.revert(); };
  }, [staggerEntrance, idleDrift, scrollParallax]);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") return;
    ref.current = {
      converge: () => {
        gsap.to(root.current, { rotation: 0, duration: 1.4, ease: "power3.inOut" });
        gsap.to(tilesRef.current, { x: 0, y: 0, duration: 1.4, ease: "power3.inOut", stagger: 0.04 });
      },
      diverge: () => {
        gsap.to(root.current, { rotation, duration: 1.4, ease: "power3.inOut" });
      },
    };
  }, [ref, rotation]);

  const cols = [0, 1, 2];
  tilesRef.current = [];

  return (
    <div ref={root} className={`relative ${className}`} style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {cols.map((col) => (
          <div
            key={col}
            ref={(el) => { if (el) columnsRef.current[col] = el; }}
            className="flex flex-col gap-2 md:gap-3"
          >
            {tiles.filter((t) => t.col === col).map((tile, i) => {
              const image = images.find((img) => img.id === tile.imageId)!;
              return (
                <div
                  key={`${tile.imageId}-${tile.focal}`}
                  ref={(el) => { if (el) tilesRef.current.push(el); }}
                  className="relative aspect-[3/4] overflow-clip"
                >
                  <img
                    src={image.src["1672"]}
                    alt={image.alt}
                    width={1672}
                    height={941}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: focalToObjectPosition(tile.focal) }}
                  />
                  {labelChip && i === 0 && (
                    <span className="absolute bottom-2 left-2 z-10 bg-hero-ink/80 px-2 py-1 font-sans text-[1.1667rem] leading-none text-hero-linen backdrop-blur-sm">
                      {image.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});
