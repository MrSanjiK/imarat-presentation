"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { usePresentation } from "@/components/PresentationShell";

interface MediaItem {
  type: "image" | "video";
  src: string;
  srcSet?: string;
  poster?: string;
  alt?: string;
  aspectRatio?: string;
}

export default function MediaViewer({
  items,
  initialIndex,
  onClose,
}: {
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const { dict } = usePresentation();
  const [index, setIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentItem = items[index];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((prev) => (prev + 1) % items.length);
      if (e.key === "ArrowLeft") setIndex((prev) => (prev - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [items.length, onClose]);

  // Auto-play video when it becomes active
  useEffect(() => {
    if (currentItem.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked
      });
    }
  }, [index, currentItem.type]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  if (!currentItem || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[290] flex flex-col bg-[#0d0c0a]/98 text-[#f2ede6] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.2em] text-[#f2ede6]/80">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          {currentItem.type === "video" && (
            <span className="flex items-center gap-2 font-mono text-xs text-copper/80">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Video
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={dict.ui.close}
          onClick={onClose}
          className="grid size-10 place-items-center rounded-full border border-[#f2ede6]/25 transition-all hover:border-copper hover:bg-copper/10 hover:text-copper"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Media Container */}
      <div className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-16">
        {currentItem.type === "video" ? (
          <video
            ref={videoRef}
            key={currentItem.src}
            src={currentItem.src}
            poster={currentItem.poster}
            controls
            autoPlay
            loop
            playsInline
            preload="metadata"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-full rounded-[16px] object-contain shadow-2xl"
            style={{ aspectRatio: currentItem.aspectRatio }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentItem.src}
            src={currentItem.src}
            srcSet={currentItem.srcSet}
            sizes="92vw"
            alt={currentItem.alt || ""}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-full rounded-[16px] object-contain shadow-2xl"
          />
        )}

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              aria-label={dict.ui.prev}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 grid size-12 place-items-center rounded-full border border-[#f2ede6]/25 bg-[#0d0c0a]/80 backdrop-blur-md transition-all hover:border-copper hover:bg-copper/10 hover:scale-110 md:left-8 md:size-14"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={dict.ui.next}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 grid size-12 place-items-center rounded-full border border-[#f2ede6]/25 bg-[#0d0c0a]/80 backdrop-blur-md transition-all hover:border-copper hover:bg-copper/10 hover:scale-110 md:right-8 md:size-14"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="px-5 pb-5 text-center font-mono text-[10px] tracking-wider text-[#f2ede6]/40 md:px-8">
        <span className="hidden md:inline">ESC yopish · ← → navigatsiya · </span>
        {currentItem.type === "video" && <span>Ovoz yoqish uchun video ustiga bosing</span>}
      </div>
    </div>,
    document.body,
  );
}
