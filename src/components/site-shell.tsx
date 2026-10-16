import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Facebook, Instagram, Menu, MessageCircle, Music2, Plane, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/cielito-logo-mark.jpg";
import { HeaderDropdown } from "@/components/header-dropdown";
import { WHATSAPP_URL } from "@/lib/contact-request";

type NavItem = { label: string; href: string; children?: ReadonlyArray<readonly [string, string]> };

const nav: ReadonlyArray<NavItem> = [
  { label: "Viajes", href: "/viajes", children: [["Paquetes", "/viajes"], ["Tours", "/tours"], ["Cruceros", "/cruceros"], ["Disney", "/disney"]] },
  { label: "Servicios", href: "/servicios", children: [["Vuelos", "/servicios/vuelos"], ["Hospedaje", "/servicios/hospedaje"], ["Autos", "/servicios/renta-de-autos"]] },
  { label: "Destinos", href: "/destinos" },
  { label: "Grupos", href: "/grupos", children: [["Empresas", "/grupos/empresas"], ["Deportivos", "/grupos/deportivos"]] },
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
      <div className="header-signature">
        <div className="header-signature-inner">
          <span className="header-signature-message"><Plane aria-hidden="true" strokeWidth={1.5} />Viajar bien, cambia todo</span>
          <span className="header-signature-brand">EXPERIENCIAS QUE CONECTAN</span>
          <div className="header-signature-socials" aria-label="Redes sociales">
            <span className="header-signature-social" data-pending="true" role="img" aria-label="Instagram: enlace oficial pendiente" title="Instagram: enlace oficial pendiente"><Instagram aria-hidden="true" strokeWidth={1.5} /></span>
            <a className="header-signature-social" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp"><MessageCircle aria-hidden="true" strokeWidth={1.5} /></a>
            <span className="header-signature-social" data-pending="true" role="img" aria-label="TikTok: enlace oficial pendiente" title="TikTok: enlace oficial pendiente"><Music2 aria-hidden="true" strokeWidth={1.5} /></span>
          </div>
        </div>
      </div>
      <div className={`header-main mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 transition-[height] duration-300 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-7 lg:px-8 ${scrolled ? "h-16" : "h-[4.75rem] lg:h-[5.5rem]"}`}>
        <Link to="/" aria-label="Cielito Tours, inicio" className="min-w-0 justify-self-start"><img src={logoAsset} alt="Cielito Tours — Vuela, viaja y vive" className={`w-auto object-contain transition-[height] duration-300 ${scrolled ? "h-12 lg:h-16" : "h-14 lg:h-20"}`} /></Link>
        <nav aria-label="Navegación principal" className="header-navigation hidden items-center gap-7 lg:flex" onKeyDown={(event) => {
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
    <footer className="bg-ink text-primary-foreground">
      <div aria-hidden="true" className="papel-picado pointer-events-none" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-8 md:pt-14 lg:px-8">
        <div className="text-center md:text-left"><img src={logoAsset} alt="Cielito Tours" loading="lazy" className="mx-auto h-auto w-full max-w-[330px] object-contain md:mx-0 md:object-left" /><p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-primary-foreground/70 md:mx-0">Vuelos, hospedaje, experiencias y grupos en México y el mundo, con un equipo que te acompaña.</p><p className="mt-5 font-display text-2xl font-semibold text-accent">Vuela, viaja y vive…</p><div className="mt-7 flex justify-center gap-3 md:justify-start"><a href="/contacto" aria-label="Instagram" className="grid size-11 place-items-center border border-primary-foreground/20 transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:size-10"><Instagram className="size-4" /></a><a href="/contacto" aria-label="Facebook" className="grid size-11 place-items-center border border-primary-foreground/20 transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:size-10"><Facebook className="size-4" /></a><a href="/contacto" aria-label="TikTok" className="grid size-11 place-items-center border border-primary-foreground/20 transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:size-10"><Music2 className="size-4" /></a></div></div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:contents">
          {footerColumns.map((col) => <div key={col.title}><h2 className="footer-heading font-extrabold uppercase tracking-[.18em] text-accent">{col.title}</h2><ul className="mt-3 md:mt-4 md:space-y-1.5">{col.links.map(([label, href]) => <li key={href + label}><a className="footer-link" href={href}><span>{label}</span></a></li>)}</ul></div>)}
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-5 text-center text-sm text-primary-foreground/75 md:flex-row md:justify-between md:text-left lg:px-8">
          <p>© 2026 Cielito Tours. Todo tu viaje, con un mismo equipo.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2">{legalLinks.map(([label, href], i) => <span key={href} className="flex items-center gap-x-2">{i > 0 && <span aria-hidden="true">·</span>}<a href={href} className="inline-flex min-h-11 items-center hover:text-primary-foreground md:min-h-0">{label}</a></span>)}</p>
        </div>
      </div>
    </footer>
  </div>;
}