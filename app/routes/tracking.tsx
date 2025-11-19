import type { Route } from "./+types/tracking";
import Tracking from "../pages/Tracking";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Panel de Seguimiento - Lex Virtual" },
    { name: "description", content: "Panel de seguimiento de estudiantes" },
  ];
}

export default function TrackingRoute() {
  return <Tracking />;
}

