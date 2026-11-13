import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StackSection } from "@/components/StackSection";
import { scrollToTarget } from "@/motion/smooth";

import { ServicesCursor } from "@/components/services/ServicesCursor";
import { ServicesV1Hero } from "@/components/services/ServicesV1Hero";
import { ServicesV2Gradient } from "@/components/services/ServicesV2Gradient";
import { ServicesV3DuskCard } from "@/components/services/ServicesV3DuskCard";
import { ServicesV4Macro } from "@/components/services/ServicesV4Macro";
import { ServicesV5CreamReveal } from "@/components/services/ServicesV5CreamReveal";
import { ServicesV6FramedGrow } from "@/components/services/ServicesV6FramedGrow";
import { ServicesV7Materials } from "@/components/services/ServicesV7Materials";
import { ServicesV8InteriorSplit } from "@/components/services/ServicesV8InteriorSplit";
import { ServicesV9Mosaic } from "@/components/services/ServicesV9Mosaic";
import { ServiceSection } from "@/components/services/ServiceSection";
import { ServicesClosingCTA } from "@/components/services/ServicesClosingCTA";

import "@/components/services/services.css";

const KITCHENS_ROWS = [
  "Cabinetry and storage",
  "Appliances and lighting",
  "Circulation and seating",
  "Stone, wood and hardware",
];

const BATHROOMS_ROWS = [
  "Layout and privacy",
  "Light and ventilation",
  "Waterproofing behind the finish",
  "Materials for daily use",
];

const WHOLE_HOME_ROWS = [
  "What deserves to stay",
  "How rooms connect",
  "Sightlines and floor levels",
  "Lighting and materials",
];

const ADDITIONS_ROWS = [
  "The site and the street",
  "Existing structure",
  "How new rooms connect",
  "The life it supports",
];

/**
 * MERES — Services Page (/services).
 * 1. Intro sequence (V1–V9) in sticky panels.
 * 2. Four distinct two-state service sections (Kitchens, Bathrooms, Whole-home, Additions).
 * 3. Final block: "Ready when you are." with magnetic CTA + link to /approach.
 * (Footer is rendered once globally by App.tsx, so no local Footer here).
 */
export function ServicesPage() {
  const location = useLocation();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    void document.fonts?.ready.then(refresh).catch(() => {});

    // Anchor scroll handler if landing directly with a hash
    if (location.hash) {
      const hash = location.hash;
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        scrollToTarget(hash, {
          offset: 0,
          duration: 1.0,
        });
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [location.hash]);

  // ?debug=1 inspection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") !== "1") return;

    const timer = window.setTimeout(() => {
      const imgs = Array.from(
        document.querySelectorAll<HTMLImageElement>(".services-page img")
      );
      const broken = imgs.filter(
        (img) => img.complete && img.naturalWidth === 0
      );
      if (broken.length > 0) {
        console.warn("[services?debug=1] Broken images detected:", broken);
      }
      const services = document.querySelectorAll(".services-page .service");
      console.info(
        `[services?debug=1] Services: ${services.length}, Images: ${imgs.length}, Broken: ${broken.length}`
      );
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="services-page relative w-full">
      {/* Floating custom "View" cursor */}
      <ServicesCursor />

      {/* Intro sticky panel stack (V1 - V9) */}
      <StackSection className="services-intro-stack">
        <ServicesV1Hero />
        <ServicesV2Gradient />
        <ServicesV3DuskCard />
        <ServicesV4Macro />
        <ServicesV5CreamReveal />
        <ServicesV6FramedGrow />
        <ServicesV7Materials />
        <ServicesV8InteriorSplit />
        <ServicesV9Mosaic />
      </StackSection>

      {/* Four Service Sections (V10 - V13) */}
      <ServiceSection
        id="kitchens"
        zIndex={10}
        stepNumber="01"
        title="Kitchens"
        label="THE FIRST CUP BEFORE ANYONE ELSE IS AWAKE"
        paragraph="Dinner taking shape while someone pulls up a stool. The drawer your hand finds without looking."
        rows={KITCHENS_ROWS}
        imageId="K2"
        insetId="K4"
        isConcept={true}
        theme="light"
        mirrored={false}
      />

      <ServiceSection
        id="bathrooms"
        zIndex={11}
        stepNumber="02"
        title="Bathrooms"
        label="A MOMENT TO YOURSELF"
        paragraph="Good light at the mirror. Storage within reach. Room to move without working around an open door."
        rows={BATHROOMS_ROWS}
        imageId="B1"
        theme="dark"
        mirrored={false}
      />

      <ServiceSection
        id="whole-home"
        zIndex={12}
        stepNumber="03"
        title="Whole-home renovations"
        label="THE HOUSE NO LONGER FITS"
        paragraph="You may love where you live while feeling that the house no longer fits."
        rows={WHOLE_HOME_ROWS}
        imageId="D3"
        theme="light"
        mirrored={true}
      />

      <ServiceSection
        id="additions-custom-homes"
        zIndex={13}
        stepNumber="04"
        title="Additions & custom homes"
        label="A RELATIONSHIP BETWEEN SPACES"
        paragraph="An addition begins with a relationship: between the home you have and the space you need."
        rows={ADDITIONS_ROWS}
        imageId="E1"
        theme="dark"
        mirrored={false}
        floorPlanSvg={true}
      />

      {/* Final Block: "Ready when you are." with magnetic CTA + link to /approach */}
      <ServicesClosingCTA zIndex={14} />
    </div>
  );
}

export default ServicesPage;
