"use client";

import { usePresentation } from "@/components/PresentationShell";

export default function SlideCounter() {
  const { dict, active } = usePresentation();
  const lastIndex = dict.chapters.length - 1;
  // Total main chapters (exclude intro and contact)
  const total = dict.chapters.length - 2;
  // Display number: skip intro (0), so chapter 1 shows as "01"
  const displayNumber = active === 0 ? 0 : active;

  return (
    <div
      className={`fixed bottom-5 left-5 z-[110] flex items-baseline gap-2 transition-opacity duration-500 md:left-10 ${
        active === 0 || active === lastIndex ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span key={active} className="counter-in font-display text-2xl text-copper tabular-nums">
        {String(displayNumber).padStart(2, "0")}
      </span>
      <span className="font-mono text-[10px] text-muted">/ {String(total).padStart(2, "0")}</span>
      <span className="label-mono ml-2 hidden md:inline">{dict.chapters[active]?.title}</span>
    </div>
  );
}
