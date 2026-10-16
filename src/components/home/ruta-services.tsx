import { useEffect, useRef, useState } from "react";
import { ArrowRight, BedDouble, BriefcaseBusiness, Map, Plane, Ship, Trophy } from "lucide-react";
import { imagery } from "@/lib/site-data";
import { Reveal, TitleLines } from "@/components/motion/reveal";
import { ScrollRoute, type RouteShape } from "@/components/motion/scroll-route";
import { TiltCard } from "@/components/motion/tilt-card";
import { isDesktop, prefersReducedMotion } from "@/components/motion/tokens";
import { cn } from "@/lib/utils";
import { AtlasBg } from "./atlas-bg";
import { PaseTickets } from "./pase-tickets";
import { heroRouteEndX } from "./ruta-hero";

const cards = [
  { name: "Vuelos", note: "La ruta adecuada para empezar", href: "/servicios/vuelos", image: imagery.flights, icon: Plane, xl: 7, row: "a", tablet: "full" },
  { name: "Hospedaje", note: "Estancias que son parte del viaje", href: "/servicios/hospedaje", image: imagery.hotel, icon: BedDouble, xl: 5, row: "a" },
  { name: "Paquetes", note: "Todo el viaje, bien coordinado", href: "/viajes", image: imagery.europe, icon: Map, xl: 4 },
  { name: "Cruceros", note: "Muchos destinos, una maleta", href: "/cruceros", image: imagery.cruise, icon: Ship, xl: 8, tablet: "full" },
  { name: "Empresas", note: "Rutas, estancias y traslados alineados a la agenda del equipo.", href: "/cotizar", image: imagery.empresas1, icon: BriefcaseBusiness, xl: 6, group: true },
  { name: "Deportivos", note: "Equipos, clubes y delegaciones, listos para llegar juntos.", href: "/cotizar", image: imagery.deportivos1, icon: Trophy, xl: 6, group: true },
] as const;

const spans: Record<number, string> = { 4: "xl:col-span-4", 5: "xl:col-span-5", 6: "xl:col-span-6", 7: "xl:col-span-7", 8: "xl:col-span-8" };

/** Rounded polyline through points (corner radius r). */
function rounded(pts: { x: number; y: number }[], r = 60) {
  const f = pts[0]!;
  let d = `M ${f.x} ${f.y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i - 1]!, c = pts[i]!, n = pts[i + 1]!;
    const l1 = Math.hypot(c.x - p.x, c.y - p.y), l2 = Math.hypot(n.x - c.x, n.y - c.y);
    const k = Math.min(r, l1 / 2, l2 / 2);
    d += ` L ${c.x - ((c.x - p.x) / l1) * k} ${c.y - ((c.y - p.y) / l1) * k} Q ${c.x} ${c.y} ${c.x + ((n.x - c.x) / l2) * k} ${c.y + ((n.y - c.y) / l2) * k}`;
  }
  const last = pts[pts.length - 1]!;
  return `${d} L ${last.x} ${last.y}`;
}

export function RutaServices() {
  const section = useRef<HTMLElement>(null);
  const kicker = useRef<HTMLParagraphElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const compactRef = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);

  // internal photo parallax ±24px (desktop only)
  useEffect(() => {
    const g = grid.current;
    if (!g || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight, on = isDesktop();
      g.querySelectorAll<HTMLElement>(".ruta-cell").forEach((c) => {
        const r = c.getBoundingClientRect();
        const t = on ? Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh)) : 0;
        c.style.setProperty("--py", `${(t * -24).toFixed(1)}px`);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); };
  }, []);

  const buildRoute = ({ w, h }: { w: number; h: number }): RouteShape => {
    if (w < 1024) return { d: `M ${w * 0.1} 34 Q ${w * 0.5} 4 ${w * 0.9} 40`, stops: [] };
    const sec = section.current, k = kicker.current, g = grid.current, cp = compactRef.current;
    if (!sec || !k || !g || !cp) return null;
    const o = sec.getBoundingClientRect();
    const rel = (r: DOMRect) => ({ l: r.left - o.left, r: r.right - o.left, t: r.top - o.top, b: r.bottom - o.top });
    const kr = rel(k.getBoundingClientRect()), gr = rel(g.getBoundingClientRect()), cr = rel(cp.getBoundingClientRect());
    const cells = Array.from(g.querySelectorAll<HTMLElement>(".ruta-cell")).map((c) => rel(c.getBoundingClientRect()));
    const tops = [...new Set(cells.map((c) => Math.round(c.t)))].sort((a, b) => a - b);
    const rows = tops.map((t) => ({ t, b: Math.max(...cells.filter((c) => Math.round(c.t) === t).map((c) => c.b)) }));
    const mL = Math.max(18, gr.l / 2), mR = Math.min(w - 18, gr.r + (w - gr.r) / 2);
    const cx = (gr.l + gr.r) / 2;
    const kStop = { x: kr.l + Math.min(kr.r - kr.l, 420) + 36, y: kr.t + (kr.b - kr.t) / 2 };
    const pts = [{ x: w * heroRouteEndX, y: -4 }, { x: w * heroRouteEndX, y: kStop.y }, kStop, { x: mR, y: kStop.y }, { x: mR, y: rows[0]!.b + 8 }];
    const stops = [kStop];
    let side: "r" | "l" = "r";
    for (let i = 0; i < rows.length - 1; i++) {
      const y = (rows[i]!.b + rows[i + 1]!.t) / 2;
      const nx = side === "r" ? mL : mR;
      pts.push({ x: side === "r" ? mR : mL, y }, { x: nx, y });
      stops.push({ x: cx, y });
      side = side === "r" ? "l" : "r";
    }
    // Finale: enter the first boarding pass (Autos) at its vertical centre.
    const first = cp.querySelector<HTMLElement>(".pase-cell");
    const fr = first ? rel(first.getBoundingClientRect()) : { l: gr.l, t: cr.t, b: cr.b, r: gr.l };
    const endY = fr.t + (fr.b - fr.t) / 2;
    if (side === "r") { const gy = gr.b + 28; pts.push({ x: mR, y: gy }, { x: mL, y: gy }); }
    pts.push({ x: mL, y: endY }, { x: fr.l, y: endY });
    const end = pts[pts.length - 1]!;
    stops.push(end);
    // drop duplicates
    const clean = pts.filter((p, i) => i === 0 || Math.hypot(p.x - pts[i - 1]!.x, p.y - pts[i - 1]!.y) > 1);
    return { d: rounded(clean, 70), stops };
  };

  return <section ref={section} id="servicios" className="mobile-section relative isolate z-[2] pb-6 pt-16 sm:pb-4 sm:pt-28">
    <AtlasBg />
    <ScrollRoute mode="scroll" tone="light" target={section} build={buildRoute} onEnd={setArrived} endAt={0.9} className="z-0" planeClassName="z-20" />
    <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
      <div className="grid items-end gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="max-w-4xl">
          <p ref={kicker} className="home-kicker"><span aria-hidden="true" className="ruta-kicker-line" />¿Qué necesitas para tu viaje?</p>
          <TitleLines as="h2" className="home-h2 mt-5 lg:whitespace-nowrap" lines={[<>Todo lo que <span key="i" className="home-accent-light">imaginas</span>.</>, <span key="g" className="home-h2-gradient">Un mismo equipo.</span>]} />
        </div>
        <Reveal delay={200} className="lg:justify-self-end"><p className="home-lead max-w-[44ch] lg:text-right">Elige solo lo que necesitas o déjanos armarlo todo en una propuesta a tu medida.</p></Reveal>
      </div>

      <div ref={grid} className="ruta-grid mt-10 md:mt-14">
        {cards.map((c, i) => {
          const Icon = c.icon;
          const group = "group" in c;
          return <Reveal key={c.name} variant="clip" delay={i * 90} className={cn("ruta-cell", spans[c.xl], "row" in c && "ruta-row-a", "tablet" in c && "md:col-span-2")}>
            <a href={c.href} aria-label={c.name} className="ruta-card h-full">
              <TiltCard>
                <div className="ruta-zoom absolute inset-0 overflow-hidden"><img src={c.image} alt="" loading="lazy" className={cn("ruta-photo ruta-graded size-full object-cover", group && "object-[50%_0%]")} /></div>
                <div className="ruta-card-grain absolute inset-0" />
                <div className="ruta-card-navy absolute inset-0" />
                <div className="ruta-sheen" />
                <span aria-hidden="true" className={cn("home-outline-num absolute right-4 top-2 sm:right-6 sm:top-3", group && "home-outline-soft")}>{String(i + 1).padStart(2, "0")}</span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground sm:p-7">
                  <Icon className="size-5 text-accent" />
                  {group && <p className="mt-3 kicker-text font-bold uppercase tracking-[.16em] text-accent max-md:hidden">Viajes en grupo</p>}
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="ruta-card-title font-display text-xl font-bold md:text-[clamp(30px,2.6vw,48px)] md:leading-[1.05]">{c.name}</h3>
                      <p className="mt-2 text-sm text-primary-foreground/90 max-md:line-clamp-1 max-sm:hidden md:text-[18px] md:leading-7 xl:text-[19px]">{c.note}</p>
                    </div>
                    <span className="ruta-arrow grid size-11 shrink-0 place-items-center rounded-full border border-primary-foreground/40 max-sm:hidden"><ArrowRight className="size-5" /></span>
                  </div>
                </div>
              </TiltCard>
            </a>
          </Reveal>;
        })}
      </div>

      <PaseTickets ref={compactRef} arrived={arrived} />
        </div>
  </section>;
}
