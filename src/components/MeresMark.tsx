/** The supplied MERES bull/R mark (public/brand/meres-mark.svg, extracted from the supplied LOGO.ai). Colour = currentColor.
 *  Never redraw it, never retype the name as a logo. Size with width (e.g. className="w-12"). */
export function MeresMark({ className = "w-12", title = "MERES" }: { className?: string; title?: string }) {
  return (
    <span
      role="img"
      aria-label={title}
      className={`inline-block bg-current ${className}`}
      style={{
        aspectRatio: "3900 / 3120",
        WebkitMask: "url(/brand/meres-mark.svg) center / contain no-repeat",
        mask: "url(/brand/meres-mark.svg) center / contain no-repeat",
      }}
    />
  );
}
