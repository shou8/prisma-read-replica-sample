import { ReadOnlyClient } from "@/lib/type";
import { Prisma } from "@prisma/client";

export type PrismaRoClient = ReadOnlyClient & { __prisma_ro_client: never };

export type PrismaRwClient = Prisma.TransactionClient & { __prisma_ro_client: never; __prisma_rw_client: never };

export type PrismaTxClient = PrismaRwClient & { __prisma_tx_client: never };
