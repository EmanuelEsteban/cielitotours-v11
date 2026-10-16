import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { DateField, parseYmd, pretty } from "./trip-fields";

/* COTIZAR-D4 — dynamic step-02 preferences per selected service. Nothing here is required;
   empty values are never shown as customer decisions. Data is kept even if a service is unselected. */

export type Prefs = {
  vuelos: { cabin: string; bags: string[]; stops: string };
  hospedaje: { type: string; rooms: number; tags: string[] };
  auto: { type: string; pickup: string; start: string; end: string };
  tours: { kinds: string[]; notes: string };
  cruceros: { region: string; cabin: string; notes: string; start: string; end: string };
  otros: { notes: string };
};

export const EMPTY_PREFS: Prefs = {
  vuelos: { cabin: "", bags: [], stops: "" },
  hospedaje: { type: "", rooms: 0, tags: [] },
  auto: { type: "", pickup: "", start: "", end: "" },
  tours: { kinds: [], notes: "" },
  cruceros: { region: "", cabin: "", notes: "", start: "", end: "" },
  otros: { notes: "" },
};

const O = {
  cabin: ["Económica", "Económica Premium", "Ejecutiva", "Primera (cuando esté disponible)", "Necesito asesoría"],
  bags: ["Artículo personal", "Equipaje de mano", "Equipaje documentado", "Necesito asesoría"],
  stops: ["Directo si está disponible", "Acepto escalas", "Sin preferencia"],
  hotel: ["Hotel", "Resort", "Todo incluido", "Departamento", "Boutique", "Necesito asesoría"],
  hotelTags: ["Playa", "Centro", "Familiar", "Alberca", "Desayuno", "Todo incluido", "Accesibilidad", "Viaje romántico", "Negocios", "Otros"],
  car: ["Económico", "Sedán", "SUV", "Van", "Otro", "Necesito asesoría"],
  pickup: ["Aeropuerto", "Hotel", "Otro", "Por definir"],
  tours: ["Cultural", "Naturaleza", "Aventura", "Gastronomía", "Familiar", "Otros"],
  cabinCruise: ["Interior", "Exterior", "Balcón", "Suite", "Necesito asesoría"],
};

const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };

function Chips({ label, options, value, onChange, multi }: { label: string; options: string[]; value: string | string[]; onChange: (v: never) => void; multi?: boolean }) {
  const sel = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  const click = (o: string) => {
    if (multi) { const v = value as string[]; (onChange as (v: string[]) => void)(v.includes(o) ? v.filter((x) => x !== o) : [...v, o]); }
    else (onChange as (v: string) => void)(value === o ? "" : o);
  };
  return <div className="sg-field">
    <p className="sg-label">{label} <span className="sg-opt">{multi ? "Opcional · puedes elegir varias" : "Opcional"}</span></p>
    <div className="sg-chips" role="group" aria-label={label}>
      {options.map((o) => <button key={o} type="button" aria-pressed={sel(o)} className={cn("sg-chip", sel(o) && "is-on")} onClick={() => click(o)}>{o}</button>)}
    </div>
  </div>;
}

export function Text({ id, label, value, onChange, placeholder, area, hint }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; area?: boolean; hint?: string }) {
  return <div className="sg-field">
    <label htmlFor={id} className="sg-label">{label} <span className="sg-opt">Opcional</span></label>
    {hint && <p id={`${id}-h`} className="sg-sub" style={{ marginTop: 0 }}>{hint}</p>}
    {area ? <textarea id={id} rows={3} aria-describedby={hint ? `${id}-h` : undefined} maxLength={800} className="sg-input sg-text sg-area" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      : <input id={id} maxLength={160} className="sg-input sg-text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
  </div>;
}

export type TripRange = { start: string; end: string } | null;
/** COTIZAR-FINAL-04B — true when specific dates fall outside the general trip range (informative only). */
export function outsideTrip(start: string, end: string, trip: TripRange): boolean {
  if (!trip) return false;
  const ts = parseYmd(trip.start), te = parseYmd(trip.end) ?? ts;
  if (!ts || !te) return false;
  return [parseYmd(start), parseYmd(end)].some((d) => d && (d < ts || d > te));
}
function OptDates({ start, end, onChange, trip }: { start: string; end: string; onChange: (s: string, e: string) => void; trip: TripRange }) {
  const s = parseYmd(start);
  return <div className="grid gap-4 md:grid-cols-2">
    <DateField label="Fecha de inicio específica (opcional)" value={start} min={today()} onChange={(v) => { const n = parseYmd(v), e = parseYmd(end); onChange(v, n && e && e < n ? "" : end); }} />
    <DateField label="Fecha de fin específica (opcional)" value={end} min={s && s > today() ? s : today()} onChange={(v) => onChange(start, v)} />
    {outsideTrip(start, end, trip) && <p className="sg-hint sg-hint-flow sg-warn md:col-span-2" role="status">Estas fechas son diferentes a las generales de tu viaje. Puedes conservarlas; las revisaremos al preparar tu cotización.</p>}
  </div>;
}

type Svc = { id: string; label: string; icon: ComponentType<{ className?: string }> };

export function ServicePrefs({ services, prefs, onPrefs, trip = null }: { services: Svc[]; prefs: Prefs; onPrefs: (p: Prefs) => void; trip?: TripRange }) {
  const up = <K extends keyof Prefs>(k: K, patch: Partial<Prefs[K]>) => onPrefs({ ...prefs, [k]: { ...prefs[k], ...patch } });
  const body = (id: string) => {
    switch (id) {
      case "vuelos": { const p = prefs.vuelos; return <>
        <Chips label="Clase" options={O.cabin} value={p.cabin} onChange={(v: string) => up("vuelos", { cabin: v })} />
        <Chips label="Equipaje" multi options={O.bags} value={p.bags} onChange={(v: string[]) => up("vuelos", { bags: v })} />
        <Chips label="Preferencia de vuelo" options={O.stops} value={p.stops} onChange={(v: string) => up("vuelos", { stops: v })} />
      </>; }
      case "hospedaje": { const p = prefs.hospedaje; return <>
        <Chips label="Tipo de hospedaje" options={O.hotel} value={p.type} onChange={(v: string) => up("hospedaje", { type: v })} />
        <div className="sg-field">
          <p className="sg-label">Habitaciones <span className="sg-opt">Opcional · aproximado</span></p>
          <div className="sg-ctr w-fit">
            <button type="button" aria-label="Restar habitaciones" disabled={p.rooms <= 0} onClick={() => up("hospedaje", { rooms: p.rooms - 1 })}>−</button>
            <output aria-label={`Habitaciones: ${p.rooms || "sin indicar"}`}>{p.rooms || "—"}</output>
            <button type="button" aria-label="Agregar habitaciones" disabled={p.rooms >= 50} onClick={() => up("hospedaje", { rooms: p.rooms + 1 })}>+</button>
          </div>
        </div>
        <Chips label="Preferencias" multi options={O.hotelTags} value={p.tags} onChange={(v: string[]) => up("hospedaje", { tags: v })} />
      </>; }
      case "auto": { const p = prefs.auto; return <>
        <Chips label="Tipo de vehículo" options={O.car} value={p.type} onChange={(v: string) => up("auto", { type: v })} />
        <Chips label="Lugar de recogida" options={O.pickup} value={p.pickup} onChange={(v: string) => up("auto", { pickup: v })} />
        <OptDates start={p.start} end={p.end} onChange={(start, end) => up("auto", { start, end })} trip={trip} />
      </>; }
      case "tours": { const p = prefs.tours; return <>
        <Chips label="Tipo de experiencias" multi options={O.tours} value={p.kinds} onChange={(v: string[]) => up("tours", { kinds: v })} />
        <Text id="sg-tour-n" area label="Actividades deseadas" placeholder="Ej. visitar zonas arqueológicas, nado con tortugas…" value={p.notes} onChange={(v) => up("tours", { notes: v })} />
      </>; }
      case "cruceros": { const p = prefs.cruceros; return <>
        <Text id="sg-cr-r" label="Región o destino deseado" placeholder="Ej. Caribe, Mediterráneo, Alaska…" value={p.region} onChange={(v) => up("cruceros", { region: v })} />
        <Chips label="Tipo de camarote" options={O.cabinCruise} value={p.cabin} onChange={(v: string) => up("cruceros", { cabin: v })} />
        <Text id="sg-cr-n" area label="Preferencias generales" value={p.notes} onChange={(v) => up("cruceros", { notes: v })} />
        <OptDates start={p.start} end={p.end} onChange={(start, end) => up("cruceros", { start, end })} trip={trip} />
      </>; }
      case "otros": return <Text id="sg-ot-n" area label="Cuéntanos qué más necesitas" placeholder="Seguro de viaje, traslados, eventos, trámites…" value={prefs.otros.notes} onChange={(v) => up("otros", { notes: v })} />;
      default: return null;
    }
  };
  return <div className="sg-mods">
    {services.map(({ id, label, icon: Icon }) => <section key={id} className="sg-mod" aria-labelledby={`sg-mod-${id}`}>
      <h3 id={`sg-mod-${id}`} className="sg-mod-h"><Icon className="size-4" />{label}</h3>
      <div className="sg-mod-b">{body(id)}</div>
    </section>)}
  </div>;
}

const range = (s: string, e: string) => (s || e ? `fechas propias: ${[pretty(s), pretty(e)].filter(Boolean).join(" – ")}` : "");
const join = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" · ");

/** Only filled-in values; returns "" when the customer chose nothing for that service. */
export function prefsSummary(id: string, p: Prefs): string {
  switch (id) {
    case "vuelos": return join(p.vuelos.cabin, p.vuelos.bags.join(", "), p.vuelos.stops);
    case "hospedaje": return join(p.hospedaje.type, p.hospedaje.rooms > 0 && `${p.hospedaje.rooms} ${p.hospedaje.rooms === 1 ? "habitación" : "habitaciones"}`, p.hospedaje.tags.join(", "));
    case "auto": return join(p.auto.type, p.auto.pickup && `recogida: ${p.auto.pickup}`, range(p.auto.start, p.auto.end));
    case "tours": return join(p.tours.kinds.join(", "), );
    case "cruceros": return join(p.cruceros.region.trim(), p.cruceros.cabin && `camarote ${p.cruceros.cabin.toLowerCase()}`, range(p.cruceros.start, p.cruceros.end));
    case "otros": return p.otros.notes.trim() ? `“${p.otros.notes.trim().slice(0, 100)}”` : "";
    default: return "";
  }
}
