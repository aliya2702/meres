import { home, services } from "@/content/copy";
import { images } from "@/content/images";

export type ServiceShowcaseImage = {
  src: string;
  alt: string;
  focal?: { xPct: number; yPct: number };
};

export type ServiceShowcaseItem = {
  id: (typeof services.sections)[number]["id"];
  title: string;
  caption: string;
  paragraph: string;
  lines: string[];
  closing?: string;
  image: ServiceShowcaseImage | null;
  theme: "linen" | "green";
};

const splitSentences = (text: string): string[] => text.split(/(?<=[.!?])\s+/);

const found = import.meta.glob("/src/assets/services/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function findImage(basename: string): string | null {
  const prefix = basename.toLowerCase();
  const match = Object.entries(found).find(([filePath]) => {
    const fileName = filePath.split("/").pop()?.toLowerCase() ?? "";
    return fileName.startsWith(prefix);
  });
  return match ? match[1] : null;
}

const bathroomImageSrc = findImage("bathroom") ?? null;
const additionsImageSrc = findImage("additions") ?? null;

const img02 = images.find((item) => item.id === "kitchen-wide")!;
const img06 = images.find((item) => item.id === "second-kitchen")!;

const [kitchenSection, bathroomSection, wholeHomeSection, additionsSection] = services.sections;
const [kitchenHome, bathroomHome, wholeHomeHome, additionsHome] = home.change.services;

export const servicesShowcase: readonly ServiceShowcaseItem[] = [
  {
    id: kitchenSection.id,
    title: kitchenSection.title,
    caption: splitSentences(kitchenHome.body)[0],
    paragraph: kitchenSection.paragraphs[1],
    lines: splitSentences(kitchenSection.paragraphs[0]),
    closing: kitchenSection.paragraphs[2],
    image: {
      src: img06.src["1672"],
      alt: img06.alt,
      focal: img06.focal,
    },
    theme: "linen",
  },
  {
    id: bathroomSection.id,
    title: bathroomSection.title,
    caption: splitSentences(bathroomHome.body)[0],
    paragraph: bathroomSection.paragraphs[1],
    lines: splitSentences(bathroomSection.paragraphs[0]),
    image: bathroomImageSrc
      ? {
          src: bathroomImageSrc,
          alt: "Concept visualization of a tailored residential bathroom with warm cabinetry, stone surfaces, and calm daylight.",
        }
      : null,
    theme: "green",
  },
  {
    id: wholeHomeSection.id,
    title: wholeHomeSection.title,
    caption: splitSentences(wholeHomeHome.body)[0],
    paragraph: wholeHomeSection.paragraphs[1],
    lines: [
      ...splitSentences(wholeHomeSection.paragraphs[0]),
      wholeHomeSection.paragraphs[2],
    ],
    image: {
      src: img02.src["1672"],
      alt: img02.alt,
      focal: img02.focal,
    },
    theme: "linen",
  },
  {
    id: additionsSection.id,
    title: additionsSection.title,
    caption: splitSentences(additionsHome.body)[0],
    paragraph: additionsSection.paragraphs[2],
    lines: [
      additionsSection.paragraphs[0],
      additionsSection.paragraphs[1],
    ],
    image: additionsImageSrc
      ? {
          src: additionsImageSrc,
          alt: "Concept visualization of a custom home addition and exterior framing daylight and outdoor views.",
        }
      : null,
    theme: "green",
  },
];
