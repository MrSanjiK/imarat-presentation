"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLenis } from "lenis/react";
import type { Dict, Locale } from "@/dictionaries";
import Preloader from "@/components/ui/Preloader";
import TopBar from "@/components/ui/TopBar";
import ChapterRail from "@/components/ui/ChapterRail";
import SlideCounter from "@/components/ui/SlideCounter";
import ProgressLine from "@/components/ui/ProgressLine";
import Cursor from "@/components/ui/Cursor";
import ProjectOverlay from "@/components/overlay/ProjectOverlay";

interface PresentationCtx {
  dict: Dict;
  locale: Locale;
  active: number;
  ready: boolean;
  goTo: (index: number) => void;
  openProject: (slug: string) => void;
  closeProject: () => void;
  overlaySlug: string | null;
}

const Ctx = createContext<PresentationCtx | null>(null);

export function usePresentation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePresentation must be used inside PresentationShell");
  return ctx;
}

export default function PresentationShell({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [overlaySlug, setOverlaySlug] = useState<string | null>(null);
  const lenis = useLenis();

  const chapterIds = useMemo(() => dict.chapters.map((c) => c.id), [dict.chapters]);

  /* track active chapter — section crossing viewport center */
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = chapterIds.indexOf(entry.target.getAttribute("data-chapter") ?? "");
            if (idx >= 0) setActive(idx);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [chapterIds]);

  const goTo = useCallback(
    (index: number) => {
      const id = chapterIds[Math.max(0, Math.min(chapterIds.length - 1, index))];
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { duration: 1.4 });
      else el.scrollIntoView({ behavior: "smooth" });
    },
    [chapterIds, lenis],
  );

  const openProject = useCallback((slug: string) => setOverlaySlug(slug), []);
  const closeProject = useCallback(() => setOverlaySlug(null), []);

  /* scroll lock while overlay open */
  useEffect(() => {
    if (!lenis) return;
    if (overlaySlug) lenis.stop();
    else lenis.start();
  }, [overlaySlug, lenis]);

  /* lock scroll during preloader */
  useEffect(() => {
    if (!lenis) return;
    if (!ready) lenis.stop();
    else if (!overlaySlug) lenis.start();
  }, [ready, lenis, overlaySlug]);

  /* keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (overlaySlug) return; // overlay has its own handlers
      const target = e.target as HTMLElement;
      const interactive = /^(input|textarea|select|button|a)$/i.test(target.tagName);
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          goTo(active + 1);
          break;
        case " ":
          if (interactive) return;
          e.preventDefault();
          goTo(active + (e.shiftKey ? -1 : 1));
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goTo(active - 1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(chapterIds.length - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo, overlaySlug, chapterIds.length]);

  const value = useMemo(
    () => ({ dict, locale, active, ready, goTo, openProject, closeProject, overlaySlug }),
    [dict, locale, active, ready, goTo, openProject, closeProject, overlaySlug],
  );

  return (
    <Ctx.Provider value={value}>
      <Preloader onDone={() => setReady(true)} />
      <ProgressLine />
      <TopBar />
      <ChapterRail />
      <SlideCounter />
      <Cursor />
      {children}
      {overlaySlug && <ProjectOverlay slug={overlaySlug} />}
      <p
        className={`label-mono fixed right-6 bottom-5 z-[110] hidden transition-opacity duration-500 xl:block ${
          active === 0 ? "opacity-0" : "opacity-50"
        }`}
      >
        {dict.ui.keyboardHint}
      </p>
    </Ctx.Provider>
  );
}
