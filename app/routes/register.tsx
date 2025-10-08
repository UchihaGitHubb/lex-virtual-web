import type { Route } from "./+types/register";
import Register from "../pages/Register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crear cuenta - Lex Virtual" },
    { name: "description", content: "Crea tu cuenta en Lex Virtual" },
  ];
}

export default function RegisterRoute() {
  return <Register />;
}

