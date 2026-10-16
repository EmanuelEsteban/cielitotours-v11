import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SignatureQuote } from "@/components/signature/signature-quote";
import { parseQuoteSearch, resolveQuoteContext } from "@/lib/quote-context";
// Respaldo funcional recuperable: src/components/quote-form.tsx (QuoteForm), sin cambios.
export const Route = createFileRoute("/cotizar")({
  validateSearch: (raw: Record<string, unknown>) => parseQuoteSearch(raw),
  head: () => ({ meta: [{ title: "Cotiza tu viaje | Cielito Tours" }, { name: "description", content: "Cuéntanos tu idea y recibe una propuesta personalizada para tu viaje." }, { property: "og:title", content: "Cotiza tu viaje | Cielito Tours" }, { property: "og:description", content: "Tu próximo viaje empieza con una conversación." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Cotizar,
});
function Cotizar() {
  const search = Route.useSearch();
  return <SiteShell><SignatureQuote context={resolveQuoteContext(search)} /></SiteShell>;
}
