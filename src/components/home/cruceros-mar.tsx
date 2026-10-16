import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
// foto con permiso del cliente, sin afiliación con navieras
const cruiseBay = { url: "/images/cruceros-pv-1920.jpg" }; // original 1920×1080

const titleA = ["Muchos", "destinos."];
const titleB = ["Una", "maleta."];

// Destellos solo sobre zonas de agua de la foto (% del contenedor de la foto)
const glints = [
  [52, 26, 3.1], [60, 22, 4.2], [68, 28, 2.4], [74, 20, 3.6], [80, 25, 4.8], [86, 30, 2.9],
  [91, 23, 3.9], [64, 33, 2.2], [57, 30, 4.5], [83, 35, 3.3], [70, 36, 2.6], [95, 32, 4.1],
  [8, 74, 3.5], [12, 79, 2.3], [6, 83, 4.4], [15, 86, 3.0], [10, 70, 4.9], [18, 81, 2.7],
] as const;

/** Crest dissolves: fill is a vertical gradient from 0 % at the crest to the layer's opacity lower down. */
const WAVE_FADE: Record<string, [number, number, number, number]> = {
  // [offset of 1st stop, opacity there, offset of 2nd stop, opacity there]
  "cm-wave-back": [0.09, 0.4, 1, 0.4],
  "cm-wave-mid": [0.1, 0.6, 1, 0.6],
  "cm-wave-front": [0.11, 0.45, 0.25, 0.85],
};

// Estrellas del 45 % superior: [x %, y % del bloque abstracto, tamaño px, opacidad, retraso s]
const stars = [
  [6, 22, 2, .7, 0], [18, 48, 3, .9, 1.4], [33, 14, 2, .6, 2.6], [47, 36, 2, .8, .7], [58, 10, 3, .5, 3.3],
  [71, 30, 2, .9, 1.9], [84, 16, 2, .6, 4.1], [93, 42, 3, .8, 2.2], [39, 58, 2, .5, 5.0], [77, 54, 2, .7, .3],
] as const;

/** Nautical chart contours (depth-map curves) drawn in a 1440×400 box. */
const CHART = Array.from({ length: 7 }, (_, k) => {
  const y = 40 + k * 48, a = 26 + k * 6;
  return `M -20 ${y} C 240 ${y - a} 420 ${y + a} 720 ${y} S 1200 ${y - a} 1460 ${y + a / 2}`;
});

function Waves({ className }: { className: string }) {
  const d = "M0 40 C 120 10 240 10 360 40 S 600 70 720 40 S 960 10 1080 40 S 1320 70 1440 40 V120 H0 Z";
  const [o1, a1, o2, a2] = WAVE_FADE[className] ?? [0.1, 1, 1, 1];
  const id = `${className}-fill`;
  return (
    <div className={`cm-wave ${className}`} aria-hidden="true">
      <svg viewBox="0 0 2880 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset={o1} stopColor="currentColor" stopOpacity={a1} />
            <stop offset={o2} stopColor="currentColor" stopOpacity={a2} />
            <stop offset="1" stopColor="currentColor" stopOpacity={a2} />
          </linearGradient>
        </defs>
        <path d={d} fill={`url(#${id})`} />
        <path d={d} transform="translate(1440 0)" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

export function CrucerosMar() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vis = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0 });
    const enter = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setEntered(true);
          enter.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    vis.observe(el);
    enter.observe(el);
    return () => {
      vis.disconnect();
      enter.disconnect();
    };
  }, []);

  let w = 0;
  const word = (t: string, gold = false) => {
    const i = w++;
    return (
      <span key={t + i} className={`cm-word${gold ? " cm-gold" : ""}`} style={{ transitionDelay: `${0.25 + i * 0.12}s` }}>
        {t}
      </span>
    );
  };

  return (
    <section
      id="cruceros"
      ref={ref}
      className={`cruceros-mar mobile-section${inView ? "" : " is-paused"}${entered ? " is-in" : ""}`}
    >
      <div className="cm-clip">
        <div className="cm-grain" aria-hidden="true" />
        <div className="cm-abstract" aria-hidden="true">
          <span className="cm-glow cm-glow-a" />
          <span className="cm-glow cm-glow-b" />
          <svg className="cm-chart" viewBox="0 0 1440 400" preserveAspectRatio="none">{CHART.map((d, i) => <path key={i} d={d} />)}</svg>
          <svg className="cm-compass" viewBox="0 0 90 90" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="45" cy="45" r="40" /><circle cx="45" cy="45" r="30" strokeDasharray="2 4" />
            <path d="M45 5 L50 45 L45 85 L40 45 Z M5 45 L45 40 L85 45 L45 50 Z" />
          </svg>
          {stars.map(([x, y, s, o, d], i) => (
            <span key={i} className="cm-star" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, opacity: o, "--o": o, animationDelay: `-${d}s`, animationDuration: `${5 + (i % 4)}s` } as React.CSSProperties} />
          ))}
        </div>
        <div className="cm-photo">
          <div className="cm-lift"><div className="cm-adj" data-ajustable="Cruceros (foto)"><div className="cm-bob">
            <img
              src={cruiseBay.url}
              alt="Dos cruceros atracados frente a la bahía de Puerto Vallarta"
              loading="lazy"
              width={1920}
              height={1080}
              className="cm-img"
            />
          </div></div></div>
          <div className="cm-tint" aria-hidden="true" />
          <div className="cm-foam" aria-hidden="true" />
          <div aria-hidden="true">
            {glints.map(([x, y, d], i) => (
              <span key={i} className="cm-glint" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s`, animationDuration: `${3 + (i % 4)}s` }} />
            ))}
          </div>
          <Waves className="cm-wave-back" />
        </div>
        <Waves className="cm-wave-mid" />
        <Waves className="cm-wave-front" />

        <div className="cm-content">
          <p className="cm-kicker"><span className="cm-kicker-line" aria-hidden="true" />Viajar por mar</p>
          <h2 className="cm-title">
            <span className="cm-line">{titleA.map((t) => word(t))}</span>
            <span className="cm-line">{titleB.map((t) => word(t, true))}</span>
          </h2>
          <p className="cm-copy">Comparamos rutas, temporadas y tipos de cabina para ayudarte a elegir con claridad. La disponibilidad se confirma al cotizar.</p>
          <div className="cm-cta">
            <Button asChild className="cm-btn w-full max-sm:min-h-11 sm:w-auto"><Link to="/cruceros">Descubrir cruceros <ArrowRight /></Link></Button>
          </div>
        </div>
      </div>
      <svg className="cm-shore" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 H1440 V22 C1320 70 1200 74 1080 46 S 840 6 720 34 S 480 84 360 58 S 120 14 0 40 Z" />
      </svg>
    </section>
  );
}
