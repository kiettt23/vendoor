import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  test: {
    include: ["**/__tests__/**/*.test.{js,jsx}"],

    exclude: ["e2e/**", "node_modules/**", ".next/**", "dist/**"],

    environment: "jsdom",

    setupFiles: ["./vitest.setup.js"],

    globals: true,

    coverage: {
      provider: "v8",

      include: [
        "src/lib/**/*.{js,jsx}",
        "app/api/**/*.{js,jsx}",
        "src/components/**/*.{js,jsx}",
      ],

      exclude: [
        "**/__tests__/**",
        "**/node_modules/**",
        "**/.next/**",
        "**/e2e/**",
        "**/dist/**",
        "**/*.config.{js,ts}",
        "**/constants/**",
      ],

      reporter: ["text", "json", "html"],

      thresholds: {
        lines: 15,
        functions: 14,
        branches: 15,
        statements: 15,

        "src/lib/services/*.js": {
          lines: 70,
          functions: 70,
          branches: 65,
          statements: 70,
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
