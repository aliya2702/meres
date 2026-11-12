import { useEffect, useState } from "react";

export type ViewMode = "desktop" | "mobile" | "reduced";

export function getViewMode(): ViewMode {
  if (typeof window === "undefined") return "mobile";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  if (window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return "desktop";
  return "mobile";
}

export function useViewMode(): ViewMode {
  const [mode, setMode] = useState<ViewMode>(getViewMode);

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const next = getViewMode();
      setMode((prev) => (prev === next ? prev : next));
    };
    mqDesktop.addEventListener("change", update);
    mqReduce.addEventListener("change", update);
    return () => {
      mqDesktop.removeEventListener("change", update);
      mqReduce.removeEventListener("change", update);
    };
  }, []);

  return mode;
}

