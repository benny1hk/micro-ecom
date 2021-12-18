import Queue from "../core/queue.js";
import * as database from "../core/database.js";
import Product from "./Product.js";
import seed from "./seeder.js";
import delay from "delay";

const main = async () => {
  await database.connect();
  const queue = new Queue({ mainQueue: Queue.PRODUCT_QUEUE });
  let count = await Product.countDocuments();
  console.log(`There are ${count} of products in database`);
  if (!count) {
    console.log("Seeding");
    await seed();
    count = await Product.countDocuments();
    console.log(`There are ${count} of products in database`);
  }
  await queue.connect({ oneByOne: true });

  queue.consume(async (data) => {
    // console.log("Product", data);
    // await delay(500);
    try {
      const { event, payload } = data;
      if (event === "reserve") {
        const { items, order_id } = payload;

        const session = await Product.startSession();
        let runSuccess = false;
        await session.withTransaction(async () => {
          try {
            for (const item of items) {
              let product = await Product.findById(item.product_id);
              product = await product.reserveItem(item.quantity);
            }
            runSuccess = true;
          } catch (error) {
            runSuccess = false;
            throw error;
          }
        });
        runSuccess = true;
        session.endSession();
        if (!runSuccess) {
          throw new Error("Some error");
        }
        await queue.send(
          { event: data.success.event, payload: { order_id } },
          data.success.queue
        );
      } else {
        throw new Error("Unknown Event");
      }
    } catch (error) {
      console.error(error);
      await queue.send(
        {
          event: data.failed.event,
          payload: { order_id: data.payload.order_id },
        },
        data.failed.queue
      );
    }
  });
};
main();
