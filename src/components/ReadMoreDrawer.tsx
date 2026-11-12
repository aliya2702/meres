import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import { revealLines } from "@/motion/helpers";
import { EASE, prefersReducedMotion } from "@/motion/tokens";

type Props = {
  label?: string;
  heading?: string;
  children: React.ReactNode;
};

export function ReadMoreDrawer({ label = "Read more", heading, children }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    if (!panelRef.current) return;
    if (prefersReducedMotion()) {
      gsap.to(panelRef.current, { opacity: 0, duration: 0.25, ease: EASE.soft, onComplete: () => setOpen(false) });
      if (pageRef.current) gsap.to(pageRef.current, { opacity: 1, duration: 0.25, ease: EASE.soft });
      return;
    }
    gsap.to(panelRef.current, { clipPath: "inset(0 0 0 100%)", duration: 0.7, ease: EASE.wipe, onComplete: () => setOpen(false) });
    if (pageRef.current) gsap.to(pageRef.current, { opacity: 1, duration: 0.5, ease: EASE.soft });
  }, []);

  const openDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    pageRef.current = document.getElementById("main");
    let textCleanup: (() => void) | undefined;

    const rafId = requestAnimationFrame(() => {
      if (prefersReducedMotion()) {
        if (panelRef.current) {
          gsap.fromTo(panelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: EASE.soft });
        }
        if (pageRef.current) gsap.to(pageRef.current, { opacity: 0.4, duration: 0.25, ease: EASE.soft });
        return;
      }

      if (panelRef.current) {
        gsap.set(panelRef.current, { clipPath: "inset(0 0 0 100%)" });
        gsap.to(panelRef.current, { clipPath: "inset(0 0 0 0)", duration: 0.9, ease: EASE.wipe });
      }
      if (pageRef.current) gsap.to(pageRef.current, { opacity: 0.4, duration: 0.5, ease: EASE.soft });

      if (contentRef.current) {
        const firstP = contentRef.current.querySelector("p, h2, h3");
        if (firstP) {
          textCleanup = revealLines(firstP as HTMLElement);
        }
      }
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); triggerRef.current?.focus(); }
      if (e.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>("button, a, [tabindex]:not([tabindex='-1'])");
        if (!focusable || !focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    const closeBtn = panelRef.current?.querySelector<HTMLElement>("[data-drawer-close]");
    closeBtn?.focus();

    return () => {
      cancelAnimationFrame(rafId);
      textCleanup?.();
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (pageRef.current) gsap.set(pageRef.current, { opacity: 1, clearProps: "opacity" });
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDrawer}
        className="read-more-pill inline-flex items-center gap-1.5 rounded-full border border-current/30 px-5 py-2.5 text-[1.1667rem] uppercase tracking-[0.1em] hover:bg-current/10"
        aria-expanded={open}
      >
        {label}
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={heading || label}
          className="fixed inset-y-0 right-0 z-[60] w-full max-w-md"
        >
          <div
            ref={panelRef}
            className="h-full w-full overflow-y-auto bg-forest px-7 py-10 text-linen shadow-2xl md:px-12"
          >
            <div className="mb-8 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.22em] text-taupe">{heading || label}</p>
              <button
                type="button"
                data-drawer-close
                onClick={close}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-linen/70 hover:text-linen"
                aria-label="Close"
              >
                Close <X size={14} />
              </button>
            </div>
            <div ref={contentRef} className="space-y-5 text-base leading-relaxed text-linen/85">
              {children}
            </div>
          </div>
          <button
            type="button"
            aria-label="Close drawer"
            className="absolute inset-y-0 left-0 w-full max-w-[calc(100%-28rem)] cursor-default bg-transparent"
            style={{ maxWidth: "calc(100% - 28rem)" }}
            onClick={close}
            tabIndex={-1}
          />
        </div>
      )}
    </>
  );
}
