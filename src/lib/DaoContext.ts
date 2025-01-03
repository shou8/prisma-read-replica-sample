import { PrismaRoClient, PrismaRwClient, PrismaTxClient } from "@/lib/PrismaClient";

export type DaoRoContext = {
  client: PrismaRoClient;
};

export type DaoRwContext = {
  client: PrismaRwClient;
};

export type DaoTxContext = {
  client: PrismaTxClient;
};
