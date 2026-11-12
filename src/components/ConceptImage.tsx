import { forwardRef } from "react";
import { GLImage, type GLImageHandle } from "@/gl/GLImage";
import { images } from "@/content/images";

function getImage(id: string) {
  const image = images.find((item) => item.id === id);
  if (!image) throw new Error(`Unknown image id: ${id}`);
  return image;
}

export const ConceptImage = forwardRef<GLImageHandle, { id: string; srcB?: string; className?: string; eager?: boolean; fetchPriority?: "high" | "low" | "auto"; ripple?: number }>(function ConceptImage({ id, srcB, className = "", eager = false, fetchPriority, ripple = 1 }, ref) {
  const image = getImage(id);
  return <div className={`relative overflow-hidden ${className}`} data-image-frame><GLImage ref={ref} src={image.src["1672"]} srcB={srcB} alt={image.alt} eager={eager} fetchPriority={fetchPriority} ripple={ripple} className="absolute inset-0 h-full w-full" /><span className="absolute bottom-4 left-4 z-10 bg-ink/80 px-3 py-1.5 text-[1.1667rem] leading-none text-linen backdrop-blur-sm">{image.label}</span></div>;
});
