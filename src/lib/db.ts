import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

function getPrismaInstance(): any {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  let instance: any = null;
  try {
    instance = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (err: any) {
    console.warn("PrismaClient constructor unconfigured or requires driver adapter:", err.message);
    instance = null;
  }

  if (process.env.NODE_ENV !== "production" && instance) {
    globalForPrisma.prisma = instance;
  }

  return instance;
}

// Proxy wrapper prevents top-level module evaluation errors on import
export const prisma: any = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getPrismaInstance();
      if (!client) {
        return new Proxy(() => {}, {
          get() {
            return () => {
              throw new Error("Database not configured or Prisma driver adapter missing.");
            };
          },
          apply() {
            throw new Error("Database not configured or Prisma driver adapter missing.");
          },
        });
      }
      const val = client[prop];
      if (typeof val === "function") {
        return val.bind(client);
      }
      return val;
    },
  }
);
