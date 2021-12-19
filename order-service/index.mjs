import Queue from "../core/queue.js";
import * as database from "../core/database.js";
import Order from "./Order.js";
// import seed from "./seeder.js";

const main = async () => {
  await database.connect();
  const queue = new Queue({ mainQueue: Queue.ORDER_CREATE });
  let count = await Order.countDocuments();
  console.log(`There are ${count} of orders in database`);
  if (count) {
    console.log("Removing");
    await Order.remove({});
    count = await Order.countDocuments();
    console.log(`There are ${count} of orders in database`);
  }
  await queue.connect({});

  queue.consume(async (data) => {
    const {
      payload: { items, name },
    } = data;

    const order = await Order.create({ name: name, items: items });
    await queue.send(
      {
        payload: { items: items, order_id: order._id },
      },
      Queue.PRODUCT_RESERVE
    );
  });

  queue.consume(async (data) => {
    const {
      payload: { order_id },
    } = data;
    let order = await Order.findById(order_id);
    order = await order.reserved();
    console.log("order reserved", order._id, order.status);

    await queue.send(
      {
        payload: { name: order.name },
      },
      Queue.ORDER_COMPLETED
    );
  }, Queue.PRODUCT_RESERVE_SUCCESS);

  queue.consume(async (data) => {
    const {
      payload: { order_id },
    } = data;
    let order = await Order.findById(order_id);
    order = await order.failed();
    console.log("order failed", order._id, order.status);
    await queue.send(
      {
        payload: { name: order.name },
      },
      Queue.ORDER_REJECTED
    );
  }, Queue.PRODUCT_RESERVE_FAILED);
};
main();
