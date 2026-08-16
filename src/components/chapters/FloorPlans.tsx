"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { MEDIA, floorPlanSrc, floorPlanSrcSet } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";
import MediaViewer from "@/components/ui/MediaViewer";

export default function FloorPlans() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  const plans = MEDIA.floorPlans;
  const active = plans[activeIndex];

  const goTo = (i: number) => {
    const next = (i + plans.length) % plans.length;
    setActiveIndex(next);
    const thumb = railRef.current?.children[next] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <section
      ref={root}
      id="floor-plans"
      data-chapter="floor-plans"
      className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40"
    >
      {/* drafting-table grid behind everything */}
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <div className="relative mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <ChapterLabel index="11.1" className="mb-6">
            {dict.overlay.floorPlansTab}
          </ChapterLabel>
          <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
            {dict.floorPlans.title}
          </h2>
          <p data-reveal className="mt-4 max-w-xl text-sm text-ink-soft md:text-[15px]">
            {dict.floorPlans.sub}
          </p>
        </div>
        <div data-reveal className="flex items-baseline gap-3">
          <span className="text-outline font-display text-[clamp(4rem,9vw,8rem)] leading-none">
            {plans.length}
          </span>
          <span className="label-mono">{dict.floorPlans.counterLabel}</span>
        </div>
      </div>

      <div data-reveal className="relative mx-auto max-w-4xl">
        {/* drafting sheet — always paper-white, plans are ink drawings */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`${dict.floorPlans.viewLabel} — ${active.area} m²`}
          data-cursor="link"
          data-cursor-label={dict.floorPlans.viewLabel}
          onClick={() => setViewerOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && setViewerOpen(true)}
          className="group relative block w-full cursor-pointer overflow-hidden rounded-[16px] bg-white shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-copper"
        >
          <div className="relative aspect-[4/3] w-full">
            {plans.map((plan, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={plan.n}
                src={floorPlanSrc(plan.n, 1280)}
                srcSet={floorPlanSrcSet(plan.n)}
                sizes="(min-width:1024px) 56rem, 92vw"
                alt={`${dict.overlay.floorPlansTab} — ${plan.area} m²`}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain p-8 transition-opacity duration-500 md:p-12"
                style={{ opacity: index === activeIndex ? 1 : 0 }}
              />
            ))}
          </div>

          {/* corner registration marks */}
          <span aria-hidden className="pointer-events-none absolute top-4 left-4 size-5 border-t-2 border-l-2 border-copper/70" />
          <span aria-hidden className="pointer-events-none absolute top-4 right-4 size-5 border-t-2 border-r-2 border-copper/70" />
          <span aria-hidden className="pointer-events-none absolute bottom-4 left-4 size-5 border-b-2 border-l-2 border-copper/70" />
          <span aria-hidden className="pointer-events-none absolute right-4 bottom-4 size-5 border-b-2 border-r-2 border-copper/70" />

          {/* title-block, like a CAD sheet stamp */}
          <div className="pointer-events-none absolute right-8 bottom-8 hidden border border-neutral-300 bg-white/90 font-mono text-[10px] tracking-[0.14em] text-neutral-600 uppercase md:block">
            <div className="border-b border-neutral-300 px-3 py-1.5">IMARAT DEVELOPMENT</div>
            <div className="flex divide-x divide-neutral-300">
              <span className="px-3 py-1.5">{String(activeIndex + 1).padStart(2, "0")}/{String(plans.length).padStart(2, "0")}</span>
              <span className="px-3 py-1.5 text-copper">{active.area} m²</span>
            </div>
          </div>
        </div>

        {/* dimension line annotation */}
        <div className="mt-7 flex items-center justify-center gap-3" aria-hidden>
          <span className="h-4 w-px bg-copper/60" />
          <span className="h-px w-full max-w-[110px] bg-copper/50" />
          <span className="font-mono text-sm tracking-[0.2em] whitespace-nowrap text-copper">
            {active.area} m² — {dict.overlay.areaLabel}
          </span>
          <span className="h-px w-full max-w-[110px] bg-copper/50" />
          <span className="h-4 w-px bg-copper/60" />
        </div>

        {/* controls */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label={dict.ui.prev}
            data-cursor="link"
            onClick={() => goTo(activeIndex - 1)}
            className="grid size-12 place-items-center rounded-full border border-line bg-surface transition-all duration-300 hover:scale-110 hover:border-copper hover:bg-copper-soft active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-copper tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="label-mono opacity-60">/ {String(plans.length).padStart(2, "0")}</span>
          </div>
          <button
            type="button"
            aria-label={dict.ui.next}
            data-cursor="link"
            onClick={() => goTo(activeIndex + 1)}
            className="grid size-12 place-items-center rounded-full border border-line bg-surface transition-all duration-300 hover:scale-110 hover:border-copper hover:bg-copper-soft active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* thumbnail rail */}
        <div
          ref={railRef}
          className="mt-8 flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {plans.map((plan, i) => (
            <button
              key={plan.n}
              type="button"
              data-cursor="link"
              onClick={() => goTo(i)}
              aria-label={`${dict.overlay.floorPlansTab} ${i + 1} — ${plan.area} m²`}
              aria-current={i === activeIndex}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-[12px] bg-white transition-all duration-300 ${
                i === activeIndex
                  ? "border-2 border-copper"
                  : "border border-line opacity-55 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={floorPlanSrc(plan.n, 640)}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-contain p-1.5"
              />
              <span className="absolute right-1.5 bottom-1 font-mono text-[9px] text-neutral-500">
                {plan.area}
              </span>
            </button>
          ))}
        </div>

        <p data-reveal className="label-mono mt-8 text-center opacity-60">
          {dict.floorPlans.hint}
        </p>
      </div>

      {viewerOpen && (
        <MediaViewer
          items={plans.map((plan) => ({
            type: "image" as const,
            src: floorPlanSrc(plan.n, 1920),
            srcSet: floorPlanSrcSet(plan.n),
            alt: `${dict.overlay.floorPlansTab} — ${plan.area} m²`,
          }))}
          initialIndex={activeIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </section>
  );
}
