import { describe, expect, it } from "vitest";
import { parseQuoteSearch, resolveQuoteContext } from "@/lib/quote-context";

describe("quote context from URL", () => {
  it("keeps destino with accents and spaces", () => {
    expect(resolveQuoteContext(parseQuoteSearch({ destino: "Ciudad de México", region: "México" })).destino).toBe("Ciudad de México");
  });
  it("accepts known region + experiencia", () => {
    const c = resolveQuoteContext(parseQuoteSearch({ region: "México", experiencia: "Romance" }));
    expect([c.region, c.experiencia]).toEqual(["México", "Romance"]);
  });
  it("drops unknown region and experiencia", () => {
    const c = resolveQuoteContext(parseQuoteSearch({ region: "Marte", experiencia: "<b>x</b>" }));
    expect([c.region, c.experiencia]).toEqual([null, null]);
  });
  it("resolves a real idea by slug, ignoring the URL name", () => {
    expect(resolveQuoteContext(parseQuoteSearch({ ideaSlug: "riviera-maya", ideaName: "Falso" })).idea).toEqual({ slug: "riviera-maya", name: "Riviera Maya" });
  });
  it("ignores an unknown idea slug", () => {
    expect(resolveQuoteContext(parseQuoteSearch({ ideaSlug: "no-existe" })).idea).toBeNull();
  });
  it("drops unknown keys and non-string values", () => {
    expect(parseQuoteSearch({ foo: "x", destino: { a: 1 } })).toEqual({});
  });
});
