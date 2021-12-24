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
    await Order.deleteMany({});
    count = await Order.countDocuments();
    console.log(`There are ${count} of orders in database`);
  }
  await queue.connect({});

  // ORDER_CREATE
  queue.consume(async (data) => {
    const {
      payload: { items, name },
    } = data;

    const order = await Order.create({ name: name, items: items });

    await queue.send(
      {
        payload: { items: items, order_id: order._id, orderNo: order.orderNo },
      },
      Queue.PRODUCT_RESERVE
    );
    console.log("Order Init", order._id);
  });

  // PRODUCT_RESERVE_SUCCESS
  queue.consume(async (data) => {
    const {
      payload: { order_id },
    } = data;
    try {
      await Order.reserved(order_id);
      console.log("order reserved", order_id);
      await queue.send(
        {
          payload: { order_id: order_id },
        },
        Queue.ORDER_COMPLETED
      );
    } catch (error) {
      console.error(error);
    }
  }, Queue.PRODUCT_RESERVE_SUCCESS);

  // PRODUCT_RESERVE_FAILED
  queue.consume(async (data) => {
    const {
      payload: { order_id },
    } = data;

    try {
      await Order.failed(order_id);
      console.log("order failed", order_id);
      await queue.send(
        {
          payload: { order_id: order_id },
        },
        Queue.ORDER_REJECTED
      );
    } catch (error) {
      console.error(error);
    }
  }, Queue.PRODUCT_RESERVE_FAILED);
};
main();
