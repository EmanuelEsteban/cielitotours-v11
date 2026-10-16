import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/viajes")({
  component: ViajesLayout,
});

function ViajesLayout() {
  return <Outlet />;
}
