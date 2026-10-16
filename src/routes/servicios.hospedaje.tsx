import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowDown, ArrowLeft, ArrowRight, BedDouble, CalendarDays, ChevronDown, Hotel, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import stayHeroImage from "@/assets/hospedaje-hero-resort.jpg";
import stayProcessImage from "@/assets/hospedaje-process-terrace.jpg";
import stayQuoteImage from "@/assets/hospedaje-quote-resort.jpg";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const steps = ["Destino y fechas", "Quiénes se hospedan", "Cómo quieres hospedarte", "Tus datos"] as const;

type StayForm = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  stayType: string;
  budget: string;
  preferences: string[];
  name: string;
  whatsapp: string;
  email: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof StayForm, string>>;

const initialForm: StayForm = {
  destination: "",
  checkIn: "",
  checkOut: "",
  adults: 1,
  children: 0,
  rooms: 1,
  stayType: "",
  budget: "",
  preferences: [],
  name: "",
  whatsapp: "",
  email: "",
  consent: false,
};

const preferenceOptions = [
  ["playa", "Cerca de playa"],
  ["centrica", "Ubicación céntrica"],
  ["familiar", "Familiar"],
  ["alberca", "Alberca"],
  ["desayuno", "Desayuno"],
  ["todo-incluido", "Todo incluido"],
  ["accesibilidad", "Accesibilidad"],
  ["romantico", "Viaje romántico"],
  ["negocios", "Negocios"],
  ["asesoria", "Otra / necesito asesoría"],
] as const;

const preferenceLabels = Object.fromEntries(preferenceOptions) as Record<string, string>;

function preferenceSummary(values: string[]) {
  if (values.length === 0) return "Selecciona tus preferencias";
  const first = values[0];
  if (values.length === 1 && first) return preferenceLabels[first] ?? "1 preferencia seleccionada";
  return `${values.length} preferencias seleccionadas`;
}

export const Route = createFileRoute("/servicios/hospedaje")({
  head: () => ({
    meta: [
      { title: "Cotiza tu hospedaje | Cielito Tours" },
      { name: "description", content: "Cuéntanos tu destino, fechas y la estancia que imaginas. Preparamos contigo una cotización personalizada de hospedaje." },
      { property: "og:title", content: "Cotiza tu hospedaje | Cielito Tours" },
      { property: "og:description", content: "Encuentra una estancia que encaje con tu viaje, con acompañamiento personalizado de Cielito Tours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StayPage,
});

function StayPage() {
  return (
    <SiteShell>
      <section className="hosp-hero relative min-h-[560px] overflow-hidden bg-ink text-primary-foreground sm:min-h-[540px] lg:min-h-[600px]">
        <img src={stayHeroImage} alt="Terraza de resort con piscina infinita frente al mar al atardecer" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 size-full object-cover object-[62%_center] lg:object-center" />
        <div className="hosp-hero-shade absolute inset-0" />
        <div aria-hidden="true" className="hosp-hero-aura">
          <span className="hosp-hero-aura-glow" />
          <svg className="hosp-hero-aura-lines" viewBox="0 0 460 340" fill="none" preserveAspectRatio="none">
            <defs><linearGradient id="hospAuraFade" x1="0" x2="1"><stop offset="0" stopColor="#D4AD62" stopOpacity="0" /><stop offset=".5" stopColor="#E7C98B" stopOpacity="1" /><stop offset="1" stopColor="#D4AD62" stopOpacity="0" /></linearGradient></defs>
            <path d="M10 300 C 120 250, 180 320, 300 250 S 430 200, 455 150" stroke="url(#hospAuraFade)" strokeWidth=".9" opacity=".22" />
            <path d="M20 40 C 110 70, 150 10, 250 30 S 400 80, 450 40" stroke="url(#hospAuraFade)" strokeWidth=".8" opacity=".18" />
            <path d="M0 220 C 90 180, 140 260, 230 290 S 390 300, 450 260" stroke="url(#hospAuraFade)" strokeWidth=".7" opacity=".15" />
            <path d="M60 330 C 160 300, 260 330, 350 300 S 430 260, 460 280" stroke="url(#hospAuraFade)" strokeWidth=".8" opacity=".2" />
          </svg>
        </div>
        <p aria-hidden="true" className="hosp-hand hosp-hero-hand">Tu descanso<br />también<br />es parte<br />del viaje.</p>
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-end px-5 pb-12 pt-24 sm:min-h-[540px] sm:items-center sm:px-10 sm:py-16 lg:min-h-[600px] lg:px-8">
          <div className="max-w-[38rem]">
            <p className="hosp-hero-label">Hospedaje</p>
            <h1 className="hosp-hero-title">Un buen viaje<br />también se siente<br />en donde<br /><span>te quedas.</span></h1>
            <p className="hosp-hero-copy">Encuentra el alojamiento ideal para tu estilo de viaje. Hoteles, resorts, villas y experiencias únicas en México y el mundo.</p>
            <Button asChild size="lg" className="hosp-hero-cta mt-7 min-h-12 w-full sm:w-auto"><a href="#cotizar-hospedaje">Cotizar hospedaje <ArrowRight aria-hidden="true" strokeWidth={1.5} /></a></Button>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 90" preserveAspectRatio="none" className="hosp-wave"><path className="hosp-wave-fill" d="M0 64C300 96 520 30 820 46S1240 70 1440 18V90H0Z" /><path className="hosp-wave-line" d="M0 64C300 96 520 30 820 46S1240 70 1440 18" /></svg>
      </section>

      <section id="cotizar-hospedaje" className="hosp-quote mobile-section relative overflow-hidden py-16 sm:py-24">
        <img src={stayQuoteImage} alt="" aria-hidden="true" width={1024} height={1280} loading="lazy" className="hosp-quote-photo" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.66fr_1.34fr] lg:gap-14 lg:px-8">
          <div className="lg:self-center lg:pl-10 xl:pl-14">
            <p className="hosp-quote-kicker">Cotización personalizada</p>
            <h2 className="hosp-serif mt-4 text-[2.6rem] leading-[1.05] text-ink sm:text-[3.4rem]">Imagina tu <em>estancia.</em></h2>
            <p className="mt-5 max-w-md font-semibold leading-7 text-ink">Preparamos tu solicitud de hospedaje de forma personalizada.</p>
            <p className="mt-3 max-w-md leading-7 text-muted-foreground">Cuéntanos qué necesitas para que nuestro equipo pueda revisar opciones adecuadas para tu viaje.</p>
            <div className="mt-8 flex max-w-md items-center gap-4 text-sm leading-6 text-muted-foreground"><span className="hosp-icon-chip"><Hotel aria-hidden="true" strokeWidth={1.5} /></span>Disponibilidad, condiciones y tarifas se confirman al momento de cotizar.</div>
          </div>
          <StayQuoteForm />
        </div>
      </section>

      <section className="hosp-process relative overflow-hidden text-primary-foreground">
        <div className="grid lg:grid-cols-[.85fr_1.15fr]">
          <div className="hosp-process-media relative min-h-[360px] overflow-hidden sm:min-h-[460px] lg:min-h-[560px]">
            <img src={stayProcessImage} alt="Camastro con sombrero y toallas frente al mar y formaciones de roca" width={1280} height={1024} loading="lazy" className="absolute inset-0 size-full object-cover object-center" />
            <p aria-hidden="true" className="hosp-hand hosp-hand-left">Estancias<br />que se viven.</p>
          </div>
          <div className="relative px-5 pb-20 pt-12 sm:px-10 sm:py-20 lg:grid lg:grid-cols-[.9fr_1.1fr] lg:gap-10 lg:px-10 lg:py-20">
            <svg aria-hidden="true" viewBox="0 0 100 100" className="hosp-compass"><circle cx="50" cy="50" r="46" /><circle cx="50" cy="50" r="38" /><path d="M50 4 54 46 96 50 54 54 50 96 46 54 4 50 46 46Z" /><path d="M50 50 70 30M50 50 30 70M50 50 70 70M50 50 30 30" /></svg>
            <div>
              <p className="hosp-process-kicker">Una estancia pensada contigo</p>
              <h2 className="hosp-serif mt-4 text-[2.4rem] leading-[1.08] sm:text-5xl">Así encontramos <em>lo que encaja.</em></h2>
            </div>
            <ol className="hosp-steps mt-10 lg:mt-0">
              {[
                ["01", "Nos cuentas tu estancia", "Comparte el destino, las fechas y aquello que haría sentir bien tu viaje."],
                ["02", "Revisamos qué encaja contigo", "Nuestro equipo considera tus prioridades para preparar opciones adecuadas."],
                ["03", "Te ayudamos a elegir", "Conversamos contigo para que tomes una decisión clara y acompañada."],
              ].map(([number, title, copy]) => <li key={number} className="hosp-step"><span className="hosp-step-num">{number}</span><div><h3 className="text-base font-bold">{title}</h3><p className="mt-1.5 text-sm leading-6 text-primary-foreground/70">{copy}</p></div></li>)}
            </ol>
            <p aria-hidden="true" className="hosp-hand hosp-hand-right">Más que hoteles,<br />grandes experiencias.</p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="hosp-process-wave"><path d="M0 48C380 8 700 60 1040 30S1340 20 1440 4" /></svg>
      </section>

      <section className="relative overflow-hidden bg-secondary py-16 sm:py-24">
        <svg aria-hidden="true" viewBox="0 0 1000 260" className="pointer-events-none absolute inset-0 hidden size-full text-primary opacity-15 sm:block"><path d="M-20 210 C180 40 350 265 540 105 S790 30 1030 155" fill="none" stroke="currentColor" strokeWidth="2" className="route-line" /></svg>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="section-kicker">Tu descanso también importa</p>
          <h2 className="mt-5 font-display text-4xl font-bold uppercase leading-tight text-ink sm:text-6xl">Tu viaje también necesita un lugar para descansar.</h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">Cuéntanos cómo imaginas tu estancia y empecemos a preparar opciones contigo.</p>
          <Button asChild size="lg" className="mt-8 min-h-12 w-full sm:w-auto"><a href="#cotizar-hospedaje">Cotizar hospedaje <ArrowRight /></a></Button>
        </div>
      </section>
    </SiteShell>
  );
}

function StayQuoteForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<StayForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [previewNotice, setPreviewNotice] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const today = format(startOfToday(), "yyyy-MM-dd");
  const inputClass = "h-12 border-border bg-background px-4 focus-visible:ring-2";
  const labelClass = "mb-2 block text-sm font-bold text-ink";

  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof StayForm>(field: K, value: StayForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPreviewNotice(false);
  };

  const validate = (currentStep: number) => {
    const next: FieldErrors = {};
    if (currentStep === 0) {
      if (!form.destination.trim()) next.destination = "Indica dónde quieres hospedarte.";
      if (!form.checkIn) next.checkIn = "Selecciona la fecha de llegada.";
      if (!form.checkOut) next.checkOut = "Selecciona la fecha de salida.";
      if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn) next.checkOut = "La salida debe ser posterior a la llegada.";
    }
    if (currentStep === 1) {
      if (form.adults < 1) next.adults = "Debe hospedarse al menos una persona adulta.";
      if (form.rooms < 1) next.rooms = "Selecciona al menos una habitación.";
    }
    if (currentStep === 2) {
      if (!form.stayType) next.stayType = "Selecciona un tipo de estancia.";
      if (!form.budget) next.budget = "Selecciona una referencia de presupuesto.";
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

  const togglePreference = (value: string) => {
    update("preferences", form.preferences.includes(value) ? form.preferences.filter((item) => item !== value) : [...form.preferences, value]);
  };

  return (
    <form onSubmit={submit} noValidate className="min-w-0 border border-border bg-card shadow-sm" aria-label="Cotización de hospedaje">
      <div className="border-b border-border bg-secondary/55 px-5 py-5 sm:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="kicker-text font-extrabold uppercase tracking-[.14em] text-primary">Paso {step + 1} de {steps.length}</p><p className="mt-1 truncate text-sm font-semibold text-ink">{steps[step]}</p></div><span className="text-sm font-bold text-muted-foreground">{Math.round(((step + 1) / steps.length) * 100)}%</span></div>
        <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">{steps.map((item, index) => <span key={item} className={cn("h-1", index <= step ? "bg-primary" : "bg-border")} />)}</div>
      </div>

      <div className="px-5 py-7 sm:px-8 sm:py-9">
        <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold text-ink outline-none sm:text-3xl">{steps[step]}</h3>

        {step === 0 && <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Destino" htmlFor="stay-destination" error={errors.destination}><Input id="stay-destination" autoComplete="address-level2" value={form.destination} onChange={(event) => update("destination", event.target.value)} aria-invalid={Boolean(errors.destination)} aria-describedby={errors.destination ? "stay-destination-error" : undefined} className={inputClass} placeholder="Ej. Puerto Vallarta" /></Field></div>
          <DateField label="Check-in" id="stay-check-in" value={form.checkIn} min={today} error={errors.checkIn} onChange={(value) => { update("checkIn", value); if (form.checkOut && form.checkOut <= value) update("checkOut", ""); }} />
          <DateField label="Check-out" id="stay-check-out" value={form.checkOut} min={form.checkIn ? format(parseISO(form.checkIn).setDate(parseISO(form.checkIn).getDate() + 1), "yyyy-MM-dd") : today} error={errors.checkOut} onChange={(value) => update("checkOut", value)} />
          <p className="text-sm leading-6 text-muted-foreground sm:col-span-2">Estas fechas nos ayudan a preparar tu solicitud personalizada.</p>
        </div>}

        {step === 1 && <div className="mt-7"><div className="grid gap-3">{([
          ["adults", "Adultos", "12 años o más", 1],
          ["children", "Niños", "0 a 11 años", 0],
          ["rooms", "Habitaciones", "Cantidad aproximada", 1],
        ] as const).map(([field, title, description, minimum]) => {
          const count = form[field];
          return <div key={field} className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-border bg-background px-4 py-3"><div><p className="font-display text-base font-bold text-ink">{title}</p><p className="mt-1 text-xs text-muted-foreground">{description}</p></div><div className="grid grid-cols-[2.75rem_2.5rem_2.75rem] items-center"><Button type="button" variant="ghost" size="icon" aria-label={`Restar ${title.toLowerCase()}`} disabled={count <= minimum} className="size-11" onClick={() => update(field, Math.max(minimum, count - 1))}><Minus /></Button><output aria-live="polite" aria-label={`${title}: ${count}`} className="text-center font-display text-xl font-bold text-ink">{count}</output><Button type="button" variant="ghost" size="icon" aria-label={`Agregar ${title.toLowerCase()}`} disabled={count >= 20} className="size-11" onClick={() => update(field, Math.min(20, count + 1))}><Plus /></Button></div></div>;
        })}</div>{(errors.adults || errors.rooms) && <p role="alert" className="mt-2 text-sm font-semibold text-destructive">{errors.adults ?? errors.rooms}</p>}</div>}

        {step === 2 && <div className="mt-7 grid gap-5">
          <Field label="Tipo de estancia" htmlFor="stay-type" error={errors.stayType}><SelectControl id="stay-type" value={form.stayType} onChange={(value) => update("stayType", value)} invalid={Boolean(errors.stayType)} placeholder="Selecciona una opción" options={[["hotel", "Hotel"], ["resort", "Resort"], ["todo-incluido", "Todo incluido"], ["departamento", "Departamento / estancia vacacional"], ["boutique", "Boutique"], ["asesoria", "Necesito asesoría"]]} /></Field>
          <Field label="¿Tienes un presupuesto aproximado?" htmlFor="stay-budget" error={errors.budget}><SelectControl id="stay-budget" value={form.budget} onChange={(value) => update("budget", value)} invalid={Boolean(errors.budget)} placeholder="Selecciona una referencia" options={[["asesoria", "Prefiero que me asesoren"], ["practico", "Económico / práctico"], ["intermedio", "Intermedio"], ["superior", "Superior"], ["premium", "Premium"]]} /></Field>
          <fieldset><legend className={labelClass}>Preferencias <span className="font-normal text-muted-foreground">(opcional)</span></legend><details className="group rounded-md border border-border bg-background"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-md px-4 text-sm font-semibold text-ink outline-none transition-colors hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden"><span className="min-w-0 truncate">{preferenceSummary(form.preferences)}</span><ChevronDown aria-hidden="true" className="size-4 shrink-0 text-primary transition-transform group-open:rotate-180" /></summary><div className="grid gap-2 border-t border-border p-3 sm:grid-cols-2">{preferenceOptions.map(([value, label]) => { const selected = form.preferences.includes(value); return <label key={value} className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-ring", selected ? "border-primary bg-secondary text-ink" : "border-transparent text-muted-foreground hover:bg-secondary/40")}><Checkbox checked={selected} onCheckedChange={() => togglePreference(value)} aria-label={label} className="size-5" /><span>{label}</span></label>; })}</div></details></fieldset>
          <p className="text-sm leading-6 text-muted-foreground">Estas preferencias orientan la cotización; no representan disponibilidad ni una tarifa confirmada.</p>
        </div>}

        {step === 3 && <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="stay-name" error={errors.name}><Input id="stay-name" autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "stay-name-error" : undefined} className={inputClass} /></Field>
          <Field label="WhatsApp" htmlFor="stay-whatsapp" error={errors.whatsapp}><Input id="stay-whatsapp" type="tel" inputMode="tel" autoComplete="tel" value={form.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} aria-invalid={Boolean(errors.whatsapp)} aria-describedby={errors.whatsapp ? "stay-whatsapp-error" : undefined} className={inputClass} placeholder="Ej. 55 1234 5678" /></Field>
          <div className="sm:col-span-2"><Field label="Correo electrónico" htmlFor="stay-email" error={errors.email}><Input id="stay-email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "stay-email-error" : undefined} className={inputClass} placeholder="nombre@correo.com" /></Field></div>
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