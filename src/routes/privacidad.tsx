import { createFileRoute, redirect } from "@tanstack/react-router";
// PRIVACIDAD-01 — the integral notice lives at /aviso-de-privacidad; old links keep working.
export const Route = createFileRoute("/privacidad")({
  beforeLoad: () => { throw redirect({ to: "/aviso-de-privacidad", statusCode: 301 }); },
});
