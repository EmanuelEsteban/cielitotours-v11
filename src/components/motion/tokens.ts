export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
export const REVEAL_MS = 800;
export const TITLE_MS = 900;
export const STAGGER_MS = 100;
export const ROUTE_DASH = "2 12";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
export function isFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
export function isDesktop() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
}
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
