import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/lib/geo/search";

const PAGE = 8;
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

/* Presentation + keyboard logic shared by AirportAutocomplete and CityAutocomplete (WAI-ARIA combobox). */

type Props<T> = {
  label: string;
  placeholder?: string;
  text: string;
  onText: (text: string) => void;
  search: (q: string) => Promise<SearchResult<T>>;
  moreLabel?: string;
  noun?: string;
  onPick: (item: T) => void;
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  manualHint?: string;
  footer?: ReactNode;
};

export function GeoCombobox<T>({ label, placeholder, text, onText, search, onPick, getKey, renderItem, manualHint, footer, moreLabel = "Ver más", noun = "resultados" }: Props<T>) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [all, setAll] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [shown, setShown] = useState(PAGE);
  const items = all.slice(0, shown);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const seq = useRef(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => { if (active >= 0) listRef.current?.querySelector(`#${CSS.escape(`${uid}-o${active}`)}`)?.scrollIntoView({ block: "nearest" }); }, [active, uid]);

  useEffect(() => {
    if (!open || text.trim().length < 2) { setAll([]); setTotal(0); setLoading(false); return; }
    const n = ++seq.current;
    setLoading(true);
    const t = setTimeout(() => {
      search(text).then((r) => { if (n === seq.current) { setAll(r.items); setTotal(r.total); setShown(PAGE); setActive(-1); setFailed(false); } })
        .catch(() => { if (n === seq.current) { setAll([]); setTotal(0); setFailed(true); } })
        .finally(() => { if (n === seq.current) setLoading(false); });
    }, 120);
    return () => clearTimeout(t);
  }, [text, open, search]);

  const pick = (i: number) => { const it = items[i]; if (!it) return; onPick(it); setOpen(false); setActive(-1); };
  const listId = `${uid}-list`;
  const showList = open && text.trim().length >= 2;

  return <div className="sg-field geo-combo">
    <label htmlFor={`${uid}-in`} className="sg-label">{label}</label>
    <Popover open={showList} onOpenChange={(o) => { if (!o) setOpen(false); }}>
    <PopoverAnchor asChild>
    <div className="relative" ref={anchorRef}>
      <input
        id={`${uid}-in`}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${uid}-o${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        className="geo-input"
        placeholder={placeholder}
        value={text}
        maxLength={120}
        onChange={(e) => { onText(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => { if (a >= items.length - 1 && shown < all.length) { setShown((s) => s + PAGE); return a + 1; } return Math.min(items.length - 1, a + 1); }); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
          else if (e.key === "Enter" && showList && active >= 0) { e.preventDefault(); pick(active); }
          else if (e.key === "Escape") { setOpen(false); setActive(-1); }
        }}
      />
      {loading && <Loader2 className="geo-spin size-4 animate-spin" aria-hidden="true" />}
    </div>
    </PopoverAnchor>
    <PopoverContent
      side="bottom"
      align="start"
      sideOffset={6}
      collisionPadding={12}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
      onInteractOutside={(e) => { if (anchorRef.current?.contains(e.target as Node)) e.preventDefault(); }}
      onMouseDown={(e) => e.preventDefault()}
      className="geo-pop"
    >
        <ul ref={listRef} id={listId} role="listbox" aria-label={label} className="geo-list">
          {items.map((it, i) => <li key={getKey(it)} id={`${uid}-o${i}`} role="option" aria-selected={i === active}
            className={cn("geo-opt", i === active && "is-on")} onMouseDown={(e) => { e.preventDefault(); pick(i); }}>
            {renderItem(it)}
          </li>)}
        </ul>
        {all.length > PAGE && <div className="geo-more" role="status" aria-live="polite">
          <span>Mostrando {items.length} de {total.toLocaleString("es-MX")} {noun}</span>
          {shown < all.length && <button type="button" className="geo-more-btn" tabIndex={-1}
            onMouseDown={(e) => { e.preventDefault(); setShown((s) => s + PAGE); }}>{moreLabel}</button>}
        </div>}
        {!loading && items.length === 0 && <p className="geo-empty" role="status">{failed ? "No pudimos cargar el catálogo. Puedes escribirlo manualmente." : `Sin coincidencias. ${manualHint ?? "Se conservará lo que escribiste."}`}</p>}
        {loading && items.length === 0 && <p className="geo-empty" role="status">Buscando…</p>}
        {footer && <p className="geo-foot">{footer}</p>}
    </PopoverContent>
    </Popover>
  </div>;
}
