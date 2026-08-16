"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { MEDIA, excursionPhotoSrc, excursionPhotoSrcSet, excursionVideoSources } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";
import MediaViewer from "@/components/ui/MediaViewer";

export default function ClientExperience() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  const allMedia = [
    ...MEDIA.excursion.videos.map((v) => ({ type: "video" as const, data: v })),
    ...MEDIA.excursion.photos.map((p) => ({ type: "photo" as const, data: p })),
  ];

  useEffect(() => {
    screenRef.current?.play().catch(() => {});
  }, [activeIndex]);

  const goTo = (i: number) => {
    const next = (i + allMedia.length) % allMedia.length;
    setActiveIndex(next);
    const thumb = railRef.current?.children[next] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const active = allMedia[activeIndex];
  const activeSrc =
    active.type === "video" ? excursionVideoSources(active.data.n) : null;

  return (
    <section
      ref={root}
      id="client-experience"
      data-chapter="client-experience"
      className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <ChapterLabel index="11" className="mb-6">
              {dict.clientExperience.label}
            </ChapterLabel>
            <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
              {dict.clientExperience.title}
            </h2>
            <p data-reveal className="mt-4 max-w-xl text-sm text-ink-soft md:text-[15px]">
              {dict.clientExperience.sub}
            </p>
          </div>
          <div data-reveal className="flex flex-col items-end gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-outline font-display text-[clamp(4rem,9vw,8rem)] leading-none">
                {allMedia.length}
              </span>
              <span className="label-mono">{dict.clientExperience.counterLabel}</span>
            </div>
            <p className="font-hand -rotate-3 text-2xl text-copper md:text-3xl">
              {dict.clientExperience.handwritten}
            </p>
          </div>
        </div>

        {/* cinema stage — only the active item is mounted */}
        <div data-reveal className="relative">
          <div className="relative overflow-hidden rounded-[16px] bg-black shadow-2xl">
            <div className="relative aspect-video w-full">
              {active.type === "video" && activeSrc ? (
                <video
                  key={active.data.n}
                  ref={screenRef}
                  src={activeSrc.video}
                  poster={activeSrc.poster}
                  autoPlay
                  muted
                  loop
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={active.data.n}
                  src={excursionPhotoSrc(active.data.n, 1280)}
                  srcSet={excursionPhotoSrcSet(active.data.n)}
                  sizes="(min-width:1024px) 72rem, 92vw"
                  alt={`${dict.clientExperience.photoAlt} ${activeIndex + 1}`}
                  decoding="async"
                  draggable={false}
                  data-cursor="link"
                  data-cursor-label={dict.ui.view}
                  onClick={() => setViewerOpen(true)}
                  className="absolute inset-0 h-full w-full cursor-zoom-in object-contain"
                />
              )}
            </div>

            {/* fullscreen viewer trigger */}
            <button
              type="button"
              aria-label={dict.ui.view}
              data-cursor="link"
              onClick={() => setViewerOpen(true)}
              className="absolute top-5 right-5 grid size-11 place-items-center rounded-full border border-white/25 bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-copper hover:text-copper"
            >
              <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          {/* screen glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -bottom-8 h-24 rounded-[50%] bg-copper/10 blur-2xl"
          />
        </div>

        {/* controls */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label={dict.ui.prev}
            data-cursor="link"
            onClick={() => goTo(activeIndex - 1)}
            className="grid size-12 place-items-center rounded-full border border-line bg-surface transition-all duration-300 hover:scale-110 hover:border-copper hover:bg-copper-soft active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-copper tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="label-mono opacity-60">/ {String(allMedia.length).padStart(2, "0")}</span>
          </div>
          <button
            type="button"
            aria-label={dict.ui.next}
            data-cursor="link"
            onClick={() => goTo(activeIndex + 1)}
            className="grid size-12 place-items-center rounded-full border border-line bg-surface transition-all duration-300 hover:scale-110 hover:border-copper hover:bg-copper-soft active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* thumbnail rail */}
        <div
          ref={railRef}
          data-reveal
          className="mt-10 flex gap-3 overflow-x-auto py-1"
          style={{ scrollbarWidth: "thin" }}
        >
          {allMedia.map((item, i) => {
            const isActive = i === activeIndex;
            const thumbSrc =
              item.type === "video"
                ? excursionVideoSources(item.data.n).poster
                : excursionPhotoSrc(item.data.n, 640);
            return (
              <button
                key={`${item.type}-${item.data.n}`}
                type="button"
                data-cursor="link"
                onClick={() => goTo(i)}
                aria-label={`${dict.clientExperience.photoAlt} ${i + 1}`}
                aria-current={isActive}
                className={`relative aspect-video w-36 shrink-0 overflow-hidden rounded-[8px] bg-surface-2 transition-all duration-300 md:w-44 ${
                  isActive
                    ? "border-2 border-copper"
                    : "border border-line opacity-50 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbSrc}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                {item.type === "video" && (
                  <span className="pointer-events-none absolute inset-0 grid place-items-center">
                    <span className="grid size-7 place-items-center rounded-full bg-black/55 backdrop-blur-sm">
                      <svg viewBox="0 0 24 24" className="size-3.5 text-white" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p data-reveal className="label-mono mt-8 text-center opacity-60">
          {dict.clientExperience.hint}
        </p>
      </div>

      {viewerOpen && (
        <MediaViewer
          items={allMedia.map((item) =>
            item.type === "video"
              ? {
                  type: "video" as const,
                  src: excursionVideoSources(item.data.n).video,
                  poster: excursionVideoSources(item.data.n).poster,
                  aspectRatio: `${item.data.w} / ${item.data.h}`,
                }
              : {
                  type: "image" as const,
                  src: excursionPhotoSrc(item.data.n, 1920),
                  srcSet: excursionPhotoSrcSet(item.data.n),
                  alt: dict.clientExperience.photoAlt,
                },
          )}
          initialIndex={activeIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </section>
  );
}
