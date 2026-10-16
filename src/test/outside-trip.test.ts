import { describe, expect, it } from "vitest";
import { outsideTrip } from "@/components/signature/service-prefs";

const trip = { start: "2026-11-04", end: "2026-11-08" };
describe("outsideTrip", () => {
  it("flags dates before the trip", () => expect(outsideTrip("2026-10-25", "2026-10-28", trip)).toBe(true));
  it("flags dates after the trip", () => expect(outsideTrip("2026-11-05", "2026-11-10", trip)).toBe(true));
  it("accepts dates inside the trip", () => expect(outsideTrip("2026-11-04", "2026-11-08", trip)).toBe(false));
  it("is silent when general dates are undefined", () => expect(outsideTrip("2026-10-25", "", null)).toBe(false));
});
