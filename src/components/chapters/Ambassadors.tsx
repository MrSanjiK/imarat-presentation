"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { personSrc, personSrcSet, ceoSrc, ceoSrcSet } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";

function PersonCircle({
  id,
  name,
  role,
  size,
  position,
  badge,
}: {
  id: string;
  name: string;
  role: string;
  size: number;
  position: { left: string; top: string };
  badge?: string;
}) {
  return (
    <figure
      className="group absolute flex flex-col items-center text-center transition-transform duration-700 hover:scale-105"
      style={{ left: position.left, top: position.top }}
      data-cursor="link"
      data-float
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="absolute inset-0 overflow-hidden rounded-full bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={personSrc(id, 640)}
            srcSet={personSrcSet(id)}
            sizes={`${size}px`}
            alt={name}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover grayscale-[0.25] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        </div>
        <svg
          className="absolute -inset-2 -rotate-90"
          style={{ width: size + 16, height: size + 16 }}
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle cx="50" cy="50" r="48.5" fill="none" stroke="var(--line)" strokeWidth="0.8" />
          <circle
            cx="50"
            cy="50"
            r="48.5"
            fill="none"
            stroke="var(--copper)"
            strokeWidth="1.4"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset="100"
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-700 ease-out group-hover:[stroke-dashoffset:0]"
          />
        </svg>
        {badge && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-copper px-3 py-1 font-mono text-[9px] tracking-[0.14em] whitespace-nowrap text-[#141210] uppercase shadow-lg">
            {badge}
          </span>
        )}
      </div>
      <figcaption className="mt-4 max-w-[160px]">
        <p className="font-display text-sm leading-tight md:text-base">{name}</p>
        <p className="label-mono mt-1.5 text-[10px] leading-relaxed">{role}</p>
      </figcaption>
    </figure>
  );
}

export default function Ambassadors() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) {
        gsap.utils
          .toArray<HTMLElement>(root.current.querySelectorAll("[data-float]"))
          .forEach((el, i) => {
            gsap.to(el, {
              y: (i % 2 === 0 ? 1 : -1) * 12,
              duration: 4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          });
      }
      setupReveals(root.current);
    },
    { scope: root },
  );

  const people = dict.ambassadors.people || [];

  // Pentagon-ish constellation coordinates (percent of container)
  const positions: Record<string, { left: string; top: string; size: number }> = {
    husanov: { left: "13%", top: "16%", size: 140 },
    shomurodov: { left: "84%", top: "13%", size: 136 },
    shaxzoda: { left: "90%", top: "68%", size: 120 },
    abror: { left: "66%", top: "86%", size: 128 },
    kusherbayev: { left: "12%", top: "76%", size: 132 },
    dilshodbek: { left: "48%", top: "22%", size: 134 },
  };

  return (
    <section
      ref={root}
      id="ambassadors"
      data-chapter="ambassadors"
      className="relative overflow-hidden bg-bg py-28 text-ink transition-colors duration-500 md:py-40"
    >
      <div className="px-5 text-center md:px-10">
        <ChapterLabel index="10" className="justify-center">
          {dict.ambassadors.label}
        </ChapterLabel>
        <h2 data-reveal className="mt-6 font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
          {dict.ambassadors.title}
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-md text-sm text-ink-soft md:text-[15px]">
          {dict.ambassadors.sub}
        </p>
      </div>

      {/* Constellation layout */}
      <div
        data-reveal
        className="relative mx-auto mt-16 md:mt-20"
        style={{ maxWidth: "1000px", paddingBottom: "80%", minHeight: "600px" }}
      >
        {/* CEO in center */}
        <figure
          className="group absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
          data-cursor="link"
        >
          <div className="relative size-56 shrink-0 md:size-72">
            <div className="absolute inset-0 overflow-hidden rounded-full bg-surface-2 ring-2 ring-copper/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ceoSrc("portrait-1", 640)}
                srcSet={ceoSrcSet("portrait-1")}
                sizes="288px"
                alt={dict.ceo.name}
                loading="eager"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover object-top grayscale-[0.2] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            <svg
              className="absolute -inset-3 -rotate-90"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle cx="50" cy="50" r="48" fill="none" stroke="var(--line)" strokeWidth="0.6" />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="var(--copper)"
                strokeWidth="1.2"
                pathLength="100"
                strokeDasharray="100"
                strokeDashoffset="100"
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-700 ease-out group-hover:[stroke-dashoffset:0]"
              />
            </svg>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-copper px-4 py-1.5 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-[#141210] uppercase shadow-lg">
              {dict.ambassadors.founderBadge}
            </span>
          </div>
          <figcaption className="mt-5">
            <p className="font-display text-xl leading-tight md:text-2xl">{dict.ceo.name}</p>
            <p className="label-mono mt-2 !text-copper">{dict.ceo.role}</p>
          </figcaption>
        </figure>

        {/* Ambassadors around CEO */}
        {people.map((person) => {
          const pos = positions[person.id];
          if (!pos) return null;
          return (
            <PersonCircle
              key={person.id}
              id={person.id}
              name={person.name}
              role={person.role}
              size={pos.size}
              position={{ left: pos.left, top: pos.top }}
              badge={person.id === "dilshodbek" ? dict.ambassadors.founderBadge : undefined}
            />
          );
        })}
      </div>

      {/* Trust indicator */}
      <div data-reveal className="mx-auto mt-16 flex max-w-md items-center justify-center gap-3 rounded-full border border-line bg-surface px-6 py-4 md:mt-20">
        <svg viewBox="0 0 24 24" className="size-6 text-copper" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="label-mono text-ink-soft">Ishonchli jamoa</span>
      </div>
    </section>
  );
}
