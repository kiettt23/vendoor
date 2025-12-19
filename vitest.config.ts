import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Môi trường test cho React components
    environment: "jsdom",

    // Setup files chạy trước mỗi test file
    setupFiles: ["./tests/setup.ts"],

    // Pattern để tìm test files
    // - Unit tests: trong __tests__/ folders (co-located)
    // - Integration tests: trong tests/integration/
    include: [
      "src/**/__tests__/**/*.test.{ts,tsx}",
      "tests/integration/**/*.test.ts",
    ],

    // Bỏ qua folders không cần test
    exclude: ["node_modules", "tests/e2e/**"],

    // Coverage config
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/app/**", // Pages được cover bởi E2E
        "src/**/ui/**", // shadcn components
      ],
    },

    // Globals để không cần import expect, describe, it
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
