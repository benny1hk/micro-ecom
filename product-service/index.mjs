import Queue from "../core/queue.js";
import * as database from "../core/database.js";
import Product from "./Product.js";
import seed from "./seeder.js";
import delay from "delay";

const main = async () => {
  await database.connect();
  const queue = new Queue({ mainQueue: Queue.PRODUCT_RESERVE });
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
    const {
      payload: { items, order_id },
    } = data;

    try {
      const session = await Product.startSession();
      let runSuccess = false;
      await session.withTransaction(async () => {
        try {
          for (const item of items) {
            // let product = await Product.findById(item.product_id).reserveItem(
            //   item.quantity
            // );
            // product = await product.reserveItem(item.quantity);
            await Product.reserveItem(item.product_id, item.quantity);
          }
          await queue.send(
            { payload: { order_id } },
            Queue.PRODUCT_RESERVE_SUCCESS
          );
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
    } catch (error) {
      console.error(error);
      await queue.send(
        {
          payload: { order_id },
        },
        Queue.PRODUCT_RESERVE_FAILED
      );
    }
  });
};
main();
