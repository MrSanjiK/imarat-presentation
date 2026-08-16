"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { clipSources, projectClips } from "@/lib/media";
import { projectOrder, projectsMeta } from "@/data/projects";
import ChapterLabel from "@/components/ui/ChapterLabel";

export default function ConstructionClips() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  // Collect all clips from all projects
  const allClips = projectOrder.flatMap((slug) => {
    const clips = projectClips(slug);
    return clips.map((clip) => ({
      slug,
      projectName: dict.projects[slug]?.name || slug,
      clip,
    }));
  });

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

      {/* Horizontal scrollable carousel */}
      {allClips.length > 0 ? (
        <div data-reveal className="relative">
          <div
            ref={scrollRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:px-10"
          >
            {allClips.map(({ slug, projectName, clip }, index) => {
              const src = clipSources(slug, clip.n);
              return (
                <div
                  key={`${slug}-${clip.n}`}
                  className="group relative shrink-0 snap-center overflow-hidden rounded-[20px] border border-line bg-surface-2 shadow-lg transition-all duration-500 hover:border-copper hover:shadow-2xl"
                  style={{ width: "min(85vw, 480px)" }}
                >
                  <video
                    src={src.video}
                    poster={src.poster}
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
              );
            })}
          </div>

          {/* Scroll indicators */}
          <div className="mt-6 flex justify-center gap-2 px-5 md:px-10">
            {Array.from({ length: Math.min(allClips.length, 10) }).map((_, i) => (
              <div
                key={i}
                className="h-1 w-8 rounded-full bg-line transition-colors duration-300"
                style={{
                  backgroundColor: i === 0 ? "var(--copper)" : undefined,
                }}
              />
            ))}
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
