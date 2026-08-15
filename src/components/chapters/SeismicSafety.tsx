"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { VIDEOS } from "@/lib/media";

export default function SeismicSafety() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set([q("[data-badge]"), q("[data-title]"), q("[data-desc]"), q("[data-stats]")], {
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 0.8,
        },
      });

      tl.fromTo(q("[data-badge]"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 0)
        .fromTo(q("[data-title]"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.15)
        .fromTo(q("[data-desc]"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 0.35)
        .fromTo(
          q("[data-stats]"),
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 },
          0.5,
        );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="seismic-safety"
      data-chapter="seismic-safety"
      className="relative overflow-hidden bg-[#0d0c0a] py-20 text-[#f2ede6] md:py-32"
    >
      <div className="container mx-auto grid gap-8 px-5 md:grid-cols-2 md:gap-12 md:px-10 lg:gap-16">
        {/* Video */}
        <div className="relative aspect-[9/16] overflow-hidden rounded-lg md:sticky md:top-24 md:h-[70vh]">
          <video
            className="h-full w-full object-cover"
            src={VIDEOS.seismicTest}
            poster={VIDEOS.seismicTestPoster}
            controls
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0d0c0a]/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center space-y-6">
          <div data-badge className="inline-flex items-center gap-2 self-start rounded-full border border-copper/40 bg-copper-soft px-4 py-2">
            <svg viewBox="0 0 24 24" className="size-5 text-copper" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-mono text-xs tracking-wider uppercase text-copper">
              {dict.seismic?.badge || "Sertifikatlangan"}
            </span>
          </div>

          <div>
            <p className="label-mono mb-4">03 — {dict.seismic?.label || "Xavfsizlik"}</p>
            <h2 data-title className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight">
              {dict.seismic?.title || "Xavfsizlik — birinchi o'rinda"}
            </h2>
          </div>

          <div data-desc className="space-y-4 text-[15px] leading-relaxed text-[#f2ede6]/85">
            <p>{dict.seismic?.body1 || "BMTning Markaziy Osiyoda kuchli zilzilalar xavfi haqidagi ogohlantirishidan so'ng, IMARAT kompaniyasi Sergeli City loyihasida seysmik sinov o'tkazdi."}</p>
            <p>{dict.seismic?.body2 || "Maxsus vibratsion-dinamik uskunalar yordamida 8–9 ballgacha zilzilani taqlid qiluvchi sun'iy tebranishlar hosil qilindi."}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div data-stats className="rounded-lg border border-line bg-surface p-4">
              <div className="font-display text-3xl text-copper">8-9</div>
              <p className="label-mono mt-1">{dict.seismic?.stat1 || "Ball zilzila"}</p>
            </div>
            <div data-stats className="rounded-lg border border-line bg-surface p-4">
              <div className="font-display text-3xl text-copper">100%</div>
              <p className="label-mono mt-1">{dict.seismic?.stat2 || "Bardoshli"}</p>
            </div>
          </div>

          <div data-stats className="space-y-3 rounded-lg border border-line bg-surface p-5">
            <h3 className="font-display text-lg italic text-copper">
              {dict.seismic?.partnersTitle || "Hamkorlar"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="size-4 text-copper" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {dict.seismic?.partner1 || "Seysmologiya instituti"}
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="size-4 text-copper" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {dict.seismic?.partner2 || "Yaponiyalik mutaxassislar"}
              </li>
              <li className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="size-4 text-copper" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {dict.seismic?.partner3 || "Kompaniya rahbari sinov ichida bo'lgan"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
