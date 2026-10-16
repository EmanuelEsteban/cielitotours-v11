import { useId, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_BACKEND_READY, CONTACT_CATEGORIES, validateContact, type ContactCategory, type ContactErrors, type ContactStatus } from "@/lib/contact-request";

export function ContactForm() {
  const uid = useId();
  const [category, setCategory] = useState<ContactCategory>("general");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "");
    const values = { category, fullName: s("fullName"), email: s("email"), subject: s("subject"), message: s("message"), bookingNumber: s("bookingNumber") || undefined, detail: s("detail") || undefined, privacyConsent: consent };
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) { setStatus("invalid"); return; }
    if (!CONTACT_BACKEND_READY) { setStatus("idle"); return; }
    // Future: setStatus("sending"); await sendContact({ data: values }); setStatus ok ? "sent" : "error".
  }

  const field = (name: keyof ContactErrors, label: string, input: React.ReactNode) => <div>
    <label htmlFor={`${uid}-${name}`} className="ct-label">{label}</label>
    {input}
    {errors[name] && <p id={`${uid}-${name}-err`} role="alert" className="ct-err">{errors[name]}</p>}
  </div>;
  const a11y = (name: keyof ContactErrors) => ({ id: `${uid}-${name}`, name, "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${uid}-${name}-err` : undefined, className: cn("ct-input", errors[name] && "is-err") });

  return <form onSubmit={submit} noValidate aria-label="Formulario de contacto" className="grid gap-6">
    <h2 className="ct-form-h">¿En qué podemos ayudarte?</h2>
    <fieldset>
      <legend className="ct-label">Categoría</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {CONTACT_CATEGORIES.map((c) => <label key={c.id} className={cn("ct-cat", category === c.id && "is-on")}>
          <input type="radio" name="category" value={c.id} checked={category === c.id} onChange={() => setCategory(c.id)} className="sr-only" />
          <span className="ct-cat-l">{c.label}</span><span className="ct-cat-h">{c.hint}</span>
        </label>)}
      </div>
    </fieldset>

    <div className="grid gap-6 md:grid-cols-2">
      {field("fullName", "Nombre completo *", <input {...a11y("fullName")} autoComplete="name" maxLength={120} />)}
      {field("email", "Correo electrónico *", <input {...a11y("email")} type="email" autoComplete="email" maxLength={255} />)}
    </div>

    <div key={category} className="ct-swap grid gap-6">
      {(category === "seguimiento" || category === "queja") && <div>
        <label htmlFor={`${uid}-booking`} className="ct-label">Número de reserva {category === "queja" ? "(si aplica)" : "(opcional)"}</label>
        <input id={`${uid}-booking`} name="bookingNumber" className="ct-input" maxLength={40} />
      </div>}
      {field("subject", "Asunto *", <input {...a11y("subject")} maxLength={150} />)}
      {field("message", "Mensaje *", <textarea {...a11y("message")} rows={5} maxLength={2000} />)}
      {category === "queja" && <>
        {field("detail", "Descripción detallada *", <textarea {...a11y("detail")} rows={5} maxLength={4000} placeholder="Fechas, servicios involucrados y qué ocurrió." />)}
        <div className="ct-attach" aria-disabled="true"><Paperclip className="size-4" aria-hidden="true" /><span>Adjuntar archivos estará disponible próximamente.</span></div>
      </>}
    </div>

    <div>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="ct-check" aria-invalid={!!errors.privacyConsent} />
        <span>Acepto el <Link to="/privacidad" className="ct-link-dark">aviso de privacidad</Link> y que Cielito Tours me contacte para atender esta solicitud.</span>
      </label>
      {errors.privacyConsent && <p role="alert" className="ct-err">{errors.privacyConsent}</p>}
    </div>

    {status === "invalid" && <p role="alert" className="ct-err">Revisa los campos marcados.</p>}
    {status === "error" && <p role="alert" className="ct-err">No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.</p>}

    <div>
      <button type="submit" className="ct-submit" disabled={!CONTACT_BACKEND_READY || status === "sending"} aria-describedby={`${uid}-unavail`}>
        {status === "sending" ? <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Enviando…</> : "Enviar mensaje"}
      </button>
      {!CONTACT_BACKEND_READY && <p id={`${uid}-unavail`} className="mt-3 text-sm opacity-75">El envío en línea aún no está disponible. Mientras tanto, escríbenos por WhatsApp o por correo.</p>}
    </div>
  </form>;
}
