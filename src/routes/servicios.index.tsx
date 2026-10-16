import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { pageContent } from "@/lib/site-data";

export const Route = createFileRoute("/servicios/")({
  head: () => ({
    meta: [
      { title: "Servicios de viaje | Cielito Tours" },
      { name: "description", content: "Vuelos, hospedaje, autos y paquetes con asesoría integral." },
      { property: "og:title", content: "Servicios de viaje | Cielito Tours" },
      { property: "og:description", content: "Planea todos los detalles de tu viaje con un mismo equipo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return <ContentPage {...pageContent.servicios} />;
}