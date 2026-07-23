"use client";

import { usePresentation } from "@/components/PresentationShell";

export default function ChapterRail() {
  const { dict, active, goTo } = usePresentation();

  return (
    <nav
      aria-label={dict.ui.chapterWord}
      className="fixed top-1/2 right-6 z-[110] hidden -translate-y-1/2 flex-col items-end gap-3.5 lg:flex"
    >
      {dict.chapters.map((c, i) => {
        const isActive = i === active;
        return (
          <button
            key={c.id}
            type="button"
            data-cursor="link"
            onClick={() => goTo(i)}
            aria-label={`${String(i + 1).padStart(2, "0")} — ${c.title}`}
            aria-current={isActive ? "step" : undefined}
            className="group flex items-center gap-2.5"
          >
            <span
              className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-all duration-400 ${
                isActive
                  ? "translate-x-0 text-copper opacity-100"
                  : "translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
              }`}
            >
              {c.title}
            </span>
            <span
              className={`font-mono text-[10px] transition-colors duration-300 ${
                isActive ? "text-copper" : "text-muted"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`block rounded-full transition-all duration-400 ${
                isActive
                  ? "h-6 w-[3px] bg-copper"
                  : "size-[5px] bg-line-strong group-hover:bg-copper"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
