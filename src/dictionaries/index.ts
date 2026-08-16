export type Locale = "uz" | "ru" | "en" | "ar" | "zh";

export interface ProjectCopy {
  name: string;
  tagline: string;
  description: string;
  location?: string;
  features: string[];
}

export interface Dict {
  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };
  ui: {
    call: string;
    phone: string;
    view: string;
    close: string;
    back: string;
    next: string;
    prev: string;
    scrollHint: string;
    chapterWord: string;
    themeLight: string;
    themeDark: string;
    langLabel: string;
    openProject: string;
    watchVideo: string;
    page: string;
    keyboardHint: string;
  };
  chapters: { id: string; title: string }[];
  hero: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    handwritten: string;
    sub: string;
    marquee: string[];
    est: string;
  };
  manifesto: {
    label: string;
    statement: string;
    body1: string;
    body2: string;
    badge: string;
  };
  seismic: {
    label: string;
    badge: string;
    title: string;
    body1: string;
    body2: string;
    stat1: string;
    stat2: string;
    partnersTitle: string;
    partner1: string;
    partner2: string;
    partner3: string;
  };
  stats: {
    label: string;
    title: string;
    handwritten: string;
    items: { value: number; suffix: string; label: string; decimals?: number }[];
  };
  projectsChapter: {
    label: string;
    title: string;
    sub: string;
    hint: string;
    counterLabel: string;
  };
  overlay: {
    gallery: string;
    catalog: string;
    constructionTab: string;
    floorPlansTab: string;
    locationStrip: string;
    featuresLabel: string;
    aboutLabel: string;
    ctaTitle: string;
    ctaBody: string;
    catalogHint: string;
    pageOf: string;
    areaLabel: string;
  };
  process: {
    label: string;
    titleA: string;
    titleB: string;
    body: string;
    chips: string[];
  };
  advantages: {
    label: string;
    title: string;
    handwritten: string;
    cards: { title: string; body: string }[];
    amenitiesLabel: string;
    amenities: string[];
    offersLabel: string;
    offers: string[];
  };
  ceo: {
    label: string;
    name: string;
    role: string;
    quote: string;
    sign: string;
    creed: string;
    facts: { value: string; label: string }[];
    brandsLabel: string;
    brands: string;
    titles: string[];
  };
  ambassadors: {
    label: string;
    title: string;
    sub: string;
    founderBadge: string;
    people: { id: string; name: string; role: string }[];
  };
  clientExperience: {
    label: string;
    title: string;
    sub: string;
    handwritten: string;
    photoAlt: string;
    hint: string;
  };
  floorPlans: {
    title: string;
    sub: string;
    counterLabel: string;
    viewLabel: string;
    hint: string;
  };
  constructionClips: {
    title: string;
    sub: string;
    counterLabel: string;
    hint: string;
    empty: string;
  };
  projectsInfo: {
    label: string;
    title: string;
    sub: string;
    projectCol: string;
    landCol: string;
    totalCol: string;
    blocksCol: string;
    startedCol: string;
    builtCol: string;
    haUnit: string;
    m2Unit: string;
    note: string;
  };
  contact: {
    label: string;
    title: string;
    handwritten: string;
    phoneLabel: string;
    addressLabel: string;
    address: string;
    mapsLabel: string;
    socialsLabel: string;
    officesNote: string;
    coords: string;
    socials: { id: string; name: string; handle: string; href: string }[];
    maps: { id: string; name: string; href: string }[];
  };
  footer: {
    tagline: string;
    rights: string;
    backTop: string;
    madeFor: string;
  };
  projects: Record<string, ProjectCopy>;
}

export const locales: Locale[] = ["uz", "ru", "en", "ar", "zh"];

export const localeNames: Record<Locale, string> = {
  uz: "O'z",
  ru: "Ру",
  en: "En",
  ar: "Ar",
  zh: "中",
};

export const localePaths: Record<Locale, string> = {
  uz: "/",
  ru: "/ru",
  en: "/en",
  ar: "/ar",
  zh: "/zh",
};
