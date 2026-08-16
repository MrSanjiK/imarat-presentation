"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { personSrc, personSrcSet } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";

function PersonCard({
  id,
  name,
  role,
  badge,
}: {
  id: string;
  name: string;
  role: string;
  badge?: string;
}) {
  return (
    <figure className="group relative flex flex-col items-center text-center" data-cursor="link">
      <div className="relative mb-5 size-36 shrink-0 md:size-44">
        <div className="absolute inset-0 overflow-hidden rounded-full bg-surface-2 ring-1 ring-line transition-all duration-700 group-hover:ring-2 group-hover:ring-copper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={personSrc(id, 640)}
            srcSet={personSrcSet(id)}
            sizes="176px"
            alt={name}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover grayscale-[0.3] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        </div>
        {badge && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-copper px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#141210] shadow-lg">
            {badge}
          </span>
        )}
      </div>
      <figcaption className="max-w-[180px]">
        <p className="font-display text-base leading-tight transition-colors duration-500 group-hover:text-copper md:text-lg">
          {name}
        </p>
        <p className="label-mono mt-2 leading-relaxed">{role}</p>
      </figcaption>
    </figure>
  );
}

export default function Ambassadors() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  const people = dict.ambassadors.people || [];

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

      {/* Grid layout - clean and professional */}
      <div
        data-reveal
        className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 px-5 md:grid-cols-3 md:gap-x-10 md:gap-y-16 md:px-10 lg:grid-cols-6"
      >
        {people.map((person) => (
          <PersonCard
            key={person.id}
            id={person.id}
            name={person.name}
            role={person.role}
            badge={person.id === "dilshodbek" ? dict.ambassadors.founderBadge : undefined}
          />
        ))}
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
