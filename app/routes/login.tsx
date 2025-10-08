import type { Route } from "./+types/login";
import Login from "../pages/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Iniciar sesión - Lex Virtual" },
    { name: "description", content: "Inicia sesión en tu cuenta de Lex Virtual" },
  ];
}

export default function LoginRoute() {
  return <Login />;
}

