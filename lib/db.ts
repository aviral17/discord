import { PrismaClient } from "@prisma/client";

// Change DB to postgresql instead of mysql

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient(); // adding globalThis.prisma, everytime we hot reload our app, it will not create new prismaclinet() again, its only for development

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
