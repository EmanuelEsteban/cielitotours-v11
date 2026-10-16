import { homeExperiences, homeRegions } from "@/lib/home-destinations";
import { getTravelIdea, regions as ideaRegions } from "@/lib/travel-ideas";

/* COTIZAR-FUNCIONAL-02 — context received by /cotizar from other pages.
   URL contract (existing links): Home Destinos → destino, region, experiencia, origen;
   /viajes/$slug → ideaSlug, ideaName, region, sourcePage. Values are untrusted plain text. */

export type QuoteSearch = {
  destino?: string; region?: string; experiencia?: string; origen?: string;
  ideaSlug?: string; ideaName?: string; sourcePage?: string;
};

const KEYS = ["destino", "region", "experiencia", "origen", "ideaSlug", "ideaName", "sourcePage"] as const;

/** Keeps only known keys, as trimmed single-line text (≤120 chars). Anything else is dropped. */
export function parseQuoteSearch(raw: Record<string, unknown>): QuoteSearch {
  const out: QuoteSearch = {};
  for (const k of KEYS) {
    const v = raw[k];
    if (typeof v !== "string" && typeof v !== "number") continue;
    // eslint-disable-next-line no-control-regex
    const s = String(v).replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
    if (s) out[k] = s;
  }
  return out;
}

export type QuoteContext = {
  destino: string | null;           // free geographic text (never an airport)
  region: string | null;            // validated against the project's regions
  experiencia: string | null;       // validated against the project's experiences
  idea: { slug: string; name: string } | null; // only real catalog ideas
};

const REGIONS = new Set<string>([...homeRegions, ...ideaRegions]);
const EXPERIENCES = new Set<string>(homeExperiences);

export function resolveQuoteContext(s: QuoteSearch): QuoteContext {
  const idea = s.ideaSlug ? getTravelIdea(s.ideaSlug) : undefined;
  return {
    destino: s.destino ?? null,
    region: s.region && REGIONS.has(s.region) ? s.region : null,
    experiencia: s.experiencia && EXPERIENCES.has(s.experiencia) ? s.experiencia : null,
    idea: idea ? { slug: idea.slug, name: idea.name } : null,
  };
}

export const hasContext = (c: QuoteContext) => Boolean(c.destino || c.region || c.experiencia || c.idea);
