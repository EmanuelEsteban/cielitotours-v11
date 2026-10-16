import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  homeDestinations, homeRegions, homeExperiences, initialRegionPicks, experienceLines, regionLines,
  filterHomeDestinations, quoteHref, type HomeDestination, type HomeExperience, type HomeRegion,
} from "@/lib/home-destinations";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const I = (d: ReactNode) => <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...S}>{d}</svg>;
const regionIcons: Record<HomeRegion, ReactNode> = {
  "México": I(<><path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></>),
  "Caribe": I(<><path d="M12 21V10" /><path d="M12 10c-3-3-6-3-8-1 2 0 4 .5 5 2M12 10c3-3 6-3 8-1-2 0-4 .5-5 2M12 10c-1-3-3-5-6-5M12 10c1-3 3-5 6-5" /><path d="M7 21h10" /></>),
  "Estados Unidos": I(<><path d="M4 21V11h4v10M10 21V5h4v16M16 21v-8h4v8M3 21h18" /></>),
  "Europa": I(<><path d="M12 3v3M8 21l4-15 4 15M9.5 15h5M7 21h10" /></>),
  "Sudamérica": I(<><path d="M2 19l6-9 4 5 3-4 7 8z" /><path d="M8 10l2 3" /></>),
  "Asia": I(<><path d="M3 8l9-4 9 4M5 8v10M9.5 8v10M14.5 8v10M19 8v10M3 20h18" /></>),
};
const expIcons: Record<HomeExperience, ReactNode> = {
  Playa: I(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
  Familia: I(<><circle cx="7" cy="7" r="2" /><circle cx="17" cy="7" r="2" /><circle cx="12" cy="11" r="1.6" /><path d="M4 20v-6a3 3 0 0 1 6 0M14 20v-6a3 3 0 0 1 6 0M10 20v-3a2 2 0 0 1 4 0v3" /></>),
  Romance: I(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />),
  Aventura: I(<><path d="M2 19l6-9 4 5 3-4 7 8z" /></>),
  Cultura: I(<><path d="M3 8l9-4 9 4M5 8v10M9.5 8v10M14.5 8v10M19 8v10M3 20h18" /></>),
  Bienestar: I(<><path d="M5 19c0-8 6-13 14-14-1 8-6 14-14 14z" /><path d="M5 19l8-8" /></>),
};

function Compass() {
  return (
    <svg className="d3-compass" viewBox="-60 -60 120 120" aria-hidden="true">
      <circle r="40" /><circle r="34" />
      <path className="d3-cp-s" d="M0 -48 L5 -5 L0 0 L-5 -5Z M0 48 L5 5 L0 0 L-5 5Z M-48 0 L-5 -5 L0 0 L-5 5Z M48 0 L5 -5 L0 0 L5 5Z" />
      <path d="M0 -26 L3 -3 L26 0 L3 3 L0 26 L-3 3 L-26 0 L-3 -3Z" transform="rotate(45)" />
      <text y="-52">N</text><text y="60">S</text><text x="-56" y="4">O</text><text x="56" y="4">E</text>
    </svg>
  );
}

function Card({ d, i, region, exp }: { d: HomeDestination; i: number; region: HomeRegion | null; exp: HomeExperience | null }) {
  return (
    <article className="d3-card" style={{ animationDelay: `${i * 75}ms` }}>
      <div className="d3-media">
        <img
          src={d.imagen}
          srcSet={d.imagenPequena ? `${d.imagenPequena} 480w, ${d.imagen} 896w` : undefined}
          sizes="(min-width: 1024px) 32vw, 82vw"
          width={896} height={1152} loading="lazy" decoding="async"
          alt={d.imagenAlt} style={d.imagenPosicion ? { objectPosition: d.imagenPosicion } : undefined}
        />
        <span className="d3-shade" aria-hidden="true" />
        <span className="d3-gold-edge" aria-hidden="true" />
        <span className="d3-sweep" aria-hidden="true" />
      </div>
      <div className="d3-body">
        <p className="d3-loc">{regionIcons["México"]}<span>{d.estadoRegion}{d.pais !== "México" && d.pais !== d.estadoRegion ? ` · ${d.pais}` : ""}</span></p>
        <h3 className="d3-name">{d.nombre}</h3>
        <p className="d3-desc">{d.descripcion}</p>
        <a className="d3-cta" href={quoteHref(d, region, exp)} aria-label={`Contactar para cotización: ${d.nombre}`}>
          <span>Contactar para cotización</span>
          <span className="d3-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" {...S}><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
        </a>
      </div>
    </article>
  );
}

export function DestinosRetro() {
  const [selectedRegion, setRegion] = useState<HomeRegion | null>(null);
  const [selectedExperience, setExp] = useState<HomeExperience | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState({ i: 0, n: 1, prev: false, next: false });

  const results = useMemo(() => {
    if (!selectedRegion && !selectedExperience) {
      return homeRegions.map((r) => homeDestinations.find((d) => d.id === initialRegionPicks[r])!);
    }
    return filterHomeDestinations(selectedRegion, selectedExperience);
  }, [selectedRegion, selectedExperience]);
  const key = `${selectedRegion ?? "-"}|${selectedExperience ?? "-"}`;

  const measure = useCallback(() => {
    const t = trackRef.current; if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    const n = Math.max(1, Math.round(t.scrollWidth / t.clientWidth + 0.15) || 1);
    setPage({ i: max <= 2 ? 0 : Math.round((t.scrollLeft / max) * (n - 1)), n: max <= 2 ? 1 : n, prev: t.scrollLeft > 4, next: t.scrollLeft < max - 4 });
  }, []);

  useEffect(() => {
    const t = trackRef.current; if (!t) return;
    t.scrollTo({ left: 0 });
    measure();
    const ro = new ResizeObserver(measure); ro.observe(t);
    t.addEventListener("scroll", measure, { passive: true });
    return () => { ro.disconnect(); t.removeEventListener("scroll", measure); };
  }, [key, measure]);

  const step = (dir: 1 | -1) => {
    const t = trackRef.current; if (!t) return;
    const card = t.querySelector<HTMLElement>(".d3-card");
    const w = card ? card.offsetWidth + 20 : t.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy({ left: dir * w, behavior: reduce ? "auto" : "smooth" });
  };
  const onTrackKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  };

  const hasFilter = !!(selectedRegion || selectedExperience);
  const line = selectedExperience ? experienceLines[selectedExperience] : selectedRegion ? regionLines[selectedRegion] : "Una mirada a cada región para empezar a imaginar.";

  return (
    <section id="destinos" className="d3" aria-labelledby="d3-title">
      <div className="d3-bg" aria-hidden="true"><span className="d3-map" /><span className="d3-haze" /><span className="d3-grain" /></div>

      <div className="d3-wrap">
        <header className="d3-head">
          <div className="d3-head-main">
            <p className="d3-kicker"><span className="d3-kl" aria-hidden="true" />Destinos<span className="d3-kl" aria-hidden="true" /></p>
            <h2 id="d3-title" className="d3-title"><span>México y el mundo</span> <span>están más <em>cerca.</em></span></h2>
            <p className="d3-intro">Hay viajes que empiezan por un lugar.<br /><em>Otros, por lo que quieres vivir.</em></p>
          </div>
          <div className="d3-deco" aria-hidden="true">
            <Compass />
            <div className="d3-deco-txt">
              <p className="d3-hand">Un mundo<br /><span>de posibilidades</span></p>
              <svg className="d3-hand-line" viewBox="0 0 160 12"><path d="M2 9 C50 2 110 2 158 6" /></svg>
              <p className="d3-words">Explora<br />Descubre<br />Vive</p>
            </div>
          </div>
        </header>

        <div className="d3-panel">
          <div className="d3-row" role="group" aria-labelledby="d3-l1">
            <div className="d3-rowlab">
              <span className="d3-rowico">{regionIcons["México"]}</span>
              <div><p id="d3-l1" className="d3-rowtit">Explora por lugar</p><p className="d3-rowsub">Descubre destinos que te inspiran.</p></div>
            </div>
            <div className="d3-opts">
              {homeRegions.map((r) => (
                <button key={r} type="button" className="d3-opt d3-opt-r" aria-pressed={selectedRegion === r} onClick={() => setRegion(selectedRegion === r ? null : r)}>
                  {regionIcons[r]}<span>{r}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="d3-row" role="group" aria-labelledby="d3-l2">
            <div className="d3-rowlab">
              <span className="d3-rowico">{expIcons.Romance}</span>
              <div><p id="d3-l2" className="d3-rowtit">Elige por lo que quieres vivir</p><p className="d3-rowsub">Cada viaje es una emoción diferente.</p></div>
            </div>
            <div className="d3-opts">
              {homeExperiences.map((x) => (
                <button key={x} type="button" className="d3-opt d3-opt-x" aria-pressed={selectedExperience === x} onClick={() => setExp(selectedExperience === x ? null : x)}>
                  {expIcons[x]}<span>{x}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="d3-res-head">
          <div className="d3-res-title">
            <p className="d3-res-k">{hasFilter ? "Destinos en" : "Una mirada al mundo"}</p>
            <h3 aria-live="polite">
              {hasFilter ? <>
                {selectedRegion && <span>{selectedRegion}</span>}
                {selectedRegion && selectedExperience && <span className="d3-plus"> + </span>}
                {selectedExperience && <em>{selectedExperience}</em>}
              </> : <span>Seis regiones</span>}
            </h3>
          </div>
          <p className="d3-res-line">{line}</p>
          <div className="d3-res-ctrl">
            {hasFilter && <button type="button" className="d3-clear" onClick={() => { setRegion(null); setExp(null); }}>Limpiar filtros</button>}
            {results.length > 0 && <>
              <button type="button" className="d3-nav" onClick={() => step(-1)} disabled={!page.prev} aria-label="Destinos anteriores"><svg viewBox="0 0 24 24" width="18" height="18" {...S}><path d="M15 6l-6 6 6 6" /></svg></button>
              <button type="button" className="d3-nav" onClick={() => step(1)} disabled={!page.next} aria-label="Más destinos"><svg viewBox="0 0 24 24" width="18" height="18" {...S}><path d="M9 6l6 6-6 6" /></svg></button>
            </>}
          </div>
        </div>

        {results.length > 0 ? (
          <div ref={trackRef} key={key} className="d3-track" tabIndex={0} role="region" aria-roledescription="carrusel" aria-label={`Destinos: ${results.length} resultados. Usa las flechas para moverte.`} onKeyDown={onTrackKey}>
            {results.map((d, i) => <Card key={d.id} d={d} i={i} region={selectedRegion} exp={selectedExperience} />)}
          </div>
        ) : (
          <div className="d3-empty" role="status">
            <p className="d3-empty-t">Aún no tenemos sugerencias para {selectedRegion} + {selectedExperience}.</p>
            <p className="d3-empty-s">Cuéntanos qué imaginas y te ayudamos a encontrar el lugar indicado.</p>
            <a className="d3-cta d3-cta-solid" href={`/cotizar?${new URLSearchParams({ region: selectedRegion ?? "", experiencia: selectedExperience ?? "", origen: "home-destinos" })}`}>Consultar un viaje a medida</a>
          </div>
        )}

        <div className="d3-foot">
          {page.n > 1 && results.length > 0 ? (
            <div className="d3-dots" aria-hidden="true">{Array.from({ length: page.n }, (_, i) => <span key={i} className={i === page.i ? "on" : ""} />)}</div>
          ) : <span />}
          <a href="/viajes" className="d3-more">Ver más destinos <svg viewBox="0 0 32 12" width="28" height="12" {...S}><path d="M1 6h29M25 1l5 5-5 5" /></svg></a>
        </div>
        <p className="d3-sign" aria-hidden="true">Tu próxima<br />historia empieza aquí</p>
      </div>
    </section>
  );
}
