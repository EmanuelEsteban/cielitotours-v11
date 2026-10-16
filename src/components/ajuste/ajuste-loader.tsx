import { lazy, Suspense, useEffect, useState } from "react";

/**
 * Panel de ajuste temporal: solo se descarga y aparece con ?ajustar=1.
 * Para registrar otra foto basta con poner data-ajustable="Nombre legible" en el
 * wrapper propio de la foto (separado de animaciones) que use en su CSS:
 * transform: translate(var(--foto-x), var(--foto-y)) scale(var(--foto-escala)).
 * Sus valores iniciales se toman de su CSS (variables y transform-origin).
 */
const AjustePanel = lazy(() => import("./ajuste-panel"));

export function AjusteLoader() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(new URLSearchParams(window.location.search).get("ajustar") === "1");
  }, []);
  if (!on) return null;
  return (
    <Suspense fallback={null}>
      <AjustePanel />
    </Suspense>
  );
}
