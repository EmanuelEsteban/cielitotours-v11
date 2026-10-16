import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { ContactForm } from "./contact-form";
import { CONTACT_RECIPIENT, RESERVATIONS_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact-request";

function ContactLines() {
  return <svg aria-hidden="true" className="ct-lines" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
    <path d="M-40 640 C 260 520 520 760 860 610 S 1380 420 1660 520" />
    <path d="M-40 690 C 280 580 540 800 880 660 S 1400 480 1660 570" />
    <path d="M-40 250 C 300 160 640 330 980 210 S 1450 120 1660 190" />
    <circle cx="1280" cy="260" r="180" />
    <circle cx="1280" cy="260" r="240" />
    <circle cx="1280" cy="260" r="310" strokeDasharray="2 10" />
    <path d="M1100 260 H1460 M1280 80 V440" />
  </svg>;
}

export function ContactPage() {
  return <SiteShell>
    <div className="ct-page">
      <ContactLines />
      <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 md:pt-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="ct-kicker"><span aria-hidden="true" className="ct-kline" />Atención al cliente<span aria-hidden="true" className="ct-kline" /></p>
          <h1 className="ct-title">Siempre hay alguien al otro lado de tu viaje.</h1>
          <p className="ct-lead">Una pregunta, una solicitud o algo que necesites resolver. Estamos aquí para escucharte y ayudarte a encontrar el siguiente paso.</p>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-20 lg:grid-cols-[1.55fr_1fr] lg:gap-12 lg:px-8 md:pb-28">
        <div className="ct-card"><ContactForm /></div>
        <aside className="flex flex-col gap-5">
          <div className="ct-info">
            <h2 className="ct-info-h">Habla con nosotros</h2>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ct-wa"><MessageCircle className="size-5" aria-hidden="true" />Hablar por WhatsApp</a>
            <dl className="mt-6 space-y-5 text-sm">
              <div><dt className="ct-dt">WhatsApp oficial</dt><dd><a className="ct-link" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a></dd></div>
              <div><dt className="ct-dt">Atención al cliente</dt><dd><a className="ct-link" href={`mailto:${CONTACT_RECIPIENT}`}><Mail className="mr-2 inline size-4" aria-hidden="true" />{CONTACT_RECIPIENT}</a></dd></div>
              <div><dt className="ct-dt">Reservas y cotizaciones</dt><dd><a className="ct-link" href={`mailto:${RESERVATIONS_EMAIL}`}><Mail className="mr-2 inline size-4" aria-hidden="true" />{RESERVATIONS_EMAIL}</a></dd></div>
            </dl>
          </div>
          <div className="ct-info ct-quote">
            <h2 className="ct-info-h">¿Quieres cotizar un viaje?</h2>
            <p className="mt-2 text-sm leading-6 opacity-80">Para propuestas y reservas usa nuestro formulario de cotización.</p>
            <Link to="/cotizar" className="ct-link mt-4 inline-flex items-center gap-2 font-semibold">Ir a cotizar <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
        </aside>
      </section>
    </div>
  </SiteShell>;
}
