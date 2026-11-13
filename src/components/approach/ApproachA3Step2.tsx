import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Panel } from "@/components/StackSection";
import { ApproachPhoto } from "./ApproachPhoto";
import { splitText } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

/**
 * A3 STEP 2 "Define the work and the decisions ahead." (split with image stack).
 * Left half: forest-to-teal mood gradient with drifting radial blob; title top-left,
 * short sentence bottom-left, thin vertical hairline, giant outlined "02".
 * Right half: two stacked images (P1 above, K4 below) wiping up staggered (0.3s).
 * On scroll: continuous vertical feed where B2 slides up, replacing K4 while P1 pushes up and clips.
 */
export function ApproachA3Step2() {
  const panelRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);
  const imgTopRef = useRef<HTMLDivElement>(null);
  const imgBottomRef = useRef<HTMLDivElement>(null);
  const feedTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const title = titleRef.current;
    const sentence = sentenceRef.current;
    const numeral = numeralRef.current;
    const imgTop = imgTopRef.current;
    const imgBottom = imgBottomRef.current;
    const feedTrack = feedTrackRef.current;
    if (!panel || !title || !sentence || !numeral || !imgTop || !imgBottom || !feedTrack)
      return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    const split = splitText(title, { lines: true });

    const ctx = gsap.context(() => {
      // Hidden start states
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.set(sentence, { opacity: 0, y: 15 });
      gsap.set(numeral, { opacity: 0, scale: 0.95 });
      gsap.set(imgTop, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(imgBottom, { clipPath: "inset(100% 0 0 0)" });

      // Entrance timeline
      const enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      enterTl
        .to(
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
          0.15
        )
        .to(
          sentence,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0.35
        )
        // Image stack entrance wipe with 0.3s stagger
        .to(
          imgTop,
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.0,
            ease: "power4.out",
          },
          0.2
        )
        .to(
          imgBottom,
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.0,
            ease: "power4.out",
          },
          0.5
        );

      // Continuous vertical feed scrub on scroll
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(feedTrack, {
          yPercent: -33.333,
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
        if (enterTl.progress() < 1) {
          enterTl.progress(1);
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
      id="approach-step-2"
      zIndex={3}
      background="#243023"
      theme="dark"
      panelRef={panelRef}
      className="panel-a3"
    >
      <div className="relative flex h-full min-h-[100svh] w-full flex-col lg:flex-row">
        {/* Step corner counter */}
        <div className="absolute top-6 right-6 z-30 font-sans text-xs tracking-[0.25em] text-[#E8DECE]/70 lg:top-10 lg:right-12">
          02 / 05
        </div>

        {/* Left half: Forest-to-teal mood gradient + radial blob + text */}
        <div className="relative flex h-[50svh] w-full flex-col justify-between overflow-hidden border-b border-[rgba(173,150,128,0.2)] bg-gradient-to-br from-[#2C382A] via-[#243328] to-[#1a2b25] p-6 lg:h-full lg:w-1/2 lg:border-b-0 lg:border-r lg:p-14 xl:p-20">
          {/* Drifting radial mood blob */}
          <div
            aria-hidden="true"
            className="approach-blob-anim pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#3d523c]/40 blur-3xl"
          />

          {/* Giant outlined 02 behind top-left title */}
          <div
            ref={numeralRef}
            aria-hidden="true"
            className="giant-numeral giant-numeral-dark absolute top-[6vh] left-[3vw] z-0 pointer-events-none"
          >
            02
          </div>

          {/* Title block top-left */}
          <div className="relative z-10 pt-4 lg:pt-8">
            <span className="mb-3 block font-sans text-xs font-medium tracking-[0.2em] text-[#AD9680] uppercase">
              Step 02 &mdash; Architecture & Scope
            </span>
            <h2
              ref={titleRef}
              className="font-serif text-[clamp(2.1rem,4.2vw,4.5rem)] leading-[1.08] text-[#E8DECE] tracking-[-0.02em]"
            >
              Define the work and the decisions ahead.
            </h2>
          </div>

          {/* Short sentence bottom-left */}
          <div className="relative z-10 max-w-md pb-2 lg:pb-6">
            <p
              ref={sentenceRef}
              className="font-sans text-[clamp(0.95rem,1.15vw,1.15rem)] leading-relaxed text-[#E8DECE]/80"
            >
              Every material selection, engineering specification, and schedule milestone mapped before a single tool is lifted.
            </p>
          </div>
        </div>

        {/* Right half: Continuous vertical image feed */}
        <div className="relative h-[50svh] w-full overflow-hidden bg-[#1B211A] lg:h-full lg:w-1/2">
          {/* Feed track containing P1, K4, and B2 sliding up on scroll */}
          <div
            ref={feedTrackRef}
            className="relative flex h-[150%] w-full flex-col lg:h-[150%]"
          >
            {/* Slot 1: P1 (Process - Blueprint drafting) */}
            <div
              ref={imgTopRef}
              className="relative h-1/3 w-full border-b border-[rgba(232,222,206,0.1)] overflow-hidden"
            >
              <ApproachPhoto
                id="P1"
                className="h-full w-full"
                imgClassName="object-cover"
              />
              <span className="concept-chip absolute bottom-3 right-3 z-10">
                P1 &bull; Architectural Drafting
              </span>
            </div>

            {/* Slot 2: K4 (Kitchen millwork) */}
            <div
              ref={imgBottomRef}
              className="relative h-1/3 w-full border-b border-[rgba(232,222,206,0.1)] overflow-hidden"
            >
              <ApproachPhoto
                id="K4"
                className="h-full w-full"
                imgClassName="object-cover"
              />
              <span className="concept-chip absolute bottom-3 right-3 z-10">
                K4 &bull; Joinery Specifications
              </span>
            </div>

            {/* Slot 3: B2 (Bathroom finishes - slides up on scroll) */}
            <div className="relative h-1/3 w-full overflow-hidden">
              <ApproachPhoto
                id="B2"
                className="h-full w-full"
                imgClassName="object-cover"
              />
              <span className="concept-chip absolute bottom-3 right-3 z-10">
                B2 &bull; Stone & Wet-Area Plan
              </span>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

