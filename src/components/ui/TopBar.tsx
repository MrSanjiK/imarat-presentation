"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { usePresentation } from "@/components/PresentationShell";
import { localePaths, locales, type Locale } from "@/dictionaries";
import { LOGOS } from "@/lib/media";
import Magnetic from "@/components/ui/Magnetic";
import UZ from "country-flag-icons/react/3x2/UZ";
import RU from "country-flag-icons/react/3x2/RU";
import GB from "country-flag-icons/react/3x2/GB";
import SA from "country-flag-icons/react/3x2/SA";
import CN from "country-flag-icons/react/3x2/CN";

const LANGS: Record<Locale, { native: string; code: string; FlagComponent: React.ComponentType<{ className?: string }> }> = {
  uz: { native: "O'zbekcha", code: "Uz", FlagComponent: UZ },
  ru: { native: "Русский", code: "Ру", FlagComponent: RU },
  en: { native: "English", code: "En", FlagComponent: GB },
  ar: { native: "العربية", code: "Ar", FlagComponent: SA },
  zh: { native: "中文", code: "中", FlagComponent: CN },
};

const PhoneIcon = ({ className = "size-3" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

function LangSwitcher() {
  const { dict, locale } = usePresentation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const CurrentFlag = LANGS[locale].FlagComponent;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-cursor="link"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={dict.ui.langLabel}
        onClick={() => setOpen((o) => !o)}
        className={`group flex h-9 items-center gap-2 rounded-full border py-2 pr-2.5 pl-3 transition-colors duration-300 ${
          open ? "border-copper text-copper" : "border-line hover:border-copper"
        }`}
      >
        {/* flag circle */}
        <span className="flex size-5 items-center justify-center overflow-hidden rounded-full">
          <CurrentFlag className="h-full w-full object-cover" />
        </span>
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase">
          {LANGS[locale].code}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`size-3 text-muted transition-transform duration-400 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* dropdown */}
      <div
        role="menu"
        className={`glass absolute top-[calc(100%+12px)] right-0 w-56 origin-top-right border border-line transition-all duration-400 ease-[var(--ease-out-expo)] ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1.5 scale-[0.97] opacity-0"
        }`}
        style={{ boxShadow: "var(--shadow)" }}
      >
        <p className="label-mono border-b border-line px-4 pt-3 pb-2.5">{dict.ui.langLabel}</p>
        {locales.map((l) => {
          const isActive = l === locale;
          const FlagComponent = LANGS[l].FlagComponent;
          return (
            <a
              key={l}
              role="menuitem"
              href={localePaths[l]}
              data-cursor="link"
              aria-current={isActive ? "page" : undefined}
              className={`group/item flex items-center justify-between border-b border-line px-4 py-3.5 transition-colors duration-300 last:border-b-0 ${
                isActive ? "bg-copper-soft text-copper" : "text-ink-soft hover:bg-copper-soft/40 hover:text-ink"
              }`}
            >
              <span className="flex items-center gap-3 text-[13.5px]">
                <span className="flex size-6 items-center justify-center overflow-hidden rounded-full">
                  <FlagComponent className="h-full w-full object-cover" />
                </span>
                <span
                  className={`font-display italic transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover/item:opacity-50"
                  }`}
                >
                  /
                </span>
                {LANGS[l].native}
              </span>
              <span
                className={`font-mono text-[10px] tracking-[0.18em] uppercase ${
                  isActive ? "text-copper" : "text-muted"
                }`}
              >
                {LANGS[l].code}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { dict } = usePresentation();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      data-cursor="link"
      aria-label={isDark ? dict.ui.themeLight : dict.ui.themeDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-copper hover:text-copper"
    >
      <svg
        viewBox="0 0 24 24"
        className={`absolute size-4 transition-all duration-500 ${isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className={`absolute size-4 transition-all duration-500 ${isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}

export default function TopBar() {
  const { dict, locale } = usePresentation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  /* native scroll listener — fires for wheel (lenis-driven), touch and
     programmatic scrolling alike, on every browser/WebView */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 40);
        const delta = y - lastY.current;
        if (Math.abs(delta) > 8) {
          setHidden(delta > 0 && y > 160);
          lastY.current = y;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[120] transition-[translate,background-color,border-color] duration-500 ease-[var(--ease-out-expo)] ${
        scrolled ? "glass border-b border-line" : ""
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:h-20 md:px-10">
        <a
          href={localePaths[locale]}
          aria-label="IMARAT Development"
          data-cursor="link"
          className="block shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGOS.white} alt="IMARAT Development" className="hidden h-5 w-auto md:h-6 dark:block" draggable={false} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGOS.dark} alt="IMARAT Development" className="h-5 w-auto md:h-6 dark:hidden" draggable={false} />
        </a>

        <div className="flex items-center gap-2 md:gap-3">
          <LangSwitcher />
          <ThemeToggle />

          {/* mobile: icon-only call */}
          <a
            href={`tel:${dict.ui.phone.replace(/\s/g, "")}`}
            data-cursor="link"
            aria-label={dict.ui.call}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-copper text-[#141210] transition-transform duration-300 active:scale-95 sm:hidden"
          >
            <PhoneIcon className="size-3.5" />
          </a>

          {/* desktop: full pill (display class on wrapper — Magnetic sets its own) */}
          <span className="hidden sm:block">
            <Magnetic>
              <a
                href={`tel:${dict.ui.phone.replace(/\s/g, "")}`}
                data-cursor="link"
                className="group flex h-9 items-center gap-2.5 rounded-full border border-line py-2 pr-4 pl-3 transition-colors duration-300 hover:border-copper"
              >
                <span className="grid size-6 place-items-center rounded-full bg-copper text-[#0d0c0a] transition-transform duration-500 group-hover:rotate-12">
                  <PhoneIcon />
                </span>
                <span className="font-mono text-xs tracking-wide whitespace-nowrap">{dict.ui.phone}</span>
              </a>
            </Magnetic>
          </span>
        </div>
      </div>
    </header>
  );
}
