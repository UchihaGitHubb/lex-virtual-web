import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("tracking", "routes/tracking.tsx"),
  route("tracking/student/:studentId", "routes/tracking-student.tsx"),
  route("my-feedbacks", "routes/student-feedbacks.tsx"),
] satisfies RouteConfig;
