import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BedDouble,
  BriefcaseBusiness,
  Car,
  Check,
  ChevronRight,
  Compass,
  Map,
  Plane,
  Ship,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { imagery } from "@/lib/site-data";
import { RutaHero } from "@/components/home/ruta-hero";
import { RutaServices } from "@/components/home/ruta-services";
import { CrucerosMar } from "@/components/home/cruceros-mar";
import { FamiliaParque } from "@/components/home/familia-parque";
import { DestinosRetro } from "@/components/home/destinos-retro";
import { RutaGroups } from "@/components/home/ruta-groups";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/motion/scroll-progress";

const destinations = ["México", "Caribe", "Estados Unidos", "Europa", "Sudamérica", "Asia"] as const;
const intentions = ["Playa", "Familia", "Romance", "Aventura", "Cultura"] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cielito Tours | Tu viaje completo empieza aquí" },
      { name: "description", content: "Vuelos, hospedaje, autos, cruceros, paquetes y experiencias en México y el mundo, con asesoría personalizada." },
      { property: "og:title", content: "Cielito Tours | Tu viaje completo empieza aquí" },
      { property: "og:description", content: "Vuela, viaja y vive con un equipo que te acompaña en cada parte del camino." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <SiteShell>
    <SmoothScroll />
    <ScrollProgress />
    <RutaHero />
    <RutaServices />

    <DestinosRetro />

    <RutaGroups />

    <CrucerosMar />

    <FamiliaParque />

    <section id="por-que-cielito" className="mobile-section relative overflow-hidden bg-ink py-20 text-primary-foreground sm:py-32">
      <svg aria-hidden="true" viewBox="0 0 1200 500" className="pointer-events-none absolute inset-0 hidden size-full text-accent opacity-20 sm:block"><path d="M-20 380 C210 50 440 450 650 190 S980 90 1230 270" fill="none" stroke="currentColor" strokeWidth="2" className="route-line" /></svg>
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><p className="kicker-text font-bold uppercase tracking-[.16em] text-accent">Por qué Cielito Tours</p><h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Acompañamiento que recorre todo el camino.</h2></div><div className="grid gap-10 sm:grid-cols-3">{[
        ["01", "Antes del viaje", "Te ayudamos a encontrar y coordinar cada parte del viaje."],
        ["02", "Durante la planeación", "Un mismo equipo acompaña todo el proceso."],
        ["03", "Cuando llega el momento", "Todo está organizado para que puedas vivirlo."],
      ].map(([number, title, copy]) => <div key={number} className="border-t border-primary-foreground/20 pt-5"><p className="font-display text-3xl font-bold text-accent">{number}</p><h3 className="mt-5 font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/65">{copy}</p></div>)}</div></div></div>
    </section>

    <section id="statement" className="mobile-section relative bg-background px-6 py-20 text-center sm:px-5 sm:py-36 lg:px-8"><div className="mx-auto max-w-5xl"><p className="section-kicker">Todo empieza con una idea</p><h2 className="mt-6 font-display text-[clamp(2.35rem,11vw,3rem)] font-bold uppercase leading-[.98] text-ink sm:text-[clamp(2.6rem,7vw,6rem)] sm:leading-[.96]">El viaje empieza desde que lo imaginas.</h2><div className="mx-auto mt-9 h-1 w-24 bg-accent" /></div></section>

    <section id="cta-final" className="mobile-section relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-28"><div aria-hidden="true" className="paper-edge absolute inset-x-0 top-0 h-3 opacity-40" /><svg aria-hidden="true" viewBox="0 0 900 260" className="pointer-events-none absolute inset-0 hidden size-full text-accent opacity-15 sm:block"><path d="M-20 210 C170 80 350 260 510 105 S740 40 930 140" fill="none" stroke="currentColor" strokeWidth="2" className="route-line" /></svg><div className="relative mx-auto max-w-7xl px-6 text-center sm:px-5 lg:px-8"><p className="kicker-text font-bold uppercase tracking-[.16em] text-accent">Tu viaje, bien acompañado</p><h2 className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.1rem,9.5vw,2.75rem)] font-bold uppercase leading-[1.02] sm:text-6xl sm:leading-tight">Tú imagínalo.<br />Nosotros conectamos el camino.</h2><div className="mx-auto mt-8 flex max-w-2xl flex-col items-start gap-3 text-left text-sm sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">{["Atención humana", "Opciones claras", "Cotización a tu medida"].map((item) => <span className="flex min-h-8 items-center gap-2" key={item}><Check className="size-4 shrink-0 text-accent" />{item}</span>)}</div><Button asChild size="lg" variant="secondary" className="mt-9 w-full max-sm:min-h-11 sm:w-auto"><Link to="/cotizar">Empezar mi cotización <ArrowRight /></Link></Button></div></section>
  </SiteShell>;
}