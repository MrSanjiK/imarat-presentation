"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import ChapterLabel from "@/components/ui/ChapterLabel";

export default function Stats() {
  const { dict, locale } = usePresentation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const fmt = new Intl.NumberFormat(locale === "en" ? "en-US" : "ru-RU");

      gsap.utils
        .toArray<HTMLElement>(root.current.querySelectorAll("[data-count]"))
        .forEach((el) => {
          const target = Number(el.dataset.count ?? 0);
          if (reduced) {
            el.textContent = fmt.format(target);
            return;
          }
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 2,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = fmt.format(Math.round(obj.v));
            },
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          });
        });

      setupReveals(root.current);
    },
    { scope: root, dependencies: [locale] },
  );

  return (
    <section
      ref={root}
      id="stats"
      data-chapter="stats"
      className="relative overflow-hidden bg-bg py-28 text-ink transition-colors duration-500 md:py-40"
    >
      <div className="blueprint absolute inset-0 opacity-70" aria-hidden />

      <div className="relative px-5 md:px-10 lg:pr-24">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <ChapterLabel index="03" className="mb-6">
              {dict.stats.label}
            </ChapterLabel>
            <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
              {dict.stats.title}
            </h2>
          </div>
          <p data-reveal className="font-hand -rotate-3 text-2xl text-copper md:text-3xl">
            {dict.stats.handwritten}
          </p>
        </div>

        <dl className="grid grid-cols-2 border-t border-l border-line lg:grid-cols-4">
          {dict.stats.items.map((item, i) => (
            <div
              key={i}
              data-reveal
              className="group relative border-r border-b border-line p-6 transition-colors duration-500 hover:bg-copper-soft md:p-10"
            >
              <span className="label-mono absolute top-4 right-4 opacity-40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <dd className="font-display text-[clamp(1.9rem,4vw,3.6rem)] leading-none whitespace-nowrap text-copper">
                <span data-count={item.value}>0</span>
                <span className="text-[0.6em]">{item.suffix.replace(" ", " ")}</span>
              </dd>
              <dt className="label-mono mt-4">{item.label}</dt>
            </div>
          ))}
        </dl>

        <p data-reveal className="label-mono mt-10 text-center opacity-50">
          41.2464° N — 69.2939° E · TOSHKENT
        </p>
      </div>
    </section>
  );
}
