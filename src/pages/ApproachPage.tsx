import { StackSection, Panel } from "@/components/StackSection";
import { approach } from "@/content/copy";

export default function ApproachPage() {
  return (
    <StackSection>
      <Panel zIndex={1} background="var(--forest)">
        <div className="flex h-full items-center justify-center px-8">
          <h1 className="headline-clamp font-serif text-linen text-center">{approach.title}</h1>
        </div>
      </Panel>
      {approach.steps.map((step, i) => (
        <Panel key={i} zIndex={i + 2} background={i % 2 === 0 ? "var(--linen)" : "var(--forest)"}>
          <div className="flex h-full items-center justify-center px-8">
            <h2 className={`headline-clamp font-serif text-center ${i % 2 === 0 ? "text-ink" : "text-linen"}`}>{step.title}</h2>
          </div>
        </Panel>
      ))}
      <Panel zIndex={approach.steps.length + 2} background="var(--linen)">
        <div className="flex h-full items-center justify-center px-8">
          <h2 className="headline-clamp font-serif text-ink text-center">{approach.begin.title}</h2>
        </div>
      </Panel>
    </StackSection>
  );
}
