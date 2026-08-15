import manifestJson from "@/data/media-manifest.json";
import type { MediaManifest } from "@/data/projects";

export const MEDIA = manifestJson as unknown as MediaManifest;

export function projectImages(slug: string) {
  return MEDIA.projects[slug]?.images ?? [];
}

export function projectClips(slug: string) {
  return MEDIA.projects[slug]?.clips ?? [];
}

export function projectCatalog(slug: string) {
  return MEDIA.projects[slug]?.catalog;
}

export function coverImage(slug: string) {
  const imgs = projectImages(slug);
  return imgs[0];
}

export function projectImgSrc(slug: string, n: string, size: 640 | 1280 | 1920 = 1280) {
  return `/media/projects/${slug}/${n}_${size}.webp`;
}

export function projectImgSrcSet(slug: string, n: string) {
  return [640, 1280, 1920]
    .map((s) => `/media/projects/${slug}/${n}_${s}.webp ${s}w`)
    .join(", ");
}

export function personSrc(id: string, size: 320 | 640 = 640) {
  return `/media/people/${id}_${size}.webp`;
}

export function personSrcSet(id: string) {
  return `/media/people/${id}_320.webp 320w, /media/people/${id}_640.webp 640w`;
}

export function ceoSrc(n: string, size: 640 | 1280 = 1280) {
  return `/media/ceo/${n}_${size}.webp`;
}

export function ceoSrcSet(n: string) {
  return `/media/ceo/${n}_640.webp 640w, /media/ceo/${n}_1280.webp 1280w`;
}

export function adSrc(n: string, size: 640 | 1280 = 1280) {
  return `/media/ads/${n}_${size}.webp`;
}

export function adSrcSet(n: string) {
  return `/media/ads/${n}_640.webp 640w, /media/ads/${n}_1280.webp 1280w`;
}

export function catalogPageSrc(slug: string, page: number) {
  return `/media/catalogs/${slug}/page-${String(page).padStart(3, "0")}.webp`;
}

export function clipSources(slug: string, n: string) {
  return {
    video: `/media/projects/${slug}/${n}.mp4`,
    poster: `/media/projects/${slug}/${n}-poster.webp`,
  };
}

export const VIDEOS = {
  heroDesktop: "/media/videos/hero-desktop.mp4",
  heroDesktopPoster: "/media/videos/hero-desktop-poster.webp",
  heroMobile: "/media/videos/hero-mobile.mp4",
  heroMobilePoster: "/media/videos/hero-mobile-poster.webp",
  processDesktop: "/media/videos/process-desktop.mp4",
  processDesktopPoster: "/media/videos/process-desktop-poster.webp",
  processMobile: "/media/videos/process-mobile.mp4",
  processMobilePoster: "/media/videos/process-mobile-poster.webp",
  drone: "/media/videos/drone.mp4",
  dronePoster: "/media/videos/drone-poster.webp",
  seismicTest: "/media/videos/seismic-test.mp4",
  seismicTestPoster: "/media/videos/seismic-test-poster.webp",
  marketingReel: "/media/videos/marketing-reel.mp4",
  marketingReelPoster: "/media/videos/marketing-reel-poster.webp",
};

export const RENDERS = {
  bristolSeq: "/media/renders/bristol-seq.mp4",
  bristolSeqPoster: "/media/renders/bristol-seq-poster.webp",
  bristolMain: "/media/renders/bristol-main.mp4",
  bristolMainPoster: "/media/renders/bristol-main-poster.webp",
  ecoPark1: "/media/renders/eco-park-1.mp4",
  ecoPark1Poster: "/media/renders/eco-park-1-poster.webp",
  ecoPark2: "/media/renders/eco-park-2.mp4",
  ecoPark2Poster: "/media/renders/eco-park-2-poster.webp",
  ecoPark3: "/media/renders/eco-park-3.mp4",
  ecoPark3Poster: "/media/renders/eco-park-3-poster.webp",
};

export const LOGOS = {
  gold: "/media/logos/imarat-gold.webp",
  white: "/media/logos/imarat-white.webp",
  dark: "/media/logos/imarat-dark.webp",
};

export function floorPlanSrc(n: string, size: 640 | 1280 | 1920 = 1280): string {
  return `/media/floorplans/${n}_${size}.webp`;
}

export function floorPlanSrcSet(n: string): string {
  return `${floorPlanSrc(n, 640)} 640w, ${floorPlanSrc(n, 1280)} 1280w, ${floorPlanSrc(n, 1920)} 1920w`;
}

export function excursionVideoSources(n: string) {
  return {
    video: `/media/excursion/${n}.mp4`,
    poster: `/media/excursion/${n}-poster.webp`,
  };
}

export function excursionPhotoSrc(n: string, size: 640 | 1280 | 1920 = 1280): string {
  return `/media/excursion/${n}_${size}.webp`;
}

export function excursionPhotoSrcSet(n: string): string {
  return `${excursionPhotoSrc(n, 640)} 640w, ${excursionPhotoSrc(n, 1280)} 1280w, ${excursionPhotoSrc(n, 1920)} 1920w`;
}
