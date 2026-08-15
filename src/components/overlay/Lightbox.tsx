"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ManifestImage } from "@/data/projects";
import { projectImgSrc, projectImgSrcSet, floorPlanSrc, floorPlanSrcSet } from "@/lib/media";
import { usePresentation } from "@/components/PresentationShell";

interface LightboxImage {
  type: "project" | "floorplan";
  n: string;
  w: number;
  h: number;
  area?: string;
}

export default function Lightbox({
  slug,
  images,
  index,
  onIndex,
  onClose,
}: {
  slug: string;
  images: LightboxImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { dict } = usePresentation();
  const img = images[index];
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [index, images.length, onClose, onIndex]);

  if (!img || !mounted) return null;

  const imgSrc = img.type === "floorplan"
    ? floorPlanSrc(img.n, 1920)
    : projectImgSrc(slug, img.n, 1920);

  const imgSrcSet = img.type === "floorplan"
    ? floorPlanSrcSet(img.n)
    : projectImgSrcSet(slug, img.n);

  // portal to body — the overlay dialog is a transformed/scrolling container,
  // fixed positioning inside it would anchor to the container instead of viewport
  return createPortal(
    <div
      className="fixed inset-0 z-[290] flex flex-col bg-[#0d0c0a]/97 text-[#f2ede6]"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tracking-[0.2em]">
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
          {img.area && (
            <span className="font-mono text-xs text-[#f2ede6]/60">
              {img.area} m²
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={dict.ui.close}
          data-cursor="link"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-full border border-[#f2ede6]/25 transition-colors hover:border-copper hover:text-copper"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={img.n}
          src={imgSrc}
          srcSet={imgSrcSet}
          sizes="92vw"
          alt={img.area ? `${dict.overlay.floorPlansTab} ${img.area} m²` : ""}
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[80vh] max-w-full object-contain"
          style={{ aspectRatio: `${img.w} / ${img.h}` }}
        />

        <button
          type="button"
          aria-label={dict.ui.prev}
          data-cursor="link"
          onClick={(e) => {
            e.stopPropagation();
            onIndex((index - 1 + images.length) % images.length);
          }}
          className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[#f2ede6]/25 bg-[#0d0c0a]/40 backdrop-blur transition-colors hover:border-copper hover:text-copper md:left-6"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={dict.ui.next}
          data-cursor="link"
          onClick={(e) => {
            e.stopPropagation();
            onIndex((index + 1) % images.length);
          }}
          className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[#f2ede6]/25 bg-[#0d0c0a]/40 backdrop-blur transition-colors hover:border-copper hover:text-copper md:right-6"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
