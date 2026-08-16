"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { projectsMeta, type ProjectSlug } from "@/data/projects";
import {
  MEDIA,
  adSrc,
  adSrcSet,
  clipSources,
  projectImgSrc,
  projectImgSrcSet,
} from "@/lib/media";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import CatalogViewer from "@/components/overlay/CatalogViewer";
import Lightbox from "@/components/overlay/Lightbox";
import Magnetic from "@/components/ui/Magnetic";

export default function ProjectOverlay({ slug }: { slug: string }) {
  const { dict, closeProject } = usePresentation();
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const closing = useRef(false);

  const meta = projectsMeta[slug as ProjectSlug];
  const copy = dict.projects[slug];
  const data = MEDIA.projects[slug];
  const images = data?.images ?? [];
  const clips = data?.clips ?? [];
  const catalog = data?.catalog;
  const cover = images[0];

  // Combined lightbox images: project gallery + floor plans
  const lightboxImages = [
    ...images.map((img) => ({ type: "project" as const, n: img.n, w: img.w, h: img.h })),
    ...MEDIA.floorPlans.map((plan) => ({ type: "floorplan" as const, n: plan.n, w: plan.w, h: plan.h, area: plan.area })),
  ];

  /* entry animation */
  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      gsap.fromTo(
        root.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.85,
          ease: "power4.out",
          // transform on the dialog would trap position:fixed children (lightbox)
          onComplete: () => gsap.set(root.current, { clearProps: "transform" }),
        },
      );
      gsap.fromTo(
        q("[data-ov]"),
        { y: 36, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, delay: 0.35, ease: "power3.out" },
      );
    },
    { scope: root, dependencies: [slug] },
  );

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !root.current) {
      closeProject();
      return;
    }
    gsap.to(root.current, {
      yPercent: 100,
      duration: 0.6,
      ease: "power4.in",
      onComplete: closeProject,
    });
  }, [closeProject]);

  /* esc + focus management */
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightbox === null) close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [close, lightbox]);

  if (!meta || !copy) return null;

  const anchors = [
    { id: "ov-gallery", label: dict.overlay.gallery, show: images.length > 0 },
    { id: "ov-catalog", label: dict.overlay.catalog, show: !!catalog },
    { id: "ov-floorplans", label: dict.overlay.floorPlansTab, show: MEDIA.floorPlans.length > 0 },
    { id: "ov-clips", label: dict.overlay.constructionTab, show: clips.length > 0 },
    { id: "ov-location", label: dict.overlay.locationStrip, show: meta.hasLocationStrip },
  ].filter((a) => a.show);

  const scrollToAnchor = (id: string) => {
    root.current
      ?.querySelector(`#${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={copy.name}
      className="fixed inset-0 z-[250] overflow-y-auto overscroll-contain bg-bg text-ink"
      data-lenis-prevent
    >
      {/* sticky header */}
      <div className="glass sticky top-0 z-30 flex items-center justify-between border-b border-line px-5 py-3.5 md:px-10">
        <div className="flex min-w-0 items-baseline gap-4">
          <span className="label-mono !text-copper">{meta.num}</span>
          <h2 className="truncate font-display text-xl leading-[1.45] md:text-3xl">{copy.name}</h2>
          {copy.location && (
            <span className="label-mono hidden md:inline">{copy.location}</span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <a
            href={`tel:${dict.ui.phone.replace(/\s/g, "")}`}
            data-cursor="link"
            className="hidden rounded-full border border-line px-4 py-2 font-mono text-[11px] tracking-wide transition-colors hover:border-copper hover:text-copper md:block"
          >
            {dict.ui.phone}
          </a>
          <button
            ref={closeBtn}
            type="button"
            aria-label={dict.ui.close}
            data-cursor="link"
            onClick={close}
            className="grid size-10 place-items-center rounded-full border border-line transition-all duration-300 hover:rotate-90 hover:border-copper hover:text-copper"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* hero */}
      {cover && (
        <div data-ov className="relative">
          <div className="relative max-h-[62vh] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={projectImgSrc(slug, cover.n, 1920)}
              srcSet={projectImgSrcSet(slug, cover.n)}
              sizes="100vw"
              alt={copy.name}
              draggable={false}
              className="w-full object-cover"
              style={{ aspectRatio: `${cover.w} / ${cover.h}`, maxHeight: "62vh" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-10">
              {/* white logo variant — always sits on the darkened photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={meta.logoDark}
                alt=""
                className="max-h-14 w-auto max-w-[240px] object-contain drop-shadow-lg md:max-h-20"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}

      <div className="px-5 py-10 md:px-10 md:py-14">
        {/* about + features */}
        <div data-ov className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <p className="label-mono mb-4">{dict.overlay.aboutLabel}</p>
            <p className="font-display text-xl leading-snug italic md:text-2xl">{copy.tagline}</p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-[15px]">
              {copy.description}
            </p>
          </div>
          <div>
            <p className="label-mono mb-4">{dict.overlay.featuresLabel}</p>
            <ul className="flex flex-wrap gap-2">
              {copy.features.map((f) => (
                <li
                  key={f}
                  className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-ink-soft uppercase"
                >
                  {f}
                </li>
              ))}
            </ul>
            {anchors.length > 1 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {anchors.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    data-cursor="link"
                    onClick={() => scrollToAnchor(a.id)}
                    className="rounded-full bg-copper-soft px-4 py-2 font-mono text-[10.5px] tracking-[0.12em] text-copper uppercase transition-colors hover:bg-copper hover:text-[#141210]"
                  >
                    {a.label} ↓
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* gallery */}
        {images.length > 1 && (
          <div id="ov-gallery" data-ov className="mt-16 scroll-mt-24 md:mt-20">
            <p className="label-mono mb-5">
              {dict.overlay.gallery} — {String(images.length).padStart(2, "0")}
            </p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
              {images.map((img, i) => (
                <button
                  key={img.n}
                  type="button"
                  data-cursor="link"
                  data-cursor-label={dict.ui.view}
                  onClick={() => setLightbox(i)}
                  className="group relative overflow-hidden bg-surface-2"
                  style={{ aspectRatio: "4 / 3" }}
                  aria-label={`${copy.name} — ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={projectImgSrc(slug, img.n, 640)}
                    srcSet={projectImgSrcSet(slug, img.n)}
                    sizes="(min-width:768px) 31vw, 47vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-copper/0 transition-colors duration-500 group-hover:bg-copper/15" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* catalog */}
        {catalog && (
          <div id="ov-catalog" data-ov className="mt-16 scroll-mt-24 md:mt-20">
            <p className="label-mono mb-5">{dict.overlay.catalog}</p>
            <CatalogViewer slug={slug} pages={catalog.pages} w={catalog.w} h={catalog.h} />
          </div>
        )}

        {/* floor plans */}
        {MEDIA.floorPlans.length > 0 && (
          <div id="ov-floorplans" data-ov className="mt-16 scroll-mt-24 md:mt-20">
            <p className="label-mono mb-5">{dict.overlay.floorPlansTab}</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {MEDIA.floorPlans.map((plan) => (
                <button
                  key={plan.n}
                  type="button"
                  onClick={() => {
                    const idx = images.length + MEDIA.floorPlans.findIndex((p) => p.n === plan.n);
                    setLightbox(idx);
                  }}
                  className="group relative overflow-hidden border border-line bg-surface-2 transition-all hover:border-copper"
                  style={{ aspectRatio: `${plan.w} / ${plan.h}` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/media/floorplans/${plan.n}_640.webp`}
                    srcSet={`/media/floorplans/${plan.n}_640.webp 640w, /media/floorplans/${plan.n}_1280.webp 1280w, /media/floorplans/${plan.n}_1920.webp 1920w`}
                    sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw"
                    alt={`${dict.overlay.floorPlansTab} ${plan.area} m²`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-2 left-2 right-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-mono text-xs font-semibold text-white">
                      {plan.area} m²
                    </p>
                    <p className="font-mono text-[10px] text-white/70">
                      {dict.overlay.areaLabel}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* construction clips */}
        {clips.length > 0 && (
          <div id="ov-clips" data-ov className="mt-16 scroll-mt-24 md:mt-20">
            <p className="label-mono mb-5">{dict.overlay.constructionTab}</p>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
              {clips.map((clip, idx) => {
                const src = clipSources(slug, clip.n);
                return (
                  <video
                    key={clip.n}
                    src={src.video}
                    poster={src.poster}
                    autoPlay
                    muted
                    loop
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full rounded-[12px] bg-black object-cover"
                    style={{ aspectRatio: `${clip.w} / ${clip.h}`, maxHeight: "70vh" }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* location development strip */}
        {meta.hasLocationStrip && MEDIA.ads.length > 0 && (
          <div id="ov-location" data-ov className="mt-16 scroll-mt-24 md:mt-20">
            <p className="label-mono mb-5">{dict.overlay.locationStrip}</p>
            <div className="grid gap-2 md:grid-cols-3 md:gap-3">
              {MEDIA.ads.map((ad) => (
                <div key={ad.n} className="overflow-hidden border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={adSrc(ad.n, 1280)}
                    srcSet={adSrcSet(ad.n)}
                    sizes="(min-width:768px) 31vw, 94vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="w-full object-cover"
                    style={{ aspectRatio: `${ad.w} / ${ad.h}` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          data-ov
          className="mt-16 flex flex-col items-start gap-6 border border-copper/40 bg-copper-soft p-8 md:mt-20 md:flex-row md:items-center md:justify-between md:p-12"
        >
          <div>
            <p className="font-display text-2xl leading-snug md:text-3xl">
              {dict.overlay.ctaTitle}
            </p>
            <p className="mt-2 max-w-md text-sm text-ink-soft">{dict.overlay.ctaBody}</p>
          </div>
          <Magnetic>
            <a
              href={`tel:${dict.ui.phone.replace(/\s/g, "")}`}
              data-cursor="link"
              className="flex items-center gap-3 rounded-full bg-copper px-7 py-4 font-mono text-sm tracking-wide text-[#141210] transition-transform duration-300 hover:scale-[1.03]"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z" />
              </svg>
              {dict.ui.phone}
            </a>
          </Magnetic>
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox
          slug={slug}
          images={lightboxImages}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
