import { PrismaClient } from "@prisma/client";
import { readReplicas } from "@/lib/replica";
import { ExtendedPrismaClient } from "@/lib/type";

export const prisma = new PrismaClient()
  .$extends(readReplicas({ replicas: [] })) as unknown as ExtendedPrismaClient;
