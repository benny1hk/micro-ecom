import Queue from "../core/queue.js";
import * as database from "../core/database.js";
import Order from "./Order.js";
// import seed from "./seeder.js";

const main = async () => {
  await database.connect();
  const queue = new Queue({ mainQueue: Queue.ORDER_QUEUE });
  let count = await Order.countDocuments();
  console.log(`There are ${count} of orders in database`);
  // if (!count) {
  //   console.log("Seeding");
  //   await seed();
  //   count = await Order.countDocuments();
  //   console.log(`There are ${count} of orders in database`);
  // }
  await queue.connect({});

  queue.consume(async (data) => {
    // console.log("Order", data);
    try {
      const { event, payload } = data;
      if (event === "createorder") {
        const { items, name } = payload;

        const order = await Order.create({ name: name, items: items });

        await queue.send(
          {
            event: "reserve",
            payload: { items: items, order_id: order._id },
            success: {
              queue: Queue.ORDER_QUEUE,
              event: "reserve/success",
            },
            failed: {
              queue: Queue.ORDER_QUEUE,
              event: "reserve/failed",
            },
          },
          Queue.PRODUCT_QUEUE
        );
      } else if (event === "reserve/success") {
        const { order_id } = payload;
        let order = await Order.findById(order_id);
        order = await order.reserved();
        console.log("order reserved", order._id, order.status);
      } else if (event === "reserve/failed") {
        const { order_id } = payload;
        let order = await Order.findById(order_id);
        order = await order.failed();
        console.log("order failed", order._id, order.status);
      } else {
        throw new Error("Unknown Event");
      }
      // await queue.send(
      //   { event: data.success.event, payload: { hello: "good" } },
      //   data.success.queue
      // );
    } catch (error) {
      console.error(error);
      // await queue.send(
      //   { event: data.failed.event, payload: { hello: "bad" } },
      //   data.failed.queue
      // );
    }
  });
};
main();
