import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StackSection } from "../components/StackSection";
import { AboutCursor } from "../components/about/AboutCursor";
import { AboutHero } from "../components/about/AboutHero";
import { AboutSplitStory } from "../components/about/AboutSplitStory";
import { AboutHandoff } from "../components/about/AboutHandoff";
import { AboutGreenScene } from "../components/about/AboutGreenScene";
import { AboutSequence } from "../components/about/AboutSequence";
import { AboutFilmstrip } from "../components/about/AboutFilmstrip";
import { AboutClosing } from "../components/about/AboutClosing";
import "../components/about/about.css";

/**
 * MERES — About page (/about).
 * Image-led and animation-led sticky panel sequence (AB1–AB7).
 */
export function AboutPage() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});

    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") !== "1") return;

    const timer = window.setTimeout(() => {
      const imgs = Array.from(
        document.querySelectorAll<HTMLImageElement>(".about-page img")
      );
      const broken = imgs.filter((img) => img.complete && img.naturalWidth === 0);
      if (broken.length > 0) {
        console.warn("[about?debug=1] Broken images detected:", broken);
      }
      const panels = document.querySelectorAll(".about-page .panel");
      console.info(
        `[about?debug=1] Panels: ${panels.length}, Images: ${imgs.length}, Broken: ${broken.length}`
      );
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="about-page relative">
      <AboutCursor />
      <StackSection className="about-stack">
        <AboutHero />
        <AboutSplitStory />
        <AboutHandoff />
        <AboutGreenScene />
        <AboutSequence />
        <AboutFilmstrip />
        <AboutClosing />
      </StackSection>
    </div>
  );
}

export default AboutPage;
