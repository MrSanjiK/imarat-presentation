"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { MEDIA, excursionPhotoSrc, excursionPhotoSrcSet, excursionVideoSources } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";

export default function ClientExperience() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  const videos = MEDIA.excursion.videos;
  const photos = MEDIA.excursion.photos;

  return (
    <section
      ref={root}
      id="client-experience"
      data-chapter="client-experience"
      className="relative px-5 py-28 md:px-10 md:py-40 lg:pr-24"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <ChapterLabel index="08" className="mb-6">
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

      {/* Masonry-style grid: videos + photos mixed */}
      <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {/* Videos */}
        {videos.map((video, i) => {
          const src = excursionVideoSources(video.n);
          return (
            <div
              key={video.n}
              data-reveal
              className="mb-3 break-inside-avoid overflow-hidden border border-line bg-surface-2"
            >
              <video
                src={src.video}
                poster={src.poster}
                controls
                playsInline
                preload="none"
                className="w-full object-cover"
                style={{ aspectRatio: `${video.w} / ${video.h}` }}
              />
            </div>
          );
        })}

        {/* Photos */}
        {photos.map((photo, i) => (
          <div
            key={photo.n}
            data-reveal
            className="group mb-3 break-inside-avoid overflow-hidden border border-line bg-surface-2 transition-all hover:border-copper"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={excursionPhotoSrc(photo.n, 640)}
              srcSet={excursionPhotoSrcSet(photo.n)}
              sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw"
              alt={`${dict.clientExperience.photoAlt} ${i + 1}`}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
            />
          </div>
        ))}
      </div>

      <p data-reveal className="label-mono mt-10 text-center opacity-60">
        {dict.clientExperience.hint}
      </p>
    </section>
  );
}
