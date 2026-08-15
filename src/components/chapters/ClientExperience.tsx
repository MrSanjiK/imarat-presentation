"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { MEDIA, excursionPhotoSrc, excursionPhotoSrcSet, excursionVideoSources } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";

export default function ClientExperience() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  const videos = MEDIA.excursion.videos;
  const photos = MEDIA.excursion.photos;
  const allMedia = [
    ...videos.map((v) => ({ type: "video" as const, data: v })),
    ...photos.map((p) => ({ type: "photo" as const, data: p })),
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % allMedia.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  return (
    <section
      ref={root}
      id="client-experience"
      data-chapter="client-experience"
      className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <ChapterLabel index="09" className="mb-6">
            {dict.clientExperience.label}
          </ChapterLabel>
          <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
            {dict.clientExperience.title}
          </h2>
          <p data-reveal className="mt-4 max-w-xl text-sm text-ink-soft md:text-[15px]">
            {dict.clientExperience.sub}
          </p>
        </div>
        <p data-reveal className="font-hand -rotate-3 text-2xl text-copper md:text-3xl">
          {dict.clientExperience.handwritten}
        </p>
      </div>

      {/* Apple-style stack gallery */}
      <div data-reveal className="relative mx-auto max-w-5xl">
        {/* Stack container */}
        <div className="relative" style={{ perspective: "2000px" }}>
          {allMedia.map((item, index) => {
            const offset = index - activeIndex;
            const isActive = index === activeIndex;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            const zIndex = allMedia.length - Math.abs(offset);
            const scale = isActive ? 1 : 1 - Math.abs(offset) * 0.05;
            const translateY = Math.abs(offset) * (offset > 0 ? 20 : -20);
            const opacity = isActive ? 1 : 0.4;
            const rotateX = offset * 2;

            return (
              <div
                key={`${item.type}-${item.data.n}`}
                className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  zIndex,
                  transform: `scale(${scale}) translateY(${translateY}px) rotateX(${rotateX}deg)`,
                  opacity,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div className="overflow-hidden rounded-[20px] border border-line bg-surface-2 shadow-2xl">
                  {item.type === "video" ? (
                    <video
                      src={excursionVideoSources(item.data.n).video}
                      poster={excursionVideoSources(item.data.n).poster}
                      controls
                      playsInline
                      preload="none"
                      className="w-full object-cover"
                      style={{ aspectRatio: `${item.data.w} / ${item.data.h}` }}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={excursionPhotoSrc(item.data.n, 1280)}
                      srcSet={excursionPhotoSrcSet(item.data.n)}
                      sizes="(min-width:1024px) 60vw, 90vw"
                      alt={`${dict.clientExperience.photoAlt} ${index + 1}`}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                      className="w-full object-cover"
                      style={{ aspectRatio: `${item.data.w} / ${item.data.h}` }}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Spacer for stack height */}
          <div style={{ paddingTop: "75%" }} />
        </div>

        {/* Navigation controls */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label={dict.ui.prev}
            data-cursor="link"
            onClick={handlePrev}
            className="grid size-12 place-items-center rounded-full border border-line bg-surface transition-all duration-300 hover:border-copper hover:bg-copper-soft hover:scale-110 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-muted tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-muted">/</span>
            <span className="font-mono text-sm text-muted tabular-nums">
              {String(allMedia.length).padStart(2, "0")}
            </span>
          </div>

          <button
            type="button"
            aria-label={dict.ui.next}
            data-cursor="link"
            onClick={handleNext}
            className="grid size-12 place-items-center rounded-full border border-line bg-surface transition-all duration-300 hover:border-copper hover:bg-copper-soft hover:scale-110 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="label-mono mt-6 text-center opacity-60">
          {dict.clientExperience.hint}
        </p>
      </div>
    </section>
  );
}
