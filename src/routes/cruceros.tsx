import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowRight, Car, Compass, MessageCircle, Minus, Plane, Plus, Hotel, Route as RouteIcon, Sailboat } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { imagery } from "@/lib/site-data";
import caribeImg from "@/assets/cru-caribe.webp";
import rivieraImg from "@/assets/cru-riviera.webp";
import mediImg from "@/assets/cru-mediterraneo.webp";
import alaskaImg from "@/assets/cru-alaska.webp";
import fiordosImg from "@/assets/cru-fiordos.webp";
import rioImg from "@/assets/cru-rio.webp";
import interiorImg from "@/assets/cru-interior.webp";
import exteriorImg from "@/assets/cru-exterior.webp";
import balconImg from "@/assets/cru-balcon.webp";
import suiteImg from "@/assets/cru-suite.webp";
import estelaImg from "@/assets/cru-estela.webp";
import horizonImg from "@/assets/cru-horizonte.webp";

export const Route = createFileRoute("/cruceros")({
  head: () => ({ meta: [
    { title: "Cruceros | Cielito Tours" },
    { name: "description", content: "Compara rutas, temporadas y cabinas con asesoría. Cotiza tu crucero con vuelo, hotel y traslados." },
    { property: "og:title", content: "Cruceros | Cielito Tours" },
    { property: "og:description", content: "Muchos destinos. Una sola maleta." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CruisesPage,
});

const ROUTES = [
  { id: "Caribe", name: "Caribe", line: "Playas turquesa e islas", tags: ["Familia", "Pareja"], season: "todo el año", img: caribeImg, alt: "Familia en la cubierta mirando una isla caribeña" },
  { id: "Riviera Mexicana", name: "Riviera Mexicana", line: "Pacífico mexicano de puerto en puerto", tags: ["Pareja", "Amigos"], season: "otoño a primavera", img: rivieraImg, alt: "Pareja riendo en cubierta al atardecer frente a la costa del Pacífico" },
  { id: "Mediterráneo", name: "Mediterráneo", line: "Historia, islas y sabores", tags: ["Pareja", "Cultura"], season: "primavera a otoño", img: mediImg, alt: "Pareja caminando por un malecón de pueblo mediterráneo" },
  { id: "Alaska", name: "Alaska", line: "Glaciares y naturaleza salvaje", tags: ["Aventura", "Familia"], season: "mayo a septiembre", img: alaskaImg, alt: "Madre e hijo observando un glaciar desde la cubierta" },
  { id: "Fiordos del Norte", name: "Fiordos del Norte", line: "Paisajes de Noruega desde el mar", tags: ["Naturaleza", "Pareja"], season: "verano", img: fiordosImg, alt: "Viajera con café mirando un fiordo con cascada" },
  { id: "Por río", name: "Cruceros por río", line: "Europa a ritmo tranquilo", tags: ["Cultura", "Pareja"], season: "primavera a otoño", img: rioImg, alt: "Pareja descansando en un barco de río entre viñedos" },
];
const ROUTE_OPTIONS = ["Caribe", "Riviera Mexicana", "Mediterráneo", "Alaska", "Fiordos del Norte", "Por río", "Otra", "Aún no sé"];
const CABINS = [
  { id: "Interior", tag: "Más accesible", copy: "Sin ventana. La opción más accesible para quien pasa el día fuera.", img: interiorImg },
  { id: "Exterior", tag: "Luz natural", copy: "Con ventana al mar y luz natural.", img: exteriorImg },
  { id: "Balcón", tag: "Vista privada", copy: "Tu propio espacio al aire libre para ver el mar.", img: balconImg },
  { id: "Suite", tag: "Más espacio", copy: "Más espacio y comodidades, según la naviera.", img: suiteImg },
];
const STOPS: [string, string][] = [
  ["Embarque y zarpe", "Tu viaje empieza al dejar el puerto."],
  ["Un día en altamar", "Descanso, comida y horizonte."],
  ["Primer puerto", "Bajas a explorar y vuelves a bordo."],
  ["Otro puerto, otra cultura", "Cada día, un paisaje distinto."],
  ["Regreso", "Con ganas de volver a zarpar."],
];
const FAQ: [string, string][] = [
  ["¿Qué incluye un crucero?", "En la mayoría de los cruceros la tarifa incluye tu cabina, las comidas en los restaurantes principales, el entretenimiento a bordo y el recorrido entre puertos. Normalmente se pagan aparte las bebidas especiales, las excursiones en tierra, las propinas y servicios como el spa. Como cada naviera y tarifa es distinta, al cotizar te explicamos con claridad qué incluye cada opción, para que no haya sorpresas."],
  ["¿Qué documentos necesito?", "Para la mayoría de los cruceros internacionales necesitas pasaporte vigente, idealmente con al menos seis meses de vigencia. Según los puertos de salida y de escala, también puede pedirse una visa o una autorización electrónica; por ejemplo, si el crucero sale de Estados Unidos o hace escala ahí. Los menores también necesitan su propia documentación. Al cotizar revisamos tu ruta y te confirmamos exactamente qué necesitas."],
  ["¿Puedo viajar con niños?", "¡Claro que sí! Muchos barcos están pensados para familias, con clubes infantiles por edades, albercas y actividades para todos. Cuéntanos las edades de tus hijos y te ayudamos a elegir la ruta, el barco y la cabina ideales para ustedes."],
  ["¿Pueden coordinar mi vuelo y hotel?", "Sí. Integramos todo en una sola propuesta: el vuelo para llegar al puerto con tiempo, una noche de hotel antes de zarpar si la necesitas, traslados y excursiones en cada escala. Tú solo te preocupas por disfrutar."],
  ["¿Me voy a marear?", "Los barcos grandes suelen sentirse muy estables. Si te preocupa, podemos recomendarte rutas de aguas generalmente tranquilas y cabinas en la parte central y en cubiertas bajas, donde el movimiento se siente menos."],
  ["¿Con cuánta anticipación conviene cotizar?", "Mientras antes, más opciones: con anticipación suele haber más variedad de cabinas y fechas, sobre todo en temporada alta y vacaciones escolares. Aun así, cuéntanos tus fechas y buscamos alternativas."],
];
const GUIDE: [string, string][] = [["cru-zarpa", "Zarpa"], ["cru-porque", "Por qué"], ["cru-semana", "La semana"], ["cru-rutas", "Rutas"], ["cru-cabinas", "Cabinas"], ["cotizar-crucero", "Tu cotización"]];

type Pre = { route?: string; cabin?: string; n: number };

function scrollToQuote() { document.getElementById("cotizar-crucero")?.scrollIntoView({ behavior: "smooth", block: "start" }); }

function CruisesPage() {
  const [pre, setPre] = useState<Pre>({ n: 0 });
  const choose = (p: Omit<Pre, "n">) => { setPre((c) => ({ ...p, n: c.n + 1 })); scrollToQuote(); };
  return (
    <SiteShell>
      <div className="cru-page">
      {/* 1 HERO */}
      <section id="cru-zarpa" className="relative min-h-[76vh] overflow-hidden">
        <img src={imagery.cruise} alt="Crucero blanco navegando en mar abierto al atardecer" className="absolute inset-0 size-full object-cover object-[70%_center]" fetchPriority="high" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="cru-hero-glow absolute inset-0" />
        <div className="cru-hero-fade absolute inset-x-0 bottom-0 h-40" />
        <div className="cru-pad relative mx-auto flex min-h-[76vh] max-w-7xl items-end px-5 pb-44 pt-24 text-primary-foreground lg:px-8">
          <div className="max-w-4xl">
            <p className="cru-kicker mb-6" data-guide-title>Cruceros</p>
            <h1><span className="cru-h1a block">Muchos <span className="cru-gold-it">destinos</span>.</span><span className="cru-h1b mt-2 block">Una sola maleta.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 opacity-95">Comparamos rutas, temporadas y tipos de cabina para ayudarte a elegir con claridad.</p>
            <p className="mt-3 text-sm font-semibold tracking-wide" style={{ color: "color-mix(in oklab, var(--accent) 70%, white)" }}>Caribe · Riviera Mexicana · Mediterráneo · Alaska</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" className="cru-btn-primary min-h-12" onClick={scrollToQuote}>Planear mi viaje <ArrowRight /></Button>
              <Link to="/contacto" className="cru-btn-glass inline-flex min-h-12 items-center gap-2 rounded-md px-6 font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><MessageCircle className="size-5" /> Hablar con un asesor</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="cru-flow relative">
      {/* 2 POR QUÉ */}
      <section id="cru-porque" className="cru-cream-aqua relative overflow-hidden py-16 sm:py-24">
        <img src={horizonImg} alt="" aria-hidden="true" loading="lazy" width={1536} height={1024} className="cru-horizon pointer-events-none absolute inset-0 hidden size-full object-cover object-right lg:block" />
        <div className="cru-glow left-[-6%] top-10 size-96 opacity-[.08]" style={{ background: "var(--cru-teal)" }} />
        <div className="cru-glow bottom-0 right-[20%] size-80 opacity-[.07]" style={{ background: "var(--accent)" }} />
        <div className="cru-pad relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="kicker-line uppercase text-primary">Una forma distinta de viajar</p>
          <h2 data-guide-title className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">Despiertas en un <span className="hl-accent">puerto</span> nuevo.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Desempacas una sola vez y recorres varios destinos.", "Hay rutas para cada estilo: familia, pareja, amigos o primera vez.", "A bordo encuentras comida, descanso y entretenimiento, según la naviera y la tarifa.", "Coordinamos contigo vuelo, hotel y traslados al puerto."].map((t, i) => (
              <div key={t} className="cru-glass cru-shadow cru-lift rounded-sm p-7"><span className="cru-num font-display text-6xl font-bold">0{i + 1}</span><span className="mt-4 block h-0.5 w-10 bg-accent" /><p className="mt-5 font-display text-lg font-bold leading-snug text-ink">{t}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 RUTA */}
      <RouteMoment />

      {/* 4 RUTAS */}
      <section id="cru-rutas" className="cru-cream relative overflow-hidden py-16 sm:py-24">
        <div className="cru-glow right-[-8%] top-[-4%] size-[28rem] opacity-[.1]" style={{ background: "var(--accent)" }} />
        <div className="cru-pad relative mx-auto max-w-7xl px-5 lg:px-8">
          <p className="kicker-line uppercase text-primary">Posibilidades, no itinerarios</p>
          <h2 data-guide-title className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">Elige el <span className="hl-accent">mar</span> que quieres conocer.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">Rutas de referencia para empezar la conversación. Fechas, barcos y tarifas se confirman al cotizar.</p>
          <div className="mt-10 grid gap-5 lg:grid-cols-5">
            {ROUTES.map((r, i) => (
              <article key={r.id} className={`cru-route cru-shadow group relative min-h-[420px] overflow-hidden ${[0, 3, 4].includes(i) ? "lg:col-span-3" : "lg:col-span-2"}`}>
                <img src={r.img} alt={r.alt} loading="lazy" width={1280} height={896} className="absolute inset-0 size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
                <div className="relative flex h-full min-h-[420px] flex-col justify-end p-6 text-primary-foreground sm:p-8">
                  <h3 className="font-display text-3xl font-bold uppercase">{r.name}</h3>
                  <p className="mt-1 text-lg">{r.line}</p>
                  <p className="mt-3 text-sm font-semibold text-primary-foreground/90">{r.tags.join(" · ")}</p>
                  <p className="mt-1 text-sm text-primary-foreground/85">Temporada habitual: {r.season}</p>
                  <Button size="lg" className="cru-btn-primary relative z-10 mt-5 min-h-12 self-start" onClick={() => choose({ route: r.id })}>Cotizar esta ruta <ArrowRight /></Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5 CABINAS */}
      <section id="cru-cabinas" className="cru-cream-aqua py-16 sm:py-24">
        <div className="cru-pad mx-auto max-w-7xl px-5 lg:px-8">
          <p className="kicker-line uppercase text-primary">Antes de elegir</p>
          <h2 data-guide-title className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">¿Qué cabina va <span className="hl-accent">contigo</span>?</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CABINS.map((c) => (
              <article key={c.id} className="cru-cabin cru-shadow cru-lift flex flex-col overflow-hidden border-t-2 border-accent bg-card">
                <div className="overflow-hidden"><img src={c.img} alt={`Cabina ${c.id.toLowerCase()} de crucero`} loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover" /></div>
                <div className="flex flex-1 flex-col p-6"><span className="cru-tag">{c.tag}</span><h3 className="mt-1 font-display text-xl font-bold uppercase text-ink">{c.id}</h3><p className="mt-2 flex-1 text-muted-foreground">{c.copy}</p>
                  <Button variant="outline" size="lg" className="mt-5 min-h-12" onClick={() => choose({ cabin: c.id })}>Elegir esta cabina <ArrowRight /></Button></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6 COTIZADOR */}
      <section id="cotizar-crucero" className="cru-navy overflow-hidden" style={{ ["--f" as string]: "var(--cru-aqua)" }}>
        <img src={estelaImg} alt="" aria-hidden="true" loading="lazy" className="cru-wake cru-wake-l pointer-events-none absolute inset-0 size-full object-cover" />
        <div className="cru-glow left-[5%] top-[35%] size-96 opacity-[.1]" style={{ background: "var(--cru-teal)" }} />
        <div className="cru-glow right-[8%] top-[55%] size-80 opacity-[.09]" style={{ background: "var(--accent)" }} />
        <div className="cru-glow left-[40%] bottom-[35%] size-72 opacity-[.08]" style={{ background: "var(--cru-teal)" }} />
        <div className="cru-pad relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.58fr_1.42fr] lg:gap-16 lg:px-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="kicker-line uppercase text-accent">Cotización personalizada</p>
            <h2 data-guide-title className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Cuéntanos tu crucero <span className="cru-gold-it">ideal</span>.</h2>
            <p className="mt-5 max-w-md leading-7 text-primary-foreground/90">Te ayudamos a comparar opciones y te compartimos alternativas claras para decidir.</p>
            <div className="mt-8 border-l-2 border-accent pl-5 text-sm leading-6 text-primary-foreground/85">Las opciones, condiciones y disponibilidad se confirman al momento de cotizar.</div>
          </div>
          <CruiseForm pre={pre} />
        </div>
      </section>

      </div>

      {/* 7 SERVICIOS */}
      <section className="cru-soft-band py-16 sm:py-24">
        <div className="cru-pad mx-auto max-w-7xl px-5 lg:px-8">
          <p className="kicker-line uppercase text-primary">Todo tu viaje, con un mismo equipo</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">Del aeropuerto al <span className="hl-accent">puerto</span>.</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ink">El crucero es una parte. Coordinamos contigo cómo llegar al puerto, dónde dormir antes o después y qué hacer en cada escala.</p>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {([["Vuelos", "Llega al puerto a tiempo", Plane, "/servicios/vuelos"], ["Hospedaje", "Antes o después del crucero", Hotel, "/servicios/hospedaje"], ["Traslados", "Del aeropuerto al puerto", RouteIcon, "/cotizar"], ["Renta de autos", "Explora a tu ritmo", Car, "/servicios/renta-de-autos"], ["Actividades y experiencias", "Excursiones en cada puerto", Compass, "/cotizar"]] as const).map(([name, line, Icon, to], i) => (
              <Link key={name} to={to} className={`service-tile cru-shadow cru-lift flex min-h-60 flex-col items-center justify-start p-5 pt-8 text-center ${i === 4 ? "col-span-2 lg:col-span-1" : ""}`}>
                <span className="service-tile-icon grid size-16 place-items-center rounded-full"><Icon className="size-10" strokeWidth={1.6} /></span>
                <span className="mt-5 font-display text-base font-bold text-ink">{name}</span><span className="mt-1.5 text-sm leading-5 text-muted-foreground">{line}</span>
                <ArrowRight aria-hidden="true" className="service-tile-arrow mt-3 size-5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8 FAQ */}
      <section className="cru-cream py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <p className="kicker-line uppercase text-primary">Preguntas frecuentes</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-ink">Lo que más nos preguntan.</h2>
          <Accordion type="single" collapsible className="mt-8 grid gap-3">
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q} className="cru-faq cru-shadow border-b-0 px-5"><AccordionTrigger className="text-left font-display text-lg font-bold text-ink">{q}</AccordionTrigger><AccordionContent className="text-base leading-7 text-muted-foreground">{a}</AccordionContent></AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 9 CIERRE */}
      <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-24">
        <svg aria-hidden="true" viewBox="0 0 1000 260" className="pointer-events-none absolute inset-0 hidden size-full text-accent opacity-20 sm:block"><path d="M-40 210 C160 70 350 280 540 110 S820 40 1040 150" fill="none" stroke="currentColor" strokeWidth="2" className="route-line" /></svg>
        <div className="relative mx-auto max-w-5xl px-5 text-center lg:px-8">
          <p className="kicker-text kicker-line kicker-center uppercase text-accent">Inspiración que puede hacerse realidad</p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,9vw,3.4rem)] font-bold uppercase leading-[1.02] sm:text-6xl">¿Te imaginas despertar cada día en un puerto nuevo?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/90">Cuéntanos cómo lo imaginas y empecemos a construir una propuesta contigo.</p>
          <Button size="lg" variant="secondary" className="mt-8 w-full sm:w-auto" onClick={scrollToQuote}>Cotizar mi crucero <ArrowRight /></Button>
        </div>
      </section>
      <SailGuide />
      </div>
    </SiteShell>
  );
}

/* ---------- Velero guía ---------- */
const RH = 600;
const railX = (y: number) => 32 + 22 * Math.sin(((y - 12) / (RH - 24)) * Math.PI * 5);
const RAIL = Array.from({ length: 121 }, (_, i) => { const y = 12 + (i / 120) * (RH - 24); return `${i ? "L" : "M"}${railX(y).toFixed(1)} ${y.toFixed(1)}`; }).join(" ");
const stopY = (i: number) => 12 + (i / 5) * (RH - 24);

function SailGuide() {
  const wrap = useRef<HTMLDivElement>(null);
  const boat = useRef<HTMLDivElement>(null);
  const clip = useRef<SVGRectElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0; let last = -1;
    const tick = () => {
      raf = 0;
      const els = GUIDE.map(([id]) => document.getElementById(id));
      if (els.some((e) => !e) || !wrap.current) return;
      const ref = window.innerHeight * 0.5;
      // punto de activación: mitad de cada sección; 06 al entrar el cotizador
      const marks: number[] = els.map((e, i) => { const r = e!.getBoundingClientRect(); return i === 5 ? r.top + Math.min(r.height * 0.5, window.innerHeight * 0.35) : r.top + r.height / 2; });
      let t = 0;
      const m = (k: number) => marks[k] ?? 0;
      if (ref >= m(5)) t = 5;
      else for (let i = 0; i < 5; i++) { if (ref >= m(i) && ref < m(i + 1)) { t = i + (ref - m(i)) / Math.max(1, m(i + 1) - m(i)); break; } }
      if (reduce) t = Math.round(t);
      const h = wrap.current.clientHeight; const y = 12 + (t / 5) * (RH - 24);
      const s = h / RH;
      if (boat.current) boat.current.style.transform = `translate(${(railX(y) - 32) * s}px, ${y * s - 22}px)`;
      clip.current?.setAttribute("height", String(y));
      const a = Math.min(5, Math.floor(t + 0.02));
      if (a !== last) { last = a; setActive(a); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    on(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  return (
    <nav aria-label="Guía de la página" ref={wrap} className="cru-rail hidden lg:block">
      <svg viewBox={`0 0 64 ${RH}`} preserveAspectRatio="none" className="cru-rail-line absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <defs><clipPath id="cru-rail-clip"><rect ref={clip} x="0" y="0" width="64" height="0" /></clipPath></defs>
        <path d={RAIL} fill="none" stroke="var(--accent)" strokeOpacity=".3" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={RAIL} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="2 8" strokeLinecap="round" clipPath="url(#cru-rail-clip)" vectorEffect="non-scaling-stroke" />
      </svg>
      {GUIDE.map(([id, label], i) => (
        <button key={id} type="button" onClick={() => go(id)} aria-label={`Ir a ${label}`} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(railX(stopY(i)) / 64) * 100}%`, top: `${(stopY(i) / RH) * 100}%` }}>
          <span className={`cru-dot grid size-6 place-items-center rounded-full border border-accent text-[10px] font-bold shadow ${active === i ? "is-on" : ""}`}>0{i + 1}</span>
          <span className={`cru-lbl absolute right-full top-1/2 mr-9 ${active === i ? "is-on" : ""}`} aria-hidden={active !== i}><span className="block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold text-primary-foreground shadow" style={{ background: "var(--cru-navy)" }}>{label}</span></span>
        </button>
      ))}
      <div ref={boat} className="cru-boat-pos pointer-events-none absolute left-1/2 top-0 -ml-[22px]" aria-hidden="true"><span className="cru-boat"><Sailboat className="size-5" /></span></div>
    </nav>
  );
}

/* ---------- Ruta: se dibuja una vez al entrar, 01 → 05 ---------- */
const W = 1000;
const yAt = (x: number) => 70 + 16 * Math.sin((x / W) * Math.PI * 3);
const STOP_X = [100, 300, 500, 700, 900];
const PATH = Array.from({ length: 81 }, (_, i) => { const x = 100 + (i / 80) * 800; return `${i ? "L" : "M"}${x.toFixed(1)} ${yAt(x).toFixed(1)}`; }).join(" ");

function RouteMoment() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setP(1); return; }
    const el = ref.current; if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => { const k = Math.min(1, (now - t0) / 3500); setP(k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2); if (k < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  const x = 100 + p * 800;
  const lit = (i: number) => p >= i / 4 - 0.001;
  return (
    <section id="cru-semana" className="cru-navy overflow-hidden" style={{ ["--f" as string]: "var(--cru-aqua)" }}>
      <img src={estelaImg} alt="" aria-hidden="true" loading="lazy" className="cru-wake pointer-events-none absolute inset-0 size-full object-cover" />
      <div ref={ref} className="cru-pad relative mx-auto max-w-7xl px-5 lg:px-8">
        <p className="kicker-line uppercase text-accent">Así puede ser una semana</p>
        <h2 data-guide-title className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Una ruta, muchos <span className="hl-accent hl-on-dark">despertares</span>.</h2>

        <div className="relative mt-14 hidden md:block">
          <svg viewBox={`0 0 ${W} 140`} className="w-full overflow-visible" aria-hidden="true">
            <defs><clipPath id="cru-clip"><rect x="0" y="0" height="140" width={x} /></clipPath></defs>
            <path d={PATH} fill="none" stroke="currentColor" className="text-primary-foreground/25" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
            <path d={PATH} clipPath="url(#cru-clip)" fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
            {STOP_X.map((sx, i) => <circle key={sx} cx={sx} cy={yAt(sx)} r="7" fill={lit(i) ? "var(--accent)" : "var(--cru-navy)"} stroke="var(--accent)" strokeWidth="2" style={{ transition: "fill .3s" }} />)}
            <circle cx={x} cy={yAt(x)} r="10" fill="var(--accent)" className="cru-ship" />
          </svg>
          <ol className="mt-6 grid grid-cols-5 gap-4">
            {STOPS.map(([t, c], i) => <li key={t} className={`cru-stop ${lit(i) ? "is-lit" : ""}`}><span className="font-display text-2xl font-bold">0{i + 1}</span><h3 className="mt-2 font-display text-base font-bold uppercase tracking-wide">{t}</h3><p className="mt-1 text-sm text-primary-foreground/90">{c}</p></li>)}
          </ol>
        </div>

        <div className="relative mt-10 md:hidden">
          <div className="absolute left-[11px] top-3 w-0 border-l-2 border-dotted border-primary-foreground/25" style={{ bottom: "calc(100% - var(--last, 100%))", height: "calc(100% - 5.5rem)" }} />
          <div className="absolute left-[11px] top-3 w-0 border-l-2 border-dotted border-accent" style={{ height: `calc((100% - 5.5rem) * ${p})` }} />
          <span className="cru-ship absolute left-[4px] size-4 rounded-full bg-accent" style={{ top: `calc(4px + (100% - 5.5rem) * ${p})` }} />
          <ol className="grid gap-8 pl-12">
            {STOPS.map(([t, c], i) => <li key={t} className={`cru-stop ${lit(i) ? "is-lit" : ""}`}><span className="font-display text-xl font-bold">0{i + 1}</span><h3 className="mt-1 font-display text-base font-bold uppercase tracking-wide">{t}</h3><p className="mt-1 text-sm text-primary-foreground/90">{c}</p></li>)}
          </ol>
        </div>
        <p className="mt-12 text-sm text-primary-foreground/80">Ejemplo ilustrativo. La ruta real depende de la naviera y las fechas.</p>
      </div>
    </section>
  );
}

/* ---------- Cotizador ---------- */
type F = { route: string; month: string; flexible: boolean; duration: string; port: string; adults: number; minors: number; ages: string[]; cabins: number; cabin: string; occasion: string; extras: string[]; budget: string; name: string; whatsapp: string; email: string; comments: string; consent: boolean };
const init: F = { route: "", month: "", flexible: false, duration: "", port: "", adults: 2, minors: 0, ages: [], cabins: 1, cabin: "", occasion: "", extras: [], budget: "", name: "", whatsapp: "", email: "", comments: "", consent: false };
const STEPS = ["Tu crucero", "Quiénes viajan", "Tu viaje completo y contacto"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const BUDGETS = ["Económico", "Intermedio", "Amplio", "Prefiero que me orienten"];

function Chips({ options, value, onChange, multi, label }: { options: string[]; value: string | string[]; onChange: (v: string) => void; multi?: boolean; label: string }) {
  return <div role={multi ? "group" : "radiogroup"} aria-label={label} className="flex flex-wrap gap-2">{options.map((o) => { const on = multi ? (value as string[]).includes(o) : value === o; return <button type="button" key={o} role={multi ? "checkbox" : "radio"} aria-checked={on} onClick={() => onChange(o)} className={`min-h-12 border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${on ? "cru-chip-on border-primary bg-primary text-primary-foreground" : "border-border bg-background text-ink hover:border-primary"}`}>{o}</button>; })}</div>;
}
function Counter({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  return <div className="flex items-center justify-between gap-4 border border-border bg-background px-4 py-2"><span className="text-sm font-bold text-ink">{label}</span><div className="flex items-center gap-3"><button type="button" aria-label={`Quitar ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="grid size-11 place-items-center border border-border disabled:opacity-40"><Minus className="size-4" /></button><span className="w-6 text-center font-bold" aria-live="polite">{value}</span><button type="button" aria-label={`Agregar ${label}`} onClick={() => onChange(value + 1)} className="grid size-11 place-items-center border border-border"><Plus className="size-4" /></button></div></div>;
}
function Field({ label, error, children, htmlFor }: { label: string; error?: string | undefined; children: ReactNode; htmlFor?: string }) {
  return <div><label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-ink">{label}</label>{children}{error && <p className="mt-2 text-sm font-semibold text-destructive">{error}</p>}</div>;
}

function CruiseForm({ pre }: { pre: Pre }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<F>(init);
  const [err, setErr] = useState<Partial<Record<keyof F, string>>>({});
  const [notice, setNotice] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } head.current?.focus({ preventScroll: true }); }, [step]);
  useEffect(() => {
    if (!pre.n) return;
    if (pre.route) { setF((c) => ({ ...c, route: pre.route! })); setStep(0); }
    if (pre.cabin) { setF((c) => ({ ...c, cabin: pre.cabin! })); setStep(1); }
    setNotice(false);
  }, [pre]);
  const up = <K extends keyof F>(k: K, v: F[K]) => { setF((c) => ({ ...c, [k]: v })); setErr((e) => ({ ...e, [k]: "" })); setNotice(false); };
  const setMinors = (n: number) => setF((c) => ({ ...c, minors: n, ages: Array.from({ length: n }, (_, i) => c.ages[i] ?? "") }));
  const validate = (s: number) => {
    const e: Partial<Record<keyof F, string>> = {};
    if (s === 0) { if (!f.route) e.route = "Elige una ruta (o “Aún no sé”)."; if (!f.month && !f.flexible) e.month = "Elige un mes o marca “Soy flexible”."; if (!f.duration) e.duration = "Elige una duración."; }
    if (s === 1) { if (f.adults < 1) e.adults = "Debe viajar al menos una persona adulta."; if (f.ages.some((a) => !a)) e.ages = "Indica la edad de cada menor."; if (!f.cabin) e.cabin = "Elige un tipo de cabina (o “Asesórame”)."; }
    if (s === 2) { if (!f.name.trim()) e.name = "Escribe tu nombre."; if (!f.whatsapp.trim()) e.whatsapp = "Escribe tu número de WhatsApp."; if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Escribe un correo electrónico válido."; if (!f.consent) e.consent = "Necesitamos tu aceptación para poder contactarte."; }
    setErr(e); return Object.keys(e).length === 0;
  };
  const [review, setReview] = useState(false);
  const submit = (ev: FormEvent) => { ev.preventDefault(); if (!review) { if (validate(2)) setReview(true); return; } setNotice(true); };
  const summary: [string, string][] = [
    ["Ruta", f.route], ["Mes", f.flexible ? "Soy flexible" : f.month], ["Duración", f.duration], ["Puerto de salida", f.port || "—"],
    ["Viajeros", `${f.adults} adulto(s)${f.minors ? `, ${f.minors} menor(es) (${f.ages.join(", ")} años)` : ""}`], ["Cabinas", `${f.cabins} · ${f.cabin}`], ["Ocasión", f.occasion || "—"],
    ["Extras", f.extras.join(", ") || "—"], ["Presupuesto", f.budget || "—"], ["Contacto", `${f.name} · ${f.whatsapp} · ${f.email}`],
  ];
  const input = "h-12 border-border bg-background px-4";
  return <form onSubmit={submit} noValidate className="cru-form min-w-0 bg-card text-foreground" aria-label="Cotización de crucero">
    <div className="border-b border-border bg-secondary/55 px-5 py-5 sm:px-8">
      <div className="flex items-end justify-between gap-4"><div><p className="kicker-text font-extrabold uppercase tracking-[.14em] text-primary">Paso {step + 1} de 3</p><p className="mt-1 text-sm font-semibold text-ink">{STEPS[step]}</p></div><span className="text-sm font-bold text-muted-foreground">{Math.round(((step + 1) / 3) * 100)}%</span></div>
      <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">{STEPS.map((s, i) => <span key={s} className={`h-1 ${i <= step ? "cru-progress" : "bg-border"}`} />)}</div>
    </div>
    <div className="grid gap-6 px-5 py-7 sm:px-8 sm:py-9">
      <h3 ref={head} tabIndex={-1} className="font-display text-2xl font-bold text-ink outline-none sm:text-3xl">{review ? "Revisa tu solicitud" : STEPS[step]}</h3>
      {review ? <>
        <dl className="grid gap-3 border border-border bg-background p-5 sm:grid-cols-2">{summary.map(([k, v]) => <div key={k}><dt className="text-sm font-bold text-muted-foreground">{k}</dt><dd className="text-ink">{v}</dd></div>)}</dl>
        {notice && <p role="status" className="text-sm font-semibold leading-6 text-primary">La integración sigue pendiente. Ninguna información fue enviada ni guardada.</p>}
        <div className="flex flex-wrap justify-between gap-3"><Button type="button" variant="outline" size="lg" className="min-h-12" onClick={() => { setReview(false); setNotice(false); }}><ArrowLeft /> Editar</Button><Button type="submit" size="lg" className="min-h-12">Enviar solicitud <ArrowRight /></Button></div>
      </> : <>
        {step === 0 && <>
          <Field label="Ruta" error={err.route}><Chips label="Ruta" options={ROUTE_OPTIONS} value={f.route} onChange={(v) => up("route", v)} /></Field>
          <Field label="Mes o temporada aproximada" htmlFor="cru-month" error={err.month}><div className="flex flex-wrap items-center gap-4"><select id="cru-month" value={f.month} disabled={f.flexible} onChange={(e) => up("month", e.target.value)} className={`${input} min-w-52 border`}><option value="">Selecciona un mes</option>{MONTHS.map((m) => <option key={m}>{m}</option>)}</select><label className="flex min-h-12 items-center gap-3 text-sm font-semibold text-ink"><Checkbox checked={f.flexible} onCheckedChange={(v) => up("flexible", v === true)} /> Soy flexible</label></div></Field>
          <Field label="Duración" error={err.duration}><Chips label="Duración" options={["3–5 noches", "6–8 noches", "9 o más", "Flexible"]} value={f.duration} onChange={(v) => up("duration", v)} /></Field>
          <Field label="Puerto de salida preferido (opcional)" htmlFor="cru-port"><Input id="cru-port" className={input} value={f.port} onChange={(e) => up("port", e.target.value)} placeholder="Ej. el que me quede más cerca" /></Field>
        </>}
        {step === 1 && <>
          <div className="grid gap-3 sm:grid-cols-2"><Counter label="Adultos" value={f.adults} min={1} onChange={(v) => up("adults", v)} /><Counter label="Menores" value={f.minors} min={0} onChange={setMinors} /><Counter label="Cabinas" value={f.cabins} min={1} onChange={(v) => up("cabins", v)} /></div>
          {f.minors > 0 && <Field label="Edad de cada menor" error={err.ages}><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{f.ages.map((a, i) => <Input key={i} aria-label={`Edad del menor ${i + 1}`} type="number" min={0} max={17} className={input} value={a} onChange={(e) => { const ages = [...f.ages]; ages[i] = e.target.value; up("ages", ages); }} placeholder={`Menor ${i + 1}`} />)}</div></Field>}
          <Field label="Tipo de cabina" error={err.cabin}><Chips label="Tipo de cabina" options={["Interior", "Exterior", "Balcón", "Suite", "Asesórame"]} value={f.cabin} onChange={(v) => up("cabin", v)} /></Field>
          <Field label="Ocasión especial (opcional)"><Chips label="Ocasión especial" options={["Luna de miel", "Aniversario", "Cumpleaños", "Graduación", "Otra"]} value={f.occasion} onChange={(v) => up("occasion", f.occasion === v ? "" : v)} /></Field>
        </>}
        {step === 2 && <>
          <Field label="¿Qué más necesitas?"><Chips multi label="Qué más necesitas" options={["Vuelo al puerto", "Hotel antes o después", "Traslados", "Excursiones en puertos"]} value={f.extras} onChange={(v) => up("extras", f.extras.includes(v) ? f.extras.filter((x) => x !== v) : [...f.extras, v])} /></Field>
          <Field label="Presupuesto aproximado por persona (opcional)"><Chips label="Presupuesto" options={BUDGETS} value={f.budget} onChange={(v) => up("budget", f.budget === v ? "" : v)} /></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre" htmlFor="cru-name" error={err.name}><Input id="cru-name" autoComplete="name" className={input} value={f.name} onChange={(e) => up("name", e.target.value)} /></Field>
            <Field label="WhatsApp" htmlFor="cru-wa" error={err.whatsapp}><Input id="cru-wa" type="tel" autoComplete="tel" className={input} value={f.whatsapp} onChange={(e) => up("whatsapp", e.target.value)} /></Field>
            <div className="sm:col-span-2"><Field label="Correo" htmlFor="cru-mail" error={err.email}><Input id="cru-mail" type="email" autoComplete="email" className={input} value={f.email} onChange={(e) => up("email", e.target.value)} /></Field></div>
            <div className="sm:col-span-2"><Field label="Comentarios (opcional)" htmlFor="cru-com"><Textarea id="cru-com" className="min-h-28" value={f.comments} onChange={(e) => up("comments", e.target.value)} /></Field></div>
          </div>
          <div><label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><Checkbox checked={f.consent} onCheckedChange={(v) => up("consent", v === true)} className="mt-1" aria-label="Aceptar aviso de privacidad" /><span>Acepto el aviso de privacidad y que Cielito Tours me contacte para atender esta solicitud.</span></label>{err.consent && <p className="mt-2 text-sm font-semibold text-destructive">{err.consent}</p>}</div>
        </>}
        <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-6">
          {step > 0 ? <Button type="button" variant="outline" size="lg" className="min-h-12" onClick={() => setStep(step - 1)}><ArrowLeft /> Atrás</Button> : <span />}
          {step < 2 ? <Button type="button" size="lg" className="min-h-12" onClick={() => validate(step) && setStep(step + 1)}>Siguiente <ArrowRight /></Button> : <Button type="submit" size="lg" className="min-h-12">Ver resumen <ArrowDown /></Button>}
        </div>
      </>}
      <p className="text-sm leading-5 text-muted-foreground">Enviar este formulario no confirma una reserva, tarifa ni disponibilidad. Un asesor validará las opciones contigo.</p>
    </div>
  </form>;
}

