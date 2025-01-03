/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @see {@link https://github.com/prisma/extension-read-replicas/blob/main/src/extension.ts}
 */

import { ReplicaManager } from "@/ReplicationManager";
import { Prisma, PrismaClient } from "@prisma/client";

export type ReplicasOptions = { replicas: PrismaClient[] };

export const readReplicas = (options: ReplicasOptions) =>
  Prisma.defineExtension((client) => {
    if (options.replicas.length === 0) {
      throw new Error("At least one replica must be specified");
    }

    const replicaManager = new ReplicaManager(options);

    return client.$extends({
      client: {
        $primary<T extends object>(this: T): Omit<T, "$primary" | "$replica"> {
          const context = Prisma.getExtensionContext(this);
          // If we're in a transaction, the current client is connected to the
          // primary.
          if (!("$transaction" in context && typeof context.$transaction === "function")) {
            return context;
          }

          return client as unknown as Omit<T, "$primary" | "$replica">;
        },

        $replica<T extends object>(this: T): Omit<T, "$primary" | "$replica"> {
          const context = Prisma.getExtensionContext(this);
          // If we're in a transaction, the current client is connected to the
          // primary.
          if (!("$transaction" in context && typeof context.$transaction === "function")) {
            throw new Error("Cannot use $replica inside of a transaction");
          }

          return replicaManager.pickReplica() as unknown as Omit<T, "$primary" | "$replica">;
        },

        async $connect() {
          await Promise.all([(client as any).$connect(), replicaManager.connectAll()]);
        },

        async $disconnect() {
          await Promise.all([(client as any).$disconnect(), replicaManager.disconnectAll()]);
        },
      },
    });
  });
