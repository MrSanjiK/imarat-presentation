"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { ceoSrc, ceoSrcSet, RENDERS } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";
import RotatingBadge from "@/components/ui/RotatingBadge";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";

export default function Founder() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const videoRef = useAutoplayVideo();

  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduced) {
        /* signature flourish draws itself when the quote enters */
        gsap.fromTo(
          q("[data-sign-line]"),
          { strokeDashoffset: 420 },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: { trigger: q("[data-sign]")[0], start: "top 85%" },
          },
        );

        /* portrait parallax inside its frame */
        gsap.fromTo(
          q("[data-portrait]"),
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 6,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      setupReveals(root.current);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="founder"
      data-chapter="founder"
      className="relative overflow-x-clip bg-surface py-28 text-ink transition-colors duration-500 md:py-40"
    >
      {/* render video backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-20"
          src={RENDERS.ecoPark2}
          poster={RENDERS.ecoPark2Poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/95 via-surface/85 to-surface/95" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <ChapterLabel index="09" className="mb-12 md:mb-16">
          {dict.ceo.label}
        </ChapterLabel>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          {/* portrait — pinned while the right column scrolls */}
          <figure data-reveal className="relative lg:sticky lg:top-20 lg:self-start">
            <div
              className="relative w-full overflow-hidden rounded-[16px] bg-surface-2 shadow-2xl"
              style={{ aspectRatio: "1080 / 908" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-portrait
                src={ceoSrc("founder", 1280)}
                srcSet={ceoSrcSet("founder")}
                sizes="(min-width:1024px) 45vw, 92vw"
                alt={dict.ceo.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover will-change-transform"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-6 z-10">
                <p className="video-text font-display text-xl text-white md:text-2xl">
                  {dict.ceo.name}
                </p>
                <p className="video-text mt-1 font-mono text-[10px] tracking-[0.22em] text-white/75 uppercase">
                  {dict.ceo.role}
                </p>
              </figcaption>
            </div>
            <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[20px] border border-copper/35" />
            <RotatingBadge
              text={`${dict.ceo.creed} • IMARAT DEVELOPMENT • `}
              className="absolute -top-12 -right-10 hidden size-28 text-copper md:block"
            />
          </figure>

          {/* voice */}
          <div className="min-w-0">
            <blockquote data-reveal className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-10 -left-3 font-display text-[7rem] leading-none text-copper/20 select-none md:-top-14 md:text-[9.5rem]"
              >
                “
              </span>
              <p className="relative font-display text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[1.3]">
                {dict.ceo.quote}
              </p>
            </blockquote>

            {/* signature */}
            <div data-sign data-reveal className="relative mt-8 inline-block">
              <span className="font-hand text-4xl text-copper md:text-5xl">{dict.ceo.sign}</span>
              <svg
                aria-hidden
                className="absolute -bottom-4 left-0 w-full text-copper/60"
                viewBox="0 0 400 18"
                fill="none"
              >
                <path
                  data-sign-line
                  d="M6 12 C90 4, 180 16, 260 8 S 380 10, 394 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="420"
                  strokeDashoffset="420"
                />
              </svg>
            </div>

            {/* facts */}
            <div data-reveal className="mt-12 grid grid-cols-2 gap-8 border-t border-line pt-8">
              {dict.ceo.facts.map((f) => (
                <div key={f.label}>
                  <p className="font-display text-5xl text-copper md:text-6xl">{f.value}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft md:text-sm">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>

            {/* titles */}
            <ul data-reveal className="mt-10 border-t border-line">
              {dict.ceo.titles.map((t) => (
                <li
                  key={t}
                  className="flex items-baseline gap-4 border-b border-line py-3.5 text-sm text-ink-soft md:text-[15px]"
                >
                  <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-copper" />
                  {t}
                </li>
              ))}
            </ul>

            {/* brands */}
            <div data-reveal className="mt-10">
              <p className="label-mono">{dict.ceo.brandsLabel}</p>
              <p className="mt-3 font-mono text-[12px] leading-loose tracking-[0.06em] text-ink-soft">
                {dict.ceo.brands}
              </p>
            </div>

            <p data-reveal className="mt-10 font-hand -rotate-2 text-2xl text-copper md:text-3xl">
              — {dict.ceo.creed}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
