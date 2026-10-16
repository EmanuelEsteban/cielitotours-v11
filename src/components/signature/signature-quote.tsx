import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, BedDouble, Car, Compass, Info, Plane, Ship, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasContext, type QuoteContext } from "@/lib/quote-context";
import { searchCities, norm } from "@/lib/geo/search";
import { AirportAutocomplete } from "@/components/geo/airport-autocomplete";
import { CityAutocomplete } from "@/components/geo/city-autocomplete";
import type { AirportValue, CityValue } from "@/lib/geo/types";
import { ContactStep, CONTACT_ORDER, EMPTY_CONTACT, validateContact, type ContactData, type ContactErrors } from "./contact-step";
import { airportText } from "@/components/geo/airport-autocomplete";
import { cityText } from "@/components/geo/city-autocomplete";
import { ServicePrefs, prefsSummary, EMPTY_PREFS, Text, type Prefs } from "./service-prefs";
import { TripFields, travelersSummary, pretty, validateTrip, type TripDates, type TripErrors, type TripType, type Travelers } from "./trip-fields";

/* COTIZAR-D2 — visual demo only. Not connected: nothing is validated, stored or sent.
   The working form remains in src/components/quote-form.tsx (recoverable backup). */

const STEPS = [
  { n: "01", label: "Tu experiencia" },
  { n: "02", label: "Personaliza tu viaje" },
  { n: "03", label: "Tus datos y solicitud" },
] as const;

const SERVICES = [
  { id: "vuelos", label: "Vuelos", icon: Plane },
  { id: "hospedaje", label: "Hospedaje", icon: BedDouble },
  { id: "auto", label: "Renta de auto", icon: Car },
  { id: "tours", label: "Tours", icon: Compass },
  { id: "cruceros", label: "Cruceros", icon: Ship },
  { id: "otros", label: "Otros servicios", icon: Sparkles },
] as const;

/* COTIZAR-HERO-01 — topographic contours around the existing compass centre (1320,300), deterministic. */
const SG_TOPO = Array.from({ length: 6 }, (_, k) => {
  const r = 110 + k * 46, pts: string[] = [];
  for (let i = 0; i <= 56; i++) {
    const a = (i / 56) * Math.PI * 2;
    const w = 1 + 0.09 * Math.sin(a * 3 + k * 0.7) + 0.05 * Math.sin(a * 5 - k * 1.1);
    pts.push(`${(1360 + Math.cos(a) * r * w * 1.18).toFixed(1)},${(330 + Math.sin(a) * r * w * 0.72).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
});

function HeroLines() {
  return <>
    <svg aria-hidden="true" className="sg-lines" viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice">
      <path d="M-40 520 C 280 420 560 600 900 470 S 1400 330 1660 400" />
      <path d="M-40 570 C 300 470 580 650 920 520 S 1420 380 1660 450" />
      <path d="M-40 180 C 320 110 660 250 1000 150 S 1460 80 1660 130" />
      <g className="sg-compass">
        <circle cx="1320" cy="300" r="150" />
        <circle cx="1320" cy="300" r="210" />
        <circle cx="1320" cy="300" r="280" strokeDasharray="2 10" />
        <path d="M1320 70 V530 M1090 300 H1550" />
        <path className="sg-arc" d="M1130 420 Q 1320 140 1510 260" />
      </g>
    </svg>
    <svg aria-hidden="true" className="sg-atlas" viewBox="0 0 1600 700" preserveAspectRatio="xMaxYMid slice">
      <defs>
        <radialGradient id="sg-glow-g"><stop offset="0" stopColor="#E9D3A6" stopOpacity=".55" /><stop offset=".45" stopColor="#C7A46C" stopOpacity=".16" /><stop offset="1" stopColor="#C7A46C" stopOpacity="0" /></radialGradient>
        <linearGradient id="sg-fade" gradientUnits="userSpaceOnUse" x1="960" y1="0" x2="1320" y2="0"><stop offset="0" stopColor="#C7A46C" stopOpacity="0" /><stop offset="1" stopColor="#E9D3A6" stopOpacity="1" /></linearGradient>
      </defs>
      <circle className="sg-glow sg-glow-a" cx="1350" cy="250" r="260" fill="url(#sg-glow-g)" />
      <circle className="sg-glow sg-glow-b sg-hide-sm" cx="1500" cy="520" r="200" fill="url(#sg-glow-g)" />
      <g className="sg-topo sg-hide-sm">{SG_TOPO.map((d, i) => <path key={i} d={d} className={i > 3 ? "sg-hide-md" : undefined} />)}</g>
      <g className="sg-orbit sg-orbit-a"><ellipse cx="1320" cy="300" rx="360" ry="128" transform="rotate(-16 1320 300)" /></g>
      <g className="sg-orbit sg-orbit-b sg-hide-sm"><ellipse cx="1320" cy="300" rx="430" ry="176" transform="rotate(-28 1320 300)" strokeDasharray="1 7" /></g>
      <g className="sg-orbit sg-orbit-c sg-hide-md"><ellipse cx="1320" cy="300" rx="250" ry="88" transform="rotate(12 1320 300)" /></g>
      <g className="sg-traj">
        <path d="M980 610 C 1120 520 1180 380 1330 330 S 1560 250 1660 150" />
        <path className="sg-hide-sm" d="M1000 90 C 1150 140 1230 230 1360 250 S 1540 330 1660 300" />
        <path className="sg-comet" d="M980 610 C 1120 520 1180 380 1330 330 S 1560 250 1660 150" />
      </g>
      <g className="sg-flow sg-flow-a"><path d="M900 470 C 1060 400 1180 520 1340 440 S 1560 360 1720 420 S 1960 500 2120 430" /></g>
      <g className="sg-flow sg-flow-b sg-hide-sm"><path d="M940 200 C 1100 260 1220 150 1380 210 S 1600 300 1760 230 S 2000 160 2160 220" /></g>
      <g className="sg-flow sg-flow-c sg-hide-md"><path d="M1040 560 C 1180 500 1300 600 1440 540 S 1640 470 1800 530" strokeDasharray="2 9" /></g>
      <g className="sg-cross">
        <path d="M1060 660 C 1200 520 1260 300 1420 200 S 1600 90 1680 60" />
        <path className="sg-comet sg-comet-b" d="M1060 660 C 1200 520 1260 300 1420 200 S 1600 90 1680 60" />
        <path className="sg-comet sg-comet-c sg-hide-sm" d="M1000 90 C 1150 140 1230 230 1360 250 S 1540 330 1660 300" />
      </g>
      <g className="sg-nodes">
        <circle className="sg-node" cx="1330" cy="330" r="3.2" style={{ animationDelay: "-2s" }} />
        <circle className="sg-node sg-hide-sm" cx="1360" cy="250" r="2.6" style={{ animationDelay: "-7s" }} />
        <circle className="sg-node" cx="1516" cy="214" r="2.4" style={{ animationDelay: "-11s" }} />
        <circle className="sg-node sg-hide-md" cx="1186" cy="418" r="2.2" style={{ animationDelay: "-4s" }} />
        <circle className="sg-node sg-hide-sm" cx="1612" cy="300" r="2.4" style={{ animationDelay: "-9s" }} />
      </g>
    </svg>
  </>;
}

function Demo({ children }: { children: React.ReactNode }) {
  return <div className="sg-demo"><span className="sg-demo-tag">Vista previa · no operativo</span>{children}</div>;
}

function DemoField({ label, placeholder }: { label: string; placeholder?: string }) {
  return <div className="sg-field"><span className="sg-label">{label}</span><div className="sg-input" aria-hidden="true">{placeholder}</div></div>;
}

const NO_CONTEXT: QuoteContext = { destino: null, region: null, experiencia: null, idea: null };

export function SignatureQuote({ context = NO_CONTEXT }: { context?: QuoteContext }) {
  const heroRef = useRef<HTMLElement>(null);
  const [heroPaused, setHeroPaused] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setHeroPaused(!e?.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [origin, setOrigin] = useState<AirportValue>(null);
  const [destAirport, setDestAirport] = useState<AirportValue>(null);
  // COTIZAR-FUNCIONAL-02 — URL context initialises the form once; the customer's edits always win.
  const [destCity, setDestCity] = useState<CityValue>(() => context.destino ? { kind: "manual", text: context.destino } : null);
  const ctxApplied = useRef(false);
  useEffect(() => {
    if (ctxApplied.current || !context.destino) return;
    ctxApplied.current = true;
    const initial = context.destino, head = norm(initial.split(",")[0] ?? "");
    searchCities(initial.split(",")[0] ?? initial).then((r) => {
      const hit = r.items.find((c) => norm(c.name) === head);
      if (hit) setDestCity((cur) => (cur?.kind === "manual" && cur.text === initial ? hit : cur));
    }).catch(() => { /* keep the free text */ });
  }, [context.destino]);
  const ctxLine = [context.idea && `Idea de viaje: ${context.idea.name}`, context.region && `Región: ${context.region}`, context.experiencia && `Experiencia: ${context.experiencia}`].filter(Boolean).join(" · ");
  const [tripType, setTripType] = useState<TripType>("round");
  const [dates, setDates] = useState<TripDates>({ start: "", end: "", flexible: false });
  const [travelers, setTravelers] = useState<Travelers>({ adults: 1, children: 0, infants: 0 });
  const [errors, setErrors] = useState<TripErrors>({});
  const [svcErr, setSvcErr] = useState("");
  const [prefs, setPrefs] = useState<Prefs>(EMPTY_PREFS);
  // COTIZAR-FUNCIONAL-03 — general request comments (not tied to any service); kept across steps and service changes.
  const [additionalComments, setAdditionalComments] = useState("");
  const svcRef = useRef<HTMLDivElement>(null);
  const [contact, setContact] = useState<ContactData>(EMPTY_CONTACT);
  const [cErrors, setCErrors] = useState<ContactErrors>({});
  const [checked, setChecked] = useState(false);
  const [valid, setValid] = useState(false);
  const [visited2, setVisited2] = useState(false);
  const onContact = (c: ContactData) => { setContact(c); setValid(false); if (checked) setCErrors(validateContact(c)); };
  const review = () => {
    const e = validateContact(contact); setCErrors(e); setChecked(true);
    const first = CONTACT_ORDER.find((k) => e[k]);
    if (first) { setValid(false); document.getElementById(`sg-c-${first}`)?.focus(); return; }
    setValid(true);
  };
  const airportLine = (v: AirportValue) => !v ? "" : v.kind === "manual" ? `${v.text} — pendiente de confirmar (no seleccionado del catálogo)` : `${v.city || v.name} — ${v.iata} · ${v.name}, ${v.country}`;
  const flights = picked.includes("vuelos");
  const needsEnd = !(flights && tripType === "oneway");
  const step1Ok = picked.length > 0 && !Object.keys(validateTrip(dates, needsEnd, travelers)).length;
  const doneSteps = [step1Ok, step1Ok && visited2, step1Ok && valid]; // real validation state, not just visits
  const goTo = (n: number) => {
    if (step === 1 && n > 1) setVisited2(true); // step 02 is optional: completed once passed forward
    if (step === 0 && n > 0) {
      if (!picked.length) { setSvcErr("Elige al menos un servicio para continuar."); svcRef.current?.querySelector("button")?.focus(); svcRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
      const e = validateTrip(dates, needsEnd, travelers); setErrors(e); if (Object.keys(e).length) return;
    }
    setStep(n);
  };
  const needsCity = !flights || picked.some((id) => id !== "vuelos");
  const toggle = (id: string) => { setSvcErr(""); setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])); };
  const chosen = SERVICES.filter((s) => picked.includes(s.id));

  return <div className="sg-page">
    <section ref={heroRef} className={cn("sg-hero", heroPaused && "is-paused")}>
      <HeroLines />
      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-16 md:pb-40 md:pt-24 lg:px-8">
        <p className="sg-kicker"><span aria-hidden="true" className="sg-kline" />Cielito Signature<span aria-hidden="true" className="sg-kline" /></p>
        <h1 className="sg-title">Un viaje, <em className="sg-title-em">todas las posibilidades.</em></h1>
        <p className="sg-lead">Cuéntanos qué imaginas. Nosotros te ayudamos a organizar cada detalle.</p>
      </div>
      <svg aria-hidden="true" className="sg-curve" viewBox="0 0 1600 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sg-metal" x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8E6F3E" stopOpacity=".2" /><stop offset=".14" stopColor="#B08A52" />
            <stop offset=".32" stopColor="#E9D3A6" /><stop offset=".46" stopColor="#B8955C" />
            <stop offset=".6" stopColor="#F6E9CC" /><stop offset=".76" stopColor="#B08A52" />
            <stop offset=".9" stopColor="#D9BD85" /><stop offset="1" stopColor="#8E6F3E" stopOpacity=".2" />
          </linearGradient>
          <linearGradient id="sg-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFF6E0" stopOpacity="0" /><stop offset=".5" stopColor="#FFF6E0" stopOpacity=".95" /><stop offset="1" stopColor="#FFF6E0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="sg-curve-fill" d="M0 60 C 400 20 1100 95 1600 40 V90 H0 Z" />
        <path className="sg-curve-glow" d="M0 60 C 400 20 1100 95 1600 40" />
        <path className="sg-curve-l2" d="M0 52 C 400 12 1100 87 1600 32" />
        <path className="sg-curve-line" d="M0 60 C 400 20 1100 95 1600 40" />
        <path className="sg-curve-hl" d="M0 61 C 400 21 1100 96 1600 41" />
      </svg>
    </section>

    <div className="sg-body">
    <div aria-hidden="true" className="sg-atmos">
      <svg className="sg-flowl sg-flowl-l" viewBox="0 0 600 700" preserveAspectRatio="xMinYMin meet">
        <g className="sg-fl-soft">
          <path d="M-40 200 C 120 160 260 240 340 360 S 420 600 300 720" />
          <path d="M-40 420 C 100 380 220 440 280 540" />
        </g>
        <g className="sg-fl-a">
          <path d="M-40 140 C 110 110 250 170 330 280 S 430 520 360 700" />
          <path d="M-40 176 C 100 150 230 210 300 310 S 390 540 320 710" />
          <path d="M-40 214 C 90 192 210 252 270 344 S 350 560 282 712" />
        </g>
        <g className="sg-fl-b">
          <path d="M-40 300 C 60 290 150 330 196 410 S 230 590 170 712" strokeDasharray="120 10 40 10" />
          <path d="M-40 470 C 60 446 150 470 230 520 S 400 620 560 600" />
        </g>
        <path className="sg-fl-c" d="M-40 252 C 80 236 190 290 246 378 S 310 580 240 712" />
      </svg>
      <svg className="sg-flowl sg-flowl-r" viewBox="0 0 600 900" preserveAspectRatio="xMaxYMin meet">
        <g className="sg-fl-soft">
          <path d="M640 120 C 470 200 420 380 470 560 S 600 820 520 940" />
        </g>
        <g className="sg-fl-a">
          <path d="M640 60 C 500 140 430 300 450 480 S 560 760 500 940" />
          <path d="M640 100 C 520 180 460 330 478 500 S 580 770 530 940" />
          <path d="M640 140 C 540 220 490 360 506 520 S 600 780 560 940" />
        </g>
        <g className="sg-fl-b">
          <path d="M640 260 C 560 300 520 400 540 520 S 620 720 600 820" strokeDasharray="160 12 50 12" />
          <path d="M640 40 C 560 50 470 100 400 200" />
        </g>
        <path className="sg-fl-c" d="M640 190 C 560 260 520 380 534 530 S 610 760 580 900" />
      </svg>
    </div>
    <section className="relative mx-auto -mt-16 max-w-5xl px-4 pb-24 md:-mt-[72px] md:px-6 md:pb-32">
      <div className="sg-card">
        <span aria-hidden="true" className="sg-corner sg-corner-tl" /><span aria-hidden="true" className="sg-corner sg-corner-br" />
        <svg aria-hidden="true" className="sg-filigree" viewBox="0 0 400 400" preserveAspectRatio="xMaxYMin meet">
          <defs>
            <linearGradient id="sg-fil-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#C7A46C" stopOpacity="0" /><stop offset=".35" stopColor="#B08A52" />
              <stop offset=".62" stopColor="#E9D3A6" /><stop offset=".85" stopColor="#B08A52" /><stop offset="1" stopColor="#C7A46C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 6 C 120 6 220 14 300 10 C 350 8 380 4 394 22 C 398 60 392 150 394 400" />
          <path className="sg-fil-2" d="M40 16 C 140 2 220 26 296 18 C 340 14 372 26 384 52 C 392 90 380 160 386 330" />
          <path className="sg-fil-3" d="M120 4 C 200 26 260 4 320 22 C 360 34 376 14 390 6 M394 80 C 376 120 396 170 382 230" />
          <circle cx="380" cy="20" r="2.4" />
        </svg>
        <p className="sg-notice" role="note"><Info className="size-4 shrink-0" aria-hidden="true" />Demostración visual: este cotizador aún no envía ni guarda información. Para solicitar hoy, escríbenos por WhatsApp o desde Contacto.</p>

        <ol className="sg-steps" aria-label="Pasos del cotizador">
          {STEPS.map((s, i) => { const done = i !== step && doneSteps[i]; return <li key={s.n}>
            <button type="button" onClick={() => goTo(i)} className={cn("sg-step", i === step && "is-on", done && "is-done")} aria-current={i === step ? "step" : undefined}
              aria-label={`Paso ${s.n}: ${s.label}${i === step ? " (actual)" : done ? " (completado)" : " (pendiente)"}`}>
              <span className="sg-step-n" aria-hidden="true">{done ? <Check className="size-4" strokeWidth={3} /> : s.n}</span><span className="sg-step-l">{s.label}</span>
            </button>
          </li>; })}
        </ol>

        <div key={step} className="sg-panel">
          {step === 0 && <>
            <h2 className="sg-h2">¿Qué quieres incluir en tu viaje?</h2>
            <p className="sg-sub">Puedes combinar varios servicios.</p>
            {hasContext(context) && (ctxLine || context.destino) && <p className="sg-hint sg-ctx" role="note">Vienes desde tu selección{context.destino ? `: ${context.destino}` : ""}{ctxLine ? `${context.destino ? " · " : ": "}${ctxLine}` : ""}. Es solo un punto de partida; puedes cambiar todo.</p>}
            <div ref={svcRef} className={cn("sg-services", svcErr && "is-err")} role="group" aria-label="Servicios" aria-describedby={svcErr ? "sg-svc-err" : undefined}>
              {SERVICES.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={picked.includes(id)} onClick={() => toggle(id)} className={cn("sg-svc", picked.includes(id) && "is-on")}>
                <Icon className="size-6" aria-hidden="true" /><span>{label}</span>
              </button>)}
            </div>
            {svcErr && <p id="sg-svc-err" role="alert" className="sg-err">{svcErr}</p>}
            <hr className="sg-sep" />
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {flights && <AirportAutocomplete label="Aeropuerto de origen" value={origin} onChange={setOrigin} />}
              {flights && <div>
                <AirportAutocomplete label="Aeropuerto de destino" value={destAirport} onChange={setDestAirport} />
                {context.destino && !destAirport && <p id="sg-dest-ctx" className="sg-hint sg-hint-flow">Tu destino es {context.destino}: escribe la ciudad y elige el aeropuerto que prefieras.</p>}
              </div>}
              {needsCity && <CityAutocomplete label={flights ? "Ciudad de estancia" : "Destino"} value={destCity} onChange={setDestCity} />}
            </div>
            {picked.length > 0 && <TripFields flights={flights} multi={picked.length > 1} tripType={tripType} onTripType={setTripType}
              dates={dates} onDates={(d) => { setDates(d); if (Object.keys(errors).length) setErrors(validateTrip(d, needsEnd, travelers)); }}
              travelers={travelers} onTravelers={(t) => { setTravelers(t); if (errors.travelers) setErrors(validateTrip(dates, needsEnd, t)); }} errors={errors} />}
          </>}

          {step === 1 && <>
            <h2 className="sg-h2">Personaliza tu viaje</h2>
            <p className="sg-sub">Todo es opcional: cuéntanos solo lo que ya tengas claro.</p>
            {chosen.length === 0 ? <p className="sg-empty">Aún no eliges servicios. Regresa al paso 01 para seleccionarlos.</p>
              : <ServicePrefs services={chosen} prefs={prefs} onPrefs={setPrefs} trip={dates.flexible || !dates.start ? null : { start: dates.start, end: needsEnd ? dates.end : dates.start }} />}
            <div className="sg-comments mt-8">
              <Text id="sg-comments" area label="Comentarios adicionales" hint="¿Hay algo más que debamos saber sobre tu viaje?"
                placeholder="Cuéntanos si tienes alguna petición especial, preferencia o detalle importante para tu cotización." value={additionalComments} onChange={setAdditionalComments} />
            </div>
          </>}

          {step === 2 && <>
            <h2 className="sg-h2">Tus datos y solicitud</h2>
            <p className="sg-sub">Así podremos contactarte con una propuesta.</p>
            <ContactStep value={contact} onChange={onContact} errors={cErrors} />
            <div className="sg-summary sg-sum">
              <p className="sg-summary-h">Resumen de tu solicitud</p>
              <div className="sg-sum-sec">
                <div className="sg-sum-top"><p className="sg-sum-t">Tu experiencia</p><button type="button" className="sg-sum-edit" onClick={() => setStep(0)}>Editar experiencia</button></div>
                <dl className="sg-sum-dl">
                  {ctxLine && <><dt>Punto de partida</dt><dd>{ctxLine} <span className="opacity-70">(sugerencia, por confirmar)</span></dd></>}
                  <dt>Servicios</dt><dd>{chosen.length ? chosen.map((c) => c.label).join(" · ") : "Sin servicios seleccionados"}</dd>
                  {flights && origin && <><dt>Origen</dt><dd>{airportLine(origin)}</dd></>}
                  {flights && destAirport && <><dt>Destino</dt><dd>{airportLine(destAirport)}</dd></>}
                  {needsCity && destCity && <><dt>{flights ? "Ciudad de estancia" : "Destino"}</dt><dd>{cityText(destCity)}{destCity.kind === "manual" ? (destCity.text === context.destino ? " (desde tu selección)" : " (escrito a mano)") : ""}</dd></>}
                  {flights && <><dt>Tipo de vuelo</dt><dd>{tripType === "round" ? "Ida y vuelta" : "Solo ida"}</dd></>}
                  {chosen.length > 0 && <><dt>Fechas</dt><dd>{dates.flexible ? `Por definir${dates.start ? ` (referencia: ${[pretty(dates.start), needsEnd ? pretty(dates.end) : ""].filter(Boolean).join(" – ")})` : ""}` : [pretty(dates.start), needsEnd ? pretty(dates.end) : ""].filter(Boolean).join(" – ") || "Sin indicar"}</dd></>}
                  {chosen.length > 0 && <><dt>Viajeros</dt><dd>{travelersSummary(travelers)}</dd></>}
                </dl>
              </div>
              {chosen.some((c) => prefsSummary(c.id, prefs)) && <div className="sg-sum-sec">
                <div className="sg-sum-top"><p className="sg-sum-t">Preferencias</p><button type="button" className="sg-sum-edit" onClick={() => setStep(1)}>Editar preferencias</button></div>
                <dl className="sg-sum-dl">
                  {chosen.map((c) => { const t = prefsSummary(c.id, prefs); return t ? <Fragment key={c.id}><dt>{c.label}</dt><dd>{t}</dd></Fragment> : null; })}
                  {[["Actividades deseadas", prefs.tours.notes, "tours"], ["Preferencias de crucero", prefs.cruceros.notes, "cruceros"]].map(([l, v, id]) => picked.includes(id!) && v!.trim() ? <Fragment key={l}><dt>{l}</dt><dd className="whitespace-pre-line">{v!.trim()}</dd></Fragment> : null)}
                </dl>
              </div>}
              {additionalComments.trim() && <div className="sg-sum-sec">
                <div className="sg-sum-top"><p className="sg-sum-t">Comentarios adicionales</p><button type="button" className="sg-sum-edit" onClick={() => setStep(1)}>Editar comentarios</button></div>
                <p className="whitespace-pre-line text-sm">{additionalComments.trim()}</p>
              </div>}
              {chosen.length > 0 && !chosen.some((c) => prefsSummary(c.id, prefs)) && <p className="text-sm">Sin preferencias indicadas. <button type="button" className="sg-sum-edit" onClick={() => setStep(1)}>Editar preferencias</button></p>}
            </div>
            {valid && <p className="sg-ok" role="status">Tus datos están completos. El envío en línea todavía está pendiente de activación: por ahora no se guarda ni se envía nada.</p>}
          </>}
        </div>

        <div className="sg-nav">
          <button type="button" className="sg-back" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}><ArrowLeft className="size-4" aria-hidden="true" />Anterior</button>
          {step < 2
            ? <button type="button" className="sg-next" onClick={() => goTo(Math.min(2, step + 1))}>Continuar<ArrowRight className="size-4" aria-hidden="true" /></button>
            : <div className="flex flex-wrap items-center justify-end gap-3">
                <button type="button" className="sg-back" onClick={review}>Revisar mis datos</button>
                <button type="button" className="sg-next" disabled aria-describedby="sg-unavail">Enviar solicitud</button>
              </div>}
        </div>
        {step === 2 && <p id="sg-unavail" className="mt-3 text-right text-sm opacity-75">El envío aún no está activado: puedes completar y revisar tus datos, pero todavía no se guardan ni se envían.</p>}
      </div>
    </section>
    <div aria-hidden="true" className="sg-finish"><span className="sg-finish-glow" /><span className="sg-finish-l1" /><span className="sg-finish-l2" /></div>
    </div>
  </div>;
}
