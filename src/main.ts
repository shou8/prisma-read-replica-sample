import { withConn, withReplica, withTx } from "@/lib/withTx";
import { userDao } from "@/dao/userDao";

const main = async () => {
  const rwCtx = withConn({});
  const roCtx = withReplica({});

  await userDao.findById(roCtx, "1");
  await userDao.findById(rwCtx, "1") // 可能
  await withTx({}, async (txCtx) => userDao.findById(txCtx, "1")); // 可能

  const user = { id: "1", name: "Alice" };

  //await userDao.create(roCtx, user); // 型エラー
  await userDao.create(rwCtx, user); // 可能
  await withTx({}, async (txCtx) => userDao.create(txCtx, user)); // 可能

  //await userDao.update(roCtx, user); // 型エラー
  //await userDao.update(rwCtx, user); // 型エラー
  await withTx({}, async (txCtx) => userDao.update(txCtx, user)); // 可能
}

main();
