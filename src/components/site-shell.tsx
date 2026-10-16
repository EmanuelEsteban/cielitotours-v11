import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/cielito-logo-mark.jpg";
import { HeaderDropdown } from "@/components/header-dropdown";

type NavItem = { label: string; href: string; children?: ReadonlyArray<readonly [string, string]> };

const nav: ReadonlyArray<NavItem> = [
  { label: "Viajes", href: "/viajes", children: [["Paquetes", "/viajes"], ["Tours", "/tours"], ["Cruceros", "/cruceros"], ["Disney", "/disney"]] },
  { label: "Servicios", href: "/servicios", children: [["Vuelos", "/servicios/vuelos"], ["Hospedaje", "/servicios/hospedaje"], ["Autos", "/servicios/renta-de-autos"]] },
  { label: "Grupos", href: "/grupos", children: [["Empresas", "/grupos/empresas"], ["Deportivos", "/grupos/deportivos"]] },
  { label: "Destinos", href: "/destinos" },
  { label: "Nosotros", href: "/nosotros" },
];

const footerColumns = [
  { title: "Viajes", links: [["Paquetes", "/viajes"], ["Tours", "/tours"], ["Cruceros", "/cruceros"], ["Disney", "/disney"], ["Destinos", "/destinos"]] },
  { title: "Servicios", links: [["Vuelos", "/servicios/vuelos"], ["Hospedaje", "/servicios/hospedaje"], ["Renta de autos", "/servicios/renta-de-autos"], ["Grupos", "/grupos"]] },
  { title: "Cielito", links: [["Nosotros", "/nosotros"], ["Contacto", "/contacto"], ["Preguntas frecuentes", "/preguntas-frecuentes"]] },
] as const;

const legalLinks = [["Privacidad", "/privacidad"], ["Términos", "/terminos"], ["Políticas de cancelación", "/politicas-de-cancelacion"]] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<string | null>(null);
  const pathname = useLocation({ select: (location) => location.pathname });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!open) return;
    firstMobileLinkRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <div className="min-h-screen overflow-x-clip bg-background text-foreground">
    <header className={`site-header sticky top-0 z-50 border-b border-primary-foreground/10 bg-ink/98 text-primary-foreground transition-shadow duration-300 ${scrolled ? "is-scrolled" : ""}`}>
      <div className={`header-main mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 transition-[height] duration-300 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-[18px] lg:px-8 ${scrolled ? "h-16" : "h-[4.75rem] lg:h-[5.5rem]"}`}>
        <Link to="/" aria-label="Cielito Tours, inicio" className="min-w-0 justify-self-start"><img src={logoAsset} alt="Cielito Tours — Vuela, viaja y vive" className={`w-auto object-contain transition-[height] duration-300 ${scrolled ? "h-12 lg:h-16" : "h-14 lg:h-20"}`} /></Link>
        <nav aria-label="Navegación principal" className="header-navigation hidden items-center gap-2.5 lg:flex" onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          const group = (event.target as HTMLElement).closest(".header-nav-item");
          group?.querySelector<HTMLAnchorElement>(".header-nav-link")?.focus();
          setDesktopMenu(null);
        }}>
          {nav.map((item) => <div className="header-nav-item relative" key={item.label} data-open={desktopMenu === item.label} data-active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            onMouseEnter={() => setDesktopMenu(item.children ? item.label : null)}
            onMouseLeave={(event) => { if (!event.currentTarget.contains(document.activeElement)) setDesktopMenu(null); }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDesktopMenu(null); }}>
            <a href={item.href} className="header-nav-link" aria-current={pathname === item.href ? "page" : undefined} onFocus={() => setDesktopMenu(item.children ? item.label : null)}>{item.label}</a>
            {item.children && <Button variant="ghost" size="icon" className="header-menu-toggle" aria-label={`Opciones de ${item.label}`} aria-expanded={desktopMenu === item.label} aria-controls={`header-menu-${item.label}`} onClick={() => setDesktopMenu(desktopMenu === item.label ? null : item.label)}><ChevronDown aria-hidden="true" /></Button>}
            {item.children && <HeaderDropdown id={`header-menu-${item.label}`} open={desktopMenu === item.label} pathname={pathname} children={item.children} />}
          </div>)}
          <span className="header-quote-divider" aria-hidden="true" />
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="header-quote hidden sm:inline-flex"><Link to="/cotizar">Cotizar<ArrowRight aria-hidden="true" strokeWidth={1.5} /></Link></Button>
          <Button ref={menuButtonRef} variant="ghost" size="icon" className="header-mobile-toggle size-11 shrink-0 lg:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && <nav id="mobile-navigation" className="header-mobile-panel px-5 py-5 lg:hidden" aria-label="Navegación móvil">
        <div className="grid gap-0">{[...nav, { label: "Contacto", href: "/contacto" }].map((item, index) => <a ref={index === 0 ? firstMobileLinkRef : undefined} key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)} className="header-mobile-link flex min-h-11 items-center py-3.5">{item.label}</a>)}</div>
        <Button asChild className="header-quote mt-5 w-full"><Link to="/cotizar" onClick={() => setOpen(false)}>Cotizar</Link></Button>
      </nav>}
    </header>
    <main>{children}</main>
    <footer className="site-footer">
      <div aria-hidden="true" className="footer-top-edge" />
      <svg className="footer-cartography" aria-hidden="true" viewBox="0 0 1440 700" preserveAspectRatio="none">
        <defs><linearGradient id="footer-route-fade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity="0" /><stop offset=".5" stopColor="currentColor" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
        <path d="M 1130 -80 C 1220 15 1390 -15 1500 150" />
        <path d="M 1260 -70 C 1260 20 1460 70 1490 270" />
        <path d="M -120 490 C -15 540 30 700 300 750" />
      </svg>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8 md:pt-14 lg:px-8">
        <div className="text-center md:text-left"><img src={logoAsset} alt="Cielito Tours" loading="lazy" className="mx-auto h-auto w-full max-w-[330px] object-contain md:mx-0 md:object-left" /><p className="footer-description mx-auto mt-6 max-w-sm md:mx-0">Vuelos, hospedaje, experiencias y grupos en México y el mundo, con un equipo que te acompaña.</p><p className="footer-slogan mt-5">Vuela, viaja y vive…</p></div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:contents">
          {footerColumns.map((col) => <div key={col.title}><h2 className="footer-heading">{col.title}</h2><ul className="mt-3 md:mt-4 md:space-y-1.5">{col.links.map(([label, href]) => <li key={href + label}><a className="footer-link" href={href}><span>{label}</span></a></li>)}</ul></div>)}
        </div>
      </div>
      <div className="footer-legal">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-5 text-center text-sm md:flex-row md:justify-between md:text-left lg:px-8">
          <p>© 2026 Cielito Tours. Todo tu viaje, con un mismo equipo.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2">{legalLinks.map(([label, href], i) => <span key={href} className="flex items-center gap-x-2">{i > 0 && <span aria-hidden="true">·</span>}<a href={href} className="inline-flex min-h-11 items-center footer-legal-link md:min-h-0">{label}</a></span>)}</p>
        </div>
      </div>
    </footer>
  </div>;
}