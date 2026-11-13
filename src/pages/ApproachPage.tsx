import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StackSection } from "@/components/StackSection";
import { ApproachProgressLine } from "@/components/approach/ApproachProgressLine";
import { ApproachA1Intro } from "@/components/approach/ApproachA1Intro";
import { ApproachA2Step1 } from "@/components/approach/ApproachA2Step1";
import { ApproachA3Step2 } from "@/components/approach/ApproachA3Step2";
import { ApproachA4Step3 } from "@/components/approach/ApproachA4Step3";
import { ApproachA5Step4 } from "@/components/approach/ApproachA5Step4";
import { ApproachA6Step5 } from "@/components/approach/ApproachA6Step5";
import { ApproachA7Recap } from "@/components/approach/ApproachA7Recap";
import { ApproachA8Closing } from "@/components/approach/ApproachA8Closing";
import "@/components/approach/approach.css";

/**
 * MERES — Our approach page (/approach).
 * Amenities-style sequence of full-screen sticky scenes (A1–A8).
 */
export function ApproachPage() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    void document.fonts?.ready.then(refresh).catch(() => {});

    // ?debug=1 inspection
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") !== "1") return;

    const timer = window.setTimeout(() => {
      const imgs = Array.from(
        document.querySelectorAll<HTMLImageElement>(".approach-page img")
      );
      const broken = imgs.filter(
        (img) => img.complete && img.naturalWidth === 0
      );
      if (broken.length > 0) {
        console.warn("[approach?debug=1] Broken images detected:", broken);
      }
      const panels = document.querySelectorAll(".approach-page .panel");
      console.info(
        `[approach?debug=1] Panels: ${panels.length}, Images: ${imgs.length}, Broken: ${broken.length}`
      );
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="approach-page relative w-full overflow-hidden">
      {/* 1px taupe progress rail on left edge */}
      <ApproachProgressLine />

      {/* Main sticky panel stack */}
      <StackSection className="approach-stack">
        <ApproachA1Intro />
        <ApproachA2Step1 />
        <ApproachA3Step2 />
        <ApproachA4Step3 />
        <ApproachA5Step4 />
        <ApproachA6Step5 />
        <ApproachA7Recap />
        <ApproachA8Closing />
      </StackSection>
    </div>
  );
}

export default ApproachPage;
