<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Destination pages (/viajes/$slug) are themed via src/lib/destination-themes.ts (content/labels/moment/decorations) + `.theme-<id>` CSS vars in styles.css; new destinations add data only. Why: one template, many looks, Riviera stays stable.
- Home motion lives in src/components/motion (Reveal, TitleLines, ScrollRoute, TiltCard, ScrollProgress, SmoothScroll) with `ruta-` CSS; hidden start states only apply under html.ruta-js (added on mount) so content is visible without JS. Why: shared by Home phases, SSR-safe.
- Home section backgrounds use the reusable AtlasBg component (.atlas-bg layers) and Home headings use home-* typography classes in styles.css. Why: shared by later Home phases without touching other pages.
- Home night sections use the reusable AtlasNight component (.atlas-night layers, one shared bottom mask fading into var(--ink)); handwritten accents use .home-hand (Caveat, ≥28px only). Why: later Home phases reuse the same night backdrop and accent without new fonts.
- Home "Viajes destacados" reads cards from src/lib/travel-ideas.ts by slug; its plane flight is time-based (own SVG measured from stamp centers, no parallax on cards/stamps) and the "KICKER, accent" composition is the shared HandKicker. Why: no duplicated copy, route measures stable targets, pases and Viajes share one kicker.
- Home "Viajes destacados" sky (AtardecerBand) is an absolute background at the top of the night block (height --hsky, heading padded to 55 %); its photo/bridge/tone layers use their own specified masks and end on the measured neighbour colours. Why: heading is born in the sky, no separate band or seams.
- Home "Destinos" explorer reads src/lib/home-destinations.ts (typed local editorial data, separate from travel-ideas packages); quote links pass context as /cotizar query params. Why: inspiration ≠ commercial packages, ready to migrate to a table later.
- Home "Viajes en grupo" globe is a true orthographic projection of src/lib/world-land-110m.ts (Natural Earth 110m via world-atlas, generated), updated by setAttribute in rAF only while in view; no geo deps. Why: real geography, no React re-renders.
- Geo autocomplete (src/lib/geo, src/components/geo) loads static catalogs from public/data/geo lazily via fetch; rebuild with scripts/build-geo-catalogs.py. Why: world coverage without bloating the bundle or adding DB tables.
- Global navigation finishes are scoped to `.site-header` tokens and `header-*` selectors; desktop visibility uses explicit React state with separate links/disclosures, and HeaderDropdown owns one shared hover/focus marker. Why: isolate header styling and preserve pointer, touch and keyboard navigation without duplicated row indicators.
- Global footer finishes use `.site-footer` scoped tokens and `footer-*` selectors; its composition preserves the original brand track and groups equal-width navigation columns independently, with noninteractive edge cartography and an SVG transition contained inside the footer. Why: isolate refinements while preserving logo geometry and preceding page sections.
- FAQ uses its own route composition inside SiteShell, scoped `.faq-artisan` tokens/selectors, reference-derived decorative bitmap textures with live text/SVG overlays and the shared accessible Accordion. Why: preserve accessible content and reference fidelity without changing shared navigation or other SimplePage consumers.
