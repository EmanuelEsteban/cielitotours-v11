# Catálogos geográficos (autocompletado)

Archivos estáticos servidos desde `public/data/geo/` y cargados solo al enfocar un campo (no van en el bundle).

- `airports.v1.json` — OurAirports (dominio público). Filas: `[iata, icao, name, city, country, region, scheduled(0|1), rank(0 large,1 medium,2 small), keywords]`.
  Filtro: IATA válido de 3 letras; grandes y medianos; pequeños solo con `scheduled_service=yes`. ICAO solo desde `icao_code` (nunca `ident`).
- `cities.v1.json` — GeoNames cities15000 (CC BY 4.0, atribución obligatoria). Filas: `[geonameid, name, country, admin1, population, altNames]` (≤5 nombres alternativos en alfabeto latino).

Actualizar:
1. Descargar `https://davidmegginson.github.io/ourairports-data/airports.csv`, `https://download.geonames.org/export/dump/cities15000.zip` (descomprimir) y `admin1CodesASCII.txt` en una carpeta temporal.
2. Ejecutar `python3 scripts/build-geo-catalogs.py` dentro de esa carpeta.
3. Copiar `airports.json` y `cities.json` a `public/data/geo/` con un nuevo sufijo de versión y actualizar las URL en `search.ts`.
