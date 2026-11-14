/** The supplied MERES bull/R mark (public/brand/meres-mark.svg, extracted from the supplied LOGO.ai). Colour = currentColor.
 *  Never redraw it, never retype the name as a logo. Size with width (e.g. className="w-12"). */
export function MeresMark({ className = "w-12", title = "MERES" }: { className?: string; title?: string }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const markUrl = `${base}/brand/meres-mark.svg`;
  return (
    <span
      role="img"
      aria-label={title}
      className={`inline-block bg-current ${className}`}
      style={{
        aspectRatio: "3900 / 3120",
        WebkitMask: `url(${markUrl}) center / contain no-repeat`,
        mask: `url(${markUrl}) center / contain no-repeat`,
      }}
    />
  );
}
