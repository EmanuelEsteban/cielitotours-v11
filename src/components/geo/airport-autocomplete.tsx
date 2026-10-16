import { useCallback, useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { GeoCombobox } from "./geo-combobox";
import { matchCountry, searchAirports } from "@/lib/geo/search";
import type { Airport, AirportValue } from "@/lib/geo/types";

export const airportText = (v: AirportValue) => (!v ? "" : v.kind === "manual" ? v.text : `${v.city || v.name} (${v.iata})`);

type Props = { label: string; placeholder?: string; value: AirportValue; onChange: (v: AirportValue) => void };

export function AirportAutocomplete({ label, placeholder, value, onChange }: Props) {
  const search = useCallback((q: string) => searchAirports(q), []);
  // COTIZAR-FUNCIONAL-02 — free text is never a confirmed airport; a country name is flagged as such.
  const manual = value?.kind === "manual" ? value.text : "";
  const [isCountry, setIsCountry] = useState(false);
  useEffect(() => {
    let live = true;
    if (!manual) { setIsCountry(false); return; }
    matchCountry(manual).then((cc) => { if (live) setIsCountry(Boolean(cc)); }).catch(() => { if (live) setIsCountry(false); });
    return () => { live = false; };
  }, [manual]);
  return <div>
  <GeoCombobox<Airport>
    label={label}
    placeholder={placeholder ?? "Ciudad, aeropuerto o código"}
    text={airportText(value)}
    onText={(t) => onChange(t ? { kind: "manual", text: t } : null)}
    search={search}
    moreLabel="Ver más aeropuertos"
    noun="aeropuertos"
    onPick={onChange}
    getKey={(a) => a.iata + a.name}
    manualHint="Se conservará como texto libre."
    footer="Datos: OurAirports (dominio público). No indica disponibilidad de vuelos."
    renderItem={(a) => <div className="geo-row">
      <Plane className="size-4 shrink-0 opacity-60" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="geo-main">{a.city || a.name}<span className="geo-code">{a.iata}</span>{!a.scheduled && <span className="geo-tag">Sin servicio regular reportado</span>}</p>
        <p className="geo-sub">{a.name} · {a.country}{a.icao ? ` · ICAO ${a.icao}` : ""}</p>
      </div>
    </div>}
  />
  {manual.trim().length >= 2 && <p className="sg-hint sg-warn" role="status">{isCountry
    ? "Es un país, no un aeropuerto: elige una ciudad o aeropuerto de la lista."
    : "Pendiente de confirmar: te recomendamos elegir una sugerencia. Si tu aeropuerto no aparece, lo confirmaremos contigo."}</p>}
  </div>;
}
