import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { ServicesPhoto } from "./ServicesPhoto";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * V9 MOSAIC.
 * Left half: tall B1.
 * Top-right strip: forest with the line "Light, storage, comfort."
 * Bottom-right: two stacked images (D3 and M2) wiping up one after the other.
 * Full 100svh, no gaps.
 */
export function ServicesV9Mosaic() {
  const panelRef = useRef<HTMLElement>(null);
  const leftImgRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const leftImg = leftImgRef.current;
    const strip = stripRef.current;
    const img1 = img1Ref.current;
    const img2 = img2Ref.current;

    if (!panel || !leftImg || !strip || !img1 || !img2) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(leftImg, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(strip, { y: -50, opacity: 0 });
      gsap.set(img1, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(img2, { clipPath: "inset(100% 0 0 0)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        leftImg,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power4.out",
        },
        0
      );

      tl.to(
        strip,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.2
      );

      tl.to(
        img1,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.9,
          ease: "power4.out",
        },
        0.35
      );

      tl.to(
        img2,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.9,
          ease: "power4.out",
        },
        0.55
      );

      failsafeId = window.setTimeout(() => {
        gsap.set([leftImg, img1, img2], { clipPath: "inset(0% 0 0 0)" });
        gsap.set(strip, { y: 0, opacity: 1 });
      }, 3000);
    }, panel);

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      ctx.revert();
    };
  }, []);

  return (
    <Panel
      panelRef={panelRef}
      zIndex={9}
      theme="light"
      className="relative h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#E8DECE]"
    >
      <div className="flex h-full w-full flex-col lg:flex-row">
        {/* Left half: Tall B1 */}
        <div
          ref={leftImgRef}
          className="relative h-1/2 w-full overflow-hidden bg-[#AD9680] lg:h-full lg:w-1/2"
        >
          <ServicesPhoto
            id="B1"
            className="h-full w-full"
            imgClassName="object-cover object-center"
            showConceptChip={false}
          />
        </div>

        {/* Right half: Top strip + Two stacked images (D3 and M2) */}
        <div className="relative flex h-1/2 w-full flex-col lg:h-full lg:w-1/2">
          {/* Top-right strip: Forest with line "Light, storage, comfort." */}
          <div
            ref={stripRef}
            className="flex items-center justify-between border-b border-[rgba(232,222,206,0.15)] bg-[#2C382A] px-6 py-5 text-[#E8DECE] sm:px-8 md:px-12 md:py-6"
          >
            <div>
              <span className="block font-sans text-xs font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
                The Essentials
              </span>
              <h2 className="mt-1 font-serif text-[clamp(1.4rem,2.2vw,2.2rem)] font-normal tracking-[-0.01em]">
                Light, storage, comfort.
              </h2>
            </div>
          </div>

          {/* Bottom-right: two stacked images (D3 and M2) filling remaining height */}
          <div className="relative flex flex-1 flex-col sm:flex-row">
            {/* D3 */}
            <div
              ref={img1Ref}
              className="relative h-1/2 w-full overflow-hidden bg-[#AD9680] sm:h-full sm:w-1/2"
            >
              <ServicesPhoto
                id="D3"
                className="h-full w-full"
                imgClassName="object-cover object-center"
                showConceptChip={false}
              />
            </div>
            {/* M2 */}
            <div
              ref={img2Ref}
              className="relative h-1/2 w-full overflow-hidden bg-[#AD9680] sm:h-full sm:w-1/2"
            >
              <ServicesPhoto
                id="M2"
                className="h-full w-full"
                imgClassName="object-cover object-center"
                showConceptChip={false}
              />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
