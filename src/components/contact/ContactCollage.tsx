import { useEffect, useRef } from "react";
import gsap from "gsap";
import { img, STOCK_LABEL } from "@/data/images";
import { prefersReducedMotion } from "@/motion/tokens";

export interface ContactCollageProps {
  nameValid: boolean;
  emailValid: boolean;
  cityValid: boolean;
  typeValid: boolean;
  projectValid: boolean;
  allValid: boolean;
}

/**
 * ContactCollage (Left Zone 55% width).
 * Forest-to-teal mood gradient with slow drifting blobs.
 * Collage of five image slots in a 12x9 compositional grid:
 * - D1: cols 1-6, rows 1-5 (wipes from LEFT on load)
 * - K1: cols 6-12, rows 1-4 (wipes from TOP when name is valid)
 * - M2: cols 1-5, rows 6-9 (wipes from LEFT-BOTTOM when email is valid)
 * - B1: cols 5-9, rows 5-9 (wipes from BOTTOM when city is valid)
 * - E2: cols 9-12, rows 5-9 (wipes from RIGHT when project type is valid)
 * Hairline progress bar across the top filling 0-100%.
 * Title "Tell us what matters." bottom-left on scrim.
 */
export function ContactCollage({
  nameValid,
  emailValid,
  cityValid,
  typeValid,
  projectValid,
  allValid,
}: ContactCollageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const slotD1Ref = useRef<HTMLDivElement>(null);
  const slotK1Ref = useRef<HTMLDivElement>(null);
  const slotM2Ref = useRef<HTMLDivElement>(null);
  const slotB1Ref = useRef<HTMLDivElement>(null);
  const slotE2Ref = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);

  // Initial load entrance: D1 wipes from left, title rises
  useEffect(() => {
    const d1 = slotD1Ref.current;
    const title = titleRef.current;
    const lead = leadRef.current;
    if (!d1 || !title || !lead) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(d1, { clipPath: "inset(0 100% 0 0)", opacity: 0.8 });
      gsap.set([title, lead], { y: 24, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.15 });

      tl.to(d1, {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 1.0,
        ease: "power4.out",
      }, 0);

      tl.to([title, lead], {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      }, 0.3);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Slot 2: K1 from TOP when name is valid
  useEffect(() => {
    const k1 = slotK1Ref.current;
    if (!k1 || prefersReducedMotion()) return;

    if (nameValid || allValid) {
      gsap.to(k1, {
        clipPath: "inset(0% 0 0 0)",
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
      });
    } else {
      gsap.to(k1, {
        clipPath: "inset(0 0 100% 0)",
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: "power3.in",
      });
    }
  }, [nameValid, allValid]);

  // Slot 3: M2 from LEFT-BOTTOM when email is valid
  useEffect(() => {
    const m2 = slotM2Ref.current;
    if (!m2 || prefersReducedMotion()) return;

    if (emailValid || allValid) {
      gsap.to(m2, {
        clipPath: "inset(0 0 0% 0)",
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
      });
    } else {
      gsap.to(m2, {
        clipPath: "inset(100% 0 0 100%)",
        opacity: 0,
        x: -40,
        y: 40,
        duration: 0.6,
        ease: "power3.in",
      });
    }
  }, [emailValid, allValid]);

  // Slot 4: B1 from BOTTOM when city is valid
  useEffect(() => {
    const b1 = slotB1Ref.current;
    if (!b1 || prefersReducedMotion()) return;

    if (cityValid || allValid) {
      gsap.to(b1, {
        clipPath: "inset(0% 0 0 0)",
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power4.out",
      });
    } else {
      gsap.to(b1, {
        clipPath: "inset(100% 0 0 0)",
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: "power3.in",
      });
    }
  }, [cityValid, allValid]);

  // Slot 5: E2 from RIGHT when projectType is valid
  useEffect(() => {
    const e2 = slotE2Ref.current;
    if (!e2 || prefersReducedMotion()) return;

    if (typeValid || allValid) {
      gsap.to(e2, {
        clipPath: "inset(0 0 0 0%)",
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power4.out",
      });
    } else {
      gsap.to(e2, {
        clipPath: "inset(0 0 0 100%)",
        opacity: 0,
        x: 40,
        duration: 0.6,
        ease: "power3.in",
      });
    }
  }, [typeValid, allValid]);

  // Settle effect when project message is valid (all 5 valid)
  useEffect(() => {
    if (!projectValid && !allValid) return;
    if (prefersReducedMotion()) return;

    const slots = [
      slotD1Ref.current,
      slotK1Ref.current,
      slotM2Ref.current,
      slotB1Ref.current,
      slotE2Ref.current,
    ].filter(Boolean);

    gsap.fromTo(
      slots,
      { scale: 1.03 },
      {
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.05,
      }
    );
  }, [projectValid, allValid]);

  // Calculate progress
  const validCount = [nameValid, emailValid, cityValid, typeValid, projectValid].filter(
    Boolean
  ).length;
  const progressPercent = allValid ? 100 : validCount * 20;

  // Retrieve photo objects
  const d1 = img("D1");
  const k1 = img("K1");
  const m2 = img("M2");
  const b1 = img("B1");
  const e2 = img("E2");

  return (
    <div
      ref={containerRef}
      className="relative flex h-[36svh] w-full flex-col justify-between overflow-hidden lg:h-full lg:w-[55%]"
      style={{
        background:
          "linear-gradient(135deg, #2C382A 0%, #1E332D 45%, #253A30 100%)",
      }}
    >
      {/* Hairline Progress Bar across the top of left zone */}
      <div
        className="absolute inset-x-0 top-0 z-30 h-[2px] w-full bg-[rgba(232,222,206,0.15)]"
        aria-hidden="true"
      >
        <div
          ref={progressBarRef}
          data-progress-bar
          className="h-full bg-[#AD9680] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Drifting soft ambient blobs */}
      <div
        className="pointer-events-none absolute -left-[15vw] -top-[10vh] h-[50vw] w-[50vw] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #AD9680 0%, rgba(173,150,128,0) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-[10vh] -right-[10vw] h-[50vw] w-[50vw] rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #E8DECE 0%, rgba(232,222,206,0) 70%)",
        }}
      />

      {/* 12-col x 9-row Compositional Collage Grid */}
      <div className="absolute inset-0 h-full w-full p-4 pt-12 sm:p-6 sm:pt-14 lg:grid lg:grid-cols-12 lg:grid-rows-9 lg:gap-3 lg:p-8 lg:pt-24">
        {/* Slot 1: D1 (cols 1-6, rows 1-5) */}
        <div
          ref={slotD1Ref}
          data-slot="d1"
          className="collage-drift-a relative hidden overflow-hidden rounded-sm border border-[rgba(232,222,206,0.15)] bg-[#AD9680] shadow-lg lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-5 lg:block"
        >
          {d1 && (
            <img
              src={d1.src}
              alt={d1.alt}
              loading="eager"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Slot 2: K1 (cols 6-12, rows 1-4) */}
        <div
          ref={slotK1Ref}
          data-slot="k1"
          style={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
          className="collage-drift-b relative hidden overflow-hidden rounded-sm border border-[rgba(232,222,206,0.15)] bg-[#AD9680] shadow-lg lg:col-start-6 lg:col-end-13 lg:row-start-1 lg:row-end-5 lg:block"
        >
          {k1 && (
            <img
              src={k1.src}
              alt={k1.alt}
              loading="eager"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Slot 3: M2 (cols 1-5, rows 6-9) */}
        <div
          ref={slotM2Ref}
          data-slot="m2"
          style={{ clipPath: "inset(100% 0 0 100%)", opacity: 0 }}
          className="collage-drift-b relative hidden overflow-hidden rounded-sm border border-[rgba(232,222,206,0.15)] bg-[#AD9680] shadow-lg lg:col-start-1 lg:col-end-6 lg:row-start-5 lg:row-end-10 lg:block"
        >
          {m2 && (
            <img
              src={m2.src}
              alt={m2.alt}
              loading="eager"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Slot 4: B1 (cols 5-9, rows 5-9) */}
        <div
          ref={slotB1Ref}
          data-slot="b1"
          style={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
          className="collage-drift-a relative hidden overflow-hidden rounded-sm border border-[rgba(232,222,206,0.15)] bg-[#AD9680] shadow-lg lg:col-start-5 lg:col-end-10 lg:row-start-5 lg:row-end-10 lg:block"
        >
          {b1 && (
            <img
              src={b1.src}
              alt={b1.alt}
              loading="eager"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Slot 5: E2 (cols 9-12, rows 5-9) */}
        <div
          ref={slotE2Ref}
          data-slot="e2"
          style={{ clipPath: "inset(0 0 0 100%)", opacity: 0 }}
          className="collage-drift-b relative hidden overflow-hidden rounded-sm border border-[rgba(232,222,206,0.15)] bg-[#AD9680] shadow-lg lg:col-start-9 lg:col-end-13 lg:row-start-5 lg:row-end-10 lg:block"
        >
          {e2 && (
            <img
              src={e2.src}
              alt={e2.alt}
              loading="eager"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Mobile strip preview (top 3 slots visible on mobile) */}
        <div className="flex h-full w-full gap-2 lg:hidden">
          <div className="relative h-full w-1/3 overflow-hidden rounded-sm bg-[#AD9680]">
            {d1 && <img src={d1.src} alt={d1.alt} className="h-full w-full object-cover" />}
          </div>
          <div
            className={`relative h-full w-1/3 overflow-hidden rounded-sm bg-[#AD9680] transition-opacity duration-700 ${
              nameValid || allValid ? "opacity-100" : "opacity-35"
            }`}
          >
            {k1 && <img src={k1.src} alt={k1.alt} className="h-full w-full object-cover" />}
          </div>
          <div
            className={`relative h-full w-1/3 overflow-hidden rounded-sm bg-[#AD9680] transition-opacity duration-700 ${
              emailValid || allValid ? "opacity-100" : "opacity-35"
            }`}
          >
            {m2 && <img src={m2.src} alt={m2.alt} className="h-full w-full object-cover" />}
          </div>
        </div>
      </div>

      {/* Bottom Scrim: protects headline & line from any background clutter */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-64 sm:h-72"
        style={{
          background:
            "linear-gradient(to top, rgba(27, 33, 26, 0.95) 0%, rgba(27, 33, 26, 0.70) 50%, transparent 100%)",
        }}
      />

      {/* Bottom-left Title and Lead */}
      <div className="relative z-20 mt-auto p-6 sm:p-8 lg:p-12 lg:pb-14">
        <h1
          ref={titleRef}
          className="font-serif leading-[1.02] tracking-[-0.03em] text-[#E8DECE]"
          style={{
            fontSize: "clamp(2.2rem, 4.6vw, 5rem)",
            maxWidth: "90%",
            textWrap: "balance",
          }}
        >
          Tell us what matters.
        </h1>
        <p
          ref={leadRef}
          className="mt-3.5 max-w-lg font-sans leading-relaxed text-[#E8DECE]/85"
          style={{
            fontSize: "clamp(1rem, 1.2vw, 1.25rem)",
            textWrap: "balance",
          }}
        >
          Tell us about your home, what you want to change and what you want to
          protect.
        </p>
      </div>
    </div>
  );
}

