"use client";

import { usePresentation } from "@/components/PresentationShell";

export default function SlideCounter() {
  const { dict, active } = usePresentation();
  // Exclude intro (0) and contact (last) from the total count
  const total = dict.chapters.length - 2;

  return (
    <div
      className={`fixed bottom-5 left-5 z-[110] flex items-baseline gap-2 transition-opacity duration-500 md:left-10 ${
        active === 0 ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span key={active} className="counter-in font-display text-2xl text-copper tabular-nums">
        {String(active).padStart(2, "0")}
      </span>
      <span className="font-mono text-[10px] text-muted">/ {String(total).padStart(2, "0")}</span>
      <span className="label-mono ml-2 hidden md:inline">{dict.chapters[active]?.title}</span>
    </div>
  );
}
