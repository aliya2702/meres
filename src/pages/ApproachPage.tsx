import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ApproachClosing } from "@/components/approach/ApproachClosing";
import { ApproachOpening } from "@/components/approach/ApproachOpening";
import { ApproachStepSection } from "@/components/approach/ApproachStepSection";
import { approachSteps } from "@/data/approachShowcase";

export default function ApproachPage() {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="w-full">
      <ApproachOpening />

      {approachSteps.map((step) => (
        <ApproachStepSection key={step.id} step={step} />
      ))}

      <ApproachClosing />
    </div>
  );
}
