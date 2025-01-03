import { DaoRoContext, DaoRwContext, DaoTxContext } from "@/lib/DaoContext";
import { User } from "@/model/user";

const findById = async (ctx: DaoRoContext, id: string) => {
  return await ctx.client.user.findUnique({ where: { id } });
}

const create = async (ctx: DaoRwContext, user: User) => {
  return await ctx.client.user.createMany({ data: user });
}

const update = async (ctx: DaoTxContext, { id, ...data }: User) => {
  return await ctx.client.user.update({ where: { id }, data });
}

export const userDao = {
  findById,
  create,
  update,
}