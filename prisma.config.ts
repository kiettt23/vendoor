/**
 * Prisma Configuration File
 *
 * Cấu hình Prisma CLI cho migrations, seeding, và datasource.
 * File này được yêu cầu từ Prisma ORM v7.
 *
 * @see https://pris.ly/d/config-datasource
 */

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Schema location
  schema: "prisma/schema.prisma",

  // Migrations configuration
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  // Database connection
  datasource: {
    url: env("DATABASE_URL"),
  },
});
