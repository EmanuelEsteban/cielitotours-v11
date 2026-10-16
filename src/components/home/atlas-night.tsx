import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { isDesktop, prefersReducedMotion } from "@/components/motion/tokens";

/** Deterministic star field (x%, y%, size px, twinkle s, delay s). */
const STARS: [number, number, number, number, number][] = [
  [6, 12, 2, 4, 0], [14, 22, 3, 6, 1.2], [22, 9, 2, 5, 2.4], [31, 18, 2, 3.4, .6], [9, 38, 3, 6.4, 3],
  [18, 52, 2, 4.6, 1.8], [40, 8, 2, 5.4, 2], [48, 30, 3, 6.8, .4], [57, 14, 2, 3.8, 3.4], [66, 24, 2, 5, 1],
  [74, 10, 3, 4.4, 2.8], [83, 20, 2, 6, .2], [92, 14, 2, 3.6, 1.6], [88, 36, 3, 5.6, 2.2], [95, 50, 2, 4.2, .8],
  [78, 58, 2, 6.6, 3.2], [62, 70, 2, 3.2, 1.4], [70, 82, 3, 5.2, 2.6], [36, 66, 2, 4.8, .9], [26, 80, 2, 6.2, 2.1],
  [12, 72, 3, 3.9, 1.1], [4, 88, 2, 5.8, 3.6], [50, 90, 2, 4.1, .3], [86, 88, 2, 6.9, 1.9],
];
/** Mobile keeps the first 10 stars only (via CSS). Constellations join star indices. */
const CONSTELLATIONS = [[0, 1, 2, 3], [10, 11, 12, 13, 14], [16, 17, 18]];
const SPARKS: [number, number, number][] = [[28, 30, 18], [80, 44, 14], [58, 84, 20]];

function contours() {
  let d = "";
  for (let k = 1; k <= 14; k++) {
    const r = k * 42;
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const wob = 1 + 0.12 * Math.sin(a * 3 + k * 0.5) + 0.06 * Math.sin(a * 5 - k * 0.8);
      pts.push(`${(700 + Math.cos(a) * r * wob * 1.5).toFixed(1)},${(450 + Math.sin(a) * r * wob * 0.8).toFixed(1)}`);
    }
    d += `M${pts.join("L")}Z`;
  }
  return d;
}
const TOPO = contours();

/** Night version of the Atlas background — reusable via `.atlas-night`. */
export function AtlasNight({ className }: { className?: string }) {
  const topo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = topo.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!isDesktop()) { el.style.transform = ""; return; }
      const r = el.parentElement!.getBoundingClientRect();
      el.style.transform = `translate3d(0, ${(-r.top * 0.12).toFixed(1)}px, 0)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); };
  }, []);

  return <div aria-hidden="true" className={cn("atlas-night", className)}>
    <div className="an-fx">
      <span className="an-blob an-blob-aqua" />
      <span className="an-blob an-blob-pink" />
      <span className="an-blob an-blob-gold" />
      <div ref={topo} className="an-topo"><svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice"><path d={TOPO} /></svg></div>
      <span className="an-ring an-ring-a" />
      <span className="an-ring an-ring-b" />
      <svg className="an-const" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CONSTELLATIONS.map((c, i) => <polyline key={i} vectorEffect="non-scaling-stroke" points={c.map((s) => `${STARS[s]![0]},${STARS[s]![1]}`).join(" ")} />)}
      </svg>
      {STARS.map(([x, y, s, t, dl], i) => <span key={i} className="an-star" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDuration: `${t}s`, animationDelay: `-${dl}s`, opacity: 0.6 + (i % 4) * 0.1 }} />)}
      {SPARKS.map(([x, y, s], i) => <svg key={i} className="an-spark" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }} viewBox="0 0 20 20"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" /></svg>)}
      <span className="an-grain" />
    </div>
  </div>;
}
