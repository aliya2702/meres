export type LibImage = {
  id: string;
  category: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  orientation: "landscape" | "portrait" | "square";
  source: "Unsplash" | "Pexels" | "Pixabay";
  pageUrl: string;
  photographer: string;
  license: string;
};

export const STOCK_LABEL = "Illustrative image";

export const IMAGES: LibImage[] = [
  {
    id: "K1",
    category: "kitchens",
    src: "/images/stock/K1.jpg",
    alt: "Warm open-plan kitchen with walnut cabinetry, soft cream finishes, and integrated stone worktop",
    width: 2000,
    height: 1335,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/kitchen-interior-with-modern-appliances-6489123/",
    photographer: "Max Vakhtbovych",
    license: "Pexels License",
  },
  {
    id: "K2",
    category: "kitchens",
    src: "/images/stock/K2.jpg",
    alt: "Minimalist timber kitchen with warm oak millwork, pale stone backsplash, and quiet daylight",
    width: 2000,
    height: 1335,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/wooden-cabinets-in-the-modern-kitchen-8143944/",
    photographer: "Max Vakhtbovych",
    license: "Pexels License",
  },
  {
    id: "K3",
    category: "kitchens",
    src: "/images/stock/K3.jpg",
    alt: "Bespoke kitchen island in honed dark stone with handcrafted stoneware vessels and warm cabinetry",
    width: 2000,
    height: 1399,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/modern-convenient-island-kitchen-interior-design-7031213/",
    photographer: "Max Rahubovskiy",
    license: "Pexels License",
  },
  {
    id: "K4",
    category: "kitchens",
    src: "/images/stock/K4.jpg",
    alt: "Close-up of a brushed brass bridge faucet over a butcher-block counter and deep green cabinetry",
    width: 2000,
    height: 1334,
    orientation: "landscape",
    source: "Unsplash",
    pageUrl:
      "https://unsplash.com/photos/kitchen-with-dark-green-cabinets-8OvuBRDLN4U",
    photographer: "Clay Banks",
    license: "Unsplash License",
  },
  {
    id: "D1",
    category: "dining",
    src: "/images/stock/D1.jpg",
    alt: "Timber dining table and sculptural chairs set beside a stone kitchen island in soft daylight",
    width: 2000,
    height: 1349,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/wooden-dining-table-with-candlestick-and-chairs-placed-near-kitchen-counter-6758775/",
    photographer: "Max Vakhtbovych",
    license: "Pexels License",
  },
  {
    id: "D2",
    category: "dining",
    src: "/images/stock/D2.jpg",
    alt: "Sunlit double-height dining area overlooking open architectural framing and limestone flooring",
    width: 2000,
    height: 1333,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/interior-design-of-a-simple-house-4119832/",
    photographer: "Curtis Adams",
    license: "Pexels License",
  },
  {
    id: "D3",
    category: "dining",
    src: "/images/stock/D3.jpg",
    alt: "Quiet residential dining room with natural wood table, soft neutral seating, and garden views",
    width: 2000,
    height: 1334,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/modern-dining-room-design-11125432/",
    photographer: "Curtis Adams",
    license: "Pexels License",
  },
  {
    id: "B1",
    category: "bathrooms",
    src: "/images/stock/B1.jpg",
    alt: "Bright renovated bathroom with wood-framed mirror, veined stone countertop, and glass shower",
    width: 2000,
    height: 1333,
    orientation: "landscape",
    source: "Unsplash",
    pageUrl: "https://unsplash.com/photos/P_0tnQ8hb70",
    photographer: "R ARCHITECTURE",
    license: "Unsplash License",
  },
  {
    id: "B2",
    category: "bathrooms",
    src: "/images/stock/B2.jpg",
    alt: "Architectural bathroom with slatted timber panelling, soft stone tilework, and warm indirect lighting",
    width: 2000,
    height: 1335,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/modern-bathroom-with-wooden-elements-7167075/",
    photographer: "Max Vakhtbovych",
    license: "Pexels License",
  },
  {
    id: "B3",
    category: "bathrooms",
    src: "/images/stock/B3.jpg",
    alt: "Minimalist stone-clad bathroom featuring a sculptural freestanding soaking tub in quiet daylight",
    width: 2000,
    height: 1335,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/minimalist-luxury-interior-design-of-modern-bathroom-7031574/",
    photographer: "Max Vakhtbovych",
    license: "Pexels License",
  },
  {
    id: "W1",
    category: "workshop",
    src: "/images/stock/W1.jpg",
    alt: "Hardwood shavings curling beside a hand plane on a joiner's solid timber workbench",
    width: 2000,
    height: 1351,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/think-shavings-of-wood-on-workbench-5974251/",
    photographer: "Ono Kosuki",
    license: "Pexels License",
  },
  {
    id: "E1",
    category: "exteriors",
    src: "/images/stock/E1.jpg",
    alt: "Custom residential extension with vertical timber cladding, panoramic glazing, and twilight lighting",
    width: 2000,
    height: 1333,
    orientation: "landscape",
    source: "Unsplash",
    pageUrl: "https://unsplash.com/photos/TRCJ-87Yoh0",
    photographer: "R ARCHITECTURE",
    license: "Unsplash License",
  },
  {
    id: "E2",
    category: "exteriors",
    src: "/images/stock/E2.jpg",
    alt: "Contemporary cedar and pale limestone residence glowing softly at dusk",
    width: 2000,
    height: 1335,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/contemporary-country-house-facade-in-winter-7031406/",
    photographer: "Max Vakhtbovych",
    license: "Pexels License",
  },
  {
    id: "E3",
    category: "exteriors",
    src: "/images/stock/E3.jpg",
    alt: "Residential garden elevation with expansive architectural glazing opening onto the landscape",
    width: 2000,
    height: 1335,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/modern-house-with-panoramic-windows-7061678/",
    photographer: "Max Vakhtbovych",
    license: "Pexels License",
  },
  {
    id: "M1",
    category: "materials",
    src: "/images/stock/M1.jpg",
    alt: "Warm beige veined natural stone slab with subtle organic mineral markings",
    width: 2000,
    height: 2000,
    orientation: "square",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/close-up-shot-of-a-concrete-wall-11273814/",
    photographer: "Share Textures",
    license: "Pexels License",
  },
  {
    id: "M2",
    category: "materials",
    src: "/images/stock/M2.jpg",
    alt: "Macro detail of raw woven cream linen textile with natural slub texture",
    width: 2000,
    height: 1334,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/close-up-of-a-linen-texture-7794365/",
    photographer: "Katya Bolovtsova",
    license: "Pexels License",
  },
  {
    id: "M3",
    category: "materials",
    src: "/images/stock/M3.jpg",
    alt: "Close-up of warm European oak timber boards with natural grain and satin oil finish",
    width: 2000,
    height: 2000,
    orientation: "square",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/brown-wooden-parquet-flooring-129731/",
    photographer: "FWStudio",
    license: "Pexels License",
  },
  {
    id: "M4",
    category: "materials",
    src: "/images/stock/M4.jpg",
    alt: "Honed rectangular beige travertine wall blocks with soft porous mineral grain",
    width: 2000,
    height: 1333,
    orientation: "landscape",
    source: "Unsplash",
    pageUrl:
      "https://unsplash.com/photos/travertine-tiles-with-natural-texture-ZYU__rpviq0",
    photographer: "Pawel Czerwinski",
    license: "Unsplash License",
  },
  {
    id: "L1",
    category: "living",
    src: "/images/stock/L1.jpg",
    alt: "Quiet modern living space with low cream sofa, stone hearth, and open sightlines to kitchen",
    width: 2000,
    height: 1286,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/luxurious-living-room-with-modern-interior-design-featuring-beige-sofa-fireplace-and-open-kitchen-1571460/",
    photographer: "Vecislavas Popa",
    license: "Pexels License",
  },
  {
    id: "L2",
    category: "living",
    src: "/images/stock/L2.jpg",
    alt: "Sunlit living room anchored by pale neutral upholstery, warm oak flooring, and clean architectural trim",
    width: 2000,
    height: 1317,
    orientation: "landscape",
    source: "Pexels",
    pageUrl:
      "https://www.pexels.com/photo/interior-design-of-a-house-1643383/",
    photographer: "Vecislavas Popa",
    license: "Pexels License",
  },
];

export const img = (id: string) => IMAGES.find((i) => i.id === id)!;

// Backward compatibility for existing pages prior to library adoption
export type AboutImageId = string;
export const getAboutImage = img;
