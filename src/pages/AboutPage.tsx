import { StackSection, Panel } from "@/components/StackSection";
import { about } from "@/content/copy";

export default function AboutPage() {
  return (
    <StackSection>
      <Panel zIndex={1} background="var(--linen)">
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-forest">{about.eyebrow}</p>
          <h1 className="headline-clamp font-serif text-ink">{about.title}</h1>
        </div>
      </Panel>
      <Panel zIndex={2} background="var(--forest)">
        <div className="flex h-full items-center justify-center px-8">
          <h2 className="headline-clamp font-serif text-linen text-center">{about.philosophy.title}</h2>
        </div>
      </Panel>
      <Panel zIndex={3} background="var(--linen)">
        <div className="flex h-full items-center justify-center px-8">
          <h2 className="lead-clamp font-serif text-ink text-center">{about.region}</h2>
        </div>
      </Panel>
    </StackSection>
  );
}
