export interface ProjectMeta {
  slug: string;
  num: string;
  /** logo used on light backgrounds (dark-coloured artwork) */
  logoLight: string;
  /** logo used on dark backgrounds (white artwork) */
  logoDark: string;
  hasCatalog: boolean;
  hasClips: boolean;
  hasLocationStrip: boolean;
}

const L = "/media/logos/projects";

export const projectOrder = [
  "sergeli-city",
  "eco-park",
  "bristol",
  "yangi-bristol",
  "tuzel-park",
  "yangi-hayot",
  "imarat-hills",
  "chortoq",
  "chaman-village",
  "jayhun-avenue",
] as const;

export type ProjectSlug = (typeof projectOrder)[number];

export const projectsMeta: Record<ProjectSlug, ProjectMeta> = {
  "sergeli-city": {
    slug: "sergeli-city",
    num: "01",
    logoLight: `${L}/sergeli-city-light.webp`,
    logoDark: `${L}/sergeli-city-dark.webp`,
    hasCatalog: true,
    hasClips: true,
    hasLocationStrip: true,
  },
  "eco-park": {
    slug: "eco-park",
    num: "02",
    logoLight: `${L}/eco-park-light.webp`,
    logoDark: `${L}/eco-park-dark.webp`,
    hasCatalog: true,
    hasClips: false,
    hasLocationStrip: true,
  },
  bristol: {
    slug: "bristol",
    num: "03",
    logoLight: `${L}/bristol-light.webp`,
    logoDark: `${L}/bristol-dark.webp`,
    hasCatalog: true,
    hasClips: true,
    hasLocationStrip: false,
  },
  "yangi-bristol": {
    slug: "yangi-bristol",
    num: "04",
    logoLight: `${L}/yangi-bristol-light.webp`,
    logoDark: `${L}/yangi-bristol-dark.webp`,
    hasCatalog: false,
    hasClips: false,
    hasLocationStrip: false,
  },
  "tuzel-park": {
    slug: "tuzel-park",
    num: "05",
    logoLight: `${L}/tuzel-park-light.webp`,
    logoDark: `${L}/tuzel-park-dark.webp`,
    hasCatalog: true,
    hasClips: true,
    hasLocationStrip: false,
  },
  "yangi-hayot": {
    slug: "yangi-hayot",
    num: "06",
    logoLight: `${L}/yangi-hayot-light.webp`,
    logoDark: `${L}/yangi-hayot-dark.webp`,
    hasCatalog: true,
    hasClips: true,
    hasLocationStrip: false,
  },
  "imarat-hills": {
    slug: "imarat-hills",
    num: "07",
    logoLight: `${L}/imarat-hills-light.webp`,
    logoDark: `${L}/imarat-hills-dark.webp`,
    hasCatalog: true,
    hasClips: false,
    hasLocationStrip: false,
  },
  chortoq: {
    slug: "chortoq",
    num: "08",
    logoLight: `${L}/chortoq-light.webp`,
    logoDark: `${L}/chortoq-dark.webp`,
    hasCatalog: true,
    hasClips: false,
    hasLocationStrip: false,
  },
  "chaman-village": {
    slug: "chaman-village",
    num: "09",
    logoLight: `${L}/chaman-village-light.webp`,
    logoDark: `${L}/chaman-village-dark.webp`,
    hasCatalog: false,
    hasClips: false,
    hasLocationStrip: false,
  },
  "jayhun-avenue": {
    slug: "jayhun-avenue",
    num: "10",
    logoLight: `${L}/jayhun-avenue-light.webp`,
    logoDark: `${L}/jayhun-avenue-dark.webp`,
    hasCatalog: true,
    hasClips: false,
    hasLocationStrip: false,
  },
};

export interface ManifestImage {
  n: string;
  w: number;
  h: number;
}
export interface ManifestClip {
  n: string;
  w: number;
  h: number;
}
export interface ProjectManifest {
  images: ManifestImage[];
  clips: ManifestClip[];
  catalog?: { pages: number; w: number; h: number };
}
export interface MediaManifest {
  projects: Record<string, ProjectManifest>;
  people: Record<string, { w: number; h: number }>;
  ceo: { n: string; w: number; h: number }[];
  ads: { n: string; w: number; h: number }[];
  videos: Record<string, { w: number; h: number }>;
}

export function imgSrc(slug: string, n: string, size: 640 | 1280 | 1920 = 1280) {
  return `/media/projects/${slug}/${n}_${size}.webp`;
}

export function imgSrcSet(slug: string, n: string) {
  return `${imgSrc(slug, n, 640)} 640w, ${imgSrc(slug, n, 1280)} 1280w, ${imgSrc(slug, n, 1920)} 1920w`;
}

export function catalogPageSrc(slug: string, page: number) {
  return `/media/catalogs/${slug}/page-${String(page).padStart(3, "0")}.webp`;
}

export function clipSrc(slug: string, n: string) {
  return {
    video: `/media/projects/${slug}/${n}.mp4`,
    poster: `/media/projects/${slug}/${n}-poster.webp`,
  };
}
