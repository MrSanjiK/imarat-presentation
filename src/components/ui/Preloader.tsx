"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { LOGOS } from "@/lib/media";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const seen = sessionStorage.getItem("imarat-intro") === "1";

      const finish = () => {
        sessionStorage.setItem("imarat-intro", "1");
        setGone(true);
      };

      if (reduced || seen) {
        onDone();
        gsap.to(el, { autoAlpha: 0, duration: 0.5, delay: 0.15, onComplete: finish });
        return;
      }

      const counter = { v: 0 };
      const num = el.querySelector<HTMLElement>("[data-counter]");
      const logo = el.querySelector<HTMLElement>("[data-logo]");
      const line = el.querySelector<HTMLElement>("[data-line]");
      const tag = el.querySelector<HTMLElement>("[data-tag]");

      const tl = gsap.timeline({
        onComplete: finish,
      });

      tl.set(el, { autoAlpha: 1 })
        .fromTo(
          logo,
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power3.inOut" },
          0.1,
        )
        .fromTo(tag, { opacity: 0, y: 12 }, { opacity: 0.65, y: 0, duration: 0.7 }, 0.9)
        .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0.15)
        .to(
          counter,
          {
            v: 100,
            duration: 1.7,
            ease: "power2.inOut",
            onUpdate: () => {
              if (num) num.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.15,
        )
        .add(() => onDone(), "-=0.1")
        .to(el, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          delay: 0.15,
        });
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[400] flex flex-col justify-between bg-[#0d0c0a] px-6 py-6 text-[#f2ede6] md:px-12 md:py-10"
      aria-hidden
    >
      <div className="label-mono !text-[#f2ede6]/50">IMARAT DEVELOPMENT</div>

      <div className="flex flex-col items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-logo
          src={LOGOS.gold}
          alt=""
          className="w-[min(62vw,460px)] opacity-0"
          draggable={false}
        />
        <p data-tag className="font-hand text-xl text-[#c98e76] opacity-0 md:text-2xl">
          est. 2021 — Toshkent
        </p>
      </div>

      <div className="flex items-end justify-between gap-8">
        <div data-line className="hairline mb-3 flex-1 origin-left !bg-[#f2ede6]/20" />
        <span
          data-counter
          className="font-mono text-5xl tracking-tight text-[#c98e76] tabular-nums md:text-7xl"
        >
          000
        </span>
      </div>
    </div>
  );
}
