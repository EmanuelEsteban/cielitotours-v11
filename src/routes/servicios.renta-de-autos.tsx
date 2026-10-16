import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, ArrowRight, CalendarDays, Car, ChevronDown, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import autosHeroImage from "@/assets/autos-hero-coast.jpg";
import autosProcessImage from "@/assets/autos-process-coast.jpg";
import autosQuoteRoadImage from "@/assets/autos-quote-road-reflection.jpg";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const steps = ["Recogida y devolución", "Quiénes viajan", "Qué auto necesitas", "Tus datos"] as const;

type CarForm = {
  pickupPlace: string;
  dropoffPlace: string;
  sameLocation: boolean;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  passengers: number;
  driverAge: string;
  category: string;
  needs: string[];
  name: string;
  whatsapp: string;
  email: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof CarForm, string>>;

const initialForm: CarForm = {
  pickupPlace: "",
  dropoffPlace: "",
  sameLocation: true,
  pickupDate: "",
  pickupTime: "",
  dropoffDate: "",
  dropoffTime: "",
  passengers: 1,
  driverAge: "",
  category: "",
  needs: [],
  name: "",
  whatsapp: "",
  email: "",
  consent: false,
};

const needOptions = [
  ["equipaje", "Viajo con mucho equipaje"],
  ["ninos", "Viajo con niños"],
  ["espacio", "Necesito espacio adicional"],
  ["negocios", "Viaje de negocios"],
  ["recorrido", "Recorrido largo"],
  ["asesoria", "Necesito asesoría"],
] as const;

const needLabels = Object.fromEntries(needOptions) as Record<string, string>;

function needsSummary(values: string[]) {
  if (values.length === 0) return "Agregar detalles (opcional)";
  const first = values[0];
  if (values.length === 1 && first) return needLabels[first] ?? "1 detalle seleccionado";
  return `${values.length} detalles seleccionados`;
}

export const Route = createFileRoute("/servicios/renta-de-autos")({
  head: () => ({
    meta: [
      { title: "Cotiza la renta de tu auto | Cielito Tours" },
      { name: "description", content: "Cuéntanos dónde y cuándo necesitas tu auto y preparamos contigo una opción adecuada para tu recorrido." },
      { property: "og:title", content: "Cotiza la renta de tu auto | Cielito Tours" },
      { property: "og:description", content: "Renta de autos con acompañamiento personalizado de Cielito Tours: tu viaje sigue a tu ritmo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarsPage,
});

function CarsPage() {
  return (
    <SiteShell>
      <section className="autos-hero">
        <img src={autosHeroImage} alt="SUV moderno recorriendo una carretera costera al atardecer" width={1920} height={1088} fetchPriority="high" className="autos-hero-photo" />
        <div className="autos-hero-veil" aria-hidden="true" />
        <svg aria-hidden="true" viewBox="0 0 1000 200" preserveAspectRatio="none" className="autos-hero-route"><path d="M-20 170 C220 130 360 45 560 95 S840 155 1030 65" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 12" /></svg>
        <div className="autos-hero-inner">
          <p className="autos-kicker"><span aria-hidden="true" className="autos-kicker-rule" />Renta de autos<span aria-hidden="true" className="autos-kicker-rule" /></p>
          <h1 className="autos-hero-title">Tu viaje sigue<br /><span>a tu ritmo.</span></h1>
          <p className="autos-hero-copy">Cuéntanos dónde necesitas tu auto, tus fechas y cómo vas a viajar. Te ayudamos a preparar una opción adecuada para tu recorrido.</p>
          <Button asChild size="lg" className="autos-cta"><a href="#cotizar-auto">Cotizar mi auto <ArrowRight aria-hidden="true" /></a></Button>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 48" preserveAspectRatio="none" className="autos-wave autos-wave-hero">
          <path className="autos-wave-fill" d="M0 48V9C240 41 460 32 720 18S1130 43 1440 5V48Z" />
          <path className="autos-wave-thread" d="M0 9C240 41 460 32 720 18S1130 43 1440 5" />
        </svg>
      </section>

      <section id="cotizar-auto" className="autos-quote">
        <div className="autos-quote-surface" aria-hidden="true">
          <div className="autos-quote-reflections" />
          <img src={autosQuoteRoadImage} alt="" width={1536} height={1024} loading="lazy" className="autos-quote-road" />
          <svg className="autos-quote-routes" viewBox="0 0 1200 560" fill="none">
            <defs><linearGradient id="autos-quote-route-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="currentColor" stopOpacity="0" /><stop offset=".3" stopColor="currentColor" /><stop offset=".65" stopColor="currentColor" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
            <g stroke="url(#autos-quote-route-fade)" strokeWidth=".9">
              <path d="M-80 420C140 490 250 265 390 330S620 495 810 370S1030 180 1250 225" />
              <path d="M-60 445C150 500 265 285 400 353S650 510 835 393S1060 210 1260 248" />
            </g>
            <g className="autos-quote-routes-silver" stroke="url(#autos-quote-route-fade)" strokeWidth=".7">
              <path d="M-80 350C120 410 195 220 350 285S570 440 760 315S1000 120 1250 175" />
              <path d="M-65 375C135 435 215 245 370 305S600 460 790 335S1020 150 1245 195" />
            </g>
          </svg>
        </div>
        <div className="autos-quote-content mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.58fr_1.42fr] lg:gap-16 lg:px-8">
          <div className="lg:self-start">
            <p className="autos-quote-kicker">Cotización personalizada<span aria-hidden="true" className="autos-quote-kicker-rule" /></p>
            <h2 className="autos-quote-title">Cuéntanos<br />tu recorrido.</h2>
            <p className="mt-5 max-w-md font-semibold leading-7 text-ink">Preparamos tu solicitud de renta de forma personalizada.</p>
            <p className="mt-3 max-w-md leading-7 text-muted-foreground">Cuéntanos tu recorrido y lo que necesitas para que nuestro equipo pueda revisar opciones contigo.</p>
            <div className="autos-quote-note"><span className="autos-quote-note-icon" aria-hidden="true"><Car className="size-5" /></span><p>Disponibilidad, condiciones, requisitos y tarifas se confirman al momento de cotizar.</p></div>
          </div>
          <CarQuoteForm />
        </div>
      </section>

      <section className="autos-process">
        <img src={autosProcessImage} alt="SUV en una carretera costera entre acantilados al atardecer" width={1280} height={1024} loading="lazy" className="autos-process-photo" />
        <div className="autos-process-veil" aria-hidden="true" />
        <svg aria-hidden="true" viewBox="0 0 120 120" className="autos-compass">
          <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".55" />
          <path d="M60 22 68 60 60 98 52 60Z" fill="currentColor" opacity=".9" />
          <path d="M22 60 60 52 98 60 60 68Z" fill="currentColor" opacity=".45" />
          <text x="60" y="12" textAnchor="middle" fontSize="11" fill="currentColor">N</text>
          <text x="60" y="116" textAnchor="middle" fontSize="11" fill="currentColor">S</text>
          <text x="8" y="64" textAnchor="middle" fontSize="11" fill="currentColor">O</text>
          <text x="112" y="64" textAnchor="middle" fontSize="11" fill="currentColor">E</text>
        </svg>
        <div className="autos-process-inner">
          <p className="autos-kicker autos-kicker-center"><span aria-hidden="true" className="autos-kicker-rule" />Seguimos el viaje contigo<span aria-hidden="true" className="autos-kicker-rule" /></p>
          <h2 className="autos-process-title">Así preparamos<br /><em>tu camino.</em></h2>
          <ol className="autos-steps">
            {[
              ["01", "Nos cuentas tu recorrido", "Dónde inicias, hasta dónde llegas y cuándo necesitas el auto."],
              ["02", "Revisamos qué necesitas", "Consideramos pasajeros, equipaje y tipo de recorrido antes de proponerte algo."],
              ["03", "Te ayudamos a elegir", "Conversamos contigo para que tomes la decisión con claridad."],
            ].map(([number, title, copy]) => (
              <li key={number} className="autos-step">
                <span className="autos-step-num">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 48" preserveAspectRatio="none" className="autos-wave autos-wave-process">
          <path className="autos-wave-fill" d="M0 48V9C240 41 460 32 720 18S1130 43 1440 5V48Z" />
          <path className="autos-wave-thread" d="M0 9C240 41 460 32 720 18S1130 43 1440 5" />
        </svg>
      </section>

      <section className="autos-final">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="autos-final-kicker">Sigue moviéndote</p>
          <h2 className="autos-final-title">El camino también<br />es parte del viaje.</h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">Cuéntanos dónde vas y preparamos una opción para moverte a tu ritmo.</p>
          <Button asChild size="lg" className="autos-cta mt-8"><a href="#cotizar-auto">Cotizar mi auto <ArrowRight aria-hidden="true" /></a></Button>
        </div>
      </section>
    </SiteShell>
  );
}

function CarQuoteForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CarForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [previewNotice, setPreviewNotice] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const today = format(startOfToday(), "yyyy-MM-dd");
  const inputClass = "h-12 border-border bg-background px-4 focus-visible:ring-2";
  const labelClass = "mb-2 block text-sm font-bold text-ink";

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof CarForm>(field: K, value: CarForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPreviewNotice(false);
  };

  const validate = (currentStep: number) => {
    const next: FieldErrors = {};
    if (currentStep === 0) {
      if (!form.pickupPlace.trim()) next.pickupPlace = "Indica dónde recoges el auto.";
      if (!form.sameLocation && !form.dropoffPlace.trim()) next.dropoffPlace = "Indica dónde devuelves el auto.";
      if (!form.pickupDate) next.pickupDate = "Selecciona la fecha de recogida.";
      if (!form.pickupTime) next.pickupTime = "Selecciona la hora de recogida.";
      if (!form.dropoffDate) next.dropoffDate = "Selecciona la fecha de devolución.";
      if (!form.dropoffTime) next.dropoffTime = "Selecciona la hora de devolución.";
      if (form.pickupDate && form.dropoffDate && form.dropoffDate < form.pickupDate) next.dropoffDate = "La devolución debe ser posterior a la recogida.";
      if (form.pickupDate && form.dropoffDate && form.dropoffDate === form.pickupDate && form.pickupTime && form.dropoffTime && form.dropoffTime <= form.pickupTime) next.dropoffTime = "La hora de devolución debe ser posterior a la de recogida.";
    }
    if (currentStep === 1) {
      if (form.passengers < 1) next.passengers = "Indica al menos un pasajero.";
      if (!form.driverAge.trim()) next.driverAge = "Escribe la edad del conductor principal.";
      else {
        const age = Number(form.driverAge);
        if (!Number.isInteger(age) || age < 18 || age > 99) next.driverAge = "Escribe una edad válida (entre 18 y 99 años).";
      }
    }
    if (currentStep === 2) {
      if (!form.category) next.category = "Selecciona una categoría de vehículo.";
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
    if (validate(step)) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate(3)) setPreviewNotice(true);
  };

  const toggleNeed = (value: string) => {
    if (value === "asesoria") {
      update("needs", form.needs.includes("asesoria") ? [] : ["asesoria"]);
      return;
    }
    const withoutAdvice = form.needs.filter((item) => item !== "asesoria");
    update("needs", withoutAdvice.includes(value) ? withoutAdvice.filter((item) => item !== value) : [...withoutAdvice, value]);
  };

  return (
    <form onSubmit={submit} noValidate className="min-w-0 border border-border bg-card shadow-sm" aria-label="Cotización de renta de auto">
      <div className="border-b border-border bg-secondary/55 px-5 py-5 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="kicker-text font-extrabold uppercase tracking-[.14em] text-primary">Paso {step + 1} de {steps.length}</p><p className="mt-1 truncate text-sm font-semibold text-ink">{steps[step]}</p></div><span className="text-sm font-bold text-muted-foreground">{Math.round(((step + 1) / steps.length) * 100)}%</span></div>
        <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">{steps.map((item, index) => <span key={item} className={cn("h-1", index <= step ? "bg-primary" : "bg-border")} />)}</div>
      </div>

      <div className="px-5 py-7 sm:px-8 sm:py-9">
        <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold text-ink outline-none sm:text-3xl">{steps[step]}</h3>

        {step === 0 && <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Lugar de recogida" htmlFor="car-pickup-place" error={errors.pickupPlace}><Input id="car-pickup-place" autoComplete="address-level2" value={form.pickupPlace} onChange={(event) => update("pickupPlace", event.target.value)} aria-invalid={Boolean(errors.pickupPlace)} aria-describedby={errors.pickupPlace ? "car-pickup-place-error" : undefined} className={inputClass} placeholder="Ej. Aeropuerto de Cancún" /></Field></div>
          <div className="sm:col-span-2"><label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm font-semibold leading-6 text-ink"><Checkbox checked={form.sameLocation} onCheckedChange={(value) => update("sameLocation", value === true)} aria-label="Devolveré el auto en el mismo lugar" className="size-5" /><span>Devolveré el auto en el mismo lugar</span></label></div>
          {!form.sameLocation && <div className="sm:col-span-2"><Field label="Lugar de devolución" htmlFor="car-dropoff-place" error={errors.dropoffPlace}><Input id="car-dropoff-place" value={form.dropoffPlace} onChange={(event) => update("dropoffPlace", event.target.value)} aria-invalid={Boolean(errors.dropoffPlace)} aria-describedby={errors.dropoffPlace ? "car-dropoff-place-error" : undefined} className={inputClass} placeholder="Ej. Centro de Mérida" /></Field></div>}
          <DateField label="Fecha de recogida" id="car-pickup-date" value={form.pickupDate} min={today} error={errors.pickupDate} onChange={(value) => { update("pickupDate", value); if (form.dropoffDate && form.dropoffDate < value) update("dropoffDate", ""); }} />
          <Field label="Hora de recogida" htmlFor="car-pickup-time" error={errors.pickupTime}><Input id="car-pickup-time" type="time" step={900} value={form.pickupTime} onChange={(event) => update("pickupTime", event.target.value)} aria-invalid={Boolean(errors.pickupTime)} aria-describedby={errors.pickupTime ? "car-pickup-time-error" : undefined} className={inputClass} /></Field>
          <DateField label="Fecha de devolución" id="car-dropoff-date" value={form.dropoffDate} min={form.pickupDate || today} error={errors.dropoffDate} onChange={(value) => update("dropoffDate", value)} />
          <Field label="Hora de devolución" htmlFor="car-dropoff-time" error={errors.dropoffTime}><Input id="car-dropoff-time" type="time" step={900} value={form.dropoffTime} onChange={(event) => update("dropoffTime", event.target.value)} aria-invalid={Boolean(errors.dropoffTime)} aria-describedby={errors.dropoffTime ? "car-dropoff-time-error" : undefined} className={inputClass} /></Field>
        </div>}

        {step === 1 && <div className="mt-7 grid gap-5">
          <div className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
            <div><p className="font-display text-base font-bold text-ink">Pasajeros</p><p className="mt-1 text-xs text-muted-foreground">Incluye al conductor</p></div>
            <div className="grid grid-cols-[2.75rem_2.5rem_2.75rem] items-center">
              <Button type="button" variant="ghost" size="icon" aria-label="Restar pasajeros" disabled={form.passengers <= 1} className="size-11" onClick={() => update("passengers", Math.max(1, form.passengers - 1))}><Minus /></Button>
              <output aria-live="polite" aria-label={`Pasajeros: ${form.passengers}`} className="text-center font-display text-xl font-bold text-ink">{form.passengers}</output>
              <Button type="button" variant="ghost" size="icon" aria-label="Agregar pasajeros" disabled={form.passengers >= 20} className="size-11" onClick={() => update("passengers", Math.min(20, form.passengers + 1))}><Plus /></Button>
            </div>
          </div>
          <Field label="Edad del conductor principal" htmlFor="car-driver-age" error={errors.driverAge}><Input id="car-driver-age" type="number" inputMode="numeric" min={18} max={99} autoComplete="off" value={form.driverAge} onChange={(event) => update("driverAge", event.target.value)} aria-invalid={Boolean(errors.driverAge)} aria-describedby={errors.driverAge ? "car-driver-age-error" : undefined} className={inputClass} placeholder="Ej. 35" /></Field>
          <p className="text-sm leading-6 text-muted-foreground">La edad puede influir en las condiciones de renta y se confirmará al cotizar.</p>
        </div>}

        {step === 2 && <div className="mt-7 grid gap-5">
          <Field label="Categoría del vehículo" htmlFor="car-category" error={errors.category}><SelectControl id="car-category" value={form.category} onChange={(value) => update("category", value)} invalid={Boolean(errors.category)} placeholder="Selecciona una categoría" options={[["economico", "Económico"], ["compacto", "Compacto"], ["mediano", "Mediano"], ["suv", "SUV"], ["van", "Van / familiar"], ["asesoria", "Necesito asesoría"]]} /></Field>
          <fieldset><legend className={labelClass}>¿Hay algo que debamos considerar? <span className="font-normal text-muted-foreground">(opcional)</span></legend><details className="group rounded-md border border-border bg-background"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 text-sm font-semibold text-ink outline-none transition-colors hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"><span className="min-w-0 truncate">{needsSummary(form.needs)}</span><ChevronDown aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-open:rotate-180" /></summary><div className="grid gap-2 border-t border-border p-3 sm:grid-cols-2">{needOptions.map(([value, label]) => { const selected = form.needs.includes(value); return <label key={value} className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-ring", selected ? "border-primary bg-secondary text-ink" : "border-transparent text-muted-foreground hover:bg-secondary/40")}><Checkbox checked={selected} onCheckedChange={() => toggleNeed(value)} aria-label={label} className="size-5" /><span>{label}</span></label>; })}</div></details></fieldset>
          <p className="text-sm leading-6 text-muted-foreground">Estos detalles orientan la cotización; no representan disponibilidad ni una tarifa confirmada.</p>
        </div>}

        {step === 3 && <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="car-name" error={errors.name}><Input id="car-name" autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "car-name-error" : undefined} className={inputClass} /></Field>
          <Field label="WhatsApp" htmlFor="car-whatsapp" error={errors.whatsapp}><Input id="car-whatsapp" type="tel" inputMode="tel" autoComplete="tel" value={form.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? "car-whatsapp-error" : undefined} className={inputClass} placeholder="Ej. 55 1234 5678" /></Field>
          <div className="sm:col-span-2"><Field label="Correo electrónico" htmlFor="car-email" error={errors.email}><Input id="car-email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "car-email-error" : undefined} className={inputClass} placeholder="nombre@correo.com" /></Field></div>
          <div className="sm:col-span-2"><label className="flex min-h-12 cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground"><Checkbox checked={form.consent} onCheckedChange={(value) => update("consent", value === true)} aria-label="Aceptar aviso de privacidad" className="mt-1 size-5" /><span>Acepto el <Link to="/privacidad" className="font-semibold text-primary underline underline-offset-4">aviso de privacidad</Link> y que Cielito Tours me contacte para atender esta solicitud.</span></label>{errors.consent && <p role="alert" className="mt-2 text-sm font-semibold text-destructive">{errors.consent}</p>}</div>
          <div role="note" className="border-l-2 border-accent bg-secondary p-4 text-sm leading-6 text-ink sm:col-span-2"><strong>Vista previa:</strong> en esta etapa el formulario todavía no envía ni guarda información.</div>
          {previewNotice && <p role="status" className="text-sm font-semibold leading-6 text-primary sm:col-span-2">La integración sigue pendiente. Ninguna información fue enviada ni guardada.</p>}
        </div>}
      </div>

      <div className="grid gap-3 border-t border-border px-5 py-5 sm:flex sm:items-center sm:justify-between sm:px-8">
        {step > 0 ? <Button type="button" variant="ghost" className="min-h-11 justify-self-start" onClick={() => { setErrors({}); setPreviewNotice(false); setStep((current) => current - 1); }}><ArrowLeft /> Atrás</Button> : <span />}
        {step < steps.length - 1 ? <Button type="button" className="min-h-11 w-full sm:w-auto" onClick={continueForm}>Continuar <ArrowRight /></Button> : <Button type="submit" className="min-h-11 w-full sm:w-auto">Solicitar cotización <ArrowRight /></Button>}
      </div>
    </form>
  );
}

function SelectControl({ id, value, onChange, invalid, placeholder, options }: { id: string; value: string; onChange: (value: string) => void; invalid: boolean; placeholder: string; options: readonly (readonly [string, string])[] }) {
  return <div className="relative"><select id={id} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} className="h-12 w-full appearance-none rounded-md border border-border bg-background px-4 pr-11 text-sm font-semibold text-ink outline-none transition-colors hover:bg-secondary/40 focus:border-primary focus:ring-2 focus:ring-ring"><option value="" disabled>{placeholder}</option>{options.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-primary" /></div>;
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
