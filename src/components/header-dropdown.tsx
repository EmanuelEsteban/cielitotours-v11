import { ArrowRight, Building2, CarFront, Castle, Compass, Hotel, Plane, Ship, Ticket, Trophy, type LucideIcon } from "lucide-react";
import { useState } from "react";

const optionIcons: Record<string, LucideIcon> = {
  Paquetes: Ticket, Tours: Compass, Cruceros: Ship, Disney: Castle,
  Vuelos: Plane, Hospedaje: Hotel, Autos: CarFront, Empresas: Building2, Deportivos: Trophy,
};

export function HeaderDropdown({ id, open, children, pathname }: {
  id: string; open: boolean; children: ReadonlyArray<readonly [string, string]>; pathname: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  return <div id={id} className="header-dropdown" inert={!open}>
    <div className="header-dropdown-options" onMouseLeave={(event) => {
      const focused = event.currentTarget.querySelector<HTMLAnchorElement>(":focus");
      setActive(focused ? Number(focused.dataset.index) : null);
    }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActive(null); }}>
      <span aria-hidden="true" className={`header-selection-marker marker-${active ?? 0}`} data-visible={active !== null && open} />
      {children.map(([label, href], index) => {
        const OptionIcon = optionIcons[label] ?? Compass;
        return <a key={href} href={href} data-index={index} data-highlighted={active === index}
          aria-current={pathname === href ? "page" : undefined} className="header-dropdown-link"
          onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)}>
          <OptionIcon className="header-option-icon" aria-hidden="true" strokeWidth={1.5} />
          <span>{label}</span><ArrowRight className="header-option-arrow" aria-hidden="true" strokeWidth={1.5} />
        </a>;
      })}
    </div>
  </div>;
}