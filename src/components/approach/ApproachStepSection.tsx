import type { ApproachStepItem } from "@/data/approachShowcase";

type ApproachStepSectionProps = {
  step: ApproachStepItem;
};

export function ApproachStepSection({ step }: ApproachStepSectionProps) {
  const isGreen = step.theme === "green";

  return (
    <section
      id={step.id}
      data-theme={isGreen ? "dark" : "light"}
      className="relative w-full overflow-hidden"
      style={{ scrollMarginTop: "96px" }}
    >
      {/* Full-bleed square/75svh step visual */}
      <div className="relative h-[75svh] min-h-[24rem] w-full overflow-hidden bg-forest">
        <img
          src={step.image.src}
          alt={step.image.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="concept-chip pointer-events-none absolute bottom-5 right-5 z-20">
          {step.image.label}
        </span>
      </div>

      {/* Alternating theme content panel */}
      <div
        className="w-full"
        style={{
          background: isGreen ? "var(--green)" : "var(--linen)",
          color: isGreen ? "var(--linen)" : "var(--ink)",
          padding: "clamp(1.5rem, 5vw, 3rem)",
        }}
      >
        <div className="mx-auto max-w-[68rem] py-4 md:py-8">
          <p
            className="font-sans uppercase tracking-[0.18em] opacity-75"
            style={{ fontSize: "1.1667rem", lineHeight: 1.2 }}
          >
            Step {step.stepNumber}
          </p>

          <h2
            className="mt-4 font-serif"
            style={{
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              lineHeight: 1.08,
            }}
          >
            {step.title}
          </h2>

          <div
            className="mt-8 flex max-w-[44rem] flex-col"
            style={{ gap: "2rem" }}
          >
            {step.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="font-sans opacity-90"
                style={{
                  fontSize: "clamp(1.1667rem, 1.35vw, 1.35rem)",
                  lineHeight: 1.6,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
