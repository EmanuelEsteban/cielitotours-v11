import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";

export function SimplePage({ title, intro, children }: { title: string; intro: string; children?: ReactNode }) {
  return <SiteShell><section className="bg-secondary py-20"><div className="mx-auto max-w-4xl px-5 lg:px-8"><p className="section-kicker">Cielito Tours</p><h1 className="mt-4 font-display text-5xl font-bold text-ink md:text-6xl">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{intro}</p></div></section><section className="mx-auto max-w-4xl px-5 py-16 lg:px-8"><div className="space-y-6 leading-7 text-muted-foreground">{children}</div><Button asChild variant="outline" className="mt-10"><Link to="/"><ArrowLeft /> Volver al inicio</Link></Button></section></SiteShell>;
}