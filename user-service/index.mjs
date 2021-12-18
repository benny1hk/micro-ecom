import Queue from "../core/queue.js";
import * as database from "../core/database.js";
import User from "./User.js";
import seed from "./seeder.js";

const main = async () => {
  await database.connect();
  const queue = new Queue({ mainQueue: Queue.USER_QUEUE });
  let count = await User.countDocuments();
  console.log(`There are ${count} of users in database`);
  if (!count) {
    console.log("Seeding");
    await seed();
    count = await User.countDocuments();
    console.log(`There are ${count} of users in database`);
  }
  await queue.connect();
};
main();
