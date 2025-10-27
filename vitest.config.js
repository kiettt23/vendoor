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

      // Coverage thresholds - Enforce minimum coverage cho services layer
      thresholds: {
        // Global thresholds (toàn project)
        lines: 15, // 15% minimum (hiện tại: 19%)
        functions: 14, // 14% minimum (hiện tại: 17%)
        branches: 15, // 15% minimum (hiện tại: 21%)
        statements: 15, // 15% minimum (hiện tại: 19%)

        // Per-file thresholds cho services layer
        "lib/services/*.js": {
          lines: 70, // Services phải có 70%+ coverage
          functions: 70,
          branches: 65,
          statements: 70,
        },
      },
    },
  },

  // Path aliases (giống Next.js)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
