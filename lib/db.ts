import { PrismaClient } from "@prisma/client";

// everytime we make some changes, hardreload happens.
// everytime creating new prisma clients, so caching in globalThis
// global variable is not effected by hard reload
declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;