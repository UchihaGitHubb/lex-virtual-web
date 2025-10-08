import type { Route } from "./+types/dashboard";
import Dashboard from "../pages/Dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Lex Virtual" },
    { name: "description", content: "Panel de control de usuario" },
  ];
}

export default function DashboardRoute() {
  return <Dashboard />;
}

