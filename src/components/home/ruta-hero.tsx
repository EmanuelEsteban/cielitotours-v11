import { useEffect, useRef } from "react";
import { BedDouble, BriefcaseBusiness, Map, Plane, Ship, Trophy } from "lucide-react";
import { imagery } from "@/lib/site-data";
import { Reveal, TitleLines } from "@/components/motion/reveal";
import { ScrollRoute } from "@/components/motion/scroll-route";
import { isDesktop, prefersReducedMotion } from "@/components/motion/tokens";

export const heroAccesses = [
  { name: "Vuelos", href: "/servicios/vuelos", icon: Plane },
  { name: "Hospedaje", href: "/servicios/hospedaje", icon: BedDouble },
  { name: "Paquetes", href: "/viajes", icon: Map },
  { name: "Cruceros", href: "/cruceros", icon: Ship },
  { name: "Empresas", href: "/grupos/empresas", icon: BriefcaseBusiness },
  { name: "Deportivos", href: "/grupos/deportivos", icon: Trophy },
] as const;

/** Hero route: left 60% only, exits through the paper strip at x≈57.5%. */
export const heroRouteEndX = 0.575;
const buildHeroRoute = ({ w, h }: { w: number; h: number }) => {
  if (w < 768) return `M ${w * 0.08} ${h * 0.07} Q ${w * 0.5} ${h * 0.005} ${w * 0.92} ${h * 0.06}`;
  return `M -30 ${h * 0.34} C ${w * 0.14} ${h * 0.08}, ${w * 0.36} ${h * 0.03}, ${w * 0.5} ${h * 0.14} S ${w * 0.6} ${h * 0.42}, ${w * 0.56} ${h * 0.6} S ${w * 0.57} ${h * 0.86}, ${w * heroRouteEndX} ${h + 12}`;
};

export function RutaHero() {
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = hero.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!isDesktop()) { el.style.setProperty("--hp", "0"); return; }
      const p = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight));
      el.style.setProperty("--hp", p.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, []);

  return <section ref={hero} className="relative flex min-h-[calc(100svh-4.75rem)] flex-col justify-center overflow-hidden bg-ink lg:min-h-[calc(100svh-5.5rem)]">
    <div className="ruta-hero-media absolute inset-0">
      <img src={imagery.hero} alt="Pareja contemplando la costa del Caribe mexicano" width={1920} height={1200} className="ruta-hero-img absolute inset-0 size-full object-cover object-[68%_center] md:object-center" fetchPriority="high" />
    </div>
    <div className="absolute inset-0 bg-hero-overlay" />
    <div className="ruta-hero-dim absolute inset-0 bg-ink" />
    <ScrollRoute mode="time" tone="dark" duration={1800} delay={300} loopMs={14000} build={buildHeroRoute} className="z-0" planeClassName="z-0" gradient={({ w }) => ({ x1: 0, x2: w * 0.6, stops: [[0, 0.75], [0.3, 0.6], [0.6, 0.45], [0.85, 0.5], [1, 0.8]] })} />

    <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 pb-6 pt-12 text-primary-foreground sm:py-14 lg:px-8">
      <div className="ruta-hero-text max-w-4xl">
        <p className="mb-5 flex w-fit items-center gap-3 kicker-text font-extrabold uppercase tracking-[.18em] text-accent"><span aria-hidden="true" className="ruta-kicker-line" />Agencia integral de viajes<span aria-hidden="true" className="ruta-kicker-line" /></p>
        <TitleLines as="h1" delay={150} stagger={120} className="max-w-4xl font-display text-[clamp(2.625rem,11.5vw,3.125rem)] font-extrabold uppercase leading-[.96] sm:text-[clamp(2.6rem,8.4vw,6.2rem)] sm:leading-[.94]" lines={["Tu viaje completo", <span key="a" className="text-accent">empieza aquí.</span>]} />
        <Reveal delay={450}><p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/85 sm:text-lg sm:leading-8">Vuelos, hospedaje, autos, cruceros, paquetes y experiencias en México y el mundo, con un equipo que te acompaña.</p></Reveal>
        <Reveal delay={550}><p className="mt-5 font-display text-xl font-semibold text-primary-foreground/85 sm:text-2xl">Vuela, viaja y vive…</p></Reveal>
      </div>
    </div>

    <nav aria-label="Accesos rápidos" className="relative z-10 mx-auto mb-9 mt-4 w-full max-w-7xl sm:mt-8 md:px-6 lg:px-8">
      <ul className="ruta-glass-track scrollbar-hidden flex snap-x snap-mandatory gap-2 overflow-x-auto px-6 md:grid md:grid-cols-6 md:gap-0 md:overflow-visible md:px-2 md:py-2">
        {heroAccesses.map(({ name, href, icon: Icon }, i) => <li key={name} className="ruta-access shrink-0 snap-start" style={{ "--i": i } as React.CSSProperties}>
          <a href={href} className="ruta-access-link ruta-glass flex min-h-11 items-center gap-2.5 px-4 py-2.5 text-[17px] font-semibold text-primary-foreground md:justify-center md:border-0 md:bg-transparent md:py-3 md:backdrop-blur-none lg:text-lg">
            <Icon className="size-5 shrink-0" strokeWidth={1.75} /><span className="ruta-access-label whitespace-nowrap">{name}</span>
          </a>
        </li>)}
        <li aria-hidden="true" className="w-3 shrink-0 md:hidden" />
      </ul>
    </nav>
    <div aria-hidden="true" className="paper-edge absolute inset-x-0 bottom-0 z-10 h-3" />
  </section>;
}
