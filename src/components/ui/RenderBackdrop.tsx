"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useAutoplayVideo } from "@/hooks/useAutoplayVideo";
import { RENDERS } from "@/lib/media";

interface RenderBackdropProps {
  videoSrc: string;
  posterSrc: string;
  children: React.ReactNode;
  className?: string;
}

export default function RenderBackdrop({
  videoSrc,
  posterSrc,
  children,
  className = "",
}: RenderBackdropProps) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useAutoplayVideo();

  useGSAP(
    () => {
      if (!root.current) return;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set(q("[data-video]"), { scale: 1, autoAlpha: 0.6 });
        gsap.set(q("[data-content]"), { autoAlpha: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      tl.fromTo(
        q("[data-video]"),
        { scale: 1.2, autoAlpha: 0.3 },
        { scale: 1, autoAlpha: 0.7, ease: "none" },
        0,
      ).fromTo(
        q("[data-content]"),
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, ease: "power2.out" },
        0.2,
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`}>
      {/* Video backdrop */}
      <div
        data-video
        className="pointer-events-none absolute inset-0 will-change-[transform,opacity]"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/95 via-bg/85 to-bg/95" />
      </div>

      {/* Content */}
      <div data-content className="relative will-change-[opacity,transform]">
        {children}
      </div>
    </div>
  );
}

// Export render video sources for convenience
export { RENDERS };
