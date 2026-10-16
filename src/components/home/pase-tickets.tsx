import { forwardRef, type CSSProperties } from "react";
import { ArrowRight, Car, Compass, Sparkles } from "lucide-react";
import { imagery } from "@/lib/site-data";
import paseDisney from "@/assets/pase-disney.webp";
import paseTours from "@/assets/pase-tours.webp";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { cn } from "@/lib/utils";
import { HandKicker } from "./hand-kicker";

/** Boarding-pass style secondary accesses (Home · Servicios). */
const passes = [
  { name: "Autos", note: "Muévete a tu ritmo", href: "/servicios/renta-de-autos", image: imagery.cars, icon: Car, glow: "var(--atlas-aqua)" },
  { name: "Disney", note: "Planeación para toda la familia", href: "/cotizar", image: paseDisney, icon: Sparkles, glow: "var(--primary)" },
  { name: "Tours", note: "Experiencias por el mundo", href: "/cotizar", image: paseTours, icon: Compass, glow: "var(--accent)" },
] as const;

export const PaseTickets = forwardRef<HTMLDivElement, { arrived?: boolean }>(function PaseTickets({ arrived }, ref) {
  return <div className="mt-14">
    <PaseKicker />
    <div ref={ref} className="pase-row mt-6">
      {passes.map((p, i) => {
        const Icon = p.icon;
        return <Reveal key={p.name} variant="clip" delay={i * 120} className="pase-cell">
          <a href={p.href} aria-label={`${p.name}: ${p.note}`} className={cn("pase", i === 0 && arrived && "is-arrived")} style={{ "--pase-glow": p.glow } as CSSProperties}>
            <TiltCard max={1.5} className="pase-ticket">
              <div className="pase-media">
                <div className="ruta-zoom absolute inset-0 overflow-hidden">
                  <img src={p.image} alt="" loading="lazy" className="pase-photo ruta-graded size-full object-cover object-center" />
                </div>
                <div className="ruta-card-grain absolute inset-0" />
                <div className="pase-media-shade absolute inset-0" />
                <span className="pase-icon"><Icon className="size-4 text-accent" /></span>
              </div>
              <svg aria-hidden="true" className="pase-perf" width="2" height="100%" preserveAspectRatio="none"><line x1="1" y1="6" x2="1" y2="100%" /></svg>
              <div className="pase-body">
                <div className="ruta-card-grain absolute inset-0" />
                <span aria-hidden="true" className="pase-num">{String(i + 7).padStart(2, "0")}</span>
                <div className="pase-text relative min-w-0 pr-12 sm:pr-14">
                  <h3 className="pase-title">{p.name}</h3>
                  <p className="pase-note">{p.note}</p>
                </div>
                <span className="pase-arrow"><ArrowRight className="size-5" /></span>
              </div>
              <span aria-hidden="true" className="pase-sweep" />
            </TiltCard>
          </a>
        </Reveal>;
      })}
    </div>
  </div>;
});

function PaseKicker() {
  return <HandKicker main="Más formas de viajar" hand="más destinos" />;
}
