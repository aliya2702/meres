import { useState, type CSSProperties } from "react";
import { img, STOCK_LABEL } from "@/data/images";

export interface ServicesPhotoProps {
  id: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  showConceptChip?: boolean;
  warmTint?: boolean;
}

/**
 * Robust photo component for the Services page.
 * Loads exclusively from src/data/images.ts.
 * Supports warm 8% tint overlay for cohesive look between client concepts and stock photos.
 * Includes immediate warm-taupe fallback and console warning if any asset fails.
 */
export function ServicesPhoto({
  id,
  className = "",
  imgClassName = "",
  style,
  showConceptChip,
  warmTint = true,
}: ServicesPhotoProps) {
  const [failed, setFailed] = useState(false);
  const entry = img(id);

  if (!entry) {
    console.warn(`[services] Image ID not found in library: ${id}`);
    return (
      <div
        className={`relative overflow-hidden bg-[#AD9680] ${className}`}
        style={style}
        role="img"
        aria-label="Image missing"
      />
    );
  }

  const isConceptImage = !!entry.isConcept;
  const shouldShowChip =
    showConceptChip !== undefined ? showConceptChip : isConceptImage;

  return (
    <div
      data-services-photo={id}
      data-services-cursor="view"
      className={`relative overflow-hidden bg-[rgba(173,150,128,0.18)] ${className}`}
      style={style}
    >
      {failed ? (
        <div
          role="img"
          aria-label={entry.alt}
          className="h-full w-full bg-[#AD9680]"
        />
      ) : (
        <img
          src={entry.src}
          alt={entry.alt}
          loading="eager"
          decoding="sync"
          onError={() => {
            console.warn(`[services] Image failed to load: ${id} (${entry.src})`);
            setFailed(true);
          }}
          className={`block h-full w-full object-cover ${imgClassName}`}
        />
      )}

      {/* Warm 8% tint overlay */}
      {warmTint && <div className="services-warm-overlay" aria-hidden="true" />}

      {/* Concept visualization or stock label */}
      {shouldShowChip && (
        <span className="services-concept-chip absolute bottom-3 right-3 z-10">
          {isConceptImage ? "Concept visualization" : STOCK_LABEL}
        </span>
      )}
    </div>
  );
}

