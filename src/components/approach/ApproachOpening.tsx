import { useEffect, useRef } from "react";
import gsap from "gsap";
import { approachOpening } from "@/data/approachShowcase";
import { splitText, type Split } from "@/motion/splitText";
import { EASE, MQ, STAGGER } from "@/motion/tokens";

export function ApproachOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const clipWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paraRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const clipWrap = clipWrapRef.current;
    const imgEl = imgRef.current;
    const cardEl = cardRef.current;
    const titleEl = titleRef.current;

    if (!section || !clipWrap || !imgEl || !cardEl || !titleEl) return;

    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      let cancelled = false;
      let tl: gsap.core.Timeline | null = null;
      const splits: Split[] = [];

      gsap.set(clipWrap, {
        clipPath: "inset(8%)",
        WebkitClipPath: "inset(8%)",
      });
      gsap.set(imgEl, { scale: 1.15, transformOrigin: "50% 50%" });
      gsap.set(cardEl, {
        clipPath: "inset(100% 0% 0% 0%)",
        WebkitClipPath: "inset(100% 0% 0% 0%)",
      });

      const runEntrance = async () => {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
        if (cancelled) return;

        const titleSplit = splitText(titleEl, { lines: true });
        splits.push(titleSplit);

        const paraLines: HTMLElement[] = [];
        paraRefs.current.forEach((pEl) => {
          if (!pEl) return;
          const pSplit = splitText(pEl, { lines: true });
          splits.push(pSplit);
          paraLines.push(...pSplit.lines);
        });

        gsap.set([...titleSplit.lines, ...paraLines], { yPercent: 108 });

        tl = gsap.timeline();
        tl.to(
          clipWrap,
          {
            clipPath: "inset(0%)",
            WebkitClipPath: "inset(0%)",
            duration: 1.5,
            ease: EASE.wipe,
            clearProps: "clipPath,WebkitClipPath",
          },
          0,
        )
          .to(
            imgEl,
            {
              scale: 1,
              duration: 1.5,
              ease: EASE.wipe,
              clearProps: "transform",
            },
            0,
          )
          .to(
            cardEl,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              WebkitClipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: EASE.wipe,
              clearProps: "clipPath,WebkitClipPath",
            },
            0.6,
          )
          .to(
            titleSplit.lines,
            {
              yPercent: 0,
              duration: 1.0,
              stagger: STAGGER.lines,
              ease: EASE.reveal,
              clearProps: "transform",
            },
            1.0,
          )
          .to(
            paraLines,
            {
              yPercent: 0,
              duration: 0.9,
              stagger: 0.06,
              ease: EASE.reveal,
              clearProps: "transform",
            },
            1.4,
          );
      };

      void runEntrance();

      return () => {
        cancelled = true;
        tl?.kill();
        splits.forEach((s) => s.revert());
        gsap.set([clipWrap, imgEl, cardEl], { clearProps: "all" });
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach-opening"
      data-theme="dark"
      className="relative min-h-[100svh] w-full overflow-hidden bg-forest"
    >
      <div ref={clipWrapRef} className="absolute inset-0 h-full w-full overflow-hidden">
        <img
          ref={imgRef}
          src={approachOpening.image.src}
          alt={approachOpening.image.alt}
          className="h-full w-full object-cover"
          style={{
            objectPosition: `${approachOpening.image.focal.xPct}% ${approachOpening.image.focal.yPct}%`,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(35, 45, 34, 0.56) 0%, rgba(35, 45, 34, 0.16) 45%, rgba(35, 45, 34, 0.28) 100%)",
          }}
        />
      </div>

      {/* Bottom-left green editorial card (moves into flow spacing at narrow viewports) */}
      <div
        className="relative z-20 flex min-h-[100svh] w-full flex-col justify-end md:block"
      >
        <div
          ref={cardRef}
          className="mx-auto mb-6 mt-36 bg-green text-linen md:m-0 md:absolute"
          style={{
            left: "clamp(1.5rem, 5vw, 5rem)",
            bottom: "clamp(1.5rem, 5vw, 5rem)",
            width: "min(calc(100vw - 3rem), clamp(28rem, 40vw, 44rem))",
            padding: "clamp(1.5rem, 3vw, 3rem)",
          }}
        >
          <h1
            ref={titleRef}
            className="font-serif text-linen"
            style={{
              fontSize: "clamp(2.25rem, 4vw, 4.25rem)",
              lineHeight: 1.06,
            }}
          >
            {approachOpening.title}
          </h1>

          <div className="mt-5 flex flex-col gap-4">
            {approachOpening.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                ref={(el) => {
                  paraRefs.current[idx] = el;
                }}
                className="font-sans text-linen/92"
                style={{
                  fontSize: "clamp(1.1667rem, 1.25vw, 1.25rem)",
                  lineHeight: 1.6,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <span className="concept-chip pointer-events-none absolute right-5 top-24 z-30 md:bottom-5 md:top-auto">
        {approachOpening.image.label}
      </span>
    </section>
  );
}
