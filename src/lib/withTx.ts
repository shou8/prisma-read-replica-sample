import {
  PrismaTxClient,
  PrismaRwClient,
  PrismaRoClient,
} from "@/lib/PrismaClient";
import { prisma } from "@//lib/prisma";
import { DaoRoContext, DaoRwContext, DaoTxContext } from "@/lib/DaoContext";

export const withConn = <T>(ctx: T): T & DaoRwContext => ({
  ...ctx,
  client: prisma.$primary() as PrismaRwClient,
});

export const withReplica = <T>(ctx: T): T & DaoRoContext => ({
  ...ctx,
  client: prisma.$replica() as PrismaRoClient,
});

type PrismaTxOption = Parameters<typeof prisma.$transaction>[1];

export const withTx = async <T, U>(ctx: T, f: (ctx: T & DaoTxContext) => Promise<U>, option?: PrismaTxOption): Promise<U> =>
  prisma.$transaction(async (tx) => {
    const client = tx as PrismaTxClient;
    return await f({ ...ctx, client });
  }, option);
