import { useId, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/* COTIZAR-D3D — dates, trip type and travellers for Cielito Signature step 1.
   Dates are kept as local "yyyy-MM-dd" strings (no UTC shifts). */

export type TripType = "round" | "oneway";
export type Travelers = { adults: number; children: number; infants: number; /** large group, free number */ group?: number | undefined };
export type TripDates = { start: string; end: string; flexible: boolean };

export const TRAVELER_LIMITS = { adults: [1, 20], children: [0, 20], infants: [0, 20] } as const;

export const ymd = (d: Date) => format(d, "yyyy-MM-dd");
export const parseYmd = (s: string) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined; const [y, m, d] = s.split("-").map(Number); return new Date(y!, m! - 1, d!); };
const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
export const pretty = (s: string) => { const d = parseYmd(s); return d ? format(d, "d 'de' MMMM 'de' yyyy", { locale: es }) : ""; };

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
export function travelersSummary(t: Travelers) {
  if (t.group) return `Grupo de ${t.group} personas aprox. (requiere asesoría)`;
  return [plural(t.adults, "adulto", "adultos"), t.children ? plural(t.children, "niño", "niños") : "", t.infants ? plural(t.infants, "infante", "infantes") : ""].filter(Boolean).join(" · ");
}

export type TripErrors = Partial<Record<"start" | "end" | "travelers", string>>;
export function validateTrip(d: TripDates, needsEnd: boolean, t: Travelers): TripErrors {
  const e: TripErrors = {};
  const s = parseYmd(d.start), en = parseYmd(d.end);
  if (!d.flexible) {
    if (!s) e.start = "Elige la fecha de salida o marca «Todavía no tengo fechas definidas».";
    else if (s < today()) e.start = "La fecha de salida no puede estar en el pasado.";
    if (needsEnd) {
      if (!en) e.end = "Elige la fecha de regreso.";
      else if (s && en < s) e.end = "El regreso no puede ser anterior a la salida.";
    }
  }
  if (t.group !== undefined) { if (!Number.isInteger(t.group) || t.group < 2 || t.group > 5000) e.travelers = "Indica un número aproximado de viajeros (2 a 5000)."; }
  else if (t.adults < 1) e.travelers = "Debe viajar al menos un adulto.";
  else if ([t.adults, t.children, t.infants].some((n) => n < 0)) e.travelers = "Las cantidades no pueden ser negativas.";
  return e;
}

export function DateField({ label, value, onChange, min, error, disabled }: { label: string; value: string; onChange: (v: string) => void; min: Date; error?: string | undefined; disabled?: boolean }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const sel = parseYmd(value);
  return <div className="sg-field">
    <span id={`${id}-l`} className="sg-label">{label}</span>
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" disabled={disabled} aria-labelledby={`${id}-l`} aria-describedby={error ? `${id}-e` : undefined} aria-invalid={Boolean(error)}
          className={cn("sg-input sg-date", sel && "has-value", error && "is-err")}>
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{sel ? format(sel, "EEE d 'de' MMMM yyyy", { locale: es }) : "Selecciona una fecha"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} collisionPadding={12} className="sg-cal-pop w-auto p-0">
        <Calendar mode="single" selected={sel} defaultMonth={sel ?? min} locale={es} disabled={{ before: min }} autoFocus
          onSelect={(d) => { if (d) { onChange(ymd(d)); setOpen(false); } }} className="pointer-events-auto p-3" />
      </PopoverContent>
    </Popover>
    {error && <p id={`${id}-e`} role="alert" className="sg-err">{error}</p>}
  </div>;
}

type Props = {
  flights: boolean; multi: boolean; tripType: TripType; onTripType: (t: TripType) => void;
  dates: TripDates; onDates: (d: TripDates) => void; travelers: Travelers; onTravelers: (t: Travelers) => void; errors: TripErrors;
};

export function TripFields({ flights, multi, tripType, onTripType, dates, onDates, travelers, onTravelers, errors }: Props) {
  const needsEnd = !(flights && tripType === "oneway");
  const startD = parseYmd(dates.start);
  const endLabel = flights ? "Fecha de regreso" : "Fecha de finalización";
  const rows = [
    ["adults", "Adultos", "12 años o más"],
    ["children", "Niños", "2 a 11 años"],
    ["infants", "Infantes", "Menores de 2 años"],
  ] as const;
  const set = (k: "adults" | "children" | "infants", v: number) => { const [lo, hi] = TRAVELER_LIMITS[k]; onTravelers({ ...travelers, [k]: Math.max(lo, Math.min(hi, v)) }); };

  return <div className="sg-trip">
    {flights && <div className="sg-field">
      <span className="sg-label" id="sg-tt">Tipo de vuelo</span>
      <div className="sg-seg" role="radiogroup" aria-labelledby="sg-tt">
        {([["round", "Ida y vuelta"], ["oneway", "Solo ida"]] as const).map(([v, l]) =>
          <button key={v} type="button" role="radio" aria-checked={tripType === v} className={cn("sg-seg-opt", tripType === v && "is-on")} onClick={() => onTripType(v)}>{l}</button>)}
      </div>
    </div>}

    <div className="grid gap-5 md:grid-cols-2">
      <DateField label={flights ? "Fecha de salida" : "Fecha de inicio"} value={dates.start} min={today()} disabled={dates.flexible} error={dates.flexible ? undefined : errors.start}
        onChange={(v) => { const s = parseYmd(v), e = parseYmd(dates.end); onDates({ ...dates, start: v, end: s && e && e < s ? "" : dates.end }); }} />
      {needsEnd && <DateField label={endLabel} value={dates.end} min={startD && startD > today() ? startD : today()} disabled={dates.flexible} error={dates.flexible ? undefined : errors.end}
        onChange={(v) => onDates({ ...dates, end: v })} />}
    </div>
    <label className="sg-flex">
      <input type="checkbox" checked={dates.flexible} onChange={(e) => onDates({ ...dates, flexible: e.target.checked })} />
      <span>Todavía no tengo fechas definidas</span>
    </label>
    {dates.flexible && <p className="sg-hint">Marcaremos tu solicitud con fechas flexibles. {dates.start ? `Conservamos como referencia: ${pretty(dates.start)}${needsEnd && dates.end ? ` – ${pretty(dates.end)}` : ""}.` : ""}</p>}
    {multi && <p className="sg-hint">Son las fechas generales del viaje. Si vuelo, hospedaje o auto tienen fechas distintas, podrás indicarlo en el paso 02.</p>}

    <div className="sg-field">
      <p className="sg-label">Viajeros <span className="sg-trav-sum" aria-live="polite">· {travelersSummary(travelers)}</span></p>
      {travelers.group === undefined && <div className="sg-trav">
        {rows.map(([k, title, desc]) => {
          const n = travelers[k], [lo, hi] = TRAVELER_LIMITS[k];
          const max = hi;
          return <div key={k} className="sg-trav-row">
            <div><p className="sg-trav-t">{title}</p><p className="sg-trav-d">{desc}</p></div>
            <div className="sg-ctr">
              <button type="button" aria-label={`Restar ${title.toLowerCase()}`} disabled={n <= lo} onClick={() => set(k, n - 1)}><Minus className="size-4" aria-hidden="true" /></button>
              <output aria-label={`${title}: ${n}`}>{n}</output>
              <button type="button" aria-label={`Agregar ${title.toLowerCase()}`} disabled={n >= max} onClick={() => set(k, n + 1)}><Plus className="size-4" aria-hidden="true" /></button>
            </div>
          </div>;
        })}
      </div>}
      {flights && travelers.group === undefined && travelers.infants > travelers.adults && <p className="sg-hint sg-warn" role="status">La cantidad de infantes deberá revisarse según las condiciones de la aerolínea. Nuestro equipo te ayudará a confirmarlo.</p>}
      <label className="sg-flex mt-3">
        <input type="checkbox" checked={travelers.group !== undefined} onChange={(e) => onTravelers({ ...travelers, group: e.target.checked ? Math.max(21, travelers.adults + travelers.children + travelers.infants) : undefined })} />
        <span>Somos un grupo grande (más de 20 personas)</span>
      </label>
      {travelers.group !== undefined && <div className="mt-3 max-w-xs">
        <label htmlFor="sg-group" className="sg-label">Número aproximado de viajeros</label>
        <input id="sg-group" type="number" inputMode="numeric" min={2} max={5000} className="sg-input sg-text w-full" value={travelers.group || ""}
          onChange={(e) => onTravelers({ ...travelers, group: e.target.value === "" ? 0 : Math.max(0, Math.floor(Number(e.target.value))) })} />
        <p className="sg-hint mt-2">Un asesor de grupos te contactará para revisar edades y detalles.</p>
      </div>}
      {errors.travelers && <p role="alert" className="sg-err">{errors.travelers}</p>}
    </div>
  </div>;
}
