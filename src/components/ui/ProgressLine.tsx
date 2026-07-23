"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";

export default function ProgressLine() {
  const bar = useRef<HTMLDivElement>(null);

  useLenis(({ scroll, limit }) => {
    if (bar.current) {
      const p = limit > 0 ? scroll / limit : 0;
      bar.current.style.transform = `scaleX(${p})`;
    }
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[130] h-[2px]">
      <div
        ref={bar}
        className="h-full origin-left bg-gradient-to-r from-copper to-gold"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
