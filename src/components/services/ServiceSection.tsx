import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServicesPhoto } from "./ServicesPhoto";
import { splitText, type Split } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/tokens";

gsap.registerPlugin(ScrollTrigger);

export interface ServiceSectionProps {
  id: string; // "kitchens" | "bathrooms" | "whole-home" | "additions-custom-homes"
  zIndex: number;
  title: string;
  label: string;
  paragraph: string;
  rows: string[];
  imageId: string;
  insetId?: string;
  isConcept?: boolean;
  theme?: "light" | "dark"; // "light" = cream column, "dark" = forest column
  mirrored?: boolean; // true for whole-home: image on right, column on left
  floorPlanSvg?: boolean; // true for additions
  stepNumber: string; // "01", "02", "03", "04"
}

/**
 * ServiceSection: reusable component for V10-V13.
 * Height 240svh with sticky inner panel of 100svh.
 * Overflow hidden ONLY on inner panel, with opaque background for hard edge.
 * Minimum 96px top padding so floating header never obscures text or badges.
 *
 * State 1 (wrapper top 60%, once): image wipes up, title characters rise, tiny label + SERVICE 0X / 04 fade in.
 * State 2 (wrapper top+=35% top, toggleActions: play none none reverse):
 *   image shrinks to 62%, title shrinks to 45%, column (38% width, padding 96px 4vw 6vh) slides in:
 *   paragraph rises by lines, 4 hairline rows rise (stagger 0.1s), hairline draws left-to-right (0.8s).
 */
export function ServiceSection({
  id,
  zIndex,
  title,
  label,
  paragraph,
  rows,
  imageId,
  insetId,
  isConcept = false,
  theme = "light",
  mirrored = false,
  floorPlanSvg = false,
  stepNumber,
}: ServiceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageFigureRef = useRef<HTMLElement>(null);
  const innerImgRef = useRef<HTMLDivElement>(null);
  const titleBoxRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const metaBadgeRef = useRef<HTMLDivElement>(null);
  const columnAsideRef = useRef<HTMLElement>(null);
  const paraTextRef = useRef<HTMLParagraphElement>(null);
  const rowsBoxRef = useRef<HTMLDivElement>(null);
  const planSvgPathRef = useRef<SVGPathElement>(null);

  const [, setImagesLoaded] = useState(false);

  // Monitor image decoding/loading for accurate ScrollTrigger measurement
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>("img"));
    if (imgs.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loaded = 0;
    const checkAll = () => {
      loaded++;
      if (loaded >= imgs.length) {
        setImagesLoaded(true);
        ScrollTrigger.refresh();
      }
    };

    imgs.forEach((img) => {
      if (img.complete) {
        checkAll();
      } else {
        img.addEventListener("load", checkAll, { once: true });
        img.addEventListener("error", checkAll, { once: true });
      }
    });

    void document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const figure = imageFigureRef.current;
    const innerImg = innerImgRef.current;
    const titleBox = titleBoxRef.current;
    const titleText = titleTextRef.current;
    const metaBadge = metaBadgeRef.current;
    const column = columnAsideRef.current;
    const paraText = paraTextRef.current;
    const rowsBox = rowsBoxRef.current;
    const planPath = planSvgPathRef.current;

    if (
      !section ||
      !sticky ||
      !figure ||
      !innerImg ||
      !titleBox ||
      !titleText ||
      !metaBadge ||
      !column ||
      !paraText ||
      !rowsBox
    )
      return;

    if (prefersReducedMotion()) return;

    let failsafeId: number | undefined;
    let titleSplit: Split | null = null;
    let paraSplit: Split | null = null;

    const rowItems = Array.from(
      rowsBox.querySelectorAll<HTMLElement>("[data-service-row]")
    );
    const hairlines = Array.from(
      rowsBox.querySelectorAll<HTMLElement>("[data-service-hairline]")
    );

    const mm = gsap.matchMedia();

    // DESKTOP: >= 768px
    mm.add("(min-width: 768px)", () => {
      titleSplit = splitText(titleText, { chars: true });
      paraSplit = splitText(paraText, { lines: true });

      // Clip directions: mirrored wipes from top, normal wipes from bottom
      const initialClip = mirrored ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)";
      const columnOffX = mirrored ? -105 : 105;

      // 1. Initial State before State 1
      gsap.set(figure, {
        width: "100%",
        clipPath: initialClip,
      });
      gsap.set(innerImg, { scale: 1.15 });
      gsap.set(titleSplit.chars, { yPercent: 110, opacity: 0 });
      gsap.set(metaBadge, { opacity: 0, y: 15 });
      gsap.set(column, { xPercent: columnOffX });
      gsap.set(paraSplit.lines, { yPercent: 110, opacity: 0 });
      gsap.set(rowItems, { y: 25, opacity: 0 });
      gsap.set(hairlines, { scaleX: 0, transformOrigin: "left" });
      if (planPath) gsap.set(planPath, { strokeDashoffset: 350 });

      // STATE 1: Plays when section top reaches 60% of viewport
      const state1Tl = gsap.timeline({ paused: true });

      // Image wipes into place
      state1Tl.to(
        figure,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.1,
          ease: "power4.out",
        },
        0
      );

      // Inner image scale 1.15 to 1
      state1Tl.to(
        innerImg,
        {
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
        },
        0
      );

      // Title rises by characters
      state1Tl.to(
        titleSplit.chars,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.018,
        },
        0.2
      );

      // Tiny label + step badge fade in below header
      state1Tl.to(
        metaBadge,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        0.45
      );

      const st1 = ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        once: true,
        onEnter: () => state1Tl.play(),
      });

      // STATE 2: Plays when section wrapper reaches top+=35% top
      const state2Tl = gsap.timeline({ paused: true });

      // Image shrinks to 62% width
      state2Tl.to(
        figure,
        {
          width: "62%",
          duration: 0.9,
          ease: "power4.inOut",
        },
        0
      );

      // Title shrinks to 45% size over image's lower-left
      state2Tl.to(
        titleBox,
        {
          scale: 0.45,
          transformOrigin: mirrored ? "right bottom" : "left bottom",
          duration: 0.9,
          ease: "power4.inOut",
        },
        0
      );

      // Column slides in (translateX: 100% to 0, or -100% to 0 for mirrored)
      state2Tl.to(
        column,
        {
          xPercent: 0,
          duration: 0.9,
          ease: "power4.inOut",
        },
        0
      );

      // Paragraph rises by lines
      state2Tl.to(
        paraSplit.lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
        },
        0.35
      );

      // Floor-plan SVG drawing if applicable
      if (planPath) {
        state2Tl.to(
          planPath,
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.out",
          },
          0.3
        );
      }

      // 4 rows rise one by one (stagger 0.1s)
      state2Tl.to(
        rowItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.45
      );

      // Hairlines draw left to right (0.8s)
      state2Tl.to(
        hairlines,
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        },
        0.4
      );

      const st2 = ScrollTrigger.create({
        trigger: section,
        start: "top+=35% top",
        toggleActions: "play none none reverse",
        onEnter: () => state2Tl.play(),
        onLeaveBack: () => state2Tl.reverse(),
      });

      // 3s Failsafe: forces visible if triggers fail
      failsafeId = window.setTimeout(() => {
        gsap.set(figure, { clipPath: "inset(0% 0 0 0)" });
        if (titleSplit) gsap.set(titleSplit.chars, { yPercent: 0, opacity: 1 });
        gsap.set(metaBadge, { opacity: 1, y: 0 });
        if (planPath) gsap.set(planPath, { strokeDashoffset: 0 });
      }, 3000);

      return () => {
        st1.kill();
        st2.kill();
        state1Tl.kill();
        state2Tl.kill();
      };
    });

    // MOBILE: < 768px (stacked layout, simple entrance wipe, no State 2)
    mm.add("(max-width: 767px)", () => {
      titleSplit = splitText(titleText, { chars: true });
      paraSplit = splitText(paraText, { lines: true });

      gsap.set(figure, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(titleSplit.chars, { yPercent: 110, opacity: 0 });
      gsap.set(column, { xPercent: 0 });
      gsap.set(hairlines, { scaleX: 1 });
      gsap.set(metaBadge, { opacity: 1, y: 0 });

      const mobileTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      mobileTl.to(
        figure,
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.0,
          ease: "power4.out",
        },
        0
      );

      mobileTl.to(
        titleSplit.chars,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.02,
          ease: "power3.out",
        },
        0.2
      );

      failsafeId = window.setTimeout(() => {
        gsap.set(figure, { clipPath: "inset(0% 0 0 0)" });
        if (titleSplit) gsap.set(titleSplit.chars, { yPercent: 0, opacity: 1 });
      }, 3000);

      return () => {
        mobileTl.kill();
      };
    });

    return () => {
      if (failsafeId) window.clearTimeout(failsafeId);
      mm.revert();
      titleSplit?.revert();
      paraSplit?.revert();
    };
  }, [mirrored]);

  const isLightColumn = theme === "light";
  // Inner panel background color: opaque for hard edge
  const panelBg = isLightColumn ? "#E8DECE" : "#2C382A";

  return (
    <section
      ref={sectionRef}
      id={id}
      className="service relative w-full"
      style={{
        height: "240svh",
        zIndex,
      }}
    >
      {/* Sticky Inner Panel: 100svh, overflow hidden, opaque background for hard edge */}
      <div
        ref={stickyRef}
        className="service-sticky sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{
          backgroundColor: panelBg,
        }}
      >
        {/* Figure: Service Image (Full-bleed in State 1, 62% in State 2) */}
        <figure
          ref={imageFigureRef}
          className={`service-image absolute inset-y-0 z-10 overflow-hidden bg-[#2C382A] ${
            mirrored ? "right-0" : "left-0"
          }`}
          style={{
            width: "62%", // Default CSS fallback
          }}
        >
          {/* Inner image container */}
          <div ref={innerImgRef} className="h-full w-full">
            <ServicesPhoto
              id={imageId}
              className="h-full w-full"
              imgClassName="object-cover object-center"
              showConceptChip={isConcept}
            />
          </div>

          {/* Bottom-left ink scrim for title legibility */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to top right, rgba(27, 33, 26, 0.90) 0%, rgba(27, 33, 26, 0.45) 45%, transparent 75%)",
            }}
          />

          {/* Tiny label and SERVICE 0X / 04: Below header (top padding 96px) */}
          <div
            ref={metaBadgeRef}
            className={`absolute top-24 z-20 flex flex-col gap-1.5 sm:top-28 md:top-32 ${
              mirrored
                ? "right-6 sm:right-10 md:right-14 text-right"
                : "left-6 sm:left-10 md:left-14 text-left"
            }`}
          >
            <span className="font-sans text-[0.72rem] font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
              SERVICE {stepNumber} / 04
            </span>
            <span className="font-sans text-[0.72rem] font-medium tracking-[0.22em] text-[#E8DECE]/90 uppercase">
              {label}
            </span>
          </div>

          {/* Service Title (pinned to lower-left of the image frame) */}
          <div
            ref={titleBoxRef}
            className={`service-title absolute bottom-8 z-20 max-w-[85vw] sm:bottom-12 md:bottom-16 ${
              mirrored
                ? "right-6 sm:right-10 md:right-14 text-right"
                : "left-6 sm:left-10 md:left-14 text-left"
            }`}
          >
            <h2
              ref={titleTextRef}
              className="font-serif text-[clamp(3.2rem,8.5vw,9.5rem)] leading-[0.92] tracking-[-0.03em] text-[#E8DECE]"
              style={{ textWrap: "balance" }}
            >
              {title}
            </h2>
          </div>
        </figure>

        {/* Aside: Service Column (38% width on desktop, padding 96px 4vw 6vh) */}
        <aside
          ref={columnAsideRef}
          className={`service-column absolute inset-y-0 z-20 flex flex-col justify-between overflow-x-hidden overflow-y-auto ${
            mirrored ? "left-0" : "right-0"
          }`}
          style={{
            width: "38%",
            backgroundColor: isLightColumn ? "#E8DECE" : "#2C382A",
            color: isLightColumn ? "#2C382A" : "#E8DECE",
            padding: "96px 4vw 6vh 4vw",
            boxShadow: mirrored
              ? "15px 0 40px rgba(0,0,0,0.18)"
              : "-15px 0 40px rgba(0,0,0,0.18)",
          }}
        >
          {/* Column Top: Inset Photo or SVG drawing, then Paragraph */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <span className="font-sans text-[0.72rem] font-semibold tracking-[0.25em] text-[#AD9680] uppercase">
                DISCIPLINE & SCOPE
              </span>

              {/* Inset Photo (e.g. K4 in Kitchens, portrait 12vw) */}
              {insetId && (
                <div className="aspect-[3/4] w-24 overflow-hidden rounded-sm border border-current/25 shadow-md sm:w-28 lg:w-[12vw] lg:max-w-[160px]">
                  <ServicesPhoto
                    id={insetId}
                    className="h-full w-full"
                    imgClassName="object-cover"
                    showConceptChip={false}
                  />
                </div>
              )}

              {/* Floor-plan hairline drawing for Additions */}
              {floorPlanSvg && (
                <div className="h-12 w-28 shrink-0">
                  <svg
                    viewBox="0 0 110 44"
                    fill="none"
                    className="h-full w-full stroke-current"
                  >
                    {/* Existing rectangle (dashed hairline) */}
                    <rect
                      x="2"
                      y="4"
                      width="52"
                      height="36"
                      strokeWidth="1.2"
                      strokeOpacity="0.4"
                      strokeDasharray="3 3"
                    />
                    {/* Addition extending from it (animated hairline) */}
                    <path
                      ref={planSvgPathRef}
                      d="M 54 10 H 104 V 40 H 54"
                      strokeWidth="1.6"
                      strokeDasharray="350"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Paragraph: never clipped */}
            <p
              ref={paraTextRef}
              className="mt-6 font-sans text-[clamp(1.05rem,1.3vw,1.35rem)] leading-relaxed opacity-90"
              style={{ textWrap: "balance" }}
            >
              {paragraph}
            </p>
          </div>

          {/* Column Bottom: Four hairline-separated rows */}
          <div ref={rowsBoxRef} className="mt-8 border-b border-current/25">
            {rows.map((rowText, idx) => (
              <div key={idx} className="relative">
                {/* Hairline that draws left to right */}
                <div
                  data-service-hairline
                  className="h-[1px] w-full bg-current opacity-25"
                />
                <div
                  data-service-row
                  className="flex items-center justify-between py-3 sm:py-3.5 font-serif text-[clamp(1.25rem,1.8vw,1.9rem)] leading-snug"
                >
                  <span className="pr-4">{rowText}</span>
                  <span className="font-sans text-[0.72rem] tracking-widest text-[#AD9680]">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
