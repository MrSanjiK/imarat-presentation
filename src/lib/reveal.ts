import { gsap } from "@/lib/gsap";

/** fade-up reveal for every [data-reveal] inside scope — call inside useGSAP */
export function setupReveals(scope: HTMLElement | null) {
  if (!scope) return;
  gsap.utils.toArray<HTMLElement>(scope.querySelectorAll("[data-reveal]")).forEach((el) => {
    gsap.from(el, {
      y: 34,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });
}
