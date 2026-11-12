import { ClosingSection } from "@/components/ClosingSection";
import { ServicesIntro } from "@/components/services/ServicesIntro";
import { ServicesShowcase } from "@/components/services/ServicesShowcase";
import { services } from "@/content/copy";

export default function ServicesPage() {
  return (
    <>
      <ServicesIntro standalone />
      <ServicesShowcase variant="page" />
      <ClosingSection
        title={services.closing.title}
        paragraphs={services.closing.paragraphs}
      />
    </>
  );
}
