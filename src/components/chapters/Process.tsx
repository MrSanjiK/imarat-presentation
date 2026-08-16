"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { VIDEOS } from "@/lib/media";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";

export default function Process() {
  const { dict } = usePresentation();
  const root = useRef<HTMLElement>(null);
  const [mobile, setMobile] = useState<boolean | null>(null);
  const videoRef = useAutoplayVideo();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setMobile(mq.matches);
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set(q("[data-frame]"), { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set([q("[data-title-a]"), q("[data-title-b]"), q("[data-bottom]")], {
          autoAlpha: 1,
          x: 0,
          y: 0,
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      tl.fromTo(
        q("[data-frame]"),
        { clipPath: "inset(18% 10% 18% 10%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "none" },
        0,
      )
        .fromTo(
          q("[data-title-a]"),
          { x: -60, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.7 },
          0.25,
        )
        .fromTo(
          q("[data-title-b]"),
          { x: 60, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.7 },
          0.35,
        )
        .fromTo(
          q("[data-bottom]"),
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6 },
          0.75,
        );
    },
    { scope: root },
  );

  const src = mobile ? VIDEOS.processMobile : VIDEOS.processDesktop;
  const poster = mobile ? VIDEOS.processMobilePoster : VIDEOS.processDesktopPoster;

  return (
    <section
      ref={root}
      id="process"
      data-chapter="process"
      className="relative h-[200vh] bg-[#0d0c0a] md:h-[240vh]"
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* video frame */}
        <div data-frame className="absolute inset-0 will-change-[clip-path]">
          {mobile !== null && (
            <video
              ref={videoRef}
              key={src}
              className="h-full w-full object-cover"
              src={src}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a]/60 via-transparent to-[#0d0c0a]/30" />
        </div>

        {/* text overlay */}
        <div className="relative z-10 flex h-full w-full flex-col justify-between px-5 pt-24 pb-10 text-[#f2ede6] md:px-10 md:pt-28 md:pb-14">
          <p className="label-mono video-text !text-[#f2ede6]/70">
            07 — {dict.process.label}
          </p>

          <div className="text-center">
            <h2 className="font-display leading-[1.02]">
              <span
                data-title-a
                className="video-outline block text-[clamp(2.4rem,7vw,6rem)] tracking-tight"
                style={{
                  WebkitTextStroke: "1.8px rgba(13,12,10,0.85)",
                  color: "transparent",
                  paintOrder: "stroke fill"
                }}
              >
                {dict.process.titleA}
              </span>
              <span
                data-title-b
                className="video-text-strong block text-[clamp(2.4rem,7vw,6rem)] italic"
                style={{
                  WebkitTextStroke: "0.8px rgba(13,12,10,0.4)",
                }}
              >
                {dict.process.titleB}
              </span>
            </h2>
          </div>

          <div data-bottom className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
            <p
              className="video-text max-w-md text-[13px] leading-relaxed text-[#f2ede6] md:text-[15px]"
              style={{
                textShadow: "0 2px 6px rgba(0,0,0,0.8), 0 4px 32px rgba(0,0,0,0.7)",
                WebkitTextStroke: "0.3px rgba(0,0,0,0.5)",
              }}
            >
              {dict.process.body}
            </p>
            <ul className="flex flex-wrap gap-1.5 md:gap-2">
              {dict.process.chips.map((chip) => (
                <li
                  key={chip}
                  className="video-text rounded-full border border-[#0d0c0a]/60 bg-[#0d0c0a]/50 px-3 py-1.5 font-mono text-[9px] tracking-[0.16em] text-[#f2ede6] uppercase backdrop-blur-md md:px-4 md:py-2 md:text-[10px]"
                  style={{
                    boxShadow: "0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(242,237,230,0.1)",
                  }}
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
