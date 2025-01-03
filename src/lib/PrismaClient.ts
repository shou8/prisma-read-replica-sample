import { ReadOnlyClient } from "@/lib/type";
import { Prisma } from "@prisma/client";

const prismaRoClientSymbol = Symbol("prisma_ro_client");

const prismaRwClientSymbol = Symbol("prisma_rw_client");

const prismaTxClientSymbol = Symbol("prisma_tx_client");

export type PrismaRoClient = ReadOnlyClient & { [prismaRoClientSymbol]: never };

export type PrismaRwClient = Prisma.TransactionClient & { [prismaRoClientSymbol]: never; [prismaRwClientSymbol]: never };

export type PrismaTxClient = PrismaRwClient & { [prismaTxClientSymbol]: never };
