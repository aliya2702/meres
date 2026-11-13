import { useState, type CSSProperties } from "react";
import { img, STOCK_LABEL } from "@/data/images";

export interface ApproachPhotoProps {
  id: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  showChip?: boolean;
  priority?: boolean;
}

/**
 * Robust photo component for the Approach page.
 * Loads exclusively from src/data/images.ts, with immediate warm-taupe fallback
 * and console warning if any network/asset error occurs.
 */
export function ApproachPhoto({
  id,
  className = "",
  imgClassName = "",
  style,
  showChip = false,
  priority = false,
}: ApproachPhotoProps) {
  const [failed, setFailed] = useState(false);
  const entry = img(id);

  if (!entry) {
    console.warn(`[approach] Image ID not found in library: ${id}`);
    return (
      <div
        className={`relative overflow-hidden bg-[#AD9680] ${className}`}
        style={style}
        role="img"
        aria-label="Image missing"
      />
    );
  }

  return (
    <div
      data-approach-photo={id}
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
            console.warn(`[approach] Image failed to load: ${id} (${entry.src})`);
            setFailed(true);
          }}
          className={`block h-full w-full object-cover ${imgClassName}`}
        />
      )}
      {showChip && (
        <span className="concept-chip absolute bottom-3 right-3 z-10 select-none bg-[rgba(27,33,26,0.68)] px-2.5 py-1 text-[10px] tracking-wider text-[#E8DECE] backdrop-blur-md">
          {STOCK_LABEL}
        </span>
      )}
    </div>
  );
}
