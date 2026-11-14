import { useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PageVeil, veil } from "@/gl/PageVeil";
import { Cursor } from "@/components/Cursor";
import { Footer, Header } from "@/components/SiteShell";
import { initSmoothScroll, scrollToTarget } from "@/motion/smooth";
import { initMotionAttributes } from "@/motion/helpers";
import HomePageView from "@/pages/HomePage";
import ServicesPageView from "@/pages/ServicesPage";
import ApproachPageView from "@/pages/ApproachPage";
import AboutPageView from "@/pages/AboutPage";
import ContactPageView from "@/pages/ContactPage";

gsap.registerPlugin(ScrollTrigger);

function AppFrame() {
  const { pathname, hash } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstMount = useRef(true);

  useEffect(() => {
    const cleanup = initSmoothScroll();
    veil.hold();
    let cancelled = false;
    const reveal = async () => {
      await Promise.race([document.fonts.ready, new Promise<void>((resolve) => window.setTimeout(resolve, 2500))]);
      if (!cancelled) await veil.reveal([0.5, 0.5]);
    };
    void reveal();
    return () => { cancelled = true; cleanup(); };
  }, []);

  useLayoutEffect(() => {
    const main = mainRef.current;
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const target = trigger.trigger as Element | undefined;
        if (!target || !target.isConnected || (main && main.contains(target))) {
          trigger.kill();
        }
      });
    };
  }, [pathname]);

  useEffect(() => {
    const main = mainRef.current;
    const cleanupAttrs = main ? initMotionAttributes(main) : () => { };

    if (firstMount.current) {
      firstMount.current = false;
      if (hash) {
        const timer = window.setTimeout(() => {
          scrollToTarget(hash, { immediate: true });
          ScrollTrigger.refresh();
        }, 80);
        return () => { window.clearTimeout(timer); cleanupAttrs(); };
      }
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => { cancelAnimationFrame(raf); cleanupAttrs(); };
    }

    const raf = requestAnimationFrame(() => {
      if (hash) scrollToTarget(hash, { immediate: true });
      else scrollToTarget(0, { offset: 0, immediate: true });
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanupAttrs();
    };
  }, [pathname, hash]);

  return (
    <>
      <PageVeil color="#2C382A" rim="#AD9680" durationIn={0.8} durationOut={0.9} />
      <Cursor />
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePageView />} />
          <Route path="/services" element={<ServicesPageView />} />
          <Route path="/approach" element={<ApproachPageView />} />
          <Route path="/about" element={<AboutPageView />} />
          <Route path="/contact" element={<ContactPageView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const base = "/meres_v5";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p === "" || p === "/") {
        window.location.replace(`${base}/${window.location.search}${window.location.hash}`);
      }
    }
  }, []);

  return (
    <BrowserRouter basename={base}>
      <AppFrame />
    </BrowserRouter>
  );
}