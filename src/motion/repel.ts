import gsap from "gsap";

/** Characters push away from the cursor and settle back. Desktop pointer-fine only. Returns cleanup. */
export function repelChars(container: HTMLElement, chars: HTMLElement[], radius = 170, strength = 26): () => void {
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (!fine) return () => {};
  const onMove = (e: PointerEvent) => {
    chars.forEach((c) => {
      const r = c.getBoundingClientRect();
      const x0 = Number(gsap.getProperty(c, "x")) || 0;
      const y0 = Number(gsap.getProperty(c, "y")) || 0;
      const cx = r.left - x0 + r.width / 2;
      const cy = r.top - y0 + r.height / 2;
      const dx = cx - e.clientX;
      const dy = cy - e.clientY;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const f = (1 - dist / radius) ** 2 * strength;
        gsap.to(c, { x: (dx / (dist || 1)) * f, y: (dy / (dist || 1)) * f, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      } else if (x0 || y0) gsap.to(c, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
    });
  };
  const onLeave = () => gsap.to(chars, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
  container.addEventListener("pointermove", onMove);
  container.addEventListener("pointerleave", onLeave);
  return () => { container.removeEventListener("pointermove", onMove); container.removeEventListener("pointerleave", onLeave); };
}
