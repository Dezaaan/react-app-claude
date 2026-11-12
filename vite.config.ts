import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // The backend only accepts requests from this exact origin
      // (CLIENT_ORIGIN), so fail instead of silently moving to 5174.
      port: 5173,
      strictPort: true,
      proxy: {
        // Same origin for the browser: no CORS, and the refresh-token cookie
        // (SameSite=Strict, path /api/v1/auth) just works.
        "/api": env.VITE_API_PROXY_TARGET || "http://localhost:3000",
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: {
        // Readable class names in tests, e.g. "_open_1a2b" -> "open".
        modules: { classNameStrategy: "non-scoped" },
      },
    },
  };
});
