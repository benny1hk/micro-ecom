import * as queue from "../core/queue.js";
const { USER_QUEUE, PRODUCT_QUEUE, ORDER_QUEUE } = queue;
import * as database from "../core/database.js";
import User from "./User.js";

const main = async () => {
  await database.connect();

  // setInterval(async function () {
  //   console.log("hello");
  //   let user = await User.findOne();
  //   console.log("world");
  //   await new Promise((resolve) => setTimeout(resolve, 8000));
  //   user.haha += 1;
  //   await user.save();
  //   console.log("Updated");
  // }, 10000);

  // await queue.connect();

  // await queue.consume(USER_QUEUE, async (content) => {
  //   console.log("haha", content);
  // });
};
main();
