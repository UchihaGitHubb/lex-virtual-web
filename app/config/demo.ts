// Modo demo: la app funciona sin backend, con los datos de ejemplo de app/data/mockData.ts.
// Se activa con la variable de entorno VITE_DEMO_MODE=true (por ejemplo, en Vercel).
import {
  getMockFeedback,
  getMockNerviosismChart,
  getMockPerformanceMetrics,
  getMockStudentDetails,
  mockStudentCases,
  mockStudentFeedbacks,
  mockStudentProfile,
  mockStudents,
  mockStudentStats,
} from "../data/mockData";
import type { LoginResponseDto } from "../types/auth";

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export type DemoRole = "teacher" | "student";

const demoUsers: Record<DemoRole, LoginResponseDto["user"]> = {
  teacher: {
    id: "demo-teacher",
    email: "docente@demo.lexvirtual",
    role: "teacher",
    roleConfirmed: true,
  },
  student: {
    id: "student-001",
    email: "estudiante@demo.lexvirtual",
    role: "student",
    roleConfirmed: true,
  },
};

/** Inicia sesión con un usuario de demostración. */
export function startDemoSession(role: DemoRole) {
  localStorage.setItem("access_token", `demo-token-${role}`);
  localStorage.setItem("user", JSON.stringify(demoUsers[role]));
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Responde como lo haría el backend, usando los datos de ejemplo. */
export async function demoResponse<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  await wait(250);

  const method = (options?.method ?? "GET").toUpperCase();
  const path = endpoint.split("?")[0];
  let match: RegExpMatchArray | null;

  if (method === "POST" && (path === "/auth/login" || path === "/auth/register")) {
    return { message: "Sesión de demostración", accessToken: "demo-token-teacher", user: demoUsers.teacher } as T;
  }

  if (path === "/users/role/confirm") {
    const user = JSON.parse(localStorage.getItem("user") ?? "null") ?? demoUsers.teacher;
    return { message: "Rol confirmado", user: { ...user, roleConfirmed: true } } as T;
  }

  if (path === "/tracking/students") return mockStudents as T;

  if ((match = path.match(/^\/tracking\/students\/([^/]+)$/))) {
    return getMockStudentDetails(match[1]) as T;
  }

  if ((match = path.match(/^\/tracking\/cases\/([^/]+)\/performance$/))) {
    return getMockPerformanceMetrics(match[1]) as T;
  }

  if ((match = path.match(/^\/tracking\/cases\/([^/]+)\/nerviosism-chart$/))) {
    return getMockNerviosismChart(match[1]) as T;
  }

  if ((match = path.match(/^\/tracking\/cases\/([^/]+)\/feedback$/))) {
    return getMockFeedback(match[1]) as T;
  }

  if (method === "POST" && path.startsWith("/tracking/feedback/")) {
    return { message: "Retroalimentación guardada (demo)" } as T;
  }

  if (path === "/tracking/my-feedbacks") return mockStudentFeedbacks as T;
  if (path === "/students/my-profile") return mockStudentProfile as T;
  if (path === "/students/my-cases") return mockStudentCases as T;
  if (path === "/students/my-stats") return mockStudentStats as T;

  if (path.startsWith("/upload/")) return { url: "" } as T;

  throw new Error(`Modo demo: no hay datos de ejemplo para ${method} ${path}`);
}
