import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRAND } from "@/content/copy";
import { MeresMark } from "@/components/MeresMark";
import { VeilLink, useVeilNavigate } from "@/components/VeilLink";
import { magnetic } from "@/motion/helpers";
import { lenis } from "@/motion/smooth";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previousScroll = useRef(0);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const navigate = useVeilNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const onScroll = () => {
        const current = window.scrollY;
        setHidden(current > previousScroll.current && current > 96);
        previousScroll.current = current;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const triggers: ScrollTrigger[] = [];

    const syncTheme = () => {
      if (cancelled) return;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"));
      const active = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 64 && rect.bottom > 64;
      });
      setTheme(active?.dataset.theme === "dark" ? "dark" : "light");
    };

    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-theme]"));
      syncTheme();

      sections.forEach((section) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "top 64px",
            end: "bottom 64px",
            onEnter: syncTheme,
            onEnterBack: syncTheme,
            onLeave: syncTheme,
            onLeaveBack: syncTheme,
          }),
        );
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  useEffect(() => {
    if (!ctaRef.current) return;
    return magnetic(ctaRef.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (event.key === "Tab") {
        const dialog = document.querySelector<HTMLElement>("[data-menu-dialog]");
        const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>("a, button")) : [];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLElement>("[data-menu-dialog] a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const openContact = () => {
    closeMenu();
    void navigate(BRAND.cta.href);
  };

  const isDark = theme === "dark";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 px-5 py-5 transition-transform duration-500 md:px-10 ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}>
        <div className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 backdrop-blur-md md:px-6 ${isDark ? "border-linen/25 bg-forest/85 text-linen" : "border-taupe/30 bg-linen/85 text-ink"}`}>
          <VeilLink to="/" aria-label="MERES home" data-cursor="link" className={isDark ? "text-linen" : "text-ink"}>
            <MeresMark className="h-9 w-11" />
          </VeilLink>
          <div className="flex items-center gap-3">
            <button ref={buttonRef} type="button" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((value) => !value)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] ${isDark ? "border-linen/30 text-linen hover:bg-linen hover:text-forest" : "border-ink/30 text-ink hover:bg-ink hover:text-linen"}`}>
              {open ? <X size={15} /> : <Menu size={15} />}
              <span>Menu</span>
            </button>
            <VeilLink ref={ctaRef} to={BRAND.cta.href} data-cursor="link" className={`hidden items-center gap-1 rounded-full px-4 py-2 text-xs uppercase tracking-[0.12em] md:inline-flex ${isDark ? "bg-linen text-forest" : "bg-forest text-linen"}`}>
              {BRAND.cta.label}<ArrowUpRight size={14} />
            </VeilLink>
          </div>
        </div>
      </header>
      {open && <MenuDialog onClose={closeMenu} onContact={openContact} />}
    </>
  );
}

function MenuDialog({ onClose, onContact }: { onClose: () => void; onContact: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const links = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (panel.current) gsap.fromTo(panel.current, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" });
      if (links.current) gsap.fromTo(links.current.children, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, delay: 0.65, ease: "power3.out" });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (panel.current) gsap.fromTo(panel.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power3.out" });
    });
    return () => mm.revert();
  }, []);
  return (
    <div id="site-menu" data-menu-dialog role="dialog" aria-modal="true" aria-label="Site menu" className="fixed inset-0 z-30 grid bg-forest text-linen md:grid-cols-2">
      <div ref={panel} className="flex flex-col justify-end px-7 pb-12 pt-32 md:px-16 md:pb-16">
        <p className="mb-8 text-xs uppercase tracking-[0.22em] text-taupe">MERES · Seattle's Eastside</p>
        <nav ref={links} className="flex flex-col items-start gap-4" aria-label="Main navigation">
          {BRAND.nav.map((item) => <VeilLink key={item.href} to={item.href} onClick={onClose} data-cursor="link" className="font-serif text-4xl transition-opacity hover:text-taupe md:text-6xl">{item.label}</VeilLink>)}
          <button type="button" onClick={onContact} data-cursor="link" className="font-serif text-4xl transition-opacity hover:text-taupe md:text-6xl">Contact</button>
        </nav>
        <div className="mt-12 flex items-end justify-between gap-6 border-t border-linen/20 pt-5 text-sm text-linen/70">
          <span>{BRAND.philosophy}</span>
          <button type="button" onClick={onClose} className="text-xs uppercase tracking-[0.16em] text-taupe">Close</button>
        </div>
      </div>
      <div className="hidden bg-linen-deep md:block" aria-hidden="true" />
    </div>
  );
}

export function Footer() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => ctaRef.current ? magnetic(ctaRef.current) : undefined, []);
  return (
    <footer className="bg-forest px-6 py-16 text-linen md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <MeresMark className="h-16 w-20 text-linen" />
        <p className="mt-10 max-w-2xl font-serif text-4xl leading-tight md:text-6xl">{BRAND.philosophy}</p>
        <div className="mt-14 flex flex-col gap-8 border-t border-linen/20 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <span className="text-linen/65">{BRAND.place}</span>
          <VeilLink ref={ctaRef} to={BRAND.cta.href} data-cursor="link" className="inline-flex w-fit rounded-full bg-linen px-5 py-3 text-forest">{BRAND.cta.label}<ArrowUpRight className="ml-2" size={16} /></VeilLink>
        </div>
      </div>
    </footer>
  );
}
