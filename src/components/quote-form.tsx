import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function QuoteForm() {
  const [service, setService] = useState("");
  const [contact, setContact] = useState("whatsapp");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [folio, setFolio] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const form = new FormData(event.currentTarget);
    if (!service || !consent) { setError("Selecciona un servicio y acepta el aviso de privacidad."); return; }
    setSending(true);
    const requestFolio = `CT-${crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
    const { error: submitError } = await supabase.from("quote_requests").insert({
      folio: requestFolio,
      service,
      destination: String(form.get("destination") || "") || null,
      departure_place: String(form.get("departure") || "") || null,
      start_date: String(form.get("startDate") || "") || null,
      end_date: String(form.get("endDate") || "") || null,
      travelers: Number(form.get("travelers")) || null,
      budget: String(form.get("budget") || "") || null,
      details: String(form.get("details") || "") || null,
      full_name: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      preferred_contact: contact,
      privacy_consent: consent,
      source_page: "/cotizar",
      device_type: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop",
    });
    setSending(false);
    if (submitError) { setError("No pudimos enviar tu solicitud. Intenta nuevamente en un momento."); return; }
    setFolio(requestFolio);
  }

  if (folio) return <div className="border border-border bg-secondary p-8 text-center"><CheckCircle2 className="mx-auto size-12 text-primary" /><h2 className="mt-5 font-display text-3xl font-bold text-ink">¡Tu viaje ya está en camino!</h2><p className="mt-3 text-muted-foreground">Recibimos tu solicitud. Conserva este folio:</p><p className="mt-4 text-2xl font-bold text-primary">{folio}</p><p className="mt-4 text-sm text-muted-foreground">Un asesor de Cielito Tours revisará los detalles y se pondrá en contacto contigo.</p></div>;

  const label = "mb-2 block text-sm font-bold text-ink";
  return <form onSubmit={submit} className="grid gap-6" aria-label="Solicitud de cotización">
    <div><label className={label}>¿Qué necesitas? *</label><Select value={service} onValueChange={setService}><SelectTrigger className="h-12"><SelectValue placeholder="Selecciona un servicio" /></SelectTrigger><SelectContent>{["Viaje completo","Vuelos","Hospedaje","Renta de auto","Crucero","Disney","Tour","Grupo empresarial","Grupo deportivo"].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
    <div className="grid gap-6 md:grid-cols-2"><div><label htmlFor="destination" className={label}>Destino o idea</label><Input id="destination" name="destination" className="h-12" placeholder="Ej. playa, Europa, Orlando" /></div><div><label htmlFor="departure" className={label}>Ciudad de salida</label><Input id="departure" name="departure" className="h-12" placeholder="Ej. Ciudad de México" /></div></div>
    <div className="grid gap-6 sm:grid-cols-3"><div><label htmlFor="startDate" className={label}>Fecha de salida</label><Input id="startDate" name="startDate" type="date" className="h-12" /></div><div><label htmlFor="endDate" className={label}>Fecha de regreso</label><Input id="endDate" name="endDate" type="date" className="h-12" /></div><div><label htmlFor="travelers" className={label}>Viajeros</label><Input id="travelers" name="travelers" type="number" min="1" className="h-12" placeholder="2" /></div></div>
    <div><label htmlFor="budget" className={label}>Presupuesto aproximado</label><Input id="budget" name="budget" className="h-12" placeholder="Opcional" /></div>
    <div><label htmlFor="details" className={label}>¿Qué haría especial este viaje?</label><Textarea id="details" name="details" className="min-h-28" placeholder="Cuéntanos prioridades, edades, celebraciones o cualquier detalle importante." /></div>
    <div className="border-t border-border pt-6"><h2 className="font-display text-2xl font-bold text-ink">¿Cómo te contactamos?</h2></div>
    <div className="grid gap-6 md:grid-cols-2"><div><label htmlFor="fullName" className={label}>Nombre completo *</label><Input id="fullName" name="fullName" required className="h-12" autoComplete="name" /></div><div><label htmlFor="email" className={label}>Correo *</label><Input id="email" name="email" required type="email" className="h-12" autoComplete="email" /></div><div><label htmlFor="phone" className={label}>Teléfono *</label><Input id="phone" name="phone" required type="tel" className="h-12" autoComplete="tel" /></div><div><label className={label}>Medio preferido</label><Select value={contact} onValueChange={setContact}><SelectTrigger className="h-12"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="whatsapp">WhatsApp</SelectItem><SelectItem value="telefono">Teléfono</SelectItem><SelectItem value="email">Correo</SelectItem></SelectContent></Select></div></div>
    <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><Checkbox checked={consent} onCheckedChange={value => setConsent(value === true)} aria-label="Aceptar aviso de privacidad" className="mt-1" /><span>Acepto el aviso de privacidad y que Cielito Tours me contacte para atender esta solicitud.</span></label>
    {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}
    <Button type="submit" size="lg" disabled={sending}>{sending ? <><Loader2 className="animate-spin" /> Enviando…</> : "Enviar solicitud"}</Button>
    <p className="text-xs leading-5 text-muted-foreground">Enviar este formulario no confirma una reserva, tarifa ni disponibilidad. Un asesor validará las opciones contigo.</p>
  </form>;
}