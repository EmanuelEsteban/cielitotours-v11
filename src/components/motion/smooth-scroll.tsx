import { useEffect } from "react";
import { isDesktop, isFinePointer, prefersReducedMotion } from "./tokens";

/** Mount only on "/". Adds `ruta-js` (enables hidden initial states) and Lenis for wheel on desktop. */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    if (!prefersReducedMotion()) root.classList.add("ruta-js");
    let destroy = () => {};
    let cancelled = false;
    if (!prefersReducedMotion() && isDesktop() && isFinePointer()) {
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        const header = document.querySelector("header");
        const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false, anchors: { offset: -((header?.getBoundingClientRect().height ?? 80) + 8) } });
        let raf = requestAnimationFrame(function loop(t) { lenis.raf(t); raf = requestAnimationFrame(loop); });
        destroy = () => { cancelAnimationFrame(raf); lenis.destroy(); };
      });
    }
    return () => { cancelled = true; destroy(); root.classList.remove("ruta-js"); };
  }, []);
  return null;
}
