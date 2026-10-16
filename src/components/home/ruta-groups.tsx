import { ArrowRight, BriefcaseBusiness, Plane, Settings, Trophy, Users } from "lucide-react";
import { imagery } from "@/lib/site-data";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/reveal";
import { LAND_RINGS } from "@/lib/world-land-110m";

const panels = [
  { n: "01", name: "Empresas", href: "/grupos/empresas", icon: BriefcaseBusiness, image: imagery.empresas2, alt: "Colegas conversando en el pasillo de un centro de convenciones", note: "Rutas, estancias y traslados alineados a la agenda del equipo." },
  { n: "02", name: "Deportivos", href: "/grupos/deportivos", icon: Trophy, image: imagery.deportivos2, alt: "Equipo deportivo saliendo del túnel hacia la cancha", note: "Equipos, clubes, academias y delegaciones, listos para llegar juntos." },
] as const;

const steps = [
  { n: "01", icon: Users, title: "Nos cuentas tu plan", copy: "Entendemos tus objetivos, fechas y necesidades." },
  { n: "02", icon: Settings, title: "Diseñamos la experiencia", copy: "Coordinamos los detalles según las prioridades de tu grupo." },
  { n: "03", icon: Plane, title: "Tú solo disfrutas", copy: "Te acompañamos en la planeación y coordinación del viaje." },
] as const;

/** Cartographic globe: true orthographic projection of Natural Earth land outlines, spun on its axis (~100 s/rev). */
const GLOBE_R = 300, TILT = (16 * Math.PI) / 180, REV_MS = 100000, START_LON = -80;
const GRAT: number[][] = (() => {
  const lines: number[][] = [];
  for (let lat = -75; lat <= 75; lat += 15) { const l: number[] = []; for (let lon = -180; lon <= 180; lon += 3) l.push(lon * 10, lat * 10); lines.push(l); }
  for (let lon = -180; lon < 180; lon += 30) { const l: number[] = []; for (let lat = -90; lat <= 90; lat += 3) l.push(lon * 10, lat * 10); lines.push(l); }
  return lines;
})();
function project(rings: readonly number[][], lon0: number) {
  const D = Math.PI / 1800, l0 = lon0 * 10 * D, s0 = Math.sin(TILT), c0 = Math.cos(TILT);
  let d = "";
  for (const r of rings) {
    let pen = false;
    for (let i = 0; i < r.length; i += 2) {
      const lam = r[i]! * D - l0, phi = r[i + 1]! * D, cp = Math.cos(phi), sp = Math.sin(phi), cl = Math.cos(lam);
      if (s0 * sp + c0 * cp * cl < 0) { pen = false; continue; }
      const x = GLOBE_R * cp * Math.sin(lam), y = -GLOBE_R * (c0 * sp - s0 * cp * cl);
      d += `${pen ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; pen = true;
    }
  }
  return d;
}
const INIT_LAND = project(LAND_RINGS, START_LON), INIT_GRAT = project(GRAT, START_LON);

function Globe() {
  const land = useRef<SVGPathElement>(null), grat = useRef<SVGPathElement>(null), svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = svg.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, last = 0, visible = false, t0 = performance.now(), elapsed = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 40) return; // ~25 fps is plenty at this speed
      last = now;
      const lon = START_LON + ((elapsed + now - t0) / REV_MS) * 360;
      land.current?.setAttribute("d", project(LAND_RINGS, lon));
      grat.current?.setAttribute("d", project(GRAT, lon));
    };
    const io = new IntersectionObserver(([e]) => {
      if (e!.isIntersecting && !visible) { visible = true; t0 = performance.now(); raf = requestAnimationFrame(tick); }
      else if (!e!.isIntersecting && visible) { visible = false; elapsed += performance.now() - t0; cancelAnimationFrame(raf); }
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return <svg ref={svg} className="vg-globe" viewBox="-340 -340 680 680" aria-hidden="true">
    <circle r={326} className="vg-globe-ring" />
    <circle r={334} className="vg-globe-orbit vg-globe-orbit-glow" />
    <ellipse rx={338} ry={96} transform="rotate(-18)" className="vg-globe-orbit" />
    <path d="M-330 60 A 336 336 0 0 1 -150 -300" className="vg-globe-orbit vg-globe-orbit-glow" />
    <path d="M-336 0 H-300 M300 0 H336 M0 -336 V-300 M0 300 V336" className="vg-globe-aux" />
    <path d="M-240 -240 L-226 -226 M240 -240 L226 -226 M-240 240 L-226 226 M240 240 L226 226" className="vg-globe-aux" />
    <g className="vg-globe-card"><text y={-342}>N</text><text y={356}>S</text><text x={350} y={5}>E</text><text x={-350} y={5}>O</text></g>
    {ticks.map((d) => <line key={d} x1={0} y1={-326} x2={0} y2={d % 30 === 0 ? -314 : -320} transform={`rotate(${d})`} className="vg-globe-tick" />)}
    <g transform="rotate(-23.4)">
      <circle r={GLOBE_R} className="vg-globe-rim" />
      <path ref={grat} d={INIT_GRAT} className="vg-globe-grat" />
      <path ref={land} d={INIT_LAND} className="vg-globe-land" />
      <line x1={0} y1={-GLOBE_R - 22} x2={0} y2={-GLOBE_R + 4} className="vg-globe-axis" /><line x1={0} y1={GLOBE_R - 4} x2={0} y2={GLOBE_R + 22} className="vg-globe-axis" />
    </g>
  </svg>;
}

/** Long night contour strokes, stronger at the edges, plus faint mid/low lines. */
function Topo() {
  const mid = Array.from({ length: 5 }, (_, k) => `M-40 ${560 + k * 34} C 300 ${500 + k * 30} 520 ${640 + k * 26} 820 ${580 + k * 30} S 1300 ${520 + k * 34} 1640 ${600 + k * 28}`);
  const low = Array.from({ length: 4 }, (_, k) => `M-40 ${880 + k * 28} C 360 ${830 + k * 24} 700 ${930 + k * 20} 1040 ${880 + k * 24} S 1440 ${840 + k * 22} 1640 ${900 + k * 20}`);
  return <svg className="vg-topo" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g className="vg-topo-gold">
      <path d="M-40 520 C 60 430 40 330 130 260 S 260 160 220 40" />
      <path d="M-40 600 C 90 520 80 400 170 330 S 320 220 290 60" />
      <path d="M-40 700 C 120 640 130 520 230 450 S 400 360 380 180" />
      <path d="M1640 560 C 1520 600 1490 700 1530 800 S 1500 960 1420 1040" />
      <path d="M1640 480 C 1480 520 1440 640 1470 760 S 1430 940 1340 1040" />
      <path d="M1640 640 C 1540 680 1530 780 1570 860 S 1560 980 1500 1040" />
    </g>
    <g className="vg-topo-grey">
      <path d="M-40 380 C 80 330 100 220 60 120 S 90 -10 160 -40" />
      <path d="M-40 450 C 50 400 30 300 90 220 S 180 80 140 -40" />
      <path d="M-40 820 C 140 780 220 860 260 1040" />
      <path d="M-40 900 C 100 870 180 930 190 1040" />
      <path d="M1640 380 C 1540 400 1480 330 1500 230 S 1470 60 1380 -40" />
      <path d="M1640 300 C 1560 320 1520 250 1540 170 S 1520 40 1450 -40" />
      <path d="M1640 680 C 1560 700 1550 820 1600 900 S 1610 1000 1560 1040" />
      <path d="M520 -40 C 600 40 760 20 860 -40" />
    </g>
    <g className="vg-topo-faint">{mid.map((d, i) => <path key={i} d={d} />)}</g>
    <g className="vg-topo-tech">
      <path d="M-40 260 C 140 220 260 300 420 250 S 640 140 760 180" />
      <path d="M-40 300 C 160 262 280 340 440 292 S 660 186 780 226" />
      <path d="M1100 1040 C 1160 900 1320 880 1400 780 S 1560 640 1640 660" />
      <path d="M1060 1040 C 1130 880 1290 850 1370 750 S 1540 600 1640 610" />
      <circle cx="140" cy="900" r="210" /><circle cx="140" cy="900" r="260" strokeDasharray="2 7" />
      <path d="M960 -40 C 1000 120 1180 160 1240 300" strokeDasharray="6 10" />
      <path d="M300 760 L 520 760 M410 700 L410 820" />
    </g>
    <g className="vg-topo-faint vg-topo-faint-gold">{low.map((d, i) => <path key={i} d={d} />)}</g>
  </svg>;
}

/** V09-G2: champagne-gold seam. Cream surface (Destinos) above an asymmetric curve, coal below. Static, decorative. */
const SEAM = "C 300 98 640 26 960 44 S 1390 96 1600 38";
/** VF-G1C: companion filament — same rhythm, slightly different controls so the gap breathes (≈3–7 px). */
const SEAM2 = "C 320 104 620 30 970 50 S 1370 100 1600 46";
function GoldSeam() {
  return <div className="vg-seam" aria-hidden="true">
    <svg className="vg-seam-main" viewBox="0 0 1600 100" preserveAspectRatio="none" focusable="false">
      <defs>
        <linearGradient id="vg-seam-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#80602D" /><stop offset=".2" stopColor="#B89259" /><stop offset=".38" stopColor="#C39B52" />
          <stop offset=".52" stopColor="#F2D99B" /><stop offset=".66" stopColor="#C39B52" /><stop offset=".84" stopColor="#B89259" /><stop offset="1" stopColor="#80602D" />
        </linearGradient>
      </defs>
      <path className="vg-seam-fill" d={`M0 62 ${SEAM} V-2 H0 Z`} />
      <path className="vg-seam-halo" d={`M0 62 ${SEAM}`} />
      <path className="vg-seam-line" d={`M0 62 ${SEAM}`} stroke="url(#vg-seam-gold)" />
      <path className="vg-seam-glint" d={`M0 62 ${SEAM}`} pathLength={100} />
    </svg>
    <svg className="vg-seam-echo" viewBox="0 0 1600 100" preserveAspectRatio="none" focusable="false">
      <path d={`M0 64 ${SEAM2}`} stroke="url(#vg-seam-gold)" />
    </svg>
  </div>;
}

export function RutaGroups() {
  return <section id="grupos" className="vg mobile-section" aria-labelledby="vg-title">
    <GoldSeam />
    <div className="vg-bg" aria-hidden="true">
      <span className="vg-glow vg-glow-a" /><span className="vg-glow vg-glow-b" /><span className="vg-glow vg-glow-c" /><span className="vg-glow vg-glow-sea" />
      <Topo />
      <Globe />
      <svg className="vg-grain"><filter id="vg-noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(#vg-noise)" /></svg>
    </div>

    <div className="vg-tide" aria-hidden="true">
      <span className="vg-tide-bloom" />
      <svg viewBox="0 0 1600 300" preserveAspectRatio="none">{Array.from({ length: 6 }, (_, k) => <path key={k} className={k % 3 === 0 ? "vg-tide-gold" : ""} d={`M-20 ${60 + k * 36} C 260 ${20 + k * 34} 520 ${120 + k * 30} 800 ${70 + k * 34} S 1340 ${30 + k * 32} 1620 ${90 + k * 30}`} />)}</svg>
    </div>

    <div className="vg-wrap">
      <header className="vg-head">
        <div className="vg-head-main">
          <p className="vg-kicker vg-kicker-framed"><span aria-hidden="true" className="vg-kicker-line" />Viajes en grupo<span aria-hidden="true" className="vg-kicker-line" /></p>
          <h2 id="vg-title" className="vg-h2">Cuando todos viajan,<br /><em>cada detalle</em> cuenta.</h2>
          <p className="vg-lead">Coordinamos vuelos, hospedaje, traslados y logística con un solo punto de contacto.</p>
        </div>
        <div className="vg-head-side" aria-hidden="true">
          <p className="vg-hand">Más que viajes,<br />conexiones que inspiran.
            <svg className="vg-hand-line" viewBox="0 0 160 14"><path d="M2 11 C 50 2, 110 2, 158 6" /></svg>
          </p>
          <ul className="vg-words"><li>Personas</li><li>Destinos</li><li>Experiencias</li><li>Sin límites</li></ul>
          <p className="vg-aside">Viajar juntos<br />también transforma<span className="vg-aside-line" /></p>
        </div>
      </header>

      <div className="vg-cards">
        {panels.map((p, i) => {
          const Icon = p.icon;
          return <Reveal key={p.name} delay={i * 120} className="vg-cell">
            <a href={p.href} className="vg-card" aria-label={`${p.name}: ${p.note}`}>
              <img src={p.image} alt={p.alt} loading="lazy" width={2000} height={1260} className="vg-photo" />
              <span className="vg-shade" aria-hidden="true" />
              <span className="vg-num" aria-hidden="true">{p.n}</span>
              <span className="vg-body">
                <Icon className="vg-icon" aria-hidden="true" />
                <span className="vg-card-kicker">Viajes en grupo</span>
                <span className="vg-card-title">{p.name}</span>
                <span className="vg-card-note">{p.note}</span>
              </span>
              <span className="vg-arrow" aria-hidden="true"><ArrowRight /></span>
            </a>
          </Reveal>;
        })}
      </div>

      <div className="vg-process">
        <div className="vg-process-head">
          <p className="vg-kicker vg-kicker-sm">Nuestro proceso<span aria-hidden="true" className="vg-kicker-line" /></p>
          <h3 className="vg-h3">Un viaje en grupo,<br /><em>sin complicaciones.</em></h3>
        </div>
        <ol className="vg-steps">
          {steps.map((s) => {
            const Icon = s.icon;
            return <li key={s.n} className="vg-step">
              <span className="vg-step-medal" aria-hidden="true"><span className="vg-step-icon"><Icon /></span><span className="vg-step-n">{s.n}</span></span>
              <div className="vg-step-text">
                <p className="vg-step-title">{s.title}</p>
                <p className="vg-step-copy">{s.copy}</p>
              </div>
            </li>;
          })}
        </ol>
      </div>
    </div>
  </section>;
}
