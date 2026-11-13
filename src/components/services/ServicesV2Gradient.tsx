import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Panel } from "@/components/StackSection";
import { ServicesPhoto } from "./ServicesPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

/**
 * V2 GRADIENT SENTENCE WITH FLOATING FRAMES.
 * Full-height forest-to-teal gradient with drifting blobs.
 * Centred sentence in grid 4-10 / 3-6, serif, lines rising:
 * "A kitchen that brings people closer. A bathroom that gives you a moment to yourself. More room, without losing what made the place yours."
 * Four small perimeter frames enter from different edges and drift in opposite directions, never touching text:
 * W1 from LEFT (1-3 / 5-8), M2 from TOP (10-12 / 1-3), B3 from RIGHT (11-13 / 5-8), M1 from BOTTOM (4-6 / 7-9).
 */
export function ServicesV2Gradient() {
  const panelRef = useRef<HTMLElement>(null);
  const sentenceRef = useRef<HTMLHeadingElement>(null);
  const w1Ref = useRef<HTMLDivElement>(null);
  const m2Ref = useRef<HTMLDivElement>(null);
  const b3Ref = useRef<HTMLDivElement>(null);
  const m1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const sentence = sentenceRef.current;
    const w1 = w1Ref.current;
    const m2 = m2Ref.current;
    const b3 = b3Ref.current;
    const m1 = m1Ref.current;
    if (!panel || !sentence) return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(sentence, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      if (w1) gsap.set(w1, { x: -70, opacity: 0 });
      if (m2) gsap.set(m2, { y: -70, opacity: 0 });
      if (b3) gsap.set(b3, { x: 70, opacity: 0 });
      if (m1) gsap.set(m1, { y: 70, opacity: 0 });

      // Entrance timeline triggered on enter
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        split.lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
        },
        0
      );

      const frames = [w1, m2, b3, m1].filter(Boolean);
      if (frames.length > 0) {
        tl.to(
          frames,
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.08,
            ease: "power4.out",
          },
          0.2
        );

        // Continuous organic drifting (transform only, opposite directions)
        if (w1) gsap.to(w1, { y: 14, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
        if (m2) gsap.to(m2, { y: -14, duration: 6.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        if (b3) gsap.to(b3, { y: 16, duration: 5.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
        if (m1) gsap.to(m1, { y: -12, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }

      // 3s failsafe
      failsafeId = window.setTimeout(() => {
        gsap.set(split.lines, { yPercent: 0, opacity: 1 });
        if (frames.length > 0) {
          gsap.set(frames, { x: 0, y: 0, opacity: 1 });
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
      panelRef={panelRef}
      zIndex={2}
      theme="dark"
      background="linear-gradient(135deg, #2C382A 0%, #1E332D 45%, #253A30 100%)"
      className="relative flex h-[100svh] min-h-[100svh] w-full overflow-hidden"
    >
      {/* Drifting soft radial ambient blobs */}
      <div
        className="services-blob pointer-events-none absolute -left-[15vw] -top-[10vh] h-[65vw] w-[65vw] rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, #AD9680 0%, rgba(173,150,128,0) 70%)",
        }}
      />
      <div
        className="services-blob pointer-events-none absolute -bottom-[15vh] -right-[15vw] h-[65vw] w-[65vw] rounded-full opacity-18 blur-3xl"
        style={{
          background: "radial-gradient(circle, #E8DECE 0%, rgba(232,222,206,0) 70%)",
          animationDelay: "-6s",
        }}
      />

      {/* Compositional Grid: 12 cols x 9 rows */}
      <div className="relative z-10 flex h-full w-full flex-col justify-center px-6 py-24 sm:px-10 lg:grid lg:grid-cols-12 lg:grid-rows-9 lg:gap-4 lg:p-10 lg:pt-28">
        {/* W1 from LEFT: grid 1-3 / 5-8 */}
        <div
          ref={w1Ref}
          className="hidden overflow-hidden rounded-sm border border-[rgba(232,222,206,0.18)] shadow-2xl lg:col-start-1 lg:col-end-4 lg:row-start-5 lg:row-end-8 lg:block"
        >
          <ServicesPhoto id="W1" className="h-full w-full" showConceptChip={false} />
        </div>

        {/* M2 from TOP: grid 10-12 / 1-3 */}
        <div
          ref={m2Ref}
          className="hidden overflow-hidden rounded-sm border border-[rgba(232,222,206,0.18)] shadow-2xl lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-4 lg:block"
        >
          <ServicesPhoto id="M2" className="h-full w-full" showConceptChip={false} />
        </div>

        {/* Sentence Centred in grid 4-10 / 3-6 */}
        <div className="relative z-20 flex items-center justify-center text-center lg:col-start-4 lg:col-end-10 lg:row-start-3 lg:row-end-7 lg:px-6">
          <h2
            ref={sentenceRef}
            className="font-serif font-normal leading-[1.2] tracking-[-0.015em] text-[#E8DECE]"
            style={{
              fontSize: "clamp(1.75rem, 3.2vw, 3.2rem)",
              textWrap: "balance",
              maxWidth: "80vw",
            }}
          >
            A kitchen that brings people closer. A bathroom that gives you a
            moment to yourself. More room, without losing what made the place
            yours.
          </h2>
        </div>

        {/* B3 from RIGHT: grid 11-13 / 5-8 */}
        <div
          ref={b3Ref}
          className="hidden overflow-hidden rounded-sm border border-[rgba(232,222,206,0.18)] shadow-2xl lg:col-start-11 lg:col-end-13 lg:row-start-5 lg:row-end-8 lg:block"
        >
          <ServicesPhoto id="B3" className="h-full w-full" showConceptChip={false} />
        </div>

        {/* M1 from BOTTOM: grid 4-6 / 7-9 */}
        <div
          ref={m1Ref}
          className="hidden overflow-hidden rounded-sm border border-[rgba(232,222,206,0.18)] shadow-2xl lg:col-start-4 lg:col-end-7 lg:row-start-7 lg:row-end-10 lg:block"
        >
          <ServicesPhoto id="M1" className="h-full w-full" showConceptChip={false} />
        </div>
      </div>
    </Panel>
  );
}
