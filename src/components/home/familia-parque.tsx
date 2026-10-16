import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import familia from "@/assets/vf-familia.webp";
import noria from "@/assets/vf-noria.webp";
import coaster from "@/assets/vf-coaster.webp";
import noche from "@/assets/vf-noche.webp";

const PANELS = [
  { src: familia, alt: "Familia sonriendo en un parque al atardecer", cls: "vf-p-familia" },
  { src: noria, alt: "Rueda de la fortuna al atardecer", cls: "vf-p-noria" },
  { src: coaster, alt: "Montaña rusa futurista con personas disfrutando", cls: "vf-p-coaster" },
  { src: noche, alt: "Palacio iluminado con fuegos artificiales de noche", cls: "vf-p-noche" },
];

/** Riel decorativo inferior. `#vf-rail` queda listo para un tren futuro (fase siguiente). */
const CW = 1600, CH = 300;
const G = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2));
const mainY = (x: number) => 238 - 46 * G(x, 300, 50) - 150 * G(x, 620, 105) - 62 * G(x, 905, 95) - 40 * G(x, 1130, 60) - 70 * G(x, 1360, 62) + 6 * Math.sin(x / 70);
const farY = (x: number) => 150 - 38 * Math.sin(x / 150 + 2) - 16 * Math.sin(x / 61);
const line = (f: (x: number) => number, dy = 0, step = 8) => {
  let d = "";
  for (let x = -40; x <= CW + 40; x += step) d += `${d ? " L" : "M"} ${x} ${(f(x) + dy).toFixed(1)}`;
  return d;
};
function truss(f: (x: number) => number, gap: number, base: number) {
  let legs = "", brace = "";
  for (let x = 10; x < CW; x += gap) {
    const y = f(x) + 12;
    legs += ` M ${x - 4} ${y} L ${x - 7} ${base} M ${x + 4} ${y} L ${x + 7} ${base}`;
    for (let yy = y + 14; yy < base - 10; yy += 22) brace += ` M ${x - 5} ${yy} L ${x + 5} ${yy + 18} M ${x + 5} ${yy} L ${x - 5} ${yy + 18}`;
  }
  return { legs, brace };
}
function palm(x: number, s: number, lean: number, seed: number) {
  const h = 150 * s, tx = x + lean * h, ty = CH - h;
  const trunk = `M ${x - 6 * s} ${CH} Q ${x + lean * h * 0.3} ${CH - h * 0.55} ${tx - 2.4 * s} ${ty} L ${tx + 2.4 * s} ${ty} Q ${x + lean * h * 0.3 + 6 * s} ${CH - h * 0.55} ${x + 6 * s} ${CH} Z`;
  let rings = "";
  for (let i = 1; i < 14; i++) { const t = i / 14; const rx = x + (tx - x) * t * t * 0.4 + (tx - x) * t * 0.6, ry = CH - h * t; rings += ` M ${rx - 5 * s * (1 - t * 0.5)} ${ry} l ${10 * s * (1 - t * 0.5)} -2`; }
  const fronds: string[] = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI + (i / (n - 1)) * Math.PI + Math.sin(seed + i) * 0.18;
    const L = (58 + 18 * Math.sin(seed * 3 + i * 1.7)) * s;
    const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.55 + L * 0.55;
    const cx = tx + Math.cos(a) * L * 0.55, cy = ty + Math.sin(a) * L * 0.7 - 6 * s;
    let leaf = `M ${tx} ${ty} Q ${cx} ${cy} ${ex} ${ey}`;
    for (let k = 1; k < 12; k++) {
      const t = k / 12, px = (1 - t) ** 2 * tx + 2 * (1 - t) * t * cx + t * t * ex, py = (1 - t) ** 2 * ty + 2 * (1 - t) * t * cy + t * t * ey;
      const ll = (1 - t * 0.7) * 16 * s;
      const dx = 2 * (1 - t) * (cx - tx) + 2 * t * (ex - cx), dyy = 2 * (1 - t) * (cy - ty) + 2 * t * (ey - cy), m = Math.hypot(dx, dyy) || 1;
      const nx = -dyy / m, ny = dx / m;
      leaf += ` M ${px} ${py} q ${nx * ll * 0.5 + dx / m * 3} ${ny * ll * 0.5 + 4} ${nx * ll + dx / m * 5} ${ny * ll + ll * 0.6} M ${px} ${py} q ${-nx * ll * 0.5 + dx / m * 3} ${-ny * ll * 0.5 + 4} ${-nx * ll + dx / m * 5} ${-ny * ll + ll * 0.6}`;
    }
    fronds.push(leaf);
  }
  return { trunk, rings, fronds: fronds.join(" ") };
}
function bush(x: number, w: number, h: number, seed: number) {
  let d = `M ${x - w / 2} ${CH}`;
  const n = 7;
  for (let i = 0; i <= n; i++) { const px = x - w / 2 + (w * i) / n; const py = CH - h * (0.55 + 0.45 * Math.sin((i / n) * Math.PI)) * (0.85 + 0.15 * Math.sin(seed + i * 2.3)); d += ` Q ${px - w / n / 2} ${py - h * 0.18} ${px} ${py}`; }
  return d + ` L ${x + w / 2} ${CH} Z`;
}
function legs(f: (x: number) => number, gap: number) {
  let d = "", br = "";
  for (let x = 30; x < CW; x += gap) {
    const y = f(x) + 3;
    d += ` M ${x} ${y.toFixed(1)} L ${x - 3} ${CH} M ${x} ${y.toFixed(1)} L ${x + 3} ${CH}`;
    if (CH - y > 70) br += ` M ${x - 1.5} ${(y + (CH - y) * 0.45).toFixed(1)} L ${x + gap - 1.5} ${(f(x + gap) + 3 + (CH - f(x + gap) - 3) * 0.45).toFixed(1)}`;
  }
  return { legs: d, brace: br };
}
const MAIN = { rail: line(mainY, 0, 4), guard: line(mainY, -7, 4), ...legs(mainY, 96) };
const FAR = { rail: line(farY), rail2: line(farY, 6), ...truss(farY, 48, CH) };
const PALMS_BACK = [[80, 0.8, 0.05, 1], [430, 0.7, -0.04, 2], [980, 0.75, 0.06, 3], [1330, 0.85, -0.03, 4]].map(([x, s, l, k]) => palm(x!, s!, l!, k!));
const PALMS_FRONT = [[170, 1.15, 0.1, 5], [235, 0.95, -0.08, 6], [1450, 1.2, -0.1, 7], [1530, 0.9, 0.07, 8]].map(([x, s, l, k]) => palm(x!, s!, l!, k!));
const BUSHES_BACK = [[300, 260, 46, 1], [700, 320, 38, 2], [1100, 300, 44, 3], [1500, 280, 40, 4]].map(([x, w, h, k]) => bush(x!, w!, h!, k!)).join(" ");
const BUSHES_FRONT = [[90, 300, 58, 5], [520, 240, 30, 6], [900, 260, 26, 7], [1380, 340, 60, 8]].map(([x, w, h, k]) => bush(x!, w!, h!, k!)).join(" ");

function BottomCoaster() {
  const svgRef = useRef<SVGSVGElement>(null);
  const trainRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const svg = svgRef.current, train = trainRef.current;
    const rail = svg?.querySelector<SVGPathElement>("#vf-rail");
    if (!svg || !train || !rail) return;
    const cars = Array.from(train.children) as SVGGElement[];
    const L = rail.getTotalLength(), GAP = 27, LEN = GAP * (cars.length - 1);
    const place = (s: number) => cars.forEach((c, i) => {
      const at = s - i * GAP;
      const q = Math.min(L, Math.max(0, at));
      const a = rail.getPointAtLength(Math.max(0, q - 8)), b = rail.getPointAtLength(Math.min(L, q + 8)), m = rail.getPointAtLength(q);
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      c.setAttribute("transform", `translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) rotate(${ang.toFixed(2)})`);
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      place(470); train.style.opacity = "1"; return;
    }
    // Inercia: la velocidad depende de la altura (energía), más lenta arriba, rápida abajo.
    const S0 = 60 + LEN, S1 = L - 30, STEP = 4;
    let yTop = Infinity, yBot = -Infinity;
    for (let q = 0; q <= L; q += STEP) { const y = rail.getPointAtLength(q).y; yTop = Math.min(yTop, y); yBot = Math.max(yBot, y); }
    const ss: number[] = [], ts: number[] = [];
    let acc = 0;
    for (let q = S0; q <= S1; q += STEP) {
      let y = 0; for (let i = 0; i < cars.length; i++) y += rail.getPointAtLength(Math.max(0, q - i * GAP)).y; y /= cars.length;
      const h = (y - yTop) / (yBot - yTop || 1);
      ss.push(q); ts.push(acc); acc += STEP / (0.35 + Math.sqrt(Math.max(0, h)));
    }
    const DUR = 14500, FADE = 700;
    const sAt = (t: number) => {
      const tt = (t / DUR) * acc; let lo = 0, hi = ts.length - 1;
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ts[mid]! <= tt) lo = mid; else hi = mid; }
      const k = (tt - ts[lo]!) / ((ts[hi]! - ts[lo]!) || 1);
      return ss[lo]! + (ss[hi]! - ss[lo]!) * k;
    };
    let raf = 0, last = 0, t = 0, running = false;
    const tick = (now: number) => {
      if (last) t += Math.min(64, now - last);
      last = now;
      if (t > DUR) t -= DUR;
      place(sAt(t));
      train.style.opacity = String(Math.min(1, t / FADE, (DUR - t) / FADE));
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !running) { running = true; last = 0; raf = requestAnimationFrame(tick); }
      else if (!e?.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(svg);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return (
    <svg ref={svgRef} className="vf-coaster" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="vf-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF4E6" stopOpacity="0" />
          <stop offset=".55" stopColor="#FBF4E6" stopOpacity=".55" />
          <stop offset="1" stopColor="#F7EBD3" stopOpacity=".95" />
        </linearGradient>
        <linearGradient id="vf-railg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9C6E35" /><stop offset=".5" stopColor="#C89A55" /><stop offset="1" stopColor="#9C6E35" />
        </linearGradient>
        <linearGradient id="vf-frond" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A47A45" /><stop offset="1" stopColor="#C9A774" />
        </linearGradient>
        <radialGradient id="vf-glow" cx=".5" cy="1" r=".7">
          <stop offset="0" stopColor="#FFF6E2" stopOpacity=".9" /><stop offset="1" stopColor="#FFF6E2" stopOpacity="0" />
        </radialGradient>
        <filter id="vf-blur-far"><feGaussianBlur stdDeviation="1.4" /></filter>
        <filter id="vf-blur-mid"><feGaussianBlur stdDeviation=".6" /></filter>
      </defs>

      {/* Fondo: colinas y coaster lejano en bruma */}
      <g className="vf-l-far" filter="url(#vf-blur-far)">
        <path className="vf-hill" d={`M -40 ${CH} L -40 210 C 200 170 380 200 620 180 S 1100 165 1300 190 S 1560 175 1640 185 L 1640 ${CH} Z`} />
        <path className="vf-far-sup" d={FAR.legs + FAR.brace} />
        <path className="vf-far-rail" d={FAR.rail} /><path className="vf-far-rail" d={FAR.rail2} />
        {PALMS_BACK.map((p, i) => <g key={i} className="vf-palm-far"><path d={p.trunk} /><path className="vf-fr" d={p.fronds} /></g>)}
      </g>
      <rect x="-40" y="120" width={CW + 80} height={CH - 120} fill="url(#vf-mist)" opacity=".7" />

      {/* Capa media: arbustos traseros */}
      <path className="vf-bush-back" d={BUSHES_BACK} filter="url(#vf-blur-mid)" />

      {/* Capa del coaster principal */}
      <g className="vf-l-main">
        <path className="vf-sup-leg" d={MAIN.legs} />
        <path className="vf-sup-brace" d={MAIN.brace} />
        <path className="vf-guard" d={MAIN.guard} />
        <path id="vf-rail" className="vf-rail" d={MAIN.rail} />
        <path className="vf-rail-hl" d={MAIN.rail} transform="translate(0 -1)" />
      </g>

      <rect x="-40" y="190" width={CW + 80} height={CH - 190} fill="url(#vf-mist)" opacity=".8" />

      {/* Vegetación frontal suave */}
      <g className="vf-l-front">
        {PALMS_FRONT.map((p, i) => <g key={i} className="vf-palm"><path className="vf-trunk" d={p.trunk} /><path className="vf-ring" d={p.rings} /><path className="vf-fr" d={p.fronds} /></g>)}
        <path className="vf-bush" d={BUSHES_FRONT} />
      </g>
      <ellipse cx={CW / 2} cy={CH} rx={CW * 0.6} ry="70" fill="url(#vf-glow)" />
      <g ref={trainRef} className="vf-train" style={{ opacity: 0 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} className="vf-car">
            <path className="vf-car-body" d={i === 0 ? "M -11 0 L 8 0 Q 14 0 14 -4 Q 12 -9 4 -9 L -11 -9 Z" : "M -11 0 L 11 0 L 12 -9 L -12 -9 Z"} />
            <path className="vf-car-line" d="M -10 -4.5 H 10" />
            {(i === 0 ? [-4] : [-5, 4]).map((x, j) => (
              <g key={j} className="vf-rider" transform={`translate(${x} -9)`}>
                <circle cx="0" cy="-6.5" r="2.3" />
                <path d="M -2.6 0 Q -2.6 -4 0 -4 Q 2.6 -4 2.6 0 Z" />
                {(i + j) % 2 === 1 && i > 0 && <path className="vf-arms" d="M -1.8 -3.6 L -3.6 -10 M 1.8 -3.6 L 3.6 -10" />}
              </g>
            ))}
            {i === 0 && <circle className="vf-car-light" cx="12.5" cy="-4" r="1.4" />}
          </g>
        ))}
      </g>
    </svg>
  );
}

export function FamiliaParque() {
  return (
    <section className="familia-vf">
      <div className="vf-bg" aria-hidden="true" />
      <svg className="vf-top" viewBox="0 0 1600 90" preserveAspectRatio="none" aria-hidden="true">
        <path className="vf-top-fill" d="M0 0 H1600 V36 C 1320 70 1060 22 800 40 S 260 82 0 46 Z" />
        <path className="vf-top-edge" d="M1600 36 C 1320 70 1060 22 800 40 S 260 82 0 46" />
    </svg>

      <div className="vf-collage" aria-hidden="false">
        {PANELS.map((p) => (
          <figure key={p.cls} className={`vf-panel ${p.cls}`}>
            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>

      <BottomCoaster />
      <div className="vf-bokeh" aria-hidden="true" />

      <div className="vf-grid">
        <div className="vf-text">
          <p className="vf-kicker">Viajes en familia</p>
          <h2 className="vf-title">
            La <span className="vf-accent">emoción</span> empieza antes de llegar.
            <svg className="vf-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0 C13 9 15 11 24 12 C15 13 13 15 12 24 C11 15 9 13 0 12 C9 11 11 9 12 0Z" /></svg>
          </h2>
          <span className="vf-rule" aria-hidden="true" />
          <p className="vf-copy">Te ayudamos a coordinar viaje, hospedaje, parques, traslados y una planeación que también deje espacio para descansar.</p>
          <p className="vf-note">Servicio independiente de planeación de viajes.<br /> No se afirma afiliación con marcas o parques.</p>
          <Link to="/cotizar" className="vf-btn">
            <span>Planear mi viaje en familia</span>
            <span className="vf-btn-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
