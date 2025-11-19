import type { Route } from "./+types/tracking-student";
import TrackingStudent from "../pages/TrackingStudent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detalles del Estudiante - Lex Virtual" },
    { name: "description", content: "Detalles del desempeño del estudiante" },
  ];
}

export default function TrackingStudentRoute({ params }: Route.ComponentProps) {
  return <TrackingStudent studentId={params.studentId} />;
}

