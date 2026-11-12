import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { VeilLink } from "@/components/VeilLink";
import { TileCollage, type TileCollageHandle } from "@/components/TileCollage";
import { StackSection, Panel } from "@/components/StackSection";
import { BRAND, home } from "@/content/copy";
import { revealLines, magnetic } from "@/motion/helpers";

gsap.registerPlugin(ScrollTrigger);

function HeroContent() {
  const collage = useRef<TileCollageHandle>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", async () => {
      await document.fonts.ready;
      if (headline.current) cleanups.push(revealLines(headline.current));
      if (cta.current) cleanups.push(magnetic(cta.current));
    });
    return () => { cleanups.forEach((c) => c()); mm.revert(); };
  }, []);

  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center">
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
      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-forest/40" />
      <p className="absolute left-5 top-24 z-20 max-w-xs text-xs uppercase tracking-[0.18em] text-linen/80 md:left-10 md:top-28">
        {home.eyebrow}
      </p>
      <div className="absolute bottom-8 right-5 z-20 max-w-[60vw] text-right md:bottom-16 md:right-10">
        <h1 ref={headline} className="font-serif text-[7vw] leading-[0.94] text-linen md:text-[9vw]">{home.headline}</h1>
        <div className="mt-6 flex justify-end">
          <VeilLink ref={cta} to={BRAND.cta.href} data-cursor="link" className="inline-flex items-center rounded-full bg-linen px-5 py-3 text-sm text-forest">
            {BRAND.cta.label}<ArrowUpRight className="ml-2" size={16} />
          </VeilLink>
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <StackSection>
      <Panel zIndex={1} background="var(--forest)">
        <HeroContent />
      </Panel>
      <Panel zIndex={2} background="var(--linen)">
        <div className="flex h-full items-center justify-center px-8">
          <h2 className="headline-clamp font-serif text-ink text-center">{home.details.title}</h2>
        </div>
      </Panel>
      <Panel zIndex={3} background="var(--forest)">
        <div className="flex h-full items-center justify-center px-8">
          <h2 className="headline-clamp font-serif text-linen text-center">{home.understanding.title}</h2>
        </div>
      </Panel>
      <Panel zIndex={4} background="var(--linen)">
        <div className="flex h-full items-center justify-center px-8">
          <h2 className="headline-clamp font-serif text-ink text-center">{home.change.title}</h2>
        </div>
      </Panel>
      <Panel zIndex={5} background="var(--ink)">
        <div className="flex h-full items-center justify-center px-8">
          <h2 className="headline-clamp font-serif text-linen text-center">{home.yes.title}</h2>
        </div>
      </Panel>
      <Panel zIndex={6} background="var(--forest)">
        <div className="flex h-full items-center justify-center px-8">
          <h2 className="headline-clamp font-serif text-linen text-center">{home.closing.title}</h2>
        </div>
      </Panel>
      <Panel zIndex={7} background="var(--linen)">
        <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
          <h2 className="headline-clamp font-serif text-ink">{home.closing.title}</h2>
          <p className="lead-clamp font-serif text-ink/70">{home.closing.lead}</p>
          <VeilLink to={BRAND.cta.href} data-cursor="link" className="inline-flex items-center rounded-full bg-forest px-5 py-3 text-sm text-linen">
            {BRAND.cta.label}<ArrowUpRight className="ml-2" size={16} />
          </VeilLink>
        </div>
      </Panel>
    </StackSection>
  );
}
