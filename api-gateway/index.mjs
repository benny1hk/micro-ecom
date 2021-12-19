import Queue from "../core/queue.js";
const main = async () => {
  const queue = new Queue({ mainQueue: Queue.ORDER_CREATE });
  await queue.connect({});

  queue.consume(async (data) => {
    console.log("return on gateway", data);
  });

  let i = 1000;

  Array(i)
    .fill(0)
    .map((v, i) => {
      queue.send({
        payload: {
          name: `CO-${i + 1}`,
          items: [
            { product_id: "61bcfc93138fc9fd86e700af", quantity: 1 },
            { product_id: "61bcfc93138fc9fd86e700ae", quantity: 1 },
          ],
        },
      });
    });
};
main();
