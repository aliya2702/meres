import { ArrowUpRight } from "lucide-react";
import { MeresMark } from "@/components/MeresMark";
import { VeilLink } from "@/components/VeilLink";
import { BRAND } from "@/content/copy";
import { servicesShowcase, type ServiceShowcaseItem } from "@/data/servicesShowcase";

type ServicesShowcaseProps = {
  variant: "home" | "page";
};

function ServiceLayer({ item }: { item: ServiceShowcaseItem }) {
  return (
    <div
      data-theme="dark"
      className="relative flex min-h-[78svh] w-full flex-col justify-end bg-forest text-linen"
    >
      {/* Full-bleed media or green-to-taupe tonal fallback */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-clip">
        {item.image ? (
          <img
            src={item.image.src}
            alt={item.image.alt}
            width={1672}
            height={941}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
            style={
              item.image.focal
                ? { objectPosition: `${item.image.focal.xPct}% ${item.image.focal.yPct}%` }
                : undefined
            }
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(155deg, var(--green) 0%, #3E4739 54%, rgba(173, 150, 128, 0.42) 100%)",
            }}
          >
            <span aria-hidden="true" className="opacity-10">
              <MeresMark className="w-[min(32rem,64vw)] text-linen" title="" />
            </span>
          </div>
        )}
      </div>

      {/* Bottom dark scrim over lower 55% ensuring >= 4.5:1 text contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%]"
        style={{
          background:
            "linear-gradient(to top, rgba(35, 45, 34, 0.78) 0%, rgba(35, 45, 34, 0.7) 35%, transparent 100%)",
        }}
      />

      {/* Bottom-left display title and caption sentence */}
      <div className="relative z-20 px-5 pb-20 pt-28 md:px-10 md:pb-16">
        <h2 className="font-serif text-[clamp(4rem,12vw,13rem)] leading-[0.95] text-linen break-words">
          {item.title}
        </h2>
        <p className="mt-4 max-w-[44rem] font-sans text-[1.1667rem] uppercase tracking-[0.06em] leading-[1.45] text-linen/95">
          {item.caption}
        </p>
      </div>

      {/* Concept visualization caption on image layers only */}
      {item.image && (
        <span className="concept-chip pointer-events-none absolute bottom-4 right-5 z-20 md:bottom-6 md:right-10">
          {BRAND.imageLabel}
        </span>
      )}
    </div>
  );
}

function ServicePanel({
  item,
  variant,
}: {
  item: ServiceShowcaseItem;
  variant: "home" | "page";
}) {
  const isGreen = item.theme === "green";

  return (
    <div
      data-theme={isGreen ? "dark" : "light"}
      style={{ padding: "clamp(1.5rem, 5vw, 4rem)" }}
      className={`w-full ${isGreen ? "bg-forest text-linen" : "bg-linen text-ink"}`}
    >
      <div className="mx-auto w-full max-w-5xl">
        <p
          className={`max-w-[46rem] font-sans text-[1.1667rem] leading-[1.6] ${
            isGreen ? "text-linen/90" : "text-ink/90"
          }`}
        >
          {item.paragraph}
        </p>

        <ul className="mt-8 divide-y divide-taupe/40 border-y border-taupe/40">
          {item.lines.map((line, idx) => (
            <li
              key={idx}
              className="py-5 font-serif text-[clamp(1.35rem,1.9vw,2rem)] leading-[1.35]"
            >
              {line}
            </li>
          ))}
        </ul>

        {item.closing && (
          <p
            className={`mt-8 max-w-[46rem] font-sans text-[1.1667rem] leading-[1.6] ${
              isGreen ? "text-linen/90" : "text-ink/85"
            }`}
          >
            {item.closing}
          </p>
        )}

        <div className="mt-9">
          {variant === "home" ? (
            <VeilLink
              to={`/services#${item.id}`}
              data-cursor="link"
              className={`inline-flex items-center gap-2 font-sans text-[1.1667rem] font-medium transition-colors ${
                isGreen
                  ? "text-taupe hover:text-linen focus-visible:outline-linen"
                  : "text-forest hover:text-ink focus-visible:outline-forest"
              }`}
            >
              <span>{`Explore ${item.title.toLowerCase()}`}</span>
              <ArrowUpRight size={18} />
            </VeilLink>
          ) : (
            <div>
              <VeilLink
                to={BRAND.cta.href}
                aria-label={BRAND.cta.ariaLabel}
                data-cursor="link"
                className={`inline-flex items-center rounded-full px-6 py-3.5 font-sans text-[1.1667rem] font-medium transition-colors ${
                  isGreen
                    ? "bg-linen text-forest hover:bg-taupe hover:text-ink focus-visible:outline-linen"
                    : "bg-forest text-linen hover:bg-ink focus-visible:outline-forest"
                }`}
              >
                {BRAND.cta.label}
                <ArrowUpRight className="ml-2" size={18} />
              </VeilLink>
              <p
                className={`mt-3 font-sans text-[1.1667rem] leading-[1.5] ${
                  isGreen ? "text-linen/80" : "text-ink/75"
                }`}
              >
                {BRAND.cta.micro}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ServicesShowcase({ variant }: ServicesShowcaseProps) {
  return (
    <div>
      {servicesShowcase.map((item) => (
        <section
          key={item.id}
          id={item.id}
          data-theme={item.theme === "green" ? "dark" : "light"}
          className="relative scroll-mt-[96px]"
        >
          <ServiceLayer item={item} />
          <ServicePanel item={item} variant={variant} />
        </section>
      ))}
    </div>
  );
}
