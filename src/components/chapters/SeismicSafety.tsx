"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { VIDEOS } from "@/lib/media";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import ChapterLabel from "@/components/ui/ChapterLabel";

export default function SeismicSafety() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const videoRef = useAutoplayVideo();

  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set([q("[data-reveal]")], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.from(q("[data-reveal]"), {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="seismic-safety"
      data-chapter="seismic-safety"
      className="relative overflow-hidden bg-bg py-28 text-ink transition-colors duration-500 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <ChapterLabel index="03" className="mb-6 justify-center">
            {dict.seismic.label}
          </ChapterLabel>
          <h2 data-reveal className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] tracking-tight">
            {dict.seismic.title}
          </h2>
          <p data-reveal className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-[15px]">
            {dict.seismic.body1}
          </p>
        </div>

        {/* Main Content — vertical test footage shown uncropped */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-10">
          {/* Video Card */}
          <div data-reveal className="relative mx-auto w-full max-w-[420px] lg:mx-0">
            <div className="relative overflow-hidden rounded-[16px] bg-black shadow-2xl">
              <video
                ref={videoRef}
                className="w-full"
                style={{ aspectRatio: "608 / 1080" }}
                src={VIDEOS.seismicTest}
                poster={VIDEOS.seismicTestPoster}
                autoPlay
                muted
                loop
                controls
                playsInline
                preload="metadata"
              />

              {/* Floating certification badge */}
              <div className="pointer-events-none absolute top-5 right-5 flex items-center gap-2.5 rounded-full border border-copper/60 bg-black/70 px-4 py-2.5 backdrop-blur-xl">
                <svg viewBox="0 0 24 24" className="size-5 text-copper" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-copper">
                  {dict.seismic.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div data-reveal className="flex flex-col justify-between space-y-8 rounded-[16px] border border-line bg-surface p-8 md:p-10">
            {/* Description */}
            <div className="space-y-4 text-[15px] leading-relaxed text-ink-soft">
              <p>{dict.seismic.body2}</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group relative overflow-hidden rounded-[12px] border border-line bg-bg p-6 transition-colors duration-500 hover:border-copper">
                <div className="relative z-10">
                  <div className="font-display text-5xl font-medium text-copper">8-9</div>
                  <p className="label-mono mt-2 text-ink-soft">{dict.seismic.stat1}</p>
                </div>
                <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-copper/5 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
              </div>

              <div className="group relative overflow-hidden rounded-[12px] border border-line bg-bg p-6 transition-colors duration-500 hover:border-copper">
                <div className="relative z-10">
                  <div className="font-display text-5xl font-medium text-copper">100%</div>
                  <p className="label-mono mt-2 text-ink-soft">{dict.seismic.stat2}</p>
                </div>
                <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-copper/5 opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />
              </div>
            </div>

            {/* Partners panel */}
            <div className="rounded-[12px] border border-copper/30 bg-copper/5 p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="size-5 text-copper" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h3 className="font-display text-lg font-medium text-copper">
                  {dict.seismic.partnersTitle}
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm md:text-[15px]">
                  <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-copper" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{dict.seismic.partner1}</span>
                </li>
                <li className="flex items-start gap-3 text-sm md:text-[15px]">
                  <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-copper" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{dict.seismic.partner2}</span>
                </li>
                <li className="flex items-start gap-3 text-sm md:text-[15px]">
                  <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-copper" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{dict.seismic.partner3}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
