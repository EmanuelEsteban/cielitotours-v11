import ceibaImg from "@/assets/ceiba-engraving.webp";
import coasterTex from "@/assets/orlando-tex-coaster.webp";
import nightTex from "@/assets/orlando-tex-night.webp";
import fireworksTex from "@/assets/orlando-tex-fireworks.webp";
import slidesTex from "@/assets/orlando-tex-slides.webp";
import splitImg from "@/assets/acapulco-split.webp";
import espumaTex from "@/assets/acapulco-tex-espuma.webp";
import glintsTex from "@/assets/acapulco-tex-destellos.webp";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BedDouble, CarFront, Compass, Hotel, MapPin, Plane, Route as RouteIcon, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";
import { getRelatedTravelIdeas, getTravelIdea, type CoordinatedService } from "@/lib/travel-ideas";
import { getDestinationTheme, type DarkTexture } from "@/lib/destination-themes";

const serviceIcons: Record<CoordinatedService, typeof Plane> = {
  Vuelos: Plane,
  Hospedaje: BedDouble,
  Traslados: RouteIcon,
  "Renta de autos": CarFront,
  "Actividades y experiencias": Compass,
};

const serviceLines: Partial<Record<CoordinatedService, string>> = {
  Vuelos: "Te ayudamos a elegir tu\u00a0vuelo",
  Hospedaje: "Opciones según tu estilo",
  Traslados: "Del aeropuerto a tu\u00a0destino",
  "Renta de autos": "Para moverte a tu ritmo",
};

const serviceLinks: Partial<Record<CoordinatedService, "/servicios/vuelos" | "/servicios/hospedaje" | "/servicios/renta-de-autos">> = {
  Vuelos: "/servicios/vuelos",
  Hospedaje: "/servicios/hospedaje",
  "Renta de autos": "/servicios/renta-de-autos",
};

export const Route = createFileRoute("/viajes/$slug")({
  loader: ({ params }) => getTravelIdea(params.slug),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Idea no disponible | Cielito Tours" },
          { name: "description", content: "Esta idea de viaje no está disponible. Explora otras formas de viajar con Cielito Tours." },
          { property: "og:title", content: "Idea no disponible | Cielito Tours" },
          { property: "og:description", content: "Explora otras ideas de viaje con Cielito Tours." },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} | Ideas de viaje | Cielito Tours`;
    const description = `Explora una idea de viaje a ${loaderData.name} con Cielito Tours y solicita una cotización personalizada.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TravelIdeaPage,
});

function TravelIdeaPage() {
  const idea = Route.useLoaderData();

  if (!idea) {
    return <SiteShell><section className="grid min-h-[65vh] place-items-center bg-background px-5 py-20 text-center"><div className="max-w-xl"><Sparkles className="mx-auto size-10 text-primary" /><p className="section-kicker mt-6">Inspiración Cielito</p><h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">Esta idea de viaje no está disponible.</h1><p className="mt-5 leading-7 text-muted-foreground">Puedes volver al catálogo y descubrir otras posibilidades para tu próximo viaje.</p><Button asChild size="lg" className="mt-8"><Link to="/viajes"><ArrowLeft /> Volver a viajes</Link></Button></div></section></SiteShell>;
  }

  const theme = getDestinationTheme(idea.slug);
  const caribe = Boolean(theme);
  const aca = theme?.id === "acapulco";
  const reveal = caribe ? "caribe-reveal" : "";
  const relatedIdeas = getRelatedTravelIdeas(idea);
  const hl = idea.highlights ?? {};
  const articleRef = useRevealOnScroll(idea.slug);
  const quoteSearch = { ideaSlug: idea.slug, ideaName: idea.name, region: idea.region, sourcePage: `/viajes/${idea.slug}` };

  return <SiteShell>
    <article ref={articleRef} className={theme ? `theme-dest theme-${theme.id}` : undefined}>
      <section className="relative min-h-[610px] overflow-hidden bg-ink text-primary-foreground sm:min-h-[650px] lg:min-h-[680px]">
        <img src={idea.image} alt={idea.imageAlt} width={1600} height={1104} fetchPriority="high" className="absolute inset-0 size-full object-cover object-center" />
        {caribe ? <>
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, color-mix(in oklab, var(--ink) 58%, transparent) 0%, transparent 58%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
          <div className="absolute inset-0 shadow-[inset_0_0_160px_40px_color-mix(in_oklab,var(--ink)_55%,transparent)]" />
        </> : <>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/90 to-transparent" />
        </>}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-px h-[105px] sm:h-[170px]" style={{ background: `linear-gradient(to bottom, transparent, color-mix(in oklab, ${caribe ? "var(--t-hero-fade)" : "var(--background)"} 55%, transparent) 55%, ${caribe ? "var(--t-hero-fade)" : "var(--background)"})` }} />
        <svg aria-hidden="true" viewBox="0 0 1200 430" className="pointer-events-none absolute inset-x-0 bottom-0 w-full text-accent opacity-65"><path d="M-50 360 C170 160 350 430 550 220 S890 80 1260 270" fill="none" stroke="currentColor" strokeWidth="3" className="route-line" /></svg>
        <div className="relative mx-auto flex min-h-[610px] max-w-7xl items-end px-5 pb-28 pt-28 sm:min-h-[650px] sm:px-6 sm:pb-48 lg:min-h-[680px] lg:px-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 text-xs font-extrabold uppercase tracking-[.13em]"><span className="bg-accent px-3 py-2 text-accent-foreground">Inspiración</span><span className="border border-primary-foreground/40 bg-ink/65 px-3 py-2">Cotización personalizada</span></div>
            <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-accent"><MapPin className="size-4" />{idea.state ? `${idea.country} · ${idea.state}` : `${idea.region} · ${idea.country}`}</p>
            <h1 className="mt-3 font-display text-[clamp(2.8rem,12vw,5.8rem)] font-extrabold uppercase leading-[.92]">{idea.name}</h1>
            <p className="mt-4 max-w-2xl font-display text-[1.5rem] font-semibold leading-snug text-primary-foreground/90 sm:text-3xl"><Highlight text={idea.destination} word={hl.hero} className="hl-on-dark hl-hero" /></p>
            <p className="mt-4 text-[17px] font-semibold text-primary-foreground/85">{idea.intentions.join(" · ")}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link to="/cotizar" search={quoteSearch}>Cotizar esta idea <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/45 bg-ink/30 text-primary-foreground hover:bg-primary-foreground hover:text-ink"><Link to="/viajes"><ArrowLeft /> Volver a viajes</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <div className="relative" style={aca ? { background: bayBase } : undefined}>
      {aca && <SplitPhoto />}
      <div className="relative">
      <section className={`relative overflow-hidden bg-background ${caribe ? "caribe-grad-idea pt-16 pb-11 sm:pt-20 sm:pb-14" : "py-16 sm:py-20"} ${theme?.id === "orlando" ? "caribe-grad-idea" : ""} ${aca ? "aca-clear" : ""}`}>
        <div className={`relative z-10 mx-auto grid ${reveal} max-w-7xl gap-8 px-5 lg:grid-cols-[.55fr_1.45fr] lg:px-8`}>
          <div className="relative [container-type:inline-size]"><p className={"section-kicker kicker-line"}>La idea</p>{theme ? <p className="mt-4 font-display font-bold uppercase"><span className="vivir-grad block text-[clamp(3rem,15vw,5.5rem)] font-extrabold leading-[.95] tracking-[-.02em] lg:text-[clamp(3.5rem,6vw,5.8rem)]" style={fitGiant(theme.idea.giant, "5.8rem")}>{theme.idea.giant}</span>{theme.idea.rest && <span className="mt-1 block text-[1.625rem] leading-[1.05] tracking-[.04em] text-[color:var(--caribe-jungle)] lg:text-[2.375rem]">{theme.idea.rest}</span>}</p> : <p className="mt-4 text-sm font-bold uppercase tracking-[.12em] text-muted-foreground">{idea.category}</p>}
          </div>
          <div><h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-ink sm:text-5xl"><Highlight text={idea.ideaTitle ?? idea.description} word={hl.idea} className={caribe ? "hl-idea" : ""} /></h2><p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{idea.concept}</p></div>
        </div>
      </section>

      <section className={`relative overflow-hidden bg-secondary py-16 sm:py-20 ${caribe ? "caribe-grad-vivir" : ""} ${theme?.id === "orlando" ? "!pb-0" : ""} ${aca ? "aca-clear !pb-0" : ""}`} style={theme?.id === "orlando" ? { background: "linear-gradient(in oklab 180deg, oklch(0.955 0.03 230) 0%, #FFEBD6 100%)" } : undefined}>
        <div className={`relative z-10 mx-auto max-w-7xl px-5 lg:px-8 ${reveal}`}>
          <div className="grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-end"><div className="[container-type:inline-size]"><p className="section-kicker kicker-line">Posibilidades, no itinerarios</p>{theme ? <h2 className="reveal-item mt-4 font-display font-bold text-ink"><span className="block text-4xl sm:text-5xl">Lo que podrías</span><span className="vivir-grad block text-[3.6rem] font-extrabold uppercase leading-[.95] tracking-[-.02em] sm:text-[5.5rem] lg:text-[5.8rem]" style={fitGiant(theme.experienceWord, "5.8rem")}>{theme.experienceWord}</span></h2> : <h2 className="reveal-item mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">Lo que podrías vivir.</h2>}</div><p className="max-w-xl text-[16px] leading-7 text-muted-foreground sm:text-[17px] lg:justify-self-end">Son puntos de partida para imaginar tu experiencia. Las actividades se definen y confirman contigo al preparar la propuesta.</p></div>
          {caribe ? <ol data-aca-cards className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {idea.possibilities.map((possibility, index) => <li key={possibility} style={{ "--d": `${index * 80}ms` } as CSSProperties} className="caribe-card reveal-item group relative min-h-52 overflow-hidden p-6"><span aria-hidden="true" className="num-outline block font-display text-7xl font-extrabold leading-none">0{index + 1}</span><span aria-hidden="true" className="mt-5 block h-px w-10 bg-accent transition-all duration-500 group-hover:w-20" /><p className="mt-5 font-display text-lg font-semibold leading-snug text-ink">{possibility}</p></li>)}
          </ol> : <ol className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {idea.possibilities.map((possibility, index) => <li key={possibility} style={{ "--d": `${index * 80}ms` } as CSSProperties} className="reveal-item min-h-44 bg-background p-6"><span className="font-display text-3xl font-bold text-primary">0{index + 1}</span><p className="mt-8 font-display text-lg font-semibold leading-snug text-ink">{possibility}</p></li>)}
          </ol>}
        </div>
      </section>

      {theme?.id === "orlando" && <div className="relative z-0 flex flex-col items-center gap-5 px-5 pb-8 pt-12 text-center md:gap-6 md:pb-[20px] md:pt-[120px]" style={{ background: duskSky }}><p className="reveal-item neon-phrase text-[#161944]">De día, <br className="sm:hidden" />pura adrenalina.</p><p className="reveal-item neon-phrase neon-night">De noche, <br className="sm:hidden" />todo se <span className="neon-gold neon-flicker">enciende.</span></p></div>}
      {aca && <div aria-hidden="true" className="h-[240px] md:h-[350px]" />}
      {theme && <>{theme.decorations.left === "montana-rusa" ? <CoasterPhoto /> : theme.decorations.left === "veleros" ? null : <LeftTree src={ceibaImg} />}{theme.decorations.right === "constelacion" ? <Constellation /> : theme.decorations.right === "sendero" ? <Sendero /> : null}</>}
      </div>

      <div className={aca ? "aca-lift" : undefined}>
      {theme ? (theme.moment.variant === "cinta-montana-rusa" ? <><WordRibbon words={theme.moment.words} caribe={false} className="md:hidden !border-b-0 !bg-transparent" style={{ background: ribbonSky }} /><CoasterRibbon words={theme.moment.words} /></> : theme.moment.variant === "cinta-ola" ? <OceanRibbon words={theme.moment.words} /> : <WordRibbon words={theme.moment.words} caribe />) : idea.marquee && idea.marquee.length > 0 && <WordRibbon words={idea.marquee} caribe={false} />}

      <section className={`relative overflow-hidden bg-ink py-16 text-primary-foreground sm:py-20 ${caribe ? "caribe-deep sm:py-24" : ""} ${theme?.id === "orlando" ? "!pt-[110px] md:!pt-[200px]" : ""} ${aca ? "aca-clear !pt-[140px] md:!pt-[180px]" : ""}`} style={theme?.id === "orlando" ? { background: nightTop } : aca ? { background: "transparent" } : undefined}>
        {theme && <DarkTextureLayer kind={theme.decorations.formsTexture} />}
        <div className={`relative mx-auto max-w-4xl px-5 text-center lg:px-8 ${reveal}`}>
          <p className="kicker-text kicker-line kicker-center uppercase text-accent">Un punto de partida flexible</p><h2 className="reveal-item mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl"><Highlight text={theme?.forms.title ?? "Tu viaje puede tomar muchas formas."} word={theme?.forms.highlight ?? hl.forms} className="hl-on-dark" /></h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/85 sm:text-xl">La misma inspiración puede adaptarse a quién viaja contigo, al ritmo que buscas y a lo que quieres&nbsp;sentir.</p><div className="mt-7 flex flex-wrap justify-center gap-3">{idea.travelForms.map((form) => <span key={form} className="cursor-default select-none rounded-full bg-primary-foreground/12 px-4 py-2.5 text-sm font-bold uppercase tracking-[.06em]">{form}</span>)}</div>
          <div className="mx-auto mt-12 max-w-2xl"><p className="kicker-text kicker-line kicker-center uppercase text-accent">Construido contigo</p><h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Podemos construir el recorrido contigo.</h3><p className="mt-4 text-lg leading-8 text-primary-foreground/85">Cuando definamos fechas, duración y prioridades, nuestro equipo puede ayudarte a organizar una propuesta&nbsp;adecuada.</p></div>
        </div>
      </section>
      </div>
      {aca && <Bubbles />}
      </div>

      <section className={`relative overflow-hidden bg-background py-16 sm:py-20 ${caribe ? "caribe-grad-coord" : ""} ${theme?.decorations.services === "parque" ? "md:pb-[200px]" : ""}`}>
        {theme && (theme.decorations.services === "espuma" ? <FoamPhoto /> : theme.decorations.services === "parque" ? <ParkSilhouette className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-[70%] w-1/2 md:block" /> : <SeaFan className="caribe-wave pointer-events-none absolute -bottom-16 -right-20 w-56 sm:-bottom-24 sm:-right-40 sm:w-[26rem] lg:-right-52 lg:w-[34rem] min-[1920px]:-right-40" />)}
        <div className={`relative mx-auto max-w-7xl px-5 lg:px-8 ${reveal}`}>
          <p className="section-kicker kicker-line">Todo tu viaje, con un mismo equipo</p><h2 className="reveal-item mt-4 max-w-3xl font-display text-4xl font-bold text-ink sm:text-5xl">Podemos ayudarte a coordinar cada pieza.</h2><p className="mt-5 max-w-2xl text-[16px] leading-7 text-muted-foreground sm:text-[17px]">Los servicios no están incluidos automáticamente. Los seleccionamos y cotizamos según la propuesta que construyamos contigo.</p>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">{idea.services.map((service, index) => { const Icon = serviceIcons[service] ?? Hotel; const line = serviceLines[service] ?? idea.activitiesLine ?? "Experiencias a tu medida"; const last = index === idea.services.length - 1 && idea.services.length % 2 === 1; const inner = <><span className="service-tile-icon grid size-16 place-items-center rounded-full"><Icon className="size-10" strokeWidth={1.6} /></span><span className="mt-5 font-display text-base font-bold text-ink">{service}</span><span className="mt-1.5 text-sm leading-5 text-muted-foreground">{line}</span><ArrowRight aria-hidden="true" className="service-tile-arrow mt-3 size-5" /></>; const cls = `service-tile reveal-item flex min-h-60 flex-col items-center justify-start p-5 pt-8 text-center ${last ? "col-span-2 lg:col-span-1" : ""}`; const to = serviceLinks[service]; const st = { "--d": `${index * 80}ms` } as CSSProperties; return to ? <Link key={service} to={to} style={st} className={cls}>{inner}</Link> : <Link key={service} to="/cotizar" search={quoteSearch} style={st} className={cls}>{inner}</Link>; })}</div>
        </div>
      </section>

      {theme && idea.gallery.length > 0 && <CaribeGallery gallery={idea.gallery} title={theme.gallery.title} highlight={theme.gallery.highlight} side={theme.gallery.side} texture={theme.decorations.galleryTexture} />}

      {!caribe && idea.gallery.length > 0 && <section className="bg-secondary py-16 sm:py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="section-kicker kicker-line">Otra mirada</p><h2 className="reveal-item mt-4 font-display text-4xl font-bold text-ink sm:text-5xl"><Highlight text="Imagina la atmósfera." word={hl.atmosphere} /></h2></div><p className="max-w-md text-sm leading-7 text-muted-foreground">Referencias visuales para inspirar la conversación, no servicios confirmados.</p></div><div className={`mt-9 grid gap-4 ${idea.gallery.length > 2 ? "sm:grid-cols-2" : idea.gallery.length > 1 ? "sm:grid-cols-[1.25fr_.75fr]" : ""}`}>{idea.gallery.map((image, index) => <figure key={image.src} style={{ "--d": `${index * 80}ms` } as CSSProperties} className={`reveal-item overflow-hidden ${idea.gallery.length > 2 ? "aspect-[4/3]" : index === 0 ? "aspect-[4/3] sm:aspect-[5/3]" : "aspect-[4/3] sm:aspect-auto"}`}><img src={image.src} alt={image.alt} loading="lazy" width={1600} height={1200} className="size-full object-cover object-center" /></figure>)}</div></div></section>}

      {relatedIdeas.length > 0 && <section className="bg-background py-16 sm:py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><p className="section-kicker kicker-line">También podría interesarte</p><h2 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">Sigue explorando.</h2><div className="mt-9 grid gap-5 md:grid-cols-3">{relatedIdeas.map((related) => <article key={related.slug} className="group relative min-h-[390px] overflow-hidden bg-ink text-primary-foreground"><img src={related.image} alt={related.imageAlt} loading="lazy" width={1600} height={1104} className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 motion-safe:group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-t from-ink from-10% via-ink/75 via-45% to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6"><p className="kicker-text font-bold uppercase tracking-[.13em] text-accent">{related.region} · {related.category}</p><h3 className="mt-3 font-display text-2xl font-bold uppercase">{related.name}</h3><Button asChild variant="secondary" className="relative z-10 mt-5 w-full border-0 shadow-none [backface-visibility:hidden] [transform:translateZ(0)]"><Link to="/viajes/$slug" params={{ slug: related.slug }}>Me interesa esta idea <ArrowRight /></Link></Button></div></article>)}</div></div></section>}

      <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-24"><svg aria-hidden="true" viewBox="0 0 1000 260" className="pointer-events-none absolute inset-0 hidden size-full text-accent opacity-20 sm:block"><path d="M-40 210 C160 70 350 280 540 110 S820 40 1040 150" fill="none" stroke="currentColor" strokeWidth="2" className="route-line" /></svg><div className="relative mx-auto max-w-5xl px-5 text-center lg:px-8"><p className="kicker-text kicker-line kicker-center uppercase text-accent">Inspiración que puede hacerse realidad</p><h2 className="mt-5 font-display text-[clamp(2.2rem,9vw,3.4rem)] font-bold uppercase leading-[1.02] sm:text-6xl">{idea.closingLine}</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-foreground/90 sm:text-xl lg:max-w-none lg:whitespace-nowrap">Cuéntanos cómo lo imaginas y empecemos a construir una propuesta&nbsp;contigo.</p><Button asChild size="lg" variant="secondary" className="mt-8 w-full sm:w-auto"><Link to="/cotizar" search={quoteSearch}>Cotizar esta idea <ArrowRight /></Link></Button></div></section>
    </article>
  </SiteShell>;
}

const galleryNumbers = [1, 2, 5, 6, 3, 4, 7, 8, 9];

const decoMask = "linear-gradient(to top, black 0%, black 55%, transparent 100%)";

function fitGiant(word: string, max: string): CSSProperties | undefined {
  // Long giant words scale with their column (container query units) so they never collide or overflow.
  if (word.length <= 5) return undefined;
  return { fontSize: `min(${max}, calc(100cqi / ${(word.length * 0.74).toFixed(2)}))` };
}

function LeftTree({ src, compact, opacity = 0.22 }: { src: string; compact?: boolean; opacity?: number }) {
  const vMask = "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.25) 12%, rgba(0,0,0,.75) 26%, black 38%, black 100%)";
  const hMask = "linear-gradient(to right, black 0%, black 58%, rgba(0,0,0,.4) 78%, transparent 96%)";
  return <div aria-hidden="true" className={`pointer-events-none absolute -bottom-5 left-0 z-0 hidden min-[1440px]:block ${compact ? "top-[8%] min-[1920px]:top-[-9.5rem]" : "top-[-9.5rem]"}`}>
    <img src={src} alt="" loading="lazy" decoding="async" width={832} height={1216} className="h-full w-auto max-w-none -translate-x-[42%] select-none" style={{ mixBlendMode: "multiply", opacity, filter: "contrast(1.25) brightness(1.08)", maskImage: `${vMask}, ${hMask}`, WebkitMaskImage: `${vMask}, ${hMask}`, maskComposite: "intersect", WebkitMaskComposite: "source-in" }} />
  </div>;
}

function Sendero() {
  const leaves = [
    { x: 150, y: 170, r: -30, d: "M0 0 C18 -22 48 -22 64 0 C48 18 18 18 0 0 Z" },
    { x: 60, y: 360, r: 40, d: "M0 0 C10 -30 34 -40 46 -10 C40 12 18 16 0 0 Z" },
    { x: 150, y: 560, r: -70, d: "M0 0 C22 -12 60 -10 82 4 C58 14 24 14 0 0 Z" },
    { x: 70, y: 760, r: 15, d: "M0 0 C6 -18 24 -30 36 -30 C36 -14 22 0 0 0 Z" },
    { x: 140, y: 930, r: 110, d: "M0 0 C14 -26 40 -30 54 -8 C44 8 26 20 0 0 Z M10 -2 L48 -8" },
  ];
  return <svg aria-hidden="true" viewBox="0 0 220 1100" preserveAspectRatio="xMaxYMid meet" className="deco-drift pointer-events-none absolute bottom-0 right-0 top-0 hidden h-full w-auto translate-x-[40%] xl:block min-[1600px]:translate-x-0" style={{ maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
    <path d="M200 0 C40 150 200 300 90 450 S40 800 150 1100" fill="none" stroke="var(--accent)" strokeWidth="3" opacity=".4" className="route-line" />
    <g fill="var(--caribe-jungle)" opacity=".16">{leaves.map((l, i) => <path key={i} d={l.d} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`} />)}</g>
  </svg>;
}

function PalmLeaf({ className }: { className?: string }) {
  const leaflets = Array.from({ length: 13 }, (_, i) => {
    const t = 0.1 + i * 0.066; const x = 30 + 230 * t; const y = 290 - 250 * t + 40 * t * t; const len = 150 - i * 8; const ang = -62 + i * 1.5;
    return <g key={i} transform={`translate(${x} ${y})`}>
      <path d={`M0 0 C${len * 0.3} -10 ${len * 0.7} -14 ${len} -4 C${len * 0.7} 4 ${len * 0.3} 6 0 0 Z`} transform={`rotate(${ang})`} />
      <path d={`M0 0 C${len * 0.3} -10 ${len * 0.7} -14 ${len} -4 C${len * 0.7} 4 ${len * 0.3} 6 0 0 Z`} transform={`rotate(${ang + 118}) scale(1 -1)`} />
    </g>;
  });
  return <svg aria-hidden="true" viewBox="0 0 320 320" className={className} fill="currentColor" style={{ color: "var(--caribe-jungle)", opacity: 0.1 }}>
    <path d="M20 300 C80 230 170 150 300 60 L304 66 C175 158 88 238 26 306 Z" />
    {leaflets}
  </svg>;
}

function SeaFan({ className }: { className?: string }) {
  const branches: string[] = [];
  const grow = (x: number, y: number, a: number, len: number, depth: number) => {
    if (depth === 0 || len < 8) return;
    const x2 = x + Math.cos(a) * len; const y2 = y + Math.sin(a) * len;
    branches.push(`M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`);
    grow(x2, y2, a - 0.32, len * 0.78, depth - 1);
    grow(x2, y2, a + 0.32, len * 0.78, depth - 1);
  };
  grow(200, 400, -Math.PI / 2, 90, 7);
  return <svg aria-hidden="true" viewBox="0 0 400 400" className={className} style={{ color: "var(--caribe-aqua)", opacity: 0.16 }}>
    <path d="M200 400 C60 330 20 190 70 90 C120 20 280 20 330 90 C380 190 340 330 200 400 Z" fill="currentColor" opacity=".35" />
    <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">{branches.map((d, i) => <path key={i} d={d} />)}</g>
  </svg>;
}

function CaribeGallery({ gallery, title, highlight, side, texture }: { gallery: { src: string; alt: string; label?: string }[]; title: string; highlight: string; side: string; texture: DarkTexture }) {
  const layout = [
    "col-span-2 row-span-2",
    "col-span-2",
    "row-span-2",
    "row-span-2",
    "",
    "",
    "col-span-2",
    "",
    "",
  ];
  return <section className="caribe-deep relative overflow-hidden py-20 text-primary-foreground sm:py-28">
    <DarkTextureLayer kind={texture} />
    <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
      <div className="caribe-reveal flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="kicker-text kicker-line uppercase text-accent">Otra mirada</p><h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl"><Highlight text={title} word={highlight} className="hl-on-dark" /></h2></div>
        <p className="max-w-md font-display text-xl font-semibold text-primary-foreground/80 sm:text-2xl">{side}</p>
      </div>
      <div className="mt-12 grid grid-flow-row-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 lg:auto-rows-[230px] lg:grid-cols-4">
        {gallery.map((image, index) => <figure key={image.src} style={{ "--d": `${(index % 4) * 80}ms` } as CSSProperties} className={`caribe-photo reveal-item group relative overflow-hidden ${layout[index] ?? ""}`}>
          <img src={image.src} alt={image.alt} loading="lazy" width={1280} height={960} className="absolute inset-0 size-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <figcaption className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em] sm:bottom-5 sm:left-5 sm:gap-3 sm:text-sm"><span className="font-display text-accent">{String(galleryNumbers[index] ?? index + 1).padStart(2, "0")}</span>{image.label && <><span className="h-px w-5 bg-accent" />{image.label}</>}</figcaption>
        </figure>)}
      </div>
    </div>
  </section>;
}

function JungleCanopy() {
  const leaves = [
    { x: 58, len: 150, rot: 8 }, { x: 66, len: 210, rot: -6 }, { x: 74, len: 170, rot: 12 }, { x: 81, len: 250, rot: -3 },
    { x: 88, len: 190, rot: 9 }, { x: 95, len: 230, rot: -8 }, { x: 102, len: 160, rot: 5 },
  ];
  return <svg aria-hidden="true" viewBox="0 0 100 40" preserveAspectRatio="xMaxYMin slice" className="caribe-fade-down pointer-events-none absolute inset-x-0 top-0 h-56 w-full text-primary-foreground opacity-[.04] sm:h-80 sm:opacity-[.05]">
    {leaves.map((l, i) => { const h = l.len / 8; return <path key={i} transform={`translate(${l.x} 0) rotate(${l.rot})`} d={`M0 -2 C${h * 0.07} ${h * 0.3} ${h * 0.06} ${h * 0.75} 0 ${h} C${-h * 0.06} ${h * 0.75} ${-h * 0.07} ${h * 0.3} 0 -2 Z`} fill="currentColor" className={i % 3 === 0 ? "hidden sm:block" : undefined} />; })}
  </svg>;
}

function CenoteLight() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] sm:h-[26rem]" style={{ maskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)" }}>
    <svg className="absolute inset-0 size-full text-primary-foreground opacity-[.08] sm:opacity-[.11]" style={{ filter: "blur(1.5px)" }} preserveAspectRatio="none">
      <filter id="cenote-caustics" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" result="w" />
        <feComponentTransfer in="w"><feFuncA type="table" tableValues="0 0 0 0.2 1 0.2 0 0 0" /></feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#cenote-caustics)" fill="currentColor" />
    </svg>
    <div className="absolute -top-20 right-[8%] hidden h-[34rem] w-28 rotate-[28deg] bg-gradient-to-b from-primary-foreground/[.11] to-transparent blur-xl sm:block" />
    <div className="absolute -top-20 right-[20%] hidden h-[30rem] w-16 rotate-[28deg] bg-gradient-to-b from-primary-foreground/[.08] to-transparent blur-xl sm:block" />
  </div>;
}


function Highlight({ text, word, className = "" }: { text: string; word?: string | undefined; className?: string }) {
  const at = word ? text.toLowerCase().indexOf(word.toLowerCase()) : -1;
  if (!word || at < 0) return <>{text}</>;
  return <>{text.slice(0, at)}<span className={`hl-accent ${className}`}>{text.slice(at, at + word.length)}</span>{text.slice(at + word.length)}</>;
}

function WordRibbon({ words, caribe, className = "", style }: { words: string[]; caribe: boolean; className?: string; style?: CSSProperties }) {
  const row = (copy: number) => words.map((word, i) => <span key={`${copy}-${word}`} className="flex items-center"><span className={`px-5 font-display text-[2rem] font-bold uppercase leading-none sm:px-8 sm:text-[3.5rem] ${i % 2 ? "marquee-outline" : ""}`}>{word}</span><span className="font-display text-[2rem] text-accent sm:text-[3.5rem]">·</span></span>);
  return <div aria-hidden="true" className={`marquee relative z-10 border-b border-primary-foreground/10 bg-ink py-7 text-primary-foreground sm:py-9 ${caribe ? "caribe-deep" : ""} ${className}`} style={style}>
    <div className="marquee-track"><div className="flex shrink-0">{row(0)}</div><div className="flex shrink-0">{row(1)}</div></div>
  </div>;
}

function useRevealOnScroll(key: string) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal-item"));
    if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { const el = e.target as HTMLElement; el.classList.add("is-in"); io.unobserve(el); window.setTimeout(() => el.classList.remove("reveal-item", "is-in"), 1200); } }), { rootMargin: "0px 0px -8% 0px" });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
  return ref;
}

function DarkTextureLayer({ kind }: { kind: DarkTexture }) {
  if (kind === "dosel") return <JungleCanopy />;
  if (kind === "cenote") return <CenoteLight />;
  if (kind === "bokeh") return <NightBokeh />;
  if (kind === "fuegos") return <Fireworks />;
  if (kind === "bahia-noche") return <DeepVeil />;
  if (kind === "destellos") return <WaterGlints />;
  return <LakeReflections />;
}

function NightBokeh({ src = nightTex }: { src?: string }) {
  // Photo + veil share ONE wrapper mask so neither has its own top edge; photo shifted down so the wheel top sits inside the visible zone.
  const m = "linear-gradient(to bottom, transparent 0%, black 220px, black calc(100% - 110px), transparent 100%)";
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ maskImage: m, WebkitMaskImage: m }}>
    <img src={src} alt="" loading="lazy" decoding="async" width={2000} height={1133} className="absolute inset-0 h-full w-full select-none object-cover object-[center_35%] opacity-20 blur-[12px] md:opacity-[.26] md:blur-[14px]" style={{ mixBlendMode: "screen" }} />
    <div className="absolute inset-0 bg-ink/40" />
  </div>;
}

function Fireworks() {
  // Real fireworks photo, blurred + screen-blended; faded to bottom and dimmed (~0.10) in the central title band.
  const m = "linear-gradient(to bottom, black 0%, black 35%, transparent 100%), linear-gradient(to right, black 0%, black 18%, rgba(0,0,0,.5) 38%, rgba(0,0,0,.5) 62%, black 82%, black 100%)";
  return <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px]" style={{ background: "radial-gradient(60% 100% at 30% 0%, color-mix(in oklab, oklch(0.85 0.14 85) 10%, transparent), transparent 70%), radial-gradient(55% 90% at 75% 0%, color-mix(in oklab, oklch(0.7 0.18 5) 10%, transparent), transparent 70%)" }}>
    <div className="absolute inset-x-0 top-0 h-[260px] sm:h-full" style={{ maskImage: m, WebkitMaskImage: m, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}>
      <img src={fireworksTex} alt="" loading="lazy" decoding="async" width={1600} height={800} className="absolute -top-24 left-0 h-[calc(100%+6rem)] w-1/2 select-none object-cover object-[35%_30%] opacity-10 blur-[10px] sm:opacity-20" style={{ mixBlendMode: "screen" }} />
      <img src={fireworksTex} alt="" loading="lazy" decoding="async" width={1600} height={800} className="absolute -top-24 right-0 h-[calc(100%+6rem)] w-1/2 select-none object-cover object-[68%_60%] opacity-10 blur-[10px] sm:opacity-20" style={{ mixBlendMode: "screen" }} />
    </div>
  </div>;
}

function ParkSilhouette({ className }: { className?: string }) {
  const m = "linear-gradient(to top, black 30%, transparent 100%), linear-gradient(to left, black 45%, transparent 100%)";
  return <div aria-hidden="true" className={className}>
    <img src={slidesTex} alt="" loading="lazy" decoding="async" width={2000} height={1133} className="h-full w-full select-none object-cover" style={{ mixBlendMode: "multiply", opacity: 0.25, filter: "grayscale(.55) sepia(.2) hue-rotate(120deg) brightness(1.15)", maskImage: m, WebkitMaskImage: m, maskComposite: "intersect", WebkitMaskComposite: "source-in" }} />
  </div>;
}

function CoasterPhoto() {
  const v = "linear-gradient(to bottom, transparent 0%, black 20%, black 72%, transparent 100%)";
  const h = "linear-gradient(to right, black 0%, rgba(0,0,0,.6) 22%, transparent 45%)";
  return <div aria-hidden="true" className="pointer-events-none absolute -left-[6%] -top-40 bottom-[230px] z-0 hidden w-[112%] md:block">
    <img src={coasterTex} alt="" loading="lazy" decoding="async" width={1600} height={2000} className="h-full w-full select-none object-cover object-left opacity-12 lg:opacity-25" style={{ mixBlendMode: "multiply", filter: "grayscale(.75) sepia(.35) hue-rotate(-10deg) brightness(1.2) contrast(.9)", maskImage: `${v}, ${h}`, WebkitMaskImage: `${v}, ${h}`, maskComposite: "intersect", WebkitMaskComposite: "source-in" }} />
  </div>;
}

function LakeReflections() {
  const lines = Array.from({ length: 14 }, (_, i) => ({ y: 30 + i * 22, x: 8 + ((i * 37) % 60), w: 18 + ((i * 53) % 30), o: 0.05 + ((i * 7) % 5) * 0.02 }));
  return <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] sm:h-[26rem]" style={{ maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)" }}>
    <div className="absolute inset-x-0 top-0 h-2/3" style={{ background: "radial-gradient(60% 70% at 70% 0%, color-mix(in oklab, oklch(0.68 0.17 48) 22%, transparent), transparent 70%)" }} />
    <svg className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 360" style={{ filter: "blur(1px)" }}>
      {lines.map((l, i) => <rect key={i} x={l.x} y={l.y} width={l.w} height="1.6" rx=".8" fill={i % 3 ? "var(--accent)" : "var(--primary-foreground)"} opacity={l.o} />)}
    </svg>
  </div>;
}

function Constellation() {
  const stars = [
    { x: 170, y: 150, r: 14 }, { x: 70, y: 330, r: 8 }, { x: 150, y: 520, r: 18 }, { x: 60, y: 700, r: 10 }, { x: 140, y: 880, r: 12 }, { x: 90, y: 1010, r: 7 },
  ];
  const star = (r: number) => `M0 ${-r} C${r * 0.15} ${-r * 0.15} ${r * 0.15} ${-r * 0.15} ${r} 0 C${r * 0.15} ${r * 0.15} ${r * 0.15} ${r * 0.15} 0 ${r} C${-r * 0.15} ${r * 0.15} ${-r * 0.15} ${r * 0.15} ${-r} 0 C${-r * 0.15} ${-r * 0.15} ${-r * 0.15} ${-r * 0.15} 0 ${-r} Z`;
  const mask = "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)";
  return <svg aria-hidden="true" viewBox="0 0 220 1100" preserveAspectRatio="xMaxYMid meet" className="deco-drift pointer-events-none absolute bottom-0 right-0 top-0 hidden h-full w-auto translate-x-[40%] xl:block min-[1600px]:translate-x-0" style={{ maskImage: mask, WebkitMaskImage: mask }}>
    <path d={`M200 0 ${stars.map((s) => `L${s.x} ${s.y}`).join(" ")} L160 1100`} fill="none" stroke="var(--accent)" strokeWidth="3" opacity=".4" className="route-line" />
    <g fill="var(--accent)" opacity=".55">{stars.map((s, i) => <path key={i} d={star(s.r)} transform={`translate(${s.x} ${s.y})`} />)}</g>
    <g fill="var(--caribe-jungle)" opacity=".25">{stars.map((s, i) => <circle key={i} cx={s.x + (i % 2 ? 22 : -20)} cy={s.y + 26} r="2.5" />)}</g>
  </svg>;
}

const grain = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .035 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const duskSky = `${grain}, linear-gradient(in oklab to bottom, #FFEBD6 0%, #F7E6D3 14%, #F6D2B8 30%, #EDB5A6 46%, #D99AA3 60%, #C088A0 70%, #A7789A 79%, #8C6690 88%, #6E5486 100%)`;
const nightTop = `${grain}, linear-gradient(in oklab to bottom, #2C2958 0px, #221F4E 120px, var(--ink) 290px)`;
const ribbonSky = `${grain}, linear-gradient(in oklab to bottom, #6E5486 0%, #5A4680 20%, #3F3368 55%, #353060 78%, #2C2958 100%)`;

function CoasterRibbon({ words, wave }: { words: string[]; wave?: boolean }) {
  const measureRef = useRef<SVGTextElement>(null);
  const [cycle, setCycle] = useState(0);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = measureRef.current; if (el) setCycle(el.getComputedTextLength());
  }, [words]);
  const d = wave ? wavePath : "M-200 182 C0 182 150 118 350 118 S650 205 900 196 S1200 124 1400 128 S1700 202 1950 192 S2250 120 2450 124 S2700 172 2850 172";
  const sequence = (copy: number) => words.map((word, i) => <tspan key={`${copy}-${word}`}><tspan className={`coaster-word ${i % 2 ? "coaster-outline" : ""}`} fill={i % 2 ? undefined : "var(--primary-foreground)"}>{word}</tspan><tspan fill="var(--accent)">{"\u2002·\u2002"}</tspan></tspan>);
  const dur = cycle ? Math.min(60, Math.max(40, cycle / 45)) : 50;
  return <div aria-hidden="true" style={{ background: wave ? "transparent" : ribbonSky }} className="relative z-10 hidden h-[200px] overflow-hidden md:block lg:h-[210px] min-[1920px]:h-[240px]">
    <svg viewBox="0 0 2600 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <defs><path id="coaster-rail" d={d} /></defs>
      {wave ? <use href="#coaster-rail" transform="translate(0 14)" fill="none" stroke="var(--accent)" strokeWidth="2" opacity=".9" /> : <>
      <use href="#coaster-rail" fill="none" stroke="var(--accent)" strokeWidth="12" strokeDasharray="2 22" opacity=".45" />
      <use href="#coaster-rail" transform="translate(0 -5)" fill="none" stroke="var(--accent)" strokeWidth="1.6" opacity=".85" />
      <use href="#coaster-rail" transform="translate(0 5)" fill="none" stroke="var(--accent)" strokeWidth="1.6" opacity=".85" /></>}
      <text ref={measureRef} fontSize="50" letterSpacing="1" visibility="hidden" x="0" y="-100">{sequence(9)}</text>
      <text fontSize="50" dy="-16" letterSpacing="1">
        <textPath href="#coaster-rail" startOffset="0">
          {animate && cycle > 0 && <animate attributeName="startOffset" from="0" to={-cycle} dur={`${dur}s`} repeatCount="indefinite" />}
          {sequence(0)}{sequence(1)}{sequence(2)}{sequence(3)}
        </textPath>
      </text>
    </svg>
  </div>;
}

// Acapulco: gentle sine wave (period 600, amplitude 24) for the ribbon rail.
const wavePath = (() => { let p = "M-300 140"; for (let x = -300; x < 2900; x += 300) p += ` Q${x + 150} ${(x / 300) % 2 === 0 ? 116 : 164} ${x + 300} 140`; return p; })();
// Acapulco: one continuous base from "La idea" to the end of the night section.
const bayBase = `${grain}, linear-gradient(in oklab to bottom, #FBF3E8 0%, #F2F4EC 8%, #E6F5F2 16%, #DDF2EF 24%, #D4EFEC 32%, #B2E1DD 38%, #8FD3CF 43%, #5DA1C0 48%, #2A6FB0 53%, #1E5290 58%, #12356A 64%, #14274F 74%, #161944 84%, #161944 100%)`;

/** Split shot (above/below water). Waterline sits at 30% of the photo height. */
function SplitPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; clip: number; mobile: boolean } | null>(null);
  useEffect(() => {
    const el = ref.current; const zone = el?.parentElement; if (!el || !zone) return;
    const update = () => {
      const cards = zone.querySelector("[data-aca-cards]"); if (!cards) return;
      const mobile = window.innerWidth < 768;
      const cardsBottom = cards.getBoundingClientRect().bottom - zone.getBoundingClientRect().top;
      const waterline = cardsBottom + (mobile ? 24 : 90);
      const w = zone.clientWidth;
      setPos({ top: waterline - 0.45 * w, clip: mobile ? waterline - 10 : 0, mobile });
    };
    update();
    const ro = new ResizeObserver(update); ro.observe(zone);
    return () => ro.disconnect();
  }, []);
  // Opacity zones in photo coordinates (waterline = 30%).
  const m = "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.24) 6%, rgba(0,0,0,.24) 28%, rgba(0,0,0,.45) 32%, rgba(0,0,0,.8) 40%, black 50%, black 90%, transparent 100%)";
  return <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden" style={{ top: pos?.clip ?? 0, maskImage: "linear-gradient(to bottom, transparent 0px, black 60px, black calc(100% - 120px), transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, black 60px, black calc(100% - 120px), transparent 100%)" }}>
    {pos && <img src={splitImg} alt="" decoding="async" width={1280} height={1920} className="absolute left-0 w-full max-w-none select-none" style={{ top: pos.top - pos.clip, height: "auto", opacity: pos.mobile ? 0.7 : 1, filter: "blur(.6px)", maskImage: pos.mobile ? "linear-gradient(to bottom, transparent 30%, black 38%, black 90%, transparent 100%)" : m, WebkitMaskImage: pos.mobile ? "linear-gradient(to bottom, transparent 30%, black 38%, black 90%, transparent 100%)" : m }} />}
  </div>;
}

function DeepVeil() {
  const m = "linear-gradient(to bottom, transparent 0px, black 220px, black calc(100% - 260px), transparent 100%)";
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ background: "rgba(22,25,68,.36)", maskImage: m, WebkitMaskImage: m }} />;
}

function FoamPhoto() {
  const m = "linear-gradient(to top, black 25%, transparent 100%), linear-gradient(to left, black 35%, transparent 100%)";
  return <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-[60%] w-1/2 lg:block">
    <img src={espumaTex} alt="" loading="lazy" decoding="async" width={1600} height={1024} className="h-full w-full select-none object-cover" style={{ mixBlendMode: "multiply", opacity: 0.3, filter: "grayscale(.7) sepia(.15) hue-rotate(130deg) brightness(1.15)", maskImage: m, WebkitMaskImage: m, maskComposite: "intersect", WebkitMaskComposite: "source-in" }} />
  </div>;
}

function WaterGlints() {
  const m = "linear-gradient(to bottom, black 0%, black 30%, transparent 100%), linear-gradient(to right, black 0%, black 15%, rgba(0,0,0,.5) 35%, rgba(0,0,0,.5) 65%, black 85%, black 100%)";
  return <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[260px] sm:h-[480px]" style={{ background: "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, #2A6FB0 22%, transparent), transparent 70%)", maskImage: m, WebkitMaskImage: m, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}>
    <img src={glintsTex} alt="" loading="lazy" decoding="async" width={1600} height={800} className="absolute inset-0 h-full w-full select-none object-cover opacity-10 blur-[6px] sm:opacity-20" style={{ mixBlendMode: "screen" }} />
  </div>;
}

/** Acapulco ribbon: words float slowly like buoys over three faster swell lines. */
function OceanRibbon({ words }: { words: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dur, setDur] = useState(90);
  useEffect(() => {
    const el = ref.current; const t = trackRef.current; if (!el || !t) return;
    setDur(Math.max(60, t.scrollWidth / 2 / 34));
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-paused", !e?.isIntersecting));
    io.observe(el); return () => io.disconnect();
  }, [words]);
  const seq = (c: number) => words.map((w, i) => <span key={`${c}-${w}`} className="inline-flex items-center"><span className={`aca-buoy coaster-word px-1 text-[30px] md:text-[42px] min-[1920px]:text-[48px] ${i % 2 ? "aca-outline" : "text-primary-foreground"}`} style={{ animationDelay: `${-((i * 1.37 + c * .6) % 5)}s`, animationDuration: `${4.6 + (i % 3) * .9}s` }}>{w}</span><span className="px-3 text-accent md:text-[32px]">·</span></span>);
  const wave = (period: number, amp: number) => { let p = `M0 ${amp + 2}`; for (let x = 0; x < 4800; x += period / 2) p += ` Q${x + period / 4} ${(x / (period / 2)) % 2 === 0 ? 2 - amp + amp : amp * 2 + 2 - 0} ${x + period / 2} ${amp + 2}`; return p; };
  const line = (period: number, amp: number, stroke: string, w: number, speed: number, cls = "") => <div className={`aca-swell absolute left-0 w-[4800px] ${cls}`} style={{ height: amp * 2 + 4, animationDuration: `${(2400 / (34 * speed)).toFixed(1)}s` }}><svg width="4800" height={amp * 2 + 4} className="block"><path d={wave(period, amp)} fill="none" stroke={stroke} strokeWidth={w} /></svg></div>;
  return <div ref={ref} aria-hidden="true" className="relative z-10 h-[150px] overflow-hidden md:h-[200px] lg:h-[210px] min-[1920px]:h-[240px]">
    <div ref={trackRef} className="aca-drift absolute left-0 top-[18%] flex w-max whitespace-nowrap" style={{ animationDuration: `${dur}s` }}>{seq(0)}{seq(1)}</div>
    <div className="absolute inset-x-0 top-[56%] md:top-[54%]">
      <div className="relative hidden md:block">{line(600, 22, "var(--accent)", 2, 1.4, "top-0")}{line(480, 16, "rgba(255,255,255,.35)", 1.5, 1.7, "top-[12px]")}{line(400, 12, "rgba(143,211,207,.3)", 1.5, 2, "top-[26px]")}</div>
      <div className="relative md:hidden">{line(400, 10, "var(--accent)", 2, 1.4, "top-0")}</div>
    </div>
  </div>;
}

/** Acapulco: subtle bubbles rising from the reef corners. */
function Bubbles() {
  const list = [[4, 8, 12, 0], [11, 5, 15, 3], [17, 11, 17, 7], [7, 6, 13, 10], [2, 4, 16, 5], [14, 9, 11, 12], [84, 7, 14, 2], [91, 12, 16, 6], [88, 5, 12, 9], [95, 9, 18, 1], [80, 4, 13, 11], [97, 6, 15, 8]];
  return <div aria-hidden="true" className="aca-bubbles pointer-events-none absolute inset-x-0 bottom-[40px] z-[5] h-[120px] md:bottom-[90px] md:h-[320px] overflow-hidden">
    {list.map(([l, s, d, dl], i) => <span key={i} className={`aca-bubble ${i % 6 > 1 ? "max-md:hidden" : ""}`} style={{ left: `${l}%`, width: s, height: s, animationDuration: `${d}s`, animationDelay: `-${dl}s` }} />)}
  </div>;
}
