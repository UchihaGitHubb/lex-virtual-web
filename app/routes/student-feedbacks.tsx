import type { MetaFunction } from "@react-router/node";
import StudentFeedbacks from "../pages/StudentFeedbacks";

export const meta: MetaFunction = () => {
  return [
    { title: "Mis Retroalimentaciones - Lex Virtual" },
    { name: "description", content: "Retroalimentaciones de tu profesor sobre tus casos" },
  ];
};

export default function StudentFeedbacksRoute() {
  return <StudentFeedbacks />;
}

