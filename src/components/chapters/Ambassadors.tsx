"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { personSrc, personSrcSet } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";

function PersonCircle({
  id,
  name,
  role,
  size,
  badge,
  captionWidth = 190,
}: {
  id: string;
  name: string;
  role: string;
  size: number;
  badge?: string;
  captionWidth?: number;
}) {
  return (
    <figure className="group relative flex flex-col items-center text-center" data-cursor="link">
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
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-copper px-3 py-1 font-mono text-[9px] tracking-[0.14em] whitespace-nowrap text-[#141210] uppercase">
            {badge}
          </span>
        )}
      </div>
      <figcaption className="mt-5" style={{ maxWidth: captionWidth }}>
        <p className="font-display text-base leading-tight md:text-lg">{name}</p>
        <p className="label-mono mt-1.5 leading-relaxed">{role}</p>
      </figcaption>
    </figure>
  );
}

/* pentagon-ish constellation coordinates (percent of container) */
const POSITIONS: Record<string, { left: string; top: string; size: number }> = {
  husanov: { left: "13%", top: "16%", size: 150 },
  shomurodov: { left: "84%", top: "13%", size: 144 },
  shaxzoda: { left: "90%", top: "68%", size: 126 },
  abror: { left: "66%", top: "86%", size: 132 },
  kusherbayev: { left: "12%", top: "76%", size: 136 },
  dilshodbek: { left: "48%", top: "18%", size: 140 },
};

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
              y: gsap.utils.random(6, 10) * (i % 2 === 0 ? 1 : -1),
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

      {/* desktop constellation */}
      <div data-reveal className="relative mx-auto mt-10 hidden h-[680px] w-full max-w-5xl lg:block">
        {/* orbit rings */}
        <div
          className="absolute top-1/2 left-1/2 size-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line"
          style={{ animation: "spin 80s linear infinite" }}
          aria-hidden
        />
        <div
          className="absolute top-1/2 left-1/2 size-[660px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line opacity-70"
          style={{ animation: "spin 120s linear infinite reverse" }}
          aria-hidden
        />

        {/* center — founder */}
        <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <PersonCircle
            id="founder"
            name={dict.ceo.name}
            role={dict.ceo.role}
            size={186}
            badge={dict.ambassadors.founderBadge}
            captionWidth={230}
          />
        </div>

        {dict.ambassadors.people.map((p) => {
          const pos = POSITIONS[p.id];
          if (!pos) return null;
          return (
            <div
              key={p.id}
              data-float
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.left, top: pos.top }}
            >
              <PersonCircle id={p.id} name={p.name} role={p.role} size={pos.size} />
            </div>
          );
        })}
      </div>

      {/* mobile / tablet — snap row */}
      <div
        data-reveal
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-10 overflow-x-auto px-8 pb-4 lg:hidden"
      >
        <div className="shrink-0 snap-center">
          <PersonCircle
            id="founder"
            name={dict.ceo.name}
            role={dict.ceo.role}
            size={150}
            badge={dict.ambassadors.founderBadge}
            captionWidth={200}
          />
        </div>
        {dict.ambassadors.people.map((p) => (
          <div key={p.id} className="shrink-0 snap-center">
            <PersonCircle id={p.id} name={p.name} role={p.role} size={150} />
          </div>
        ))}
      </div>
    </section>
  );
}
