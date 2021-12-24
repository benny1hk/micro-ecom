import Queue from "../core/queue.js";
const main = async () => {
  const queue = new Queue({ mainQueue: Queue.ORDER_CREATE });
  await queue.connect({});

  let i = 5000;

  let completed = 0;
  let rejected = 0;

  queue.consume(async (data) => {
    completed++;
    console.log(`Order Total: ${i} ${completed} ${rejected}`);
    if (completed + rejected === i) {
      console.log("Done");
      console.timeEnd("1000Call");
    }
  }, Queue.ORDER_COMPLETED);

  queue.consume(async (data) => {
    rejected++;
    console.log(`Order Total: ${i} ${completed} ${rejected}`);
    if (completed + rejected === i) {
      console.log("Done");
      console.timeEnd("1000Call");
    }
  }, Queue.ORDER_REJECTED);

  Array(i)
    .fill(0)
    .map((v, i) => {
      // const name = `CO-` + `${i + 1}`.padStart(7, "0");
      // console.log("Createing", name);
      queue.send({
        payload: {
          // name,
          items: [
            { product_id: "61bf3606c892f2b4fe7e002b", quantity: 1 },
            { product_id: "61bf3606c892f2b4fe7e002c", quantity: 1 },
          ],
        },
      });
    });

  console.time("1000Call");
};
main();
