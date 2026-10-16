import { useCallback } from "react";
import { MapPin } from "lucide-react";
import { GeoCombobox } from "./geo-combobox";
import { searchCities } from "@/lib/geo/search";
import type { City, CityValue } from "@/lib/geo/types";

export const cityText = (v: CityValue) => (!v ? "" : v.kind === "manual" ? v.text : `${v.name}, ${v.region ? v.region + ", " : ""}${v.country}`);

type Props = { label: string; placeholder?: string; value: CityValue; onChange: (v: CityValue) => void };

export function CityAutocomplete({ label, placeholder, value, onChange }: Props) {
  const search = useCallback((q: string) => searchCities(q), []);
  return <GeoCombobox<City>
    label={label}
    placeholder={placeholder ?? "Ciudad o destino"}
    text={cityText(value)}
    onText={(t) => onChange(t ? { kind: "manual", text: t } : null)}
    search={search}
    moreLabel="Ver más ciudades"
    noun="ciudades"
    onPick={onChange}
    getKey={(c) => String(c.id)}
    manualHint="Puedes dejarlo escrito como destino libre."
    footer="Datos: GeoNames (CC BY 4.0)."
    renderItem={(c) => <div className="geo-row">
      <MapPin className="size-4 shrink-0 opacity-60" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="geo-main">{c.name}</p>
        <p className="geo-sub">{c.region ? `${c.region} · ` : ""}{c.country}</p>
      </div>
    </div>}
  />;
}
