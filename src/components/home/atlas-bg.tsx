import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { isDesktop, prefersReducedMotion } from "@/components/motion/tokens";

/** Deterministic "topographic" contours: wobbly closed curves around fixed centers (seeded, no deps). */
function contours(w: number, h: number) {
  const centers = [[0.18, 0.28, 1.0], [0.82, 0.55, 1.3], [0.4, 0.86, 0.9]] as const;
  let d = "";
  centers.forEach(([cx, cy, s], ci) => {
    for (let k = 1; k <= 5; k++) {
      const r = k * 70 * s;
      const pts: string[] = [];
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const wob = 1 + 0.16 * Math.sin(a * 3 + ci * 1.7 + k * 0.4) + 0.08 * Math.sin(a * 5 - k * 0.9 + ci);
        pts.push(`${(cx * w + Math.cos(a) * r * wob * 1.25).toFixed(1)},${(cy * h + Math.sin(a) * r * wob * 0.8).toFixed(1)}`);
      }
      d += `M${pts.join("L")}Z`;
    }
  });
  return d;
}

export function AtlasBg({ variant = "default", className }: { variant?: "default" | "deep"; className?: string }) {
  const topo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = topo.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!isDesktop()) return;
      const r = el.parentElement!.getBoundingClientRect();
      el.style.transform = `translate3d(0, ${(-r.top * 0.12).toFixed(1)}px, 0)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); };
  }, []);
  return <div aria-hidden="true" className={cn("atlas-bg", variant === "deep" && "atlas-deep", className)}>
    <div className="atlas-blob atlas-blob-a" />
    <div className="atlas-blob atlas-blob-b" />
    <div className="atlas-blob atlas-blob-c max-md:hidden" />
    <div ref={topo} className="atlas-topo max-md:hidden">
      <svg viewBox="0 0 1600 1400" preserveAspectRatio="xMidYMid slice" className="size-full"><path d={contours(1600, 1400)} fill="none" stroke="var(--ink)" strokeOpacity={0.08} strokeWidth={1} vectorEffect="non-scaling-stroke" /></svg>
    </div>
    <div className="atlas-ring atlas-ring-l max-md:hidden" />
    <div className="atlas-ring atlas-ring-r max-md:hidden" />
    <svg className="atlas-grain"><filter id="atlas-noise"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#atlas-noise)" /></svg>
  </div>;
}
