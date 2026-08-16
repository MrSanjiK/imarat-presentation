"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { projectOrder, projectsMeta } from "@/data/projects";
import { coverImage, projectImgSrc, projectImgSrcSet, RENDERS } from "@/lib/media";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import ChapterLabel from "@/components/ui/ChapterLabel";

export default function Projects() {
  const { dict, openProject } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(0);
  const videoRef = useAutoplayVideo();

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="projects" data-chapter="projects" className="relative">
      {/* render-video backdrop — absolute layer, NOT a wrapper: keeps sticky alive */}
      <div className="absolute inset-0" aria-hidden>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={RENDERS.bristolSeq}
          poster={RENDERS.bristolSeqPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-bg/[0.93]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </div>

      <div className="relative px-5 pt-28 md:px-10 md:pt-40 lg:pr-24">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-6 md:mb-10">
          <div>
            <ChapterLabel index="05" className="mb-6">
              {dict.projectsChapter.label}
            </ChapterLabel>
            <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
              {dict.projectsChapter.title}
            </h2>
            <p data-reveal className="mt-4 max-w-xl text-sm text-ink-soft md:text-[15px]">
              {dict.projectsChapter.sub}
            </p>
          </div>
          <div data-reveal className="flex items-baseline gap-3">
            <span className="text-outline font-display text-[clamp(4rem,9vw,8rem)] leading-none">
              10
            </span>
            <span className="label-mono">{dict.projectsChapter.counterLabel}</span>
          </div>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-[0.95fr_1.05fr]">
        {/* sticky preview — desktop only. No transform/overflow ancestors above this. */}
        <div className="relative hidden lg:block">
          <div className="sticky top-20 flex min-h-[80vh] items-center justify-center p-10">
            <div className="relative aspect-[4/3] w-full max-w-[620px] overflow-hidden rounded-[16px] bg-surface-2 shadow-2xl">
              {projectOrder.map((slug, i) => {
                const cover = coverImage(slug);
                if (!cover) return null;
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={slug}
                    src={projectImgSrc(slug, cover.n, 1280)}
                    srcSet={projectImgSrcSet(slug, cover.n)}
                    sizes="(min-width:1024px) 45vw, 90vw"
                    alt={dict.projects[slug]?.name ?? slug}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: hovered === i ? 1 : 0,
                      transform: hovered === i ? "scale(1)" : "scale(1.05)",
                      zIndex: hovered === i ? 2 : 1,
                    }}
                  />
                );
              })}
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-6 left-6 z-20 font-mono text-xs font-medium tracking-[0.2em] text-white/95 uppercase drop-shadow-lg">
                {projectsMeta[projectOrder[hovered]].num} — {dict.projects[projectOrder[hovered]]?.name}
              </span>
            </div>
            <div className="pointer-events-none absolute right-14 bottom-14 hidden xl:block">
              <span className="text-outline font-display text-[9rem] leading-none opacity-50">
                {projectsMeta[projectOrder[hovered]].num}
              </span>
            </div>
          </div>
        </div>

        {/* index list */}
        {/* min-w-0: grid items refuse to shrink below the nowrap tagline otherwise */}
        <div className="min-w-0 px-5 pt-6 pb-28 md:px-10 lg:pt-10 lg:pr-20 lg:pl-0">
          <ul className="border-t border-line">
            {projectOrder.map((slug, i) => {
              const meta = projectsMeta[slug];
              const copy = dict.projects[slug];
              const cover = coverImage(slug);
              return (
                <li key={slug} data-reveal className="border-b border-line">
                  <button
                    type="button"
                    data-cursor="link"
                    data-cursor-label={dict.ui.view}
                    onClick={() => openProject(slug)}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    aria-label={`${copy?.name} — ${dict.ui.openProject}`}
                    className="group flex w-full items-center gap-3 py-6 text-left md:gap-7 md:py-8"
                  >
                    {/* mobile thumb */}
                    {cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={projectImgSrc(slug, cover.n, 640)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-12 w-16 shrink-0 rounded-[8px] object-cover lg:hidden"
                      />
                    )}
                    <span className="label-mono w-8 shrink-0 !text-copper">{meta.num}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[clamp(1.6rem,3.5vw,3rem)] leading-[1.2] font-medium transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-copper">
                        {copy?.name}
                      </span>
                      <span className="mt-1.5 block truncate text-[13px] leading-relaxed text-muted md:text-sm">
                        {copy?.tagline}
                      </span>
                    </span>
                    {copy?.location && (
                      <span className="label-mono hidden shrink-0 md:block">{copy.location}</span>
                    )}
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface transition-all duration-500 group-hover:rotate-45 group-hover:border-copper group-hover:bg-copper-soft">
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4 -rotate-45 text-ink transition-colors group-hover:text-copper"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p data-reveal className="label-mono mt-6 opacity-60">
            {dict.projectsChapter.hint}
          </p>
        </div>
      </div>
    </section>
  );
}
