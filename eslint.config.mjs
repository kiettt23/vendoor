import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Playwright generated files (ignore to avoid lint errors on bundled code)
    "playwright-report/**",
    "tests/e2e/results/**",
    "test-results/**",
  ]),

  // ===========================================
  // GLOBAL RULES - Áp dụng cho tất cả src files
  // ===========================================
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: ["src/shared/lib/utils/logger.ts"],
    rules: {
      // --- Code Quality ---
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      eqeqeq: ["error", "always"],

      // --- TypeScript ---
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
  },

  // Logger is allowed to use console.log
  {
    files: ["src/shared/lib/utils/logger.ts"],
    rules: {
      "no-console": "off",
    },
  },

  // ===========================================
  // FSD LAYER: shared (lowest layer)
  // Không được import từ entities, features, widgets
  // ===========================================
  {
    files: ["src/shared/**/*.ts", "src/shared/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/entities", "@/entities/**"],
              message: "❌ shared/ không được import từ entities/",
            },
            {
              group: ["@/features", "@/features/**"],
              message: "❌ shared/ không được import từ features/",
            },
            {
              group: ["@/widgets", "@/widgets/**"],
              message: "❌ shared/ không được import từ widgets/",
            },
          ],
        },
      ],
    },
  },

  // ===========================================
  // FSD LAYER: entities
  // Không được import từ features, widgets
  // ===========================================
  {
    files: ["src/entities/**/*.ts", "src/entities/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features", "@/features/**"],
              message: "❌ entities/ không được import từ features/",
            },
            {
              group: ["@/widgets", "@/widgets/**"],
              message: "❌ entities/ không được import từ widgets/",
            },
          ],
        },
      ],
    },
  },

  // ===========================================
  // FSD LAYER: features
  // Không được import từ widgets
  // ===========================================
  {
    files: ["src/features/**/*.ts", "src/features/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/widgets", "@/widgets/**"],
              message: "❌ features/ không được import từ widgets/",
            },
          ],
        },
      ],
    },
  },

  // ===========================================
  // TEST FILES - Relax some rules
  // ===========================================
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
]);

export default eslintConfig;
