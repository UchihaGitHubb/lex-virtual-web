import type { Config } from "@react-router/dev/config";

export default {
  // Server-side render by default, to enable SPA mode set this to `false`.
  // In Vercel the app is published as a static SPA (see vercel.json).
  ssr: !process.env.VERCEL,
} satisfies Config;
