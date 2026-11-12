import { StackSection, Panel } from "@/components/StackSection";
import { services } from "@/content/copy";

export default function ServicesPage() {
  return (
    <StackSection>
      <Panel zIndex={1} background="var(--linen)">
        <div className="flex h-full items-center justify-center px-8">
          <h1 className="headline-clamp font-serif text-ink text-center">{services.title}</h1>
        </div>
      </Panel>
      {services.sections.map((s, i) => (
        <Panel key={s.id} zIndex={i + 2} background={i % 2 === 0 ? "var(--forest)" : "var(--linen)"}>
          <div className="flex h-full items-center justify-center px-8" id={s.id}>
            <h2 className={`headline-clamp font-serif text-center ${i % 2 === 0 ? "text-linen" : "text-ink"}`}>{s.title}</h2>
          </div>
        </Panel>
      ))}
      <Panel zIndex={services.sections.length + 2} background="var(--linen)">
        <div className="flex h-full items-center justify-center px-8">
          <h2 className="headline-clamp font-serif text-ink text-center">{services.closing.title}</h2>
        </div>
      </Panel>
    </StackSection>
  );
}
