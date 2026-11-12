import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PageVeil, veil } from "@/gl/PageVeil";
import { Cursor } from "@/components/Cursor";
import { Footer, Header } from "@/components/SiteShell";
import { initSmoothScroll } from "@/motion/smooth";
import HomePageView from "@/pages/HomePage";
import ServicesPageView from "@/pages/ServicesPage";
import ApproachPageView from "@/pages/ApproachPage";
import AboutPageView from "@/pages/AboutPage";
import ContactPageView from "@/pages/ContactPage";

function AppFrame() {
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

  return (
    <>
      <PageVeil color="#2C382A" rim="#AD9680" durationIn={0.8} durationOut={0.9} />
      <Cursor />
      <Header />
      <main id="main" tabIndex={-1}>
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
  return <BrowserRouter><AppFrame /></BrowserRouter>;
}
