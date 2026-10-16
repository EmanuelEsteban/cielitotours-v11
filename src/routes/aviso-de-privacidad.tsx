import { createFileRoute, Link } from "@tanstack/react-router";
import type { ComponentType, ReactNode } from "react";
import { ArrowLeft, ArrowLeftRight, Building2, Check, FileText, Landmark, Laptop, Settings, Shield, User, Users, FilePen, Flower2 } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import hero from "@/assets/privacidad-hero.jpg";

export const Route = createFileRoute("/aviso-de-privacidad")({
  head: () => ({ meta: [
    { title: "Aviso de privacidad integral | Cielito Tours" },
    { name: "description", content: "Conoce cómo Cielito Tours protege y trata tus datos personales al solicitar una cotización o reservar un viaje." },
    { property: "og:title", content: "Aviso de privacidad integral | Cielito Tours" },
    { property: "og:description", content: "Cuidamos la información que compartes al solicitar una cotización." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AvisoPrivacidad,
});

type Icon = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

function Sec({ n, title, icon: I, children }: { n: number; title: string; icon: Icon; children: ReactNode }) {
  return <section className="avp-sec" aria-labelledby={`avp-s${n}`}>
    <span className="avp-ico"><I className="size-5" aria-hidden /></span>
    <div className="min-w-0">
      <h3 id={`avp-s${n}`} className="avp-h3"><span className="avp-num">{n}.</span> {title}</h3>
      <div className="avp-txt">{children}</div>
    </div>
  </section>;
}

const List = ({ items }: { items: string[] }) => <ul className="avp-list">{items.map((t) => <li key={t}>{t}</li>)}</ul>;

const transfers = [
  ["Líneas aéreas, hoteles y proveedores turísticos", "Reservaciones, emisión de boletos y prestación de servicios de viaje."],
  ["Aseguradoras de viaje", "Contratación y gestión de seguros."],
  ["Autoridades competentes", "Cumplimiento de obligaciones legales y regulatorias."],
  ["Procesadores de pagos", "Gestión de cobros y pagos seguros."],
];

function AvisoPrivacidad() {
  return <SiteShell>
    <div className="avp">
      <header className="avp-hero">
        <img src={hero} alt="" width={1920} height={640} className="avp-hero-img" />
        <div className="avp-hero-in">
          <p className="avp-kicker">Cielito Tours</p>
          <h1 className="avp-h1">Aviso de privacidad</h1>
          <p className="avp-sub">Cuidamos la información que compartes al solicitar una cotización.</p>
          <span className="avp-rule" aria-hidden="true" />
          <p className="avp-tag">Viajar también es confiar</p>
        </div>
        <p className="avp-hand" aria-hidden="true">Mundos extraordinarios,<br />personas reales.</p>
      </header>

      <article className="avp-doc" aria-labelledby="avp-title">
        <div className="avp-top">
          <div>
            <p className="avp-kicker">Cielito Tours</p>
            <h2 id="avp-title" className="avp-h2">Nuestro compromiso es tu tranquilidad</h2>
            <p className="avp-intro">En Cielito Tours tratamos tus datos personales con responsabilidad, transparencia y respeto, para que puedas concentrarte en lo más importante: vivir grandes viajes.</p>
          </div>
          <p className="avp-badge"><span>Tu información, en buenas manos</span><Flower2 className="size-4" aria-hidden /></p>
        </div>

        <div className="avp-cols">
          <div className="avp-col">
            <Sec n={1} title="Identidad y domicilio del responsable" icon={Building2}>
              <p>Cielito Tours S.A. de C.V., con domicilio en Av. Paseo de la Reforma 296, Piso 10, Col. Juárez, C.P. 06600, Ciudad de México, es responsable del tratamiento de sus datos personales, de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y demás normatividad aplicable.</p>
            </Sec>
            <Sec n={2} title="Datos personales que recabamos" icon={FileText}>
              <p>Podemos recabar las siguientes categorías de datos personales:</p>
              <List items={["Datos de identificación (nombre, apellidos, fecha de nacimiento, nacionalidad).", "Datos de contacto (teléfono, correo electrónico, dirección).", "Datos de viaje (destinos de interés, fechas, número de pasajeros, preferencias).", "Datos de pago (en caso de realizar una reservación).", "Datos sensibles (por ejemplo, necesidades especiales de salud o alimentación, solo con su consentimiento)."]} />
            </Sec>
            <Sec n={3} title="Finalidades del tratamiento" icon={Settings}>
              <p>Sus datos personales serán utilizados para las siguientes finalidades:</p>
              <List items={["Atender y dar seguimiento a sus solicitudes de cotización y reservación.", "Brindar los servicios turísticos contratados.", "Comunicarnos con usted sobre cambios, itinerarios o información relevante de su viaje.", "Enviar promociones, novedades y comunicaciones comerciales (previo consentimiento).", "Cumplir con obligaciones legales y regulatorias.", "Mejorar nuestros servicios y la experiencia del cliente."]} />
            </Sec>
            <Sec n={4} title="Transferencias de datos personales" icon={ArrowLeftRight}>
              <p>Sus datos podrán ser compartidos con terceros, nacionales o extranjeros, únicamente cuando sea necesario para la prestación de nuestros servicios, en los siguientes casos:</p>
            </Sec>
            <div className="avp-tablewrap">
              <table className="avp-table">
                <caption className="sr-only">Transferencias de datos personales</caption>
                <thead><tr><th scope="col">Destinatario</th><th scope="col">Finalidad</th></tr></thead>
                <tbody>{transfers.map(([d, f]) => <tr key={d}><td data-label="Destinatario">{d}</td><td data-label="Finalidad">{f}</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div className="avp-col">
            <Sec n={5} title="Derechos ARCO y revocación del consentimiento" icon={User}>
              <p>Usted puede ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición (ARCO), así como revocar su consentimiento, enviando una solicitud al correo electrónico: <a className="avp-link" href="mailto:privacidad@cielitotours.com">privacidad@cielitotours.com</a>, o a nuestro domicilio señalado. Para conocer el procedimiento y requisitos, puede consultar nuestra Política de privacidad o contactarnos directamente.</p>
            </Sec>
            <Sec n={6} title="Cookies y tecnologías de rastreo" icon={Laptop}>
              <p>Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia de navegación, analizar el tráfico y personalizar contenidos. Usted puede configurar su navegador para rechazar estas tecnologías, aunque algunas funcionalidades del sitio podrían verse afectadas.</p>
            </Sec>
            <Sec n={7} title="Medidas de seguridad" icon={Shield}>
              <p>Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra acceso no autorizado, pérdida, alteración o uso indebido.</p>
            </Sec>
            <Sec n={8} title="Menores de edad" icon={Users}>
              <p>Nuestros servicios no están dirigidos a menores de edad. En caso de que recabemos datos de un menor, será necesario el consentimiento de su padre, madre o tutor legal.</p>
            </Sec>
            <Sec n={9} title="Cambios al aviso de privacidad" icon={FilePen}>
              <p>Nos reservamos el derecho de realizar modificaciones a este aviso de privacidad. Cualquier cambio será publicado en nuestro sitio web, con la fecha de su última actualización.</p>
            </Sec>
            <Sec n={10} title="Consentimiento" icon={Check}>
              <p>Al proporcionar sus datos personales a través de nuestros formularios, usted manifiesta que ha leído y acepta el presente Aviso de Privacidad y autoriza el tratamiento de sus datos personales conforme a las finalidades descritas en este documento.</p>
              <p>En caso de proporcionar datos personales sensibles, como información relacionada con salud, alimentación o necesidades especiales durante su viaje, se solicitará el consentimiento correspondiente conforme a la normativa aplicable.</p>
              <p className="avp-note">Las comunicaciones comerciales y promociones son opcionales y podrá solicitar recibirlas o retirar su consentimiento posteriormente.</p>
            </Sec>
            <Sec n={11} title="Autoridad" icon={Landmark}>
              <p>Si considera que sus derechos de protección de datos personales han sido vulnerados, puede acudir al Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI), a través de su sitio web <a className="avp-link font-semibold" href="https://www.inai.org.mx" target="_blank" rel="noreferrer">www.inai.org.mx</a>.</p>
            </Sec>
          </div>
        </div>

        <div className="avp-sep" aria-hidden="true"><span /><Flower2 className="size-5" /><span /></div>
        <footer className="avp-close">
          <Link to="/" className="avp-back"><ArrowLeft className="size-4" aria-hidden="true" />Volver al inicio</Link>
          <figure className="avp-quote">
            <blockquote>“La confianza también es parte del viaje.”</blockquote>
            <figcaption>Cielito Tours</figcaption>
          </figure>
          <span className="hidden lg:block" />
        </footer>
      </article>
    </div>
  </SiteShell>;
}
