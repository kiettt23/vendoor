import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Configure Neon for WebSocket
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true;

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });

// Singleton pattern để tránh tạo nhiều Prisma instances
// Type: Thêm prisma vào global object
const globalForPrisma = global as typeof globalThis & {
  prisma?: PrismaClient;
};

// Fix: Tạo 2 instances riêng biệt thay vì conditional
const prisma =
  globalForPrisma.prisma ||
  (process.env.NEXT_RUNTIME === "edge" 
    ? new PrismaClient({ adapter })
    : new PrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
