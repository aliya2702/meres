import { useState, type CSSProperties } from "react";
import { img, STOCK_LABEL } from "@/data/images";

export interface HomePhotoProps {
  id: string;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  showChip?: boolean;
}

/**
 * Robust photo component for the Home page.
 * Loads exclusively from src/data/images.ts, with immediate warm-taupe fallback
 * and console warning if any network/asset error occurs.
 */
export function HomePhoto({
  id,
  className = "",
  imgClassName = "",
  style,
  showChip = false,
}: HomePhotoProps) {
  const [failed, setFailed] = useState(false);
  const entry = img(id);

  if (!entry) {
    console.warn(`[home] Image ID not found in library: ${id}`);
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
      data-home-photo={id}
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
            console.warn(`[home] Image failed to load: ${id} (${entry.src})`);
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

