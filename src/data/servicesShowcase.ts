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

// Checked against public/images/: bathroom and additions assets do not exist on disk.
const HAS_BATHROOM_IMAGE = false;
const HAS_ADDITIONS_IMAGE = false;

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
    image: HAS_BATHROOM_IMAGE
      ? {
          src: "/images/services/bathroom.png",
          alt: "Concept visualization of a tailored residential bathroom.",
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
    image: HAS_ADDITIONS_IMAGE
      ? {
          src: "/images/services/additions.png",
          alt: "Concept visualization of a custom home exterior and architectural addition.",
        }
      : null,
    theme: "green",
  },
];
