import { useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { PHONE_COUNTRIES } from "@/lib/phone/countries";

/* Reusable international phone input: country selector (flag + calling code) + national digits.
   Metadata: Google libphonenumber via generated src/lib/phone/countries.ts (no runtime dependency). */

export type PhoneValue = { country: string; national: string };
export const EMPTY_PHONE: PhoneValue = { country: "MX", national: "" };

const names = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["es"], { type: "region" }) : null;
const nameOf = (iso: string) => { try { return names?.of(iso) ?? iso; } catch { return iso; } };
export const flagOf = (iso: string) => String.fromCodePoint(...[...iso].map((c) => 0x1f1a5 + c.charCodeAt(0)));
const fold = (s: string) => s.normalize("NFD").replace(/\p{Mn}/gu, "").toLowerCase();

type Row = { iso: string; dial: string; lengths: readonly number[]; name: string };
let rowsCache: Row[] | null = null;
const rows = () => (rowsCache ??= PHONE_COUNTRIES.map(([iso, dial, lengths]) => ({ iso, dial, lengths, name: nameOf(iso) })).sort((a, b) => a.name.localeCompare(b.name, "es")));
export const countryRow = (iso: string) => rows().find((r) => r.iso === iso);

/** Validates national digits against the country's possible lengths. Returns E.164 when valid. */
export function phoneCheck(v: PhoneValue): { ok: boolean; e164?: string; reason?: "empty" | "length" | "country" } {
  const r = countryRow(v.country);
  if (!r) return { ok: false, reason: "country" };
  let d = v.national;
  if (!d) return { ok: false, reason: "empty" };
  // Trunk prefix "0" (e.g. 0 11 … in Argentina, 0 20 … in UK) is dropped before validating, never stored with the code.
  if (d.length > 1 && d.startsWith("0") && !r.lengths.includes(d.length)) d = d.slice(1);
  if (r.lengths.length && !r.lengths.includes(d.length)) return { ok: false, reason: "length" };
  if (!r.lengths.length && (d.length < 4 || d.length > 14)) return { ok: false, reason: "length" };
  const e164 = `+${r.dial}${d}`;
  return e164.length > 16 ? { ok: false, reason: "length" } : { ok: true, e164 };
}

/* Display-only grouping (… XXXX XXXX); the stored value stays digits only. */
const group = (d: string) => d.length <= 6 ? d : d.length <= 8 ? `${d.slice(0, -4)} ${d.slice(-4)}` : `${d.slice(0, -8)} ${d.slice(-8, -4)} ${d.slice(-4)}`;

type Props = { id: string; label: string; value: PhoneValue; onChange: (v: PhoneValue) => void; error?: string | undefined };

export function InternationalPhoneInput({ id, label, value, onChange, error }: Props) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const cur = countryRow(value.country) ?? countryRow("MX")!;

  const list = useMemo(() => {
    const t = fold(q.trim()).replace(/^\+/, "");
    if (!t) return rows();
    return rows().filter((r) => fold(r.name).includes(t) || r.iso.toLowerCase() === t || r.dial.startsWith(t))
      .sort((a, b) => Number(b.dial === t) - Number(a.dial === t) || Number(fold(b.name).startsWith(t)) - Number(fold(a.name).startsWith(t)));
  }, [q]);

  const pick = (r: Row) => { onChange({ ...value, country: r.iso }); setOpen(false); setQ(""); btnRef.current?.focus(); };
  const onType = (raw: string) => {
    let d = raw.replace(/\D/g, "");
    // Pasted full international number with this country's code → strip it to avoid duplicating the prefix.
    if (/^\s*(\+|00)/.test(raw)) { const s = raw.trim().startsWith("00") ? d.slice(2) : d; d = s.startsWith(cur.dial) ? s.slice(cur.dial.length) : s; }
    onChange({ ...value, national: d.slice(0, 15) });
  };
  const errId = error ? `${id}-e` : undefined;

  return <div className="sg-field">
    <label htmlFor={id} className="sg-label">{label}</label>
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQ(""); }}>
      <PopoverAnchor asChild>
        <div className={cn("ph-wrap", error && "is-err")}>
          <button ref={btnRef} type="button" className="ph-country" aria-haspopup="listbox" aria-expanded={open}
            aria-label={`País del teléfono: ${cur.name}, +${cur.dial}. Cambiar`} onClick={() => setOpen((o) => !o)}>
            <span aria-hidden="true" className="ph-flag">{flagOf(cur.iso)}</span>
            <span className="ph-dial">+{cur.dial}</span>
            <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
          </button>
          <input id={id} type="tel" inputMode="numeric" autoComplete="tel-national" className="ph-num" placeholder="55 1234 5678"
            value={group(value.national)} maxLength={22} aria-invalid={Boolean(error)} aria-describedby={errId}
            onChange={(e) => onType(e.target.value)} />
        </div>
      </PopoverAnchor>
      <PopoverContent align="start" sideOffset={6} collisionPadding={12} className="geo-pop ph-pop" onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => { if (btnRef.current?.contains(e.target as Node)) e.preventDefault(); }}>
        <div className="ph-search">
          <Search className="size-4 opacity-50" aria-hidden="true" />
          <input autoFocus aria-label="Buscar país, código ISO o prefijo" placeholder="País, código o prefijo" value={q}
            role="combobox" aria-expanded aria-controls={`${uid}-l`} aria-activedescendant={list[active] ? `${uid}-${list[active]!.iso}` : undefined}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(list.length - 1, a + 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); const r = list[active]; if (r) pick(r); }
              setTimeout(() => listRef.current?.querySelector(".is-on")?.scrollIntoView({ block: "nearest" }));
            }} />
        </div>
        <ul ref={listRef} id={`${uid}-l`} role="listbox" aria-label="Países" className="geo-list ph-list">
          {list.map((r, i) => <li key={r.iso} id={`${uid}-${r.iso}`} role="option" aria-selected={r.iso === cur.iso}
            className={cn("geo-opt ph-opt", i === active && "is-on")} onMouseEnter={() => setActive(i)} onClick={() => pick(r)}>
            <span aria-hidden="true" className="ph-flag">{flagOf(r.iso)}</span>
            <span className="min-w-0 flex-1 truncate">{r.name} <span className="ph-iso">{r.iso}</span></span>
            <span className="ph-dial">+{r.dial}</span>
          </li>)}
          {!list.length && <li className="geo-empty">Sin coincidencias.</li>}
        </ul>
      </PopoverContent>
    </Popover>
    {error && <p id={errId} role="alert" className="sg-err">{error}</p>}
  </div>;
}
