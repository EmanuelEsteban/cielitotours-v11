import { createFileRoute, Link } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { ArrowRight, Briefcase, Compass, Heart, Network, Palmtree, Settings, Star, Trophy, UserRound, Users } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

const IMG = "/images/nosotros/";

export const Route = createFileRoute("/nosotros")({
  head: () => ({ meta: [
    { title: "Nosotros | Cielito Tours" },
    { name: "description", content: "Conoce al equipo de Cielito Tours: asesoría personalizada para viajes personales, corporativos, eventos y bodas destino." },
    { property: "og:title", content: "Nosotros | Cielito Tours" },
    { property: "og:description", content: "Tenemos la experiencia para llevarte a las opciones correctas." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Nosotros,
});

type Icon = ComponentType<{ className?: string; "aria-hidden"?: boolean; strokeWidth?: number }>;

const cats: [Icon, string][] = [[Palmtree, "Viajes personales"], [Briefcase, "Corporativos"], [Users, "Eventos"], [Heart, "Bodas destino"]];

const specs: { img: string; pos: string; icon: Icon; title: string; text: string; alt: string }[] = [
  { img: "03_VIAJES_PERSONALES_Y_VACACIONALES.webp", pos: "50% 35%", icon: Palmtree, title: "Viajes personales y vacacionales", text: "Te ayudamos a encontrar opciones de vuelos, hospedaje y servicios de viaje para descubrir destinos y disfrutar nuevas experiencias.", alt: "Viajero disfrutando una bebida en un resort de playa" },
  { img: "04_VIAJES_CORPORATIVOS.jpg", pos: "50% 35%", icon: Briefcase, title: "Viajes corporativos", text: "Buscamos alternativas para empresas, ejecutivos y equipos de trabajo, considerando sus fechas, traslados y presupuesto.", alt: "Viajero de negocios en un aeropuerto" },
  { img: "05_CONFERENCIAS_Y_CONVENCIONES.jpg", pos: "50% 50%", icon: Users, title: "Conferencias y convenciones", text: "Te apoyamos en la búsqueda de alternativas de viaje y hospedaje para asistentes, ponentes y equipos de organización.", alt: "Grupo de asistentes en un evento al aire libre" },
  { img: "06_EVENTOS_DEPORTIVOS.png", pos: "50% 50%", icon: Trophy, title: "Eventos deportivos", text: "Buscamos soluciones de traslado y hospedaje para equipos, delegaciones, entrenadores y participantes de competencias deportivas.", alt: "Vista aérea de un evento deportivo iluminado" },
  { img: "07_BODAS_DESTINO_Y_EVENTOS_ESPECIALES.jpg", pos: "50% 55%", icon: Heart, title: "Bodas destino y eventos especiales", text: "En alianza con Apapacho Planner, sumamos soluciones de viaje y apoyo en la planeación de celebraciones especiales.", alt: "Vista aérea de un gazebo blanco sobre el agua con puente" },
];

const benefits: [Icon, string, string][] = [
  [Compass, "Experiencia y orientación", "Te ayudamos a evaluar diferentes opciones para tomar decisiones informadas."],
  [Settings, "Soluciones a tu medida", "Buscamos alternativas acordes con tus necesidades, fechas y presupuesto."],
  [UserRound, "Atención personalizada", "Cada solicitud recibe atención particular, orientación y una respuesta clara."],
  [Star, "Enfoque integral", "Atendemos viajes personales, empresas, grupos y eventos especiales."],
  [Network, "Una red de colaboración", "Nuestra alianza con Apapacho Planner amplía las posibilidades de atención para proyectos que combinan viajes y eventos."],
];

// Franja revisada: 10 · 15 · 12 · 13 · 14 (11 ya no se usa)
const strip: [string, string, string][] = [
  ["10_BARRA_BRANDING_CIELITO.jpg", "Artículos de marca Cielito Tours sobre una mesa", "50% 55%"],
  ["15_CTA_FINAL_FONDO.jpg", "Integrante de Cielito Tours caminando entre palmeras", "50% 30%"],
  ["12_BARRA_EVENTO_JARDIN.jpg", "Reunión de trabajo del equipo de Cielito Tours", "50% 50%"],
  ["13_BARRA_CONFERENCIA_PUBLICO.jpg", "Coco con logotipo de Hard Rock Hotel Cancún", "60% 55%"],
  ["14_BARRA_FRASE_AZUL.jpg", "Pasajeros caminando hacia un avión en la pista", "55% 50%"],
];

function HandHeart({ className = "" }: { className?: string }) {
  return <svg className={`nos-heart ${className}`} viewBox="0 0 40 36" aria-hidden="true"><path d="M20 33C9 25 3 19 3.5 11.5 4 6 8.5 3 13 3.6c3.4.4 5.6 2.8 7 5.6 1.6-3.3 4.6-6 8.6-5.8 4.6.3 8 4.2 7.4 9-.8 6.6-7.4 12.6-17.6 19.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function Palm({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 200 260" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M104 258c-6-60-4-120 8-176" />
    <path d="M112 82c-20-26-56-34-92-22 30 2 56 12 74 30M112 82c-30-6-62 6-84 32 26-12 54-16 78-10M112 82c4-30 26-54 60-62-26 14-42 34-50 58M112 82c26-12 58-10 84 8-28-4-54 0-76 12M112 82c18 12 32 34 36 60-12-22-28-38-46-48" />
    <path d="M40 66l6 6M54 62l4 8M70 64l2 8M36 104l8-2M50 96l6 4M150 34l-2 8M164 30l-6 6M150 92l8 0M168 94l-4 6" />
  </svg>;
}

function Stamp() {
  return <svg className="nos-stamp" viewBox="0 0 140 140" aria-hidden="true">
    <defs><path id="nos-circ" d="M70 70 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" /></defs>
    <circle cx="70" cy="70" r="58" fill="none" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="70" cy="70" r="54" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="2 3" />
    <circle cx="70" cy="70" r="34" fill="none" stroke="currentColor" strokeWidth=".8" />
    <text fontSize="10" letterSpacing="3.2" fill="currentColor" fontFamily="Manrope, sans-serif" fontWeight="600"><textPath href="#nos-circ">EXPERIENCIAS ✦ QUE CONECTAN ✦</textPath></text>
    {/* avión */}
    <g transform="translate(70 70) rotate(-35)" fill="currentColor">
      <path d="M-2 -20 C-1 -22 1 -22 2 -20 L2.4 -6 L18 3 L18 7 L2.4 2 L2 13 L7 17 L7 20 L0 18 L-7 20 L-7 17 L-2 13 L-2.4 2 L-18 7 L-18 3 L-2.4 -6 Z" />
    </g>
    {/* ondas postales */}
    <path d="M132 50c8-4 14 4 22 0s14 4 22 0M132 62c8-4 14 4 22 0s14 4 22 0M132 74c8-4 14 4 22 0s14 4 22 0M132 86c8-4 14 4 22 0s14 4 22 0" fill="none" stroke="currentColor" strokeWidth=".9" transform="translate(-6 0)" />
  </svg>;
}

function HeroEdge() {
  return <svg className="nos-hero-edge" viewBox="0 0 1440 70" preserveAspectRatio="none" aria-hidden="true">
    <path fill="#F3EADB" opacity=".45" d="M0 46 C220 14 420 14 640 38 S1060 66 1260 30 C1340 16 1400 18 1440 24 L1440 70 L0 70Z" />
    <path fill="#F3EADB" d="M0 56 C240 28 460 30 700 50 S1120 74 1300 44 C1370 34 1410 36 1440 40 L1440 70 L0 70Z" />
  </svg>;
}

function Nosotros() {
  return <SiteShell>
    <div className="nos">
      {/* HERO */}
      <section className="nos-hero">
        <Palm className="nos-palm nos-palm-hero" />
        <div className="nos-hero-img">
          <img src={IMG + "01_HERO_PLAYA_COSTA.png"} alt="Vista aérea de una costa tropical con playa, vegetación y resort" width={1920} height={1080} fetchPriority="high" />
        </div>
        <div className="nos-wrap nos-hero-grid">
          <div className="nos-hero-txt">
            <p className="nos-kicker">Cielito Tours</p>
            <h1 className="nos-h1">Tenemos la experiencia para llevarte a las <em>opciones correctas.</em></h1>
            <p className="nos-p">Cada viaje tiene un propósito, y en Cielito Tours te ayudamos a encontrar las mejores opciones con asesoría personalizada, de acuerdo con tus necesidades, objetivos y presupuesto.</p>
            <Link to="/cotizar" className="nos-btn">Comenzar mi cotización <ArrowRight className="size-4" aria-hidden /></Link>
            <ul className="nos-cats">{cats.map(([I, t]) => <li key={t}><I className="size-[22px]" aria-hidden strokeWidth={1.4} />{t}</li>)}</ul>
          </div>
          <Stamp />
        </div>
        <HeroEdge />
      </section>

      {/* ESENCIA */}
      <section className="nos-esencia">
        <div className="nos-wrap nos-esencia-grid">
          <div className="nos-esencia-txt">
            <p className="nos-kicker">Nuestra esencia</p>
            <h2 className="nos-h2 nos-h2-xl">Cada viaje tiene<br />un propósito</h2>
            <span className="nos-rule" aria-hidden="true" />
            <p className="nos-p">Una escapada familiar, un viaje de negocios o una celebración especial tienen necesidades diferentes. En Cielito Tours evaluamos tus fechas, objetivos y presupuesto para ayudarte a encontrar opciones de vuelos, hospedaje y servicios turísticos con información clara y atención personalizada.</p>
            <p className="nos-script nos-esencia-hand" aria-hidden="true">Personas que hacen<br />&nbsp;&nbsp;posible tus mejores viajes <HandHeart /></p>
          </div>
          <figure className="nos-team">
            <img src={IMG + "02_EQUIPO_GRUPO_CIELITO_v2.jpg"} alt="Los siete integrantes del equipo de Cielito Tours sosteniendo tazas de la marca" width={1280} height={596} loading="lazy" />
            <span className="nos-paper nos-team-note" aria-hidden="true">Un equipo<br />que viaja<br />contigo <HandHeart /></span>
          </figure>
        </div>
      </section>

      {/* ESPECIALIDAD */}
      <section className="nos-spec">
        <Palm className="nos-palm nos-palm-spec" />
        <div className="nos-wrap">
          <p className="nos-kicker text-center">Nuestra especialidad</p>
          <h2 className="nos-h2 text-center">Diversos propósitos, un mismo compromiso</h2>
          <ul className="nos-cards">
            {specs.map(({ img, pos, icon: I, title, text, alt }) => <li key={title} className="nos-card">
              <div className="nos-card-img"><img src={IMG + img} alt={alt} style={{ objectPosition: pos }} loading="lazy" /></div>
              <span className="nos-card-ico"><I className="size-[22px]" aria-hidden strokeWidth={1.5} /></span>
              <h3 className="nos-h3">{title}</h3>
              <p>{text}</p>
            </li>)}
          </ul>
        </div>
      </section>

      {/* APAPACHO */}
      <section className="nos-apa">
        <Palm className="nos-palm nos-palm-apa-l" />
        <Palm className="nos-palm nos-palm-apa-r" />
        <div className="nos-wrap nos-apa-grid">
          <div className="nos-apa-txt">
            <p className="nos-kicker nos-kicker-champ">Bodas destino y eventos especiales</p>
            <h2 className="nos-h2">Nuestra alianza<br />con <em>Apapacho Planner</em></h2>
            <p className="nos-p">Organizar una boda destino también implica pensar en los traslados y el hospedaje de los invitados. Por eso trabajamos junto con Apapacho Planner, combinando nuestra experiencia en viajes con la planeación del evento para buscar alternativas adecuadas a las necesidades de los anfitriones y sus invitados.</p>
            <Link to="/contacto" className="nos-btn nos-btn-apa"><Heart className="nos-btn-ico size-4" aria-hidden strokeWidth={1.6} />Conoce más sobre nuestra alianza <ArrowRight className="nos-btn-arrow size-4" aria-hidden strokeWidth={1.6} /></Link>
          </div>
          <div className="nos-apa-photos">
            <div className="nos-apa-a"><img src={IMG + "08_BODA_PAREJA_SAVE_DATE.jpg"} alt="Pareja frente a un arco de piedra en invitación Save the Date" width={1240} height={1748} loading="lazy" /></div>
            <div className="nos-apa-b"><img src={IMG + "09_BODA_PLANNER_PLAYA.jpg"} alt="Pareja de novios con su coordinadora en una boda frente al mar" width={1920} height={1277} loading="lazy" /></div>
            <p className="nos-script nos-apa-hand" aria-hidden="true">Historias inolvidables<br />en destinos extraordinarios <HandHeart /></p>
            <span className="nos-paper nos-apa-note" aria-hidden="true">Amor,<br />viajes y<br />experiencias<br />para siempre</span>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="nos-ben">
        <div className="nos-wrap">
          <h2 className="nos-h2 text-center">¿Por qué elegir Cielito Tours?</h2>
          <p className="nos-kicker text-center">Experiencia, acompañamiento y resultados</p>
          <ul className="nos-ben-list">{benefits.map(([I, t, d]) => <li key={t}>
            <I className="nos-ben-ico" aria-hidden strokeWidth={1.2} />
            <h3 className="nos-h3">{t}</h3><p>{d}</p>
          </li>)}</ul>
        </div>
      </section>

      {/* FRANJA */}
      <ul className="nos-strip" aria-label="Momentos de Cielito Tours">
        {strip.map(([f, alt, pos]) => <li key={f}><img src={IMG + f} alt={alt} style={{ objectPosition: pos }} loading="lazy" /></li>)}
      </ul>

      {/* CTA */}
      <section className="nos-cta">
        <Palm className="nos-palm nos-palm-cta-l" />
        <Palm className="nos-palm nos-palm-cta-r" />
        <div className="nos-wrap nos-cta-grid">
          <h2 className="nos-h2">Tu próximo viaje o evento<br />comienza aquí.</h2>
          <p className="nos-p">Cuéntanos qué tienes en mente y permítenos ayudarte a encontrar las opciones adecuadas para tu viaje o evento. En Cielito Tours estamos listos para escucharte.</p>
          <Link to="/cotizar" className="nos-btn">Cotizar mi viaje <ArrowRight className="size-4" aria-hidden /></Link>
          <p className="nos-script nos-cta-hand" aria-hidden="true">La vida es mejor<br />&nbsp;&nbsp;&nbsp;viajando <HandHeart /></p>
        </div>
      </section>
    </div>
  </SiteShell>;
}
