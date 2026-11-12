import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { VeilLink } from "@/components/VeilLink";
import { approachClosing } from "@/data/approachShowcase";
import { magnetic } from "@/motion/helpers";

export function ApproachClosing() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const leadImage = approachClosing.images[0];

  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    return magnetic(cta);
  }, []);

  return (
    <section
      id="begin"
      data-theme="light"
      className="relative w-full bg-linen text-ink"
      style={{
        padding: "clamp(2rem, 5vw, 5rem)",
        scrollMarginTop: "96px",
      }}
    >
      <div className="mx-auto grid max-w-[84rem] items-center gap-10 py-6 md:grid-cols-12 md:gap-12 md:py-12">
        <div className="md:col-span-6">
          <h2
            className="font-serif text-ink"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              lineHeight: 1.04,
            }}
          >
            {approachClosing.title}
          </h2>

          <div
            className="mt-8 flex max-w-[38rem] flex-col"
            style={{ gap: "2rem" }}
          >
            {approachClosing.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="font-sans text-ink/90"
                style={{
                  fontSize: "clamp(1.1667rem, 1.35vw, 1.35rem)",
                  lineHeight: 1.6,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-9">
            <VeilLink
              ref={ctaRef}
              to={approachClosing.cta.href}
              aria-label={approachClosing.cta.ariaLabel}
              data-cursor="link"
              className="inline-flex items-center rounded-full bg-forest px-6 py-3.5 font-sans text-[1.1667rem] font-medium text-linen transition-colors hover:bg-taupe hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-4"
            >
              {approachClosing.cta.label}
              <ArrowUpRight className="ml-2" size={18} />
            </VeilLink>

            <p className="mt-3 font-sans text-[1.1667rem] leading-relaxed text-ink/80">
              {approachClosing.cta.micro}
            </p>
          </div>
        </div>

        <div className="md:col-span-6">
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-forest">
            <img
              src={leadImage.src}
              alt={leadImage.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="concept-chip pointer-events-none absolute bottom-5 right-5 z-20">
              {leadImage.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

