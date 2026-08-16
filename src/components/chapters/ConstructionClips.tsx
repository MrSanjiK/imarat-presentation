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
      className="relative px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
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

      {/* Video grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allClips.map(({ slug, projectName, clip }, index) => {
          const src = clipSources(slug, clip.n);
          return (
            <div
              key={`${slug}-${clip.n}`}
              data-reveal
              className="group relative overflow-hidden rounded-[16px] border border-line bg-surface-2 transition-all duration-500 hover:border-copper hover:shadow-2xl"
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
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="label-mono text-white/90">{projectName}</p>
                <p className="mt-0.5 text-xs text-white/70">{projectsMeta[slug].num}</p>
              </div>
            </div>
          );
        })}
      </div>

      {allClips.length === 0 && (
        <p data-reveal className="label-mono text-center opacity-60">
          {dict.constructionClips?.empty || "Videolar tez orada qo'shiladi"}
        </p>
      )}

      <p data-reveal className="label-mono mt-10 text-center opacity-60">
        {dict.constructionClips?.hint || "Qurilish videolarini tomosha qiling"}
      </p>
    </section>
  );
}
