"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { clipSources, projectClips } from "@/lib/media";
import { projectOrder, projectsMeta } from "@/data/projects";
import ChapterLabel from "@/components/ui/ChapterLabel";

export default function ConstructionClips() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  // Auto-play videos when they become active
  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      activeVideo.play().catch(() => {
        // Autoplay blocked
      });
    }
  }, [activeIndex]);

  // Collect all clips from all projects
  const allClips = projectOrder.flatMap((slug) => {
    const clips = projectClips(slug);
    return clips.map((clip) => ({
      slug,
      projectName: dict.projects[slug]?.name || slug,
      clip,
    }));
  });

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % allClips.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + allClips.length) % allClips.length);
  };

  return (
    <section
      ref={root}
      id="construction-clips"
      data-chapter="construction-clips"
      className="relative py-28 md:py-40"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 px-5 md:mb-20 md:px-10">
        <div>
          <ChapterLabel index="11" className="mb-6">
            {dict.overlay.constructionTab}
          </ChapterLabel>
          <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
            {dict.constructionClips?.title || "Qurilish jarayoni"}
          </h2>
          <p data-reveal className="mt-4 max-w-xl text-sm text-ink-soft md:text-[15px]">
            {dict.constructionClips?.sub || "Loyihalarimizning qurilish jarayonini videolar orqali kuzating"}
          </p>
        </div>
        <div data-reveal className="flex items-baseline gap-3">
          <span className="text-outline font-display text-[clamp(4rem,9vw,8rem)] leading-none">
            {allClips.length}
          </span>
          <span className="label-mono">{dict.constructionClips?.counterLabel || "Videolar"}</span>
        </div>
      </div>

      {/* iOS-style stack */}
      {allClips.length > 0 ? (
        <div data-reveal className="relative mx-auto max-w-5xl px-5 md:px-10">
          <div className="relative" style={{ perspective: "2000px" }}>
            {allClips.map(({ slug, projectName, clip }, index) => {
              const offset = index - activeIndex;
              const isActive = index === activeIndex;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              const zIndex = allClips.length - Math.abs(offset);
              const scale = isActive ? 1 : 1 - Math.abs(offset) * 0.15;
              const translateY = Math.abs(offset) * (offset > 0 ? 30 : -30);
              const opacity = isActive ? 1 : 0.65;
              const rotateX = offset * 3;
              const src = clipSources(slug, clip.n);

              return (
                <div
                  key={`${slug}-${clip.n}`}
                  className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    zIndex,
                    transform: `scale(${scale}) translateY(${translateY}px) rotateX(${rotateX}deg)`,
                    opacity,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <div className="overflow-hidden rounded-[20px] border border-line bg-surface-2 shadow-2xl">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={src.video}
                      poster={src.poster}
                      autoPlay
                      muted
                      loop
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full object-cover"
                      style={{ aspectRatio: `${clip.w} / ${clip.h}` }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5">
                      <p className="font-display text-lg text-white md:text-xl">{projectName}</p>
                      <p className="label-mono mt-1 text-white/70">{projectsMeta[slug].num}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Spacer */}
            <div style={{ paddingTop: "75%" }} />
          </div>

          {/* Navigation controls */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label={dict.ui.prev}
              data-cursor="link"
              onClick={handlePrev}
              className="grid size-14 place-items-center rounded-full border border-line bg-surface transition-all hover:border-copper hover:scale-110 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl tabular-nums text-copper">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="label-mono opacity-60">
                / {String(allClips.length).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              aria-label={dict.ui.next}
              data-cursor="link"
              onClick={handleNext}
              className="grid size-14 place-items-center rounded-full border border-line bg-surface transition-all hover:border-copper hover:scale-110 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <p data-reveal className="label-mono px-5 text-center opacity-60 md:px-10">
          {dict.constructionClips?.empty || "Videolar tez orada qo'shiladi"}
        </p>
      )}

      <p data-reveal className="label-mono mt-10 px-5 text-center opacity-60 md:px-10">
        {dict.constructionClips?.hint || "Qurilish videolarini tomosha qiling"}
      </p>
    </section>
  );
}
