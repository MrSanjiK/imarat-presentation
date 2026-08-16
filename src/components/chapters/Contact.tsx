"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { setupReveals } from "@/lib/reveal";
import ChapterLabel from "@/components/ui/ChapterLabel";
import Marquee from "@/components/ui/Marquee";
import Magnetic from "@/components/ui/Magnetic";
import { RENDERS } from "@/lib/media";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Contact() {
  const { dict, goTo } = usePresentation();
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
      id="contact"
      data-chapter="contact"
      className="relative flex min-h-svh flex-col bg-bg pt-28 text-ink transition-colors duration-500 md:pt-40"
    >
      {/* render video backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-25"
          src={RENDERS.ecoPark3}
          poster={RENDERS.ecoPark3Poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/80 to-bg/95" />
      </div>
      <div className="relative flex-1 px-5 md:px-10 lg:pr-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <ChapterLabel index="12" className="mb-6">
              {dict.contact.label}
            </ChapterLabel>
            <h2 data-reveal className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight">
              {dict.contact.title}
            </h2>
          </div>
          <p data-reveal className="font-hand -rotate-3 text-2xl text-copper md:text-3xl">
            {dict.contact.handwritten}
          </p>
        </div>

        {/* phone hero */}
        <div data-reveal className="mt-14 md:mt-20">
          <p className="label-mono mb-4">{dict.contact.phoneLabel}</p>
          <Magnetic strength={0.15}>
            <a
              href={`tel:${dict.ui.phone.replace(/\s/g, "")}`}
              data-cursor="link"
              data-cursor-label={dict.ui.call}
              className="font-display text-[clamp(2.1rem,7vw,5.8rem)] leading-none tracking-tight transition-colors duration-400 hover:text-copper"
            >
              {dict.ui.phone}
            </a>
          </Magnetic>
        </div>

        <div className="mt-16 grid gap-12 border-t border-line pt-12 md:mt-24 lg:grid-cols-3">
          {/* address + maps */}
          <div data-reveal>
            <p className="label-mono mb-4">{dict.contact.addressLabel}</p>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft md:text-[15px]">
              {dict.contact.address}
            </p>
            <p className="font-mono mt-3 text-[11px] text-muted">{dict.contact.coords}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {dict.contact.maps.map((m) => (
                <a
                  key={m.id}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-colors duration-300 hover:border-copper hover:text-copper"
                >
                  {m.name}
                  <ArrowUpRight />
                </a>
              ))}
            </div>
          </div>

          {/* socials */}
          <div data-reveal>
            <p className="label-mono mb-4">{dict.contact.socialsLabel}</p>
            <ul>
              {dict.contact.socials.map((s) => (
                <li key={s.id} className="border-b border-line first:border-t">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="group flex items-center justify-between gap-4 py-3.5"
                  >
                    <span className="text-sm transition-transform duration-400 group-hover:translate-x-1.5 md:text-[15px]">
                      {s.name}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-muted">{s.handle}</span>
                      <span className="text-copper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <ArrowUpRight />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* note */}
          <div data-reveal>
            <p className="label-mono mb-4">IMARAT</p>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft md:text-[15px]">
              {dict.contact.officesNote}
            </p>
            <p className="font-hand mt-6 rotate-[-2deg] text-2xl text-copper">
              {dict.footer.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="relative mt-20 md:mt-28">
        <div className="border-t border-line">
          <Marquee slow className="py-4 md:py-6">
            {[0, 1].map((i) => (
              <span key={i} className="flex items-center">
                <span className="text-outline font-display text-[clamp(3rem,9vw,8rem)] leading-none whitespace-nowrap uppercase">
                  Imarat Development
                </span>
                <span className="mx-10 font-display text-[clamp(2rem,5vw,4rem)] text-copper italic">
                  /
                </span>
              </span>
            ))}
          </Marquee>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-5 md:px-10">
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
            {dict.footer.rights}
          </p>
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
            {dict.footer.madeFor}
          </p>
          <button
            type="button"
            data-cursor="link"
            onClick={() => goTo(0)}
            className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors hover:text-copper"
          >
            {dict.footer.backTop}
            <span className="grid size-8 place-items-center rounded-full border border-line transition-all duration-400 group-hover:-translate-y-1 group-hover:border-copper">
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </footer>
    </section>
  );
}
