import acapulcoHeroImage from "@/assets/acapulco-hero.webp";
import acapulcoClavadosImage from "@/assets/acapulco-clavados.webp";
import acapulcoBahiaImage from "@/assets/acapulco-bahia.webp";
import acapulcoPozoleImage from "@/assets/acapulco-pozole.webp";
import acapulcoNocheImage from "@/assets/acapulco-noche.webp";
import acapulcoRoquetaImage from "@/assets/acapulco-roqueta.webp";
import acapulcoFuerteImage from "@/assets/acapulco-fuerte.webp";
import acapulcoAtardecerImage from "@/assets/acapulco-atardecer.webp";
import acapulcoLagunaImage from "@/assets/acapulco-laguna.webp";
import acapulcoPlayaImage from "@/assets/acapulco-playa.webp";
import culturalArrivalImage from "@/assets/cielito-trips-hero-cultural.jpg";
import europeImage from "@/assets/cielito-europe.jpg";
import feelingImage from "@/assets/trips-feeling.jpg";
import mexicoImage from "@/assets/cielito-mexico.jpg";
import roadImage from "@/assets/cielito-road-process.jpg";
import stayImage from "@/assets/cielito-stay-process.jpg";
import cuscoImage from "@/assets/trips-cusco.jpg";
import kyotoImage from "@/assets/trips-kyoto.jpg";
import oaxacaImage from "@/assets/trips-oaxaca.jpg";
import orlandoImage from "@/assets/orlando-hero.jpg";
import orlandoParquesImage from "@/assets/orlando-parques.jpg";
import orlandoAguaImage from "@/assets/orlando-agua.jpg";
import orlandoNocheImage from "@/assets/orlando-noche.webp";
import orlandoFamiliaImage from "@/assets/orlando-familia.jpg";
import orlandoEspacioImage from "@/assets/orlando-espacio.jpg";
import orlandoNaturalezaImage from "@/assets/orlando-naturaleza.jpg";
import orlandoLagosImage from "@/assets/orlando-lagos.jpg";
import orlandoComprasImage from "@/assets/orlando-compras.jpg";
import orlandoSaboresImage from "@/assets/orlando-sabores.jpg";
import parisImage from "@/assets/trips-paris.jpg";
import patagoniaImage from "@/assets/trips-patagonia.jpg";
import puntaCanaImage from "@/assets/trips-punta-cana.jpg";
import rivieraMayaImage from "@/assets/trips-riviera-maya.jpg";
import rivieraSelvaImage from "@/assets/riviera-maya-selva.jpg";
import rivieraCostaImage from "@/assets/riviera-maya-costa.jpg";
import rivieraTulumImage from "@/assets/riviera-maya-tulum.jpg";
import rivieraSaboresImage from "@/assets/riviera-sabores-v2.jpg";
import rivieraDoselImage from "@/assets/riviera-dosel.jpg";
import rivieraCenoteLuzImage from "@/assets/riviera-cenote-luz.jpg";
import rivieraArrecifeImage from "@/assets/riviera-arrecife.jpg";
import rivieraTohImage from "@/assets/riviera-toh.jpg";
import rivieraTextilImage from "@/assets/riviera-textil.jpg";
import sanMiguelImage from "@/assets/trips-san-miguel.jpg";
import santoriniImage from "@/assets/trips-santorini.jpg";
import tokyoFamilyImage from "@/assets/trips-tokyo-family.jpg";

export type Region = "México" | "Caribe" | "Estados Unidos" | "Europa" | "Sudamérica" | "Asia";
export type Intention = "Playa" | "Familia" | "Romance" | "Aventura" | "Cultura" | "Escapada" | "Parques" | "Diversión" | "Noches" | "Tradición";
export type CoordinatedService = "Vuelos" | "Hospedaje" | "Traslados" | "Renta de autos" | "Actividades y experiencias";

type GalleryImage = { src: string; alt: string; label?: string };

export type TravelIdea = {
  slug: string;
  name: string;
  city: string;
  country: string;
  state?: string;
  relatedSlugs?: string[];
  /** Legacy flag; themes now live in destination-themes.ts. */
  theme?: "caribe";
  activitiesLine?: string;
  destination: string;
  region: Region;
  category: string;
  intentions: Intention[];
  image: string;
  imageAlt: string;
  description: string;
  /** Optional "La idea" title when it differs from the catalog description. */
  ideaTitle?: string;
  featured: boolean;
  concept: string;
  possibilities: string[];
  travelForms: string[];
  services: CoordinatedService[];
  gallery: GalleryImage[];
  closingLine: string;
  /** Accent words (Fraunces italic) per title; each must appear verbatim in its text. */
  highlights?: { hero?: string; idea?: string; vivir?: string; forms?: string; atmosphere?: string; closing?: string };
  /** Decorative word ribbon before the travel-forms section. */
  marquee?: string[];
  price?: number;
  previousPrice?: number;
  currency?: string;
  from?: boolean;
  date?: string;
  duration?: string;
  availability?: string;
  promotion?: string;
  itinerary?: string[];
  includes?: string[];
  excludes?: string[];
  policies?: string[];
};

export const regions: Region[] = ["México", "Caribe", "Estados Unidos", "Europa", "Sudamérica", "Asia"];
export const intentions: Intention[] = ["Playa", "Familia", "Romance", "Aventura", "Cultura", "Escapada"];

export const travelIdeas: TravelIdea[] = [
  {
    slug: "riviera-maya", name: "Riviera Maya", city: "Riviera Maya", country: "México", state: "Quintana Roo", theme: "caribe", activitiesLine: "Cenotes, cultura y más", destination: "Caribe mexicano, a tu ritmo.", region: "México", category: "Playa y naturaleza", intentions: ["Playa", "Familia", "Romance"], image: rivieraMayaImage, imageAlt: "Familia explorando un cenote rodeado de selva en la Riviera Maya", description: "Cenotes, selva y días junto al Caribe para combinar descanso con descubrimiento.", featured: true,
    concept: "Una idea para alternar la calma del Caribe con encuentros cercanos con la naturaleza, sin imponer un solo ritmo al viaje.",
    possibilities: ["Explorar cenotes entre la selva", "Disfrutar la costa a tu ritmo", "Acercarte a los sabores del Caribe mexicano", "Combinar descanso y descubrimiento"],
    travelForms: ["En familia", "En pareja", "Escapada de playa"], services: ["Vuelos", "Hospedaje", "Traslados", "Renta de autos", "Actividades y experiencias"],
    gallery: [
      { src: rivieraSelvaImage, alt: "Viajeros caminando por la selva hacia un cenote de agua cristalina", label: "Cenotes" },
      { src: rivieraDoselImage, alt: "Vista aérea de la selva maya con un cenote turquesa", label: "Selva" },
      { src: rivieraCenoteLuzImage, alt: "Rayos de luz dentro de un cenote con raíces colgantes", label: "Luz" },
      { src: rivieraTohImage, alt: "Pájaro toh posado en una rama de la selva", label: "Toh" },
      { src: rivieraCostaImage, alt: "Pareja caminando por una costa natural del Caribe mexicano al atardecer", label: "Caribe" },
      { src: rivieraTulumImage, alt: "Viajera observando la zona arqueológica de Tulum sobre el mar Caribe", label: "Tulum" },
      { src: rivieraArrecifeImage, alt: "Tortuga marina nadando sobre un arrecife de coral del Caribe", label: "Arrecife" },
      { src: rivieraSaboresImage, alt: "Cochinita pibil, ceviche y tortillas sobre una mesa de madera", label: "Sabores" },
      { src: rivieraTextilImage, alt: "Manos de artesana bordando un huipil de flores", label: "Bordado" },
    ], closingLine: "¿Te imaginas descubriendo el Caribe a tu manera?",
    highlights: { hero: "ritmo", idea: "Caribe", vivir: "vivir", forms: "muchas formas", atmosphere: "atmósfera", closing: "a tu manera" },
    marquee: ["Cenotes", "Selva", "Caribe", "Tulum", "Arrecife", "Sabores", "Cultura maya"],
  },
  {
    slug: "acapulco", name: "Acapulco", city: "Acapulco", country: "México", state: "Guerrero", relatedSlugs: ["riviera-maya", "punta-cana", "santorini"], activitiesLine: "Bahía, clavados y más", destination: "Bahía, clavados y noches doradas.", region: "México", category: "Playa y noche", intentions: ["Playa", "Noches", "Tradición"], image: acapulcoHeroImage, imageAlt: "Pareja brindando en una terraza al atardecer frente a la bahía de Acapulco", description: "Playa, sabores de Guerrero y noches con su propio brillo en un clásico del Pacífico.", ideaTitle: "Días de playa en la bahía más famosa del Pacífico y noches con su propio brillo.", featured: true,
    concept: "Una idea para combinar playa, sabores de Guerrero y el ambiente de un clásico que se vive a tu ritmo.",
    possibilities: ["Ver a los clavadistas de La Quebrada lanzarse al mar", "Recorrer la bahía en lancha hasta la Isla La Roqueta", "Despedir el sol en Pie de la Cuesta", "Probar pozole, pescado a la talla y la noche de la Costera"],
    travelForms: ["En pareja", "Con amigos", "Escapada de fin de semana"], services: ["Vuelos", "Hospedaje", "Traslados", "Renta de autos", "Actividades y experiencias"],
    gallery: [
      { src: acapulcoClavadosImage, alt: "Clavadista en el aire frente al acantilado de La Quebrada", label: "Clavados" },
      { src: acapulcoBahiaImage, alt: "Panorámica de la bahía de Acapulco desde lo alto, de día", label: "Bahía" },
      { src: acapulcoRoquetaImage, alt: "Vista cenital de una lancha con fondo de cristal en agua transparente", label: "La Roqueta" },
      { src: acapulcoFuerteImage, alt: "Muralla y garita del Fuerte de San Diego con cielo azul", label: "Historia" },
      { src: acapulcoPozoleImage, alt: "Pozole verde de Guerrero servido en una mesa de madera", label: "Sabores" },
      { src: acapulcoNocheImage, alt: "Amigos brindando en una terraza con la bahía iluminada de fondo", label: "Noche" },
      { src: acapulcoAtardecerImage, alt: "Sol sobre el mar abierto en Pie de la Cuesta entre palapas", label: "Atardecer" },
      { src: acapulcoLagunaImage, alt: "Lancha entre manglares en la Laguna de Coyuca", label: "Laguna" },
      { src: acapulcoPlayaImage, alt: "Familia jugando en la orilla de una playa de aguas tranquilas", label: "Playa" },
    ], closingLine: "¿Te imaginas brindando frente a la bahía?",
    highlights: { hero: "doradas", idea: "brillo" },
  },
  {
    slug: "orlando", name: "Orlando", city: "Orlando", country: "Estados Unidos", state: "Florida", relatedSlugs: ["riviera-maya", "punta-cana", "tokio-en-familia"], activitiesLine: "Parques, compras y más", destination: "Parques, sol y días en familia.", region: "Estados Unidos", category: "Parques y familia", intentions: ["Familia", "Parques", "Diversión"], image: orlandoImage, imageAlt: "Familia riendo junta en un parque de diversiones al atardecer, con una montaña rusa al fondo", description: "Días de parques temáticos, sol de Florida y momentos que se vuelven recuerdos.", featured: true,
    concept: "Una idea para combinar la emoción de los parques con días de descanso, compras y tiempo en familia, al ritmo de cada viajero.",
    possibilities: ["Recorrer parques temáticos de clase mundial", "Refrescarte en parques acuáticos y piscinas", "Descubrir outlets y centros comerciales", "Explorar Florida más allá de los parques"],
    travelForms: ["En familia", "Con niños", "Escapada de parques"], services: ["Vuelos", "Hospedaje", "Traslados", "Renta de autos", "Actividades y experiencias"],
    gallery: [
      { src: orlandoParquesImage, alt: "Montaña rusa con un rizo bajo el cielo azul de Florida", label: "Parques" },
      { src: orlandoAguaImage, alt: "Familia riendo al bajar por un tobogán de agua", label: "Agua" },
      { src: orlandoEspacioImage, alt: "Familia observando un cohete en un centro espacial", label: "Espacio" },
      { src: orlandoNaturalezaImage, alt: "Garza blanca en un humedal de Florida entre cipreses", label: "Naturaleza" },
      { src: orlandoNocheImage, alt: "Parque temático iluminado de noche visto desde un lago", label: "Noche" },
      { src: orlandoFamiliaImage, alt: "Familia con niños jugando minigolf temático al atardecer", label: "Familia" },
      { src: orlandoLagosImage, alt: "Lago urbano con fuente y palmeras al atardecer", label: "Lagos" },
      { src: orlandoComprasImage, alt: "Paseo de tiendas al aire libre con palmeras y compradores", label: "Compras" },
      { src: orlandoSaboresImage, alt: "Mesa familiar con comida americana y cítricos de Florida", label: "Sabores" },
    ], closingLine: "¿Te imaginas compartiendo esta emoción con los tuyos?",
    highlights: { hero: "familia", idea: "recuerdos" },
  },
  {
    slug: "paris", name: "París", city: "París", country: "Francia", destination: "Una ciudad para caminar juntos.", region: "Europa", category: "Ciudad y romance", intentions: ["Romance", "Cultura", "Escapada"], image: parisImage, imageAlt: "Pareja caminando por París con la Torre Eiffel al fondo", description: "Calles, cafés y arquitectura para descubrir la ciudad con tiempo y curiosidad.", featured: true,
    concept: "Una invitación a descubrir la ciudad sin prisa: caminar, mirar, detenerse y dejar que cada barrio marque el ritmo.",
    possibilities: ["Caminar por barrios históricos", "Acercarse a museos y arquitectura", "Descubrir cafés y gastronomía local", "Compartir momentos en pareja"],
    travelForms: ["En pareja", "Escapada urbana", "Viaje cultural"], services: ["Vuelos", "Hospedaje", "Traslados", "Actividades y experiencias"],
    gallery: [{ src: europeImage, alt: "Viajeros recorriendo una ciudad europea junto al mar" }, { src: culturalArrivalImage, alt: "Viajeras llegando a una ciudad histórica con sus maletas" }], closingLine: "¿Te imaginas caminando París a tu propio ritmo?",
  },
  {
    slug: "patagonia", name: "Patagonia", city: "Patagonia", country: "Argentina", destination: "Paisajes que invitan a ir más lejos.", region: "Sudamérica", category: "Naturaleza activa", intentions: ["Aventura"], image: patagoniaImage, imageAlt: "Senderistas recorriendo un paisaje montañoso de la Patagonia", description: "Montañas, viento y senderos para quienes quieren vivir la naturaleza en movimiento.", featured: true,
    concept: "Una idea para acercarse a paisajes inmensos, respirar aire abierto y descubrir la naturaleza desde un viaje activo.",
    possibilities: ["Recorrer senderos entre montañas", "Contemplar paisajes abiertos", "Vivir rutas escénicas", "Combinar aventura y pausas frente a la naturaleza"],
    travelForms: ["Aventura en pareja", "Con amigos", "Naturaleza activa"], services: ["Vuelos", "Hospedaje", "Traslados", "Renta de autos", "Actividades y experiencias"],
    gallery: [{ src: feelingImage, alt: "Amigos compartiendo una fogata entre montañas" }, { src: roadImage, alt: "Carretera abierta entre paisajes de montaña" }], closingLine: "¿Te imaginas frente a un paisaje que lo cambia todo?",
  },
  {
    slug: "kyoto", name: "Kioto", city: "Kioto", country: "Japón", destination: "Tradición, calma y otra forma de mirar.", region: "Asia", category: "Patrimonio cultural", intentions: ["Cultura", "Romance"], image: kyotoImage, imageAlt: "Viajeros recorriendo los pórticos tradicionales de un templo en Kioto", description: "Templos, jardines y barrios históricos para acercarse al Japón más contemplativo.", featured: true,
    concept: "Un viaje contemplativo donde los jardines, templos y barrios históricos invitan a observar los detalles y cambiar de ritmo.",
    possibilities: ["Recorrer templos y jardines", "Caminar por barrios tradicionales", "Acercarse a la gastronomía japonesa", "Encontrar momentos de calma"],
    travelForms: ["En pareja", "Viaje cultural", "Descubrimiento pausado"], services: ["Vuelos", "Hospedaje", "Traslados", "Actividades y experiencias"],
    gallery: [{ src: tokyoFamilyImage, alt: "Viajeros recorriendo una calle japonesa iluminada" }], closingLine: "¿Te imaginas descubriendo Japón desde la calma?",
  },
  {
    slug: "san-miguel-de-allende", name: "San Miguel de Allende", city: "San Miguel de Allende", country: "México", destination: "Un fin de semana lleno de color.", region: "México", category: "Escapada mexicana", intentions: ["Escapada", "Cultura", "Romance"], image: sanMiguelImage, imageAlt: "Amigos caminando por una calle colonial de San Miguel de Allende", description: "Arquitectura, terrazas y calles para desconectarse sin viajar demasiado lejos.", featured: true,
    concept: "Una escapada cercana para caminar sin prisa entre color, arquitectura y sobremesas que alargan el fin de semana.",
    possibilities: ["Caminar por calles coloniales", "Descubrir terrazas y gastronomía", "Explorar arte y diseño local", "Celebrar una escapada especial"],
    travelForms: ["En pareja", "Con amigos", "Fin de semana cultural"], services: ["Hospedaje", "Traslados", "Renta de autos", "Actividades y experiencias"],
    gallery: [{ src: mexicoImage, alt: "Arquitectura contemporánea y color en una ciudad mexicana" }, { src: oaxacaImage, alt: "Viajeros recorriendo un mercado artesanal mexicano" }], closingLine: "¿Te imaginas regalándote un fin de semana diferente?",
  },
  {
    slug: "punta-cana", name: "Punta Cana", city: "Punta Cana", country: "República Dominicana", destination: "Días cálidos con sabor caribeño.", region: "Caribe", category: "Playa", intentions: ["Playa", "Romance"], image: puntaCanaImage, imageAlt: "Pareja caminando junto a un velero en una playa de Punta Cana", description: "Palmeras, arena y experiencias junto al agua para bajar el ritmo.", featured: false,
    concept: "Una pausa luminosa frente al Caribe para bajar el ritmo, compartir y dejar que los días transcurran cerca del agua.", possibilities: ["Disfrutar días junto al mar", "Compartir experiencias en pareja", "Descubrir sabores caribeños", "Alternar descanso y actividades acuáticas"], travelForms: ["En pareja", "Escapada de playa", "Descanso"], services: ["Vuelos", "Hospedaje", "Traslados", "Actividades y experiencias"], gallery: [{ src: stayImage, alt: "Habitación cálida abierta hacia una bahía" }], closingLine: "¿Te imaginas bajando el ritmo frente al Caribe?",
  },
  {
    slug: "santorini", name: "Santorini", city: "Santorini", country: "Grecia", destination: "Atardeceres para recordar juntos.", region: "Europa", category: "Isla y arquitectura", intentions: ["Romance", "Playa"], image: santoriniImage, imageAlt: "Pareja caminando entre la arquitectura blanca y azul de Santorini", description: "Pueblos blancos, caminos junto al mar y una atmósfera hecha para compartir.", featured: false,
    concept: "Una isla para caminar entre arquitectura blanca, mirar el mar y convertir cada atardecer en un momento compartido.", possibilities: ["Recorrer pueblos junto al mar", "Contemplar atardeceres", "Descubrir gastronomía mediterránea", "Compartir una escapada romántica"], travelForms: ["En pareja", "Escapada romántica", "Isla y cultura"], services: ["Vuelos", "Hospedaje", "Traslados", "Actividades y experiencias"], gallery: [{ src: europeImage, alt: "Pareja recorriendo una costa europea" }], closingLine: "¿Te imaginas viendo caer el sol sobre el Egeo?",
  },
  {
    slug: "cusco", name: "Cusco", city: "Cusco", country: "Perú", destination: "Historias vivas entre los Andes.", region: "Sudamérica", category: "Historia y patrimonio", intentions: ["Cultura", "Aventura"], image: cuscoImage, imageAlt: "Viajeros descubriendo textiles y arquitectura histórica en Cusco", description: "Calles de piedra, tradición andina y paisajes que conectan pasado y presente.", featured: false,
    concept: "Una aproximación a los Andes a través de su historia viva, sus paisajes y las comunidades que conservan sus tradiciones.", possibilities: ["Caminar por calles llenas de historia", "Descubrir tradición andina", "Conocer mercados y sabores locales", "Acercarse a paisajes de altura"], travelForms: ["Viaje cultural", "Aventura pausada", "En pareja o con amigos"], services: ["Vuelos", "Hospedaje", "Traslados", "Actividades y experiencias"], gallery: [{ src: roadImage, alt: "Ruta escénica entre montañas" }], closingLine: "¿Te imaginas siguiendo las historias de los Andes?",
  },
  {
    slug: "tokio-en-familia", name: "Tokio", city: "Tokio", country: "Japón", destination: "Una ciudad que sorprende a todas las edades.", region: "Asia", category: "Familia y ciudad", intentions: ["Familia", "Cultura", "Aventura"], image: tokyoFamilyImage, imageAlt: "Familia descubriendo una calle iluminada de Tokio", description: "Barrios llenos de energía, tradición y experiencias para descubrir en familia.", featured: false,
    concept: "Una ciudad de contrastes para sorprenderse juntos: tecnología, tradición y barrios que cambian de energía a cada paso.", possibilities: ["Descubrir barrios llenos de energía", "Acercarse a la cultura japonesa", "Encontrar experiencias para distintas edades", "Combinar tradición y tecnología"], travelForms: ["En familia", "Viaje cultural", "Aventura urbana"], services: ["Vuelos", "Hospedaje", "Traslados", "Actividades y experiencias"], gallery: [{ src: kyotoImage, alt: "Viajeros recorriendo pórticos tradicionales en Japón" }], closingLine: "¿Te imaginas descubriendo Tokio con toda la familia?",
  },
  {
    slug: "oaxaca", name: "Oaxaca", city: "Oaxaca", country: "México", destination: "Una escapada para mirar, probar y caminar.", region: "México", category: "Cultura mexicana", intentions: ["Escapada", "Cultura", "Familia"], image: oaxacaImage, imageAlt: "Viajeros recorriendo un mercado artesanal en Oaxaca", description: "Mercados, arquitectura y tradición para una salida breve con mucho por descubrir.", featured: false,
    concept: "Una escapada para conectar con la cultura a través de sus colores, sus sabores y las personas que mantienen vivas sus tradiciones.", possibilities: ["Recorrer mercados y talleres", "Descubrir gastronomía local", "Caminar por el centro histórico", "Conocer expresiones artesanales"], travelForms: ["En familia", "Con amigos", "Escapada cultural"], services: ["Vuelos", "Hospedaje", "Traslados", "Renta de autos", "Actividades y experiencias"], gallery: [{ src: mexicoImage, alt: "Arquitectura y color en una ciudad mexicana" }], closingLine: "¿Te imaginas Oaxaca a través de sus sabores y colores?",
  },
];

export function getTravelIdea(slug: string) {
  return travelIdeas.find((idea) => idea.slug === slug);
}

export function getRelatedTravelIdeas(current: TravelIdea, limit = 3) {
  const preferred = (current.relatedSlugs ?? []).filter((slug) => slug !== current.slug).map((slug) => travelIdeas.find((idea) => idea.slug === slug)).filter((idea): idea is TravelIdea => Boolean(idea));
  if (preferred.length >= limit) return preferred.slice(0, limit);
  const rest = byAffinity(current, limit + preferred.length).filter((idea) => !preferred.includes(idea));
  return [...preferred, ...rest].slice(0, limit);
}

function byAffinity(current: TravelIdea, limit: number) {
  return travelIdeas
    .filter((idea) => idea.slug !== current.slug && !current.gallery.some((image) => image.src === idea.image))
    .map((idea) => ({
      idea,
      score: (idea.region === current.region ? 3 : 0) + (isNeighborRegion(idea.region, current.region) ? 2 : 0) + idea.intentions.filter((item) => current.intentions.includes(item)).length * 2,
      shared: idea.intentions.some((item) => current.intentions.includes(item)),
    }))
    .filter(({ score, shared }) => shared && score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ idea }) => idea);
}

const neighborRegions: [string, string][] = [["México", "Caribe"], ["México", "Estados Unidos"]];
function isNeighborRegion(a: string, b: string) {
  return neighborRegions.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}
