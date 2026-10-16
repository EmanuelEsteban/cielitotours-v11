import heroImage from "@/assets/cielito-hero.jpg";
import cruiseImage from "@/assets/cielito-cruise-ship.jpg";
import familyImage from "@/assets/cielito-family.jpg";
import flightsImage from "@/assets/cielito-flights.jpg";
import carsImage from "@/assets/cielito-cars.jpg";
import hotelImage from "@/assets/cielito-hotel.jpg";
import disneyFamilyImage from "@/assets/cielito-disney-family.jpg";
import groupsImage from "@/assets/cielito-groups.jpg";
import mexicoImage from "@/assets/cielito-mexico.jpg";
import europeImage from "@/assets/cielito-europe.jpg";
import socialImage from "@/assets/cielito-social.jpg";
import sportsGroupsImage from "@/assets/cielito-sports-groups.jpg";
import empresas1 from "@/assets/empresas-1.webp";
import empresas2 from "@/assets/empresas-2.webp";
import deportivos1 from "@/assets/deportivos-1.webp";
import deportivos2 from "@/assets/deportivos-2.webp";

export const imagery = {
  hero: heroImage,
  cruise: cruiseImage,
  family: familyImage,
  flights: flightsImage,
  cars: carsImage,
  hotel: hotelImage,
  disneyFamily: disneyFamilyImage,
  groups: groupsImage,
  mexico: mexicoImage,
  europe: europeImage,
  social: socialImage,
  sportsGroups: sportsGroupsImage,
  empresas1,
  empresas2,
  deportivos1,
  deportivos2,
};

export const services = [
  { name: "Vuelos", note: "Rutas, equipaje y flexibilidad", href: "/servicios/vuelos" },
  { name: "Hospedaje", note: "La estancia que sí va contigo", href: "/servicios/hospedaje" },
  { name: "Autos", note: "Muévete a tu propio ritmo", href: "/servicios/renta-de-autos" },
  { name: "Paquetes", note: "Todo el viaje, bien coordinado", href: "/viajes" },
  { name: "Cruceros", note: "Encuentra la ruta indicada", href: "/cruceros" },
  { name: "Disney", note: "La magia, sin complicaciones", href: "/disney" },
  { name: "Tours", note: "Experiencias por el mundo", href: "/tours" },
  { name: "Grupos", note: "Empresas y equipos deportivos", href: "/grupos" },
] as const;

export const pageContent = {
  servicios: { eyebrow: "Servicios de viaje", title: "Cada pieza de tu viaje, en un mismo lugar.", description: "Coordinamos vuelos, hospedaje y renta de autos con asesoría humana y opciones pensadas para tu plan." },
  vuelos: { eyebrow: "Vuelos", title: "Tu mejor ruta empieza con una buena conversación.", description: "Cuéntanos desde dónde viajas, tus fechas y qué tan flexible eres. Te ayudamos a revisar opciones sin simular tarifas ni disponibilidad." },
  hospedaje: { eyebrow: "Hospedaje", title: "Un lugar que se sienta parte del viaje.", description: "Hoteles, resorts y estancias según tu ritmo, presupuesto y forma de viajar. Nosotros coordinamos los detalles contigo." },
  autos: { eyebrow: "Renta de autos", title: "Libertad para descubrir a tu manera.", description: "Te ayudamos a cotizar la categoría, horarios y puntos de entrega adecuados para tu ruta." },
  viajes: { eyebrow: "Viajes", title: "Ideas que pueden convertirse en tu próxima historia.", description: "Explora viajes inspiradores y pide una propuesta personalizada. Fechas, precios y disponibilidad se confirman con un asesor.", image: "hero" },
  tours: { eyebrow: "Tours por el mundo", title: "Primero lo que quieres vivir. Después, el destino.", description: "Cultura, naturaleza, aventura o descanso: diseñamos contigo la experiencia y conectamos cada parte del recorrido." },
  cruceros: { eyebrow: "Cruceros", title: "Muchos destinos. Una sola manera de desempacar.", description: "Comparamos rutas, temporadas y tipos de cabina para ayudarte a elegir con claridad.", image: "cruise" },
  disney: { eyebrow: "Viajes en familia", title: "La emoción empieza mucho antes de llegar.", description: "Te ayudamos con transporte, hospedaje, parques, traslados y un plan que también deje espacio para descansar.", image: "family" },
  destinos: { eyebrow: "México y el mundo", title: "Elige por lo que sueñas vivir.", description: "Playa, cultura, aventura, romance o días en familia. Déjanos convertir la intención en un viaje bien planeado." },
  grupos: { eyebrow: "Viajes de grupo", title: "Todos llegan. Todo está coordinado.", description: "Soluciones para empresas, equipos, academias y acompañantes, con seguimiento especializado de principio a fin." },
  empresas: { eyebrow: "Grupos empresariales", title: "Logística clara para que el equipo se concentre en el objetivo.", description: "Coordinamos rutas, hospedaje, traslados y necesidades especiales con un solo punto de contacto." },
  deportivos: { eyebrow: "Grupos deportivos", title: "Lleguen juntos. Lleguen listos.", description: "Planeamos el traslado de equipos, clubes, delegaciones y acompañantes alrededor del evento." },
  nosotros: { eyebrow: "Nosotros", title: "Viajar mejor empieza por sentirse acompañado.", description: "Cielito Tours reúne las piezas de cada viaje con atención humana, claridad y cuidado en los detalles." },
  contacto: { eyebrow: "Contacto", title: "Hablemos de lo que estás imaginando.", description: "Comparte tu idea y nuestro equipo te ayudará a encontrar el mejor siguiente paso." },
} satisfies Record<string, { eyebrow: string; title: string; description: string; image?: keyof typeof imagery }>;