"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePresentation } from "@/components/PresentationShell";
import { VIDEOS } from "@/lib/media";

export default function Process() {
  const { dict } = usePresentation();
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
      className="relative h-[240vh] bg-[#0d0c0a]"
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* video frame */}
        <div data-frame className="absolute inset-0 will-change-[clip-path]">
          {mobile !== null && (
            <video
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
        <div className="relative z-10 flex h-full w-full flex-col justify-between px-5 pt-28 pb-14 text-[#f2ede6] md:px-10">
          <p className="label-mono !text-[#f2ede6]/60">
            05 — {dict.process.label}
          </p>

          <div className="text-center">
            <h2 className="font-display leading-[1.02]">
              <span
                data-title-a
                className="block text-[clamp(2.4rem,7vw,6rem)] tracking-tight"
                style={{ WebkitTextStroke: "1px rgba(242,237,230,0.75)", color: "transparent" }}
              >
                {dict.process.titleA}
              </span>
              <span data-title-b className="block text-[clamp(2.4rem,7vw,6rem)] italic">
                {dict.process.titleB}
              </span>
            </h2>
          </div>

          <div data-bottom className="flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-md text-sm leading-relaxed text-[#f2ede6]/75 md:text-[15px]">
              {dict.process.body}
            </p>
            <ul className="flex flex-wrap gap-2">
              {dict.process.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-[#f2ede6]/25 px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-[#f2ede6]/80 uppercase"
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
