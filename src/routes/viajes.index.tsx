import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, MapPin, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import tripsHeroImage from "@/assets/cielito-trips-hero-cultural.jpg";
import feelingImage from "@/assets/trips-feeling.jpg";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";

import { intentions, regions, travelIdeas, type Intention, type Region } from "@/lib/travel-ideas";

function cardLayout(index: number, total: number) {
  if (total === 1) return "md:col-span-12 lg:min-h-[560px]";
  if (total % 2 === 1 && index === total - 1) return "md:col-span-12 lg:min-h-[500px]";
  const layouts = [
    "md:col-span-7 lg:min-h-[600px]",
    "md:col-span-5 lg:min-h-[600px]",
    "md:col-span-5 lg:min-h-[520px]",
    "md:col-span-7 lg:min-h-[520px]",
    "md:col-span-8 lg:min-h-[500px]",
    "md:col-span-4 lg:min-h-[500px]",
  ];
  return layouts[index % layouts.length];
}

export const Route = createFileRoute("/viajes/")({
  head: () => ({
    meta: [
      { title: "Viajes y paquetes personalizados | Cielito Tours" },
      { name: "description", content: "Explora ideas de viaje en México y el mundo y conviértelas en una propuesta personalizada con Cielito Tours." },
      { property: "og:title", content: "Viajes y paquetes personalizados | Cielito Tours" },
      { property: "og:description", content: "Tu próximo viaje puede empezar por una idea. Descubre inspiración para viajar a tu manera." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TripsPage,
});

function TripsPage() {
  const [region, setRegion] = useState<Region | "Todas">("Todas");
  const [intention, setIntention] = useState<Intention | "Todas">("Todas");

  const filteredIdeas = useMemo(() => travelIdeas.filter((idea) => {
    const matchesRegion = region === "Todas" || idea.region === region;
    const matchesIntention = intention === "Todas" || idea.intentions.includes(intention);
    return matchesRegion && matchesIntention;
  }), [intention, region]);

  const resetFilters = () => {
    setRegion("Todas");
    setIntention("Todas");
  };

  return <SiteShell>
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl gap-7 px-5 pb-5 pt-9 sm:gap-9 sm:px-6 sm:pb-6 sm:pt-11 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:px-8 lg:pb-6 lg:pt-12">
        <div>
          <p className="section-kicker flex items-center gap-3 tracking-[.24em]"><span aria-hidden="true" className="h-px w-10 shrink-0 bg-accent" />Viajes</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.35rem,10vw,3.2rem)] font-extrabold uppercase leading-[.98] text-ink sm:text-6xl lg:text-7xl">¿Qué te gustaría <span className="text-primary">vivir ahora?</span></h1>
        </div>
        <div className="max-w-xl lg:pb-1">
          <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">Explora ideas en México y el mundo. Cuando encuentres algo que te inspire, nuestro equipo puede ayudarte a convertirlo en un viaje pensado para ti.</p>
          <Button asChild size="lg" className="mt-6 w-full sm:w-auto"><a href="#explorar-viajes">Explorar viajes <ArrowDown /></a></Button>
        </div>
      </div>
      <div className="relative h-[300px] overflow-hidden sm:h-[370px] lg:h-[420px]">
        <img src={tripsHeroImage} alt="Viajeros llegando con equipaje y mapa a una ciudad histórica" width={1920} height={1080} fetchPriority="high" className="size-full object-cover object-[56%_44%] sm:object-[54%_42%] lg:object-[center_40%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/25 via-transparent to-background/10" />
        <div className="absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-background/15 to-transparent lg:block" />
        <div className="absolute inset-y-0 right-0 hidden w-20 bg-gradient-to-l from-background/15 to-transparent lg:block" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/65 via-background/20 to-transparent sm:h-24" />
        <div className="absolute inset-x-0 -bottom-px h-28 bg-gradient-to-t from-background via-background/45 to-transparent sm:h-36 lg:h-40" />
        <svg aria-hidden="true" viewBox="0 0 1100 260" className="pointer-events-none absolute inset-x-0 bottom-0 w-full text-accent opacity-75"><path d="M-40 220 C150 76 330 262 520 120 S860 40 1140 170" fill="none" stroke="currentColor" strokeWidth="3" className="route-line" /></svg>
        <p className="absolute bottom-6 left-5 max-w-[17rem] border-l-2 border-accent bg-ink/75 px-4 py-2.5 text-xs font-bold uppercase tracking-[.14em] text-primary-foreground shadow-sm sm:bottom-8 sm:left-8 sm:max-w-none">Tu próximo viaje puede empezar por una idea.</p>
      </div>
    </section>

    <section id="explorar-viajes" className="mobile-section relative bg-background pb-14 pt-8 sm:pb-20 sm:pt-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-secondary/35 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="section-kicker flex items-center gap-3 tracking-[.22em]"><span aria-hidden="true" className="h-px w-10 shrink-0 bg-accent" />Explora por intención</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">Empieza por lo que quieres sentir.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground lg:justify-self-end">Estas ideas son inspiración para imaginar posibilidades. Cada viaje se prepara contigo y se confirma al momento de cotizar.</p>
        </div>

        <div className="scrollbar-hidden -mr-5 mt-6 flex snap-x gap-3 overflow-x-auto pr-5 sm:mr-0 sm:mt-7 sm:flex-wrap sm:overflow-visible sm:pr-0" aria-label="Filtrar por intención">
          <Button type="button" variant={intention === "Todas" ? "default" : "outline"} className="min-h-11 shrink-0 snap-start" aria-pressed={intention === "Todas"} onClick={() => setIntention("Todas")}>Todas</Button>
          {intentions.map((item) => <Button key={item} type="button" variant={intention === item ? "default" : "outline"} className="min-h-11 shrink-0 snap-start" aria-pressed={intention === item} onClick={() => setIntention(item)}>{item}</Button>)}
        </div>

        <div className="mt-6 border-y border-border py-4 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
          <p className="text-xs font-extrabold uppercase tracking-[.14em] text-ink">Región</p>
          <div className="scrollbar-hidden -mr-5 mt-3 flex snap-x gap-1 overflow-x-auto pr-5 sm:mr-0 sm:mt-0 sm:flex-wrap sm:justify-end sm:overflow-visible sm:pr-0" aria-label="Filtrar por región">
            <Button type="button" variant="ghost" size="sm" className={region === "Todas" ? "shrink-0 bg-secondary text-primary" : "shrink-0"} aria-pressed={region === "Todas"} onClick={() => setRegion("Todas")}>Todas</Button>
            {regions.map((item) => <Button key={item} type="button" variant="ghost" size="sm" className={region === item ? "shrink-0 bg-secondary text-primary" : "shrink-0"} aria-pressed={region === item} onClick={() => setRegion(item)}>{item}</Button>)}
          </div>
        </div>

        <div className="mt-6 grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3" aria-live="polite">
          <p className="text-sm text-muted-foreground"><strong className="text-ink">{filteredIdeas.length}</strong> {filteredIdeas.length === 1 ? "idea encontrada" : "ideas encontradas"} · Contenido demo de inspiración</p>
          {(region !== "Todas" || intention !== "Todas") && <Button type="button" variant="ghost" size="sm" onClick={resetFilters}><RotateCcw /> Limpiar filtros</Button>}
        </div>

        {filteredIdeas.length > 0 ? <div className="mt-5 grid auto-rows-[minmax(440px,auto)] gap-4 md:grid-cols-12 md:gap-5">
          {filteredIdeas.map((idea, index) => {
            return <article key={idea.slug} className={`group relative min-h-[440px] overflow-hidden bg-ink shadow-sm ${cardLayout(index, filteredIdeas.length)}`}>
              <img src={idea.image} alt={idea.imageAlt} loading="lazy" width={1600} height={1104} className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 motion-safe:group-hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[.13em]"><span className="bg-accent px-2.5 py-1.5 text-accent-foreground">Inspiración</span><span className="border border-primary-foreground/35 bg-ink/55 px-2.5 py-1.5">Cotización personalizada</span></div>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-accent"><MapPin className="size-3.5" />{idea.region} · {idea.category}</div>
                <h3 className="mt-3 font-display text-3xl font-bold uppercase sm:text-4xl">{idea.name}</h3>
                <p className="mt-2 font-display text-xl font-semibold">{idea.destination}</p>
                <p className="mt-4 max-w-xl text-sm leading-6 text-primary-foreground/75">{idea.description}</p>
                <p className="mt-4 text-xs font-semibold text-primary-foreground/70">{idea.intentions.join(" · ")}</p>
                <Button asChild variant="secondary" className="mt-6 w-full sm:w-auto"><Link to="/viajes/$slug" params={{ slug: idea.slug }}>Me interesa esta idea <ArrowRight /></Link></Button>
              </div>
            </article>;
          })}
        </div> : <div className="mt-7 grid min-h-[360px] place-items-center border border-border bg-secondary px-6 py-14 text-center">
          <div className="max-w-xl">
            <Sparkles className="mx-auto size-8 text-primary" />
            <h3 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">No tenemos una idea publicada con esta combinación todavía.</h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Eso no significa que tu viaje no sea posible. Cuéntanos qué estás imaginando y podremos empezar desde ahí.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild><Link to="/cotizar">Cuéntanos qué estás imaginando <ArrowRight /></Link></Button>
              <Button type="button" variant="outline" onClick={resetFilters}><RotateCcw /> Ver todas las ideas</Button>
            </div>
          </div>
        </div>}
      </div>
    </section>

    <section className="mobile-section relative overflow-hidden bg-ink pb-16 pt-20 text-primary-foreground sm:pb-20 sm:pt-24">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent opacity-20" />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-8">
        <div className="relative min-h-[360px] overflow-hidden sm:min-h-[460px]">
          <img src={feelingImage} alt="Amigos compartiendo historias alrededor de una fogata entre montañas" loading="lazy" width={1600} height={1104} className="absolute inset-0 size-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
          <svg aria-hidden="true" viewBox="0 0 600 420" className="pointer-events-none absolute inset-0 size-full text-accent opacity-70"><path d="M-20 350 C120 170 220 420 350 230 S500 90 630 180" fill="none" stroke="currentColor" strokeWidth="3" className="route-line" /></svg>
        </div>
        <div className="lg:pl-8">
          <p className="kicker-text font-extrabold uppercase tracking-[.15em] text-accent">Más que un destino</p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,9vw,3.2rem)] font-bold uppercase leading-[1.02] sm:text-6xl">No todo viaje empieza con un destino.</h2>
          <p className="mt-6 max-w-xl font-display text-xl font-semibold text-primary-foreground/85 sm:text-2xl">A veces empieza con lo que quieres sentir.</p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-primary-foreground/65">Descansar, celebrar, descubrir algo nuevo o compartir tiempo con quienes quieres. Esa intención puede ser el mejor punto de partida.</p>
        </div>
      </div>
    </section>

    <section id="personalizar-viaje" className="mobile-section relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-24">
      <svg aria-hidden="true" viewBox="0 0 1000 260" className="pointer-events-none absolute inset-0 hidden size-full text-accent opacity-20 sm:block"><path d="M-40 210 C160 70 350 280 540 110 S820 40 1040 150" fill="none" stroke="currentColor" strokeWidth="2" className="route-line" /></svg>
      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <p className="kicker-text font-extrabold uppercase tracking-[.15em] text-accent">Tu idea también puede ser el inicio</p>
        <h2 className="mt-5 font-display text-[clamp(2.15rem,9vw,3rem)] font-bold uppercase leading-[1.03] sm:text-6xl">¿No encontraste exactamente lo que imaginas?</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-primary-foreground/75 sm:text-lg">Podemos empezar desde tu idea y ayudarte a convertirla en un viaje pensado para ti.</p>
        <Button asChild size="lg" variant="secondary" className="mt-8 w-full sm:w-auto"><Link to="/cotizar">Cuéntanos tu viaje <ArrowRight /></Link></Button>
      </div>
    </section>
  </SiteShell>;
}