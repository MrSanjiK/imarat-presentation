"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useGSAP(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("cursor-none-native");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    gsap.set([dot, ring, label], { xPercent: -50, yPercent: -50, force3D: true });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
    const labelX = gsap.quickTo(label, "x", { duration: 0.35, ease: "power3.out" });
    const labelY = gsap.quickTo(label, "y", { duration: 0.35, ease: "power3.out" });

    let visible = false;

    const onMove = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      labelX(e.clientX);
      labelY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as Element).closest?.("[data-cursor]");
      if (!t) return;
      const text = t.getAttribute("data-cursor-label");
      if (text) {
        label.textContent = text;
        gsap.to(ring, { scale: 0, autoAlpha: 0, duration: 0.3 });
        gsap.to(label, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(1.6)" });
        gsap.to(dot, { autoAlpha: 0, duration: 0.2 });
      } else {
        gsap.to(ring, { scale: 1.7, duration: 0.35, ease: "power3.out" });
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = (e.target as Element).closest?.("[data-cursor]");
      if (!t) return;
      gsap.to(ring, { scale: 1, autoAlpha: 1, duration: 0.35 });
      gsap.to(label, { scale: 0.4, autoAlpha: 0, duration: 0.25 });
      gsap.to(dot, { autoAlpha: 1, duration: 0.2 });
    };

    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });
    const onLeaveDoc = () => {
      visible = false;
      gsap.to([dot, ring, label], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);

    return () => {
      document.documentElement.classList.remove("cursor-none-native");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
    };
  });

  return (
    <div aria-hidden className={enabled ? "" : "hidden"}>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[310] size-1.5 rounded-full bg-copper opacity-0"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[300] size-9 rounded-full border border-copper/70 opacity-0"
      />
      <div
        ref={labelRef}
        className="pointer-events-none fixed top-0 left-0 z-[305] grid size-20 scale-50 place-items-center rounded-full bg-copper text-center font-mono text-[10px] leading-tight tracking-[0.12em] whitespace-pre-line text-[#141210] uppercase opacity-0"
      />
    </div>
  );
}
