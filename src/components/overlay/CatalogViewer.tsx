"use client";

import { useCallback, useRef, useState } from "react";
import { catalogPageSrc } from "@/lib/media";
import { usePresentation } from "@/components/PresentationShell";

export default function CatalogViewer({
  slug,
  pages,
  w,
  h,
}: {
  slug: string;
  pages: number;
  w: number;
  h: number;
}) {
  const { dict } = usePresentation();
  const scroller = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const page = el.querySelector<HTMLElement>("[data-page]");
    if (!page) return;
    const step = page.offsetWidth + 16; // gap-4
    setCurrent(Math.max(0, Math.min(pages - 1, Math.round(el.scrollLeft / step))));
  }, [pages]);

  const scrollTo = useCallback((i: number) => {
    const el = scroller.current;
    if (!el) return;
    const page = el.querySelector<HTMLElement>("[data-page]");
    if (!page) return;
    const step = page.offsetWidth + 16;
    el.scrollTo({ left: i * step, behavior: "smooth" });
  }, []);

  const ratio = w > 0 && h > 0 ? `${w} / ${h}` : "3 / 4";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="label-mono">{dict.overlay.catalogHint}</p>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted tabular-nums">
            {String(current + 1).padStart(2, "0")} {dict.overlay.pageOf}{" "}
            {String(pages).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label={dict.ui.prev}
            data-cursor="link"
            onClick={() => scrollTo(current - 1)}
            disabled={current === 0}
            className="grid size-9 place-items-center rounded-full border border-line transition-colors hover:border-copper hover:text-copper disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={dict.ui.next}
            data-cursor="link"
            onClick={() => scrollTo(current + 1)}
            disabled={current === pages - 1}
            className="grid size-9 place-items-center rounded-full border border-line transition-colors hover:border-copper hover:text-copper disabled:opacity-30"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        data-lenis-prevent
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
      >
        {Array.from({ length: pages }, (_, i) => (
          <div
            key={i}
            data-page
            className="relative w-[82%] max-w-[560px] shrink-0 snap-center overflow-hidden border border-line bg-surface md:w-[46%]"
            style={{ aspectRatio: ratio }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={catalogPageSrc(slug, i + 1)}
              alt={`${dict.overlay.catalog} — ${i + 1}`}
              loading={i < 3 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover"
            />
            <span className="absolute right-2 bottom-2 rounded-sm bg-black/50 px-2 py-0.5 font-mono text-[9px] text-white/90">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>

      {/* progress dots */}
      <div className={`mt-4 justify-center gap-1.5 ${pages <= 30 ? "flex" : "hidden"}`}>
        {Array.from({ length: Math.min(pages, 30) }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${dict.ui.page} ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-copper" : "w-1.5 bg-line-strong hover:bg-copper/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
