"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { VIDEOS } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";
import RotatingBadge from "@/components/ui/RotatingBadge";

export default function Manifesto() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* word-by-word scrub reveal */
      const statement = q("[data-statement]")[0];
      if (statement && !reduced) {
        const split = SplitText.create(statement, { type: "words" });
        gsap.set(split.words, { opacity: 0.13 });
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "75% bottom",
            scrub: 0.4,
          },
        });
      }

      /* drone video parallax inside its frame */
      if (!reduced) {
        gsap.fromTo(
          q("[data-drone]"),
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.12,
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
      id="manifesto"
      data-chapter="manifesto"
      className="invert-band relative h-[190vh] bg-bg text-ink transition-colors duration-500 md:h-[260vh]"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-5 pt-14 md:px-10 md:pt-0">
        <div className="pointer-events-none absolute top-20 left-5 md:top-24 md:left-10">
          <ChapterLabel index="02">{dict.manifesto.label}</ChapterLabel>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20 lg:pr-16">
          <div>
            <h2
              data-statement
              className="font-display text-[clamp(1.7rem,5.8vw,4.9rem)] leading-[1.08] tracking-[-0.01em]"
            >
              {dict.manifesto.statement}
            </h2>

            <div className="mt-7 grid max-w-3xl gap-5 md:mt-10 md:grid-cols-2 md:gap-10">
              <p data-reveal className="text-[13px] leading-relaxed text-ink-soft md:text-[15px]">
                {dict.manifesto.body1}
              </p>
              <p data-reveal className="text-[13px] leading-relaxed text-ink-soft md:text-[15px]">
                {dict.manifesto.body2}
              </p>
            </div>
          </div>

          {/* drone window */}
          <div data-reveal className="relative hidden max-w-[380px] justify-self-end lg:block">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <video
                data-drone
                className="h-full w-full object-cover will-change-transform"
                src={VIDEOS.drone}
                poster={VIDEOS.dronePoster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 border border-line-strong" />
            </div>
            <div className="absolute -inset-3 -z-10 border border-copper/35" />

            <RotatingBadge
              text={`${dict.manifesto.badge} • IMARAT DEVELOPMENT • `}
              className="absolute -top-14 -left-14 size-28 text-copper"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
