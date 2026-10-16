import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowDown, ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, Luggage, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import flightsHumanImage from "@/assets/cielito-flights-human.jpg";
import flightsPhotoImage from "@/assets/cielito-flights.jpg";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const steps = ["Tu ruta", "Quiénes viajan", "Cómo quieres viajar", "Tus datos"] as const;

type FlightForm = {
  origin: string;
  destination: string;
  tripType: "roundtrip" | "oneway";
  departureDate: string;
  returnDate: string;
  flexibility: "exactas" | "flexibles";
  adults: number;
  children: number;
  infants: number;
  travelClass: string;
  baggage: string[];
  name: string;
  whatsapp: string;
  email: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof FlightForm, string>>;

const initialForm: FlightForm = {
  origin: "",
  destination: "",
  tripType: "roundtrip",
  departureDate: "",
  returnDate: "",
  flexibility: "exactas",
  adults: 1,
  children: 0,
  infants: 0,
  travelClass: "",
  baggage: [],
  name: "",
  whatsapp: "",
  email: "",
  consent: false,
};

const baggageLabels: Record<string, string> = {
  personal: "Artículo personal",
  cabina: "Equipaje de mano / cabina",
  documentado: "Equipaje documentado",
  asesoria: "Necesito asesoría",
};

function baggageSummary(values: string[]) {
  if (values.length === 0) return "Selecciona tu equipaje";
  const firstValue = values[0];
  if (values.length === 1 && firstValue) return baggageLabels[firstValue] ?? "1 opción seleccionada";
  return `${values.length} opciones seleccionadas`;
}

export const Route = createFileRoute("/servicios/vuelos")({
  head: () => ({
    meta: [
      { title: "Cotiza tu vuelo | Cielito Tours" },
      { name: "description", content: "Cuéntanos tu ruta, fechas y necesidades. Te ayudamos a encontrar una opción de vuelo adecuada para tu viaje." },
      { property: "og:title", content: "Cotiza tu vuelo | Cielito Tours" },
      { property: "og:description", content: "Una cotización de vuelo personalizada, con acompañamiento humano de principio a fin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FlightsPage,
});

function FlightsPage() {
  return (
    <SiteShell>
      <section className="relative flex min-h-[460px] items-end overflow-hidden bg-ink text-primary-foreground sm:min-h-[440px] lg:min-h-[470px] lg:items-center">
        <img src={flightsHumanImage} alt="Viajeros iniciando su recorrido en un aeropuerto al amanecer" width={1920} height={1080} fetchPriority="high" className="absolute inset-0 size-full object-cover object-[66%_top] sm:object-[62%_20%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10 sm:bg-gradient-to-r sm:from-ink sm:via-ink/80 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent sm:hidden" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl px-6 pb-10 pt-20 sm:px-10 sm:py-11 lg:px-8 lg:py-12">
          <div className="max-w-xl">
            <p className="kicker-text font-extrabold uppercase tracking-[.18em] text-accent">Vuelos</p>
            <h1 className="mt-3 font-display text-[clamp(2.1rem,8.5vw,2.75rem)] font-extrabold uppercase leading-[1.02] sm:text-[3rem] lg:text-[3.4rem]">
              Tu próximo viaje empieza por encontrar el <span className="text-accent">vuelo adecuado.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-primary-foreground/85 sm:text-lg sm:leading-8">Cuéntanos a dónde quieres viajar, tus fechas y lo que necesitas. Nuestro equipo te ayudará a preparar una opción pensada para tu viaje.</p>
            <Button asChild size="lg" className="vuelos-hero-cta mt-6 min-h-12 w-full sm:w-auto">
              <a href="#cotizar-vuelo">Cotizar mi vuelo <ArrowDown /></a>
            </Button>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1000 300" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 w-full text-accent opacity-45"><path d="M-20 250 C240 300 310 85 555 140 S790 235 1030 35" fill="none" stroke="currentColor" strokeWidth="2" className="flight-path" /></svg>
        <div aria-hidden="true" className="paper-edge absolute inset-x-0 bottom-0 z-20 h-3" />
      </section>

      <section id="cotizar-vuelo" className="mobile-section vuelos-quote py-16 sm:py-24">
        <img src={flightsPhotoImage} alt="" aria-hidden="true" className="vuelos-quote-photo" />
        <svg aria-hidden="true" viewBox="0 0 600 800" fill="none" className="vuelos-quote-routes">
          <defs>
            <linearGradient id="vq-champagne" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="oklch(0.82 0.16 93)" stopOpacity="0" /><stop offset=".4" stopColor="oklch(0.82 0.16 93)" stopOpacity=".6" /><stop offset=".62" stopColor="oklch(0.9 0.1 95)" stopOpacity=".85" /><stop offset=".8" stopColor="oklch(0.82 0.16 93)" stopOpacity=".4" /><stop offset="1" stopColor="oklch(0.82 0.16 93)" stopOpacity="0" /></linearGradient>
            <linearGradient id="vq-bluegray" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="oklch(0.6 0.045 240)" stopOpacity="0" /><stop offset=".5" stopColor="oklch(0.6 0.045 240)" stopOpacity=".55" /><stop offset="1" stopColor="oklch(0.6 0.045 240)" stopOpacity="0" /></linearGradient>
          </defs>
          <path d="M648 96 C 430 160 396 330 178 372" stroke="url(#vq-champagne)" strokeWidth="1.5" />
          <path d="M664 268 C 472 306 434 470 214 522" stroke="url(#vq-bluegray)" strokeWidth="1.25" strokeDasharray="1 0" />
          <path d="M624 436 C 462 476 402 602 244 652" stroke="url(#vq-champagne)" strokeWidth="1" strokeDasharray="130 26 60 34" />
        </svg>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.58fr_1.42fr] lg:gap-16 lg:px-8">
          <div>
            <p className="section-kicker">Cotización personalizada</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">Cuéntanos tu ruta.</h2>
            <p className="mt-5 max-w-md font-semibold leading-7 text-ink">Preparamos tu cotización de forma personalizada.</p>
            <p className="mt-3 max-w-md leading-7 text-muted-foreground">Cuéntanos tu ruta y tus prioridades para que nuestro equipo pueda revisar opciones contigo.</p>
            <div className="mt-8 border-l-2 border-accent pl-5 text-sm leading-6 text-muted-foreground">Las opciones, condiciones y disponibilidad se confirman al momento de cotizar.</div>
          </div>
          <FlightQuoteForm />
        </div>
      </section>

      <section className="overflow-hidden bg-ink py-16 text-primary-foreground sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div><p className="kicker-text font-bold uppercase tracking-[.16em] text-accent">Una persona detrás de cada ruta</p><h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Así empieza tu cotización.</h2></div>
            <ol className="border-t border-primary-foreground/20">
              {[
                ["01", "Nos cuentas tu viaje", "Comparte tu ruta, fechas y la forma en que quieres viajar."],
                ["02", "Revisamos las opciones", "Nuestro equipo considera tus prioridades antes de preparar alternativas."],
                ["03", "Te acompañamos para elegir", "Conversamos contigo para encontrar una opción adecuada para tu viaje."],
              ].map(([number, title, copy]) => <li key={number} className="grid gap-3 border-b border-primary-foreground/20 py-7 sm:grid-cols-[4rem_minmax(0,1fr)_1.2fr] sm:items-start sm:gap-6"><span className="font-display text-xl font-bold text-accent">{number}</span><h3 className="font-display text-xl font-bold">{title}</h3><p className="text-sm leading-6 text-primary-foreground/65">{copy}</p></li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-secondary py-16 sm:py-24">
        <svg aria-hidden="true" viewBox="0 0 1000 260" className="pointer-events-none absolute inset-0 hidden size-full text-primary opacity-15 sm:block"><path d="M-20 210 C180 40 350 265 540 105 S790 30 1030 155" fill="none" stroke="currentColor" strokeWidth="2" className="route-line" /></svg>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="section-kicker">Tu ruta es el inicio</p>
          <h2 className="mt-5 font-display text-4xl font-bold uppercase leading-tight text-ink sm:text-6xl">¿Ya sabes a dónde quieres volar?</h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">Cuéntanos tu ruta y empecemos a preparar tu viaje.</p>
          <Button asChild size="lg" className="mt-8 min-h-12 w-full sm:w-auto"><a href="#cotizar-vuelo">Cotizar mi vuelo <ArrowRight /></a></Button>
        </div>
      </section>
    </SiteShell>
  );
}

function FlightQuoteForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FlightForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [previewNotice, setPreviewNotice] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof FlightForm>(field: K, value: FlightForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPreviewNotice(false);
  };

  const validate = (currentStep: number) => {
    const next: FieldErrors = {};
    if (currentStep === 0) {
      if (!form.origin.trim()) next.origin = "Indica desde dónde quieres salir.";
      if (!form.destination.trim()) next.destination = "Indica a dónde quieres viajar.";
      if (!form.departureDate) next.departureDate = "Selecciona una fecha de salida.";
      if (form.tripType === "roundtrip" && !form.returnDate) next.returnDate = "Selecciona una fecha de regreso.";
      if (form.tripType === "roundtrip" && form.returnDate && form.departureDate && form.returnDate < form.departureDate) next.returnDate = "El regreso debe ser posterior a la salida.";
    }
    if (currentStep === 1 && form.adults < 1) next.adults = "Debe viajar al menos una persona adulta.";
    if (currentStep === 2) {
      if (!form.travelClass) next.travelClass = "Selecciona una clase.";
      if (form.baggage.length === 0) next.baggage = "Selecciona al menos una opción de equipaje.";
    }
    if (currentStep === 3) {
      if (!form.name.trim()) next.name = "Escribe tu nombre.";
      if (!form.whatsapp.trim()) next.whatsapp = "Escribe tu número de WhatsApp.";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Escribe un correo electrónico válido.";
      if (!form.consent) next.consent = "Necesitamos tu aceptación para poder contactarte.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const continueForm = () => {
    if (!validate(step)) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate(3)) return;
    setPreviewNotice(true);
  };

  const labelClass = "mb-2 block text-sm font-bold text-ink";
  const inputClass = "h-12 border-border bg-background px-4 focus-visible:ring-2";
  const today = format(startOfToday(), "yyyy-MM-dd");

  const setTripType = (tripType: FlightForm["tripType"]) => {
    setForm((current) => ({ ...current, tripType, returnDate: tripType === "oneway" ? "" : current.returnDate }));
    setErrors((current) => {
      const { returnDate: _returnDate, ...remaining } = current;
      return remaining;
    });
    setPreviewNotice(false);
  };

  const toggleBaggage = (value: string) => {
    const baggage = value === "asesoria"
      ? (form.baggage.includes("asesoria") ? [] : ["asesoria"])
      : form.baggage.includes(value)
        ? form.baggage.filter((item) => item !== value)
        : [...form.baggage.filter((item) => item !== "asesoria"), value];
    update("baggage", baggage);
  };

  return <form onSubmit={submit} noValidate className="min-w-0 border border-border bg-card shadow-sm" aria-label="Cotización de vuelo">
    <div className="border-b border-border bg-secondary/55 px-5 py-5 sm:px-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0"><p className="kicker-text font-extrabold uppercase tracking-[.14em] text-primary">Paso {step + 1} de {steps.length}</p><p className="mt-1 truncate text-sm font-semibold text-ink">{steps[step]}</p></div>
        <span className="text-sm font-bold text-muted-foreground">{Math.round(((step + 1) / steps.length) * 100)}%</span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">{steps.map((item, index) => <span key={item} className={`h-1 ${index <= step ? "bg-primary" : "bg-border"}`} />)}</div>
    </div>

    <div className="px-5 py-7 sm:px-8 sm:py-9">
      <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold text-ink outline-none sm:text-3xl">{steps[step]}</h3>
      {step === 0 && <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Origen" htmlFor="flight-origin" error={errors.origin}><Input id="flight-origin" autoComplete="address-level2" value={form.origin} onChange={(event) => update("origin", event.target.value)} aria-invalid={Boolean(errors.origin)} aria-describedby={errors.origin ? "flight-origin-error" : undefined} className={inputClass} placeholder="Ej. Ciudad de México" /></Field>
        <Field label="Destino" htmlFor="flight-destination" error={errors.destination}><Input id="flight-destination" autoComplete="off" value={form.destination} onChange={(event) => update("destination", event.target.value)} aria-invalid={Boolean(errors.destination)} aria-describedby={errors.destination ? "flight-destination-error" : undefined} className={inputClass} placeholder="Ej. Madrid" /></Field>
        <fieldset className="sm:col-span-2"><legend className={labelClass}>Tipo de viaje</legend><div className="grid grid-cols-2 gap-3">{[["roundtrip", "Ida y vuelta"], ["oneway", "Solo ida"]].map(([value, text]) => <label key={value} className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-ring", form.tripType === value ? "border-primary bg-secondary text-ink" : "border-border bg-background text-muted-foreground hover:bg-secondary/55")}><input type="radio" name="tripType" value={value} checked={form.tripType === value} onChange={() => setTripType(value as FlightForm["tripType"])} className="size-4 accent-primary" />{text}</label>)}</div></fieldset>
        <DateField label="Fecha de salida" id="flight-departure" value={form.departureDate} min={today} error={errors.departureDate} onChange={(value) => { update("departureDate", value); if (form.returnDate && form.returnDate < value) update("returnDate", ""); }} />
        {form.tripType === "roundtrip" && <DateField label="Fecha de regreso" id="flight-return" value={form.returnDate} min={form.departureDate || today} error={errors.returnDate} onChange={(value) => update("returnDate", value)} />}
        <fieldset className="sm:col-span-2"><legend className={labelClass}>Flexibilidad de fechas</legend><div className="grid gap-3 sm:grid-cols-2">{[["exactas", "Fechas exactas"], ["flexibles", "Tengo cierta flexibilidad"]].map(([value, text]) => <label key={value} className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-ring ${form.flexibility === value ? "border-primary bg-secondary text-ink" : "border-border text-muted-foreground"}`}><input type="radio" name="flexibility" value={value} checked={form.flexibility === value} onChange={() => update("flexibility", value as FlightForm["flexibility"])} className="size-4 accent-primary" />{text}</label>)}</div></fieldset>
      </div>}

      {step === 1 && <div className="mt-7"><div className="grid gap-3">{[
        ["adults", "Adultos", "12 años o más", 1],
        ["children", "Niños", "2 a 11 años", 0],
        ["infants", "Infantes", "Menores de 2 años", 0],
      ].map(([field, title, description, minimum]) => {
        const key = field as "adults" | "children" | "infants";
        const count = form[key];
        return <div key={key} className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-background px-4 py-3"><div><p className="font-display text-base font-bold text-ink">{title}</p><p className="mt-1 text-xs text-muted-foreground">{description}</p></div><div className="grid grid-cols-[2.75rem_2.5rem_2.75rem] items-center"><Button type="button" variant="ghost" size="icon" aria-label={`Restar ${String(title).toLowerCase()}`} disabled={count <= Number(minimum)} className="size-11" onClick={() => update(key, Math.max(Number(minimum), count - 1))}><Minus /></Button><output aria-live="polite" aria-label={`${title}: ${count}`} className="text-center font-display text-xl font-bold text-ink">{count}</output><Button type="button" variant="ghost" size="icon" aria-label={`Agregar ${String(title).toLowerCase()}`} disabled={count >= 20} className="size-11" onClick={() => update(key, Math.min(20, count + 1))}><Plus /></Button></div></div>;
      })}</div>{errors.adults && <p role="alert" className="mt-2 text-sm font-semibold text-destructive">{errors.adults}</p>}</div>}

      {step === 2 && <div className="mt-7 grid gap-6">
        <Field label="Clase" htmlFor="flight-class" error={errors.travelClass}><div className="relative"><select id="flight-class" value={form.travelClass} onChange={(event) => update("travelClass", event.target.value)} aria-invalid={Boolean(errors.travelClass)} aria-describedby={errors.travelClass ? "flight-class-error" : undefined} className="h-12 w-full appearance-none rounded-md border border-border bg-background px-4 pr-11 text-sm font-semibold text-ink outline-none transition-colors hover:bg-secondary/40 focus:border-primary focus:ring-2 focus:ring-ring"><option value="" disabled>Selecciona una clase</option><option value="economica">Económica</option><option value="economica-premium">Económica Premium</option><option value="ejecutiva">Ejecutiva / Business</option><option value="primera">Primera, cuando esté disponible</option><option value="asesoria">Necesito asesoría</option></select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary" /></div></Field>
        <fieldset><legend className={labelClass}>Equipaje</legend><details className={cn("group rounded-md border bg-background", errors.baggage ? "border-destructive" : "border-border")}><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 text-sm font-semibold text-ink outline-none transition-colors hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"><span className="flex min-w-0 items-center gap-3"><Luggage aria-hidden="true" className="size-4 shrink-0 text-primary" /><span className="truncate">{baggageSummary(form.baggage)}</span></span><ChevronDown aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-open:rotate-180" /></summary><div className="grid gap-2 border-t border-border p-3">{([
          ["personal", "Artículo personal", "Bolso o mochila pequeña que normalmente viaja debajo del asiento."],
          ["cabina", "Equipaje de mano / cabina", "Maleta pequeña que normalmente viaja en el compartimento superior."],
          ["documentado", "Equipaje documentado", "Equipaje que se entrega en mostrador y viaja en bodega."],
          ["asesoria", "Necesito asesoría", "Todavía no sé qué equipaje necesitaré."],
        ] as const).map(([value, title, description]) => { const selected = form.baggage.includes(value); return <label key={value} className={cn("flex min-h-16 cursor-pointer items-start gap-3 rounded-md border px-3 py-3 transition-colors focus-within:ring-2 focus-within:ring-ring", selected ? "border-primary bg-secondary" : "border-transparent hover:bg-secondary/40")}><Checkbox checked={selected} onCheckedChange={() => toggleBaggage(value)} aria-label={title} className="mt-1 size-5" /><span><span className="block text-sm font-bold text-ink">{title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span></span></label>; })}</div></details>{errors.baggage && <p id="flight-baggage-error" role="alert" className="mt-2 text-sm font-semibold text-destructive">{errors.baggage}</p>}</fieldset>
        <p className="text-sm leading-6 text-muted-foreground">Estas preferencias nos ayudan a entender tu viaje; no representan una tarifa ni disponibilidad.</p>
      </div>}

      {step === 3 && <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="flight-name" error={errors.name}><Input id="flight-name" autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "flight-name-error" : undefined} className={inputClass} /></Field>
        <Field label="WhatsApp" htmlFor="flight-whatsapp" error={errors.whatsapp}><Input id="flight-whatsapp" type="tel" inputMode="tel" autoComplete="tel" value={form.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? "flight-whatsapp-error" : undefined} className={inputClass} placeholder="Ej. 55 1234 5678" /></Field>
        <div className="sm:col-span-2"><Field label="Correo electrónico" htmlFor="flight-email" error={errors.email}><Input id="flight-email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "flight-email-error" : undefined} className={inputClass} placeholder="nombre@correo.com" /></Field></div>
        <div className="sm:col-span-2"><label className="flex min-h-12 cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground"><Checkbox checked={form.consent} onCheckedChange={(value) => update("consent", value === true)} aria-label="Aceptar aviso de privacidad" className="mt-1 size-5" /><span>Acepto el <Link to="/privacidad" className="font-semibold text-primary underline underline-offset-4">aviso de privacidad</Link> y que Cielito Tours me contacte para atender esta solicitud.</span></label>{errors.consent && <p role="alert" className="mt-2 text-sm font-semibold text-destructive">{errors.consent}</p>}</div>
        <div role="note" className="border-l-2 border-accent bg-secondary p-4 text-sm leading-6 text-ink sm:col-span-2"><strong>Vista previa:</strong> en esta etapa el formulario todavía no envía ni guarda información.</div>
        {previewNotice && <p role="status" className="text-sm font-semibold leading-6 text-primary sm:col-span-2">La integración sigue pendiente. Ninguna información fue enviada ni guardada.</p>}
      </div>}
    </div>

    <div className="grid gap-3 border-t border-border px-5 py-5 sm:flex sm:items-center sm:justify-between sm:px-8">
      {step > 0 ? <Button type="button" variant="ghost" className="min-h-11 justify-self-start" onClick={() => { setErrors({}); setPreviewNotice(false); setStep((current) => current - 1); }}><ArrowLeft /> Atrás</Button> : <span />}
      {step < steps.length - 1 ? <Button type="button" className="min-h-11 w-full sm:w-auto" onClick={continueForm}>Continuar <ArrowRight /></Button> : <Button type="submit" className="min-h-11 w-full sm:w-auto">Solicitar cotización <ArrowRight /></Button>}
    </div>
  </form>;
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error: string | undefined; children: ReactNode }) {
  return <div className="min-w-0"><label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-ink">{label}</label>{children}{error && <p id={`${htmlFor}-error`} role="alert" className="mt-2 text-sm font-semibold text-destructive">{error}</p>}</div>;
}

function DateField({ label, id, value, min, error, onChange }: { label: string; id: string; value: string; min: string; error: string | undefined; onChange: (value: string) => void }) {
  const selected = value ? parseISO(value) : undefined;
  const minimum = parseISO(min);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return <div className="min-w-0"><label htmlFor={`${id}-native`} className="mb-2 block text-sm font-bold text-ink">{label}</label><Input id={`${id}-native`} type="date" min={min} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="h-12 border-border bg-background px-4 focus-visible:ring-2 md:hidden" /><div ref={wrapperRef} className="relative hidden md:block"><Button id={id} type="button" variant="outline" onClick={() => setOpen((previous) => !previous)} aria-haspopup="dialog" aria-expanded={open} aria-label={`${label}: ${selected ? format(selected, "d 'de' MMMM 'de' yyyy", { locale: es }) : "sin seleccionar"}`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={cn("h-12 w-full justify-start rounded-md border-border bg-background px-4 text-left font-normal", !selected && "text-muted-foreground")}><CalendarDays className="size-4 text-primary" />{selected ? format(selected, "d 'de' MMMM 'de' yyyy", { locale: es }) : "Selecciona una fecha"}</Button>{open && <div role="dialog" aria-label={label} className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-auto rounded-xl border border-border bg-popover p-2 shadow-lg motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95"><Calendar mode="single" selected={selected} onSelect={(date) => { if (!date) return; onChange(format(date, "yyyy-MM-dd")); setOpen(false); }} disabled={{ before: minimum }} defaultMonth={selected ?? minimum} locale={es} autoFocus className="rounded-lg p-3 [--cell-size:2.5rem]" classNames={{ today: "relative after:absolute after:bottom-0.5 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-accent", disabled: "text-muted-foreground opacity-35", day: "hover:bg-secondary rounded-md" }} /></div>}</div>{error && <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-destructive">{error}</p>}</div>;
}