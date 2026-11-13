import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { VeilLink } from "@/components/VeilLink";
import { TileCollage, type TileCollageHandle } from "@/components/TileCollage";
import { StackSection, Panel } from "@/components/StackSection";
import { BRAND, home } from "@/content/copy";
import { revealLines, magnetic } from "@/motion/helpers";

import { HomeH2Reveal } from "@/components/home/HomeH2Reveal";
import { HomeH3Split } from "@/components/home/HomeH3Split";
import { HomeH4WordList } from "@/components/home/HomeH4WordList";
import { HomeH5MacroCard } from "@/components/home/HomeH5MacroCard";
import { HomeH6Slider } from "@/components/home/HomeH6Slider";
import { HomeH7SingleWord } from "@/components/home/HomeH7SingleWord";
import { HomeH8Rotating } from "@/components/home/HomeH8Rotating";
import { HomeH9MapLeaf } from "@/components/home/HomeH9MapLeaf";
import { HomeH10CreamMultiFrame } from "@/components/home/HomeH10CreamMultiFrame";
import { HomeH11CreamSplit } from "@/components/home/HomeH11CreamSplit";
import { HomeH12ThumbnailSwitcher } from "@/components/home/HomeH12ThumbnailSwitcher";
import { HomeH13CardFullBleed } from "@/components/home/HomeH13CardFullBleed";
import { HomeH14HorizontalGallery } from "@/components/home/HomeH14HorizontalGallery";
import { HomeH15Closing } from "@/components/home/HomeH15Closing";
import "@/components/home/home.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * HERO PANEL (100% UNTOUCHED).
 * Preserves exact collage animation, timings, typography, eyebrow, and magnetic CTA.
 */
function HeroContent() {
  const collage = useRef<TileCollageHandle>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    if (headline.current) cleanups.push(revealLines(headline.current));
    if (cta.current) cleanups.push(magnetic(cta.current));
    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center overflow-clip">
        <TileCollage
          ref={collage}
          className="w-[140vw] max-w-[1400px]"
          rotation={-16}
          idleDrift
          scrollParallax
          staggerEntrance
          labelChip
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56"
        style={{
          background:
            "linear-gradient(to bottom, rgba(35, 45, 34, 0.78), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4"
        style={{
          background:
            "linear-gradient(to top, rgba(35, 45, 34, 0.78), transparent)",
        }}
      />
      <p className="absolute left-5 top-28 z-20 max-w-[calc(100vw-2.5rem)] text-[1.1667rem] uppercase leading-snug tracking-[0.14em] text-hero-linen/90 md:left-10 md:top-32 md:max-w-md">
        {home.eyebrow}
      </p>
      <div className="absolute bottom-8 right-5 z-20 max-w-[calc(100vw-2.5rem)] text-right md:bottom-16 md:right-10 md:max-w-[74vw]">
        <h1
          ref={headline}
          className="font-serif text-[clamp(2.25rem,8.5vw,3.5rem)] leading-[1.04] text-hero-linen md:text-[clamp(3.25rem,7.2vw,6.75rem)]"
        >
          {home.headline}
        </h1>
        <div className="mt-6 flex justify-end">
          <VeilLink
            ref={cta}
            to={BRAND.cta.href}
            data-cursor="link"
            className="inline-flex items-center rounded-full bg-hero-linen px-5 py-3 text-sm text-forest"
          >
            {BRAND.cta.label}
            <ArrowUpRight className="ml-2" size={16} />
          </VeilLink>
        </div>
      </div>
    </>
  );
}

/**
 * Rebuilt Home page (/).
 * Untouched Panel 1 (Hero), followed by the scroll story of 14 sticky scenes (H2–H15).
 */
export default function HomePage() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    void document.fonts?.ready.then(refresh).catch(() => {});

    // ?debug=1 inspection
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") !== "1") return;

    const timer = window.setTimeout(() => {
      const imgs = Array.from(
        document.querySelectorAll<HTMLImageElement>(".home-page img")
      );
      const broken = imgs.filter(
        (img) => img.complete && img.naturalWidth === 0
      );
      if (broken.length > 0) {
        console.warn("[home?debug=1] Broken images detected:", broken);
      }
      const panels = document.querySelectorAll(".home-page .panel");
      console.info(
        `[home?debug=1] Panels: ${panels.length}, Images: ${imgs.length}, Broken: ${broken.length}`
      );
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="home-page relative w-full overflow-hidden">
      <StackSection className="home-stack">
        {/* Panel 1: Approved, untouched collage hero */}
        <Panel zIndex={1} background="var(--forest)">
          <HeroContent />
        </Panel>

        {/* Panels 2–15: Rebuilt estate scroll story */}
        <HomeH2Reveal />
        <HomeH3Split />
        <HomeH4WordList />
        <HomeH5MacroCard />
        <HomeH6Slider />
        <HomeH7SingleWord />
        <HomeH8Rotating />
        <HomeH9MapLeaf />
        <HomeH10CreamMultiFrame />
        <HomeH11CreamSplit />
        <HomeH12ThumbnailSwitcher />
        <HomeH13CardFullBleed />
        <HomeH14HorizontalGallery />
        <HomeH15Closing />
      </StackSection>
    </div>
  );
}
