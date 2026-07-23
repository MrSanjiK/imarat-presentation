"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLenis } from "lenis/react";
import { usePresentation } from "@/components/PresentationShell";
import { localePaths, locales, localeNames } from "@/dictionaries";
import { LOGOS } from "@/lib/media";
import Magnetic from "@/components/ui/Magnetic";

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
      className="relative grid size-9 place-items-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-copper hover:text-copper"
    >
      <svg
        viewBox="0 0 24 24"
        className={`absolute size-4 transition-all duration-500 ${isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {/* sun */}
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
        {/* moon */}
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}

export default function TopBar() {
  const { dict, locale } = usePresentation();
  const [scrolled, setScrolled] = useState(false);

  useLenis(({ scroll }) => {
    setScrolled(scroll > 40);
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[120] transition-all duration-500 ${
        scrolled ? "glass border-b border-line" : ""
      }`}
    >
      <div className="flex h-16 items-center justify-between px-5 md:h-20 md:px-10">
        <a
          href={localePaths[locale]}
          aria-label="IMARAT Development"
          data-cursor="link"
          className="block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGOS.white} alt="IMARAT Development" className="hidden h-5 w-auto md:h-6 dark:block" draggable={false} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGOS.dark} alt="IMARAT Development" className="h-5 w-auto md:h-6 dark:hidden" draggable={false} />
        </a>

        <div className="flex items-center gap-2.5 md:gap-4">
          <nav aria-label={dict.ui.langLabel} className="flex items-center gap-1 font-mono text-[11px] tracking-[0.14em] uppercase">
            {locales.map((l) => (
              <a
                key={l}
                href={localePaths[l]}
                data-cursor="link"
                aria-current={l === locale ? "page" : undefined}
                className={`rounded-full px-2.5 py-1.5 transition-colors duration-300 ${
                  l === locale
                    ? "bg-copper-soft text-copper"
                    : "text-muted hover:text-ink"
                }`}
              >
                {localeNames[l]}
              </a>
            ))}
          </nav>

          <span className="hidden h-5 w-px bg-line md:block" />

          <ThemeToggle />

          <Magnetic className="hidden sm:block">
            <a
              href={`tel:${dict.ui.phone.replace(/\s/g, "")}`}
              data-cursor="link"
              className="group flex items-center gap-2.5 rounded-full border border-line py-2 pr-4 pl-3 transition-colors duration-300 hover:border-copper"
            >
              <span className="grid size-6 place-items-center rounded-full bg-copper text-[#0d0c0a] transition-transform duration-500 group-hover:rotate-12">
                <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                </svg>
              </span>
              <span className="font-mono text-xs tracking-wide whitespace-nowrap">{dict.ui.phone}</span>
            </a>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
