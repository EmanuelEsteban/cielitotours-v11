import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { ROUTE_DASH, clamp01, isDesktop, prefersReducedMotion } from "./tokens";

type Size = { w: number; h: number };
type Pt = { x: number; y: number };
export type RouteShape = string | { d: string; stops?: Pt[] } | null;
type Props = {
  /** Builds the path in real pixels so the SVG never deforms. Return null to hide at that size. */
  build: (s: Size) => RouteShape;
  /** time: draws once, plane loops independently of scroll. scroll: draw + plane follow scroll. */
  mode: "time" | "scroll";
  duration?: number;
  delay?: number;
  /** Section driving scroll progress (start 80% → end 30%). */
  target?: RefObject<HTMLElement | null>;
  /** Background the line sits on — controls base/comet colors. */
  tone?: "light" | "dark";
  gradient?: (s: Size) => { x1: number; x2: number; stops: [number, number][] };
  /** Plane loop period in time mode. */
  loopMs?: number;
  className?: string;
  /** Layer for the plane (above cards). */
  planeClassName?: string;
  /** Fires when the plane reaches / leaves the last stop. */
  onEnd?: (reached: boolean) => void;
  /** Viewport fraction where the section bottom must be for progress = 1 (scroll mode). */
  endAt?: number;
  /** Fires when the plane reaches / leaves each stop (index). */
  onStop?: (index: number, reached: boolean) => void;
};

const COMET = [[120, 0.25], [70, 0.55], [28, 1]] as const;
const TRAIL = 10;

export function ScrollRoute({ build, mode, duration = 1800, delay = 0, target, tone = "light", gradient, loopMs = 14000, className, planeClassName, onEnd, onStop, endAt = 0.3 }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const maskPath = useRef<SVGPathElement>(null);
  const comet = useRef<(SVGPathElement | null)[]>([]);
  const plane = useRef<SVGGElement>(null);
  const trail = useRef<(SVGCircleElement | null)[]>([]);
  const stopEls = useRef<(SVGGElement | null)[]>([]);
  const [size, setSize] = useState<Size | null>(null);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  const onStopRef = useRef(onStop);
  onStopRef.current = onStop;
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shape = size ? build(size) : null;
  const d = typeof shape === "string" ? shape : shape?.d ?? null;
  const stops = shape && typeof shape !== "string" ? shape.stops ?? [] : [];
  const stopKey = stops.map((s) => `${s.x | 0},${s.y | 0}`).join("|");

  useEffect(() => {
    const p = path.current, m = maskPath.current, pl = plane.current;
    if (!d || !p || !m || !pl) return;
    const len = p.getTotalLength();
    const reduced = prefersReducedMotion();
    const desktop = isDesktop();
    const useComet = desktop && !reduced;
    const planeSize = desktop ? 40 : 28;
    // stop fractions: nearest sampled length
    const samples = Array.from({ length: 300 }, (_, i) => { const l = (len * i) / 299; return { l, pt: p.getPointAtLength(l) }; });
    const stopL = stops.map((s) => samples.reduce((b, c) => (Math.hypot(c.pt.x - s.x, c.pt.y - s.y) < Math.hypot(b.pt.x - s.x, b.pt.y - s.y) ? c : b)).l);
    m.style.strokeDasharray = `${len} ${len}`;
    comet.current.forEach((c, i) => { if (c) c.style.strokeDasharray = `${COMET[i]![0]} ${len + 200}`; c && (c.style.display = useComet ? "" : "none"); });
    const hist: Pt[] = [];
    let lastHist = 0;
    let ended = false;
    const stopOn: boolean[] = stopL.map(() => false);

    const reveal = (prog: number) => { m.style.strokeDashoffset = `${len * (1 - clamp01(prog))}`; };
    const placePlane = (at: number, opacity: number, now: number) => {
      const pt = p.getPointAtLength(at);
      const a = p.getPointAtLength(Math.max(0, at - 1)), b = p.getPointAtLength(Math.min(len, at + 1));
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 45; // lucide Plane nose points at -45°
      const fl = reduced ? 0 : Math.sin(now / 700) * 3;
      pl.setAttribute("transform", `translate(${pt.x} ${pt.y + fl}) rotate(${ang}) scale(${planeSize / 30})`);
      pl.style.opacity = String(opacity);
      if (!reduced && now - lastHist > 45) { hist.unshift({ x: pt.x, y: pt.y + fl }); hist.length = Math.min(hist.length, TRAIL); lastHist = now; }
      trail.current.forEach((c, i) => {
        if (!c) return;
        const h = hist[i + 1];
        if (!h || reduced) { c.style.opacity = "0"; return; }
        c.setAttribute("cx", String(h.x)); c.setAttribute("cy", String(h.y));
        c.style.opacity = String(opacity * 0.6 * (1 - i / TRAIL));
      });
      stopL.forEach((l, i) => {
        const on = at >= l - (i === stopL.length - 1 ? 14 : 2);
        stopEls.current[i]?.classList.toggle("is-on", on);
        if (on !== stopOn[i]) { stopOn[i] = on; onStopRef.current?.(i, on); }
      });
      const end = stopL.length > 0 && at >= Math.min(stopL[stopL.length - 1]!, len) - 14;
      if (end !== ended) { ended = end; onEndRef.current?.(end); }
    };
    const placeComet = (head: number) => {
      comet.current.forEach((c, i) => { if (c) c.style.strokeDashoffset = `${-(head - COMET[i]![0])}`; });
    };

    if (reduced) { reveal(1); placePlane(mode === "scroll" ? len : len * 0.62, 1, 0); return; }

    let raf = 0, visible = true, cur = 0;
    const t0 = performance.now() + delay;
    const scrollTarget = () => {
      const sec = target?.current ?? wrap.current;
      if (!sec) return 0;
      const r = sec.getBoundingClientRect(), vh = window.innerHeight;
      return clamp01((vh * 0.8 - r.top) / (vh * (0.8 - endAt) + r.height));
    };
    const tick = (now: number) => {
      raf = 0;
      if (mode === "time") {
        const t = clamp01((now - t0) / duration);
        const drawn = 1 - Math.pow(1 - t, 3);
        reveal(drawn);
        const ph = ((now - t0) % loopMs) / loopMs;
        const op = now < t0 ? 0 : ph < 0.06 ? ph / 0.06 : ph > 0.86 ? clamp01((1 - ph) / 0.14) : 1;
        placePlane(Math.min(len * drawn, len * ph), op, now);
        if (useComet) placeComet(len * drawn * (((now % 6000) / 6000)) + 0);
      } else {
        const tgt = scrollTarget();
        cur += (tgt - cur) * 0.08;
        if (Math.abs(tgt - cur) < 0.0005) cur = tgt;
        reveal(cur);
        placePlane(len * cur, cur > 0.002 ? 1 : 0, now);
        if (useComet) placeComet(len * cur * ((now % 6000) / 6000));
      }
      if (visible || (mode === "scroll" && Math.abs(scrollTarget() - cur) > 0.0005)) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(tick); }, { rootMargin: "200px" });
    if (wrap.current) io.observe(wrap.current);
    cur = scrollTarget();
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, mode, stopKey]);

  const g = size && gradient ? gradient(size) : null;
  const dark = tone === "dark";
  const baseStroke = g ? `url(#g${id})` : dark ? "color-mix(in oklab, var(--accent) 70%, transparent)" : "color-mix(in oklab, var(--ink) 62%, transparent)";
  const cometColor = dark ? "var(--accent)" : "var(--gold-deep)";
  const svgProps = size ? { width: size.w, height: size.h, viewBox: `0 0 ${size.w} ${size.h}`, className: "block overflow-visible" } : null;
  return <>
    <div ref={wrap} aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {svgProps && d && <svg {...svgProps}>
        <defs>
          <mask id={`m${id}`} maskUnits="userSpaceOnUse" x={-50} y={-50} width={size!.w + 100} height={size!.h + 100}><path ref={maskPath} d={d} fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" /></mask>
          {g && <linearGradient id={`g${id}`} gradientUnits="userSpaceOnUse" x1={g.x1} y1={0} x2={g.x2} y2={0}>{g.stops.map(([o, a]) => <stop key={o} offset={o} stopColor="var(--accent)" stopOpacity={a} />)}</linearGradient>}
        </defs>
        <g mask={`url(#m${id})`}>
          <path ref={path} d={d} fill="none" stroke={baseStroke} strokeWidth={dark ? 3 : 3.5} strokeDasharray={ROUTE_DASH} strokeLinecap="round" className={cn("ruta-flow", dark && "ruta-glow")} />
          {COMET.map(([, o], i) => <path key={i} ref={(el) => { comet.current[i] = el; }} d={d} fill="none" stroke={cometColor} strokeOpacity={o} strokeWidth={4} strokeLinecap="round" className="ruta-comet" />)}
        </g>
      </svg>}
    </div>
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 z-20", planeClassName)}>
      {svgProps && d && <svg {...svgProps}>
        {stops.map((s, i) => <g key={i} ref={(el) => { stopEls.current[i] = el; }} className={cn("ruta-stop", dark && "is-dark")} transform={`translate(${s.x} ${s.y})`}><circle className="ruta-stop-ring" r={6} /><circle className="ruta-stop-dot" r={6} /></g>)}
        {Array.from({ length: TRAIL }, (_, i) => <circle key={i} ref={(el) => { trail.current[i] = el; }} r={2.6 - i * 0.18} fill={cometColor} style={{ opacity: 0 }} />)}
        <g ref={plane} style={{ opacity: 0 }} className="ruta-plane">
          <svg x={-15} y={-15} width={30} height={30} viewBox="0 0 24 24" overflow="visible"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" fill="var(--accent)" stroke="var(--ink)" strokeWidth={1.1} strokeLinejoin="round" /></svg>
        </g>
      </svg>}
    </div>
  </>;
}
