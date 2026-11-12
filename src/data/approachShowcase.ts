import { BRAND, approach } from "@/content/copy";
import { images } from "@/content/images";

export type ApproachAssetImage = {
  src: string;
  alt: string;
  label: string;
};

export type ApproachStepItem = {
  id: string;
  stepNumber: string;
  title: string;
  paragraphs: readonly string[];
  theme: "green" | "linen";
  image: ApproachAssetImage;
};

const found = import.meta.glob("/src/assets/approach/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function findAsset(basename: string): string {
  const prefix = basename.toLowerCase();
  const match = Object.entries(found).find(([filePath]) => {
    const fileName = filePath.split("/").pop()?.toLowerCase() ?? "";
    return fileName.startsWith(prefix);
  });
  return match ? match[1] : "";
}

const diningNook = images.find((item) => item.id === "dining-nook")!;

export const APPROACH_LABEL = BRAND.imageLabel;

export const approachOpening = {
  title: approach.title,
  paragraphs: approach.paragraphs,
  image: {
    src: diningNook.src["1672"],
    alt: diningNook.alt,
    label: diningNook.label,
    focal: diningNook.focal,
  },
} as const;

const STEP_META = [
  {
    id: "understand",
    stepNumber: "01",
    file: "step-1-understand",
    alt: "Warm oak studio table with folded cream tracing paper, honed limestone, oiled walnut block, and forest-green dish holding brass ruler and pencils.",
  },
  {
    id: "define",
    stepNumber: "02",
    file: "step-2-define",
    alt: "Layered architectural floor plans on vellum beside a solid brushed brass scale ruler and walnut joinery sample.",
  },
  {
    id: "trust",
    stepNumber: "03",
    file: "step-3-trust",
    alt: "Ordered cedar framing, fresh lime plaster, and an aged brass plumb bob with folding rule resting on an oak sill.",
  },
  {
    id: "approve",
    stepNumber: "04",
    file: "step-4-approve",
    alt: "Material selection pairing honed travertine tile, oiled walnut veneer, raw linen swatch, and brushed brass cabinet hardware.",
  },
  {
    id: "finish",
    stepNumber: "05",
    file: "step-5-finish",
    alt: "Finished fluted walnut cabinetry meeting a honed beige limestone plinth and limewashed plaster wall in soft golden light.",
  },
] as const;

export const approachSteps: ApproachStepItem[] = approach.steps.map((step, index) => {
  const meta = STEP_META[index];
  return {
    id: meta.id,
    stepNumber: meta.stepNumber,
    title: step.title,
    paragraphs: step.paragraphs,
    theme: index % 2 === 0 ? "green" : "linen",
    image: {
      src: findAsset(meta.file),
      alt: meta.alt,
      label: APPROACH_LABEL,
    },
  };
});

export const approachClosing = {
  title: approach.begin.title,
  paragraphs: approach.begin.paragraphs,
  cta: BRAND.cta,
  images: [
    {
      src: findAsset("closing-1"),
      alt: "Residential sitting room and library featuring deep forest-green painted millwork, walnut bookshelves, limestone hearth, and oak floorboards.",
      label: APPROACH_LABEL,
    },
    {
      src: findAsset("closing-2"),
      alt: "Open kitchen and dining transition with fluted American walnut island, honed limestone countertop, brass faucet, and sheer linen curtains.",
      label: APPROACH_LABEL,
    },
    {
      src: findAsset("closing-3"),
      alt: "Architectural residential extension at twilight with warm cedar timber eaves, pale limestone terrace, and glowing windows among evergreens.",
      label: APPROACH_LABEL,
    },
  ] satisfies ApproachAssetImage[],
};

