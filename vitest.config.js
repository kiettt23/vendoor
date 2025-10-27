import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest Configuration
 *
 * Giải thích:
 * - plugins: Sử dụng React plugin để test React components
 * - test.include: Chỉ scan files trong __tests__/ folders
 * - test.environment: 'jsdom' để simulate browser environment
 * - coverage: Config code coverage reporting
 */
export default defineConfig({
  plugins: [react()],

  test: {
    // Pattern để tìm test files
    // Chỉ scan files trong __tests__/ folders với extension .test.js hoặc .test.jsx
    include: ["**/__tests__/**/*.test.{js,jsx}"],

    // Exclude folders không cần test
    exclude: [
      "e2e/**", // E2E tests (Cypress)
      "node_modules/**", // Dependencies
      ".next/**", // Next.js build
      "dist/**", // Build output
    ],

    // Environment: jsdom = fake browser trong Node.js
    // Cần thiết để test React components (có DOM, window, document, etc.)
    environment: "jsdom",

    // Setup file - chạy trước mỗi test suite
    setupFiles: ["./vitest.setup.js"],

    // Global test utilities (không cần import)
    globals: true,

    // Code Coverage configuration
    coverage: {
      provider: "v8", // Coverage provider (v8 nhanh hơn istanbul)

      // Files cần measure coverage
      include: [
        "lib/**/*.{js,jsx}", // Business logic
        "app/api/**/*.{js,jsx}", // API routes
        "components/**/*.{js,jsx}", // React components
      ],

      // Files không cần coverage
      exclude: [
        "**/__tests__/**", // Test files
        "**/node_modules/**",
        "**/.next/**",
        "**/e2e/**",
        "**/dist/**",
        "**/*.config.{js,ts}", // Config files
        "**/constants/**", // Constants
      ],

      // Coverage reporters
      reporter: ["text", "json", "html"], // text = console, html = browser report

      // Coverage thresholds (optional)
      // Uncomment để enforce minimum coverage
      // thresholds: {
      //   lines: 80,      // 80% lines covered
      //   functions: 80,  // 80% functions covered
      //   branches: 80,   // 80% branches covered
      //   statements: 80, // 80% statements covered
      // },
    },
  },

  // Path aliases (giống Next.js)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
