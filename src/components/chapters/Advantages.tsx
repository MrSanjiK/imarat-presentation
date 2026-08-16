"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import ChapterLabel from "@/components/ui/ChapterLabel";
import Marquee from "@/components/ui/Marquee";
import { RENDERS } from "@/lib/media";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";

const icons = [
  /* care — heart in hands */
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-9">
    <path d="M12 20s-6.5-4.2-8.6-8A4.8 4.8 0 0 1 12 7.3 4.8 4.8 0 0 1 20.6 12c-2.1 3.8-8.6 8-8.6 8Z" />
    <path d="M12 7.3v3.4" strokeLinecap="round" />
  </svg>,
  /* infrastructure — building + tree */
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-9">
    <path d="M4 21V8l6-4v17M10 21h10V11h-6" />
    <path d="M7 9.5h.01M7 12.5h.01M7 15.5h.01M16.5 14h.01M16.5 17h.01" strokeLinecap="round" />
    <path d="M4 21h16" strokeLinecap="round" />
  </svg>,
  /* trust — shield check */
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-9">
    <path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  /* rating — star chart */
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-9">
    <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" strokeLinecap="round" />
    <path d="m19 4 .9 1.9 2.1.3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2-1.5-1.4 2.1-.3L19 4Z" />
  </svg>,
];

export default function Advantages() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const videoRef = useAutoplayVideo();

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="advantages"
      data-chapter="advantages"
      className="invert-band relative bg-bg py-28 text-ink transition-colors duration-500 md:py-40"
    >
      {/* Render video backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-25"
          src={RENDERS.bristolMain}
          poster={RENDERS.bristolMainPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/75 to-bg/90" />
      </div>
      <div className="relative px-5 md:px-10 lg:pr-24">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <ChapterLabel index="08" className="mb-6">
              {dict.advantages.label}
            </ChapterLabel>
            <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
              {dict.advantages.title}
            </h2>
          </div>
          <p data-reveal className="font-hand -rotate-2 text-2xl text-copper md:text-3xl">
            {dict.advantages.handwritten}
          </p>
        </div>

        <div className="grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {dict.advantages.cards.map((card, i) => (
            <article
              key={i}
              data-reveal
              className="group relative flex min-h-[300px] flex-col justify-between bg-bg p-7 transition-colors duration-500 hover:bg-surface md:p-9"
            >
              <div className="flex items-start justify-between">
                <span className="text-copper transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[4deg]">
                  {icons[i]}
                </span>
                <span className="label-mono opacity-40">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <h3 className="font-display text-xl leading-snug md:text-2xl">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{card.body}</p>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-copper transition-transform duration-500 group-hover:scale-x-100" />
            </article>
          ))}
        </div>

        <div className="mt-16 md:mt-20">
          <p data-reveal className="label-mono mb-5">
            {dict.advantages.amenitiesLabel}
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {dict.advantages.amenities.map((a) => (
              <li
                key={a}
                data-reveal
                className="rounded-full border border-line px-4 py-2 font-mono text-[10.5px] tracking-[0.14em] text-ink-soft uppercase transition-colors duration-400 hover:border-copper hover:text-copper"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* offers ticker */}
      <div data-reveal className="relative mt-16 border-y border-line md:mt-20">
        <Marquee className="py-5">
          {dict.advantages.offers.map((o, i) => (
            <span key={i} className="flex items-center">
              <span className="font-display text-lg whitespace-nowrap italic md:text-2xl">{o}</span>
              <span className="mx-10 text-copper">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
