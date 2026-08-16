"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { projectOrder, projectsMeta } from "@/data/projects";
import { coverImage, projectImgSrc, projectImgSrcSet } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";
import RenderBackdrop, { RENDERS } from "@/components/ui/RenderBackdrop";

export default function Projects() {
  const { dict, openProject } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(0);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  return (
    <RenderBackdrop
      videoSrc={RENDERS.bristolSeq}
      posterSrc={RENDERS.bristolSeqPoster}
      className="py-0"
    >
      <section
        ref={root}
        id="projects"
        data-chapter="projects"
        className="relative"
      >
      <div className="px-5 pt-28 md:px-10 md:pt-40 lg:pr-24">
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

      <div className="grid lg:grid-cols-[0.95fr_1.05fr] lg:min-h-screen">
        {/* sticky preview — desktop only */}
        <div className="relative hidden lg:block">
          <div className="sticky top-0 flex h-screen items-center justify-center p-10 pl-10">
            <div className="relative aspect-[4/3] w-full max-w-[620px] overflow-hidden bg-surface-2">
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
                    className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform,clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: hovered === i ? 1 : 0,
                      transform: hovered === i ? "scale(1)" : "scale(1.06)",
                      clipPath: hovered === i ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                      zIndex: hovered === i ? 2 : 1,
                    }}
                  />
                );
              })}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-6 z-10 font-mono text-[11px] tracking-[0.2em] text-white/85 uppercase">
                {projectsMeta[projectOrder[hovered]].num} — {dict.projects[projectOrder[hovered]]?.name}
              </span>
            </div>
            <div className="pointer-events-none absolute right-14 bottom-14 -z-0 hidden xl:block">
              <span className="text-outline font-display text-[9rem] leading-none opacity-60">
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
                    className="group flex w-full items-center gap-3 py-5 text-left md:gap-7 md:py-7"
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
                      {/* no truncate/overflow here — it clips serif descenders (g, j) */}
                      <span className="block font-display text-[clamp(1.5rem,3.2vw,2.9rem)] leading-[1.15] transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-copper">
                        {copy?.name}
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted md:text-[13px]">
                        {copy?.tagline}
                      </span>
                    </span>
                    {copy?.location && (
                      <span className="label-mono hidden shrink-0 md:block">{copy.location}</span>
                    )}
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-copper group-hover:bg-copper-soft">
                      <svg
                        viewBox="0 0 24 24"
                        className="size-4 -rotate-45 text-ink transition-colors group-hover:text-copper"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
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
    </RenderBackdrop>
  );
}
