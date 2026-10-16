import type { Airport, City } from "./types";

/* Static catalogs live in /public/data/geo and are fetched lazily (never in the JS bundle).
   Records are treated as untrusted plain text: rendered only as React text, never as HTML. */

const AIRPORTS_URL = "/data/geo/airports.v1.json";
const CITIES_URL = "/data/geo/cities.v1.json";

export const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Mn}/gu, "").toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, " ").replace(/\s+/g, " ").trim();

const esNames = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["es"], { type: "region" }) : null;
const enNames = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en"], { type: "region" }) : null;
const countryCache = new Map<string, [string, string]>();
function countryOf(code: string): [string, string] {
  let c = countryCache.get(code);
  if (!c) {
    let es = code, en = code;
    try { es = esNames?.of(code) ?? code; en = enNames?.of(code) ?? code; } catch { /* unknown code */ }
    c = [es, en];
    countryCache.set(code, c);
  }
  return c;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

type Indexed<T> = { item: T; hay: string; primary: string[]; secondary: string[]; country: string[]; boost: number };

let airportsP: Promise<Indexed<Airport>[]> | null = null;
let citiesP: Promise<Indexed<City>[]> | null = null;

export function loadAirports() {
  airportsP ??= fetch(AIRPORTS_URL).then((r) => { if (!r.ok) throw new Error("airports"); return r.json(); }).then((rows: unknown[]) =>
    rows.filter(Array.isArray).map((r) => {
      const [iata, icao, name, city, cc, region, sched, rank, kw] = r as unknown[];
      const [es, en] = countryOf(str(cc));
      const item: Airport = { kind: "airport", iata: str(iata), icao: str(icao) || undefined, name: str(name), city: str(city), countryCode: str(cc), country: es, region: str(region), scheduled: sched === 1 };
      const keywords = str(kw).split("|").filter(Boolean);
      const primary = [norm(item.city), norm(item.name)];
      const secondary = keywords.map(norm);
      const country = [norm(es), norm(en)];
      const boost = (item.scheduled ? 50 : 0) + (2 - Number(rank || 0)) * 20; // < 100, stays inside a tier
      return { item, hay: [...primary, ...secondary, ...country, item.iata.toLowerCase(), (item.icao ?? "").toLowerCase()].join(" "), primary, secondary, country, boost };
    }));
  airportsP.catch(() => { airportsP = null; });
  return airportsP;
}

export function loadCities() {
  citiesP ??= fetch(CITIES_URL).then((r) => { if (!r.ok) throw new Error("cities"); return r.json(); }).then((rows: unknown[]) =>
    rows.filter(Array.isArray).map((r) => {
      const [id, name, cc, region, pop, alts] = r as unknown[];
      const [es, en] = countryOf(str(cc));
      const item: City = { kind: "city", id: Number(id), name: str(name), countryCode: str(cc), country: es, region: str(region), population: Number(pop) || 0 };
      const primary = [norm(item.name)];
      const secondary = [...str(alts).split("|").filter(Boolean).map(norm), norm(item.region)];
      const country = [norm(es), norm(en)];
      const boost = Math.min(95, Math.log10(item.population + 10) * 12);
      return { item, hay: [...primary, ...secondary, ...country].join(" "), primary, secondary, country, boost };
    }));
  citiesP.catch(() => { citiesP = null; });
  return citiesP;
}

/* ---------- Country aliases (ISO 3166-1 alpha-2 + Intl.DisplayNames es/en, long and short styles) ---------- */
const esShort = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["es"], { type: "region", style: "short" }) : null;
const enShort = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en"], { type: "region", style: "short" }) : null;
/* Common abbreviations that Intl does not expose (alpha-3 style); keyed by ISO code. */
const EXTRA_ALIASES: Record<string, string[]> = { US: ["usa", "eeuu", "ee uu", "eua"], GB: ["uk", "gran bretana"], AE: ["uae", "eau"] };
let aliasMap: Map<string, string> | null = null;
function countryAliases(codes: Iterable<string>) {
  if (aliasMap) return aliasMap;
  const m = new Map<string, string>();
  for (const cc of codes) {
    if (!cc) continue;
    const [es, en] = countryOf(cc);
    const names = [es, en, ...(EXTRA_ALIASES[cc] ?? [])];
    try { names.push(esShort?.of(cc) ?? "", enShort?.of(cc) ?? ""); } catch { /* ignore */ }
    for (const n of names) { const k = norm(n); if (k.length >= 2 && k !== cc.toLowerCase() || k === "us" || k === "uk") m.set(k, cc); }
  }
  return (aliasMap = m);
}

/** Exact country match → ISO code (Colombia, Estados Unidos, United States, USA, US, España, Germany…). */
export async function matchCountry(query: string) {
  const list = await loadAirports();
  return countryAliases(list.map((e) => e.item.countryCode)).get(norm(query)) ?? null;
}

const has = (f: string, q: string) => f === q ? 3 : f.startsWith(q) ? 2 : f.includes(" " + q) ? 1 : f.includes(q) ? 0.5 : 0;

export type SearchResult<T> = { items: T[]; total: number; countryMode: string | null };

/* Tiers (never overlapped by boost, max boost < 100):
   1000 IATA exact · 900 ICAO exact · 800 city exact · 700 city prefix · 600 airport name ·
   400 partial city/name/keyword · 200 country. */
function airportTier(a: Airport, e: Indexed<Airport>, q: string) {
  if (q.length === 3 && a.iata.toLowerCase() === q) return 1000;
  if (q.length === 4 && a.icao?.toLowerCase() === q) return 900;
  const city = e.primary[0] ?? "", name = e.primary[1] ?? "";
  const base = norm(a.city.replace(/\(.*?\)/g, "")); // "Paris (Roissy…)" counts as exact "Paris"
  if (city === q || base === q || e.secondary.includes(q)) return 800;
  if (city.startsWith(q)) return 700;
  const n = has(name, q);
  if (n >= 1) return 560 + n * 20;
  if (has(city, q) || n || e.secondary.some((k) => has(k, q))) return 400;
  if (e.country.some((c) => has(c, q) >= 1)) return 200;
  return 100;
}

const MAX = 600; // safety cap on returned matches; UI renders in pages of 8

export async function searchAirports(query: string): Promise<SearchResult<Airport>> {
  const list = await loadAirports();
  const q = norm(query);
  if (q.length < 2) return { items: [], total: 0, countryMode: null };
  const cc = countryAliases(list.map((e) => e.item.countryCode)).get(q) ?? null;
  const out: { e: Indexed<Airport>; s: number }[] = [];
  if (cc) {
    // Country exploration: every airport of that country, ordered by catalog data only
    // (scheduled service, OurAirports size class), then IATA exact/city name hits.
    // A country alias (USA, US, Estados Unidos…) means the country: no IATA-exact bonus here,
    // so e.g. the airport coded USA does not jump ahead; it stays findable by name/city.
    for (const e of list) if (e.item.countryCode === cc) out.push({ e, s: e.boost });
  } else {
    const tokens = q.split(" ");
    for (const e of list) {
      if (!tokens.every((t) => e.hay.includes(t))) continue;
      out.push({ e, s: airportTier(e.item, e, q) + e.boost });
    }
  }
  out.sort((a, b) => b.s - a.s || a.e.item.city.localeCompare(b.e.item.city));
  return { items: out.slice(0, MAX).map((o) => o.e.item), total: out.length, countryMode: cc };
}

export async function searchCities(query: string): Promise<SearchResult<City>> {
  const list = await loadCities();
  const q = norm(query);
  if (q.length < 2) return { items: [], total: 0, countryMode: null };
  const tokens = q.split(" ");
  const out: { e: Indexed<City>; s: number }[] = [];
  for (const e of list) {
    if (!tokens.every((t) => e.hay.includes(t))) continue;
    const name = e.primary[0] ?? "";
    const tier = name === q || e.secondary.includes(q) ? 800 : name.startsWith(q) ? 700 : has(name, q) || e.secondary.some((k) => has(k, q)) ? 400 : 200;
    out.push({ e, s: tier + e.boost }); // boost = log10(pop)*12 ≤ ~90
  }
  out.sort((a, b) => b.s - a.s);
  return { items: out.slice(0, MAX).map((o) => o.e.item), total: out.length, countryMode: null };
}
