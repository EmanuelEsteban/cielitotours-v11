import { useCallback, useEffect, useState } from "react";

type Fijo = "Derecha" | "Centro" | "Izquierda";
type Disol = "Sigue la foto" | "Fija";
type Vals = { s: number; x: number; y: number; o: Fijo; d: Disol; ft: number; fb: number; fl: number };
const ORIGIN: Record<Fijo, string> = { Derecha: "100% 50%", Centro: "50% 50%", Izquierda: "0% 50%" };
const KEY = (n: string) => `ajuste:${n}`;

const els = () => Array.from(document.querySelectorAll<HTMLElement>("[data-ajustable]"));
const find = (n: string) => els().find((e) => e.dataset["ajustable"] === n) ?? null;

/** Valores iniciales leídos del CSS del elemento (sin estilos en línea). */
function initial(el: HTMLElement): Vals {
  const saved = el.getAttribute("style");
  el.removeAttribute("style");
  const cs = getComputedStyle(el);
  const vw = window.innerWidth / 100;
  const px = (v: string) => (v.trim().endsWith("vw") ? parseFloat(v) : parseFloat(v) / vw);
  const s = parseFloat(cs.getPropertyValue("--foto-escala")) || 1;
  const x = px(cs.getPropertyValue("--foto-x") || "0") || 0;
  const y = px(cs.getPropertyValue("--foto-y") || "0") || 0;
  const ox = parseFloat(cs.transformOrigin) / (el.offsetWidth || 1);
  const o: Fijo = ox > 0.75 ? "Derecha" : ox < 0.25 ? "Izquierda" : "Centro";
  if (saved !== null) el.setAttribute("style", saved);
  const r = (n: number) => Math.round(n * 4) / 4;
  const d: Disol = el.dataset["disolvencia"] === "fija" ? "Fija" : "Sigue la foto";
  const f = (k: string, def: number) => Math.round(parseFloat(cs.getPropertyValue(k)) || def);
  return { s: Math.round(s * 100) / 100, x: r(x), y: r(y), o, d, ft: f("--fade-top", 30), fb: f("--fade-bottom", 10), fl: f("--fade-left", 48) };
}
function read(n: string): Vals | null {
  try {
    const raw = localStorage.getItem(KEY(n));
    if (!raw) return null;
    const p = JSON.parse(raw);
    const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);
    if (!num(p.s) || !num(p.x) || !num(p.y) || !(p.o in ORIGIN)) return null;
    const ini = initial(find(n)!);
    const fv = (val: unknown, def: number) => (num(val) ? (val as number) : def);
    return { ...p, d: p.d === "Fija" ? "Fija" : "Sigue la foto", ft: fv(p.ft, ini.ft), fb: fv(p.fb, ini.fb), fl: fv(p.fl, ini.fl) } as Vals;
  } catch { return null; }
}
function save(n: string, v: Vals) { try { localStorage.setItem(KEY(n), JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
function clear(n: string) { try { localStorage.removeItem(KEY(n)); } catch { /* sin almacenamiento */ } }
function apply(el: HTMLElement, v: Vals) {
  el.style.setProperty("--foto-escala", String(v.s));
  el.style.setProperty("--foto-x", `${v.x}vw`);
  el.style.setProperty("--foto-y", `${v.y}vw`);
  el.style.transformOrigin = ORIGIN[v.o];
  el.style.setProperty("--fade-top", String(v.ft));
  el.style.setProperty("--fade-bottom", String(v.fb));
  el.style.setProperty("--fade-left", String(v.fl));
  if (v.d === "Fija") el.dataset["disolvencia"] = "fija"; else delete el.dataset["disolvencia"];
}

export default function AjustePanel() {
  const [names, setNames] = useState<string[]>([]);
  const [sel, setSel] = useState("");
  const [v, setV] = useState<Vals | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const list = els().map((e) => e.dataset["ajustable"]!).filter(Boolean);
    list.forEach((n) => { const el = find(n); const s = read(n); if (el && s) apply(el, s); });
    setNames(list);
    if (list[0]) setSel(list[0]);
  }, []);

  useEffect(() => {
    const el = sel && find(sel);
    if (!el) return;
    setV(read(sel) ?? initial(el));
    setMsg("");
  }, [sel]);

  const update = useCallback((nv: Vals) => {
    const el = find(sel);
    if (!el) return;
    setV(nv); apply(el, nv); save(sel, nv);
  }, [sel]);

  if (!names.length || !v) return null;

  const row = (label: string, k: "s" | "x" | "y" | "ft" | "fb" | "fl", min: number, max: number, step: number, fmt: (n: number) => string) => (
    <label className="flex items-center gap-2">
      <span className="w-36">{label}</span>
      <input type="range" min={min} max={max} step={step} value={v[k]} aria-label={label}
        onChange={(e) => update({ ...v, [k]: Number(e.target.value) })} className="w-40" />
      <span className="w-20 text-right tabular-nums">{fmt(v[k])}</span>
    </label>
  );
  const copy = async () => {
    const t = `Bloque ${sel}, Tamaño ${v.s.toFixed(2)}, Horizontal ${v.x} vw, Vertical ${v.y} vw, Punto fijo ${v.o}, Disolvencia ${v.d}, Difuminado arriba ${v.ft} %, Difuminado abajo ${v.fb} %, Difuminado izquierda ${v.fl} %, ancho de pantalla ${window.innerWidth} px`;
    try { await navigator.clipboard.writeText(t); setMsg("Copiado"); } catch { setMsg(t); }
  };
  const reset = () => {
    const el = find(sel);
    if (!el) return;
    clear(sel);
    el.style.removeProperty("--foto-escala"); el.style.removeProperty("--foto-x");
    el.style.removeProperty("--foto-y"); el.style.removeProperty("transform-origin");
    ["--fade-top", "--fade-bottom", "--fade-left"].forEach((k) => el.style.removeProperty(k)); delete el.dataset["disolvencia"];
    setV(initial(el)); setMsg("");
  };
  const selCls = "rounded bg-primary-foreground px-2 py-1 text-ink";

  return (
    <div className="fixed bottom-4 left-4 z-[99999] flex flex-col gap-2 rounded-md bg-ink p-4 text-sm text-primary-foreground shadow-xl" data-ajuste-panel>
      <label className="flex items-center gap-2">
        <span className="w-36">Bloque</span>
        <select value={sel} onChange={(e) => setSel(e.target.value)} className={selCls} aria-label="Bloque">
          {names.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      {row("Tamaño", "s", 0.5, 1.6, 0.01, (n) => n.toFixed(2))}
      {row("Izquierda / Derecha", "x", -40, 40, 0.25, (n) => `${n} vw`)}
      {row("Arriba / Abajo", "y", -30, 30, 0.25, (n) => `${n} vw`)}
      <label className="flex items-center gap-2">
        <span className="w-36">Punto fijo</span>
        <select value={v.o} onChange={(e) => update({ ...v, o: e.target.value as Fijo })} className={selCls} aria-label="Punto fijo">
          <option>Derecha</option><option>Centro</option><option>Izquierda</option>
        </select>
      </label>
      {row("Difuminado arriba", "ft", 0, 45, 1, (n) => `${n} %`)}
      {row("Difuminado abajo", "fb", 0, 45, 1, (n) => `${n} %`)}
      {row("Difuminado izquierda", "fl", 0, 70, 1, (n) => `${n} %`)}
      <label className="flex items-center gap-2">
        <span className="w-36">Disolvencia</span>
        <select value={v.d} onChange={(e) => update({ ...v, d: e.target.value as Disol })} className={selCls} aria-label="Disolvencia">
          <option>Sigue la foto</option><option>Fija</option>
        </select>
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={copy} className="rounded bg-primary px-3 py-1">Copiar valores</button>
        <button type="button" onClick={reset} className="rounded border border-primary-foreground/40 px-3 py-1">Restablecer</button>
      </div>
      {msg && <p className="max-w-xs text-xs">{msg}</p>}
    </div>
  );
}
