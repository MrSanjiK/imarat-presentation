"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { clipSources, projectClips } from "@/lib/media";
import { projectOrder, projectsMeta } from "@/data/projects";
import ChapterLabel from "@/components/ui/ChapterLabel";

const perforation: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(90deg, var(--line) 0 10px, transparent 10px 26px)",
};

export default function ConstructionClips() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  const allClips = projectOrder.flatMap((slug) => {
    const clips = projectClips(slug);
    return clips.map((clip) => ({
      slug,
      projectName: dict.projects[slug]?.name || slug,
      clip,
    }));
  });

  useEffect(() => {
    screenRef.current?.play().catch(() => {});
  }, [activeIndex]);

  if (allClips.length === 0) {
    return (
      <section
        ref={root}
        id="construction-clips"
        data-chapter="construction-clips"
        className="invert-band relative bg-bg py-28 text-ink md:py-40"
      >
        <p className="label-mono px-5 text-center opacity-60 md:px-10">
          {dict.constructionClips.empty}
        </p>
      </section>
    );
  }

  const goTo = (i: number) => {
    const next = (i + allClips.length) % allClips.length;
    setActiveIndex(next);
    const thumb = railRef.current?.children[next] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const active = allClips[activeIndex];
  const activeSrc = clipSources(active.slug, active.clip.n);

  return (
    <section
      ref={root}
      id="construction-clips"
      data-chapter="construction-clips"
      className="invert-band relative overflow-hidden bg-bg py-28 text-ink transition-colors duration-500 md:py-40"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <ChapterLabel index="11.2" className="mb-6">
              {dict.overlay.constructionTab}
            </ChapterLabel>
            <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
              {dict.constructionClips.title}
            </h2>
            <p data-reveal className="mt-4 max-w-xl text-sm text-ink-soft md:text-[15px]">
              {dict.constructionClips.sub}
            </p>
          </div>
          <div data-reveal className="flex items-baseline gap-3">
            <span className="text-outline font-display text-[clamp(4rem,9vw,8rem)] leading-none">
              {allClips.length}
            </span>
            <span className="label-mono">{dict.constructionClips.counterLabel}</span>
          </div>
        </div>

        {/* cinema screen — only the active clip is mounted */}
        <div data-reveal className="relative">
          <div className="relative overflow-hidden rounded-[16px] bg-black shadow-2xl">
            <div className="relative aspect-video w-full">
              <video
                key={`${active.slug}-${active.clip.n}`}
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
            </div>
            {/* marquee plate */}
            <div className="pointer-events-none absolute top-5 left-5 flex items-baseline gap-3 rounded-full bg-black/60 px-5 py-2.5 backdrop-blur-md">
              <span className="font-mono text-xs tracking-[0.2em] text-copper">
                {projectsMeta[active.slug].num}
              </span>
              <span className="video-text font-display text-base text-white md:text-lg">
                {active.projectName}
              </span>
            </div>
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
            <span className="label-mono opacity-60">/ {String(allClips.length).padStart(2, "0")}</span>
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

        {/* filmstrip */}
        <div data-reveal className="mt-10">
          <div aria-hidden className="mb-2 h-1.5 rounded-full opacity-70" style={perforation} />
          <div
            ref={railRef}
            className="flex gap-3 overflow-x-auto py-1"
            style={{ scrollbarWidth: "thin" }}
          >
            {allClips.map(({ slug, projectName, clip }, i) => {
              const src = clipSources(slug, clip.n);
              const isActive = i === activeIndex;
              return (
                <button
                  key={`${slug}-${clip.n}`}
                  type="button"
                  data-cursor="link"
                  onClick={() => goTo(i)}
                  aria-label={`${projectName} — ${i + 1}`}
                  aria-current={isActive}
                  className={`group relative aspect-video w-36 shrink-0 overflow-hidden rounded-[8px] bg-surface-2 transition-all duration-300 md:w-44 ${
                    isActive
                      ? "border-2 border-copper"
                      : "border border-line opacity-50 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src.poster}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 left-2 font-mono text-[9px] tracking-[0.14em] text-white/85 uppercase drop-shadow">
                    {projectsMeta[slug].num} {projectName}
                  </span>
                </button>
              );
            })}
          </div>
          <div aria-hidden className="mt-2 h-1.5 rounded-full opacity-70" style={perforation} />
        </div>

        <p data-reveal className="label-mono mt-8 text-center opacity-60">
          {dict.constructionClips.hint}
        </p>
      </div>
    </section>
  );
}
