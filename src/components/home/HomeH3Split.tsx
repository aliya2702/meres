import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { HomePhoto } from "./HomePhoto";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * H3 SPLIT WITH SMALL INSET.
 * Left 50%: forest-to-teal mood gradient with slow drifting blobs.
 * Small inset photo (K3, portrait, ~12vw) drops in from top-left corner (clip + 60px translate).
 * Short paragraph bottom-left in small DM Sans (max 3 lines):
 * "The details are personal: the drawer you reach for, the place everyone gathers, the quiet room at the end of the day."
 * Right 50%: tall full-height exterior/interior E2 wiping up from bottom.
 */
export function HomeH3Split() {
  const panelRef = useRef<HTMLElement>(null);
  const insetRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const rightWipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const inset = insetRef.current;
    const para = paraRef.current;
    const rightWipe = rightWipeRef.current;
    if (!panel || !inset || !para || !rightWipe) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(inset, { clipPath: "inset(0 0 100% 0)", y: -60, opacity: 0 });
      gsap.set(para, { opacity: 0, y: 20 });
      gsap.set(rightWipe, { clipPath: "inset(100% 0 0 0)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // Right image wipes up from bottom
      tl.to(
        rightWipe,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.0,
          ease: "power4.out",
        },
        0
      )
        // Inset drops from top-left corner
        .to(
          inset,
          {
            clipPath: "inset(0% 0 0% 0)",
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          0.2
        )
        // Short paragraph rises
        .to(
          para,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          0.4
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
      id="home-h3-split"
      zIndex={3}
      background="#243023"
      theme="dark"
      panelRef={panelRef}
      className="panel-h3"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col lg:flex-row">
        {/* Left 50%: Forest-to-teal gradient + inset + paragraph */}
        <div className="relative flex h-[50svh] w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2C382A] via-[#223326] to-[#1a2b22] p-6 lg:h-full lg:w-1/2 lg:p-14 xl:p-18">
          {/* Drifting ambient radial blob */}
          <div
            aria-hidden="true"
            className="home-blob-anim pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#3c543c]/35 blur-3xl"
          />

          {/* Small inset photo K3 dropping in from top-left */}
          <div className="relative z-10 pt-4 lg:pt-6">
            <div
              ref={insetRef}
              className="w-[32vw] max-w-[190px] aspect-[3/4] overflow-hidden rounded-sm border border-[rgba(232,222,206,0.22)] bg-[#AD9680] shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
            >
              <HomePhoto
                id="K3"
                className="h-full w-full"
                imgClassName="object-cover"
              />
            </div>
          </div>

          {/* Short paragraph bottom-left */}
          <div className="relative z-10 max-w-md pb-2 lg:pb-6">
            <h2
              ref={paraRef}
              className="font-sans text-[clamp(1.05rem,1.25vw,1.25rem)] leading-relaxed text-[#E8DECE]/90"
            >
              The details are personal: the drawer you reach for, the place everyone gathers, the quiet room at the end of the day.
            </h2>
          </div>
        </div>

        {/* Right 50%: Tall exterior E2 wiping up from bottom */}
        <div className="relative h-[50svh] w-full overflow-hidden bg-[#1B211A] lg:h-full lg:w-1/2">
          <div
            ref={rightWipeRef}
            className="relative h-full w-full overflow-hidden"
          >
            <HomePhoto
              id="E2"
              className="h-full w-full"
              imgClassName="object-cover"
              showChip
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}

