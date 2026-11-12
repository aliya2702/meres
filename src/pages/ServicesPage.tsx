import { ClosingSection } from "@/components/ClosingSection";
import { ServicesShowcase } from "@/components/services/ServicesShowcase";
import { services } from "@/content/copy";

export default function ServicesPage() {
  return (
    <>
      <ServicesShowcase variant="page" />
      <ClosingSection
        title={services.closing.title}
        paragraphs={services.closing.paragraphs}
      />
    </>
  );
}
