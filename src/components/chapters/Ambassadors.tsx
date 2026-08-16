"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { personSrc, personSrcSet, ceoSrc, ceoSrcSet } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";

function PersonPortrait({
  id,
  name,
  role,
  size,
}: {
  id: string;
  name: string;
  role: string;
  size: number;
}) {
  return (
    <figure className="group flex flex-col items-center text-center" data-cursor="link">
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
      </div>
      <figcaption className="mt-4 max-w-[170px]">
        <p className="font-display text-sm leading-tight md:text-[15px]">{name}</p>
        <p className="label-mono mt-1.5 !text-[9px] leading-relaxed">{role}</p>
      </figcaption>
    </figure>
  );
}

function CeoCenter({ name, role, badge }: { name: string; role: string; badge: string }) {
  return (
    <figure className="group flex flex-col items-center text-center" data-cursor="link">
      <div className="relative size-52 shrink-0 md:size-64">
        <div className="absolute inset-0 overflow-hidden rounded-full bg-surface-2 ring-2 ring-copper/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ceoSrc("portrait-1", 640)}
            srcSet={ceoSrcSet("portrait-1")}
            sizes="256px"
            alt={name}
            loading="eager"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover object-top grayscale-[0.2] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        </div>
        <svg className="absolute -inset-3 -rotate-90" viewBox="0 0 100 100" aria-hidden>
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
          {badge}
        </span>
      </div>
      <figcaption className="mt-6">
        <p className="font-display text-lg leading-tight md:text-xl">{name}</p>
        <p className="label-mono mt-2 !text-copper">{role}</p>
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
        /* gentle orbital drift on each ambassador */
        gsap.utils
          .toArray<HTMLElement>(root.current.querySelectorAll("[data-float]"))
          .forEach((el, i) => {
            gsap.to(el, {
              y: (i % 2 === 0 ? 1 : -1) * 10,
              duration: 4 + (i % 3) * 0.7,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          });

        /* dashed orbit ring rotates imperceptibly slowly */
        gsap.to(root.current.querySelectorAll("[data-orbit-ring]"), {
          rotate: 360,
          duration: 120,
          ease: "none",
          repeat: -1,
        });
      }

      setupReveals(root.current);
    },
    { scope: root },
  );

  const people = dict.ambassadors.people || [];

  /* even radial orbit: 6 seats, starting at 12 o'clock */
  const R = 39;
  const seats = people.map((_, i) => {
    const angle = ((-90 + i * (360 / Math.max(people.length, 1))) * Math.PI) / 180;
    return {
      left: `${50 + R * Math.cos(angle)}%`,
      top: `${50 + R * Math.sin(angle)}%`,
    };
  });

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

      {/* ── desktop: radial orbit around the CEO ─────────────────────── */}
      <div data-reveal className="relative mx-auto mt-10 hidden max-w-[980px] px-10 lg:block">
        <div className="relative aspect-square w-full">
          {/* orbit rings */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <circle
              data-orbit-ring
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="var(--line)"
              strokeWidth="0.18"
              strokeDasharray="0.9 1.6"
              style={{ transformOrigin: "50% 50%" }}
            />
            <circle cx="50" cy="50" r={R - 11} fill="none" stroke="var(--line)" strokeWidth="0.12" opacity="0.6" />
          </svg>

          {/* CEO in the middle */}
          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <CeoCenter
              name={dict.ceo.name}
              role={dict.ceo.role}
              badge={dict.ambassadors.founderBadge}
            />
          </div>

          {/* six seats on the ring */}
          {people.map((person, i) => (
            <div
              key={person.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: seats[i].left, top: seats[i].top }}
            >
              <div data-float>
                <PersonPortrait id={person.id} name={person.name} role={person.role} size={124} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── mobile / tablet: CEO on top, orderly grid below ──────────── */}
      <div className="mt-14 px-5 lg:hidden">
        <div data-reveal className="flex justify-center">
          <CeoCenter
            name={dict.ceo.name}
            role={dict.ceo.role}
            badge={dict.ambassadors.founderBadge}
          />
        </div>
        <div className="mx-auto mt-14 grid max-w-md grid-cols-2 gap-x-6 gap-y-12">
          {people.map((person) => (
            <div key={person.id} data-reveal className="flex justify-center">
              <PersonPortrait id={person.id} name={person.name} role={person.role} size={116} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
