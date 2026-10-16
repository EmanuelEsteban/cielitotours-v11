/**
 * Destination theme system for /viajes/$slug.
 * Each destination is defined by content (travel-ideas.ts) + a theme (here).
 * Palette values live in src/styles.css under `.theme-<id>` as CSS variables.
 */
export type MomentVariant = "cinta-recta" | "cinta-montana-rusa" | "cinta-ola";
export type LeftDecoration = "ceiba" | "montana-rusa" | "veleros";
export type RightDecoration = "sendero" | "constelacion" | "ninguna";
export type ServicesDecoration = "abanico-de-mar" | "parque" | "espuma";
export type DarkTexture = "dosel" | "cenote" | "bokeh" | "lago" | "fuegos" | "bahia-noche" | "destellos";

export type DestinationTheme = {
  /** CSS class suffix: `.theme-<id>` defines the palette. */
  id: "caribe" | "orlando" | "acapulco";
  /** Giant word + complement in "La idea" (e.g. PLAYA / Y NATURALEZA). */
  idea: { giant: string; rest?: string };
  /** Giant word in "Lo que podrías ___". */
  experienceWord: string;
  /** Centered dark section title + highlighted words. */
  forms: { title: string; highlight: string };
  /** Gallery title, highlight and right-side phrase. */
  gallery: { title: string; highlight: string; side: string };
  /** Dynamic moment between sections. */
  moment: { variant: MomentVariant; words: string[] };
  decorations: { left: LeftDecoration; right: RightDecoration; services: ServicesDecoration; formsTexture: DarkTexture; galleryTexture: DarkTexture };
};

export const destinationThemes: Record<string, DestinationTheme> = {
  "riviera-maya": {
    id: "caribe",
    idea: { giant: "Playa", rest: "y naturaleza" },
    experienceWord: "Vivir",
    forms: { title: "Tu viaje puede tomar muchas formas.", highlight: "muchas formas" },
    gallery: { title: "Imagina la atmósfera.", highlight: "atmósfera", side: "Así se siente la Riviera Maya." },
    moment: { variant: "cinta-recta", words: ["Cenotes", "Selva", "Caribe", "Tulum", "Arrecife", "Sabores", "Cultura maya"] },
    decorations: { left: "ceiba", right: "sendero", services: "abanico-de-mar", formsTexture: "dosel", galleryTexture: "cenote" },
  },
  acapulco: {
    id: "acapulco",
    idea: { giant: "Bahía", rest: "y leyenda" },
    experienceWord: "Celebrar",
    forms: { title: "Tu viaje puede ser un clásico.", highlight: "clásico" },
    gallery: { title: "Imagina la bahía.", highlight: "bahía", side: "Así se siente Acapulco." },
    moment: { variant: "cinta-ola", words: ["Bahía", "Clavados", "Atardecer", "Noche", "Pozole", "La Roqueta", "Pie de la Cuesta"] },
    decorations: { left: "veleros", right: "ninguna", services: "espuma", formsTexture: "bahia-noche", galleryTexture: "destellos" },
  },
  orlando: {
    id: "orlando",
    idea: { giant: "Parques", rest: "y familia" },
    experienceWord: "Disfrutar",
    forms: { title: "Tu viaje puede tener mil emociones.", highlight: "mil emociones" },
    gallery: { title: "Imagina la diversión.", highlight: "diversión", side: "Así se siente Orlando." },
    moment: { variant: "cinta-montana-rusa", words: ["Parques", "Familia", "Montañas rusas", "Sol", "Compras", "Espacio", "Lagos"] },
    decorations: { left: "montana-rusa", right: "constelacion", services: "parque", formsTexture: "bokeh", galleryTexture: "fuegos" },
  },
};

export function getDestinationTheme(slug: string): DestinationTheme | undefined {
  return destinationThemes[slug];
}
