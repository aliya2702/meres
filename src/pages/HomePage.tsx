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
    if (headline.current) cleanups.push(revealLines(headline.current));
    if (cta.current) cleanups.push(magnetic(cta.current));
    return () => { cleanups.forEach((c) => c()); };
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
        style={{ background: "linear-gradient(to bottom, rgba(35, 45, 34, 0.78), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4"
        style={{ background: "linear-gradient(to top, rgba(35, 45, 34, 0.78), transparent)" }}
      />
      <p className="absolute left-5 top-28 z-20 max-w-[calc(100vw-2.5rem)] text-[1.1667rem] uppercase leading-snug tracking-[0.14em] text-hero-linen/90 md:left-10 md:top-32 md:max-w-md">
        {home.eyebrow}
      </p>
      <div className="absolute bottom-8 right-5 z-20 max-w-[calc(100vw-2.5rem)] text-right md:bottom-16 md:right-10 md:max-w-[74vw]">
        <h1 ref={headline} className="font-serif text-[clamp(2.25rem,8.5vw,3.5rem)] leading-[1.04] text-hero-linen md:text-[clamp(3.25rem,7.2vw,6.75rem)]">{home.headline}</h1>
        <div className="mt-6 flex justify-end">
          <VeilLink ref={cta} to={BRAND.cta.href} data-cursor="link" className="inline-flex items-center rounded-full bg-hero-linen px-5 py-3 text-sm text-forest">
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
