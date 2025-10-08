import type { Route } from "./+types/home";
import Home from "../pages/Home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bienvenido - Lex Virtual" },
    { name: "description", content: "Selecciona tu rol para iniciar sesión" },
  ];
}

export default function HomeRoute() {
  return <Home />;
}

