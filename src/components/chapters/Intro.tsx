"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { VIDEOS } from "@/lib/media";
import Marquee from "@/components/ui/Marquee";

export default function Intro() {
  const { dict, ready } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setMobile(mq.matches);
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useGSAP(
    () => {
      if (!ready || !root.current) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!reduced) {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.fromTo(
          q("[data-video]"),
          { scale: 1.14 },
          { scale: 1, duration: 2.2, ease: "power3.out" },
          0,
        )
          .fromTo(
            q("[data-line-inner]"),
            { yPercent: 140 },
            { yPercent: 0, duration: 1.25, stagger: 0.14 },
            0.15,
          )
          .fromTo(
            q("[data-hand]"),
            { autoAlpha: 0, y: 18, rotate: -7 },
            { autoAlpha: 1, y: 0, rotate: -4, duration: 0.9, ease: "back.out(1.7)" },
            0.95,
          )
          .fromTo(
            q("[data-underline] path"),
            { strokeDashoffset: 320 },
            { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" },
            1.05,
          )
          .fromTo(
            q("[data-fade]"),
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 },
            0.8,
          );
      } else {
        gsap.set([q("[data-line-inner]"), q("[data-hand]"), q("[data-fade]")], {
          autoAlpha: 1,
          yPercent: 0,
          y: 0,
        });
      }

      /* parallax out */
      gsap.to(q("[data-content]"), {
        yPercent: -10,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(q("[data-video]"), {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root, dependencies: [ready] },
  );

  const videoSrc = mobile ? VIDEOS.heroMobile : VIDEOS.heroDesktop;
  const poster = mobile ? VIDEOS.heroMobilePoster : VIDEOS.heroDesktopPoster;

  return (
    <section
      ref={root}
      id="intro"
      data-chapter="intro"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#0d0c0a] text-[#f2ede6]"
    >
      {/* video backdrop */}
      <div data-video className="absolute inset-0 will-change-transform">
        {mobile !== null && (
          <video
            key={videoSrc}
            className="h-full w-full object-cover"
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a]/95 via-[#0d0c0a]/25 to-[#0d0c0a]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(13,12,10,0.55)_100%)]" />
      </div>

      {/* content */}
      <div
        data-content
        className="relative z-10 flex min-h-svh flex-col justify-end px-4 pt-24 pb-24 md:px-10 md:pt-28 md:pb-36"
      >
        <p data-fade className="label-mono video-text mb-5 !text-[#f2ede6]/70">
          {dict.hero.eyebrow}
        </p>

        {/* pb/-mb pair keeps descenders (g, j) visible inside the reveal masks */}
        <h1 className="video-text-strong font-display text-[clamp(2.9rem,9vw,7.6rem)] leading-[1.02] tracking-[-0.01em]">
          <span className="block overflow-hidden pr-[0.1em] pb-[0.18em] -mb-[0.18em]">
            <span data-line-inner className="block will-change-transform">
              {dict.hero.titleA}
            </span>
          </span>
          <span className="block overflow-hidden pr-[0.1em] pb-[0.18em] -mb-[0.12em]">
            <span data-line-inner className="block italic will-change-transform">
              {dict.hero.titleB}
              <span className="text-copper">.</span>
            </span>
          </span>
        </h1>

        {/* handwritten accent */}
        <div data-hand className="relative mt-4 inline-block self-start opacity-0 md:mt-2">
          <span className="video-text font-hand text-2xl text-copper md:text-4xl">
            — {dict.hero.handwritten}
          </span>
          <svg
            data-underline
            className="absolute -bottom-3 left-4 w-[85%] text-copper/70"
            viewBox="0 0 300 14"
            fill="none"
          >
            <path
              d="M4 10 C60 2, 150 12, 296 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="320"
              strokeDashoffset="320"
            />
          </svg>
        </div>

        <div className="mt-9 flex flex-wrap items-end justify-between gap-6">
          <p data-fade className="video-text max-w-xl text-sm leading-relaxed text-[#f2ede6]/85 md:text-base">
            {dict.hero.sub}
          </p>
          <p data-fade className="label-mono video-text !text-[#f2ede6]/60">
            {dict.hero.est}
          </p>
        </div>
      </div>

      {/* scroll hint */}
      <div
        data-fade
        className="absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="label-mono video-text !text-[#f2ede6]/65">{dict.ui.scrollHint}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-[#f2ede6]/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-drip_1.6s_ease-in-out_infinite] bg-copper" />
        </span>
      </div>

      {/* marquee */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-[#f2ede6]/10">
        <Marquee slow className="py-3.5">
          {dict.hero.marquee.map((m, i) => (
            <span key={i} className="flex items-center">
              <span className="font-mono text-[11px] tracking-[0.24em] whitespace-nowrap text-[#f2ede6]/55 uppercase">
                {m}
              </span>
              <span className="mx-8 text-copper">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
