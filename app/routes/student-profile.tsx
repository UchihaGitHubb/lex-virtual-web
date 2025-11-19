import type { MetaFunction } from "@react-router/node";
import StudentProfile from "../pages/StudentProfile";

export const meta: MetaFunction = () => {
  return [
    { title: "Mi Perfil - Lex Virtual" },
    { name: "description", content: "Perfil del estudiante con progreso y estadísticas" },
  ];
};

export default function StudentProfileRoute() {
  return <StudentProfile />;
}

