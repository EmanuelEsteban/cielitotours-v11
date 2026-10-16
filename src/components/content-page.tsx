import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imagery } from "@/lib/site-data";
import { SiteShell } from "@/components/site-shell";

export function ContentPage({ eyebrow, title, description, image }: { eyebrow: string; title: string; description: string; image?: keyof typeof imagery }) {
  return <SiteShell>
    <section className={image ? "relative min-h-[68vh] overflow-hidden" : "bg-secondary py-24 md:py-32"}>
      {image && <><img src={imagery[image]} alt="Inspiración de viaje con Cielito Tours" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-hero-overlay" /></>}
      <div className={`relative mx-auto max-w-7xl px-5 lg:px-8 ${image ? "flex min-h-[68vh] items-end pb-16 text-primary-foreground" : ""}`}>
        <div className="max-w-3xl"><p className="mb-5 text-sm font-bold uppercase tracking-widest text-primary">{eyebrow}</p><h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 opacity-85">{description}</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/cotizar">Planear mi viaje <ArrowRight /></Link></Button><Button asChild size="lg" variant="outline"><Link to="/contacto"><MessageCircle /> Hablar con un asesor</Link></Button></div>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-12 md:grid-cols-3"><div><p className="section-kicker">01 — Cuéntanos</p><h2 className="mt-3 font-display text-3xl font-bold">Partimos de tu idea</h2></div><div className="space-y-4 text-muted-foreground"><p className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-primary" />Revisamos tus fechas, prioridades y presupuesto.</p><p className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-primary" />Un asesor integra las piezas que necesitas.</p></div><div className="space-y-4 text-muted-foreground"><p className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-primary" />Recibes opciones claras para decidir.</p><p className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-primary" />La disponibilidad se confirma antes de reservar.</p></div></div></section>
  </SiteShell>;
}