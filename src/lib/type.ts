import { Prisma, PrismaClient } from "@prisma/client";

type ToLowerFirstLetter<T extends string> = T extends `${infer F}${infer R}` ? `${Lowercase<F>}${R}` : never;

type ModelName = ToLowerFirstLetter<Prisma.ModelName>;

type WriteMethod = "create" | "update" | "upsert" | "delete" | "createMany" | "createManyAndReturn" | "updateMany" | "deleteMany";

export type ReadOnlyClient = {
  [K in keyof Prisma.TransactionClient]: K extends ModelName
    ? Omit<Prisma.TransactionClient[K], WriteMethod>
    : Prisma.TransactionClient[K];
};

type ClientExtension = {
  $primary: () => Prisma.TransactionClient;
  $replica: () => ReadOnlyClient;
};

type WithReplica<T> = T & ClientExtension;

/**
 * @name 拡張後のPrismaClient
 * @description prismaは拡張すると $on / $use が除外される
 */
export type ExtendedPrismaClient = WithReplica<Omit<PrismaClient, "$on" | "$use">>;
