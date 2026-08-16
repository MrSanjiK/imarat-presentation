"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import { MEDIA, floorPlanSrc, floorPlanSrcSet } from "@/lib/media";
import ChapterLabel from "@/components/ui/ChapterLabel";

export default function FloorPlans() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useGSAP(
    () => {
      setupReveals(root.current);
    },
    { scope: root },
  );

  const plans = MEDIA.floorPlans;

  return (
    <section
      ref={root}
      id="floor-plans"
      data-chapter="floor-plans"
      className="relative px-5 py-28 md:px-10 md:py-40"
    >
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <div>
          <ChapterLabel index="10" className="mb-6">
            {dict.overlay.floorPlansTab}
          </ChapterLabel>
          <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
            {dict.floorPlans?.title || "Rejalarimiz"}
          </h2>
          <p data-reveal className="mt-4 max-w-xl text-sm text-ink-soft md:text-[15px]">
            {dict.floorPlans?.sub || "Turli xil maydonlarda 1, 2 va 3 xonali kvartiralar"}
          </p>
        </div>
        <div data-reveal className="flex items-baseline gap-3">
          <span className="text-outline font-display text-[clamp(4rem,9vw,8rem)] leading-none">
            {plans.length}
          </span>
          <span className="label-mono">{dict.floorPlans?.counterLabel || "Rejalar"}</span>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <button
            key={plan.n}
            type="button"
            data-reveal
            data-cursor="link"
            onClick={() => setSelectedPlan(index)}
            className="group relative overflow-hidden rounded-[16px] border border-line bg-surface-2 transition-all duration-500 hover:border-copper hover:shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={floorPlanSrc(plan.n, 640)}
              srcSet={floorPlanSrcSet(plan.n)}
              sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
              alt={`${dict.overlay.floorPlansTab} ${plan.area} m²`}
              loading={index < 6 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              style={{ aspectRatio: `${plan.w} / ${plan.h}` }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
              <p className="font-display text-2xl text-white">{plan.area} m²</p>
              <p className="label-mono mt-1 text-white/80">{dict.floorPlans?.viewLabel || "Ko'rish"}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPlan !== null && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedPlan(null)}
        >
          <button
            type="button"
            aria-label={dict.ui.close}
            onClick={() => setSelectedPlan(null)}
            className="absolute top-5 right-5 z-10 grid size-12 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-all hover:rotate-90 hover:border-white/40"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={floorPlanSrc(plans[selectedPlan].n, 1920)}
              alt={`${dict.overlay.floorPlansTab} ${plans[selectedPlan].area} m²`}
              className="h-auto w-full rounded-[20px] object-contain"
            />
            <div className="mt-4 text-center">
              <p className="font-display text-3xl text-white">{plans[selectedPlan].area} m²</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
            <button
              type="button"
              aria-label={dict.ui.prev}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlan((prev) => (prev! - 1 + plans.length) % plans.length);
              }}
              className="grid size-12 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-all hover:border-white/40 hover:scale-110"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <span className="font-mono text-sm text-white/80 tabular-nums">
              {String(selectedPlan + 1).padStart(2, "0")} / {String(plans.length).padStart(2, "0")}
            </span>

            <button
              type="button"
              aria-label={dict.ui.next}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlan((prev) => (prev! + 1) % plans.length);
              }}
              className="grid size-12 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-all hover:border-white/40 hover:scale-110"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <p data-reveal className="label-mono mt-10 text-center opacity-60">
        {dict.floorPlans?.hint || "Rejalarni ko'rish uchun bosing"}
      </p>
    </section>
  );
}
