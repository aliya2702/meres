import { useState, type CSSProperties } from "react";
import { getAboutImage, type AboutImageId } from "../../data/images";

export interface AboutPhotoProps {
  id: AboutImageId;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  cursorView?: boolean;
  "data-drift"?: "up" | "down";
}

/**
 * Renders one verified photograph from src/data/images.ts with a clean
 * warm-taupe fallback block if a network error ever occurs.
 */
export function AboutPhoto({
  id,
  className = "",
  imgClassName = "",
  style,
  cursorView = false,
  "data-drift": dataDrift,
}: AboutPhotoProps) {
  const entry = getAboutImage(id);
  const [failed, setFailed] = useState(false);

  return (
    <div
      data-about-photo={id}
      data-about-cursor={cursorView ? "view" : undefined}
      data-drift={dataDrift}
      style={style}
      className={`about-debug-outline relative overflow-hidden bg-[rgba(173,150,128,0.14)] ${className}`}
    >
      {failed ? (
        <div
          aria-label={entry.alt}
          role="img"
          className="h-full w-full bg-[var(--taupe)]"
        />
      ) : (
        <img
          src={entry.src}
          alt={entry.alt}
          loading="eager"
          decoding="sync"
          onError={() => {
            console.warn(`[about] Image failed to load: ${id} (${entry.src})`);
            setFailed(true);
          }}
          className={`block h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}

