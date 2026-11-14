// MERES — approved website copy, verbatim from 01_Website_Copy.txt (Eddie's approved copy).
// DO NOT rewrite, shorten or add copy. Each page is a structured object.
// Buttons use BRAND.cta everywhere (label, href, microcopy).

export const BRAND = {
  name: "MERES",
  domain: "meres.co",
  place: "Seattle's Eastside",
  philosophy: "Nothing meaningful happens by accident.",
  imageLabel: "Concept visualization",
  inquiryEmail: "info@meres.co", // server-side delivery only; never expose as a mailto submit
  cta: {
    label: "Tell us what matters",
    href: "/contact#project-inquiry",
    micro: "Share your plans and questions in our project-inquiry form.",
    ariaLabel: "Tell us what matters — open the project inquiry form",
  },
  nav: [
    { label: "Services", href: "/services" },
    { label: "Our approach", href: "/approach" },
    { label: "About", href: "/about" },
  ],
  services: [
    { id: "kitchens", label: "Kitchens", href: "/services#kitchens", link: "Explore kitchens" },
    { id: "bathrooms", label: "Bathrooms", href: "/services#bathrooms", link: "Explore bathrooms" },
    { id: "whole-home", label: "Whole-home renovations", href: "/services#whole-home", link: "Explore whole-home renovations" },
    { id: "additions-custom-homes", label: "Additions & custom homes", href: "/services#additions-custom-homes", link: "Explore additions & custom homes" },
  ],
  images: {
    kitchenHero: { src: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/01_MERES_Kitchen_Hero_Visualization.png`, alt: "Walnut kitchen with a stone island and upholstered counter seating." },
    kitchenWide: { src: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/02_MERES_Kitchen_Wide_Visualization.png`, alt: "Kitchen island with stone worktop, pendant lighting, and a connected dining area." },
    diningNook: { src: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/03_MERES_Dining_Nook_Visualization.png`, alt: "Dining nook with an open book, upholstered seating, and glazed doors to a garden." },
    kitchenDetail: { src: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/04_MERES_Kitchen_Detail_Visualization.png`, alt: "Walnut cabinetry, a stone backsplash, a range, and a brass-toned kitchen faucet." },
    wineBar: { src: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/05_MERES_Wine_Bar_Visualization.png`, alt: "Dark stone home bar with wine storage and warm wall lighting." },
    secondKitchen: { src: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/06_MERES_Second_Kitchen_Visualization.png`, alt: "Kitchen with a broad island, four counter stools, walnut cabinetry, and pendant lighting." },
  },
} as const;

export const home = {
  "eyebrow": "Residential remodeling and custom homes · Seattle’s Eastside",
  "headline": "Nothing meaningful happens by accident.",
  "intro": "Your home holds the life you’ve built. Let’s talk about what you want to change, what you want to protect, and what you need to understand about budget, timing and life during the work.",
  "details": {
    "title": "The details are personal.",
    "moments": [
      "The drawer you reach for every morning.",
      "The place everyone gathers while you cook.",
      "A quiet room at the end of a demanding day."
    ],
    "statement": "Understanding those moments gives the work its direction.",
    "body": "We begin with how you live, what feels missing and what already feels right. Those conversations inform the layout, the materials, the cabinetry and the details you will live with long after construction is finished."
  },
  "understanding": {
    "title": "An understanding of how it comes together.",
    "paragraphs": [
      "Founded by Eddie Johnson, MERES brings experience in residential design, general contracting and cabinet manufacturing to the same conversation.",
      "That experience shapes the questions we ask. How will a cabinet function when its doors are open? Where will materials meet? What will an existing wall allow? How will a choice affect the work—and the budget—around it?",
      "We consider these relationships as the design develops, connecting the idea to the practical decisions required to build it."
    ]
  },
  "change": {
    "title": "What would you like to change?",
    "services": [
      {
        "id": "kitchens",
        "title": "Kitchens",
        "body": "A place for everything you reach for, room to move and space for people to stay awhile. We consider cabinetry, appliances, lighting and circulation together."
      },
      {
        "id": "bathrooms",
        "title": "Bathrooms",
        "body": "Useful light. Storage where you need it. Materials chosen with daily use in mind. Comfort takes shape through decisions like these."
      },
      {
        "id": "whole-home",
        "title": "Whole-home renovations",
        "body": "Reconsider how the rooms connect, what deserves to stay and what needs to change. Give the home a coherent direction that feels personal to you."
      },
      {
        "id": "additions-custom-homes",
        "title": "Additions & custom homes",
        "body": "Begin with the life the home needs to support. Consider the site, the relationship between spaces and the possibilities ahead."
      }
    ]
  },
  "yes": {
    "title": "You should understand what you’re saying yes to.",
    "paragraphs": [
      "Before committing to the work, you deserve to understand what is included, what remains undecided and what could affect cost or timing.",
      "We begin by discussing your priorities alongside the practical realities of construction—including how the work may affect daily life.",
      "As decisions arise, their implications for scope, cost and schedule belong in the conversation. You should have room to ask questions, understand the choices and make an informed decision.",
      "You don’t need to know construction terminology to explain what matters to you."
    ],
    "linkLabel": "Our approach"
  },
  "closing": {
    "title": "What should feel different when you come home?",
    "body": "You may have drawings, a collection of ideas or one room that has never worked the way you need it to.",
    "lead": "Start with that."
  }
} as const;

export const services = {
  "title": "What changes begins with what matters.",
  "lead": "Some things you want to change. Others are the reason you love your home.",
  "paragraphs": [
    "A kitchen that brings people closer. A bathroom that gives you a moment to yourself. More room, without losing what made the place yours.",
    "MERES brings residential design, construction and cabinet-making experience to kitchens, bathrooms, whole-home renovations, additions and custom homes across Seattle’s Eastside."
  ],
  "sections": [
    {
      "id": "kitchens",
      "title": "Kitchens",
      "paragraphs": [
        "The first cup before anyone else is awake. Dinner taking shape while someone pulls up a stool. The drawer your hand finds without looking.",
        "We consider how cabinetry, appliances, lighting and movement work together. Where an open dishwasher interrupts a walkway. How a cabinet’s proportions affect storage. Where the stone meets the wood.",
        "These decisions shape both how the kitchen feels and how it serves you every day."
      ]
    },
    {
      "id": "bathrooms",
      "title": "Bathrooms",
      "paragraphs": [
        "Good light at the mirror. Storage within reach. Room to move without working around an open door.",
        "We consider comfort and privacy alongside the details that make a bathroom work: layout, ventilation, waterproofing and materials suited to daily use. What you see and what sits behind it deserve the same care."
      ]
    },
    {
      "id": "whole-home",
      "title": "Whole-home renovations",
      "paragraphs": [
        "You may love where you live while feeling that the house no longer fits.",
        "We begin with what deserves to stay, then examine how the rooms connect. A doorway, a sightline or a change in floor level can influence several spaces at once. Cabinetry, lighting and materials should support a coherent home while allowing each room its own character.",
        "The aim is a home that feels connected to the life you live now."
      ]
    },
    {
      "id": "additions-custom-homes",
      "title": "Additions & custom homes",
      "paragraphs": [
        "An addition begins with a relationship: between the home you have and the space you need. We consider how you move between them, where daylight falls and how the new structure meets the existing one.",
        "A custom home begins with you and the site. Privacy, outlook, daily routines and the way you welcome people help give the plan its direction.",
        "Both call for early consideration of site constraints, permitting and the intended investment."
      ]
    }
  ],
  "closing": {
    "title": "Understand the decisions ahead.",
    "paragraphs": [
      "You don’t need a finished brief to begin. You do deserve to understand the next step.",
      "Our first conversations explore your priorities alongside questions about budget, timing and life during the work. As the scope develops, we discuss what is included, what remains undecided and which existing conditions may need further investigation.",
      "That gives you a clearer basis for weighing choices—and understanding what you’re saying yes to."
    ]
  }
} as const;

export const approach = {
  "title": "Trust is built in the details.",
  "paragraphs": [
    "Your home is personal. So is the decision to let someone change it.",
    "You should feel heard, understand the choices ahead and know who to turn to throughout the work. Our approach gives those expectations a practical foundation."
  ],
  "steps": [
    {
      "title": "First, understand what matters.",
      "paragraphs": [
        "What brought you to this point? What no longer works? What would you miss if it changed?",
        "We begin with your daily life, your priorities and the character of your home. Drawings and inspiration can help, but so can describing a morning that feels crowded or a room you rarely use.",
        "Together, we establish what the project needs to accomplish and what deserves to be preserved."
      ]
    },
    {
      "title": "Define the work and the decisions ahead.",
      "paragraphs": [
        "Moving an appliance affects cabinetry. Opening a room may involve the structure. A material choice can influence the details around it.",
        "We bring design, construction and cabinet-making experience to those relationships as the scope develops. We identify what is included, which decisions remain open and what needs further investigation, alongside the implications for budget and timing.",
        "That gives you a clearer understanding of the proposed work before you commit."
      ]
    },
    {
      "title": "Know who to turn to.",
      "paragraphs": [
        "Your project manager is your primary contact throughout construction, keeping communication connected to the work and helping you understand upcoming decisions.",
        "Access, the sequence of work and the spaces you depend on are part of that conversation. You have a clear person to bring questions to, whether they concern a detail in the plans or how the work affects your day."
      ]
    },
    {
      "title": "Approve changes with understanding.",
      "paragraphs": [
        "A new idea or an existing condition may call for a change.",
        "We document the proposed change and its implications for scope, cost and timing, identifying any uncertainty that remains. Changes require your written approval before the affected work proceeds.",
        "You can ask questions, weigh the implications and understand what you are authorizing."
      ]
    },
    {
      "title": "Finish with a shared understanding.",
      "paragraphs": [
        "We walk through the completed work together and establish a written understanding of any outstanding items and the agreed next steps.",
        "Your project manager coordinates follow-up and remains your point of contact as those items are addressed. You know what remains to be done and who is responsible for keeping it moving."
      ]
    }
  ],
  "begin": {
    "title": "Begin where you are.",
    "paragraphs": [
      "You may have drawings, a collection of ideas or questions about where to start.",
      "Our first conversation helps clarify your priorities and the appropriate next step for your project."
    ]
  }
} as const;

export const about = {
  "eyebrow": "ABOUT MERES",
  "title": "A perspective shaped by making.",
  "paragraphs": [
    "MERES was founded by Eddie Johnson, whose work spans residential design, general contracting and cabinet manufacturing.",
    "Working across those disciplines has shaped the way he sees a home: how an idea becomes a drawing, how materials come together and how the finished space serves the person living in it.",
    "A beautiful cabinet should feel right when you reach into it. An island should leave room for the way people gather. A material deserves consideration for how it will feel under your hand and change with use.",
    "The experience of living with the work gives those decisions their purpose."
  ],
  "philosophy": {
    "title": "Nothing meaningful happens by accident.",
    "paragraphs": [
      "That belief guides MERES.",
      "We begin with the life already happening in your home—the morning routines, the people around your table, the quiet you look forward to. We look at what deserves to stay and where a change would make a meaningful difference.",
      "Eddie brings a maker’s attention to those possibilities, connecting the character of a space with the practical decisions required to create it. Proportion, materials, cabinetry and construction belong in the same conversation.",
      "The intention is a home that feels distinctly yours, with care you experience long after the work is finished."
    ]
  },
  "region": "MERES serves homeowners across Seattle’s Eastside."
} as const;

export const contact = {
  "title": "Tell us what matters.",
  "paragraphs": [
    "Tell us about your home, what you want to change and what you want to protect. You may have drawings, a few ideas or questions about what is possible.",
    "You don’t need to have every answer before starting the conversation."
  ],
  "requiredNote": "Fields marked * are required.",
  "fields": {
    "name": "Your name",
    "email": "Email address",
    "city": "Project city",
    "projectType": "Project type",
    "types": [
      "Kitchen",
      "Bathroom",
      "Whole-home renovation",
      "Addition",
      "Custom home",
      "Other",
      "Not sure yet"
    ],
    "project": "Tell us about your project",
    "projectGuidance": "What would you like to change, and what matters most? Include any questions about budget, timing or living through the work.",
    "optionalGroup": "Anything else you’d like us to know?",
    "optionalTag": "Optional",
    "phone": "Phone number",
    "timing": "Preferred timing",
    "timingGuidance": "Share any dates or circumstances that matter to you.",
    "budget": "Approximate budget",
    "budgetGuidance": "If you have an investment range in mind, you can share it here."
  },
  "next": {
    "title": "What happens next",
    "body": "Our new client support team will review your details and contact you to discuss your project and the next step."
  },
  "submit": "Send project details",
  "privacyLabel": "Privacy notice",
  "success": "Thank you for sharing your project with MERES. We have received your details. Our new client support team will be in touch to discuss your project and the next step.",
  "error": "Your details could not be sent. Please try again."
} as const;

export const footer = {
  "name": "MERES",
  "place": "Seattle's Eastside",
  "philosophy": "Nothing meaningful happens by accident."
} as const;
