import * as queue from "../core/queue.js";
const { USER_QUEUE, PRODUCT_QUEUE, ORDER_QUEUE } = queue;
const main = async () => {
  await queue.connect();
  await queue.send(USER_QUEUE, { isObject: "Also okay?" });
};
main();
