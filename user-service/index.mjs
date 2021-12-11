import Queue from "../core/queue.js";
import * as database from "../core/database.js";

const main = async () => {
  await database.connect();
  const queue = new Queue({ mainQueue: Queue.USER_QUEUE });
  await queue.connect();
};
main();
