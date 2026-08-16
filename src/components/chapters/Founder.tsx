"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { ceoSrc, ceoSrcSet } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";
import RotatingBadge from "@/components/ui/RotatingBadge";

export default function Founder() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduced) {
        gsap.fromTo(
          q("[data-sign-line] path"),
          { strokeDashoffset: 320 },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: { trigger: q("[data-sign-line]")[0], start: "top 85%", once: true },
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
      className="relative overflow-hidden bg-bg py-28 text-ink transition-colors duration-500 md:py-40"
    >
      <div className="grid items-center gap-14 px-5 md:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:pr-24">
        {/* portrait */}
        <div data-reveal className="relative mx-auto w-full max-w-[440px] lg:mx-0">
          <div className="relative aspect-[3/4.2] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-portrait
              src={ceoSrc("portrait-1", 1280)}
              srcSet={ceoSrcSet("portrait-1")}
              sizes="(min-width:1024px) 36vw, 90vw"
              alt={dict.ceo.name}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover object-top grayscale-[0.35] transition-[filter] duration-700 hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 border border-line-strong" />
          </div>
          <div className="absolute -inset-3 -z-10 border border-copper/35" aria-hidden />
          <RotatingBadge
            text="IMARAT DEVELOPMENT • EST 2021 • "
            className="absolute -right-3 -bottom-6 size-20 text-copper md:-right-10 md:-bottom-10 md:size-28"
          />
        </div>

        {/* copy */}
        <div>
          <ChapterLabel index="09" className="mb-8">
            {dict.ceo.label}
          </ChapterLabel>

          <h2 data-reveal className="font-display text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.08]">
            {dict.ceo.name}
          </h2>
          <p data-reveal className="label-mono mt-3 !text-copper">
            {dict.ceo.role}
          </p>

          <blockquote data-reveal className="relative mt-10 max-w-2xl">
            <span
              className="absolute -top-8 -left-2 font-display text-7xl text-copper/50 select-none"
              aria-hidden
            >
              “
            </span>
            <p className="font-display text-lg leading-relaxed italic md:text-2xl">
              {dict.ceo.quote}
            </p>
            <footer className="mt-6">
              <div className="relative inline-block">
                <span className="font-hand text-3xl text-copper md:text-4xl">{dict.ceo.sign}</span>
                <svg
                  data-sign-line
                  className="absolute -bottom-2 left-0 w-full text-copper/60"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 8 C80 2, 190 11, 298 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray="320"
                    strokeDashoffset="320"
                  />
                </svg>
              </div>
              <p className="font-hand mt-4 rotate-[-2deg] text-xl text-ink-soft md:text-2xl">
                „{dict.ceo.creed}“
              </p>
            </footer>
          </blockquote>

          <div data-reveal className="mt-10 flex gap-8 border-t border-line pt-7 md:mt-12 md:gap-12 md:pt-8">
            {dict.ceo.facts.map((f) => (
              <div key={f.label}>
                <p className="font-display text-4xl text-copper md:text-5xl">{f.value}</p>
                <p className="label-mono mt-2 max-w-[160px]">{f.label}</p>
              </div>
            ))}
          </div>

          <ul data-reveal className="mt-9 space-y-2.5">
            {dict.ceo.titles.map((t) => (
              <li key={t} className="flex items-baseline gap-3 text-sm text-ink-soft md:text-[15px]">
                <span className="font-display text-copper italic">/</span>
                {t}
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-9">
            <p className="label-mono mb-2">{dict.ceo.brandsLabel}</p>
            <p className="font-mono text-xs leading-relaxed text-muted">{dict.ceo.brands}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
